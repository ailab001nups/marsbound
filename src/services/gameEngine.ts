// ==========================================
// MARSBOUND: CORE GAMEPLAY & SIMULATION ENGINE
// ==========================================

import {
  GameState,
  StrategyType,
  SolLogRecord,
  Achievement,
  Resources,
  SecondarySystems,
  FinalScoreReport,
  EarthMessage,
} from '../types/game';
import { INITIAL_CREW } from '../data/crew';
import { INITIAL_ACHIEVEMENTS } from '../data/achievements';
import {
  clamp,
  round,
  calculateDailyRadiation,
  calculateCrewHealthImpact,
  getRadioDelayMinutes,
} from '../utils/calculations';
import { processDelayedConsequences } from './consequenceEngine';
import { getEventForSol } from './eventEngine';
import { commitDecision } from './decisionEngine';

export const CAMPAIGN_TOTAL_SOLS = 30;

/**
 * Initializes a new Mars mission campaign with chosen strategic doctrine
 */
export function initializeGameState(strategy: StrategyType = 'SURVIVAL_FIRST'): GameState {
  const initialResources: Resources = {
    oxygen: 75,
    power: 80,
    food: 70,
    water: 70,
  };

  const initialSecondary: SecondarySystems = {
    radiationShielding: strategy === 'SUSTAINABILITY_FIRST' ? 52 : 65,
    crewHealth: 95,
    materials: strategy === 'SURVIVAL_FIRST' ? 55 : 40,
    sciencePoints: strategy === 'SCIENCE_FIRST' ? 25 : 0,
    cumulativeRadiation: 0.12,
  };

  const welcomeMessage: EarthMessage = {
    id: 'comm-welcome',
    sender: 'Houston Flight Director',
    topic: 'Welcome to Chryse Planitia Outpost',
    content:
      'Congratulations on touchdown, Commander. Chryse Outpost telemetry is nominal. You have 30 Sols to establish sustainable habitat operations. Remember: radio packets take ~4.2 minutes today. Autonomous decisions are yours.',
    sentSol: 1,
    deliverySol: 1,
    delayMinutes: 4.2,
    isDelivered: true,
  };

  return {
    currentSol: 1,
    campaignLength: CAMPAIGN_TOTAL_SOLS,
    stage: 1,
    strategy,
    gameStatus: 'playing',
    resources: initialResources,
    secondary: initialSecondary,
    crew: INITIAL_CREW,
    activeEvent: null, // Sol 1 has no active disaster
    selectedEventChoiceId: null,
    decisionsMadeThisSol: [],
    delayedQueue: [],
    history: [],
    commQueue: [welcomeMessage],
    achievements: INITIAL_ACHIEVEMENTS,
    dustAccumulation: 5, // 5% baseline dust
    solarStormActive: false,
    settings: {
      soundEnabled: true,
      readingMode: false,
      highContrast: false,
    },
    nasaLiveStatus: {
      connected: true,
      lastSyncSol: 1,
    },
  };
}

/**
 * Executes a full Sol day advancement cycle
 */
export function advanceSol(state: GameState): {
  updatedState: GameState;
  solLog: SolLogRecord;
  unlockedAchievements: Achievement[];
} {
  const prevSol = state.currentSol;
  const nextSol = prevSol + 1;

  // 1. Calculate Base Daily Production
  // MOXIE / Sabatier O2 synthesis
  let oxygenProd = 12;
  // Solar Array generation (reduced by dust accumulation: each 10% dust reduces power by ~7%)
  const dustFactor = Math.max(0.2, 1 - (state.dustAccumulation / 100) * 0.7);
  let powerGen = round(26 * dustFactor);
  // Hydroponic harvest
  let foodProd = 6;
  // Water Recycling Recovery (recycles ~85% of base water usage)
  let waterRecycled = 6;

  // Apply Strategic production bonuses
  if (state.strategy === 'SURVIVAL_FIRST') {
    oxygenProd += 2;
  } else if (state.strategy === 'SUSTAINABILITY_FIRST') {
    foodProd += 2;
    waterRecycled += 2;
  }

  // 2. Calculate Base Daily Consumption
  // 4 crew members consume resources
  const healthyCrewCount = state.crew.filter((c) => c.health > 20).length;
  const oxygenConsumed = round(healthyCrewCount * 1.5 + 2); // Crew breathing + habitat leak baseline
  let powerConsumed = 20; // Heaters, ECLSS, pumps, lights
  const foodConsumed = round(healthyCrewCount * 1.25);
  const waterConsumed = round(healthyCrewCount * 1.0 + 3); // Drinking + farm hydration

  // If in cold wave or extreme storm, heaters consume more
  if (state.activeEvent?.category === 'weather' && state.activeEvent.severity === 'danger') {
    powerConsumed += 6;
  }

  const production: Resources = {
    oxygen: oxygenProd,
    power: powerGen,
    food: foodProd,
    water: waterRecycled,
  };

  const consumption: Resources = {
    oxygen: oxygenConsumed,
    power: powerConsumed,
    food: foodConsumed,
    water: waterConsumed,
  };

  // Intermediate resources after baseline daily cycle
  let updatedRes: Resources = {
    oxygen: clamp(state.resources.oxygen + production.oxygen - consumption.oxygen),
    power: clamp(state.resources.power + production.power - consumption.power),
    food: clamp(state.resources.food + production.food - consumption.food),
    water: clamp(state.resources.water + production.water - consumption.water),
  };

  let updatedSec: SecondarySystems = { ...state.secondary };

  // 3. Process Delayed Consequences that trigger this Sol
  const delayedResult = processDelayedConsequences({
    ...state,
    resources: updatedRes,
    secondary: updatedSec,
  });
  updatedRes = delayedResult.updatedState.resources;
  updatedSec = delayedResult.updatedState.secondary;
  const consequencesResolved = delayedResult.resolvedConsequences.map((c) => c.title);

  // 4. Radiation Dose Calculation for this Sol
  const isSolarStorm =
    state.activeEvent?.id === 'solar_storm_warning' || state.solarStormActive;
  const dailyRadiationDose = calculateDailyRadiation(
    updatedSec.radiationShielding,
    isSolarStorm
  );
  updatedSec.cumulativeRadiation = round(
    updatedSec.cumulativeRadiation + dailyRadiationDose,
    2
  );

  // 5. Crew Health & Morale Update
  const healthResult = calculateCrewHealthImpact(
    updatedSec.crewHealth,
    updatedRes,
    dailyRadiationDose,
    state.crew
  );
  updatedSec.crewHealth = healthResult.newHealth;
  const updatedCrew = healthResult.updatedCrew;

  // 6. Dust Accumulation
  // If a dust storm event occurred, dust increases significantly; otherwise slight steady accumulation
  let newDust = state.dustAccumulation;
  if (state.activeEvent?.id === 'global_dust_storm') {
    newDust = clamp(newDust + 35);
  } else if (state.activeEvent?.id === 'dust_devil_clearing') {
    newDust = clamp(newDust - 45);
  } else {
    // Normal gradual dust accumulation (+3% per Sol)
    const dustGain = state.strategy === 'SUSTAINABILITY_FIRST' ? 2 : 3;
    newDust = clamp(newDust + dustGain);
  }

  // 7. Communication Queue Updates
  const currentRadioDelay = getRadioDelayMinutes(nextSol);
  const updatedComm = state.commQueue.map((msg) => {
    if (!msg.isDelivered && msg.deliverySol <= nextSol) {
      return { ...msg, isDelivered: true };
    }
    return msg;
  });

  // Houston telemetry feedback on milestones
  if (nextSol === 10) {
    updatedComm.push({
      id: `comm-sol10`,
      sender: 'Houston Flight Director',
      topic: 'Stage 1 Complete: Outpost Established',
      content:
        'Excellent work reaching Sol 10. You have completed Stage 1. Approaching Martian mid-campaign: space weather notifications from DONKI indicate increasing solar flare activity. Prepare shelter protocols.',
      sentSol: 10,
      deliverySol: 10,
      delayMinutes: currentRadioDelay,
      isDelivered: true,
    });
  } else if (nextSol === 20) {
    updatedComm.push({
      id: `comm-sol20`,
      sender: 'NASA Astrobiology Lead',
      topic: 'Stage 2 Complete: Science Commendation',
      content:
        'Houston has received your latest OSDR biological telemetry. The crew shows remarkable physiological resilience. Keep closed-loop water and greenhouse nutrient cycles stable for the final 10 Sols.',
      sentSol: 20,
      deliverySol: 20,
      delayMinutes: currentRadioDelay,
      isDelivered: true,
    });
  }

  // 8. Generate Educational Mission Control Report
  const pedagogicalInsights = generatePedagogicalInsights(
    prevSol,
    production,
    consumption,
    updatedRes,
    state.decisionsMadeThisSol,
    state.activeEvent?.title
  );

  const solLog: SolLogRecord = {
    sol: prevSol,
    decisionsMade: [...state.decisionsMadeThisSol],
    activeEventTitle: state.activeEvent?.title,
    eventChoiceText: state.activeEvent?.choices.find(
      (c) => c.id === state.selectedEventChoiceId
    )?.text,
    production,
    consumption,
    netChange: {
      oxygen: production.oxygen - consumption.oxygen,
      power: production.power - consumption.power,
      food: production.food - consumption.food,
      water: production.water - consumption.water,
    },
    endResources: { ...updatedRes },
    endSecondary: { ...updatedSec },
    consequencesResolved,
    radiationDoseThisSol: dailyRadiationDose,
    missionControlMessage: pedagogicalInsights.missionControlMessage,
    pedagogicalInsights: {
      whatHappened: pedagogicalInsights.whatHappened,
      whyItHappened: pedagogicalInsights.whyItHappened,
      whatCouldHappenNext: pedagogicalInsights.whatCouldHappenNext,
      whatDidYouLearn: pedagogicalInsights.whatDidYouLearn,
    },
  };

  // 9. Check Game Stage & Status
  let newStage: 1 | 2 | 3 = 1;
  if (nextSol > 20) newStage = 3;
  else if (nextSol > 10) newStage = 2;

  let newGameStatus: GameState['gameStatus'] = 'sol_summary';
  if (updatedRes.oxygen <= 0 || updatedSec.crewHealth <= 0) {
    newGameStatus = 'game_over';
  } else if (nextSol > CAMPAIGN_TOTAL_SOLS) {
    newGameStatus = 'victory';
  }

  // 10. Check Achievements
  const { updatedAchievements, freshlyUnlocked } = checkAchievements(
    state.achievements,
    nextSol,
    updatedRes,
    updatedSec,
    state.history.concat(solLog)
  );

  // 11. Pick next Sol's Event
  const nextEvent =
    newGameStatus === 'sol_summary'
      ? getEventForSol(nextSol, state.history.concat(solLog))
      : null;

  const updatedState: GameState = {
    ...state,
    currentSol: nextSol,
    stage: newStage,
    gameStatus: newGameStatus,
    resources: updatedRes,
    secondary: updatedSec,
    crew: updatedCrew,
    activeEvent: nextEvent,
    selectedEventChoiceId: null,
    decisionsMadeThisSol: [],
    delayedQueue: delayedResult.updatedState.delayedQueue,
    history: [...state.history, solLog],
    commQueue: updatedComm,
    achievements: updatedAchievements,
    dustAccumulation: newDust,
    solarStormActive: nextEvent?.id === 'solar_storm_warning',
  };

  return {
    updatedState,
    solLog,
    unlockedAchievements: freshlyUnlocked,
  };
}

/**
 * Checks and unlocks achievements based on gameplay telemetry
 */
export function checkAchievements(
  achievements: Achievement[],
  sol: number,
  res: Resources,
  sec: SecondarySystems,
  history: SolLogRecord[]
): {
  updatedAchievements: Achievement[];
  freshlyUnlocked: Achievement[];
} {
  const freshlyUnlocked: Achievement[] = [];

  const updatedAchievements = achievements.map((ach) => {
    if (ach.unlocked) return ach;

    let shouldUnlock = false;

    if (ach.id === 'first_sunrise' && sol >= 2) {
      shouldUnlock = true;
    } else if (ach.id === 'energy_expert' && res.power >= 70 && sol >= 5) {
      shouldUnlock = true;
    } else if (ach.id === 'green_pioneer' && res.food >= 75) {
      shouldUnlock = true;
    } else if (
      ach.id === 'radiation_guardian' &&
      sec.cumulativeRadiation < 5.0 &&
      sol >= 13
    ) {
      shouldUnlock = true;
    } else if (ach.id === 'science_explorer' && sec.sciencePoints >= 100) {
      shouldUnlock = true;
    } else if (ach.id === 'water_saver' && res.water >= 65 && sol >= 10) {
      shouldUnlock = true;
    } else if (
      ach.id === 'sustainable_engineer' &&
      sol >= 20 &&
      res.oxygen >= 50 &&
      res.power >= 50 &&
      res.food >= 50 &&
      res.water >= 50
    ) {
      shouldUnlock = true;
    } else if (ach.id === 'mars_survivor' && sol > 30) {
      shouldUnlock = true;
    } else if (
      ach.id === 'master_commander' &&
      sol > 30 &&
      sec.crewHealth >= 75 &&
      sec.cumulativeRadiation < 15
    ) {
      shouldUnlock = true;
    }

    if (shouldUnlock) {
      const unlockedItem = { ...ach, unlocked: true, unlockedAtSol: sol };
      freshlyUnlocked.push(unlockedItem);
      return unlockedItem;
    }
    return ach;
  });

  return {
    updatedAchievements,
    freshlyUnlocked,
  };
}

/**
 * Generates pedagogical insights explaining system trade-offs to children
 */
function generatePedagogicalInsights(
  sol: number,
  prod: Resources,
  cons: Resources,
  res: Resources,
  decisions: string[],
  eventTitle?: string
) {
  let whatHappened = `Sol ${sol} concluded with normal habitat cycling.`;
  let whyItHappened = `Your crew consumed ${cons.oxygen}% O2, ${cons.food}% food, and ${cons.water}% water while solar panels generated ${prod.power}% electricity.`;
  let whatCouldHappenNext = `Keep an eye on resource buffers. Delayed consequences from earlier decisions will trigger in upcoming Sols.`;
  let whatDidYouLearn = `Every system on Mars connects: life support consumes electricity, and farming requires both water and power.`;
  let missionControlMessage = `Chryse Outpost telemetry logged for Sol ${sol}. Systems stable.`;

  if (decisions.includes('boost_oxygen')) {
    whatHappened = `You boosted MOXIE oxygen production today.`;
    whyItHappened = `Oxygen jumped, but high electrical heating drew substantial battery reserves.`;
    whatCouldHappenNext = `Check battery levels tomorrow to ensure life support heaters stay powered during the Martian night.`;
    whatDidYouLearn = `Making oxygen from Martian CO2 requires high electrical energy—saving one resource costs another!`;
    missionControlMessage = `MOXIE high-temperature electrolysis completed. Oxygen reserves replenished.`;
  } else if (decisions.includes('energy_saving_mode')) {
    whatHappened = `The habitat entered energy-saving mode to conserve power.`;
    whyItHappened = `Batteries recharged (+25%), but dimming lights slowed down hydroponic crops and cooled the habitat.`;
    whatCouldHappenNext = `Crop yields may be slightly lower over the next two Sols.`;
    whatDidYouLearn = `Load shedding preserves electrical grids, but reduces environmental comfort and agricultural productivity.`;
    missionControlMessage = `Non-critical loads shed. Grid capacity preserved for night operations.`;
  }

  if (eventTitle) {
    whatHappened += ` You also responded to: "${eventTitle}".`;
  }

  return {
    missionControlMessage,
    whatHappened,
    whyItHappened,
    whatCouldHappenNext,
    whatDidYouLearn,
  };
}

/**
 * Calculates final mission ending and pedagogical report card
 */
export function evaluateMissionEnding(state: GameState): FinalScoreReport {
  const survivedSols = Math.min(CAMPAIGN_TOTAL_SOLS, state.currentSol);
  const avgResources =
    (state.resources.oxygen +
      state.resources.power +
      state.resources.food +
      state.resources.water) /
    4;
  const crewHealth = state.secondary.crewHealth;
  const rad = state.secondary.cumulativeRadiation;
  const science = state.secondary.sciencePoints;
  const unlockedAchievementsCount = state.achievements.filter((a) => a.unlocked).length;

  let outcome: FinalScoreReport['outcome'] = 'SUCCESS';
  if (state.resources.oxygen <= 0 || crewHealth <= 0) {
    outcome = 'MISSION_FAILURE';
  } else if (survivedSols < 30 || avgResources < 25 || crewHealth < 30) {
    outcome = 'EMERGENCY_EVACUATION';
  } else if (avgResources < 45 || crewHealth < 60 || rad > 25) {
    outcome = 'PARTIAL_SUCCESS';
  }

  // Calculate score out of 100
  let score = 0;
  score += (survivedSols / 30) * 35; // Up to 35 points for survival duration
  score += (crewHealth / 100) * 25; // Up to 25 points for crew health
  score += (avgResources / 100) * 20; // Up to 20 points for resource buffer
  score += Math.min(15, (science / 150) * 15); // Up to 15 points for science
  score += Math.min(5, unlockedAchievementsCount * 0.8); // Up to 5 points for achievements

  // Radiation penalty
  if (rad > 20) score -= 10;
  else if (rad < 10) score += 5;

  const totalScore = Math.max(0, Math.min(100, Math.round(score)));

  let radiationProtectionRating: FinalScoreReport['radiationProtectionRating'] = 'A+';
  if (rad > 30) radiationProtectionRating = 'D';
  else if (rad > 20) radiationProtectionRating = 'C';
  else if (rad > 12) radiationProtectionRating = 'B';
  else if (rad > 6) radiationProtectionRating = 'A';

  const keyLessonsLearned: string[] = [
    'Interconnected Systems: Saving power can reduce oxygen production or freeze hydroponic crops.',
    'Delayed Consequences: Decisions made on Sol 2 echo into Sol 6. Space engineering requires forward planning.',
    'Space Radiation: Martian regolith and water barriers are humanity’s best shields against cosmic rays.',
    'Autonomous Command: The 4-to-22 minute radio delay means astronauts on Mars must be independent problem solvers.',
  ];

  let feedbackSummary = '';
  switch (outcome) {
    case 'SUCCESS':
      feedbackSummary =
        'Outstanding achievement, Commander! You established a self-sustaining human outpost on Chryse Planitia. Your balanced resource engineering protected the crew, advanced NASA science, and paved the way for permanent Mars settlement.';
      break;
    case 'PARTIAL_SUCCESS':
      feedbackSummary =
        'Mission Accomplished with Hard Lessons. The crew survived the 30-Sol campaign, but suffered severe resource squeezes and elevated radiation exposure. Your experience provides critical engineering data for the next mission.';
      break;
    case 'EMERGENCY_EVACUATION':
      feedbackSummary =
        'Emergency Evacuation Triggered. Critical resource reserves fell below survival margins, forcing the crew to abandon Chryse Outpost for orbital rendezvous. Review your resource trade-offs and try again!';
      break;
    case 'MISSION_FAILURE':
      feedbackSummary =
        'Mission Terminated Early. Life support or crew health failed. Space exploration is unforgiving, but every failure teaches real engineering lessons about resource balance.';
      break;
  }

  return {
    outcome,
    totalScore,
    survivedSols,
    crewSurvivalRate: Math.round(crewHealth),
    resourceEfficiency: Math.round(avgResources),
    radiationProtectionRating,
    sciencePointsCollected: science,
    achievementsUnlocked: unlockedAchievementsCount,
    feedbackSummary,
    keyLessonsLearned,
  };
}

/**
 * SIGNATURE FEATURE: "WHAT IF I CHOSE DIFFERENTLY?"
 * Clones the exact state, applies an alternative decision, and projects 5 Sols forward.
 * Completely deterministic and isolated from active saved game!
 */
export function runWhatIfSimulation(
  baseState: GameState,
  alternativeDecisionId: string,
  projectionSols: number = 5
): {
  timelineA: Array<{ sol: number; oxygen: number; power: number; food: number; water: number; health: number; science: number }>;
  timelineB: Array<{ sol: number; oxygen: number; power: number; food: number; water: number; health: number; science: number }>;
  summaryDiff: {
    oxygenDelta: number;
    powerDelta: number;
    foodDelta: number;
    waterDelta: number;
    healthDelta: number;
    scienceDelta: number;
  };
} {
  // Timeline A: Actual path (projected forward using current state trajectory)
  let stateA: GameState = JSON.parse(JSON.stringify(baseState));
  // Timeline B: Branching path where alternative decision was taken
  let stateB: GameState = JSON.parse(JSON.stringify(baseState));

  // In state B, reset today's decisions and simulate alternative decision
  stateB.decisionsMadeThisSol = [];
  try {
    stateB = commitDecision(stateB, alternativeDecisionId);
  } catch (_e) {
    // If requirement not met, proceed with baseline
  }

  const timelineA = [
    {
      sol: stateA.currentSol,
      oxygen: round(stateA.resources.oxygen),
      power: round(stateA.resources.power),
      food: round(stateA.resources.food),
      water: round(stateA.resources.water),
      health: round(stateA.secondary.crewHealth),
      science: stateA.secondary.sciencePoints,
    },
  ];

  const timelineB = [
    {
      sol: stateB.currentSol,
      oxygen: round(stateB.resources.oxygen),
      power: round(stateB.resources.power),
      food: round(stateB.resources.food),
      water: round(stateB.resources.water),
      health: round(stateB.secondary.crewHealth),
      science: stateB.secondary.sciencePoints,
    },
  ];

  // Project forward for projectionSols
  for (let i = 1; i <= projectionSols; i++) {
    const resA = advanceSol(stateA);
    stateA = resA.updatedState;
    timelineA.push({
      sol: stateA.currentSol,
      oxygen: round(stateA.resources.oxygen),
      power: round(stateA.resources.power),
      food: round(stateA.resources.food),
      water: round(stateA.resources.water),
      health: round(stateA.secondary.crewHealth),
      science: stateA.secondary.sciencePoints,
    });

    const resB = advanceSol(stateB);
    stateB = resB.updatedState;
    timelineB.push({
      sol: stateB.currentSol,
      oxygen: round(stateB.resources.oxygen),
      power: round(stateB.resources.power),
      food: round(stateB.resources.food),
      water: round(stateB.resources.water),
      health: round(stateB.secondary.crewHealth),
      science: stateB.secondary.sciencePoints,
    });
  }

  const lastA = timelineA[timelineA.length - 1];
  const lastB = timelineB[timelineB.length - 1];

  return {
    timelineA,
    timelineB,
    summaryDiff: {
      oxygenDelta: round(lastB.oxygen - lastA.oxygen),
      powerDelta: round(lastB.power - lastA.power),
      foodDelta: round(lastB.food - lastA.food),
      waterDelta: round(lastB.water - lastA.water),
      healthDelta: round(lastB.health - lastA.health),
      scienceDelta: round(lastB.science - lastA.science),
    },
  };
}

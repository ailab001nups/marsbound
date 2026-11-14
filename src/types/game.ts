// ==========================================
// MARSBOUND: TYPES DEFINITION
// ==========================================

export type StrategyType = 'SURVIVAL_FIRST' | 'SCIENCE_FIRST' | 'SUSTAINABILITY_FIRST';

export type DataSourceType = 'LIVE_NASA' | 'ARCHIVED_NASA' | 'SIMULATED';

export type ResourceKey = 'oxygen' | 'power' | 'food' | 'water';

export interface Resources {
  oxygen: number;     // 0 - 100%
  power: number;      // 0 - 100%
  food: number;       // 0 - 100%
  water: number;      // 0 - 100%
}

export interface SecondarySystems {
  radiationShielding: number; // 0 - 100%
  crewHealth: number;         // 0 - 100%
  materials: number;          // 0 - 100
  sciencePoints: number;      // >= 0
  cumulativeRadiation: number; // mSv received
}

export interface Astronaut {
  id: string;
  name: string;
  role: string;
  specialty: string;
  health: number; // 0 - 100%
  morale: number; // 0 - 100%
  avatar: string;
  quote: string;
}

export interface ResourceDelta {
  oxygen?: number;
  power?: number;
  food?: number;
  water?: number;
  radiationShielding?: number;
  crewHealth?: number;
  materials?: number;
  sciencePoints?: number;
  cumulativeRadiation?: number;
}

export interface DelayedConsequence {
  id: string;
  originDecisionId?: string;
  originEventId?: string;
  title: string;
  description: string;
  createdSol: number;
  triggerSol: number;
  category: 'oxygen' | 'power' | 'food' | 'water' | 'shielding' | 'health' | 'materials' | 'science';
  severity: 'info' | 'warning' | 'danger';
  impactDelta: ResourceDelta;
  educationalNote: string;
  resolved: boolean;
}

export interface DecisionOption {
  id: string;
  title: string;
  category: 'life_support' | 'energy' | 'agriculture' | 'shielding' | 'science' | 'maintenance';
  description: string;
  benefits: string[];
  costs: string[];
  immediateImpact: ResourceDelta;
  requires?: {
    power?: number;
    water?: number;
    materials?: number;
    food?: number;
  };
  delayedRisk?: {
    delaySols: number;
    title: string;
    description: string;
    impactDelta: ResourceDelta;
    educationalNote: string;
    severity: 'warning' | 'danger';
  };
  cooldownSols?: number; // Sols before can be used again
  iconName: string;
}

export interface MissionEventChoice {
  id: string;
  text: string;
  strategyHint?: string;
  impact: ResourceDelta;
  delayedRisk?: {
    delaySols: number;
    title: string;
    description: string;
    impactDelta: ResourceDelta;
    educationalNote: string;
    severity: 'warning' | 'danger';
  };
  outcomeDescription: string;
  educationalTakeaway: string;
}

export interface MissionEvent {
  id: string;
  title: string;
  severity: 'normal' | 'warning' | 'danger' | 'critical' | 'breakthrough';
  category: 'weather' | 'space_weather' | 'engineering' | 'biology' | 'discovery';
  description: string;
  scientificContext: string;
  nasaRef?: {
    source: 'DONKI' | 'ROVER' | 'OSDR' | 'RADLAB' | 'APOD';
    identifier: string;
    url?: string;
    dataType: DataSourceType;
  };
  choices: MissionEventChoice[];
  minSol?: number;
  maxSol?: number;
}

export interface SolLogRecord {
  sol: number;
  decisionsMade: string[];
  activeEventTitle?: string;
  eventChoiceText?: string;
  production: Resources;
  consumption: Resources;
  netChange: ResourceDelta;
  endResources: Resources;
  endSecondary: SecondarySystems;
  consequencesResolved: string[];
  radiationDoseThisSol: number; // mSv
  missionControlMessage: string;
  pedagogicalInsights: {
    whatHappened: string;
    whyItHappened: string;
    whatCouldHappenNext: string;
    whatDidYouLearn: string;
  };
}

export interface EarthMessage {
  id: string;
  sender: 'Commander' | 'Houston Flight Director' | 'NASA Astrobiology Lead' | 'Chief Flight Surgeon';
  content: string;
  sentSol: number;
  deliverySol: number;
  delayMinutes: number; // 3 to 22
  isDelivered: boolean;
  topic: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAtSol?: number;
  category: 'survival' | 'energy' | 'food' | 'science' | 'water' | 'mastery';
  educationalFact: string;
}

export interface GameState {
  currentSol: number;
  campaignLength: number; // 30
  stage: 1 | 2 | 3;
  strategy: StrategyType;
  gameStatus: 'intro' | 'briefing' | 'playing' | 'sol_summary' | 'game_over' | 'victory';
  resources: Resources;
  secondary: SecondarySystems;
  crew: Astronaut[];
  activeEvent: MissionEvent | null;
  selectedEventChoiceId: string | null;
  decisionsMadeThisSol: string[];
  delayedQueue: DelayedConsequence[];
  history: SolLogRecord[];
  commQueue: EarthMessage[];
  achievements: Achievement[];
  dustAccumulation: number; // 0 - 100% dust on solar panels
  solarStormActive: boolean;
  settings: {
    soundEnabled: boolean;
    readingMode: boolean; // Simplified language mode for younger kids (7-9)
    highContrast: boolean;
  };
  nasaLiveStatus: {
    connected: boolean;
    lastSyncSol: number;
    activeApodUrl?: string;
    activeRoverPhotoUrl?: string;
  };
}

export type EndingOutcome = 'SUCCESS' | 'PARTIAL_SUCCESS' | 'EMERGENCY_EVACUATION' | 'MISSION_FAILURE';

export interface FinalScoreReport {
  outcome: EndingOutcome;
  totalScore: number;
  survivedSols: number;
  crewSurvivalRate: number; // %
  resourceEfficiency: number; // 0 - 100
  radiationProtectionRating: 'A+' | 'A' | 'B' | 'C' | 'D';
  sciencePointsCollected: number;
  achievementsUnlocked: number;
  feedbackSummary: string;
  keyLessonsLearned: string[];
}

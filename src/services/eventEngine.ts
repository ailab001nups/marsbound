// ==========================================
// MARSBOUND: MISSION EVENT ENGINE
// Deterministic and balanced event orchestration
// ==========================================

import { GameState, MissionEvent, MissionEventChoice, DelayedConsequence } from '../types/game';
import { MISSION_EVENTS } from '../data/events';
import { applyDeltaToResources, applyDeltaToSecondary } from '../utils/calculations';

/**
 * Deterministically retrieves the scheduled or procedural mission event for a Sol
 */
export function getEventForSol(sol: number, history: GameState['history']): MissionEvent | null {
  // Sol 1 is orientation sol (no crisis)
  if (sol === 1) {
    return null;
  }

  // Signature Pacing Milestones:
  // Sol 5: Dust devil beneficial event
  if (sol === 5) {
    return MISSION_EVENTS.find((e) => e.id === 'dust_devil_clearing') || MISSION_EVENTS[2];
  }
  // Sol 12: Signature Solar Storm Warning (DONKI CME event)
  if (sol === 12) {
    return MISSION_EVENTS.find((e) => e.id === 'solar_storm_warning') || MISSION_EVENTS[0];
  }
  // Sol 16: Regional Dust Storm
  if (sol === 16) {
    return MISSION_EVENTS.find((e) => e.id === 'global_dust_storm') || MISSION_EVENTS[1];
  }
  // Sol 22: Subsurface Ice Discovery
  if (sol === 22) {
    return MISSION_EVENTS.find((e) => e.id === 'subsurface_ice_discovery') || MISSION_EVENTS[10];
  }
  // Sol 26: Solar Conjunction Blackout
  if (sol === 26) {
    return MISSION_EVENTS.find((e) => e.id === 'solar_conjunction_blackout') || MISSION_EVENTS[14];
  }

  // For other sols, pick an event that hasn't appeared recently
  const pastEventTitles = history.map((h) => h.activeEventTitle).filter(Boolean);

  // Filter pool excluding recent 5 events
  const candidatePool = MISSION_EVENTS.filter(
    (e) => !pastEventTitles.slice(-5).includes(e.title)
  );

  // Deterministic pseudo-random index based on sol number
  const index = (sol * 7 + 13) % candidatePool.length;
  return candidatePool[index] || candidatePool[0];
}

/**
 * Commits a player's choice during an active mission event
 */
export function commitEventChoice(
  state: GameState,
  choiceId: string
): {
  updatedState: GameState;
  choice: MissionEventChoice;
} {
  if (!state.activeEvent) {
    throw new Error('No active mission event to resolve.');
  }

  const choice = state.activeEvent.choices.find((c) => c.id === choiceId);
  if (!choice) {
    throw new Error(`Choice id "${choiceId}" not found in event "${state.activeEvent.title}".`);
  }

  let updatedResources = applyDeltaToResources(state.resources, choice.impact);
  let updatedSecondary = applyDeltaToSecondary(state.secondary, choice.impact);
  let updatedQueue = [...state.delayedQueue];

  // Schedule delayed consequence if choice contains one
  if (choice.delayedRisk) {
    const consequence: DelayedConsequence = {
      id: `event-${state.activeEvent.id}-${choiceId}-sol${state.currentSol}`,
      originEventId: state.activeEvent.id,
      title: choice.delayedRisk.title,
      description: choice.delayedRisk.description,
      createdSol: state.currentSol,
      triggerSol: state.currentSol + choice.delayedRisk.delaySols,
      category: 'health',
      severity: choice.delayedRisk.severity,
      impactDelta: choice.delayedRisk.impactDelta,
      educationalNote: choice.delayedRisk.educationalNote,
      resolved: false,
    };
    updatedQueue.push(consequence);
  }

  const updatedState: GameState = {
    ...state,
    resources: updatedResources,
    secondary: updatedSecondary,
    selectedEventChoiceId: choiceId,
    delayedQueue: updatedQueue,
  };

  return {
    updatedState,
    choice,
  };
}

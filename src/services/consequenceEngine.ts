// ==========================================
// MARSBOUND: DELAYED CONSEQUENCE ENGINE
// ==========================================

import { GameState, DelayedConsequence, ResourceDelta } from '../types/game';
import { applyDeltaToResources, applyDeltaToSecondary } from '../utils/calculations';

export interface ProcessedConsequencesResult {
  updatedState: GameState;
  triggeredCount: number;
  resolvedConsequences: DelayedConsequence[];
  cumulativeDelta: ResourceDelta;
  logMessages: string[];
}

/**
 * Resolves all delayed consequences scheduled for the current Sol
 */
export function processDelayedConsequences(state: GameState): ProcessedConsequencesResult {
  const currentSol = state.currentSol;
  const triggered: DelayedConsequence[] = [];
  const remaining: DelayedConsequence[] = [];

  for (const item of state.delayedQueue) {
    if (item.triggerSol <= currentSol && !item.resolved) {
      triggered.push({ ...item, resolved: true });
    } else {
      remaining.push(item);
    }
  }

  if (triggered.length === 0) {
    return {
      updatedState: state,
      triggeredCount: 0,
      resolvedConsequences: [],
      cumulativeDelta: {},
      logMessages: [],
    };
  }

  // Aggregate impact deltas
  const cumulativeDelta: ResourceDelta = {};
  const logMessages: string[] = [];

  for (const item of triggered) {
    logMessages.push(`⚠️ [Delayed Consequence]: ${item.title} — ${item.description}`);

    if (item.impactDelta.oxygen) {
      cumulativeDelta.oxygen = (cumulativeDelta.oxygen ?? 0) + item.impactDelta.oxygen;
    }
    if (item.impactDelta.power) {
      cumulativeDelta.power = (cumulativeDelta.power ?? 0) + item.impactDelta.power;
    }
    if (item.impactDelta.food) {
      cumulativeDelta.food = (cumulativeDelta.food ?? 0) + item.impactDelta.food;
    }
    if (item.impactDelta.water) {
      cumulativeDelta.water = (cumulativeDelta.water ?? 0) + item.impactDelta.water;
    }
    if (item.impactDelta.radiationShielding) {
      cumulativeDelta.radiationShielding =
        (cumulativeDelta.radiationShielding ?? 0) + item.impactDelta.radiationShielding;
    }
    if (item.impactDelta.crewHealth) {
      cumulativeDelta.crewHealth = (cumulativeDelta.crewHealth ?? 0) + item.impactDelta.crewHealth;
    }
    if (item.impactDelta.materials) {
      cumulativeDelta.materials = (cumulativeDelta.materials ?? 0) + item.impactDelta.materials;
    }
    if (item.impactDelta.sciencePoints) {
      cumulativeDelta.sciencePoints =
        (cumulativeDelta.sciencePoints ?? 0) + item.impactDelta.sciencePoints;
    }
  }

  const updatedResources = applyDeltaToResources(state.resources, cumulativeDelta);
  const updatedSecondary = applyDeltaToSecondary(state.secondary, cumulativeDelta);

  const updatedState: GameState = {
    ...state,
    resources: updatedResources,
    secondary: updatedSecondary,
    delayedQueue: remaining,
  };

  return {
    updatedState,
    triggeredCount: triggered.length,
    resolvedConsequences: triggered,
    cumulativeDelta,
    logMessages,
  };
}

/**
 * Returns upcoming risks sorted by imminent trigger sol
 */
export function getUpcomingRisks(state: GameState): Array<DelayedConsequence & { solsRemaining: number }> {
  return state.delayedQueue
    .filter((c) => !c.resolved && c.triggerSol > state.currentSol)
    .map((c) => ({
      ...c,
      solsRemaining: c.triggerSol - state.currentSol,
    }))
    .sort((a, b) => a.solsRemaining - b.solsRemaining);
}

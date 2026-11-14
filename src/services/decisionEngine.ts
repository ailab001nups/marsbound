// ==========================================
// MARSBOUND: DETERMINISTIC DECISION ENGINE
// ==========================================

import { GameState, DecisionOption, ResourceDelta, Resources, SecondarySystems, DelayedConsequence } from '../types/game';
import { OUTPOST_DECISIONS } from '../data/decisions';
import { applyDeltaToResources, applyDeltaToSecondary } from '../utils/calculations';

export interface DecisionPreviewResult {
  isValid: boolean;
  canAfford: boolean;
  reason?: string;
  decision: DecisionOption;
  immediateDelta: ResourceDelta;
  projectedResources: Resources;
  projectedSecondary: SecondarySystems;
  delayedRisk?: {
    delaySols: number;
    title: string;
    description: string;
    impactDelta: ResourceDelta;
    educationalNote: string;
    severity: 'warning' | 'danger';
  };
}

/**
 * Calculates modified resource delta based on the active Commander Strategy
 */
export function calculateStrategyAdjustedDelta(
  delta: ResourceDelta,
  category: DecisionOption['category'],
  strategy: GameState['strategy']
): ResourceDelta {
  const adjusted = { ...delta };

  if (strategy === 'SURVIVAL_FIRST') {
    if (category === 'life_support') {
      if (adjusted.oxygen && adjusted.oxygen > 0) adjusted.oxygen = Math.round(adjusted.oxygen * 1.15);
      if (adjusted.crewHealth && adjusted.crewHealth > 0) adjusted.crewHealth = Math.round(adjusted.crewHealth * 1.2);
    } else if (category === 'science') {
      if (adjusted.sciencePoints && adjusted.sciencePoints > 0) {
        adjusted.sciencePoints = Math.max(5, Math.round(adjusted.sciencePoints * 0.8));
      }
    }
  } else if (strategy === 'SCIENCE_FIRST') {
    if (category === 'science') {
      if (adjusted.sciencePoints && adjusted.sciencePoints > 0) {
        adjusted.sciencePoints = Math.round(adjusted.sciencePoints * 1.4);
      }
      if (adjusted.power && adjusted.power < 0) {
        adjusted.power -= 2; // Extra power draw for deep spectrometry
      }
    }
  } else if (strategy === 'SUSTAINABILITY_FIRST') {
    if (category === 'agriculture' || category === 'life_support') {
      if (adjusted.water && adjusted.water < 0) {
        // 20% water conservation in closed loops
        adjusted.water = Math.min(-1, Math.round(adjusted.water * 0.8));
      }
      if (adjusted.food && adjusted.food > 0) {
        adjusted.food = Math.round(adjusted.food * 1.15);
      }
    }
  }

  return adjusted;
}

/**
 * SHARED DETERMINISTIC PREVIEW & VALIDATION FUNCTION
 * Both the preview modal and actual commit execute this identical logic.
 */
export function calculateDecisionPreview(
  state: GameState,
  decisionId: string
): DecisionPreviewResult {
  const decision = OUTPOST_DECISIONS.find((d) => d.id === decisionId);
  if (!decision) {
    throw new Error(`Decision with id "${decisionId}" not found in outpost catalogue.`);
  }

  // Check if decision has already been executed this Sol
  if (state.decisionsMadeThisSol.includes(decisionId)) {
    return {
      isValid: false,
      canAfford: false,
      reason: 'This engineering protocol has already been deployed for this Sol.',
      decision,
      immediateDelta: decision.immediateImpact,
      projectedResources: state.resources,
      projectedSecondary: state.secondary,
      delayedRisk: decision.delayedRisk,
    };
  }

  // Validate Resource Requirements
  if (decision.requires) {
    if (decision.requires.power && state.resources.power < decision.requires.power) {
      return {
        isValid: false,
        canAfford: false,
        reason: `Insufficient Power: Requires ${decision.requires.power}% (Current: ${Math.round(state.resources.power)}%)`,
        decision,
        immediateDelta: decision.immediateImpact,
        projectedResources: state.resources,
        projectedSecondary: state.secondary,
        delayedRisk: decision.delayedRisk,
      };
    }
    if (decision.requires.water && state.resources.water < decision.requires.water) {
      return {
        isValid: false,
        canAfford: false,
        reason: `Insufficient Water: Requires ${decision.requires.water}% (Current: ${Math.round(state.resources.water)}%)`,
        decision,
        immediateDelta: decision.immediateImpact,
        projectedResources: state.resources,
        projectedSecondary: state.secondary,
        delayedRisk: decision.delayedRisk,
      };
    }
    if (decision.requires.materials && state.secondary.materials < decision.requires.materials) {
      return {
        isValid: false,
        canAfford: false,
        reason: `Insufficient Construction Materials: Requires ${decision.requires.materials} units (Current: ${Math.round(state.secondary.materials)})`,
        decision,
        immediateDelta: decision.immediateImpact,
        projectedResources: state.resources,
        projectedSecondary: state.secondary,
        delayedRisk: decision.delayedRisk,
      };
    }
    if (decision.requires.food && state.resources.food < decision.requires.food) {
      return {
        isValid: false,
        canAfford: false,
        reason: `Insufficient Food: Requires ${decision.requires.food}% (Current: ${Math.round(state.resources.food)}%)`,
        decision,
        immediateDelta: decision.immediateImpact,
        projectedResources: state.resources,
        projectedSecondary: state.secondary,
        delayedRisk: decision.delayedRisk,
      };
    }
  }

  // Calculate strategy-adjusted deltas
  const adjustedDelta = calculateStrategyAdjustedDelta(
    decision.immediateImpact,
    decision.category,
    state.strategy
  );

  const projectedResources = applyDeltaToResources(state.resources, adjustedDelta);
  const projectedSecondary = applyDeltaToSecondary(state.secondary, adjustedDelta);

  return {
    isValid: true,
    canAfford: true,
    decision,
    immediateDelta: adjustedDelta,
    projectedResources,
    projectedSecondary,
    delayedRisk: decision.delayedRisk,
  };
}

/**
 * Commits a decision to the game state. Uses calculateDecisionPreview to ensure
 * 100% calculation parity between UI preview and state execution.
 */
export function commitDecision(
  state: GameState,
  decisionId: string
): GameState {
  const preview = calculateDecisionPreview(state, decisionId);

  if (!preview.isValid || !preview.canAfford) {
    throw new Error(`Cannot commit invalid decision: ${preview.reason}`);
  }

  let updatedQueue = [...state.delayedQueue];

  // Schedule delayed consequence if present
  if (preview.delayedRisk) {
    const consequence: DelayedConsequence = {
      id: `delayed-${decisionId}-sol${state.currentSol}-${Date.now()}`,
      originDecisionId: decisionId,
      title: preview.delayedRisk.title,
      description: preview.delayedRisk.description,
      createdSol: state.currentSol,
      triggerSol: state.currentSol + preview.delayedRisk.delaySols,
      category: 'power',
      severity: preview.delayedRisk.severity,
      impactDelta: preview.delayedRisk.impactDelta,
      educationalNote: preview.delayedRisk.educationalNote,
      resolved: false,
    };
    updatedQueue.push(consequence);
  }

  // Special handling: if cleaning solar panels, reduce dust accumulation
  let updatedDust = state.dustAccumulation;
  if (decisionId === 'clean_solar_panels') {
    updatedDust = Math.max(0, updatedDust - 40);
  }

  return {
    ...state,
    resources: preview.projectedResources,
    secondary: preview.projectedSecondary,
    decisionsMadeThisSol: [...state.decisionsMadeThisSol, decisionId],
    delayedQueue: updatedQueue,
    dustAccumulation: updatedDust,
  };
}

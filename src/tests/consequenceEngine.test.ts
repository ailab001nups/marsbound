import { describe, it, expect } from 'vitest';
import { initializeGameState } from '../services/gameEngine';
import { processDelayedConsequences, getUpcomingRisks } from '../services/consequenceEngine';
import { DelayedConsequence } from '../types/game';

describe('ConsequenceEngine - Delayed Risks & Pacing Queue', () => {
  it('does not resolve consequences before their scheduled triggerSol', () => {
    const state = initializeGameState('SURVIVAL_FIRST');
    const futureConsequence: DelayedConsequence = {
      id: 'test-consequence-1',
      title: 'Coolant Line Fatigue',
      description: 'Secondary line requires servicing',
      createdSol: 1,
      triggerSol: 4,
      category: 'power',
      severity: 'warning',
      impactDelta: { power: -10 },
      educationalNote: 'Thermal cycles wear pipes.',
      resolved: false,
    };
    state.delayedQueue = [futureConsequence];

    const result = processDelayedConsequences(state);
    expect(result.triggeredCount).toBe(0);
    expect(result.updatedState.delayedQueue.length).toBe(1);
    expect(result.updatedState.resources.power).toBe(state.resources.power);
  });

  it('triggers and resolves consequence when currentSol reaches triggerSol', () => {
    const state = initializeGameState('SURVIVAL_FIRST');
    state.currentSol = 4;
    const dueConsequence: DelayedConsequence = {
      id: 'test-consequence-2',
      title: 'Coolant Line Fatigue',
      description: 'Secondary line requires servicing',
      createdSol: 1,
      triggerSol: 4,
      category: 'power',
      severity: 'warning',
      impactDelta: { power: -12 },
      educationalNote: 'Thermal cycles wear pipes.',
      resolved: false,
    };
    state.delayedQueue = [dueConsequence];

    const result = processDelayedConsequences(state);
    expect(result.triggeredCount).toBe(1);
    expect(result.resolvedConsequences[0].resolved).toBe(true);
    expect(result.updatedState.delayedQueue.length).toBe(0); // Cleared from active queue
    expect(result.updatedState.resources.power).toBe(state.resources.power - 12);
  });

  it('correctly calculates countdown sols remaining for upcoming risks', () => {
    const state = initializeGameState('SURVIVAL_FIRST');
    state.currentSol = 3;
    state.delayedQueue = [
      {
        id: 'risk-1',
        title: 'Risk in 5 Sols',
        description: 'Scheduled maintenance',
        createdSol: 1,
        triggerSol: 8,
        category: 'food',
        severity: 'warning',
        impactDelta: {},
        educationalNote: '',
        resolved: false,
      },
      {
        id: 'risk-2',
        title: 'Risk in 2 Sols',
        description: 'Imminent filter clean',
        createdSol: 1,
        triggerSol: 5,
        category: 'water',
        severity: 'danger',
        impactDelta: {},
        educationalNote: '',
        resolved: false,
      },
    ];

    const upcoming = getUpcomingRisks(state);
    expect(upcoming.length).toBe(2);
    // Should be sorted by nearest trigger sol
    expect(upcoming[0].id).toBe('risk-2');
    expect(upcoming[0].solsRemaining).toBe(2);
    expect(upcoming[1].solsRemaining).toBe(5);
  });
});

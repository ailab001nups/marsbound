import { describe, it, expect } from 'vitest';
import { initializeGameState } from '../services/gameEngine';
import { calculateDecisionPreview, commitDecision } from '../services/decisionEngine';

describe('DecisionEngine - Resource Trade-Offs & Parity', () => {
  it('guarantees identical outcome calculation between preview and committed state', () => {
    const state = initializeGameState('SURVIVAL_FIRST');
    const preview = calculateDecisionPreview(state, 'boost_oxygen');

    expect(preview.isValid).toBe(true);
    expect(preview.canAfford).toBe(true);

    const committed = commitDecision(state, 'boost_oxygen');

    expect(committed.resources.oxygen).toBe(preview.projectedResources.oxygen);
    expect(committed.resources.power).toBe(preview.projectedResources.power);
    expect(committed.resources.water).toBe(preview.projectedResources.water);
  });

  it('rejects action if player lacks required resources', () => {
    const state = initializeGameState('SURVIVAL_FIRST');
    state.resources.power = 5; // boost_oxygen requires 16 power

    const preview = calculateDecisionPreview(state, 'boost_oxygen');
    expect(preview.isValid).toBe(false);
    expect(preview.canAfford).toBe(false);
    expect(preview.reason).toContain('Insufficient Power');

    expect(() => commitDecision(state, 'boost_oxygen')).toThrowError();
  });

  it('prevents executing the same decision twice in the same Sol', () => {
    const state = initializeGameState('SURVIVAL_FIRST');
    const firstCommit = commitDecision(state, 'boost_oxygen');
    expect(firstCommit.decisionsMadeThisSol).toContain('boost_oxygen');

    const previewSecond = calculateDecisionPreview(firstCommit, 'boost_oxygen');
    expect(previewSecond.isValid).toBe(false);
    expect(previewSecond.reason).toContain('already been deployed');
  });

  it('applies strategic doctrine bonuses', () => {
    const survivalState = initializeGameState('SURVIVAL_FIRST');
    const scienceState = initializeGameState('SCIENCE_FIRST');

    const previewSurvival = calculateDecisionPreview(survivalState, 'conduct_research');
    const previewScience = calculateDecisionPreview(scienceState, 'conduct_research');

    expect(previewScience.immediateDelta.sciencePoints).toBeGreaterThan(
      previewSurvival.immediateDelta.sciencePoints ?? 0
    );
  });
});

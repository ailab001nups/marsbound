import { describe, it, expect } from 'vitest';
import { initializeGameState, advanceSol, evaluateMissionEnding, runWhatIfSimulation } from '../services/gameEngine';

describe('GameEngine - Core Life Support & Sol Advancement', () => {
  it('initializes valid game state with default survival doctrine', () => {
    const state = initializeGameState('SURVIVAL_FIRST');
    expect(state.currentSol).toBe(1);
    expect(state.resources.oxygen).toBe(75);
    expect(state.resources.power).toBe(80);
    expect(state.resources.food).toBe(70);
    expect(state.resources.water).toBe(70);
    expect(state.secondary.crewHealth).toBe(95);
    expect(state.crew.length).toBe(4);
    expect(state.campaignLength).toBe(30);
  });

  it('correctly calculates production, consumption, and advances Sol', () => {
    const state = initializeGameState('SURVIVAL_FIRST');
    const { updatedState, solLog } = advanceSol(state);

    expect(updatedState.currentSol).toBe(2);
    expect(solLog.sol).toBe(1);
    expect(solLog.production.oxygen).toBeGreaterThan(0);
    expect(solLog.consumption.oxygen).toBeGreaterThan(0);
    expect(updatedState.history.length).toBe(1);
  });

  it('prevents negative resources by clamping to zero', () => {
    const state = initializeGameState('SURVIVAL_FIRST');
    state.resources.oxygen = 2; // Very low
    const { updatedState } = advanceSol(state);
    expect(updatedState.resources.oxygen).toBeGreaterThanOrEqual(0);
  });

  it('accurately evaluates mission ending as SUCCESS when survived 30 sols with healthy crew', () => {
    const state = initializeGameState('SURVIVAL_FIRST');
    state.currentSol = 31;
    state.secondary.crewHealth = 85;
    state.secondary.cumulativeRadiation = 8;
    state.resources = { oxygen: 60, power: 65, food: 70, water: 65 };

    const report = evaluateMissionEnding(state);
    expect(report.outcome).toBe('SUCCESS');
    expect(report.totalScore).toBeGreaterThan(70);
    expect(report.radiationProtectionRating).toBe('A');
  });

  it('triggers MISSION_FAILURE when crew health reaches zero', () => {
    const state = initializeGameState('SURVIVAL_FIRST');
    state.secondary.crewHealth = 0;
    const report = evaluateMissionEnding(state);
    expect(report.outcome).toBe('MISSION_FAILURE');
  });

  it('runs isolated What-If branching simulation without modifying original state', () => {
    const state = initializeGameState('SURVIVAL_FIRST');
    const originalO2 = state.resources.oxygen;

    const whatIf = runWhatIfSimulation(state, 'boost_oxygen', 5);
    expect(whatIf.timelineA.length).toBe(6);
    expect(whatIf.timelineB.length).toBe(6);
    expect(state.resources.oxygen).toBe(originalO2); // Must remain untouched
  });
});

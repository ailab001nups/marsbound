// ==========================================
// MARSBOUND: GAME STATE HOOK WITH LOCALSTORAGE AUTO-SAVE
// ==========================================

import { useState, useEffect, useCallback } from 'react';
import { GameState, StrategyType, EarthMessage } from '../types/game';
import { initializeGameState, advanceSol } from '../services/gameEngine';
import { commitDecision } from '../services/decisionEngine';
import { commitEventChoice as engineCommitEventChoice } from '../services/eventEngine';
import { soundManager } from '../services/soundService';
import { getRadioDelayMinutes } from '../utils/calculations';

const STORAGE_KEY = 'marsbound_mission_state_v1';

export function useGameState() {
  const [state, setState] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure structure validity
        if (parsed && parsed.currentSol && parsed.resources) {
          return parsed;
        }
      }
    } catch (_e) {
      console.warn('Failed to parse saved game from LocalStorage, starting fresh.');
    }
    return initializeGameState('SURVIVAL_FIRST');
  });

  const [hasSavedGame, setHasSavedGame] = useState<boolean>(() => {
    try {
      return !!localStorage.getItem(STORAGE_KEY);
    } catch {
      return false;
    }
  });

  // Auto-save on state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      setHasSavedGame(true);
    } catch (err) {
      console.error('LocalStorage write error:', err);
    }
  }, [state]);

  // Sync sound manager with state setting
  useEffect(() => {
    soundManager.setEnabled(state.settings.soundEnabled);
  }, [state.settings.soundEnabled]);

  const startNewGame = useCallback((strategy: StrategyType) => {
    const newState = initializeGameState(strategy);
    setState(newState);
    soundManager.playConfirm();
  }, []);

  const resetGame = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    const fresh = initializeGameState('SURVIVAL_FIRST');
    setState(fresh);
    setHasSavedGame(false);
  }, []);

  const commitOutpostDecision = useCallback((decisionId: string) => {
    setState((curr) => {
      try {
        const updated = commitDecision(curr, decisionId);
        soundManager.playConfirm();
        return updated;
      } catch (err: any) {
        soundManager.playWarning();
        console.error('Failed to commit decision:', err.message);
        return curr;
      }
    });
  }, []);

  const commitEventChoice = useCallback((choiceId: string) => {
    setState((curr) => {
      try {
        const { updatedState } = engineCommitEventChoice(curr, choiceId);
        soundManager.playConfirm();
        return updatedState;
      } catch (err: any) {
        soundManager.playWarning();
        console.error('Failed to commit event choice:', err.message);
        return curr;
      }
    });
  }, []);

  const advanceToNextSol = useCallback(() => {
    setState((curr) => {
      const { updatedState, unlockedAchievements } = advanceSol(curr);
      soundManager.playSolAdvance();

      if (unlockedAchievements.length > 0) {
        setTimeout(() => {
          soundManager.playAchievement();
        }, 300);
      }

      return updatedState;
    });
  }, []);

  const dismissDailySummary = useCallback(() => {
    setState((curr) => ({
      ...curr,
      gameStatus: 'playing',
    }));
    soundManager.playClick();
  }, []);

  const toggleSound = useCallback(() => {
    setState((curr) => {
      const newEnabled = !curr.settings.soundEnabled;
      soundManager.setEnabled(newEnabled);
      if (newEnabled) soundManager.playClick();
      return {
        ...curr,
        settings: {
          ...curr.settings,
          soundEnabled: newEnabled,
        },
      };
    });
  }, []);

  const toggleReadingMode = useCallback(() => {
    setState((curr) => {
      soundManager.playClick();
      return {
        ...curr,
        settings: {
          ...curr.settings,
          readingMode: !curr.settings.readingMode,
        },
      };
    });
  }, []);

  const toggleHighContrast = useCallback(() => {
    setState((curr) => {
      soundManager.playClick();
      return {
        ...curr,
        settings: {
          ...curr.settings,
          highContrast: !curr.settings.highContrast,
        },
      };
    });
  }, []);

  const sendMessageToEarth = useCallback((topic: string, content: string) => {
    setState((curr) => {
      const delay = getRadioDelayMinutes(curr.currentSol);
      const userMsg: EarthMessage = {
        id: `user-msg-sol${curr.currentSol}-${Date.now()}`,
        sender: 'Commander',
        topic,
        content,
        sentSol: curr.currentSol,
        deliverySol: curr.currentSol + 1,
        delayMinutes: delay,
        isDelivered: false,
      };

      // Houston automated scheduled reply
      const replyMsg: EarthMessage = {
        id: `reply-msg-sol${curr.currentSol}-${Date.now()}`,
        sender: 'Houston Flight Director',
        topic: `Re: ${topic}`,
        content: `Acknowledged packet from Chryse Base. Houston engineering reviewed telemetry. Proceeding with recommendation: Maintain local power autonomy and verify battery bus voltages.`,
        sentSol: curr.currentSol + 1,
        deliverySol: curr.currentSol + 1,
        delayMinutes: delay,
        isDelivered: false,
      };

      soundManager.playConfirm();

      return {
        ...curr,
        commQueue: [...curr.commQueue, userMsg, replyMsg],
      };
    });
  }, []);

  const unlockAchievementManually = useCallback((achievementId: string) => {
    setState((curr) => {
      const target = curr.achievements.find((a) => a.id === achievementId);
      if (!target || target.unlocked) return curr;

      soundManager.playAchievement();

      return {
        ...curr,
        achievements: curr.achievements.map((a) =>
          a.id === achievementId ? { ...a, unlocked: true, unlockedAtSol: curr.currentSol } : a
        ),
      };
    });
  }, []);

  return {
    state,
    hasSavedGame,
    startNewGame,
    resetGame,
    commitOutpostDecision,
    commitEventChoice,
    advanceToNextSol,
    dismissDailySummary,
    toggleSound,
    toggleReadingMode,
    toggleHighContrast,
    sendMessageToEarth,
    unlockAchievementManually,
  };
}

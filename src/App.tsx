// ==========================================
// MARSBOUND: ROOT APPLICATION COMPONENT
// ==========================================

import React, { useState } from 'react';
import { useGameState } from './hooks/useGameState';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { Mission } from './pages/Mission';
import { Academy } from './pages/Academy';
import { NASAData } from './pages/NASAData';
import { Achievements } from './pages/Achievements';
import { GameOver } from './pages/GameOver';
import { CommDelayModal } from './components/CommDelayModal';

export function App() {
  const {
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
  } = useGameState();

  const [activeTab, setActiveTab] = useState<
    'mission' | 'comms' | 'academy' | 'nasa_data' | 'achievements'
  >('mission');

  const [inGame, setInGame] = useState<boolean>(() => {
    // If state has already advanced past Sol 1 or has progress, start in mission
    return state.currentSol > 1 || state.history.length > 0;
  });

  const handleStartMission = (strategy: any) => {
    startNewGame(strategy);
    setInGame(true);
    setActiveTab('mission');
  };

  const handleResumeMission = () => {
    setInGame(true);
    setActiveTab('mission');
  };

  const handleRestartMission = () => {
    resetGame();
    setInGame(false);
    setActiveTab('mission');
  };

  return (
    <div
      className={`min-h-screen bg-[#03050c] text-slate-100 flex flex-col ${
        state.settings.highContrast ? 'high-contrast' : ''
      }`}
    >
      {!inGame ? (
        <Home
          onStartGame={handleStartMission}
          onResumeGame={hasSavedGame ? handleResumeMission : undefined}
          hasSavedGame={hasSavedGame}
          onExploreNasaData={() => {
            setInGame(true);
            setActiveTab('nasa_data');
          }}
          onOpenAcademy={() => {
            setInGame(true);
            setActiveTab('academy');
          }}
        />
      ) : (
        <>
          <Navigation
            state={state}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onToggleSound={toggleSound}
            onToggleReadingMode={toggleReadingMode}
            onToggleHighContrast={toggleHighContrast}
            onResetGame={handleRestartMission}
          />

          <main className="flex-1 pb-12">
            {state.gameStatus === 'game_over' || state.gameStatus === 'victory' ? (
              <GameOver state={state} onRestart={handleRestartMission} />
            ) : activeTab === 'mission' ? (
              <Mission
                state={state}
                onCommitDecision={commitOutpostDecision}
                onCommitEventChoice={commitEventChoice}
                onAdvanceSol={advanceToNextSol}
                onDismissSummary={dismissDailySummary}
              />
            ) : activeTab === 'comms' ? (
              <div className="max-w-5xl mx-auto px-4 py-6">
                <CommDelayModal state={state} onSendMessage={sendMessageToEarth} />
              </div>
            ) : activeTab === 'academy' ? (
              <Academy
                onQuizPassed={(_lessonId) => {
                  unlockAchievementManually('space_scholar');
                }}
              />
            ) : activeTab === 'nasa_data' ? (
              <NASAData />
            ) : activeTab === 'achievements' ? (
              <Achievements state={state} />
            ) : null}
          </main>
        </>
      )}
    </div>
  );
}

export default App;

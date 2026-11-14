// ==========================================
// MARSBOUND: MISSION CONTROL HEADER & NAVIGATION
// ==========================================

import React from 'react';
import {
  Volume2,
  VolumeX,
  BookOpen,
  Eye,
  Radio,
  Compass,
  GraduationCap,
  Database,
  Trophy,
  RotateCcw,
} from 'lucide-react';
import { GameState } from '../types/game';
import { getRadioDelayMinutes } from '../utils/calculations';

interface Props {
  state: GameState;
  activeTab: 'mission' | 'comms' | 'academy' | 'nasa_data' | 'achievements';
  setActiveTab: (tab: 'mission' | 'comms' | 'academy' | 'nasa_data' | 'achievements') => void;
  onToggleSound: () => void;
  onToggleReadingMode: () => void;
  onToggleHighContrast: () => void;
  onResetGame: () => void;
}

export const Navigation: React.FC<Props> = ({
  state,
  activeTab,
  setActiveTab,
  onToggleSound,
  onToggleReadingMode,
  onToggleHighContrast,
  onResetGame,
}) => {
  const commDelay = getRadioDelayMinutes(state.currentSol);
  const unreadComms = state.commQueue.filter((m) => m.isDelivered && m.sender !== 'Commander').length;
  const unlockedCount = state.achievements.filter((a) => a.unlocked).length;

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-cyan-900/40 px-3 sm:px-6 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Sol Indicator */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div
            onClick={() => setActiveTab('mission')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-neon-orange group-hover:scale-105 transition-transform">
              <span className="text-xl">🪐</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-wider text-lg font-display text-white">
                  MARSBOUND
                </span>
                <span className="text-[10px] font-mono uppercase bg-orange-600/30 text-orange-400 border border-orange-500/40 px-2 py-0.5 rounded-full font-bold">
                  NASA 2026
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                CHRYSE PLANITIA RESEARCH BASE
              </div>
            </div>
          </div>

          {/* Sol Badge */}
          <div className="flex items-center gap-3 bg-slate-900/90 border border-cyan-800/40 px-3 py-1.5 rounded-xl">
            <div className="text-center">
              <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                MARTIAN SOL
              </div>
              <div className="text-base font-bold font-mono text-white">
                {String(state.currentSol).padStart(2, '0')}{' '}
                <span className="text-xs text-slate-500">/ 30</span>
              </div>
            </div>

            <div className="h-6 w-px bg-slate-800" />

            <div className="hidden sm:block">
              <div className="text-[10px] font-mono text-slate-400 uppercase">
                STAGE {state.stage}
              </div>
              <div className="text-xs font-semibold text-slate-200">
                {state.stage === 1 && 'Establish Outpost'}
                {state.stage === 2 && 'Survive Challenges'}
                {state.stage === 3 && 'Sustainable Future'}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 justify-center">
          <button
            onClick={() => setActiveTab('mission')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-display transition-all ${
              activeTab === 'mission'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-neon-cyan'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Mission</span>
          </button>

          <button
            onClick={() => setActiveTab('comms')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-display transition-all relative ${
              activeTab === 'comms'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-neon-cyan'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>Earth Comms</span>
            {unreadComms > 0 && (
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping absolute top-1 right-1" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('academy')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-display transition-all ${
              activeTab === 'academy'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-neon-cyan'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Academy</span>
          </button>

          <button
            onClick={() => setActiveTab('nasa_data')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-display transition-all ${
              activeTab === 'nasa_data'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-neon-cyan'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>NASA Data</span>
          </button>

          <button
            onClick={() => setActiveTab('achievements')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-display transition-all ${
              activeTab === 'achievements'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-neon-cyan'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Badges ({unlockedCount})</span>
          </button>
        </nav>

        {/* Accessibility & Settings Controls */}
        <div className="flex items-center gap-2 justify-end w-full md:w-auto">
          {/* Comm Delay Pill */}
          <div
            title={`Simulated one-way radio delay based on current Earth-Mars distance (${commDelay} minutes)`}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-cyan-900/50 text-[11px] font-mono text-cyan-300"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Lag: ~{commDelay}m</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            title={state.settings.soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
            className={`p-2 rounded-lg border transition-all ${
              state.settings.soundEnabled
                ? 'bg-slate-900 text-cyan-400 border-cyan-900/50 hover:border-cyan-500'
                : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300'
            }`}
          >
            {state.settings.soundEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          {/* Easy Reading Mode Toggle */}
          <button
            onClick={onToggleReadingMode}
            title={
              state.settings.readingMode
                ? 'Turn Off Simple Reading Mode'
                : 'Turn On Simple Reading Mode (Ages 7-9)'
            }
            className={`p-2 rounded-lg border transition-all ${
              state.settings.readingMode
                ? 'bg-amber-950/40 text-amber-300 border-amber-600/50 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
          </button>

          {/* High Contrast Toggle */}
          <button
            onClick={onToggleHighContrast}
            title="Toggle High Contrast Mode"
            className={`p-2 rounded-lg border transition-all ${
              state.settings.highContrast
                ? 'bg-cyan-950/40 text-cyan-300 border-cyan-600/50'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Restart Mission Button */}
          <button
            onClick={() => {
              if (
                window.confirm(
                  'Are you sure you want to restart your Mars mission? Current mission progress will reset.'
                )
              ) {
                onResetGame();
              }
            }}
            title="Restart Mission"
            className="p-2 rounded-lg bg-slate-900 text-slate-400 border border-slate-800 hover:text-rose-400 hover:border-rose-900/50 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

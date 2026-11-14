// ==========================================
// MARSBOUND: ACHIEVEMENTS & MISSION HONORS PAGE
// ==========================================

import React, { useState } from 'react';
import { GameState, Achievement } from '../types/game';
import { AchievementCard } from '../components/AchievementCard';
import { Trophy, Award, Sparkles, Filter } from 'lucide-react';

interface Props {
  state: GameState;
}

export const Achievements: React.FC<Props> = ({ state }) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const unlockedCount = state.achievements.filter((a) => a.unlocked).length;
  const totalCount = state.achievements.length;
  const progressPct = Math.round((unlockedCount / totalCount) * 100);

  const categories = [
    { id: 'all', label: 'All Medals' },
    { id: 'survival', label: 'Survival' },
    { id: 'energy', label: 'Power & Grid' },
    { id: 'food', label: 'Agriculture' },
    { id: 'science', label: 'Science' },
    { id: 'water', label: 'Water' },
    { id: 'mastery', label: 'Command Mastery' },
  ];

  const filtered = state.achievements.filter(
    (a) => filterCategory === 'all' || a.category === filterCategory
  );

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/40 shadow-neon-orange">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-orange-400">
                NASA ASTRONAUT CORPS RECOGNITION
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                {unlockedCount} / {totalCount} UNLOCKED ({progressPct}%)
              </span>
            </div>
            <h2 className="text-2xl font-bold font-display text-white mt-0.5">
              Mission Honors & Engineering Badges
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Earn official commendations by balancing resources, protecting crew, and conducting science.
            </p>
          </div>
        </div>

        {/* Progress bar pill */}
        <div className="w-full sm:w-56 p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400">Completion</span>
            <span className="font-bold text-cyan-400">{progressPct}%</span>
          </div>
          <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-cyan-400 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter categories */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        <span className="text-xs font-mono text-slate-400 mr-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Filter:
        </span>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setFilterCategory(c.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
              filterCategory === c.id
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-neon-cyan font-bold'
                : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Grid of Achievement Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((ach) => (
          <AchievementCard key={ach.id} achievement={ach} />
        ))}
      </div>
    </div>
  );
};

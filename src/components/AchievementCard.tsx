// ==========================================
// MARSBOUND: MISSION ACHIEVEMENT CARD
// ==========================================

import React from 'react';
import { Achievement } from '../types/game';
import { Award, Lock, Sparkles, BookOpen } from 'lucide-react';

interface Props {
  achievement: Achievement;
}

export const AchievementCard: React.FC<Props> = ({ achievement }) => {
  return (
    <div
      className={`p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between ${
        achievement.unlocked
          ? 'bg-gradient-to-br from-slate-900 via-cyan-950/20 to-slate-900 border-cyan-500/50 shadow-neon-cyan'
          : 'bg-slate-950/60 border-slate-800/80 opacity-60'
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl border ${
                achievement.unlocked
                  ? 'bg-cyan-500/20 border-cyan-500/40 shadow-neon-cyan'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              {achievement.unlocked ? achievement.icon : <Lock className="w-5 h-5 text-slate-600" />}
            </div>
            <div>
              <h4 className="text-sm font-bold font-display text-white">
                {achievement.title}
              </h4>
              <span className="text-[10px] font-mono uppercase text-cyan-400 font-semibold">
                {achievement.category}
              </span>
            </div>
          </div>

          {achievement.unlocked && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold shrink-0">
              SOL {achievement.unlockedAtSol ?? '✓'}
            </span>
          )}
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mt-1">
          {achievement.description}
        </p>
      </div>

      {/* Educational Fact Callout */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/70 flex items-start gap-1.5 text-[11px] font-mono text-slate-400">
        <BookOpen className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
        <span>NASA Fact: {achievement.educationalFact}</span>
      </div>
    </div>
  );
};

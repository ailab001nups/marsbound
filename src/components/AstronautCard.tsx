// ==========================================
// MARSBOUND: CREW ASTRONAUT CARD
// ==========================================

import React from 'react';
import { Astronaut } from '../types/game';
import { Heart, Smile } from 'lucide-react';
import { getStatusLevel, getStatusColor } from '../utils/calculations';

interface Props {
  astronaut: Astronaut;
}

export const AstronautCard: React.FC<Props> = ({ astronaut }) => {
  const healthStatus = getStatusLevel(astronaut.health);
  const healthColors = getStatusColor(healthStatus);

  return (
    <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/70 backdrop-blur-md flex flex-col justify-between hover:border-cyan-500/40 transition-all">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="text-2xl p-1.5 rounded-lg bg-slate-900 border border-slate-700">
              {astronaut.avatar}
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-100 font-display">
                {astronaut.name}
              </h4>
              <p className="text-[10px] text-cyan-400 font-mono font-medium">
                {astronaut.role}
              </p>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 italic mb-3">
          "{astronaut.quote}"
        </p>
      </div>

      {/* Health & Morale indicators */}
      <div className="space-y-1.5 pt-2 border-t border-slate-800 text-[11px] font-mono">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-slate-400">
            <Heart className="w-3 h-3 text-rose-400" />
            <span>Health</span>
          </span>
          <span className={`font-bold ${healthColors.text}`}>
            {Math.round(astronaut.health)}%
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-slate-400">
            <Smile className="w-3 h-3 text-amber-400" />
            <span>Morale</span>
          </span>
          <span className="font-bold text-amber-300">
            {Math.round(astronaut.morale)}%
          </span>
        </div>
      </div>
    </div>
  );
};

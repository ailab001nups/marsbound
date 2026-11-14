// ==========================================
// MARSBOUND: FUTURE RISKS & DELAYED CONSEQUENCE PANEL
// ==========================================

import React from 'react';
import { GameState } from '../types/game';
import { getUpcomingRisks } from '../services/consequenceEngine';
import { Clock, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

interface Props {
  state: GameState;
}

export const FutureRisks: React.FC<Props> = ({ state }) => {
  const upcomingRisks = getUpcomingRisks(state);

  return (
    <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 backdrop-blur-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold font-display uppercase tracking-wider text-slate-100">
            FUTURE RISKS & DELAYED CONSEQUENCES
          </h3>
        </div>
        <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
          {upcomingRisks.length} Pending
        </span>
      </div>

      {upcomingRisks.length === 0 ? (
        <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center gap-3 text-slate-400">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs">
            <span className="font-semibold text-slate-200">No imminent delayed hazards queued.</span>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Decisions you make today may schedule future risks that appear here with countdown timers.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          {upcomingRisks.map((risk) => {
            const isImminent = risk.solsRemaining <= 1;

            return (
              <div
                key={risk.id}
                className={`p-3 rounded-lg border transition-all ${
                  isImminent
                    ? 'bg-rose-950/40 border-rose-500/60 shadow-[0_0_12px_rgba(244,63,94,0.2)]'
                    : 'bg-slate-950/70 border-amber-900/40'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <AlertTriangle
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        isImminent ? 'text-rose-400 animate-pulse' : 'text-amber-400'
                      }`}
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-100">
                        {risk.title}
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5">
                        {risk.description}
                      </p>
                      {risk.educationalNote && (
                        <div className="mt-1.5 flex items-center gap-1 text-[11px] font-mono text-cyan-300">
                          <Info className="w-3 h-3 text-cyan-400 shrink-0" />
                          <span>NASA Insight: {risk.educationalNote}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Countdown Badge */}
                  <div className="text-right shrink-0">
                    <span
                      className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                        isImminent
                          ? 'bg-rose-500/25 text-rose-300 border-rose-500/50 animate-pulse'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}
                    >
                      {risk.solsRemaining === 1
                        ? 'Triggering Next Sol!'
                        : `In ${risk.solsRemaining} Sols (Sol ${risk.triggerSol})`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

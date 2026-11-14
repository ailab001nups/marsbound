// ==========================================
// MARSBOUND: OUTPOST DECISION PANEL
// ==========================================

import React, { useState } from 'react';
import { OUTPOST_DECISIONS } from '../data/decisions';
import { GameState, DecisionOption } from '../types/game';
import {
  Wind,
  Sprout,
  Shield,
  Microscope,
  ZapOff,
  Droplet,
  SunMedium,
  HeartPulse,
  Hammer,
  Check,
  Lock,
  LucideIcon,
} from 'lucide-react';

interface Props {
  state: GameState;
  onSelectDecision: (decisionId: string) => void;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Wind,
  Sprout,
  Shield,
  Microscope,
  ZapOff,
  Droplet,
  SunMedium,
  HeartPulse,
  Hammer,
};

export const DecisionPanel: React.FC<Props> = ({ state, onSelectDecision }) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Protocols' },
    { id: 'life_support', label: 'Life Support' },
    { id: 'agriculture', label: 'Agriculture' },
    { id: 'energy', label: 'Power & Grid' },
    { id: 'shielding', label: 'Radiation Shielding' },
    { id: 'science', label: 'NASA Science' },
    { id: 'maintenance', label: 'Engineering' },
  ];

  const filteredDecisions = OUTPOST_DECISIONS.filter(
    (d) => filterCategory === 'all' || d.category === filterCategory
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold font-display text-white flex items-center gap-2">
            <span>COMMANDER DECISION CATALOG</span>
            <span className="text-xs font-mono text-cyan-400 font-semibold px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-800">
              {state.decisionsMadeThisSol.length} Deployed Today
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            Every choice has an engineering trade-off. Preview resource deltas before confirming.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setFilterCategory(c.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                filterCategory === c.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-neon-cyan font-bold'
                  : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Decisions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredDecisions.map((decision) => {
          const Icon = ICON_MAP[decision.iconName] || Wind;
          const isExecutedToday = state.decisionsMadeThisSol.includes(decision.id);

          // Check basic affordability
          let cannotAfford = false;
          if (decision.requires) {
            if (decision.requires.power && state.resources.power < decision.requires.power)
              cannotAfford = true;
            if (decision.requires.water && state.resources.water < decision.requires.water)
              cannotAfford = true;
            if (
              decision.requires.materials &&
              state.secondary.materials < decision.requires.materials
            )
              cannotAfford = true;
            if (decision.requires.food && state.resources.food < decision.requires.food)
              cannotAfford = true;
          }

          return (
            <div
              key={decision.id}
              onClick={() => {
                if (!isExecutedToday) {
                  onSelectDecision(decision.id);
                }
              }}
              className={`relative p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                isExecutedToday
                  ? 'bg-slate-950/60 border-slate-800/80 opacity-60 cursor-not-allowed'
                  : cannotAfford
                  ? 'bg-slate-900/40 border-rose-900/40 hover:border-rose-500/60 cursor-pointer'
                  : 'bg-slate-900/90 border-slate-800 hover:border-cyan-500/60 hover:shadow-neon-cyan cursor-pointer group'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`p-2 rounded-lg border ${
                        isExecutedToday
                          ? 'bg-slate-800 text-slate-500 border-slate-700'
                          : 'bg-cyan-950/50 text-cyan-400 border-cyan-800/50 group-hover:scale-105 transition-transform'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100 font-display group-hover:text-cyan-300 transition-colors">
                        {decision.title}
                      </h4>
                      <span className="text-[10px] font-mono uppercase text-slate-400">
                        {decision.category.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {isExecutedToday ? (
                    <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
                      <Check className="w-3 h-3" />
                      <span>Executed</span>
                    </span>
                  ) : cannotAfford ? (
                    <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-500/40">
                      <Lock className="w-3 h-3" />
                      <span>Low Res</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      Ready
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 mt-1">
                  {decision.description}
                </p>
              </div>

              {/* Trade-off summary pill strip */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/70 flex flex-wrap items-center justify-between gap-1 text-[11px] font-mono">
                <div className="flex items-center gap-1 text-emerald-400">
                  <span className="font-bold">+</span>
                  <span>{decision.benefits[0].split('(')[0]}</span>
                </div>
                <div className="flex items-center gap-1 text-rose-400">
                  <span className="font-bold">-</span>
                  <span>{decision.costs[0].split('(')[0]}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

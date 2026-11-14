// ==========================================
// MARSBOUND: MISSION CONTROL DAILY REPORT
// Comprehensive pedagogical end-of-sol debrief
// ==========================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GameState, SolLogRecord } from '../types/game';
import { WhatIfComparison } from './WhatIfComparison';
import {
  CheckCircle2,
  GitBranch,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  HelpCircle,
  Lightbulb,
  Radio,
  Shield,
  Activity,
} from 'lucide-react';

interface Props {
  state: GameState;
  onContinue: () => void;
}

export const DailyReport: React.FC<Props> = ({ state, onContinue }) => {
  const [showWhatIf, setShowWhatIf] = useState<boolean>(false);

  // Get the most recent Sol log record
  const latestLog: SolLogRecord | undefined = state.history[state.history.length - 1];

  if (!latestLog) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-400">Loading daily telemetry...</p>
        <button
          onClick={onContinue}
          className="mt-4 px-6 py-2 rounded-xl bg-cyan-600 text-white font-bold"
        >
          Continue
        </button>
      </div>
    );
  }

  const resourceBreakdown: Array<{
    key: 'oxygen' | 'power' | 'food' | 'water';
    label: string;
    icon: string;
    produced: number;
    consumed: number;
    remaining: number;
    unit: string;
  }> = [
    {
      key: 'oxygen',
      label: 'Oxygen',
      icon: '💨',
      produced: latestLog.production.oxygen,
      consumed: latestLog.consumption.oxygen,
      remaining: Math.round(latestLog.endResources.oxygen),
      unit: '%',
    },
    {
      key: 'power',
      label: 'Electrical Power',
      icon: '⚡',
      produced: latestLog.production.power,
      consumed: latestLog.consumption.power,
      remaining: Math.round(latestLog.endResources.power),
      unit: '%',
    },
    {
      key: 'food',
      label: 'Food Rations',
      icon: '🌱',
      produced: latestLog.production.food,
      consumed: latestLog.consumption.food,
      remaining: Math.round(latestLog.endResources.food),
      unit: '%',
    },
    {
      key: 'water',
      label: 'Recycled Water',
      icon: '💧',
      produced: latestLog.production.water,
      consumed: latestLog.consumption.water,
      remaining: Math.round(latestLog.endResources.water),
      unit: '%',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-4xl bg-slate-900 border border-cyan-500/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border-b border-cyan-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center shadow-neon-cyan">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                  MISSION CONTROL TELEMETRY
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold">
                  SOL {String(latestLog.sol).padStart(2, '0')} COMPLETE
                </span>
              </div>
              <h3 className="text-xl font-bold font-display text-white">
                Daily Mission Debrief & Engineering Analysis
              </h3>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Mission Control Transmission */}
          <div className="p-4 rounded-xl bg-slate-950 border border-cyan-900/50 flex items-start gap-3">
            <Radio className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                Houston Flight Director Transmission:
              </div>
              <p className="text-sm text-slate-200 mt-1 leading-relaxed italic">
                "{latestLog.missionControlMessage}"
              </p>
            </div>
          </div>

          {/* Primary Resources Grid: Consumed, Produced, Remaining */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-3">
              PRIMARY RESOURCE BUDGET (SOL {latestLog.sol})
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {resourceBreakdown.map((res) => {
                const net = res.produced - res.consumed;

                return (
                  <div
                    key={res.key}
                    className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-slate-200">
                        <span>{res.icon}</span>
                        <span>{res.label}</span>
                      </div>
                      <span
                        className={`text-xs font-mono font-bold ${
                          net >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {net >= 0 ? `+${net}` : net}
                        {res.unit}
                      </span>
                    </div>

                    <div className="space-y-1 text-[11px] font-mono text-slate-400">
                      <div className="flex justify-between">
                        <span>Produced:</span>
                        <span className="text-emerald-400 font-semibold">
                          +{res.produced}
                          {res.unit}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Consumed:</span>
                        <span className="text-rose-400 font-semibold">
                          -{res.consumed}
                          {res.unit}
                        </span>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-slate-800">
                        <span className="font-bold text-slate-300">Remaining:</span>
                        <span className="font-bold text-white">
                          {res.remaining}
                          {res.unit}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Secondary Systems: Crew Vitality & Radiation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-950/40 text-emerald-400 border border-emerald-500/40">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-200">Crew Vitality</div>
                  <div className="text-[11px] font-mono text-slate-400">
                    Health status: {latestLog.endSecondary.crewHealth >= 70 ? 'Optimal' : 'Fatigued'}
                  </div>
                </div>
              </div>
              <div className="text-base font-bold font-mono text-emerald-400">
                {Math.round(latestLog.endSecondary.crewHealth)}%
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-cyan-950/40 text-cyan-400 border border-cyan-500/40">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-200">Radiation Exposure</div>
                  <div className="text-[11px] font-mono text-slate-400">
                    Sol Dose: +{latestLog.radiationDoseThisSol} mSv
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-base font-bold font-mono text-cyan-300">
                  {latestLog.endSecondary.cumulativeRadiation} mSv
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  Shield: {Math.round(latestLog.endSecondary.radiationShielding)}%
                </div>
              </div>
            </div>
          </div>

          {/* SIGNATURE 4 PEDAGOGICAL QUESTIONS */}
          <div className="p-4 rounded-xl bg-slate-950/90 border border-cyan-800/40 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>ASTRONAUT ENGINEERING REFLECTION</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-bold text-cyan-300 block mb-1">1. What happened?</span>
                <p className="text-slate-300">{latestLog.pedagogicalInsights.whatHappened}</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-bold text-amber-300 block mb-1">2. Why did it happen?</span>
                <p className="text-slate-300">{latestLog.pedagogicalInsights.whyItHappened}</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-bold text-orange-300 block mb-1">3. What could happen next?</span>
                <p className="text-slate-300">
                  {latestLog.pedagogicalInsights.whatCouldHappenNext}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-bold text-emerald-300 block mb-1">4. What did you learn?</span>
                <p className="text-slate-300">{latestLog.pedagogicalInsights.whatDidYouLearn}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => setShowWhatIf(true)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold font-display uppercase tracking-wider flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-800/60 shadow-neon-cyan transition-all"
          >
            <GitBranch className="w-4 h-4" />
            <span>EXPLORE WHAT IF TIMELINES</span>
          </button>

          <button
            onClick={onContinue}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold font-display uppercase tracking-wider flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white shadow-neon-orange transition-all hover:scale-105"
          >
            <span>PROCEED TO SOL {state.currentSol}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* What If Comparator Modal */}
      {showWhatIf && (
        <WhatIfComparison state={state} onClose={() => setShowWhatIf(false)} />
      )}
    </div>
  );
};

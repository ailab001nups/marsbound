// ==========================================
// MARSBOUND: INTERACTIVE DECISION PREVIEW MODAL
// ==========================================

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';
import { GameState } from '../types/game';
import { calculateDecisionPreview } from '../services/decisionEngine';

interface Props {
  state: GameState;
  decisionId: string | null;
  onClose: () => void;
  onConfirm: (decisionId: string) => void;
}

export const DecisionPreview: React.FC<Props> = ({
  state,
  decisionId,
  onClose,
  onConfirm,
}) => {
  if (!decisionId) return null;

  const preview = calculateDecisionPreview(state, decisionId);
  const { decision, isValid, canAfford, reason, immediateDelta, projectedResources, projectedSecondary, delayedRisk } =
    preview;

  const primaryKeys: Array<{ key: 'oxygen' | 'power' | 'food' | 'water'; label: string; icon: string }> = [
    { key: 'oxygen', label: 'Oxygen', icon: '💨' },
    { key: 'power', label: 'Power', icon: '⚡' },
    { key: 'food', label: 'Food', icon: '🌱' },
    { key: 'water', label: 'Water', icon: '💧' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          className="w-full max-w-2xl bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border-b border-cyan-900/40 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                  COMMANDER DECISION PREVIEW
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300">
                  SOL {state.currentSol}
                </span>
              </div>
              <h3 className="text-xl font-bold font-display text-white mt-0.5">
                {decision.title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto space-y-5">
            {/* Description */}
            <p className="text-sm text-slate-300 leading-relaxed">
              {decision.description}
            </p>

            {/* Error / Resource Requirement Block if cannot afford */}
            {!canAfford && (
              <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/60 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-rose-300">Action Unavailable</h4>
                  <p className="text-xs text-rose-200 mt-0.5">{reason}</p>
                </div>
              </div>
            )}

            {/* SIDE-BY-SIDE RESOURCE IMPACT TABLE */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2.5 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Simulated Resource Impact</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {primaryKeys.map(({ key, label, icon }) => {
                  const currentVal = Math.round(state.resources[key]);
                  const delta = immediateDelta[key] ?? 0;
                  const afterVal = Math.round(projectedResources[key]);

                  return (
                    <div
                      key={key}
                      className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{icon}</span>
                        <div>
                          <div className="text-xs font-bold text-slate-200">{label}</div>
                          <div className="text-[11px] font-mono text-slate-400">
                            Current: <span className="font-semibold text-white">{currentVal}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Delta Indicator */}
                      <div className="flex items-center gap-2">
                        {delta !== 0 ? (
                          <div
                            className={`flex items-center gap-1 text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                              delta > 0
                                ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-500/40'
                                : 'bg-rose-950/70 text-rose-400 border border-rose-500/40'
                            }`}
                          >
                            {delta > 0 ? (
                              <TrendingUp className="w-3 h-3" />
                            ) : (
                              <TrendingDown className="w-3 h-3" />
                            )}
                            <span>{delta > 0 ? `+${delta}` : delta}%</span>
                          </div>
                        ) : (
                          <span className="text-xs font-mono text-slate-500">No change</span>
                        )}

                        <ArrowRight className="w-3.5 h-3.5 text-slate-600" />

                        <div
                          className={`text-sm font-mono font-bold ${
                            afterVal >= 60
                              ? 'text-emerald-400'
                              : afterVal >= 35
                              ? 'text-amber-400'
                              : 'text-rose-400'
                          }`}
                        >
                          {afterVal}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Secondary Systems Impact (Shielding, Materials, Science, Crew Health) */}
            {(immediateDelta.radiationShielding ||
              immediateDelta.materials ||
              immediateDelta.sciencePoints ||
              immediateDelta.crewHealth) && (
              <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-800/40">
                <div className="text-xs font-mono uppercase text-cyan-400 font-bold mb-1.5">
                  Secondary Systems Impact:
                </div>
                <div className="flex flex-wrap gap-3 text-xs font-mono">
                  {immediateDelta.radiationShielding && (
                    <span className="text-cyan-300 font-semibold">
                      Shielding: {immediateDelta.radiationShielding > 0 ? '+' : ''}
                      {immediateDelta.radiationShielding}%
                    </span>
                  )}
                  {immediateDelta.materials && (
                    <span
                      className={
                        immediateDelta.materials > 0 ? 'text-emerald-400' : 'text-amber-400'
                      }
                    >
                      Materials: {immediateDelta.materials > 0 ? '+' : ''}
                      {immediateDelta.materials} units
                    </span>
                  )}
                  {immediateDelta.sciencePoints && (
                    <span className="text-purple-300 font-bold">
                      Science: +{immediateDelta.sciencePoints} pts
                    </span>
                  )}
                  {immediateDelta.crewHealth && (
                    <span
                      className={
                        immediateDelta.crewHealth > 0 ? 'text-emerald-400' : 'text-rose-400'
                      }
                    >
                      Crew Health: {immediateDelta.crewHealth > 0 ? '+' : ''}
                      {immediateDelta.crewHealth}%
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Benefits & Costs breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/40">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Immediate Benefits</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {decision.benefits.map((b, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/40">
                <div className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Engineering Costs</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {decision.costs.map((c, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-rose-400 font-bold">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Delayed Consequence Warning (Signature Engine Feature) */}
            {delayedRisk && (
              <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/50">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300 uppercase">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Delayed Consequence Alert: In {delayedRisk.delaySols} Sols (Sol {state.currentSol + delayedRisk.delaySols})</span>
                </div>
                <div className="text-sm font-bold text-slate-100 mt-1">
                  {delayedRisk.title}
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  {delayedRisk.description}
                </p>
                <div className="mt-2 text-[11px] font-mono text-cyan-300 flex items-start gap-1.5 bg-slate-950/60 p-2 rounded-lg">
                  <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>NASA Fact: {delayedRisk.educationalNote}</span>
                </div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              CHANGE STRATEGY (CANCEL)
            </button>

            <button
              onClick={() => {
                if (canAfford) {
                  onConfirm(decisionId);
                  onClose();
                }
              }}
              disabled={!canAfford}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold font-display uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                canAfford
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white shadow-neon-orange cursor-pointer hover:scale-105'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>CONFIRM DECISION</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// ==========================================
// MARSBOUND: MISSION COMPLETION & ENDING REPORT CARD
// ==========================================

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { GameState } from '../types/game';
import { evaluateMissionEnding } from '../services/gameEngine';
import {
  Trophy,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  ShieldAlert,
  Activity,
  Award,
  BookOpen,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface Props {
  state: GameState;
  onRestart: () => void;
}

export const GameOver: React.FC<Props> = ({ state, onRestart }) => {
  const report = evaluateMissionEnding(state);

  const isSuccess = report.outcome === 'SUCCESS';
  const isPartial = report.outcome === 'PARTIAL_SUCCESS';
  const isEvacuation = report.outcome === 'EMERGENCY_EVACUATION';
  const isFailure = report.outcome === 'MISSION_FAILURE';

  useEffect(() => {
    if (isSuccess || (isPartial && report.totalScore >= 70)) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f97316', '#06b6d4', '#10b981', '#eab308'],
      });
    }
  }, [isSuccess, isPartial, report.totalScore]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Banner */}
      <div
        className={`p-6 rounded-2xl border text-center space-y-3 relative overflow-hidden shadow-2xl ${
          isSuccess
            ? 'bg-gradient-to-br from-slate-900 via-emerald-950/40 to-slate-900 border-emerald-500/60 shadow-[0_0_30px_rgba(16,185,129,0.3)]'
            : isPartial
            ? 'bg-gradient-to-br from-slate-900 via-cyan-950/40 to-slate-900 border-cyan-500/60 shadow-neon-cyan'
            : isEvacuation
            ? 'bg-gradient-to-br from-slate-900 via-amber-950/40 to-slate-900 border-amber-500/60'
            : 'bg-gradient-to-br from-slate-900 via-rose-950/40 to-slate-900 border-rose-500/60'
        }`}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-slate-950 border border-slate-700">
          {isSuccess && '🏆 OUTPOST SUSTAINABILITY ACHIEVED'}
          {isPartial && '⚖️ 30-SOL MARS MISSION COMPLETED'}
          {isEvacuation && '🚨 EMERGENCY MISSION ABORT'}
          {isFailure && '⚠️ MISSION CRITICAL SHUTDOWN'}
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
          {isSuccess && 'Mission Success: Martian Colony Established!'}
          {isPartial && 'Mission Completed with Hard Engineering Compromises'}
          {isEvacuation && 'Outpost Evacuated: Safety Over Extension'}
          {isFailure && 'Mission Terminated Early: Life Support Depleted'}
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {report.feedbackSummary}
        </p>

        {/* Score Ring */}
        <div className="pt-2 flex justify-center">
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/40 inline-flex items-center gap-4">
            <div className="text-center">
              <div className="text-[10px] font-mono uppercase text-slate-400">Total Engineering Score</div>
              <div className="text-4xl font-extrabold font-mono text-cyan-400">
                {report.totalScore}
                <span className="text-sm font-normal text-slate-400"> / 100</span>
              </div>
            </div>

            <div className="h-10 w-px bg-slate-800" />

            <div className="text-center">
              <div className="text-[10px] font-mono uppercase text-slate-400">Radiation Grade</div>
              <div
                className={`text-3xl font-extrabold font-mono ${
                  report.radiationProtectionRating === 'A+' || report.radiationProtectionRating === 'A'
                    ? 'text-emerald-400'
                    : report.radiationProtectionRating === 'B'
                    ? 'text-cyan-400'
                    : 'text-amber-400'
                }`}
              >
                {report.radiationProtectionRating}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* METRIC BREAKDOWN GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-xs font-mono">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-slate-400 uppercase">Sols Survived</div>
          <div className="text-xl font-bold text-white">
            {report.survivedSols} / 30
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-slate-400 uppercase">Crew Vitality</div>
          <div className="text-xl font-bold text-emerald-400">
            {report.crewSurvivalRate}%
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-slate-400 uppercase">Resource Buffer</div>
          <div className="text-xl font-bold text-cyan-400">
            {report.resourceEfficiency}%
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-slate-400 uppercase">Science Points</div>
          <div className="text-xl font-bold text-purple-400">
            {report.sciencePointsCollected} pts
          </div>
        </div>
      </div>

      {/* KEY PEDAGOGICAL LESSONS LEARNED */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-cyan-800/40 space-y-3 shadow-xl">
        <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span>KEY SPACE ENGINEERING PRINCIPLES YOU EXPERIENCED</span>
        </h3>

        <div className="space-y-2.5">
          {report.keyLessonsLearned.map((lesson, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 flex items-start gap-2.5"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{lesson}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Restart Button */}
      <div className="flex justify-center pt-2">
        <button
          onClick={onRestart}
          className="px-8 py-3.5 rounded-xl font-extrabold font-display text-sm tracking-wider uppercase bg-gradient-to-r from-orange-500 via-rose-600 to-red-600 hover:from-orange-400 hover:to-red-500 text-white shadow-neon-orange flex items-center gap-2 hover:scale-105 transition-all"
        >
          <RotateCcw className="w-5 h-5" />
          <span>LAUNCH NEW 30-SOL EXPEDITION</span>
        </button>
      </div>
    </div>
  );
};

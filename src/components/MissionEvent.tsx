// ==========================================
// MARSBOUND: MISSION EVENT ALERT CARD
// ==========================================

import React from 'react';
import { MissionEvent as MissionEventType } from '../types/game';
import { DataTransparencyBadge } from './DataTransparencyBadge';
import {
  AlertOctagon,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';

interface Props {
  event: MissionEventType | null;
  selectedChoiceId: string | null;
  onSelectChoice: (choiceId: string) => void;
}

export const MissionEvent: React.FC<Props> = ({
  event,
  selectedChoiceId,
  onSelectChoice,
}) => {
  if (!event) return null;

  const isCritical = event.severity === 'danger' || event.severity === 'critical';
  const isBreakthrough = event.severity === 'breakthrough';

  return (
    <div
      className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
        isCritical
          ? 'bg-gradient-to-br from-slate-900 via-rose-950/30 to-slate-900 border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.25)]'
          : isBreakthrough
          ? 'bg-gradient-to-br from-slate-900 via-emerald-950/30 to-slate-900 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
          : 'bg-gradient-to-br from-slate-900 via-amber-950/25 to-slate-900 border-amber-500/40'
      }`}
    >
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          {isCritical ? (
            <AlertOctagon className="w-5 h-5 text-rose-400 animate-pulse" />
          ) : isBreakthrough ? (
            <Sparkles className="w-5 h-5 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          )}

          <span
            className={`text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
              isCritical
                ? 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                : isBreakthrough
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                : 'bg-amber-950/80 text-amber-300 border-amber-500/40'
            }`}
          >
            {event.severity.toUpperCase()} EVENT DETECTED
          </span>
        </div>

        {/* NASA Data Transparency Badge */}
        {event.nasaRef && (
          <DataTransparencyBadge
            type={event.nasaRef.dataType}
            sourceText={`${event.nasaRef.source}: ${event.nasaRef.identifier}`}
          />
        )}
      </div>

      {/* Title & Description */}
      <h3 className="text-lg font-bold font-display text-white mb-1.5">
        {event.title}
      </h3>
      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
        {event.description}
      </p>

      {/* Scientific Context callout */}
      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-400 flex items-start gap-2 mb-4">
        <BookOpen className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-cyan-300 font-mono">NASA Science Note: </span>
          <span>{event.scientificContext}</span>
        </div>
      </div>

      {/* Interactive Choices Grid */}
      <div className="space-y-3">
        <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
          COMMANDER DIRECTIVE (SELECT RESPONSE):
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {event.choices.map((choice) => {
            const isSelected = selectedChoiceId === choice.id;

            return (
              <button
                key={choice.id}
                onClick={() => onSelectChoice(choice.id)}
                className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-cyan-950/50 border-cyan-400 shadow-neon-cyan'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-600 hover:bg-slate-950'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-xs font-bold text-slate-100 font-display">
                      {choice.text}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    )}
                  </div>

                  {choice.strategyHint && (
                    <span className="inline-block text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 mb-2">
                      💡 {choice.strategyHint}
                    </span>
                  )}

                  <p className="text-[11px] text-slate-400 mb-2">
                    {choice.outcomeDescription}
                  </p>
                </div>

                {/* Resource Impact Preview */}
                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-2 text-[10px] font-mono">
                  {choice.impact.power && (
                    <span
                      className={
                        choice.impact.power > 0 ? 'text-emerald-400' : 'text-rose-400'
                      }
                    >
                      Power: {choice.impact.power > 0 ? '+' : ''}
                      {choice.impact.power}%
                    </span>
                  )}
                  {choice.impact.oxygen && (
                    <span
                      className={
                        choice.impact.oxygen > 0 ? 'text-emerald-400' : 'text-rose-400'
                      }
                    >
                      O2: {choice.impact.oxygen > 0 ? '+' : ''}
                      {choice.impact.oxygen}%
                    </span>
                  )}
                  {choice.impact.food && (
                    <span
                      className={
                        choice.impact.food > 0 ? 'text-emerald-400' : 'text-rose-400'
                      }
                    >
                      Food: {choice.impact.food > 0 ? '+' : ''}
                      {choice.impact.food}%
                    </span>
                  )}
                  {choice.impact.water && (
                    <span
                      className={
                        choice.impact.water > 0 ? 'text-emerald-400' : 'text-rose-400'
                      }
                    >
                      Water: {choice.impact.water > 0 ? '+' : ''}
                      {choice.impact.water}%
                    </span>
                  )}
                  {choice.impact.sciencePoints && (
                    <span className="text-purple-300 font-bold">
                      Science: +{choice.impact.sciencePoints}
                    </span>
                  )}
                  {choice.impact.crewHealth && (
                    <span
                      className={
                        choice.impact.crewHealth > 0 ? 'text-emerald-400' : 'text-rose-400'
                      }
                    >
                      Health: {choice.impact.crewHealth > 0 ? '+' : ''}
                      {choice.impact.crewHealth}%
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

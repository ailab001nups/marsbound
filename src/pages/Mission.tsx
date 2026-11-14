// ==========================================
// MARSBOUND: MISSION CONTROL DASHBOARD (CORE GAMEPLAY)
// ==========================================

import React, { useState } from 'react';
import { GameState } from '../types/game';
import { ResourceBar } from '../components/ResourceBar';
import { MarsHabitat } from '../components/MarsHabitat';
import { AstronautCard } from '../components/AstronautCard';
import { MissionEvent } from '../components/MissionEvent';
import { DecisionPanel } from '../components/DecisionPanel';
import { DecisionPreview } from '../components/DecisionPreview';
import { FutureRisks } from '../components/FutureRisks';
import { DailyReport } from '../components/DailyReport';
import {
  Shield,
  Activity,
  Hammer,
  Microscope,
  Radiation,
  ArrowRight,
  AlertTriangle,
  Play,
  RotateCcw,
} from 'lucide-react';

interface Props {
  state: GameState;
  onCommitDecision: (decisionId: string) => void;
  onCommitEventChoice: (choiceId: string) => void;
  onAdvanceSol: () => void;
  onDismissSummary: () => void;
}

export const Mission: React.FC<Props> = ({
  state,
  onCommitDecision,
  onCommitEventChoice,
  onAdvanceSol,
  onDismissSummary,
}) => {
  const [selectedDecisionId, setSelectedDecisionId] = useState<string | null>(null);

  // Check if there is an active event that hasn't had a choice selected yet
  const hasUnresolvedEvent = state.activeEvent && !state.selectedEventChoiceId;

  const handleAdvanceClick = () => {
    if (hasUnresolvedEvent) {
      alert(
        `Commander Alert: Please select an engineering directive for the active event "${state.activeEvent?.title}" before advancing the Sol!`
      );
      return;
    }
    onAdvanceSol();
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* PRIMARY 4 RESOURCES HEADER */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>PRIMARY LIFE SUPPORT & POWER GRID</span>
          </h2>
          <span className="text-xs font-mono text-slate-400">
            Strategy Doctrine: <strong className="text-orange-400">{state.strategy.replace('_', ' ')}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <ResourceBar
            resourceKey="oxygen"
            label="Oxygen (O2)"
            value={state.resources.oxygen}
            deltaPerSol={state.history.length > 0 ? state.history[state.history.length - 1].netChange.oxygen : 0}
            description="Breathing air for 4 crew & pressurized module"
            simplifiedMode={state.settings.readingMode}
          />
          <ResourceBar
            resourceKey="power"
            label="Electrical Power"
            value={state.resources.power}
            deltaPerSol={state.history.length > 0 ? state.history[state.history.length - 1].netChange.power : 0}
            description="Photovoltaic solar grid & battery banks"
            simplifiedMode={state.settings.readingMode}
          />
          <ResourceBar
            resourceKey="food"
            label="Food Reserves"
            value={state.resources.food}
            deltaPerSol={state.history.length > 0 ? state.history[state.history.length - 1].netChange.food : 0}
            description="Hydroponic aeroponic greens & rations"
            simplifiedMode={state.settings.readingMode}
          />
          <ResourceBar
            resourceKey="water"
            label="Recycled Water"
            value={state.resources.water}
            deltaPerSol={state.history.length > 0 ? state.history[state.history.length - 1].netChange.water : 0}
            description="ECLSS distillation & subsurface ice reserves"
            simplifiedMode={state.settings.readingMode}
          />
        </div>
      </div>

      {/* SECONDARY SYSTEMS METRIC BAR */}
      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-cyan-400 shrink-0" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase">Radiation Shielding</div>
            <div className="text-sm font-bold text-slate-100">
              {Math.round(state.secondary.radiationShielding)}%
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase">Crew Vitality</div>
            <div className="text-sm font-bold text-emerald-300">
              {Math.round(state.secondary.crewHealth)}%
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Hammer className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase">Construction Materials</div>
            <div className="text-sm font-bold text-amber-300">
              {Math.round(state.secondary.materials)} units
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Microscope className="w-4 h-4 text-purple-400 shrink-0" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase">NASA Science Points</div>
            <div className="text-sm font-bold text-purple-300">
              {state.secondary.sciencePoints} pts
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
          <Radiation className="w-4 h-4 text-rose-400 shrink-0" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase">Cumulative Radiation</div>
            <div className="text-sm font-bold text-rose-300">
              {state.secondary.cumulativeRadiation} mSv
            </div>
          </div>
        </div>
      </div>

      {/* MARS HABITAT GRAPHICAL SIMULATION */}
      <MarsHabitat state={state} />

      {/* ACTIVE MISSION EVENT ALERT (IF ANY) */}
      {state.activeEvent && (
        <MissionEvent
          event={state.activeEvent}
          selectedChoiceId={state.selectedEventChoiceId}
          onSelectChoice={onCommitEventChoice}
        />
      )}

      {/* 4 ASTRONAUTS MANIFEST */}
      <div className="space-y-2">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
          CHRYSE CREW MANIFEST (4 EXPEDITION MEMBERS)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {state.crew.map((astronaut) => (
            <AstronautCard key={astronaut.id} astronaut={astronaut} />
          ))}
        </div>
      </div>

      {/* FUTURE RISKS PANEL */}
      <FutureRisks state={state} />

      {/* COMMANDER DECISIONS CATALOG */}
      <DecisionPanel
        state={state}
        onSelectDecision={(id) => setSelectedDecisionId(id)}
      />

      {/* BOTTOM ACTION BAR: ADVANCE TO NEXT SOL */}
      <div className="sticky bottom-3 z-30 p-4 rounded-2xl bg-slate-950/95 backdrop-blur-md border border-cyan-800/60 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
            CHRYSE BASE COMMAND AUTHORITY
          </div>
          <div className="text-sm text-slate-200 mt-0.5">
            {state.decisionsMadeThisSol.length === 0 ? (
              <span className="text-slate-400">
                You haven’t deployed any decisions this Sol. You can advance or make engineering adjustments.
              </span>
            ) : (
              <span className="text-emerald-300 font-semibold">
                ✓ {state.decisionsMadeThisSol.length} decision(s) deployed for Sol {state.currentSol}. Ready to advance!
              </span>
            )}
          </div>
        </div>

        <button
          onClick={handleAdvanceClick}
          className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-extrabold font-display text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-neon-orange transition-all hover:scale-105 cursor-pointer ${
            hasUnresolvedEvent
              ? 'bg-amber-600 hover:bg-amber-500 text-white animate-pulse'
              : 'bg-gradient-to-r from-orange-500 via-rose-600 to-red-600 hover:from-orange-400 hover:to-red-500 text-white'
          }`}
        >
          <span>ADVANCE TO SOL {state.currentSol + 1}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* INTERACTIVE DECISION PREVIEW MODAL */}
      {selectedDecisionId && (
        <DecisionPreview
          state={state}
          decisionId={selectedDecisionId}
          onClose={() => setSelectedDecisionId(null)}
          onConfirm={onCommitDecision}
        />
      )}

      {/* DAILY REPORT MODAL AT SOL END */}
      {state.gameStatus === 'sol_summary' && (
        <DailyReport state={state} onContinue={onDismissSummary} />
      )}
    </div>
  );
};

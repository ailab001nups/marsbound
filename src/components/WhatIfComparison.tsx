// ==========================================
// MARSBOUND: "WHAT IF I CHOSE DIFFERENTLY?" TIMELINE COMPARATOR
// Signature Pedagogical Branching Feature
// ==========================================

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { GameState } from '../types/game';
import { OUTPOST_DECISIONS } from '../data/decisions';
import { runWhatIfSimulation } from '../services/gameEngine';
import { GitBranch, Sparkles, TrendingUp, TrendingDown, ArrowRight, XCircle } from 'lucide-react';

interface Props {
  state: GameState;
  onClose: () => void;
}

export const WhatIfComparison: React.FC<Props> = ({ state, onClose }) => {
  const [selectedAltDecision, setSelectedAltDecision] = useState<string>(
    OUTPOST_DECISIONS[1].id
  );
  const [activeMetric, setActiveMetric] = useState<
    'oxygen' | 'power' | 'food' | 'water' | 'health' | 'science'
  >('power');

  const simulationResult = runWhatIfSimulation(state, selectedAltDecision, 5);
  const altDecisionObj = OUTPOST_DECISIONS.find((d) => d.id === selectedAltDecision);

  // Combine timeline A and timeline B for Recharts
  const chartData = simulationResult.timelineA.map((pointA, idx) => {
    const pointB = simulationResult.timelineB[idx] || pointA;
    return {
      sol: `Sol ${pointA.sol}`,
      [activeMetric + '_A']: pointA[activeMetric],
      [activeMetric + '_B']: pointB[activeMetric],
    };
  });

  const metrics: Array<{
    key: 'oxygen' | 'power' | 'food' | 'water' | 'health' | 'science';
    label: string;
    unit: string;
  }> = [
    { key: 'power', label: 'Electrical Power', unit: '%' },
    { key: 'oxygen', label: 'Oxygen Reserves', unit: '%' },
    { key: 'food', label: 'Food Stores', unit: '%' },
    { key: 'water', label: 'Water Purified', unit: '%' },
    { key: 'health', label: 'Crew Vitality', unit: '%' },
    { key: 'science', label: 'NASA Science Points', unit: 'pts' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md">
      <div className="w-full max-w-4xl bg-slate-900 border border-cyan-500/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border-b border-cyan-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-neon-cyan">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                  PARALLEL MULTIVERSE SIMULATOR
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  SANDBOX PROJECTION (DOES NOT ALTER MISSION)
                </span>
              </div>
              <h3 className="text-xl font-bold font-display text-white">
                What If I Chose Differently?
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Decision Selector */}
          <div>
            <label className="text-xs font-mono font-bold text-slate-300 uppercase block mb-2">
              Select an Alternative Engineering Decision to Test:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {OUTPOST_DECISIONS.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedAltDecision(d.id)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                    selectedAltDecision === d.id
                      ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200 font-bold shadow-neon-cyan'
                      : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold truncate">{d.title}</div>
                  <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                    {d.category.replace('_', ' ')}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
            <span className="text-xs font-mono text-slate-400 mr-2">Track Metric:</span>
            {metrics.map((m) => (
              <button
                key={m.key}
                onClick={() => setActiveMetric(m.key)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                  activeMetric === m.key
                    ? 'bg-orange-500/20 text-orange-300 border border-orange-500/50 font-bold shadow-neon-orange'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Side by Side Divergence Chart */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center justify-between mb-3 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-cyan-400" />
                <span className="text-cyan-300 font-bold">Timeline A (Actual Path)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-orange-400" />
                <span className="text-orange-300 font-bold">
                  Timeline B (With {altDecisionObj?.title})
                </span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="sol" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#06b6d4',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Line
                    type="monotone"
                    name="Timeline A (Actual)"
                    dataKey={`${activeMetric}_A`}
                    stroke="#22d3ee"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#22d3ee' }}
                  />
                  <Line
                    type="monotone"
                    name="Timeline B (Alternative)"
                    dataKey={`${activeMetric}_B`}
                    stroke="#f97316"
                    strokeWidth={3}
                    strokeDasharray="4 4"
                    dot={{ r: 4, fill: '#f97316' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Child-friendly Insight Box */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-cyan-900/40 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed text-slate-300">
              <span className="font-bold text-white font-display">
                What this 5-Sol projection teaches:
              </span>
              <p className="mt-1">
                Notice how changing a single choice branches the future! Choosing{' '}
                <strong className="text-orange-300">{altDecisionObj?.title}</strong> shifts the curve:
                some resources rise while others drop. In space engineering, every action triggers a
                chain reaction.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-xs font-bold font-display uppercase tracking-wider bg-cyan-600 hover:bg-cyan-500 text-white shadow-neon-cyan transition-all"
          >
            Return to Mission Control
          </button>
        </div>
      </div>
    </div>
  );
};

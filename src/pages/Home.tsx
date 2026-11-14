// ==========================================
// MARSBOUND: INTRODUCTION & STRATEGY SELECTION SCREEN
// ==========================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StrategyType } from '../types/game';
import {
  Rocket,
  Shield,
  Microscope,
  RotateCw,
  BookOpen,
  Database,
  Play,
  HelpCircle,
  XCircle,
  ArrowRight,
  Check,
} from 'lucide-react';

interface Props {
  onStartGame: (strategy: StrategyType) => void;
  onResumeGame?: () => void;
  hasSavedGame: boolean;
  onExploreNasaData: () => void;
  onOpenAcademy: () => void;
}

export const Home: React.FC<Props> = ({
  onStartGame,
  onResumeGame,
  hasSavedGame,
  onExploreNasaData,
  onOpenAcademy,
}) => {
  const [selectedStrategy, setSelectedStrategy] = useState<StrategyType>('SURVIVAL_FIRST');
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);

  const strategies: Array<{
    type: StrategyType;
    title: string;
    icon: string;
    color: string;
    description: string;
    focusList: string[];
    bonuses: string[];
    tradeOff: string;
  }> = [
    {
      type: 'SURVIVAL_FIRST',
      title: 'Survival First',
      icon: '🛡️',
      color: 'from-orange-500 to-amber-600',
      description: 'Prioritize crew life support, robust radiation shielding, and emergency reserves.',
      focusList: ['Oxygen Reserves', 'Food Production', 'Crew Vitality', 'Storm Shelters'],
      bonuses: [
        '+15% Life support O2 synthesis efficiency',
        '+15 extra starting Construction Materials',
        '+20% crew health recovery from rest cycles',
      ],
      tradeOff: 'Scientific research output is 20% slower.',
    },
    {
      type: 'SCIENCE_FIRST',
      title: 'Science First',
      icon: '🔬',
      color: 'from-purple-500 to-indigo-600',
      description: 'Prioritize Martian geology, ancient biosignatures, and deep space research telemetry.',
      focusList: ['Spectrometry Scans', 'Rock Drilling', 'NASA OSDR Studies', 'Data Transmissions'],
      bonuses: [
        '+40% bonus Science Points from experiments',
        'Starts with +25 bonus Science Points',
        'Unlocks advanced NASA biology insights earlier',
      ],
      tradeOff: 'Scientific spectrometry draws extra electrical power (+2 Power cost).',
    },
    {
      type: 'SUSTAINABILITY_FIRST',
      title: 'Sustainability First',
      icon: '🌱',
      color: 'from-emerald-500 to-teal-600',
      description: 'Prioritize closed-loop water purification, hydroponic crop yields, and solar longevity.',
      focusList: ['Water Distillation', 'Aeroponic Crops', 'Solar Dust Defense', 'Recycled Hardware'],
      bonuses: [
        '+20% Water recycling efficiency in closed loops',
        '+15% faster hydroponic food harvest',
        'Photovoltaic solar dust accumulation rate is 25% lower',
      ],
      tradeOff: 'Initial habitat radiation shielding starts leaner (52% vs 65%).',
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#03050c] text-white flex flex-col justify-between overflow-hidden">
      {/* Dynamic Animated Cosmic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-950/20 via-[#070b16] to-[#03050c] pointer-events-none" />

      {/* Grid overlay for futuristic mission control HUD feel */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #06b6d4 1px, transparent 1px), linear-gradient(to bottom, #06b6d4 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Main Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 sm:py-12 my-auto flex flex-col items-center text-center space-y-8">
        {/* Hackathon Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/40 text-xs font-mono text-cyan-300 shadow-neon-cyan"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-bold">NASA SPACE APPS / STEM HACKATHON EDITION</span>
          <span className="text-slate-500">|</span>
          <span className="text-orange-400 font-semibold">AGES 7–12</span>
        </motion.div>

        {/* Title & Tagline */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="space-y-3"
        >
          <h1 className="text-5xl sm:text-7xl font-black font-display tracking-wider bg-gradient-to-r from-orange-400 via-rose-500 to-amber-300 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(249,115,22,0.4)]">
            MARSBOUND
          </h1>
          <div className="text-xl sm:text-2xl font-bold font-mono tracking-widest text-slate-200 uppercase">
            SURVIVE THE RED PLANET
          </div>
          <p className="text-xs sm:text-sm font-mono text-cyan-400 tracking-wider font-semibold">
            EVERY CHOICE HAS A COST. EVERY RESOURCE MATTERS.
          </p>
        </motion.div>

        {/* Narrative Teaser */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl bg-slate-900/80 backdrop-blur-md p-5 rounded-2xl border border-cyan-900/50 space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed shadow-xl"
        >
          <p className="font-semibold text-slate-100">
            "Humanity has reached Mars. Your crew is ready. Your supplies are limited."
          </p>
          <p className="text-slate-400">
            "Solar storms, dust storms, equipment failures, and resource shortages are waiting."
          </p>
          <p className="font-bold text-orange-400 font-display">
            "Commander, the survival of your crew is in your hands."
          </p>
        </motion.div>

        {/* STRATEGY SELECTION SECTION */}
        <div className="w-full max-w-4xl space-y-3 text-left">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 text-center">
            STEP 1: SELECT YOUR COMMANDER STRATEGY
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {strategies.map((strat) => {
              const isSelected = selectedStrategy === strat.type;

              return (
                <div
                  key={strat.type}
                  onClick={() => setSelectedStrategy(strat.type)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-400 shadow-neon-cyan ring-1 ring-cyan-400'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{strat.icon}</span>
                      {isSelected ? (
                        <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500 font-bold">
                          <Check className="w-3 h-3" /> Selected
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-500">Click to Select</span>
                      )}
                    </div>

                    <h3 className="text-base font-bold font-display text-white mb-1">
                      {strat.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed mb-3">
                      {strat.description}
                    </p>

                    {/* Bonuses list */}
                    <div className="space-y-1 mb-3">
                      <div className="text-[10px] font-mono uppercase text-emerald-400 font-bold">
                        Strategic Bonuses:
                      </div>
                      {strat.bonuses.map((b, idx) => (
                        <div key={idx} className="text-[11px] text-slate-300 flex items-start gap-1">
                          <span className="text-emerald-400">•</span>
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Trade-off notice */}
                  <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono text-amber-300">
                    ⚠️ {strat.tradeOff}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {hasSavedGame && onResumeGame && (
            <button
              onClick={onResumeGame}
              className="px-6 py-3.5 rounded-xl font-bold font-display text-xs sm:text-sm tracking-wider uppercase bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] flex items-center gap-2 hover:scale-105 transition-all"
            >
              <RotateCw className="w-4 h-4" />
              <span>RESUME SAVED MISSION</span>
            </button>
          )}

          <button
            onClick={() => onStartGame(selectedStrategy)}
            className="px-8 py-3.5 rounded-xl font-extrabold font-display text-sm tracking-wider uppercase bg-gradient-to-r from-orange-500 via-rose-600 to-red-600 hover:from-orange-400 hover:to-red-500 text-white shadow-neon-orange flex items-center gap-2 hover:scale-105 transition-all"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>START MISSION (SOL 01)</span>
          </button>

          <button
            onClick={() => setShowHowToPlay(true)}
            className="px-5 py-3.5 rounded-xl font-semibold font-display text-xs sm:text-sm tracking-wider uppercase bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 flex items-center gap-2 transition-all"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span>HOW TO PLAY</span>
          </button>

          <button
            onClick={onExploreNasaData}
            className="px-5 py-3.5 rounded-xl font-semibold font-display text-xs sm:text-sm tracking-wider uppercase bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-800/60 flex items-center gap-2 transition-all"
          >
            <Database className="w-4 h-4" />
            <span>EXPLORE NASA DATA</span>
          </button>

          <button
            onClick={onOpenAcademy}
            className="px-5 py-3.5 rounded-xl font-semibold font-display text-xs sm:text-sm tracking-wider uppercase bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-800/60 flex items-center gap-2 transition-all"
          >
            <BookOpen className="w-4 h-4" />
            <span>MARS ACADEMY</span>
          </button>
        </div>
      </div>

      {/* Footer Tagline */}
      <footer className="relative z-10 py-4 border-t border-slate-900 text-center text-xs font-mono text-slate-400 px-4">
        <div>MARSBOUND: THINK LIKE AN ASTRONAUT. DECIDE LIKE AN ENGINEER. SURVIVE LIKE A PIONEER.</div>
        <div className="text-[10px] text-slate-400 mt-1">
          Developed for NASA Hackathon. Powered by NASA Open APIs, DONKI, OSDR & Perseverance Data.
        </div>
      </footer>

      {/* HOW TO PLAY MODAL */}
      <AnimatePresence>
        {showHowToPlay && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-slate-900 border border-cyan-500/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]"
            >
              <div className="px-6 py-4 bg-slate-950 border-b border-cyan-900/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-lg font-bold font-display text-white">
                    How to Play MARSBOUND
                  </h3>
                </div>
                <button
                  onClick={() => setShowHowToPlay(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <div className="p-3.5 rounded-xl bg-orange-950/30 border border-orange-500/40">
                  <h4 className="font-bold text-orange-400 font-display text-sm mb-1">
                    The Golden Rule: Resource Trade-Offs
                  </h4>
                  <p>
                    On Mars, every system is connected! Increasing oxygen with MOXIE draws heavy
                    electrical power. Growing more food requires water and electricity. Saving energy
                    today might create shortages tomorrow.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-500 text-cyan-300 font-mono font-bold flex items-center justify-center shrink-0">
                      1
                    </span>
                    <div>
                      <strong className="text-white">Review Mars Outpost Status:</strong> Check your
                      4 primary resources (Oxygen, Power, Food, Water), crew health, and upcoming
                      future risks.
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-500 text-cyan-300 font-mono font-bold flex items-center justify-center shrink-0">
                      2
                    </span>
                    <div>
                      <strong className="text-white">Handle Incoming Mission Events:</strong> When
                      space weather flares or dust storms hit, choose the best engineering response.
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-500 text-cyan-300 font-mono font-bold flex items-center justify-center shrink-0">
                      3
                    </span>
                    <div>
                      <strong className="text-white">Deploy Outpost Decisions:</strong> Select
                      actions from the decision catalog. An interactive preview shows exactly how
                      your resources change before you commit!
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-500 text-cyan-300 font-mono font-bold flex items-center justify-center shrink-0">
                      4
                    </span>
                    <div>
                      <strong className="text-white">Advance the Sol (Day):</strong> Click "Advance
                      to Next Sol" to simulate daily production, consumption, and delayed consequences.
                      Read the daily debrief to learn real NASA engineering principles!
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-500 text-cyan-300 font-mono font-bold flex items-center justify-center shrink-0">
                      5
                    </span>
                    <div>
                      <strong className="text-white">Survive 30 Sols:</strong> Keep your 4 astronauts
                      healthy and establish a sustainable base to complete the campaign!
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setShowHowToPlay(false)}
                  className="px-6 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase"
                >
                  Got It, Commander!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

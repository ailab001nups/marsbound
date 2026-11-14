// ==========================================
// MARSBOUND: MARS HABITAT GRAPHICAL VISUALIZER
// Cinematic SVG Outpost with dynamic environmental feedback
// ==========================================

import React from 'react';
import { motion } from 'framer-motion';
import { GameState } from '../types/game';
import { getStatusLevel, getStatusColor } from '../utils/calculations';

interface Props {
  state: GameState;
}

export const MarsHabitat: React.FC<Props> = ({ state }) => {
  const o2Status = getStatusLevel(state.resources.oxygen);
  const powerStatus = getStatusLevel(state.resources.power);
  const healthStatus = getStatusLevel(state.secondary.crewHealth);
  const dustPct = state.dustAccumulation;
  const isSolarStorm = state.solarStormActive || state.activeEvent?.id === 'solar_storm_warning';
  const isDustStorm = state.activeEvent?.id === 'global_dust_storm';

  const o2Colors = getStatusColor(o2Status);
  const powerColors = getStatusColor(powerStatus);

  return (
    <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden border border-slate-800 bg-gradient-to-b from-[#060914] via-[#111728] to-[#2a130e] shadow-2xl">
      {/* Dynamic Martian Sky */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 pointer-events-none ${
          isDustStorm
            ? 'bg-orange-950/70'
            : isSolarStorm
            ? 'bg-rose-950/50'
            : 'bg-transparent'
        }`}
      />

      {/* Atmospheric Starfield / Space Dust particles */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="w-1 h-1 bg-white rounded-full absolute top-6 left-12 animate-ping" />
        <div className="w-1.5 h-1.5 bg-cyan-200 rounded-full absolute top-12 left-1/4 opacity-75" />
        <div className="w-1 h-1 bg-white rounded-full absolute top-8 right-24 opacity-60" />
        <div className="w-2 h-2 bg-orange-300 rounded-full absolute top-16 right-1/3 opacity-80" />
      </div>

      {/* Distant Martian Crater Horizons */}
      <svg
        className="absolute bottom-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
        viewBox="0 0 1000 300"
      >
        <defs>
          <linearGradient id="marsHills" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7c2d12" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#451a03" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="marsForeground" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9a3412" />
            <stop offset="100%" stopColor="#290e05" />
          </linearGradient>
          <radialGradient id="habGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={o2Status === 'healthy' ? '#06b6d4' : '#f97316'} stopOpacity="0.3" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Distant Mountains */}
        <path
          d="M0,180 Q180,140 350,170 T700,150 T1000,180 L1000,300 L0,300 Z"
          fill="url(#marsHills)"
          opacity="0.6"
        />

        {/* Foreground Terrain with Basalt Rocks */}
        <path
          d="M0,220 Q250,195 500,215 T1000,205 L1000,300 L0,300 Z"
          fill="url(#marsForeground)"
        />

        {/* Habitat Regolith Sinter Shielding Berm */}
        <path
          d="M320,250 C380,210 620,210 680,250 Z"
          fill="#5a2211"
          stroke="#7c2d12"
          strokeWidth="3"
        />

        {/* Central Pressurized Inflatable Crew Hab Dome */}
        <ellipse
          cx="500"
          cy="225"
          rx="120"
          ry="65"
          fill="#0f172a"
          stroke={o2Status === 'critical' ? '#ef4444' : '#38bdf8'}
          strokeWidth="3"
          className="transition-colors duration-500"
        />

        {/* Translucent Thermal Aerogel Window Grid */}
        <ellipse
          cx="500"
          cy="215"
          rx="85"
          ry="40"
          fill="url(#habGlow)"
          stroke="#0284c7"
          strokeWidth="1.5"
          opacity="0.9"
        />

        {/* Internal Habitat Activity Light */}
        <circle
          cx="480"
          cy="215"
          r="6"
          fill={healthStatus === 'healthy' ? '#22c55e' : '#f59e0b'}
          className="animate-pulse"
        />
        <circle cx="520" cy="215" r="4" fill="#38bdf8" />

        {/* Hydroponic Farm Greenhouse Dome (Left) */}
        <ellipse
          cx="330"
          cy="235"
          rx="60"
          ry="38"
          fill="#064e3b"
          stroke="#10b981"
          strokeWidth="2.5"
          opacity="0.85"
        />
        {/* Greenhouse Bio-Grow Lighting */}
        <ellipse
          cx="330"
          cy="230"
          rx="40"
          ry="20"
          fill="#a855f7"
          opacity="0.35"
          className="animate-pulse"
        />

        {/* MOXIE Oxygen Synthesis Tower (Center-Right) */}
        <rect
          x="620"
          y="180"
          width="26"
          height="55"
          rx="4"
          fill="#1e293b"
          stroke="#06b6d4"
          strokeWidth="2"
        />
        <circle cx="633" cy="195" r="5" fill="#22d3ee" className="animate-ping" style={{ animationDuration: '3s' }} />

        {/* Water Ice Deep Drill Rig (Right) */}
        <polygon
          points="690,240 705,175 720,240"
          fill="#334155"
          stroke="#38bdf8"
          strokeWidth="2"
        />
        <line x1="705" y1="175" x2="705" y2="250" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="3,3" />

        {/* Photovoltaic Solar Array Wings (Left & Right) */}
        {/* Left Solar Array */}
        <g transform="translate(180, 185) rotate(-5)">
          <rect
            x="0"
            y="0"
            width="90"
            height="32"
            rx="3"
            fill="#0369a1"
            stroke="#38bdf8"
            strokeWidth="1.5"
          />
          {/* Panel Grid Lines */}
          <line x1="30" y1="0" x2="30" y2="32" stroke="#0284c7" strokeWidth="1" />
          <line x1="60" y1="0" x2="60" y2="32" stroke="#0284c7" strokeWidth="1" />
          <line x1="0" y1="16" x2="90" y2="16" stroke="#0284c7" strokeWidth="1" />
          {/* Dust Layer Coating */}
          <rect
            x="0"
            y="0"
            width="90"
            height="32"
            rx="3"
            fill="#c2410c"
            opacity={Math.min(0.85, (dustPct / 100) * 0.9)}
          />
        </g>

        {/* Right Solar Array */}
        <g transform="translate(740, 180) rotate(5)">
          <rect
            x="0"
            y="0"
            width="90"
            height="32"
            rx="3"
            fill="#0369a1"
            stroke="#38bdf8"
            strokeWidth="1.5"
          />
          <line x1="30" y1="0" x2="30" y2="32" stroke="#0284c7" strokeWidth="1" />
          <line x1="60" y1="0" x2="60" y2="32" stroke="#0284c7" strokeWidth="1" />
          <line x1="0" y1="16" x2="90" y2="16" stroke="#0284c7" strokeWidth="1" />
          {/* Dust Layer Coating */}
          <rect
            x="0"
            y="0"
            width="90"
            height="32"
            rx="3"
            fill="#c2410c"
            opacity={Math.min(0.85, (dustPct / 100) * 0.9)}
          />
        </g>

        {/* Astronauts on EVA */}
        <g transform="translate(430, 248)">
          <circle cx="6" cy="4" r="3.5" fill="#ffffff" />
          <rect x="3" y="7" width="6" height="8" rx="2" fill="#e2e8f0" />
          <line x1="4" y1="15" x2="3" y2="21" stroke="#cbd5e1" strokeWidth="2" />
          <line x1="8" y1="15" x2="9" y2="21" stroke="#cbd5e1" strokeWidth="2" />
        </g>
        <g transform="translate(560, 252)">
          <circle cx="6" cy="4" r="3.5" fill="#ffffff" />
          <rect x="3" y="7" width="6" height="8" rx="2" fill="#e2e8f0" />
          <line x1="4" y1="15" x2="3" y2="21" stroke="#cbd5e1" strokeWidth="2" />
          <line x1="8" y1="15" x2="9" y2="21" stroke="#cbd5e1" strokeWidth="2" />
        </g>
      </svg>

      {/* Floating Mission Telemetry HUD Overlay */}
      <div className="absolute top-3 left-3 flex flex-wrap gap-2 text-[11px] font-mono pointer-events-none">
        <span className="px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md border border-slate-700 text-slate-200">
          📍 Chryse Planitia (22.4°N, 49.9°W)
        </span>
        <span
          className={`px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md border ${
            dustPct > 40 ? 'border-amber-500/50 text-amber-300' : 'border-slate-700 text-slate-300'
          }`}
        >
          🧹 Solar Dust: {Math.round(dustPct)}%
        </span>
        {isSolarStorm && (
          <span className="px-2.5 py-1 rounded-md bg-rose-950/90 border border-rose-500 text-rose-200 animate-pulse font-bold">
            ⚡ SOLAR STORM IN PROGRESS
          </span>
        )}
        {isDustStorm && (
          <span className="px-2.5 py-1 rounded-md bg-orange-950/90 border border-orange-500 text-orange-200 animate-pulse font-bold">
            🌪️ DUST STORM ACTIVE
          </span>
        )}
      </div>

      <div className="absolute bottom-3 right-3 flex items-center gap-2 text-[11px] font-mono pointer-events-none">
        <span className="px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md border border-cyan-800/40 text-cyan-300">
          🛰️ Chryse Base: Pressurized
        </span>
      </div>
    </div>
  );
};

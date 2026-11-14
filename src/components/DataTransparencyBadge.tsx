// ==========================================
// MARSBOUND: DATA TRANSPARENCY BADGE
// Distinguishes Real NASA vs Archived vs Simulated Data
// ==========================================

import React from 'react';
import { DataSourceType } from '../types/game';
import { Globe, Database, Cpu } from 'lucide-react';

interface Props {
  type: DataSourceType;
  sourceText?: string;
  className?: string;
}

export const DataTransparencyBadge: React.FC<Props> = ({
  type,
  sourceText,
  className = '',
}) => {
  switch (type) {
    case 'LIVE_NASA':
      return (
        <span
          title="Direct live telemetry retrieved from NASA Open APIs"
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.3)] ${className}`}
        >
          <Globe className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
          <span>LIVE NASA DATA</span>
          {sourceText && <span className="opacity-75">({sourceText})</span>}
        </span>
      );

    case 'ARCHIVED_NASA':
      return (
        <span
          title="Authentic scientific data from published NASA mission records"
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.3)] ${className}`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>ARCHIVED NASA DATA</span>
          {sourceText && <span className="opacity-75">({sourceText})</span>}
        </span>
      );

    case 'SIMULATED':
    default:
      return (
        <span
          title="Gameplay numerical model calculated for educational engineering trade-offs"
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.25)] ${className}`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>EDUCATIONAL SIMULATION</span>
          {sourceText && <span className="opacity-75">({sourceText})</span>}
        </span>
      );
  }
};

// ==========================================
// MARSBOUND: ACCESSIBLE RESOURCE BAR
// ==========================================

import React from 'react';
import { motion } from 'framer-motion';
import { Wind, Zap, Sprout, Droplets, LucideIcon } from 'lucide-react';
import { getStatusLevel, getStatusColor, getStatusLabel } from '../utils/calculations';
import { ResourceKey } from '../types/game';

interface Props {
  resourceKey: ResourceKey;
  label: string;
  value: number; // 0 - 100
  deltaPerSol?: number;
  description?: string;
  simplifiedMode?: boolean;
}

const RESOURCE_ICONS: Record<ResourceKey, LucideIcon> = {
  oxygen: Wind,
  power: Zap,
  food: Sprout,
  water: Droplets,
};

export const ResourceBar: React.FC<Props> = ({
  resourceKey,
  label,
  value,
  deltaPerSol = 0,
  description,
  simplifiedMode = false,
}) => {
  const Icon = RESOURCE_ICONS[resourceKey];
  const roundedVal = Math.round(value);
  const status = getStatusLevel(roundedVal);
  const colors = getStatusColor(status);
  const statusLabel = getStatusLabel(status);

  return (
    <div
      className={`p-3.5 rounded-xl border bg-slate-900/80 backdrop-blur-md transition-all duration-300 ${colors.border} hover:border-cyan-500/50 group`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-lg ${colors.bg} ${colors.text} border ${colors.border}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-wide text-slate-100 font-display">
                {label}
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${colors.badge}`}
              >
                {statusLabel}
              </span>
            </div>
            {description && !simplifiedMode && (
              <p className="text-[11px] text-slate-400 mt-0.5">{description}</p>
            )}
          </div>
        </div>

        <div className="text-right">
          <div className="text-lg font-bold font-mono text-slate-100">
            {roundedVal}
            <span className="text-xs font-normal text-slate-400 ml-0.5">%</span>
          </div>
          {deltaPerSol !== 0 && (
            <div
              className={`text-xs font-mono font-semibold ${
                deltaPerSol > 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {deltaPerSol > 0 ? `+${deltaPerSol}` : deltaPerSol}% / Sol
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar Track */}
      <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
        <motion.div
          className={`h-full rounded-full transition-colors duration-500 ${
            status === 'healthy'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
              : status === 'warning'
              ? 'bg-gradient-to-r from-yellow-500 to-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
              : status === 'danger'
              ? 'bg-gradient-to-r from-orange-600 to-amber-500 shadow-[0_0_12px_rgba(249,115,22,0.6)]'
              : 'bg-gradient-to-r from-red-600 to-rose-500 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.8)]'
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${roundedVal}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>

      {simplifiedMode && (
        <div className="mt-2 text-xs text-slate-300 font-medium">
          {status === 'healthy' && '🟢 Safe level: Your astronauts have plenty of this resource.'}
          {status === 'warning' && '🟡 Notice: Level is dropping. Watch out soon!'}
          {status === 'danger' && '🟠 Warning: Low reserve! Take action to protect your crew.'}
          {status === 'critical' && '🔴 EMERGENCY: Critical danger! Refill immediately!'}
        </div>
      )}
    </div>
  );
};

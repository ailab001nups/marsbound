// ==========================================
// MARSBOUND: CORE CALCULATIONS UTILITY
// ==========================================

import { Resources, SecondarySystems, ResourceDelta, Astronaut } from '../types/game';

export const MAX_RESOURCE_VAL = 100;
export const MIN_RESOURCE_VAL = 0;

export function clamp(val: number, min: number = MIN_RESOURCE_VAL, max: number = MAX_RESOURCE_VAL): number {
  return Math.max(min, Math.min(max, val));
}

export function round(val: number, decimals: number = 1): number {
  const factor = Math.pow(10, decimals);
  return Math.round(val * factor) / factor;
}

export function applyDeltaToResources(res: Resources, delta: ResourceDelta): Resources {
  return {
    oxygen: clamp(res.oxygen + (delta.oxygen ?? 0)),
    power: clamp(res.power + (delta.power ?? 0)),
    food: clamp(res.food + (delta.food ?? 0)),
    water: clamp(res.water + (delta.water ?? 0)),
  };
}

export function applyDeltaToSecondary(sec: SecondarySystems, delta: ResourceDelta): SecondarySystems {
  return {
    radiationShielding: clamp(sec.radiationShielding + (delta.radiationShielding ?? 0)),
    crewHealth: clamp(sec.crewHealth + (delta.crewHealth ?? 0)),
    materials: clamp(sec.materials + (delta.materials ?? 0)),
    sciencePoints: Math.max(0, sec.sciencePoints + (delta.sciencePoints ?? 0)),
    cumulativeRadiation: Math.max(0, round(sec.cumulativeRadiation + (delta.cumulativeRadiation ?? 0), 2)),
  };
}

export type StatusLevel = 'healthy' | 'warning' | 'danger' | 'critical';

export function getStatusLevel(val: number): StatusLevel {
  if (val >= 60) return 'healthy';
  if (val >= 35) return 'warning';
  if (val >= 15) return 'danger';
  return 'critical';
}

export function getStatusColor(level: StatusLevel): {
  text: string;
  bg: string;
  border: string;
  badge: string;
  glow: string;
} {
  switch (level) {
    case 'healthy':
      return {
        text: 'text-emerald-400',
        bg: 'bg-emerald-950/40',
        border: 'border-emerald-500/40',
        badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        glow: 'shadow-neon-green',
      };
    case 'warning':
      return {
        text: 'text-amber-400',
        bg: 'bg-amber-950/40',
        border: 'border-amber-500/40',
        badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        glow: 'shadow-[0_0_15px_rgba(234,179,8,0.4)]',
      };
    case 'danger':
      return {
        text: 'text-orange-400',
        bg: 'bg-orange-950/40',
        border: 'border-orange-500/40',
        badge: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
        glow: 'shadow-neon-orange',
      };
    case 'critical':
      return {
        text: 'text-red-400',
        bg: 'bg-red-950/50',
        border: 'border-red-500/60',
        badge: 'bg-red-500/25 text-red-200 border-red-500/50 animate-pulse',
        glow: 'shadow-neon-red',
      };
  }
}

export function getStatusLabel(level: StatusLevel): string {
  switch (level) {
    case 'healthy': return 'HEALTHY';
    case 'warning': return 'WARNING';
    case 'danger': return 'DANGER';
    case 'critical': return 'CRITICAL';
  }
}

/**
 * Calculates radio communication delay in minutes based on orbital alignment.
 * Sol 1 starts with Earth and Mars in close proximity (~4.2 minutes).
 * As the planets move, delay fluctuates realistically between 3.8 and 21.5 minutes.
 */
export function getRadioDelayMinutes(sol: number): number {
  // Approximate orbital synodic variation
  const baseMinutes = 4.2;
  const variation = Math.sin((sol / 30) * Math.PI) * 16.8;
  return round(baseMinutes + variation, 1);
}

/**
 * Calculates radiation dosage for a Sol based on shielding and solar weather
 */
export function calculateDailyRadiation(
  shielding: number,
  isSolarStormActive: boolean
): number {
  // Real Mars surface background GCR: ~0.67 mSv / day
  // During SPE (Solar Storm): spikes up to 15.0 mSv / day without shielding
  const baseSurfaceDose = isSolarStormActive ? 14.5 : 0.67;
  // Shielding reduction: at 100% shielding, absorbs 88% of radiation; at 0%, absorbs 0%
  const shieldingAbsorptionFactor = (shielding / 100) * 0.88;
  const absorbedDose = baseSurfaceDose * (1 - shieldingAbsorptionFactor);
  return round(Math.max(0.08, absorbedDose), 2);
}

/**
 * Calculates crew health update based on resources and radiation
 */
export function calculateCrewHealthImpact(
  currentHealth: number,
  resources: Resources,
  dailyRadiationDose: number,
  astronauts: Astronaut[]
): {
  newHealth: number;
  delta: number;
  updatedCrew: Astronaut[];
  reasons: string[];
} {
  let healthChange = 0;
  const reasons: string[] = [];

  // Oxygen deficit
  if (resources.oxygen <= 0) {
    healthChange -= 35;
    reasons.push('Severe Hypoxia (No Oxygen!)');
  } else if (resources.oxygen < 20) {
    healthChange -= 12;
    reasons.push('Low Oxygen Levels');
  }

  // Water deficit
  if (resources.water <= 0) {
    healthChange -= 25;
    reasons.push('Extreme Dehydration');
  } else if (resources.water < 20) {
    healthChange -= 8;
    reasons.push('Water Shortage');
  }

  // Food deficit
  if (resources.food <= 0) {
    healthChange -= 20;
    reasons.push('Starvation');
  } else if (resources.food < 20) {
    healthChange -= 6;
    reasons.push('Caloric Malnutrition');
  }

  // Power deficit (cold habitat)
  if (resources.power < 15) {
    healthChange -= 8;
    reasons.push('Habitat Thermal Loss (-60°C internal drop)');
  }

  // Radiation damage
  if (dailyRadiationDose > 5.0) {
    healthChange -= 15;
    reasons.push('Acute Solar Radiation Dose');
  } else if (dailyRadiationDose > 2.0) {
    healthChange -= 5;
    reasons.push('Elevated Radiation Exposure');
  }

  // Natural recovery if all primary systems are in Healthy status
  if (
    resources.oxygen >= 50 &&
    resources.water >= 40 &&
    resources.food >= 40 &&
    resources.power >= 30 &&
    dailyRadiationDose < 1.0
  ) {
    healthChange += 4;
    reasons.push('Comfortable Habitat Rest & Good Nutrition');
  }

  const newHealth = clamp(currentHealth + healthChange);

  // Update individual astronauts
  const updatedCrew = astronauts.map((astro, idx) => {
    // Minor variation among crew members
    const individualOffset = (idx % 2 === 0 ? 1 : -1) * 2;
    const astroHealth = clamp(newHealth + individualOffset);
    let moraleChange = healthChange * 0.8;
    if (resources.food < 25) moraleChange -= 5;
    const astroMorale = clamp(astro.morale + moraleChange);

    return {
      ...astro,
      health: astroHealth,
      morale: astroMorale,
    };
  });

  return {
    newHealth,
    delta: healthChange,
    updatedCrew,
    reasons,
  };
}

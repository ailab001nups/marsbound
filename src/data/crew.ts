// ==========================================
// MARSBOUND: CREW MANIFEST
// ==========================================

import { Astronaut } from '../types/game';

export const INITIAL_CREW: Astronaut[] = [
  {
    id: 'commander_chen',
    name: 'Sarah Chen',
    role: 'Mission Commander & Avionics Engineer',
    specialty: 'Power Grid Optimization & Systems Safety',
    health: 95,
    morale: 92,
    avatar: '👨‍🚀',
    quote: 'Safety and discipline keep our air scrubbers running. Every kilowatt counts on the red dust.',
  },
  {
    id: 'doctor_vance',
    name: 'Dr. Marcus Vance',
    role: 'Flight Surgeon & Radiation Biologist',
    specialty: 'Bone Mineral Density & Countermeasures',
    health: 94,
    morale: 88,
    avatar: '👩‍⚕️',
    quote: 'Mars gravity is only 38% of Earth. We need proper nutrition and shielded sleep quarters.',
  },
  {
    id: 'engineer_rostova',
    name: 'Elena Rostova',
    role: 'Chief Robotics & Life Support Specialist',
    specialty: 'MOXIE Electrolysis & ECLSS Water Recyclers',
    health: 92,
    morale: 90,
    avatar: '🧑‍🔧',
    quote: 'In space engineering, closed-loop recycling isn’t a luxury—it is survival.',
  },
  {
    id: 'astrobiologist_kim',
    name: 'Leo Kim',
    role: 'Astrobiologist & Hydroponic Agronomist',
    specialty: 'Microgreen Aeroponics & Biosphere Nutrient Cycling',
    health: 96,
    morale: 95,
    avatar: '👨‍🔬',
    quote: 'Fresh potatoes and spirulina microgreens don’t just fill bellies—they lift crew spirit.',
  },
];

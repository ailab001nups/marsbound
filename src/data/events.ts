// ==========================================
// MARSBOUND: MISSION EVENTS CATALOG (20+ Events)
// ==========================================

import { MissionEvent } from '../types/game';

export const MISSION_EVENTS: MissionEvent[] = [
  {
    id: 'solar_storm_warning',
    title: 'Space Weather Alert: Coronal Mass Ejection',
    severity: 'danger',
    category: 'space_weather',
    description: 'Deep space satellites and NASA DONKI observe an X-class solar flare and Earth-Mars directed Coronal Mass Ejection (CME). A surge of energetic protons will impact the Martian atmosphere in hours.',
    scientificContext: 'Mars lacks a global intrinsic magnetic field like Earth to deflect charged particles. Solar particle events (SPE) can expose astronauts to ionizing radiation.',
    nasaRef: {
      source: 'DONKI',
      identifier: 'CME-2024-X4.5-MARS',
      url: 'https://kauai.ccmc.gsfc.nasa.gov/DONKI/',
      dataType: 'ARCHIVED_NASA',
    },
    choices: [
      {
        id: 'shelter_storm',
        text: 'Option A: Evacuate Crew into Thick Regolith Storm Shelter',
        strategyHint: 'Max crew safety, pauses operations',
        impact: {
          power: -14,
          radiationShielding: 5,
          crewHealth: 2,
        },
        outcomeDescription: 'The crew enters the water-jacketed storm shelter. Absorbed radiation is safely minimized, though auxiliary systems drained battery power.',
        educationalTakeaway: 'Water and hydrogen-dense polyethylene are effective radiation shields against solar protons.',
      },
      {
        id: 'continue_science',
        text: 'Option B: Keep Science Labs Online to Measure Particle Flux',
        strategyHint: 'High science gain, health risk',
        impact: {
          sciencePoints: 40,
          crewHealth: -12,
          cumulativeRadiation: 6.8,
        },
        delayedRisk: {
          delaySols: 2,
          title: 'Radiation Cellular Recovery Protocol',
          description: 'Astronauts show mild radiation fatigue requiring medical monitoring.',
          impactDelta: { crewHealth: -4 },
          educationalNote: 'NASA’s RAD instrument on Curiosity measures cosmic ray and solar radiation on the Martian surface to ensure human safety.',
          severity: 'warning',
        },
        outcomeDescription: 'Invaluable spectrometry data was gathered on solar proton energy spectra, but crew received elevated radiation exposure.',
        educationalTakeaway: 'Real astronauts face tough trade-offs between scientific observation and occupational radiation limits.',
      },
      {
        id: 'emergency_power_divert',
        text: 'Option C: Divert Emergency Power to Active Electromagnetic Deflector',
        strategyHint: 'Balanced protection, consumes high energy',
        impact: {
          power: -22,
          materials: -8,
          crewHealth: 0,
        },
        outcomeDescription: 'The experimental superconducting coil deflected high-energy ions, but the intense power draw drained habitat capacitor banks.',
        educationalTakeaway: 'Active magnetic shielding mimics Earth’s magnetosphere using powerful superconducting magnets, but requires massive electrical power.',
      },
    ],
  },
  {
    id: 'global_dust_storm',
    title: 'Regional Dust Storm Envelops Chryse Planitia',
    severity: 'danger',
    category: 'weather',
    description: 'A massive swirling atmospheric dust storm lofted fine red dust high into the Martian troposphere, reducing direct sunlight by 70%.',
    scientificContext: 'Martian dust storms can expand to cover entire hemispheres. Airborne dust blocks sunlight from reaching photovoltaic solar arrays.',
    nasaRef: {
      source: 'ROVER',
      identifier: 'PERSEVERANCE-MASTCAM-SOL-420-DUST',
      url: 'https://mars.nasa.gov/mars2020/',
      dataType: 'ARCHIVED_NASA',
    },
    choices: [
      {
        id: 'conserve_power_storm',
        text: 'Shut Down Non-Essential Modules & Ration Electricity',
        strategyHint: 'Conserves power, slows oxygen & farm',
        impact: {
          power: 10,
          oxygen: -12,
          food: -8,
        },
        delayedRisk: {
          delaySols: 2,
          title: 'Post-Storm Solar Dust Coating',
          description: 'Settling fine dust creates persistent opacity on photovoltaic panels.',
          impactDelta: { power: -10 },
          educationalNote: 'Martian dust particles are as fine as talcum powder and carry electrostatic charges that make them cling to glass.',
          severity: 'warning',
        },
        outcomeDescription: 'Batteries survived the darkness, but hydroponic vegetables and oxygen tanks dipped while heaters were rationed.',
        educationalTakeaway: 'Power shedding is standard aerospace protocol during reduced generation events.',
      },
      {
        id: 'burn_stored_oxygen',
        text: 'Rely on Reserve Fuel Cells & Burn Stored Oxygen',
        strategyHint: 'Keeps habitat warm, uses valuable reserves',
        impact: {
          oxygen: -18,
          power: 12,
          water: 6, // Fuel cell byproduct is water!
        },
        outcomeDescription: 'Hydrogen-oxygen fuel cells provided clean electricity and even yielded pure drinking water, but depleted oxygen tanks.',
        educationalTakeaway: 'Hydrogen fuel cells combine H2 and O2 to produce electricity and pure drinking water—vital for NASA Apollo and Space Shuttle missions.',
      },
    ],
  },
  {
    id: 'dust_devil_clearing',
    title: 'Martian Dust Devil Passes Over Solar Array',
    severity: 'breakthrough',
    category: 'weather',
    description: 'A convective thermal vortex (dust devil) swept right across the outpost solar farm, whisking away months of clinging dust!',
    scientificContext: 'NASA’s Spirit and Opportunity rovers famously had their mission lifespans extended by years due to natural Martian cleaning events.',
    nasaRef: {
      source: 'ROVER',
      identifier: 'OPPORTUNITY-CLEANING-SOL-420',
      dataType: 'ARCHIVED_NASA',
    },
    choices: [
      {
        id: 'capitalize_power',
        text: 'Recharge Energy Storage to Maximum & Run Water Electrolysis',
        impact: {
          power: 28,
          oxygen: 15,
        },
        outcomeDescription: 'Solar power surged to 98% efficiency! The outpost captured bonus kilowatts to fill oxygen reservoirs.',
        educationalTakeaway: 'Dust devils on Mars are miniature whirlwinds driven by warm surface air rising through colder atmospheric layers.',
      },
      {
        id: 'scientific_vortex_study',
        text: 'Record High-Speed Aerodynamic Data of the Vortex',
        impact: {
          power: 18,
          sciencePoints: 35,
        },
        outcomeDescription: 'Superb meteorological wind velocity and atmospheric pressure drop data was captured for atmospheric models.',
        educationalTakeaway: 'Measuring dust devils helps scientists understand how Mars transports dust and loses atmospheric moisture to space.',
      },
    ],
  },
  {
    id: 'oxygen_sabattier_leak',
    title: 'Micro-Fracture in Sabatier Carbon Dioxide Scrubber',
    severity: 'danger',
    category: 'engineering',
    description: 'Sensors detect an O2 pressure drop in the primary habitat loop. An O-ring in the Sabatier life support recycling system has cracked due to thermal cycling.',
    scientificContext: 'NASA’s Sabatier reactor combines carbon dioxide breathed out by astronauts with hydrogen to produce methane and water, which is then split into oxygen.',
    nasaRef: {
      source: 'OSDR',
      identifier: 'ECLSS-LIFE-SUPPORT-TECH-REF-2023',
      dataType: 'SIMULATED',
    },
    choices: [
      {
        id: 'rapid_eva_patch',
        text: 'Send Crew on Immediate EVA with 3D Printed Seal',
        strategyHint: 'Quick fix, uses materials and crew stamina',
        impact: {
          materials: -12,
          crewHealth: -5,
          oxygen: -4,
        },
        outcomeDescription: 'Commander Chen and Elena swiftly replaced the seal. Oxygen loss was halted with minimal air lost.',
        educationalTakeaway: 'In-space 3D printing enables astronauts to manufacture spare replacement parts on demand from digital blueprints.',
      },
      {
        id: 'reroute_backup_moxie',
        text: 'Isolate Damaged Loop & Overclock Backup MOXIE',
        strategyHint: 'Saves materials, drains power',
        impact: {
          power: -18,
          oxygen: 6,
        },
        outcomeDescription: 'Backup compressors engaged seamlessly. Power demand jumped, but no crew members had to risk extra spacewalk fatigue.',
        educationalTakeaway: 'Redundancy (having backup systems for critical functions) is the cornerstone of aerospace life-support engineering.',
      },
    ],
  },
  {
    id: 'water_recycler_clog',
    title: 'Biofilm Accumulation in Water Recovery Assembly',
    severity: 'warning',
    category: 'engineering',
    description: 'The catalytic water processor flow rate has dropped by 45%. Microscopic microbial biofilm has formed inside the distillation centrifuge tubing.',
    scientificContext: 'On the ISS, the Environmental Control and Life Support System (ECLSS) recycles over 93% of all crew moisture, sweat, and urine into ultrapure drinking water.',
    nasaRef: {
      source: 'OSDR',
      identifier: 'OSD-379-MICROBIOME-WATER-RECOVERY',
      dataType: 'ARCHIVED_NASA',
    },
    choices: [
      {
        id: 'chemical_backflush',
        text: 'Perform High-Temperature Iodine Chemical Backflush',
        impact: {
          power: -12,
          water: -8,
          materials: -6,
        },
        outcomeDescription: 'The thermal flush dissolved the organic obstruction. Clean flow is fully restored.',
        educationalTakeaway: 'Water recovery systems use biocides and heat to prevent bacterial colonies from obstructing filtration membranes.',
      },
      {
        id: 'switch_to_raw_ice',
        text: 'Switch to Subsurface Ice Reservoirs & Dismantle Centrifuge Manually',
        impact: {
          crewHealth: -4,
          water: 12,
          power: -8,
        },
        outcomeDescription: 'The crew manually scrubbed the assembly while drinking fresh glacial meltwater.',
        educationalTakeaway: 'Martian glacial ice requires perchlorate removal before consumption, requiring meticulous filtration.',
      },
    ],
  },
  {
    id: 'hydroponic_nutrient_imbalance',
    title: 'Hydroponic pH Spike Threatens Crop Greens',
    severity: 'warning',
    category: 'biology',
    description: 'Dr. Kim reports that the recirculating nutrient solution in the aeroponic greenhouse has shifted alkaline (pH 8.2), causing iron chlorosis in young dwarf wheat.',
    scientificContext: 'Plants in space require precise balance of Nitrogen, Phosphorus, Potassium, and micronutrients. Alkaline water locks out essential minerals.',
    nasaRef: {
      source: 'OSDR',
      identifier: 'OSD-120-PLANT-HABITAT-MICRONUTRIENTS',
      dataType: 'ARCHIVED_NASA',
    },
    choices: [
      {
        id: 'adjust_nutrients',
        text: 'Buffer with Organic Acid & Infuse Iron Chelates',
        impact: {
          materials: -8,
          food: 12,
          water: -6,
        },
        outcomeDescription: 'Leaves regained their vibrant emerald green! Harvest yield is protected and nutritious.',
        educationalTakeaway: 'Space agriculture requires continuous computer monitoring of electrical conductivity (EC) and pH in hydroponic fluid.',
      },
      {
        id: 'harvest_early_ration',
        text: 'Harvest Early as Microgreens & Reset Reservoir',
        impact: {
          food: 6,
          water: -2,
        },
        outcomeDescription: 'The crew ate a crunchy salad of radish and pea shoots. Nutrient loss was avoided, though crop mass was modest.',
        educationalTakeaway: 'Microgreens have concentrated vitamins (C, K, and E) that help combat cosmic radiation-induced oxidative stress.',
      },
    ],
  },
  {
    id: 'solar_gimbal_jam',
    title: 'Sun-Tracking Motor Freeze on Primary Photovoltaic Wing',
    severity: 'warning',
    category: 'engineering',
    description: 'Extreme nighttime temperatures (-110°C) congealed lubricant in the azimuth drive gearbox. The solar wing cannot rotate to follow the morning sun.',
    scientificContext: 'Space mechanisms operate in extreme thermal cycling between day and night, requiring dry lubricants like molybdenum disulfide (MoS2).',
    nasaRef: {
      source: 'ROVER',
      identifier: 'CURIOSITY-MOBILITY-ACTUATOR-COLD',
      dataType: 'ARCHIVED_NASA',
    },
    choices: [
      {
        id: 'electric_heater_tape',
        text: 'Route Auxiliary Heater Current to Thaw the Actuator',
        impact: {
          power: -12,
        },
        delayedRisk: {
          delaySols: 1,
          title: 'Solar Tracking Realignment',
          description: 'Freed gimbal locks onto the solar vector, restoring 100% incident photon capture.',
          impactDelta: { power: 16 },
          educationalNote: 'Solar tracking increases daily photovoltaic energy harvest by over 30% compared to static fixed panels.',
          severity: 'warning',
        },
        outcomeDescription: 'Heater tape thawed the grease in 40 minutes. The wing swung into position facing the morning sunrise.',
        educationalTakeaway: 'Thermal control systems (blankets, louvers, and electrical heaters) protect robotic joints from freezing in space.',
      },
      {
        id: 'lock_at_noon_angle',
        text: 'Lock Panel at Solar Noon Angle without Power Drain',
        impact: {
          power: -6,
          materials: 4,
        },
        outcomeDescription: 'The panel remained fixed. While generating less power in mornings and evenings, zero battery energy was wasted.',
        educationalTakeaway: 'Stationary solar arrays sacrifice peak morning efficiency but eliminate mechanical single-point failure modes.',
      },
    ],
  },
  {
    id: 'micrometeorite_impact',
    title: 'Hypervelocity Micrometeorite Strikes Outer Shield',
    severity: 'danger',
    category: 'engineering',
    description: 'A sand-grain-sized space pebble travelling at 22 km/s perforated the outer aluminum Whipple bumper of the secondary storage dome.',
    scientificContext: 'Mars has a thin atmosphere (less than 1% of Earth’s surface pressure), allowing smaller meteoroids to reach the ground without burning up.',
    nasaRef: {
      source: 'ROVER',
      identifier: 'INSIGHT-SEIS-METEOROID-IMPACT-DATA',
      dataType: 'ARCHIVED_NASA',
    },
    choices: [
      {
        id: 'deploy_foam_sealant',
        text: 'Inject Polyurethane Expanding Sealant & Sinter Outer Tile',
        impact: {
          materials: -14,
          power: -6,
          radiationShielding: 4,
        },
        outcomeDescription: 'The puncture was sealed airtight before any pressure drop reached human quarters. Whipple bumper integrity restored.',
        educationalTakeaway: 'A Whipple shield consists of an outer sacrificial bumper that shatters fast meteoroids into harmless vapor and tiny fragments.',
      },
      {
        id: 'depressurize_storage',
        text: 'Evacuate Air into Hab Storage Tanks & Leave Module Unpressurized',
        impact: {
          oxygen: 8,
          materials: -4,
        },
        outcomeDescription: 'All air was reclaimed into main habitat scrubbers. Zero atmosphere was lost to the Martian vacuum.',
        educationalTakeaway: 'Modular habitat architecture lets crews compartmentalize and isolate breached volumes during emergencies.',
      },
    ],
  },
  {
    id: 'battery_degradation_alert',
    title: 'Lithium-Ion Battery Cell Anode Dendrite Warning',
    severity: 'warning',
    category: 'engineering',
    description: 'Diagnostic telemetry reveals internal impedance rising in Battery Bank Bravo after repeated deep discharge cycles.',
    scientificContext: 'NASA battery engineers use smart battery management systems (BMS) to balance cell temperatures and prevent thermal runaway in space.',
    nasaRef: {
      source: 'DONKI',
      identifier: 'NASA-BATTERY-LIFE-TESTING-JPL',
      dataType: 'SIMULATED',
    },
    choices: [
      {
        id: 'rebalance_cell_voltage',
        text: 'Run Smart BMS Rebalancing & Limit Max Charge to 85%',
        impact: {
          power: -8,
          materials: -4,
        },
        delayedRisk: {
          delaySols: 3,
          title: 'Stabilized Battery Chemistry',
          description: 'Gentle charging profiles extend life of the cell matrix.',
          impactDelta: { power: 10 },
          educationalNote: 'Limiting maximum charge state prevents metallic lithium plating on battery anodes during freezing night operations.',
          severity: 'warning',
        },
        outcomeDescription: 'Cell balancing concluded without incident. Usable capacity dropped slightly today, but catastrophic failure was averted.',
        educationalTakeaway: 'Smart battery management extends satellite and habitat battery longevity across thousands of day/night orbital cycles.',
      },
      {
        id: 'swap_with_supercapacitors',
        text: 'Scrap Degraded Cells for Raw Copper & Rely on Capacitors',
        impact: {
          materials: 14,
          power: -10,
        },
        outcomeDescription: 'The team salvaged useful wire and conductors, operating with a leaner energy buffer.',
        educationalTakeaway: 'Resource recovery on Mars means recycling every broken electronic circuit and component.',
      },
    ],
  },
  {
    id: 'extreme_cold_front',
    title: 'Polar Vortex Brings Extreme -128°C Cold Wave',
    severity: 'danger',
    category: 'weather',
    description: 'Dry ice (carbon dioxide) begins to freeze out on the Martian ground as surface air plunges to -128°C (-198°F). Hab heating units are working at maximum capacity.',
    scientificContext: 'Mars temperatures can plummet so low that atmospheric CO2 deposits directly as dry ice frost at the poles and high latitudes.',
    nasaRef: {
      source: 'ROVER',
      identifier: 'CURIOSITY-REMS-COLD-SURFACE-MET',
      dataType: 'ARCHIVED_NASA',
    },
    choices: [
      {
        id: 'crank_heaters',
        text: 'Max Thermal Heat Loops & Insulate with Aerogel Blankets',
        impact: {
          power: -20,
          crewHealth: 4,
          materials: -6,
        },
        outcomeDescription: 'The interior stayed a cozy 21°C. The crew slept warmly, though power reserves took a noticeable beating.',
        educationalTakeaway: 'Aerogel is 99.8% air and an extraordinary thermal insulator developed and used extensively by NASA rovers.',
      },
      {
        id: 'huddle_core_module',
        text: 'Cluster Crew in Central Bunk & Throttle Outer Dome Heating',
        impact: {
          power: 6,
          food: -6,
          crewHealth: -5,
        },
        outcomeDescription: 'Conserved critical power! Outer water pipes frosted over slightly, but the core module stayed safe.',
        educationalTakeaway: 'Nested habitat architecture keeps a warm, high-density core surrounded by unheated storage zones as a thermal buffer.',
      },
    ],
  },
  {
    id: 'subsurface_ice_discovery',
    title: 'Ground Penetrating Radar Spots Pure Glacial Ice Slab',
    severity: 'breakthrough',
    category: 'discovery',
    description: 'SHARAD radar analysis detected a 20-meter thick sheet of pure water ice buried just 1.5 meters beneath the surface regolith only 300 meters from camp!',
    scientificContext: 'NASA’s Mars Reconnaissance Orbiter uses the SHARAD shallow subsurface radar to map massive ice sheets across Martian mid-latitudes.',
    nasaRef: {
      source: 'ROVER',
      identifier: 'MRO-SHARAD-ICE-MAPPING-UTOPIA',
      dataType: 'ARCHIVED_NASA',
    },
    choices: [
      {
        id: 'tap_ice_vein',
        text: 'Drill Production Core & Connect Thermal Siphon',
        impact: {
          water: 35,
          power: -14,
          materials: -8,
        },
        outcomeDescription: 'Abundant clean water flows into outpost storage! Water security for months is secured.',
        educationalTakeaway: 'In-Situ Resource Utilization (ISRU) using local Martian water ice is key to avoiding hauling heavy water from Earth.',
      },
      {
        id: 'sample_ancient_ice',
        text: 'Extract Sterile Ice Cores for Paleoclimate & Astrobiology Analysis',
        impact: {
          sciencePoints: 50,
          water: 15,
          power: -10,
        },
        outcomeDescription: 'The core reveals atmospheric gas bubbles trapped millions of years ago when Mars had a thicker atmosphere!',
        educationalTakeaway: 'Ice cores on Earth and Mars preserve records of ancient atmospheres, volcanic eruptions, and climate evolution.',
      },
    ],
  },
  {
    id: 'mineral_spectrometry_find',
    title: 'Rover APXS Discovers Rich Hydrothermal Zeolite Bed',
    severity: 'breakthrough',
    category: 'discovery',
    description: 'The exploration rover’s Alpha Particle X-ray Spectrometer identified hydrated zeolites and clays formed in an ancient warm lake bed.',
    scientificContext: 'Zeolites are porous aluminosilicate minerals capable of molecular sieving and filtering gases and water.',
    nasaRef: {
      source: 'ROVER',
      identifier: 'PERSEVERANCE-SUPERCAM-MINERAL-ZEO',
      dataType: 'ARCHIVED_NASA',
    },
    choices: [
      {
        id: 'harvest_filtration_material',
        text: 'Harvest Zeolite Minerals to Upgrade Life Support Filters',
        impact: {
          materials: 20,
          water: 10,
          power: -8,
        },
        outcomeDescription: 'The natural zeolite granules were packed into molecular sieve beds, doubling air scrubber filtration performance.',
        educationalTakeaway: 'Natural minerals on Mars can be processed directly for life-support molecular filtration and CO2 scrubbers.',
      },
      {
        id: 'transmit_geology_paper',
        text: 'Transmit High-Resolution Spectral Mapping to NASA Earth Geologists',
        impact: {
          sciencePoints: 45,
          power: -6,
        },
        outcomeDescription: 'Earth scientific teams confirmed evidence of sustained liquid water in Mars’s ancient past!',
        educationalTakeaway: 'Clay minerals and zeolites only form in the presence of neutral, life-friendly liquid water.',
      },
    ],
  },
  {
    id: 'sleep_disruption_study',
    title: 'Circadian Desynchronization & Crew Fatigue',
    severity: 'warning',
    category: 'biology',
    description: 'A Martian day (Sol) is 24 hours, 39 minutes, and 35 seconds. The extra 39 minutes each day has accumulated, causing circadian sleep rhythm drift in two astronauts.',
    scientificContext: 'NASA OSDR research studies how non-24-hour cycles affect melatonin production, cognitive alertness, and immune health.',
    nasaRef: {
      source: 'OSDR',
      identifier: 'OSD-102-HUMAN-CIRCADIAN-DESYNCHRONY',
      dataType: 'ARCHIVED_NASA',
    },
    choices: [
      {
        id: 'blue_spectrum_lighting',
        text: 'Deploy Circadian Blue-Enriched LED Light Therapy',
        impact: {
          power: -6,
          crewHealth: 10,
        },
        outcomeDescription: 'Morning blue-wavelength photon pulses reset suprachiasmatic nucleus rhythms. Crew alertness rebounded fully.',
        educationalTakeaway: 'NASA astronauts on the ISS use solid-state LED lighting fixtures that shift wavelengths from morning blue to evening warm amber.',
      },
      {
        id: 'push_through_shift',
        text: 'Drink Extra Electrolyte Tea & Push Through Scientific Quotas',
        impact: {
          sciencePoints: 20,
          crewHealth: -8,
        },
        outcomeDescription: 'Work targets were met, but mental fatigue led to minor equipment calibration errors.',
        educationalTakeaway: 'Cognitive fatigue is a top risk for human spaceflight missions requiring complex manual and robotic tasks.',
      },
    ],
  },
  {
    id: 'printer_nozzle_jam',
    title: 'Regolith 3D Printer Extruder Jam',
    severity: 'warning',
    category: 'engineering',
    description: 'A high-grit granule of Martian basalt clogged the laser-assisted print nozzle of the automated habitat constructor.',
    scientificContext: 'Additive manufacturing with extraterrestrial regolith requires fine particle grading and uniform thermal melt pools.',
    nasaRef: {
      source: 'OSDR',
      identifier: 'NASA-CENTENNIAL-3D-PRINTED-HAB',
      dataType: 'SIMULATED',
    },
    choices: [
      {
        id: 'ultrasonic_clean',
        text: 'Perform Ultrasonic Cavitation Cleaning Cycle',
        impact: {
          power: -10,
          materials: -4,
        },
        outcomeDescription: 'High-frequency sound waves shattered the grit blockage. The printer nozzle returned to smooth laying of bead tracks.',
        educationalTakeaway: 'Ultrasonic cleaning uses acoustic micro-bubbles in liquid to scrub delicate machinery without abrasive contact.',
      },
      {
        id: 'swap_spare_nozzle',
        text: 'Replace with Tungsten-Carbide Spare Assembly',
        impact: {
          materials: -12,
        },
        outcomeDescription: 'Elena installed the heavy-duty tungsten nozzle. Printing resumed immediately without electrical downtime.',
        educationalTakeaway: 'Hardened alloys prevent abrasive wear when extruding sharp, unweathered planetary dust particles.',
      },
    ],
  },
  {
    id: 'solar_conjunction_blackout',
    title: 'Earth-Sun-Mars Solar Conjunction Approaches',
    severity: 'warning',
    category: 'space_weather',
    description: 'Mars and Earth are moving onto opposite sides of the Sun. For the next several Sols, solar coronal plasma will disrupt radio communications with Houston.',
    scientificContext: 'During solar conjunction (every 26 months), radio signals pass through the hot, ionized solar corona, corrupting data packets.',
    nasaRef: {
      source: 'DONKI',
      identifier: 'SOLAR-CONJUNCTION-MARS-2024',
      dataType: 'ARCHIVED_NASA',
    },
    choices: [
      {
        id: 'autonomous_safety_protocol',
        text: 'Initiate Autonomous AI Standby & Local Decision Authority',
        impact: {
          crewHealth: 4,
          power: -8,
        },
        outcomeDescription: 'The crew exercised autonomous command with zero hesitation, executing maintenance on their own judgment.',
        educationalTakeaway: 'Mars crews must be fully autonomous engineers because Earth cannot intervene during emergencies or conjunction blackouts.',
      },
      {
        id: 'record_coronal_radio_scintillation',
        text: 'Use Deep Space Antennas to Probe the Solar Corona',
        impact: {
          sciencePoints: 35,
          power: -10,
        },
        outcomeDescription: 'By measuring signal fluctuations (scintillation), the team mapped solar wind acceleration near the Sun’s surface.',
        educationalTakeaway: 'Radio science during conjunction lets scientists map the density and magnetic field of the Sun’s outer atmosphere.',
      },
    ],
  },
  {
    id: 'dosimeter_spike_radlab',
    title: 'Galactic Cosmic Ray Anomaly Detected by RAD Dosimeter',
    severity: 'danger',
    category: 'space_weather',
    description: 'The habitat’s silicon sensor dosimeter recorded a transient cluster of high-Z and high-energy (HZE) iron nuclei from outside our solar system.',
    scientificContext: 'Galactic Cosmic Rays (GCR) originate from distant supernovae. High-energy heavy ions are difficult to stop and damage DNA.',
    nasaRef: {
      source: 'RADLAB',
      identifier: 'RADLAB-CURIOSITY-MSL-HZE-SURFACE',
      dataType: 'ARCHIVED_NASA',
    },
    choices: [
      {
        id: 'water_wall_shield',
        text: 'Reconfigure Graywater Bladders to Surround Astronaut Bunks',
        impact: {
          water: -6,
          radiationShielding: 16,
          power: -4,
        },
        outcomeDescription: 'Water is packed with hydrogen protons, which excel at absorbing GCR particles without creating secondary neutron showers!',
        educationalTakeaway: 'Hydrogen-rich materials like water and polyethylene absorb heavy cosmic rays far better than dense lead or aluminum.',
      },
      {
        id: 'anti_oxidant_infusion',
        text: 'Administer Polyphenol & Astaxanthin Nutritional Countermeasures',
        impact: {
          food: -8,
          crewHealth: 8,
        },
        outcomeDescription: 'Nutritional antioxidants scavenged free radicals produced by ionizing radiation, accelerating cellular DNA repair.',
        educationalTakeaway: 'NASA space medicine researches dietary antioxidants (like berry polyphenols) to protect astronaut tissues from radiation damage.',
      },
    ],
  },
  {
    id: 'methane_plume_curiosity',
    title: 'Atmospheric Tunable Laser Detects Methane Spike',
    severity: 'breakthrough',
    category: 'discovery',
    description: 'The environmental sensor detected an ambient methane surge of 21 parts per billion by volume. Is it subsurface geology or microbial life?',
    scientificContext: 'Methane on Mars breaks down in sunlight within a few hundred years, meaning any detected methane must have been released recently.',
    nasaRef: {
      source: 'ROVER',
      identifier: 'CURIOSITY-SAM-TLS-METHANE-SPIKE',
      dataType: 'ARCHIVED_NASA',
    },
    choices: [
      {
        id: 'isotope_carbon_test',
        text: 'Run Carbon-12 / Carbon-13 Isotopic Mass Spectrometry',
        impact: {
          sciencePoints: 55,
          power: -14,
        },
        outcomeDescription: 'The isotopic ratio shows a distinct biogenic fractionation signature! A historic moment for human astrobiology.',
        educationalTakeaway: 'Living organisms preferentially use lighter Carbon-12 over Carbon-13, providing a signature biomarker for astrobiologists.',
      },
      {
        id: 'sample_local_regolith_serpentine',
        text: 'Check for Olivine Serpentinization (Geochemical Source)',
        impact: {
          sciencePoints: 35,
          materials: 10,
        },
        outcomeDescription: 'Data suggests underground water reacting with olivine rock (serpentinization), releasing hydrogen and methane gas.',
        educationalTakeaway: 'Serpentinization is a geological chemical reaction between water and rock that can produce methane without any living biology.',
      },
    ],
  },
  {
    id: 'greenhouse_led_short',
    title: 'Capacitor Arc in Red/Blue Hydroponic Light Bar',
    severity: 'warning',
    category: 'engineering',
    description: 'Humidity condensation from plant transpiration dripped onto an unsealed PCB connector, frying an LED driver module.',
    scientificContext: 'Plants absorb red photons (660 nm) for photosynthesis and blue photons (450 nm) for leaf expansion and stomatal opening.',
    nasaRef: {
      source: 'OSDR',
      identifier: 'NASA-VEGGIE-ISS-PLANT-LIGHTING',
      dataType: 'ARCHIVED_NASA',
    },
    choices: [
      {
        id: 'waterproof_conformal_coat',
        text: 'Solder Replacement Driver & Apply Silicone Conformal Coating',
        impact: {
          materials: -8,
          food: 10,
          power: -4,
        },
        outcomeDescription: 'Elena sealed all circuit boards with aerospace silicone. Grow lights relit with crisp purple-red luminescence.',
        educationalTakeaway: 'Conformal coating protects electronics from high relative humidity and salt accumulation in closed-loop greenhouses.',
      },
      {
        id: 'use_ambient_sunlight',
        text: 'Open Dome Shutter Mirrors & Rely on Filtered Mars Sunlight',
        impact: {
          power: 8,
          food: -6,
        },
        outcomeDescription: 'Natural Mars sunlight is only 43% as bright as Earth sunlight. Crops grew slower, but electricity was conserved.',
        educationalTakeaway: 'Mars receives less than half the solar irradiance of Earth because it orbits roughly 1.5 times farther from the Sun.',
      },
    ],
  },
  {
    id: 'rover_sample_return_cache',
    title: 'Autonomous Scout Rover Delivers Cached Core Tube',
    severity: 'breakthrough',
    category: 'discovery',
    description: 'The long-range autonomous survey rover returned to base with a sealed titanium core tube drilled from a dried river delta mudstone.',
    scientificContext: 'NASA’s Mars Sample Return campaign aims to return hermetically sealed titanium sample tubes collected by Perseverance to Earth.',
    nasaRef: {
      source: 'ROVER',
      identifier: 'PERSEVERANCE-SAMPLE-TUBE-CACHE-DELTA',
      dataType: 'ARCHIVED_NASA',
    },
    choices: [
      {
        id: 'glovebox_xrd_analysis',
        text: 'Analyze Inside Biosafety Level 4 Sealed Glovebox',
        impact: {
          sciencePoints: 50,
          power: -10,
        },
        outcomeDescription: 'High-resolution confocal imaging shows microscopic fossilized microbial mats in the sedimentary rock layers!',
        educationalTakeaway: 'NASA exercises strict Planetary Protection protocols to avoid contaminating samples with Earth bacteria.',
      },
      {
        id: 'prep_for_earth_return_rocket',
        text: 'Pack Tube into Mars Ascent Vehicle Thermal Capsule',
        impact: {
          sciencePoints: 35,
          materials: 12,
        },
        outcomeDescription: 'The core was safely integrated into the ascent rocket payload bay, ready for future flight back to Earth.',
        educationalTakeaway: 'Returning pristine Martian samples allows scientists on Earth to analyze them using massive synchrotron microscopes.',
      },
    ],
  },
  {
    id: 'spacesuit_seal_wear',
    title: 'EVA Suit Pressure Glove Degradation',
    severity: 'warning',
    category: 'engineering',
    description: 'Inspection of spacesuit pressure garments reveals micro-abrasions from sharp jagged Martian dust grains along finger joints.',
    scientificContext: 'Unlike rounded Earth sand smoothed by water and wind, Martian dust particles are angular, sharp, and highly abrasive.',
    nasaRef: {
      source: 'ROVER',
      identifier: 'NASA-XEMU-PLANETARY-DUST-MITIGATION',
      dataType: 'ARCHIVED_NASA',
    },
    choices: [
      {
        id: 'vulcanize_kevlar_patch',
        text: 'Apply Liquid Kevlar & Polyimide Protective Layer',
        impact: {
          materials: -10,
          crewHealth: 4,
        },
        outcomeDescription: 'The suits were reinforced against dust abrasion. Spacewalk safety ratings returned to 100%.',
        educationalTakeaway: 'Spacesuit engineers use multiple layers of Nomex, Kevlar, and aluminized Mylar to resist abrasive space environments.',
      },
      {
        id: 'reduce_eva_frequency',
        text: 'Mandate Tele-Robotic Operations Instead of Human EVAs',
        impact: {
          power: -8,
          crewHealth: 6,
        },
        outcomeDescription: 'Robotic rovers performed heavy hauling while astronauts piloted them safely from inside the warm habitat dome.',
        educationalTakeaway: 'Human-robot teaming keeps astronauts safe inside shielded environments while mobile rovers perform hazardous tasks.',
      },
    ],
  },
];

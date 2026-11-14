// ==========================================
// MARSBOUND: AUTHENTIC ARCHIVED NASA DATA
// ==========================================

export interface NasaApodItem {
  date: string;
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: 'image';
  copyright?: string;
}

export interface NasaRoverPhotoItem {
  id: number;
  sol: number;
  camera: {
    name: string;
    full_name: string;
  };
  img_src: string;
  earth_date: string;
  rover: {
    name: string;
    landing_date: string;
    launch_date: string;
    status: string;
  };
  caption: string;
}

export interface NasaDonkiEvent {
  messageType: string;
  messageID: string;
  messageIssueTime: string;
  messageURL: string;
  eventType: 'CME' | 'FLR' | 'SEP';
  speedKmS?: number;
  classType?: string;
  summary: string;
  simulatedMarsRisk: 'Low' | 'Moderate' | 'High' | 'Severe';
}

export interface NasaOsdrStudy {
  accession: string;
  title: string;
  organism: string;
  assayType: string;
  spaceflightMission: string;
  findings: string;
  countermeasure: string;
  citation: string;
}

export interface NasaRadLabMeasurement {
  instrument: string;
  location: string;
  parameter: string;
  value: string;
  context: string;
  citation: string;
}

export const ARCHIVED_APOD_COLLECTION: NasaApodItem[] = [
  {
    date: '2024-03-12',
    title: 'Perseverance at Belva Crater on Mars',
    explanation: 'NASA’s Perseverance rover captured this wide panoramic mosaic showing the ancient eroded rim of Belva Crater within Jezero Crater. The exposed layered rock strata tell the geological history of ancient rushing Martian rivers that once filled this basin with deep water billions of years ago.',
    url: 'https://images-assets.nasa.gov/image/PIA25828/PIA25828~orig.jpg',
    media_type: 'image',
    copyright: 'NASA/JPL-Caltech/ASU',
  },
  {
    date: '2024-02-18',
    title: 'Martian Sunset with Bluish Sky',
    explanation: 'A sunset on Mars has a distinctive bluish glow caused by fine dust particles in the thin Martian atmosphere scattering blue light directly forward toward the viewer. On Earth, our thick nitrogen atmosphere scatters blue light away, creating red sunsets.',
    url: 'https://images-assets.nasa.gov/image/PIA19411/PIA19411~orig.jpg',
    media_type: 'image',
    copyright: 'NASA/JPL-Caltech/MSSS/Texas A&M Univ.',
  },
  {
    date: '2024-01-25',
    title: 'Dune Fields in Gale Crater',
    explanation: 'Curiosity captured ripples in the dark basaltic sand dunes of Gale Crater. Wind speed, atmospheric density, and gravity on Mars combine to create ripple shapes that differ from any sand dunes found naturally on Earth.',
    url: 'https://images-assets.nasa.gov/image/PIA20317/PIA20317~orig.jpg',
    media_type: 'image',
    copyright: 'NASA/JPL-Caltech/MSSS',
  },
];

export const ARCHIVED_ROVER_PHOTOS: NasaRoverPhotoItem[] = [
  {
    id: 102401,
    sol: 752,
    camera: {
      name: 'MASTCAM_Z',
      full_name: 'Mast Camera Zoom - Left',
    },
    img_src: 'https://mars.nasa.gov/system/resources/detail_files/26084_PIA24836-web.jpg',
    earth_date: '2023-04-03',
    rover: {
      name: 'Perseverance',
      landing_date: '2021-02-18',
      launch_date: '2020-07-30',
      status: 'active',
    },
    caption: 'Ancient river delta boulder field in Jezero Crater showing sediment transport from torrential prehistoric floods.',
  },
  {
    id: 102402,
    sol: 890,
    camera: {
      name: 'NAVCAM_LEFT',
      full_name: 'Navigation Camera - Left',
    },
    img_src: 'https://mars.nasa.gov/system/resources/detail_files/26356_PIA25328-web.jpg',
    earth_date: '2023-08-22',
    rover: {
      name: 'Perseverance',
      landing_date: '2021-02-18',
      launch_date: '2020-07-30',
      status: 'active',
    },
    caption: 'Martian horizon overlooking Neretva Vallis with wind-sculpted ventifact rocks and fine ferric dust drifts.',
  },
  {
    id: 102403,
    sol: 940,
    camera: {
      name: 'FRONT_HAZCAM_LEFT_A',
      full_name: 'Front Hazard Avoidance Camera - Left',
    },
    img_src: 'https://mars.nasa.gov/system/resources/detail_files/26194_PIA24944-web.jpg',
    earth_date: '2023-10-12',
    rover: {
      name: 'Perseverance',
      landing_date: '2021-02-18',
      launch_date: '2020-07-30',
      status: 'active',
    },
    caption: 'Close-up of Perseverance titanium wheel cleats traversing jagged basalt regolith and bedrock fractures.',
  },
];

export const ARCHIVED_DONKI_NOTIFICATIONS: NasaDonkiEvent[] = [
  {
    messageType: 'CME',
    messageID: '20240510-CME-001',
    messageIssueTime: '2024-05-10T18:24:00Z',
    messageURL: 'https://kauai.ccmc.gsfc.nasa.gov/DONKI/view/CME/27492/1',
    eventType: 'CME',
    speedKmS: 1250,
    classType: 'X-Class Flare Source (X5.8)',
    summary: 'Fast Earth-directed and Mars-crossing coronal mass ejection erupted from active solar region NOAA 13664. Front speed estimated at 1,250 km/s.',
    simulatedMarsRisk: 'Severe',
  },
  {
    messageType: 'FLR',
    messageID: '20240323-FLR-001',
    messageIssueTime: '2024-03-23T01:33:00Z',
    messageURL: 'https://kauai.ccmc.gsfc.nasa.gov/DONKI/view/FLR/26811/1',
    eventType: 'FLR',
    classType: 'M4.2',
    summary: 'Moderate impulsive solar flare observed by GOES satellite in soft X-ray wavelengths. Minor solar energetic particle (SEP) enhancement detected in interplanetary space.',
    simulatedMarsRisk: 'Moderate',
  },
  {
    messageType: 'SEP',
    messageID: '20240212-SEP-001',
    messageIssueTime: '2024-02-12T14:10:00Z',
    messageURL: 'https://kauai.ccmc.gsfc.nasa.gov/DONKI/view/SEP/25912/1',
    eventType: 'SEP',
    summary: 'Elevated proton flux observed exceeding 10 MeV threshold. Spacecraft instruments placed in protective low-power observation mode.',
    simulatedMarsRisk: 'High',
  },
];

export const ARCHIVED_OSDR_STUDIES: NasaOsdrStudy[] = [
  {
    accession: 'OSD-102',
    title: 'Transcriptomic and Epigenetic Profiling of Bone Remodeling Under Microgravity',
    organism: 'Homo sapiens (Primary Osteoblasts)',
    assayType: 'RNA-seq Gene Expression Profiling',
    spaceflightMission: 'International Space Station (ISS-Expedition 56/57)',
    findings: 'Microgravity suppresses osteoblast differentiation while activating osteoclast resorption, leading to 1.0% to 1.5% bone mineral density loss per month without active resistance countermeasures.',
    countermeasure: 'Daily high-load resistive exercise (ARED machine) combined with bisphosphonates and Vitamin D/Calcium supplementation.',
    citation: 'NASA Open Science Data Repository (OSDR) Accession OSD-102, NASA Ames Research Center.',
  },
  {
    accession: 'OSD-120',
    title: 'Plant Habitat Microgreen Physiological Adaptations to Spaceflight Environments',
    organism: 'Arabidopsis thaliana & Raphanus sativus (Radish)',
    assayType: 'Metabolomic & Photosynthetic Efficiency Analysis',
    spaceflightMission: 'Advanced Plant Habitat (APH-02)',
    findings: 'Plants grown in confined aeroponics under narrow-spectrum blue (450nm) and red (660nm) LEDs maintain high photosynthetic yield and accumulate enhanced levels of protective anthocyanin antioxidants.',
    countermeasure: 'Optimized diurnal lighting cycles (16h light / 8h dark) and automated root-zone moisture sensing prevents hypoxic root rot.',
    citation: 'NASA OSDR Accession OSD-120, NASA Kennedy Space Center.',
  },
  {
    accession: 'OSD-379',
    title: 'Immune Dysregulation and Latent Viral Reactivation During Long-Duration Spaceflight',
    organism: 'Human Peripheral Blood Mononuclear Cells',
    assayType: 'Flow Cytometry & Cytokine Profiling',
    spaceflightMission: 'NASA Twin Study (Scott & Mark Kelly)',
    findings: 'Prolonged space radiation and confinement elevate circulating pro-inflammatory cytokines and alter T-cell activation, temporarily depressing adaptive immune defenses.',
    countermeasure: 'Strict sleep hygiene, polyphenol-rich nutrition, clean air filtration, and stress mitigation protocols.',
    citation: 'NASA OSDR Accession OSD-379, NASA Johnson Space Center.',
  },
];

export const ARCHIVED_RADLAB_DATA: NasaRadLabMeasurement[] = [
  {
    instrument: 'Curiosity MSL RAD (Radiation Assessment Detector)',
    location: 'Gale Crater Surface, Mars',
    parameter: 'Galactic Cosmic Ray (GCR) Surface Dose Rate',
    value: '0.67 ± 0.05 mSv / day',
    context: 'Average background radiation dose rate measured directly on the Martian surface. Over a 500-day surface mission, an unshielded astronaut would receive approximately 335 mSv (~half of the career limit).',
    citation: 'Hassler et al., Science 343, "Mars\' Surface Radiation Environment Measured with the Mars Science Laboratory\'s Curiosity Rover".',
  },
  {
    instrument: 'Curiosity MSL RAD',
    location: 'Interplanetary Transit (Earth to Mars)',
    parameter: 'Deep Space Cruise Dose Rate',
    value: '1.84 ± 0.30 mSv / day',
    context: 'In deep space without planetary body shielding (Mars blocks half the sky when on the ground), cruise radiation is roughly three times higher than surface levels.',
    citation: 'Zeitlin et al., Science 340, "Measurements of Energetic Particle Radiation in Transit to Mars on the Mars Science Laboratory".',
  },
  {
    instrument: 'ISS Radiation Area Monitor (RAM)',
    location: 'Low Earth Orbit (400 km altitude)',
    parameter: 'LEO Trapped Belt & GCR Dose Rate',
    value: '0.30 - 0.50 mSv / day',
    context: 'Astronauts on the International Space Station benefit from Earth’s strong magnetic field (magnetosphere), which deflects the vast majority of lower-energy cosmic rays.',
    citation: 'NASA Space Radiation Analysis Group (SRAG), NASA Johnson Space Center.',
  },
];

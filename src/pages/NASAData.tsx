// ==========================================
// MARSBOUND: NASA OPEN DATA EXPLORER
// Authentic NASA DONKI, Rover Photos, APOD, OSDR & RadLab
// ==========================================

import React, { useState, useEffect } from 'react';
import {
  fetchApod,
  fetchRoverPhotos,
  fetchSpaceWeatherNotifications,
  getOsdrStudies,
  getRadLabData,
  NasaApiResponse,
} from '../services/nasaApi';
import {
  NasaApodItem,
  NasaRoverPhotoItem,
  NasaDonkiEvent,
  NasaOsdrStudy,
  NasaRadLabMeasurement,
} from '../data/archivedNasaData';
import { DataTransparencyBadge } from '../components/DataTransparencyBadge';
import {
  Database,
  Globe,
  Sun,
  Camera,
  Dna,
  ShieldAlert,
  ExternalLink,
  RefreshCw,
  Info,
} from 'lucide-react';

export const NASAData: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'apod' | 'rover' | 'donki' | 'osdr' | 'radlab'>('apod');

  const [apodData, setApodData] = useState<NasaApiResponse<NasaApodItem> | null>(null);
  const [roverData, setRoverData] = useState<NasaApiResponse<NasaRoverPhotoItem[]> | null>(null);
  const [donkiData, setDonkiData] = useState<NasaApiResponse<NasaDonkiEvent[]> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const osdrStudies = getOsdrStudies();
  const radLabData = getRadLabData();

  useEffect(() => {
    loadAllNasaData();
  }, []);

  const loadAllNasaData = async () => {
    setLoading(true);
    try {
      const [apod, rover, donki] = await Promise.all([
        fetchApod(),
        fetchRoverPhotos(750),
        fetchSpaceWeatherNotifications(),
      ]);
      setApodData(apod);
      setRoverData(rover);
      setDonkiData(donki);
    } catch (e) {
      console.warn('Network issue fetching NASA APIs, falling back to local archive', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-neon-cyan">
            <Globe className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                OFFICIAL NASA OPEN DATA REPOSITORY
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                SCIENTIFIC TRANSPARENCY
              </span>
            </div>
            <h2 className="text-2xl font-bold font-display text-white mt-0.5">
              NASA Data Explorer & Open Science Telemetry
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Explore authentic space weather, rover cameras, biology research, and radiation data.
            </p>
          </div>
        </div>

        <button
          onClick={loadAllNasaData}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-cyan-800 text-cyan-300 hover:bg-slate-800 text-xs font-mono font-bold flex items-center gap-2 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'SYNCING NASA...' : 'SYNC LIVE NASA'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('apod')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-display transition-all ${
            activeTab === 'apod'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-neon-cyan'
              : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          <Sun className="w-4 h-4" />
          <span>NASA APOD Discovery</span>
        </button>

        <button
          onClick={() => setActiveTab('rover')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-display transition-all ${
            activeTab === 'rover'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-neon-cyan'
              : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Perseverance Rover Photos</span>
        </button>

        <button
          onClick={() => setActiveTab('donki')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-display transition-all ${
            activeTab === 'donki'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-neon-cyan'
              : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>NASA DONKI Space Weather</span>
        </button>

        <button
          onClick={() => setActiveTab('osdr')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-display transition-all ${
            activeTab === 'osdr'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-neon-cyan'
              : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          <Dna className="w-4 h-4" />
          <span>NASA OSDR Space Biology</span>
        </button>

        <button
          onClick={() => setActiveTab('radlab')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-display transition-all ${
            activeTab === 'radlab'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-neon-cyan'
              : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>NASA RadLab Dosimetry</span>
        </button>
      </div>

      {/* TAB 1: NASA APOD */}
      {activeTab === 'apod' && apodData && (
        <div className="p-6 rounded-2xl border border-cyan-800/40 bg-slate-900/90 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <DataTransparencyBadge
              type={apodData.sourceType}
              sourceText={apodData.attribution}
            />
            <a
              href="https://apod.nasa.gov/"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>View NASA APOD Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="rounded-xl overflow-hidden border border-slate-800 shadow-2xl bg-black">
              <img
                src={apodData.data.url}
                alt={apodData.data.title}
                className="w-full h-72 sm:h-96 object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="space-y-3">
              <div className="text-xs font-mono text-slate-400">
                DATE: {apodData.data.date} • CREDIT: {apodData.data.copyright}
              </div>
              <h3 className="text-2xl font-bold font-display text-white">
                {apodData.data.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-h-60 overflow-y-auto pr-2">
                {apodData.data.explanation}
              </p>
              <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-300 font-mono">
                💡 Space Fact: The Astronomy Picture of the Day (APOD) is curated daily by NASA
                astrophysicists Robert Nemiroff and Jerry Bonnell.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MARS ROVER PHOTOS */}
      {activeTab === 'rover' && roverData && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <DataTransparencyBadge
              type={roverData.sourceType}
              sourceText={roverData.attribution}
            />
            <span className="text-xs font-mono text-slate-400">
              NASA Perseverance Rover Telemetry (Jezero Crater)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {roverData.data.map((photo) => (
              <div
                key={photo.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden flex flex-col justify-between hover:border-cyan-500/50 transition-all shadow-xl"
              >
                <div className="relative h-56 bg-black overflow-hidden">
                  <img
                    src={photo.img_src}
                    alt={photo.caption}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 text-[10px] font-mono text-cyan-300">
                    Sol {photo.sol}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="text-xs font-bold text-slate-100 font-display">
                    {photo.camera.full_name} ({photo.camera.name})
                  </div>
                  <p className="text-xs text-slate-400">{photo.caption}</p>
                  <div className="text-[10px] font-mono text-slate-500">
                    Earth Date: {photo.earth_date} • Rover: {photo.rover.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: NASA DONKI */}
      {activeTab === 'donki' && donkiData && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <DataTransparencyBadge
              type={donkiData.sourceType}
              sourceText={donkiData.attribution}
            />
            <div className="text-xs font-mono text-amber-400 flex items-center gap-1">
              <Info className="w-4 h-4 shrink-0" />
              <span>Simulated radiation dose rates are calculated separately for gameplay education.</span>
            </div>
          </div>

          <div className="space-y-3">
            {donkiData.data.map((evt) => (
              <div
                key={evt.messageID}
                className="p-4 rounded-xl border border-slate-800 bg-slate-900/90 space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-md bg-orange-950 text-orange-400 border border-orange-500/40">
                      {evt.eventType}
                    </span>
                    <span className="text-sm font-bold text-slate-100 font-display">
                      Event ID: {evt.messageID}
                    </span>
                    {evt.classType && (
                      <span className="text-xs font-mono text-rose-400 font-semibold">
                        ({evt.classType})
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-mono text-slate-400">
                    {new Date(evt.messageIssueTime).toUTCString()}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">{evt.summary}</p>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">
                    Simulated Outpost Hazard Rating:{' '}
                    <strong
                      className={
                        evt.simulatedMarsRisk === 'Severe'
                          ? 'text-rose-400'
                          : evt.simulatedMarsRisk === 'High'
                          ? 'text-orange-400'
                          : 'text-amber-400'
                      }
                    >
                      {evt.simulatedMarsRisk}
                    </strong>
                  </span>

                  <a
                    href={evt.messageURL}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <span>DONKI Archive Entry</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: NASA OSDR SPACE BIOLOGY */}
      {activeTab === 'osdr' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <DataTransparencyBadge
              type={osdrStudies.sourceType}
              sourceText={osdrStudies.attribution}
            />
            <span className="text-xs font-mono text-slate-400">
              NASA Ames Research Center • Spaceflight Biology
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {osdrStudies.data.map((study) => (
              <div
                key={study.accession}
                className="p-5 rounded-2xl border border-slate-800 bg-slate-900/90 flex flex-col justify-between space-y-3 shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800">
                      {study.accession}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {study.spaceflightMission}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-100 font-display mb-2">
                    {study.title}
                  </h4>

                  <div className="text-xs space-y-2 text-slate-300">
                    <div>
                      <strong className="text-purple-300 font-mono">Organism: </strong>
                      <span>{study.organism}</span>
                    </div>
                    <div>
                      <strong className="text-cyan-300 font-mono">Key Findings: </strong>
                      <p className="mt-0.5 leading-relaxed">{study.findings}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 text-xs">
                  <strong className="text-emerald-400 font-mono">Countermeasure: </strong>
                  <p className="mt-0.5 text-slate-300">{study.countermeasure}</p>
                  <div className="mt-2 text-[10px] text-slate-500 font-mono truncate">
                    {study.citation}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: NASA RADLAB RADIATION DOSIMETRY */}
      {activeTab === 'radlab' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <DataTransparencyBadge
              type={radLabData.sourceType}
              sourceText={radLabData.attribution}
            />
            <span className="text-xs font-mono text-slate-400">
              Mars Surface vs LEO Radiation Benchmark
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {radLabData.data.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-slate-800 bg-slate-900/90 flex flex-col justify-between space-y-3 shadow-xl"
              >
                <div>
                  <div className="text-[10px] font-mono uppercase text-cyan-400 font-bold mb-1">
                    {item.location}
                  </div>
                  <h4 className="text-sm font-bold text-slate-100 font-display mb-2">
                    {item.instrument}
                  </h4>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 mb-3">
                    <div className="text-xs font-mono text-slate-400">{item.parameter}</div>
                    <div className="text-xl font-bold font-mono text-orange-400 mt-1">
                      {item.value}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{item.context}</p>
                </div>

                <div className="pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-500">
                  {item.citation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

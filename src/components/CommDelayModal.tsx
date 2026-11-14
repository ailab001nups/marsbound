// ==========================================
// MARSBOUND: EARTH COMMUNICATION TERMINAL & DELAY SIMULATOR
// ==========================================

import React, { useState } from 'react';
import { GameState } from '../types/game';
import { getRadioDelayMinutes } from '../utils/calculations';
import { Radio, Send, Clock, Globe, ArrowRight, ShieldAlert } from 'lucide-react';

interface Props {
  state: GameState;
  onSendMessage: (topic: string, content: string) => void;
}

export const CommDelayModal: React.FC<Props> = ({ state, onSendMessage }) => {
  const [topic, setTopic] = useState<string>('Power Grid Optimization Advice');
  const [customMsg, setCustomMsg] = useState<string>('');
  const [isTransmitting, setIsTransmitting] = useState<boolean>(false);

  const delayMinutes = getRadioDelayMinutes(state.currentSol);

  const presetTopics = [
    'Power Grid Optimization Advice',
    'Space Weather Radiation Advisory',
    'Water Recovery Chemical Formulation',
    'Hydroponic Nutrient Deficiency Troubleshooting',
  ];

  const handleSend = () => {
    if (!topic) return;
    setIsTransmitting(true);
    setTimeout(() => {
      onSendMessage(
        topic,
        customMsg.trim() || `Requesting Mission Control engineering review on ${topic}.`
      );
      setCustomMsg('');
      setIsTransmitting(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Educational Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-800/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-neon-cyan shrink-0">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold font-display text-white">
                Deep Space Network: Earth-Mars Communication Lag
              </h3>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                ACTIVE SOL {state.currentSol}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Radio waves travel at the speed of light (300,000 km/s). Depending on planetary orbital
              positions, radio packets take between <strong>3.8 and 22 minutes</strong> one-way!
              During an emergency, you cannot wait for Houston—the commander must act autonomously!
            </p>
          </div>
        </div>

        {/* Live Delay Gauge */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-cyan-500/40 text-center min-w-[160px] shrink-0">
          <div className="text-[10px] font-mono uppercase text-slate-400">
            One-Way Signal Lag
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-400 flex items-center justify-center gap-1 mt-0.5">
            <Clock className="w-5 h-5 text-cyan-400" />
            <span>~{delayMinutes}m</span>
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-0.5">
            Round-Trip: ~{Math.round(delayMinutes * 2)}m
          </div>
        </div>
      </div>

      {/* Message Composer */}
      <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/90 space-y-4">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Globe className="w-4 h-4 text-cyan-400" />
          <span>Transmit Telemetry & Query to NASA Houston</span>
        </h4>

        {/* Preset Topic Pills */}
        <div className="space-y-1.5">
          <label className="text-xs text-slate-400">Choose consultation subject:</label>
          <div className="flex flex-wrap gap-2">
            {presetTopics.map((t) => (
              <button
                key={t}
                onClick={() => setTopic(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  topic === t
                    ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200 font-bold shadow-neon-cyan'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Custom text optional */}
        <textarea
          value={customMsg}
          onChange={(e) => setCustomMsg(e.target.value)}
          placeholder={`Additional operational notes for Houston Flight Director (e.g., "Requesting advisory on battery bus thermals during night cycle")...`}
          className="w-full h-20 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
        />

        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Message will be packaged into deep space radio packets with simulated lag.</span>
          </span>

          <button
            onClick={handleSend}
            disabled={isTransmitting}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold font-display uppercase tracking-wider flex items-center gap-2 transition-all ${
              isTransmitting
                ? 'bg-cyan-900 text-cyan-400 cursor-wait'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-neon-cyan hover:scale-105'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>{isTransmitting ? 'TRANSMITTING VIA DSN...' : 'TRANSMIT TO EARTH'}</span>
          </button>
        </div>
      </div>

      {/* Communication Queue Log */}
      <div className="space-y-3">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
          TRANSCEIVER PACKET LOG ({state.commQueue.length} Transmissions)
        </h4>

        <div className="space-y-2.5">
          {state.commQueue
            .slice()
            .reverse()
            .map((msg) => (
              <div
                key={msg.id}
                className={`p-4 rounded-xl border transition-all ${
                  msg.sender === 'Commander'
                    ? 'bg-slate-950/70 border-slate-800'
                    : 'bg-slate-900/90 border-cyan-800/40 shadow-[0_0_12px_rgba(6,182,212,0.1)]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold font-display ${
                        msg.sender === 'Commander' ? 'text-orange-400' : 'text-cyan-400'
                      }`}
                    >
                      {msg.sender}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">•</span>
                    <span className="text-xs font-semibold text-slate-200">{msg.topic}</span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] font-mono">
                    <span className="text-slate-400">Sent: Sol {msg.sentSol}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full border ${
                        msg.isDelivered
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                          : 'bg-amber-950/80 text-amber-300 border-amber-500/40 animate-pulse'
                      }`}
                    >
                      {msg.isDelivered ? 'Received' : `In Transit (~${msg.delayMinutes}m lag)`}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">{msg.content}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { MatchConfig } from '../types';
import { Clock, Users, Bot, Shield, Share2, Play } from 'lucide-react';

interface MatchSetupProps {
  config: MatchConfig;
  setConfig: React.Dispatch<React.SetStateAction<MatchConfig>>;
  onStartMatch: () => void;
}

export const MatchSetup: React.FC<MatchSetupProps> = ({ config, setConfig, onStartMatch }) => {
  const durationOptions = [5, 10, 15, 30];

  return (
    <div className="w-full max-w-xl mx-auto bg-[#1a2e24] border border-[#2d4d3e] rounded-xl p-6 shadow-2xl text-white font-sans">
      <div className="flex items-center gap-3 border-b border-[#2d4d3e] pb-4 mb-6">
        <div className="p-3 bg-[#2d4d3e] border border-[#86efac]/40 rounded text-[#86efac]">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#86efac] font-mono">
            Session Configuration
          </span>
          <h2 className="text-xl font-bold text-white tracking-wide">Pengaturan Sesi Brawler Network</h2>
        </div>
      </div>

      <div className="space-y-6">
        {/* Match Timer Selection */}
        <div>
          <label className="block text-xs font-semibold text-[#86efac] mb-2 uppercase tracking-widest font-mono flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#facc15]" />
            <span>Durasi Pertandingan (Menit)</span>
          </label>
          <div className="grid grid-cols-4 gap-3">
            {durationOptions.map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => setConfig({ ...config, durationMinutes: mins })}
                className={`py-3 px-4 rounded border text-center font-bold text-sm transition-all cursor-pointer font-mono ${
                  config.durationMinutes === mins
                    ? 'bg-[#facc15] border-[#facc15] text-black shadow-lg shadow-[#facc15]/20'
                    : 'bg-[#080d0a] border-[#2d4d3e] text-slate-300 hover:border-[#86efac]'
                }`}
              >
                {mins} m
              </button>
            ))}
          </div>
        </div>

        {/* AI Bot Fill Count */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-[#86efac] uppercase tracking-widest font-mono flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-[#86efac]" />
              <span>Jumlah Bot Komputer</span>
            </label>
            <span className="text-xs font-mono font-bold text-[#facc15] bg-[#080d0a] border border-[#2d4d3e] px-2.5 py-0.5 rounded">
              {config.botCount} Bot (+1 Player = {config.botCount + 1}/20)
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={19}
            value={config.botCount}
            onChange={(e) => setConfig({ ...config, botCount: Number(e.target.value) })}
            className="w-full accent-[#86efac] cursor-pointer bg-[#080d0a] h-2 rounded-lg"
          />
          <p className="text-[11px] text-slate-400 mt-1.5">
            Bot AI akan mengisi slot kosong hingga total 20 pemain secara otomatis untuk simulasi arena penuh.
          </p>
        </div>

        {/* Room Code */}
        <div className="bg-[#080d0a] border border-[#2d4d3e] rounded-lg p-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-[#86efac] font-mono font-semibold uppercase tracking-widest">
              Kode Ruang Sesi
            </div>
            <div className="font-mono font-bold text-[#facc15] text-base">{config.roomCode}</div>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert('Link Sesi Brawler PKT telah disalin!');
            }}
            className="p-2.5 bg-[#162a21] hover:bg-[#2d4d3e] text-[#86efac] rounded border border-[#2d4d3e] text-xs font-mono font-semibold flex items-center gap-1.5 cursor-pointer transition"
          >
            <Share2 className="w-4 h-4" /> Salin Link
          </button>
        </div>

        {/* Start Match Button */}
        <button
          onClick={onStartMatch}
          className="w-full bg-[#86efac] hover:bg-[#86efac]/90 text-black font-extrabold py-4 px-6 rounded-lg shadow-xl transition flex items-center justify-center gap-2 uppercase tracking-widest text-sm font-mono cursor-pointer"
        >
          <Play className="w-5 h-5 fill-current text-black" /> MULAI PERTANDINGAN RISK BRAWLER 2D
        </button>
      </div>
    </div>
  );
};

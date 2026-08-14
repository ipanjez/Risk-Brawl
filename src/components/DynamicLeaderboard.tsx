import React, { useState } from 'react';
import { PlayerState } from '../types';
import { Trophy, Award, Zap, HelpCircle, Leaf, Crown, ChevronDown, ChevronUp } from 'lucide-react';

interface DynamicLeaderboardProps {
  players: PlayerState[];
  localPlayerId: string;
  isGameStarted?: boolean;
}

export const DynamicLeaderboard: React.FC<DynamicLeaderboardProps> = ({ players, localPlayerId, isGameStarted = true }) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const sortedPlayers = [...players].sort((a, b) => {
    const scoreA = isGameStarted ? (a.knowledgeScore + a.koCount * 30 + a.esgScore) : 0;
    const scoreB = isGameStarted ? (b.knowledgeScore + b.koCount * 30 + b.esgScore) : 0;
    return scoreB - scoreA;
  });

  return (
    <div className="w-48 sm:w-60 bg-[#080d0a]/80 backdrop-blur-md border border-[#2d4d3e] rounded-xl flex flex-col shadow-2xl overflow-hidden font-sans text-white transition-all pointer-events-auto">
      {/* Header */}
      <div 
        onClick={() => setCollapsed(!collapsed)}
        className="px-2.5 py-1.5 border-b border-[#2d4d3e] flex justify-between items-center bg-[#162a21]/80 cursor-pointer hover:bg-[#162a21] transition select-none"
      >
        <div className="flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5 text-[#facc15]" />
          <span className="text-[10px] sm:text-xs font-bold uppercase text-[#86efac] tracking-tight font-mono">
            Leaderboard
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] text-[#facc15] font-mono font-semibold bg-black/40 px-1.5 py-0.5 rounded border border-[#2d4d3e]">
            {players.length} Pemain
          </span>
          <button className="text-slate-400 hover:text-white p-0.5" title={collapsed ? "Buka Leaderboard" : "Tutup Leaderboard"}>
            {collapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Leaderboard Rows */}
      {!collapsed && (
        <div className="flex-1 overflow-y-auto p-1 space-y-1 max-h-[160px] sm:max-h-[220px] custom-scrollbar">
          {sortedPlayers.map((p, index) => {
            const knowledge = isGameStarted ? (p.knowledgeScore || 0) : 0;
            const kos = isGameStarted ? (p.koCount || 0) : 0;
            const esg = isGameStarted ? (p.esgScore || 0) : 0;
            const totalScore = isGameStarted ? (knowledge + kos * 30 + esg) : 0;
            const isMe = p.id === localPlayerId;
            const isLeader = index === 0;

            return (
              <div
                key={p.id}
                className={`flex items-center justify-between px-2 py-1.5 rounded-lg transition-colors text-xs ${
                  isLeader
                    ? 'bg-[#162a21]/90 border border-[#facc15]/60 shadow-sm'
                    : isMe
                    ? 'bg-[#1a2e24]/90 border border-[#86efac]/80 ring-1 ring-[#86efac]/30'
                    : 'bg-black/50 border border-[#2d4d3e]/40 hover:bg-[#162a21]/50'
                }`}
              >
                <div className="flex items-center space-x-1.5 min-w-0 flex-1">
                  <span
                    className={`text-[10px] font-mono w-3.5 font-bold shrink-0 text-center ${
                      isLeader
                        ? 'text-[#facc15]'
                        : index === 1
                        ? 'text-slate-300'
                        : index === 2
                        ? 'text-amber-500'
                        : 'text-gray-500'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <div className="truncate flex-1">
                    <div className="text-[11px] font-medium text-white flex items-center gap-1 truncate">
                      <span className="truncate">{p.name}</span>
                      {p.isHost && (
                        <span className="text-[8px] bg-amber-500/20 border border-amber-500/60 text-[#facc15] font-bold font-mono px-1 py-0.2 rounded flex items-center gap-0.5 shrink-0" title="Room Host">
                          <Crown className="w-2.5 h-2.5 text-[#facc15]" /> HOST
                        </span>
                      )}
                      {isMe && (
                        <span className="text-[8px] bg-[#86efac]/20 border border-[#86efac]/50 text-[#86efac] font-bold font-mono px-1 py-0.2 rounded shrink-0">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] font-mono text-gray-400 mt-0.5">
                      <span className="text-blue-400 flex items-center gap-0.5">
                        <HelpCircle className="w-2.5 h-2.5" /> {knowledge}
                      </span>
                      <span className="text-red-400 flex items-center gap-0.5">
                        <Zap className="w-2.5 h-2.5" /> {kos}
                      </span>
                      <span className="text-[#86efac] flex items-center gap-0.5">
                        <Leaf className="w-2.5 h-2.5" /> {esg}
                      </span>
                    </div>
                  </div>
                </div>

                <span className="text-[11px] font-mono font-bold text-[#facc15] shrink-0 ml-1.5">
                  {totalScore.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

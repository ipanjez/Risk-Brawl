import React, { useState } from 'react';
import { PlayerState } from '../types';
import { Trophy, Award, RotateCcw, HelpCircle, Zap, Leaf, Download, Crown, FileText, Loader2 } from 'lucide-react';
import { downloadCertificatePDF } from '../utils/certificateGenerator';

interface GameOverModalProps {
  players: PlayerState[];
  localPlayerId?: string;
  onRestart: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ players, localPlayerId, onRestart }) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const sorted = [...players].sort((a, b) => {
    const scoreA = a.knowledgeScore + a.koCount * 30 + a.esgScore;
    const scoreB = b.knowledgeScore + b.koCount * 30 + b.esgScore;
    return scoreB - scoreA;
  });

  const winner = sorted[0];
  const myIndex = sorted.findIndex((p) => p.id === localPlayerId);
  const myState = myIndex !== -1 ? sorted[myIndex] : sorted[0];

  const handleDownloadCertificate = async () => {
    if (!myState || isGenerating) return;
    try {
      setIsGenerating(true);
      const rank = myIndex !== -1 ? myIndex + 1 : 1;
      await downloadCertificatePDF(myState, rank);
    } catch (err) {
      console.error('Error generating certificate PDF:', err);
      alert('Gagal membuat file PDF sertifikat. Silakan coba kembali.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in font-sans select-none">
      <div className="bg-[#1a2e24] border-2 border-[#86efac] rounded-2xl max-w-3xl w-full p-4 sm:p-6 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative text-white overflow-hidden max-h-[92vh] flex flex-col custom-scrollbar">
        <div className="text-center pb-4 sm:pb-6 border-b border-[#2d4d3e] shrink-0">
          <div className="inline-flex p-2.5 sm:p-3 bg-[#2d4d3e] border border-[#facc15] rounded-xl text-[#facc15] mb-2 sm:mb-3 animate-bounce">
            <Trophy className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-[#86efac] block">
            Session Completed
          </span>
          <h2 className="text-xl sm:text-2xl font-black tracking-wide text-white">PERTANDINGAN SELESAI</h2>
        </div>

        {/* Scrollable middle container */}
        <div className="overflow-y-auto flex-1 my-3 sm:my-4 custom-scrollbar pr-1">
          {/* Winner Highlight */}
          {winner && (
            <div className="mb-4 bg-[#162a21] border border-[#facc15] rounded-xl p-4 sm:p-5 text-center shadow-lg">
              <div className="text-[10px] sm:text-xs font-bold font-mono text-[#facc15] uppercase tracking-widest mb-1 flex items-center justify-center gap-1.5">
                <Award className="w-4 h-4" /> CHAMPION OF RISK BRAWLER ARENA
              </div>
              <div className="text-xl sm:text-2xl font-black text-white">{winner.name}</div>
              <div className="text-[#facc15] font-mono font-bold text-lg sm:text-xl mt-1">
                TOTAL SKOR: {(winner.score || winner.knowledgeScore + winner.koCount * 30 + winner.esgScore).toLocaleString()} POIN
              </div>

              <div className="flex justify-center gap-4 sm:gap-6 mt-3 text-[11px] sm:text-xs font-mono">
                <div className="flex items-center gap-1 text-blue-400 font-semibold">
                  <HelpCircle className="w-3.5 h-3.5" /> {winner.knowledgeScore} Knowledge
                </div>
                <div className="flex items-center gap-1 text-red-400 font-semibold">
                  <Zap className="w-3.5 h-3.5" /> {winner.koCount} KO
                </div>
                <div className="flex items-center gap-1 text-[#86efac] font-semibold">
                  <Leaf className="w-3.5 h-3.5" /> {winner.esgScore} ESG
                </div>
              </div>
            </div>
          )}

          {/* Top Podium List */}
          <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar">
            {sorted.map((p, idx) => {
              const totScore = p.score || p.knowledgeScore + p.koCount * 30 + p.esgScore;
              const isMe = p.id === localPlayerId;
              return (
                <div
                  key={p.id}
                  className={`flex items-center justify-between p-2.5 rounded-xl text-xs transition ${
                    isMe ? 'bg-[#2d4d3e] border-2 border-[#86efac]' : 'bg-[#080d0a] border border-[#2d4d3e]'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono font-bold text-[#facc15] w-5 shrink-0">#{idx + 1}</span>
                    <span className="font-bold text-white flex items-center gap-1.5 truncate">
                      <span className="truncate">{p.name}</span>
                      {p.isHost && (
                        <span className="text-[9px] bg-amber-500/20 border border-amber-500/60 text-[#facc15] font-bold font-mono px-1.5 py-0.2 rounded flex items-center gap-0.5 shrink-0" title="Room Host">
                          <Crown className="w-2.5 h-2.5 text-[#facc15]" /> HOST
                        </span>
                      )}
                      {isMe && <span className="text-[9px] bg-[#86efac] text-black px-1.5 py-0.2 rounded font-mono font-bold shrink-0">ANDA</span>}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 sm:gap-4 text-slate-300 font-mono text-[11px] shrink-0 ml-2">
                    <span className="hidden sm:inline">Kuis: {p.knowledgeScore}</span>
                    <span className="hidden sm:inline">KO: {p.koCount}</span>
                    <span className="hidden sm:inline">ESG: {p.esgScore}</span>
                    <span className="font-bold text-[#facc15] text-xs sm:text-sm">{totScore} Pts</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 shrink-0 pt-2 border-t border-[#2d4d3e]">
          <button
            onClick={handleDownloadCertificate}
            disabled={isGenerating}
            className={`w-full ${
              isGenerating ? 'bg-amber-600 cursor-wait opacity-80' : 'bg-[#facc15] hover:bg-[#facc15]/90'
            } text-black font-extrabold py-3 sm:py-3.5 px-4 rounded-xl shadow-lg transition flex items-center justify-center gap-2 uppercase tracking-wide text-xs font-mono cursor-pointer`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 text-black animate-spin" /> MENYUSUN DOKUMEN PDF...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 text-black" /> UNDUH SERTIFIKAT (PDF)
              </>
            )}
          </button>

          <button
            onClick={onRestart}
            className="w-full bg-[#86efac] hover:bg-[#86efac]/90 text-black font-extrabold py-3 sm:py-3.5 px-4 rounded-xl shadow-lg transition flex items-center justify-center gap-2 uppercase tracking-wide text-xs font-mono cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-black" /> MAIN LAGI (RESTART)
          </button>
        </div>
      </div>
    </div>
  );
};



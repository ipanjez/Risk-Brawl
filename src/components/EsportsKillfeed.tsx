import React from 'react';
import { KillfeedEntry } from '../types';
import { Flame, Zap, HelpCircle, Leaf, ShieldAlert } from 'lucide-react';

interface EsportsKillfeedProps {
  entries: KillfeedEntry[];
}

export const EsportsKillfeed: React.FC<EsportsKillfeedProps> = ({ entries }) => {
  return (
    <div className="absolute top-16 left-3 md:left-6 z-30 flex flex-col gap-1 w-52 sm:w-60 pointer-events-none font-sans">
      <div className="bg-black/30 backdrop-blur-sm border border-[#2d4d3e]/40 rounded-lg p-2 shadow-lg">
        <span className="text-[9px] font-bold uppercase text-red-400/90 tracking-widest block mb-1 font-mono">
          Esports Feed
        </span>
        <div className="space-y-0.5">
          {entries.length === 0 ? (
            <div className="text-[9px] text-gray-500 italic py-0.5">Arena ready...</div>
          ) : (
            entries.slice(-4).map((entry) => {
              let icon = <ShieldAlert className="w-2.5 h-2.5 text-gray-400" />;
              let textColor = 'text-gray-300';

              if (entry.type === 'ko') {
                icon = <Flame className="w-2.5 h-2.5 text-red-400 animate-pulse" />;
                textColor = 'text-red-400 font-bold';
              } else if (entry.type === 'weapon') {
                icon = <Zap className="w-2.5 h-2.5 text-[#facc15]" />;
                textColor = 'text-[#facc15] font-semibold';
              } else if (entry.type === 'quiz') {
                icon = <HelpCircle className="w-2.5 h-2.5 text-blue-400" />;
                textColor = 'text-blue-400';
              } else if (entry.type === 'esg') {
                icon = <Leaf className="w-2.5 h-2.5 text-[#86efac]" />;
                textColor = 'text-[#86efac]';
              }

              return (
                <div
                  key={entry.id}
                  className="text-[9px] flex items-center justify-between py-0.5 border-b border-white/5 font-mono animate-slide-in"
                >
                  <div className="flex items-center gap-1 truncate">
                    <span className="shrink-0">{icon}</span>
                    <span className={`truncate ${textColor}`}>{entry.text}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { QuizQuestion } from '../types';
import { Sparkles, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

interface QuizModalProps {
  quizData: {
    question: QuizQuestion;
    shuffledOptions: { optionText: string; originalKey: string }[];
    timeLeftSeconds: number;
    playerId: string;
  };
  onSubmitAnswer: (selectedOriginalKey: string) => void;
  onClose: () => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({ quizData, onSubmitAnswer, onClose }) => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [autoCloseCountdown, setAutoCloseCountdown] = useState<number>(4);

  const timerSeconds = Math.ceil(quizData.timeLeftSeconds);
  const correctKey = quizData.question.answer.trim().substring(0, 1).toUpperCase();

  const handleSelect = (key: string) => {
    if (selectedKey !== null) return;
    setSelectedKey(key);
    setIsAnswered(true);
    onSubmitAnswer(key);
  };

  // Keyboard navigation & stop propagation to prevent background movement
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.stopPropagation();
      const k = e.key.toUpperCase();
      if (!isAnswered) {
        if (['A', 'B', 'C', 'D'].includes(k)) {
          handleSelect(k);
        } else if (['1', '2', '3', '4'].includes(k)) {
          const keyMap: Record<string, string> = { '1': 'A', '2': 'B', '3': 'C', '4': 'D' };
          handleSelect(keyMap[k]);
        }
      } else {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [isAnswered, onClose]);

  // Auto close timer after answering so player can read explanation
  useEffect(() => {
    if (isAnswered) {
      const interval = setInterval(() => {
        setAutoCloseCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            onClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isAnswered, onClose]);

  const isCorrect = selectedKey === correctKey;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 md:p-4 animate-fade-in font-sans">
      <div className="w-full max-w-2xl max-h-[92vh] bg-[#1a2e24] border-2 border-[#86efac] rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.9)] text-white flex flex-col">
        {/* Top Banner */}
        <div className="shrink-0 bg-[#86efac] px-4 md:px-6 py-3 flex justify-between items-center">
          <span className="text-black font-black uppercase text-xs md:text-sm tracking-widest flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-black" />
            Knowledge Tower Challenge
          </span>
          {!isAnswered ? (
            <div className="bg-black text-[#86efac] px-3 py-1 rounded-full font-mono text-xs font-bold animate-pulse">
              ⏱️ {String(timerSeconds).padStart(2, '0')}s
            </div>
          ) : (
            <div className="bg-black text-[#facc15] px-3 py-1 rounded-full font-mono text-xs font-bold">
              Menutup dalam {autoCloseCountdown}s...
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-4 md:p-6 overflow-y-auto flex-1 custom-scrollbar">
          <div className="mb-5">
            <span className="text-[#86efac] text-xs font-bold uppercase tracking-wider block mb-1 font-mono">
              Kategori: {quizData.question.category}
            </span>
            <h2 className="text-sm md:text-base font-semibold leading-relaxed text-slate-100">
              {quizData.question.question}
            </h2>
          </div>

          {/* Result Feedback Banner if Answered */}
          {isAnswered && (
            <div
              className={`mb-4 p-3 rounded-xl border flex items-center gap-3 animate-fade-in ${
                isCorrect
                  ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200'
                  : 'bg-rose-950/80 border-rose-400 text-rose-200'
              }`}
            >
              {isCorrect ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
              )}
              <div className="text-xs md:text-sm">
                <div className="font-bold font-mono">
                  {isCorrect
                    ? '🎉 JAWABAN BENAR! (+50 Knowledge Score & Senjata Aktif)'
                    : `❌ JAWABAN KURANG TEPAT (-10 Poin). Jawaban Benar: Opsi ${correctKey}`}
                </div>
              </div>
            </div>
          )}

          {/* Grid Options */}
          <div className="grid grid-cols-1 gap-2.5 mb-5">
            {quizData.shuffledOptions.map((opt, idx) => {
              const isThisOptionSelected = selectedKey === opt.originalKey;
              const isThisCorrect = opt.originalKey === correctKey;

              let optionStyle = 'border-[#2d4d3e] bg-black/30 hover:bg-[#2d4d3e] hover:border-[#86efac]/60 cursor-pointer';

              if (isAnswered) {
                if (isThisCorrect) {
                  optionStyle = 'border-emerald-400 bg-emerald-950/70 text-emerald-100 shadow-[0_0_15px_rgba(52,211,153,0.3)] font-semibold';
                } else if (isThisOptionSelected && !isThisCorrect) {
                  optionStyle = 'border-rose-500 bg-rose-950/70 text-rose-200 opacity-90 line-through';
                } else {
                  optionStyle = 'border-[#2d4d3e]/50 bg-black/20 opacity-40';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => handleSelect(opt.originalKey)}
                  className={`p-3.5 rounded-xl text-left flex items-center transition-all border ${optionStyle}`}
                >
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs mr-3 shrink-0 font-mono transition-colors ${
                      isAnswered
                        ? isThisCorrect
                          ? 'bg-emerald-400 text-black'
                          : isThisOptionSelected
                          ? 'bg-rose-500 text-white'
                          : 'bg-[#2d4d3e] text-slate-400'
                        : isThisOptionSelected
                        ? 'bg-[#86efac] text-black'
                        : 'bg-[#2d4d3e] text-white'
                    }`}
                  >
                    {opt.originalKey}
                  </span>
                  <p className="text-xs md:text-sm flex-1 leading-relaxed">
                    {opt.optionText.replace(/^[A-D]\.\s*/, '')}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Explanation Box (Only Revealed After Answering!) */}
          {isAnswered && (
            <div className="p-4 border border-[#86efac]/40 rounded-xl bg-black/40 text-xs text-slate-200 leading-relaxed font-sans animate-fade-in shadow-inner">
              <span className="text-[#86efac] font-bold block mb-1 font-mono uppercase tracking-wider">
                📖 Penjelasan & Pembahasan:
              </span>
              <p className="text-slate-300">{quizData.question.explanation}</p>
            </div>
          )}
        </div>

        {/* Footer with Continue Button when Answered */}
        {isAnswered && (
          <div className="shrink-0 p-3 bg-[#0f1d16] border-t border-[#2d4d3e] flex justify-end">
            <button
              onClick={onClose}
              className="bg-[#86efac] hover:bg-[#86efac]/90 text-black font-extrabold text-xs font-mono py-2 px-4 rounded-xl flex items-center gap-1.5 cursor-pointer shadow transition"
            >
              <span>Lanjutkan Bertanding</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

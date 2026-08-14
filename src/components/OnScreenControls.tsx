import React, { useRef, useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, Zap, HelpCircle, Volume2, VolumeX } from 'lucide-react';
import { WeaponType } from '../types';
import { WEAPON_CONFIGS } from '../game/Player2D';
import { soundEngine } from '../utils/audio';

const WEAPON_ICONS: Record<WeaponType, string> = {
  fists: '🥊',
  beam_rifle: '🔫',
  risk_hammer: '🔨',
  compliance_sword: '⚔️',
  esg_shield: '🛡️',
  decarb_blaster: '💥',
};

interface OnScreenControlsProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onJump: () => void;
  onAttack: () => void;
  onInteractNode: () => void;
  onSendEmote?: (text: string) => void;
  activeWeapon: WeaponType;
  ammo: number;
  hp: number;
  maxHp: number;
  playerName?: string;
  nodeProximity?: { isNearNode: boolean; isExhausted: boolean; nodeLabel?: string };
}

export const OnScreenControls: React.FC<OnScreenControlsProps> = ({
  onMoveLeft,
  onMoveRight,
  onJump,
  onAttack,
  onInteractNode,
  onSendEmote,
  activeWeapon,
  ammo,
  hp,
  maxHp,
  playerName,
  nodeProximity,
}) => {
  const wConfig = WEAPON_CONFIGS[activeWeapon];
  const weaponIcon = WEAPON_ICONS[activeWeapon] || '🥊';
  const hpPercent = Math.max(0, Math.min(100, (hp / maxHp) * 100));

  const [audioActive, setAudioActive] = useState<boolean>(soundEngine.isEnabled());

  const toggleSound = () => {
    const newState = soundEngine.toggleEnabled();
    setAudioActive(newState);
  };

  // Continuous Press Handlers for Touch / Mouse Hold
  const leftHoldTimer = useRef<any>(null);
  const rightHoldTimer = useRef<any>(null);

  const stopHoldLeft = () => {
    if (leftHoldTimer.current) {
      clearInterval(leftHoldTimer.current);
      leftHoldTimer.current = null;
    }
  };

  const stopHoldRight = () => {
    if (rightHoldTimer.current) {
      clearInterval(rightHoldTimer.current);
      rightHoldTimer.current = null;
    }
  };

  const stopAllHolds = () => {
    stopHoldLeft();
    stopHoldRight();
  };

  const startHoldLeft = (e: React.SyntheticEvent) => {
    e.preventDefault();
    stopHoldRight();
    stopHoldLeft();
    onMoveLeft();
    leftHoldTimer.current = setInterval(() => {
      onMoveLeft();
    }, 30);
  };

  const startHoldRight = (e: React.SyntheticEvent) => {
    e.preventDefault();
    stopHoldLeft();
    stopHoldRight();
    onMoveRight();
    rightHoldTimer.current = setInterval(() => {
      onMoveRight();
    }, 30);
  };

  useEffect(() => {
    window.addEventListener('pointerup', stopAllHolds);
    window.addEventListener('pointercancel', stopAllHolds);
    window.addEventListener('touchend', stopAllHolds);
    window.addEventListener('touchcancel', stopAllHolds);
    window.addEventListener('mouseup', stopAllHolds);
    window.addEventListener('blur', stopAllHolds);

    return () => {
      stopAllHolds();
      window.removeEventListener('pointerup', stopAllHolds);
      window.removeEventListener('pointercancel', stopAllHolds);
      window.removeEventListener('touchend', stopAllHolds);
      window.removeEventListener('touchcancel', stopAllHolds);
      window.removeEventListener('mouseup', stopAllHolds);
      window.removeEventListener('blur', stopAllHolds);
    };
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 font-sans select-none pb-safe pointer-events-none">
      <div className="p-2 md:p-4 flex flex-col md:flex-row items-center md:items-end justify-between drop-shadow-lg gap-2 md:gap-0">
        {/* Left Side: Movement D-Pad & Player Info */}
        <div className="flex items-center gap-2 md:gap-4 pointer-events-auto w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 bg-[#2d4d3e] rounded-full border-2 border-[#86efac] flex items-center justify-center shadow-md shrink-0">
              <span className="text-[9px] sm:text-[10px] md:text-xs font-black text-[#86efac] font-mono">YOU</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase text-[#86efac] tracking-wide truncate max-w-[70px] sm:max-w-[120px]">
                  {playerName || 'Auditor PKT'}
                </span>

                {/* Weapon Icon & Remaining Ammo Badge Next to HP / Player Name */}
                <div
                  className="flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10px] font-mono font-bold shadow-sm shrink-0 select-none"
                  style={{
                    backgroundColor: '#080d0a',
                    borderColor: wConfig?.color || '#86efac',
                    color: wConfig?.color || '#86efac',
                  }}
                  title={`${wConfig?.name} - Sisa Peluru: ${ammo === Infinity ? 'Tak Terbatas (∞)' : ammo}`}
                >
                  <span className="text-xs">{weaponIcon}</span>
                  <span className="text-[10px]">{ammo === Infinity ? '∞' : `${ammo}`}</span>
                </div>
              </div>

              <div className="w-24 sm:w-32 md:w-36 h-2 bg-black rounded-full overflow-hidden border border-[#2d4d3e] mt-0.5">
                <div
                  className="h-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] transition-all duration-200"
                  style={{ width: `${hpPercent}%` }}
                />
              </div>

              <div className="flex items-center gap-1.5 text-[9px] mt-0.5 text-slate-300 font-mono">
                <span>HP:{Math.max(0, Math.ceil(hp))}/{maxHp}</span>
                <span className="hidden xs:inline text-[#86efac] font-bold truncate max-w-[90px]">
                  {wConfig?.name}
                </span>
              </div>
            </div>
          </div>

          {/* D-Pad Buttons - Continuous Hold (< and >) */}
          <div className="flex items-center gap-1.5 md:gap-2">
            <button
              onPointerDown={startHoldLeft}
              onPointerUp={stopHoldLeft}
              onPointerCancel={stopHoldLeft}
              onPointerLeave={stopHoldLeft}
              className="w-11 h-11 md:w-13 md:h-13 bg-[#080d0a] hover:bg-[#2d4d3e] border border-[#2d4d3e] active:border-[#86efac] active:bg-[#2d4d3e] rounded-xl flex items-center justify-center text-[#86efac] shadow-lg cursor-pointer transition touch-none select-none"
              title="Jalan Kiri (Tekan Tahan)"
            >
              <ArrowLeft className="w-6 h-6 md:w-7 md:h-7" />
            </button>

            <button
              onPointerDown={startHoldRight}
              onPointerUp={stopHoldRight}
              onPointerCancel={stopHoldRight}
              onPointerLeave={stopHoldRight}
              className="w-11 h-11 md:w-13 md:h-13 bg-[#080d0a] hover:bg-[#2d4d3e] border border-[#2d4d3e] active:border-[#86efac] active:bg-[#2d4d3e] rounded-xl flex items-center justify-center text-[#86efac] shadow-lg cursor-pointer transition touch-none select-none"
              title="Jalan Kanan (Tekan Tahan)"
            >
              <ArrowRight className="w-6 h-6 md:w-7 md:h-7" />
            </button>
          </div>
        </div>

        {/* Center Weapon, Quiz & Emotes HUD */}
        <div className="flex items-center space-x-1.5 md:space-x-3 pointer-events-auto">
          <div className="hidden xs:flex flex-col items-center justify-center px-2 py-1 bg-black/70 border border-[#2d4d3e] rounded-lg shadow-inner">
            <span className="text-[7px] uppercase text-[#86efac] opacity-80 font-mono tracking-wider">SENJATA</span>
            <div className="flex items-center gap-1 font-mono font-bold text-[10px] md:text-xs text-amber-300">
              <span className="text-xs">{weaponIcon}</span>
              <span className="truncate max-w-[65px] md:max-w-[100px]">{wConfig?.name}</span>
              <span className="text-[#86efac] text-[10px]">({ammo === Infinity ? '∞' : ammo})</span>
            </div>
          </div>

          {/* Kuis Node Button */}
          {nodeProximity?.isNearNode && nodeProximity.isExhausted ? (
            <button
              disabled
              className="bg-slate-900 text-slate-500 border border-slate-700/80 font-bold px-2.5 py-1.5 md:px-3 md:py-2 rounded-lg text-xs flex items-center gap-1 opacity-50 cursor-not-allowed uppercase tracking-wider font-mono shrink-0 select-none"
              title={`Tower ${nodeProximity.nodeLabel || ''} telah selesai (redup). Pindah ke tower lain.`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Kuis Redup</span>
              <span className="sm:hidden">Redup</span>
            </button>
          ) : nodeProximity?.isNearNode && !nodeProximity.isExhausted ? (
            <button
              onClick={onInteractNode}
              className="bg-[#facc15] hover:bg-[#facc15]/90 text-black border-2 border-white font-extrabold px-3 py-1.5 md:px-3.5 md:py-2 rounded-lg text-xs flex items-center gap-1 shadow-[0_0_15px_rgba(250,204,21,0.6)] animate-pulse cursor-pointer transition uppercase tracking-wider font-mono shrink-0 select-none"
              title={`Dekat Tower ${nodeProximity.nodeLabel || ''}! Klik untuk Kuis`}
            >
              <HelpCircle className="w-4 h-4 fill-current text-black" />
              <span className="hidden sm:inline">Mulai Kuis [E]</span>
              <span className="sm:hidden">Kuis [E]</span>
            </button>
          ) : (
            <button
              onClick={onInteractNode}
              className="bg-[#2d4d3e] hover:bg-[#86efac] hover:text-black text-[#86efac] border border-[#86efac] font-bold px-2.5 py-1.5 md:px-3 md:py-2 rounded-lg text-xs flex items-center gap-1 shadow-md cursor-pointer transition uppercase tracking-wider font-mono shrink-0 select-none"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kuis Node</span>
              <span className="sm:hidden">Kuis</span>
            </button>
          )}

          {/* Sound Mute/Unmute Toggle Button */}
          <button
            onClick={toggleSound}
            className="bg-[#080d0a] hover:bg-[#2d4d3e] border border-[#2d4d3e] text-[#86efac] p-1.5 md:p-2 rounded-lg cursor-pointer transition flex items-center justify-center shrink-0"
            title={audioActive ? 'Matikan Suara SFX' : 'Aktifkan Suara SFX'}
          >
            {audioActive ? <Volume2 className="w-4 h-4 text-[#86efac]" /> : <VolumeX className="w-4 h-4 text-red-400" />}
          </button>

          {/* Quick Emote Reactions */}
          {onSendEmote && (
            <div className="hidden md:flex items-center gap-1 bg-black/40 border border-[#2d4d3e] rounded-lg p-1">
              <button
                onClick={() => onSendEmote('🛡️ Risk Based Thinking!')}
                className="px-1.5 py-1 bg-[#162a21] hover:bg-[#2d4d3e] text-xs rounded text-[#86efac] font-mono cursor-pointer transition"
                title="Emote 1: Risk Based Thinking"
              >
                🛡️
              </button>
              <button
                onClick={() => onSendEmote('⚡ Lead With Integrity!')}
                className="px-1.5 py-1 bg-[#162a21] hover:bg-[#2d4d3e] text-xs rounded text-[#facc15] font-mono cursor-pointer transition"
                title="Emote 2: Lead With Integrity"
              >
                ⚡
              </button>
              <button
                onClick={() => onSendEmote('🌿 Net-Zero ESG!')}
                className="px-1.5 py-1 bg-[#162a21] hover:bg-[#2d4d3e] text-xs rounded text-emerald-400 font-mono cursor-pointer transition"
                title="Emote 3: Net-Zero ESG"
              >
                🌿
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Action Buttons */}
        <div className="flex items-center gap-2 md:gap-4 pointer-events-auto">
          <button
            onTouchStart={(e) => {
              e.preventDefault();
              onJump();
            }}
            onClick={onJump}
            className="w-12 h-12 md:w-13 md:h-13 bg-[#080d0a] hover:bg-[#2d4d3e] border border-[#2d4d3e] active:border-blue-400 rounded-xl flex items-center justify-center text-blue-400 shadow-lg cursor-pointer transition touch-none"
            title="Lompat"
          >
            <ArrowUp className="w-7 h-7" />
          </button>

          <button
            onTouchStart={(e) => {
              e.preventDefault();
              onAttack();
            }}
            onClick={onAttack}
            className="w-12 h-12 md:w-14 md:h-14 bg-red-600 hover:bg-red-500 active:bg-red-700 border border-red-400 rounded-xl flex items-center justify-center text-white shadow-[0_0_15px_rgba(239,68,68,0.4)] cursor-pointer transition touch-none"
            title="Serang"
          >
            <Zap className="w-7 h-7 fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
};

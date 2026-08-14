import React, { useRef, useEffect, useState } from 'react';
import { LocalSessionManager } from '../game/LocalSessionManager';
import { IndustrialMap } from '../game/IndustrialMap';
import { Player2D, MAP_BOUNDS } from '../game/Player2D';
import { EcoTokenManager } from '../game/EcoToken';
import { Play, Clock, BookOpen, Crown, Users, ChevronUp, ChevronDown, Layers, Palette } from 'lucide-react';
import { MAP_LAYOUTS, MAP_THEMES, MapLayoutId, MapThemeId } from '../game/IndustrialMap';
import { LearningSlidesModal } from './LearningSlidesModal';

interface BrawlerCanvasProps {
  sessionManager: LocalSessionManager;
  onOpenLearningSlides?: () => void;
}

function drawTacticalRadar(
  ctx: CanvasRenderingContext2D,
  sessionManager: LocalSessionManager,
  cWidth: number,
  cHeight: number
) {
  const radarW = 130;
  const radarH = 72;
  const rx = 16;
  const ry = cHeight - radarH - 95;

  ctx.save();
  ctx.fillStyle = 'rgba(8, 13, 10, 0.65)';
  ctx.strokeStyle = '#2d4d3e';
  ctx.lineWidth = 1.5;
  ctx.fillRect(rx, ry, radarW, radarH);
  ctx.strokeRect(rx, ry, radarW, radarH);

  // Grid crosshair
  ctx.strokeStyle = 'rgba(45, 77, 62, 0.4)';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(rx + radarW / 2, ry);
  ctx.lineTo(rx + radarW / 2, ry + radarH);
  ctx.moveTo(rx, ry + radarH / 2);
  ctx.lineTo(rx + radarW, ry + radarH / 2);
  ctx.stroke();

  // Radar Title
  ctx.fillStyle = '#86efac';
  ctx.font = 'bold 8px monospace';
  ctx.fillText('RADAR ARENA', rx + 6, ry + 11);

  const mapW = MAP_BOUNDS.width;
  const mapH = MAP_BOUNDS.height;

  // Draw Players on Radar
  const players = sessionManager.getPlayerList();
  const localPlayer = sessionManager.getLocalPlayer();

  for (const p of players) {
    if (p.isKO) continue;
    const px = rx + (p.x / mapW) * radarW;
    const py = ry + (p.y / mapH) * radarH;
    const isLocal = localPlayer ? p.id === localPlayer.state.id : false;

    ctx.fillStyle = isLocal ? '#86efac' : '#ef4444';
    ctx.beginPath();
    ctx.arc(px, py, isLocal ? 3.5 : 2, 0, Math.PI * 2);
    ctx.fill();

    if (isLocal) {
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  ctx.restore();
}

export const BrawlerCanvas: React.FC<BrawlerCanvasProps> = ({ sessionManager, onOpenLearningSlides }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [, setTick] = useState(0);
  const [showSlidesLocal, setShowSlidesLocal] = useState<boolean>(false);
  const [isLobbyMinimized, setIsLobbyMinimized] = useState<boolean>(false);

  // Poll state changes every 200ms for lobby UI state updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const isGameStarted = sessionManager.isGameStarted;
  const countdownSeconds = sessionManager.countdownSeconds;
  const isHost = sessionManager.isHost;
  const playerList = sessionManager.getPlayerList();
  const durationOptions = [3, 5, 10, 15, 20];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let lastTime = performance.now();

    const renderLoop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Update Game physics & AI logic
      sessionManager.updateGameLoop(dt);

      // Clear Canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Industrial Map background, dynamic platforms & theme
      IndustrialMap.drawMap(
        ctx,
        canvas.width,
        canvas.height,
        now / 1000,
        sessionManager.currentPlatforms,
        sessionManager.currentKnowledgeNodes,
        sessionManager.currentThemeId,
        sessionManager.quizEngine.getExhaustedNodes((sessionManager as any).localPlayerId)
      );

      // Draw Eco Tokens
      for (const token of sessionManager.ecoTokenManager.tokens) {
        EcoTokenManager.drawToken(ctx, token, now / 1000);
      }

      // Draw Weapon PowerUp Pickups
      for (const wp of sessionManager.weaponPowerUps) {
        if (!wp.isCollected) {
          ctx.save();
          ctx.translate(wp.x, wp.y);
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(0, 0, 12, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 10px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('⚡', 0, 4);
          ctx.restore();
        }
      }

      // Draw Players
      const players = sessionManager.getPlayerList();
      const localPlayer = sessionManager.getLocalPlayer();

      for (const pState of players) {
        const isLocal = localPlayer ? pState.id === localPlayer.state.id : false;
        Player2D.drawPlayerSprite(ctx, pState, isLocal);
      }

      // Draw Floating Text & Speech Emote Bubbles
      for (const ft of sessionManager.floatingTexts) {
        ctx.save();
        const alpha = Math.max(0, Math.min(1, ft.life));
        ctx.globalAlpha = alpha;

        if (ft.text.startsWith('💬')) {
          // Beautiful speech bubble badge
          ctx.font = 'bold 12px monospace';
          const textMetrics = ctx.measureText(ft.text);
          const bubbleWidth = textMetrics.width + 18;
          const bubbleHeight = 24;
          const bubbleX = ft.x - bubbleWidth / 2;
          const bubbleY = ft.y - bubbleHeight / 2;

          // Bubble background & border
          ctx.fillStyle = 'rgba(8, 13, 10, 0.92)';
          ctx.strokeStyle = '#facc15';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.roundRect(bubbleX, bubbleY, bubbleWidth, bubbleHeight, 8);
          ctx.fill();
          ctx.stroke();

          // Bubble small tail pointing down to player
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.moveTo(ft.x - 4, bubbleY + bubbleHeight);
          ctx.lineTo(ft.x + 4, bubbleY + bubbleHeight);
          ctx.lineTo(ft.x, bubbleY + bubbleHeight + 4);
          ctx.closePath();
          ctx.fill();

          // Text inside bubble
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(ft.text, ft.x, ft.y);
        } else {
          // Standard damage / status text floating upward
          ctx.fillStyle = ft.color;
          ctx.font = 'bold 14px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'alphabetic';
          ctx.fillText(ft.text, ft.x, ft.y);
        }

        ctx.restore();
      }

      // Draw Tactical Mini Radar
      drawTacticalRadar(ctx, sessionManager, canvas.width, canvas.height);

      animFrameId = requestAnimationFrame(renderLoop);
    };

    animFrameId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [sessionManager]);

  // Keybindings listener
  useEffect(() => {
    const keysPressed: Record<string, boolean> = {};

    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed[e.key] = true;
      const localP = sessionManager.getLocalPlayer();
      if (!localP) return;

      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
        localP.jump();
      } else if (e.key === 'z' || e.key === 'Z' || e.key === 'j' || e.key === 'J' || e.key === 'Enter') {
        const attackData = localP.attack();
        if (attackData) {
          sessionManager.handlePlayerAttack(localP.state.id, attackData);
        }
      } else if (e.key === 'x' || e.key === 'X' || e.key === 'k' || e.key === 'K' || e.key === 'e' || e.key === 'E') {
        sessionManager.interactKnowledgeNode(localP.state.id);
      } else if (e.key === '1') {
        sessionManager.sendEmote(localP.state.id, '🛡️ Risk Based Thinking!');
      } else if (e.key === '2') {
        sessionManager.sendEmote(localP.state.id, '⚡ Lead With Integrity!');
      } else if (e.key === '3') {
        sessionManager.sendEmote(localP.state.id, '🌿 Net-Zero ESG!');
      } else if (e.key === '4') {
        sessionManager.sendEmote(localP.state.id, '💥 Risk Brawler!');
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed[e.key] = false;
    };

    // Continuous movement ticker with mutually exclusive left/right priority
    const movementInterval = setInterval(() => {
      const localP = sessionManager.getLocalPlayer();
      if (!localP) return;

      const wantsLeft = !!(keysPressed['ArrowLeft'] || keysPressed['a'] || keysPressed['A']);
      const wantsRight = !!(keysPressed['ArrowRight'] || keysPressed['d'] || keysPressed['D']);

      if (wantsLeft && !wantsRight) {
        localP.moveLeft();
      } else if (wantsRight && !wantsLeft) {
        localP.moveRight();
      }
    }, 1000 / 60);

    const handleBlur = () => {
      for (const k in keysPressed) {
        keysPressed[k] = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
      clearInterval(movementInterval);
    };
  }, [sessionManager]);

  const handleOpenSlides = () => {
    if (onOpenLearningSlides) {
      onOpenLearningSlides();
    } else {
      setShowSlidesLocal(true);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-950 p-2 pb-[90px] md:pb-2 overflow-hidden select-none relative">
      <canvas
        ref={canvasRef}
        width={MAP_BOUNDS.width}
        height={MAP_BOUNDS.height}
        className="w-full h-full max-w-[1280px] max-h-full object-contain rounded-2xl border-2 border-slate-800 shadow-2xl bg-slate-900"
      />

      {/* MINIMIZED LOBBY FLOATING BAR */}
      {!isGameStarted && isLobbyMinimized && (
        <div className="absolute top-4 sm:top-6 left-1/2 -translate-x-1/2 z-40 bg-[#080d0a]/92 backdrop-blur-md border-2 border-[#86efac] rounded-full px-3.5 py-1.5 shadow-[0_0_30px_rgba(134,239,172,0.3)] flex items-center gap-2.5 sm:gap-3 animate-fade-in font-sans pointer-events-auto">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#86efac]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#86efac] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#86efac]"></span>
            </span>
            <span className="hidden sm:inline">RUANG TUNGGU</span>
            <span className="text-[#facc15] font-mono">({playerList.length} Pemain)</span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono text-slate-300 bg-[#162a21] px-2.5 py-0.5 rounded-full border border-[#2d4d3e]">
            <span className="text-[#86efac]">{MAP_LAYOUTS[sessionManager.currentLayoutId]?.name}</span>
            <span className="text-slate-500">•</span>
            <span className="text-[#facc15]">{MAP_THEMES[sessionManager.currentThemeId]?.name}</span>
          </div>

          <button
            onClick={handleOpenSlides}
            className="bg-[#162a21] hover:bg-[#2d4d3e] text-[#86efac] border border-[#2d4d3e] text-xs font-mono font-bold px-2.5 py-1 rounded-full flex items-center gap-1 cursor-pointer transition shadow-sm"
            title="Pelajari Materi"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#86efac]" />
            <span className="hidden md:inline">Materi</span>
          </button>

          {countdownSeconds !== null ? (
            <div className="bg-[#facc15]/20 border border-[#facc15] text-[#facc15] font-black font-mono px-3 py-1 rounded-full text-xs animate-bounce">
              {Math.ceil(countdownSeconds)}...
            </div>
          ) : isHost ? (
            <button
              onClick={() => sessionManager.triggerStartMatch()}
              className="bg-[#facc15] hover:bg-[#facc15]/90 text-black text-xs font-extrabold font-mono px-3.5 py-1 rounded-full flex items-center gap-1 shadow-md cursor-pointer transition uppercase tracking-wide"
            >
              <Play className="w-3.5 h-3.5 fill-current text-black" />
              <span>Mulai</span>
            </button>
          ) : (
            <span className="text-[11px] font-mono text-slate-400">⏳ Menunggu Host</span>
          )}

          <button
            onClick={() => setIsLobbyMinimized(false)}
            className="bg-[#1a2e24] hover:bg-[#2d4d3e] text-[#86efac] border border-[#86efac]/40 text-xs font-mono font-bold px-2.5 py-1 rounded-full flex items-center gap-1 cursor-pointer transition shadow-sm"
            title="Buka Panel Ruang Tunggu Lengkap"
          >
            <span>Buka Panel</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* FULL LOBBY / WAITING ROOM OVERLAY */}
      {!isGameStarted && !isLobbyMinimized && (
        <div className="absolute top-4 sm:top-6 left-1/2 -translate-x-1/2 z-40 bg-[#080d0a]/92 backdrop-blur-md border-2 border-[#86efac] rounded-2xl p-4 sm:p-5 shadow-[0_0_40px_rgba(134,239,172,0.25)] flex flex-col items-center gap-2.5 sm:gap-3 text-center max-w-lg w-[92%] sm:w-[90%] max-h-[85vh] overflow-y-auto custom-scrollbar animate-fade-in font-sans pointer-events-auto">
          {/* Header bar with Sembunyikan Panel button */}
          <div className="w-full flex items-center justify-between border-b border-[#2d4d3e] pb-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#86efac]">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#86efac] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#86efac]"></span>
              </span>
              RUANG TUNGGU ARENA (LOBBY)
            </div>

            <button
              onClick={() => setIsLobbyMinimized(true)}
              className="px-2.5 py-1 bg-[#162a21] hover:bg-[#2d4d3e] text-[#86efac] hover:text-white border border-[#2d4d3e] rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition cursor-pointer shadow-sm"
              title="Sembunyikan Panel (Bebas Latihan Bergerak)"
            >
              <ChevronUp className="w-3.5 h-3.5 text-[#86efac]" />
              <span>Sembunyikan</span>
            </button>
          </div>

          <div className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-[#86efac]" />
            <span>Menunggu Pemain... (<span className="text-[#facc15] font-mono font-bold">{playerList.length}</span> Terhubung)</span>
          </div>

          <div className="text-xs text-slate-300 font-mono bg-[#162a21] px-3 py-1.5 rounded-lg border border-[#2d4d3e] w-full flex items-center justify-center gap-1.5">
            {isHost ? (
              <span className="text-[#facc15] font-bold flex items-center gap-1">
                <Crown className="w-3.5 h-3.5" /> Anda adalah HOST Sesi Ini
              </span>
            ) : (
              <span className="text-slate-300">
                👤 Anda bergabung sebagai Pemain (Host: <strong className="text-[#facc15]">{sessionManager.hostPlayerName || 'Host'}</strong>)
              </span>
            )}
          </div>

          {/* DURATION CONFIGURATION IN LOBBY */}
          <div className="w-full bg-[#0c1410] border border-[#2d4d3e] rounded-xl p-2.5 sm:p-3">
            <div className="flex items-center justify-between text-xs font-mono font-semibold text-[#86efac] mb-2">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#facc15]" /> Durasi Pertandingan
              </span>
              <span className="text-[#facc15] font-bold">
                {sessionManager.matchConfig.durationMinutes} Menit
              </span>
            </div>

            {isHost ? (
              <div className="grid grid-cols-5 gap-1.5">
                {durationOptions.map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => sessionManager.setMatchDuration(mins)}
                    className={`py-1.5 sm:py-2 px-1 rounded-lg border text-center font-bold text-xs transition font-mono cursor-pointer ${
                      sessionManager.matchConfig.durationMinutes === mins
                        ? 'bg-[#facc15] border-[#facc15] text-black shadow-md'
                        : 'bg-[#162a21] border-[#2d4d3e] text-slate-300 hover:border-[#86efac]'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-[11px] text-slate-400 font-mono text-center">
                Waktu diset oleh Host {sessionManager.hostPlayerName ? `(${sessionManager.hostPlayerName})` : ''} ({sessionManager.matchConfig.durationMinutes} menit)
              </div>
            )}
          </div>

          {/* MAP LAYOUT SELECTOR IN LOBBY */}
          <div className="w-full bg-[#0c1410] border border-[#2d4d3e] rounded-xl p-2.5 sm:p-3">
            <div className="flex items-center justify-between text-xs font-mono font-semibold text-[#86efac] mb-1.5">
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-[#facc15]" /> Layout Platform Arena
              </span>
              <span className="text-[#facc15] font-bold text-[11px]">
                {MAP_LAYOUTS[sessionManager.currentLayoutId]?.name}
              </span>
            </div>

            {isHost ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {(['standard', 'pyramid', 'twin_towers', 'islands'] as MapLayoutId[]).map((layoutKey) => (
                  <button
                    key={layoutKey}
                    type="button"
                    onClick={() => sessionManager.setMapLayout(layoutKey)}
                    className={`py-2 px-1.5 rounded-lg border text-center font-bold text-[11px] transition font-mono cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                      sessionManager.currentLayoutId === layoutKey
                        ? 'bg-[#facc15] border-[#facc15] text-black shadow-md'
                        : 'bg-[#162a21] border-[#2d4d3e] text-slate-300 hover:border-[#86efac]'
                    }`}
                    title={MAP_LAYOUTS[layoutKey].description}
                  >
                    <span className="leading-tight">{MAP_LAYOUTS[layoutKey].name}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-[11px] text-slate-400 font-mono text-center">
                Layout platform diset oleh Host {sessionManager.hostPlayerName ? `(${sessionManager.hostPlayerName})` : ''} ({MAP_LAYOUTS[sessionManager.currentLayoutId]?.name})
              </div>
            )}
          </div>

          {/* MAP THEME SELECTOR IN LOBBY */}
          <div className="w-full bg-[#0c1410] border border-[#2d4d3e] rounded-xl p-2.5 sm:p-3">
            <div className="flex items-center justify-between text-xs font-mono font-semibold text-[#86efac] mb-1.5">
              <span className="flex items-center gap-1">
                <Palette className="w-3.5 h-3.5 text-[#facc15]" /> Tema Visual Arena
              </span>
              <span className="text-[#facc15] font-bold text-[11px]">
                {MAP_THEMES[sessionManager.currentThemeId]?.name}
              </span>
            </div>

            {isHost ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {(['industrial_green', 'cyberpunk_2060', 'eco_marine', 'sunset_solaris'] as MapThemeId[]).map((themeKey) => (
                  <button
                    key={themeKey}
                    type="button"
                    onClick={() => sessionManager.setMapTheme(themeKey)}
                    className={`py-2 px-1.5 rounded-lg border text-center font-bold text-[11px] transition font-mono cursor-pointer flex items-center justify-center gap-1 ${
                      sessionManager.currentThemeId === themeKey
                        ? 'bg-[#facc15] border-[#facc15] text-black shadow-md'
                        : 'bg-[#162a21] border-[#2d4d3e] text-slate-300 hover:border-[#86efac]'
                    }`}
                    title={MAP_THEMES[themeKey].subtitle}
                  >
                    <span>
                      {themeKey === 'industrial_green' && '🟢 Petrokimia'}
                      {themeKey === 'cyberpunk_2060' && '🟣 Cyber 2060'}
                      {themeKey === 'eco_marine' && '🔵 Eco-Marine'}
                      {themeKey === 'sunset_solaris' && '🟠 Solaris'}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-[11px] text-slate-400 font-mono text-center">
                Tema visual diset oleh Host {sessionManager.hostPlayerName ? `(${sessionManager.hostPlayerName})` : ''} ({MAP_THEMES[sessionManager.currentThemeId]?.name})
              </div>
            )}
          </div>

          {/* ACTION BUTTONS: Belajar & Mulai */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
            <button
              onClick={handleOpenSlides}
              className="w-full bg-[#162a21] hover:bg-[#2d4d3e] text-[#86efac] border border-[#86efac]/50 font-bold py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 text-xs font-mono cursor-pointer shadow"
            >
              <BookOpen className="w-4 h-4 text-[#86efac]" /> PELAJARI MATERI
            </button>

            {countdownSeconds !== null ? (
              <div className="w-full bg-[#facc15]/20 border border-[#facc15] text-[#facc15] font-black font-mono py-2.5 px-3 rounded-xl flex items-center justify-center text-xs animate-bounce">
                DIMULAI: {Math.ceil(countdownSeconds)}...
              </div>
            ) : isHost ? (
              <button
                onClick={() => sessionManager.triggerStartMatch()}
                className="w-full bg-[#facc15] hover:bg-[#facc15]/90 text-black font-extrabold py-2.5 px-3 rounded-xl shadow-lg transition flex items-center justify-center gap-1.5 uppercase tracking-wide text-xs font-mono cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current text-black" /> MULAI GAME
              </button>
            ) : (
              <div className="text-xs font-mono text-slate-400 bg-white/5 py-2.5 px-3 rounded-xl w-full border border-white/10 flex items-center justify-center">
                ⏳ Menunggu Host {sessionManager.hostPlayerName ? `(${sessionManager.hostPlayerName})` : ''} Memulai Game...
              </div>
            )}
          </div>

          <div className="text-[10px] sm:text-[11px] text-slate-400 italic">
            *Di ruang tunggu, Anda bebas berlari & melompat untuk pemanasan. Klik <strong>"Sembunyikan"</strong> di atas jika ingin leluasa menjelajah arena.
          </div>
        </div>
      )}

      {/* BIG COUNTDOWN OVERLAY */}
      {countdownSeconds !== null && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs pointer-events-none">
          <div className="text-2xl sm:text-3xl font-black font-mono text-[#86efac] mb-2 uppercase tracking-widest drop-shadow-md">
            SIAP-SIAP!
          </div>
          <div className="text-8xl sm:text-9xl font-black font-mono text-[#facc15] drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)] animate-pulse">
            {Math.ceil(countdownSeconds)}
          </div>
        </div>
      )}

      {/* Embedded Learning Slides Modal if triggered locally */}
      {showSlidesLocal && (
        <LearningSlidesModal onClose={() => setShowSlidesLocal(false)} />
      )}
    </div>
  );
};

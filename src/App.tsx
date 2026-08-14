import React, { useState, useEffect, useMemo } from 'react';
import { CharacterCreator } from './components/CharacterCreator';
import { MatchSetup } from './components/MatchSetup';
import { BrawlerCanvas } from './components/BrawlerCanvas';
import { EsportsKillfeed } from './components/EsportsKillfeed';
import { DynamicLeaderboard } from './components/DynamicLeaderboard';
import { QuizModal } from './components/QuizModal';
import { GameOverModal } from './components/GameOverModal';
import { OnScreenControls } from './components/OnScreenControls';
import { TutorialModal } from './components/TutorialModal';
import { LearningSlidesModal } from './components/LearningSlidesModal';
import { OrientationOverlay } from './components/OrientationOverlay';
import { LocalSessionManager } from './game/LocalSessionManager';
import { createDefaultAvatar } from './game/Player2D';
import { AvatarCustomization, MatchConfig, KillfeedEntry } from './types';
import { soundEngine } from './utils/audio';
import { Clock, Volume2, VolumeX, Maximize2, BookOpen, GraduationCap } from 'lucide-react';
import logoTkmr from './assets/logoAsset';

export default function App() {
  const [screen, setScreen] = useState<'character' | 'game' | 'over'>('character');
  
  // Load saved player name and avatar from localStorage
  const [playerName, setPlayerName] = useState<string>(() => {
    try {
      return localStorage.getItem('pkt_player_name') || '';
    } catch (e) {
      return '';
    }
  });

  const [avatar, setAvatar] = useState<AvatarCustomization>(() => {
    try {
      const saved = localStorage.getItem('pkt_player_avatar');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return createDefaultAvatar(0, 'Player');
  });

  // Auto-save to localStorage
  useEffect(() => {
    if (playerName && playerName.trim()) {
      try {
        localStorage.setItem('pkt_player_name', playerName.trim());
      } catch (e) {}
    }
  }, [playerName]);

  useEffect(() => {
    try {
      localStorage.setItem('pkt_player_avatar', JSON.stringify(avatar));
    } catch (e) {}
  }, [avatar]);

  const [matchConfig] = useState<MatchConfig>({
    durationMinutes: 15,
    maxPlayers: 20,
    botCount: 19,
    roomCode: 'PKT-ESG-2026',
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showTutorial, setShowTutorial] = useState<boolean>(false);
  const [showLearningSlides, setShowLearningSlides] = useState<boolean>(false);
  const [showConfirmEnd, setShowConfirmEnd] = useState<boolean>(false);

  // Sync soundEngine state
  useEffect(() => {
    soundEngine.setEnabled(soundEnabled);
  }, [soundEnabled]);

  // Initialize Local Session Manager
  const sessionManager = useMemo(() => new LocalSessionManager(matchConfig), [matchConfig]);

  const [killfeedEntries, setKillfeedEntries] = useState<KillfeedEntry[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<any>(null);
  const [matchTimerSeconds, setMatchTimerSeconds] = useState<number>(15 * 60);
  const [roomState, setRoomState] = useState<{ isGameStarted: boolean, startTime: number | null, durationMinutes?: number, players: {name: string, isActive: boolean}[] } | null>(null);

  useEffect(() => {
    if (screen === 'character') {
      const fetchRoom = async () => {
        try {
          const res = await fetch('/api/room/PKT-ESG-2026');
          const data = await res.json();
          setRoomState(data);
        } catch (e) {}
      };
      fetchRoom();
      const interval = setInterval(fetchRoom, 2000);
      return () => clearInterval(interval);
    }
  }, [screen]);

  const handleStartGame = () => {
    sessionManager.initializeSession(playerName, avatar);
    setScreen('game');
  };

  // Connect immediate onMatchEnded callback
  useEffect(() => {
    sessionManager.onMatchEnded = () => {
      setScreen('over');
    };
  }, [sessionManager]);

  // Sync game loop state to React UI elements every 150ms
  useEffect(() => {
    if (screen !== 'game') return;

    const interval = setInterval(() => {
      setMatchTimerSeconds(sessionManager.matchTimerSeconds);
      setKillfeedEntries([...sessionManager.uiManager.updateKillfeedQueue()]);
      setActiveQuiz(sessionManager.quizEngine.getCurrentQuiz());

      if (sessionManager.isMatchEnded) {
        setScreen('over');
      }
    }, 150);

    return () => clearInterval(interval);
  }, [screen, sessionManager]);

  const localPlayer = sessionManager.getLocalPlayer();
  const playerList = sessionManager.getPlayerList();

  const isLiveMatch =
    screen === 'game'
      ? sessionManager.isGameStarted
      : !!(
          roomState?.isGameStarted &&
          roomState?.startTime &&
          Date.now() - roomState.startTime < (roomState.durationMinutes || 15) * 60 * 1000
        );

  return (
    <div className="h-[100dvh] w-screen overflow-hidden bg-[#0c1410] text-white font-sans select-none selection:bg-[#86efac] selection:text-black relative">
      {/* Mobile Landscape Orientation Helper */}
      <OrientationOverlay />

      {/* Top Header Bar (Transparent Overlay) */}
      <header className="absolute top-0 left-0 right-0 px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex items-start md:items-center justify-between z-40 pointer-events-none drop-shadow-lg">
        <div className="flex items-center space-x-3 md:space-x-6 pointer-events-auto">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <img
              src={logoTkmr}
              alt="Logo TKMR PKT"
              className="w-8 h-8 sm:w-9 sm:h-9 object-contain rounded-lg shadow-md shrink-0 bg-black/40 p-0.5 border border-[#2d4d3e]"
            />
            <div className="flex flex-col">
              <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[#86efac] font-mono leading-tight">
                Education Session
              </span>
              <h1 className="font-extrabold text-xs sm:text-sm md:text-base tracking-wide text-white flex items-center gap-2">
                <span>Risk Brawler</span>
                {/* Penanda Status Game Berjalan di Samping Kanan Risk Brawler */}
                {isLiveMatch ? (
                  <span className="text-[8px] sm:text-[9px] md:text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/60 text-red-300 font-mono font-bold flex items-center gap-1 shrink-0 animate-pulse shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    <span>LIVE BERJALAN</span>
                  </span>
                ) : (
                  <span className="text-[8px] sm:text-[9px] md:text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/20 border border-yellow-500/60 text-yellow-300 font-mono font-bold flex items-center gap-1 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                    <span>RUANG TUNGGU</span>
                  </span>
                )}
              </h1>
            </div>
          </div>
        </div>

        {screen === 'game' && (
          <div className="flex items-center gap-2 sm:gap-3 bg-black/75 backdrop-blur-md rounded-full px-3 sm:px-4 py-1.5 border border-[#2d4d3e] pointer-events-auto shadow-md">
            <div className="flex items-center gap-1.5 font-mono font-bold text-[#facc15] text-xs sm:text-sm">
              <Clock className="w-3.5 h-3.5" />
              <span>{sessionManager.uiManager.formatTimer(matchTimerSeconds)}</span>
            </div>
            <div className="h-3.5 w-px bg-[#2d4d3e]" />
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <div className={`w-2 h-2 rounded-full ${sessionManager.isGameStarted ? 'bg-red-500 animate-pulse' : 'bg-yellow-400 animate-ping'}`}></div>
              <span className="text-[9px] sm:text-[10px] md:text-xs font-mono uppercase tracking-tighter text-slate-200">
                {sessionManager.isGameStarted ? 'Live' : 'Lobby'}
              </span>
            </div>
            
            {/* Host Controls */}
            {sessionManager.isHost && (
              <>
                <div className="h-3.5 w-px bg-[#2d4d3e]" />
                <button
                  onClick={() => setShowConfirmEnd(true)}
                  className="bg-red-600 hover:bg-red-500 text-white font-bold px-2 py-0.5 text-[9px] sm:text-[10px] md:text-xs rounded border border-red-400 flex items-center gap-1 transition shadow cursor-pointer"
                  title="Hentikan Pertandingan Secara Paksa (HOST)"
                >
                  <span className="hidden sm:inline">Hentikan Sesi</span>
                  <span className="sm:hidden">Stop</span>
                </button>
              </>
            )}
          </div>
        )}

        <div className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-3 pointer-events-auto">
          <button
            onClick={() => setShowLearningSlides(true)}
            className="px-2 sm:px-2.5 py-1 bg-[#162a21] hover:bg-[#2d4d3e] text-[#86efac] font-extrabold rounded-lg border border-[#86efac]/60 text-[11px] sm:text-xs flex items-center gap-1.5 font-mono cursor-pointer transition shadow"
            title="Pelajari Materi Tata Kelola & Risiko PKT"
          >
            <GraduationCap className="w-3.5 h-3.5 text-[#86efac]" />
            <span className="hidden sm:inline uppercase">Materi</span>
          </button>

          <button
            onClick={() => setShowTutorial(true)}
            className="px-2 sm:px-2.5 py-1 bg-[#86efac] hover:bg-[#86efac]/90 text-black font-extrabold rounded-lg border border-[#86efac] text-[11px] sm:text-xs flex items-center gap-1.5 font-mono cursor-pointer transition shadow"
            title="Panduan Kontrol & Game"
          >
            <BookOpen className="w-3.5 h-3.5 text-black" />
            <span className="hidden sm:inline uppercase">Panduan</span>
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 bg-[#2d4d3e]/40 hover:bg-[#2d4d3e] rounded-lg border border-[#2d4d3e] text-[#86efac] cursor-pointer transition"
            title="Suara SFX"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => {
              const docEl = document.documentElement as any;
              const hasFullscreenAPI = !!(docEl.requestFullscreen || docEl.webkitRequestFullscreen);
              
              if (!hasFullscreenAPI) {
                alert("Browser iPhone (iOS) tidak mendukung fitur Fullscreen otomatis untuk game web.\n\nTIPS: Buka menu browser Anda lalu pilih 'Add to Home Screen' (Tambahkan ke Layar Utama) untuk bermain layar penuh tanpa gangguan!");
                return;
              }

              if (!document.fullscreenElement && !docEl.webkitFullscreenElement) {
                if (docEl.requestFullscreen) docEl.requestFullscreen();
                else if (docEl.webkitRequestFullscreen) docEl.webkitRequestFullscreen();
              } else {
                if (document.exitFullscreen) document.exitFullscreen();
                else if ((document as any).webkitExitFullscreen) (document as any).webkitExitFullscreen();
              }
            }}
            className="p-1.5 bg-[#2d4d3e]/40 hover:bg-[#2d4d3e] rounded-lg border border-[#2d4d3e] text-[#86efac] cursor-pointer transition"
            title="Layar Penuh"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Screen locked viewport area */}
      <main className="absolute inset-0 overflow-hidden flex flex-col justify-center items-center">
        {screen === 'character' && (
          <div className="p-2 md:p-4 w-full h-full overflow-y-auto">
            <div className="min-h-full flex flex-col justify-center py-4">
              <CharacterCreator
                name={playerName}
                setName={setPlayerName}
                avatar={avatar}
                setAvatar={setAvatar}
                onStartGame={handleStartGame}
                roomState={roomState}
              />
            </div>
          </div>
        )}

        {screen === 'game' && (
          <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
            {/* Full-bleed Brawler Canvas Arena */}
            <BrawlerCanvas 
              sessionManager={sessionManager} 
              onOpenLearningSlides={() => setShowLearningSlides(true)} 
            />

            {/* Overlay: Esports Killfeed */}
            <EsportsKillfeed entries={killfeedEntries} />

            {/* Overlay: Top-Right Floating Live Statistics / Leaderboard */}
            <div className="absolute top-16 right-3 md:right-6 z-30 pointer-events-auto">
              <DynamicLeaderboard
                players={playerList}
                localPlayerId={localPlayer?.state.id || ''}
                isGameStarted={sessionManager?.isGameStarted}
              />
            </div>

            {/* Overlay: On-Screen Touch / Keyboard Controls */}
            {localPlayer && (
              <OnScreenControls
                onMoveLeft={() => localPlayer.moveLeft()}
                onMoveRight={() => localPlayer.moveRight()}
                onJump={() => localPlayer.jump()}
                onAttack={() => {
                  const atkData = localPlayer.attack();
                  if (atkData) sessionManager.handlePlayerAttack(localPlayer.state.id, atkData);
                }}
                onInteractNode={() => sessionManager.interactKnowledgeNode(localPlayer.state.id)}
                onSendEmote={(text) => sessionManager.sendEmote(localPlayer.state.id, text)}
                activeWeapon={localPlayer.state.activeWeapon}
                ammo={localPlayer.state.activeWeaponAmmo}
                hp={localPlayer.state.hp}
                maxHp={localPlayer.state.maxHp}
                playerName={localPlayer.state.name}
                nodeProximity={sessionManager.getPlayerNodeProximity(localPlayer.state.id)}
              />
            )}

            {/* Overlay: Synchronized Quiz Modal */}
            {activeQuiz && (
              <QuizModal
                quizData={activeQuiz}
                onSubmitAnswer={(key) => {
                  if (localPlayer) {
                    sessionManager.submitQuizAnswer(localPlayer.state.id, key);
                  }
                }}
                onClose={() => sessionManager.quizEngine.cancelCurrentQuiz()}
              />
            )}
          </div>
        )}

        {screen === 'over' && (
          <GameOverModal
            players={playerList}
            localPlayerId={localPlayer?.state.id}
            onRestart={() => {
              sessionManager.resetMatchForNewGame();
              setRoomState((prev) => (prev ? { ...prev, isGameStarted: false, startTime: null } : null));
              setScreen('character');
            }}
          />
        )}

        {/* Complete Tutorial Modal */}
        {showTutorial && <TutorialModal onClose={() => setShowTutorial(false)} playerName={playerName} />}

        {/* Learning Materials Slides Modal */}
        {showLearningSlides && <LearningSlidesModal onClose={() => setShowLearningSlides(false)} playerName={playerName} />}

        {/* Confirmation Modal to Force Stop Session (Host) */}
        {showConfirmEnd && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in font-sans">
            <div className="bg-[#1a2e24] border-2 border-red-500 rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl text-center text-white">
              <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500 text-red-400 flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Hentikan Sesi Pertandingan?</h3>
              <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                Sebagai <b>Host</b>, menghentikan sesi ini akan secara otomatis <b>menyelesaikan pertandingan untuk semua pemain</b> yang terhubung dan langsung menampilkan hasil skor akhir.
              </p>
              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <button
                  onClick={() => setShowConfirmEnd(false)}
                  className="py-2.5 px-4 bg-[#162a21] hover:bg-[#2d4d3e] text-slate-300 font-bold rounded-xl border border-[#2d4d3e] transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    setShowConfirmEnd(false);
                    sessionManager.forceEndMatch();
                    setScreen('over');
                  }}
                  className="py-2.5 px-4 bg-red-600 hover:bg-red-500 text-white font-extrabold rounded-xl border border-red-400 shadow-lg transition cursor-pointer"
                >
                  Ya, Hentikan
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer info */}
      {screen !== 'game' && (
        <footer className="absolute bottom-0 left-0 right-0 bg-[#162a21]/90 backdrop-blur-md border-t border-[#2d4d3e] px-4 md:px-6 py-2 text-center text-[10px] md:text-[11px] text-[#86efac]/80 flex items-center justify-between font-mono z-40">
          <div>PT Pupuk Kalimantan Timur — Compartment Governance & Risk Management</div>
          <div className="flex items-center gap-3">
            <span className="hidden md:inline">HTML5 Canvas Arena + Real-Time Network Engine</span>
            <span className="text-[#facc15] font-bold">Net Zero ESG 2030</span>
          </div>
        </footer>
      )}
    </div>
  );
}

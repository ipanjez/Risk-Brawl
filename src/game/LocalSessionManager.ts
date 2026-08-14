import { Player2D, WEAPON_CONFIGS } from './Player2D';
import { QuizEngine } from './QuizEngine';
import { EcoTokenManager } from './EcoToken';
import { UIManager } from './UIManager';
import { MatchConfig, PlayerState, WeaponType, FloatingText } from '../types';
import { MAP_LAYOUTS, MAP_THEMES, MapLayoutId, MapThemeId, MapPlatform, KnowledgeNodeMap } from './IndustrialMap';
import { soundEngine } from '../utils/audio';

export interface NetworkPlayerPayload {
  id: string;
  name: string;
  x: number;
  y: number;
  hp: number;
  facing: 'left' | 'right';
  knowledgeScore: number;
  esgScore: number;
  koCount: number;
  activeWeapon: WeaponType;
}

export class LocalSessionManager {
  public players: Map<string, Player2D> = new Map();
  public quizEngine: QuizEngine;
  public ecoTokenManager: EcoTokenManager;
  public uiManager: UIManager;
  public floatingTexts: FloatingText[] = [];
  public weaponPowerUps: { id: string; type: WeaponType; x: number; y: number; ammo: number; isCollected: boolean }[] = [];

  public currentLayoutId: MapLayoutId = 'standard';
  public currentThemeId: MapThemeId = 'industrial_green';
  public currentPlatforms: MapPlatform[] = JSON.parse(JSON.stringify(MAP_LAYOUTS.standard.platforms));
  public currentKnowledgeNodes: KnowledgeNodeMap[] = JSON.parse(JSON.stringify(MAP_LAYOUTS.standard.nodes));

  public isGameStarted: boolean = false;
  public countdownSeconds: number | null = null;
  public isHost: boolean = false;
  public hostPlayerName: string | null = null;
  public isMatchActive: boolean = false;
  public isMatchEnded: boolean = false;
  public matchTimerSeconds: number = 15 * 60;
  public matchConfig: MatchConfig;

  private localPlayerId: string = 'p_local_1';
  private broadcastChannel: BroadcastChannel | null = null;
  private socket: WebSocket | null = null;
  private lastBroadcastTime: number = 0;
  private broadcastIntervalMs: number = 40; // 25 Hz throttled network broadcast

  constructor(config: MatchConfig) {
    this.matchConfig = config;
    this.quizEngine = new QuizEngine();
    this.ecoTokenManager = new EcoTokenManager();
    this.uiManager = new UIManager();
    this.matchTimerSeconds = config.durationMinutes * 60;
  }

  public initializeSession(localPlayerName: string, localAvatarCustomization?: any) {
    this.players.clear();
    this.floatingTexts = [];
    this.weaponPowerUps = [];
    this.ecoTokenManager.resetTokens();
    this.quizEngine.resetAll();
    this.isGameStarted = false;
    this.countdownSeconds = null;
    this.isHost = false; // Assigned dynamically by server based on first joiner

    // Assign unique local player ID for this browser tab
    this.localPlayerId = `p_user_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // Create Local Player
    const localPlayer = new Player2D(this.localPlayerId, localPlayerName, false, false, 0);
    
    // Load from Local Storage if returning
    try {
      const saved = localStorage.getItem(`pkt_player_${localPlayerName}`);
      if (saved) {
        const savedState = JSON.parse(saved);
        localPlayer.state = {
          ...localPlayer.state,
          ...savedState,
          id: this.localPlayerId, // always use new socket/local id
          name: localPlayerName,
        };
        localPlayer.targetX = localPlayer.state.x;
        localPlayer.targetY = localPlayer.state.y;
      }
    } catch(e) {}
    
    if (localAvatarCustomization && !localStorage.getItem(`pkt_player_${localPlayerName}`)) {
      localPlayer.state.avatar = localAvatarCustomization;
    }

    // In lobby / before match starts, match score MUST always start at 0
    localPlayer.state.knowledgeScore = 0;
    localPlayer.state.esgScore = 0;
    localPlayer.state.koCount = 0;
    localPlayer.state.score = 0;
    localPlayer.state.hp = 100;
    localPlayer.state.isKO = false;

    this.players.set(this.localPlayerId, localPlayer);

    // Setup BroadcastChannel for local cross-tab sync
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        if (this.broadcastChannel) this.broadcastChannel.close();
        this.broadcastChannel = new BroadcastChannel(`pkt_room_${this.matchConfig.roomCode}`);
        this.broadcastChannel.onmessage = (event) => {
          this.handleNetworkMessage(event.data);
        };
      }
    } catch (e) {
      console.warn('BroadcastChannel error:', e);
    }

    // Setup WebSocket for online server sync
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws/brawler`;
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
          this.socket.send(
            JSON.stringify({
              type: 'join_room',
              name: localPlayerName,
              roomCode: this.matchConfig.roomCode,
            })
          );
          
          this.socket.send(
            JSON.stringify({
              type: 'request_room_info',
              senderId: this.localPlayerId,
            })
          );
        }
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleNetworkMessage(data);
        } catch (err) {
          console.error('WS client message parse error:', err);
        }
      };
    } catch (e) {
      console.warn('WebSocket connection warning:', e);
    }

    // NO BOTS POPULATED. Strictly human real players in the arena.

    this.uiManager.addKillfeed(`Masuk ke Ruang Tunggu Arena! Room: ${this.matchConfig.roomCode}`, 'system');
    this.uiManager.addKillfeed(`Menunggu pemain lain & Host memulai permainan...`, 'system');

    this.isMatchActive = true;
    this.isMatchEnded = false;

    // Request host info from existing tabs/sockets
    this.broadcastNetworkMessage({
      type: 'request_room_info',
      senderId: this.localPlayerId,
    });
  }

  public setMatchDuration(minutes: number) {
    if (!this.isHost) return;
    this.matchConfig.durationMinutes = minutes;
    this.matchTimerSeconds = minutes * 60;
    this.broadcastNetworkMessage({
      type: 'update_match_duration',
      roomCode: this.matchConfig.roomCode,
      durationMinutes: minutes,
    });
    this.uiManager.addKillfeed(`Durasi pertandingan diubah menjadi ${minutes} menit.`, 'system');
  }

  public triggerStartMatch() {
    if (!this.isHost) return;
    this.countdownSeconds = 3;
    soundEngine.playTokenCollect();
    this.broadcastNetworkMessage({
      type: 'start_countdown',
    });
  }

  public broadcastNetworkMessage(payload: any) {
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage(payload);
    }
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(payload));
    }
  }

  private handleNetworkMessage(data: any) {
    if (!data) return;

    if (data.type === 'room_joined') {
      if (data.roomState) {
        if (data.roomState.durationMinutes) {
          this.matchConfig.durationMinutes = data.roomState.durationMinutes;
          this.matchTimerSeconds = data.roomState.durationMinutes * 60;
        }
        if (data.roomState.mapLayout && MAP_LAYOUTS[data.roomState.mapLayout as MapLayoutId]) {
          this.currentLayoutId = data.roomState.mapLayout as MapLayoutId;
          this.currentPlatforms = JSON.parse(JSON.stringify(MAP_LAYOUTS[this.currentLayoutId].platforms));
          this.currentKnowledgeNodes = JSON.parse(JSON.stringify(MAP_LAYOUTS[this.currentLayoutId].nodes));
        }
        if (data.roomState.mapTheme && MAP_THEMES[data.roomState.mapTheme as MapThemeId]) {
          this.currentThemeId = data.roomState.mapTheme as MapThemeId;
        }

        if (data.roomState.isGameStarted && data.roomState.startTime) {
          const elapsedSec = (Date.now() - data.roomState.startTime) / 1000;
          const matchDurationSec = (data.roomState.durationMinutes || 15) * 60;
          const remainingSec = Math.max(0, matchDurationSec - elapsedSec);

          if (remainingSec <= 0) {
            // Match has ended on time; start fresh in lobby
            this.isGameStarted = false;
            this.isMatchEnded = false;
            this.matchTimerSeconds = (data.roomState.durationMinutes || 15) * 60;
          } else {
            this.isGameStarted = true;
            this.isHost = false;
            const localP = this.getLocalPlayer();
            if (localP) localP.state.isHost = false;
            this.matchTimerSeconds = remainingSec;
            this.uiManager.addKillfeed('Bergabung ke pertandingan yang sedang berlangsung!', 'system');
          }
        } else {
          this.isGameStarted = false;
          this.isMatchEnded = false;
          this.matchTimerSeconds = (data.roomState.durationMinutes || 15) * 60;
        }
      }

      if (data.hostPlayerName) {
        this.hostPlayerName = data.hostPlayerName;
      }
      if (data.roomState?.hostPlayerName) {
        this.hostPlayerName = data.roomState.hostPlayerName;
      }

      if (data.isHost !== undefined) {
        this.isHost = data.isHost;
        const localP = this.getLocalPlayer();
        if (localP) localP.state.isHost = data.isHost;
      }

      // Restore saved stats & coordinates from server on reconnect ONLY IF GAME IS ALREADY ACTIVE
      if (data.savedPlayerState && this.isGameStarted) {
        const localP = this.getLocalPlayer();
        if (localP) {
          if (data.savedPlayerState.x !== undefined) localP.state.x = data.savedPlayerState.x;
          if (data.savedPlayerState.y !== undefined) localP.state.y = data.savedPlayerState.y;
          if (data.savedPlayerState.hp !== undefined) localP.state.hp = data.savedPlayerState.hp;
          if (data.savedPlayerState.maxHp !== undefined) localP.state.maxHp = data.savedPlayerState.maxHp;
          if (data.savedPlayerState.knowledgeScore !== undefined) localP.state.knowledgeScore = data.savedPlayerState.knowledgeScore;
          if (data.savedPlayerState.esgScore !== undefined) localP.state.esgScore = data.savedPlayerState.esgScore;
          if (data.savedPlayerState.koCount !== undefined) localP.state.koCount = data.savedPlayerState.koCount;
          if (data.savedPlayerState.activeWeapon) {
            localP.equipWeapon(data.savedPlayerState.activeWeapon, data.savedPlayerState.activeWeaponAmmo || Infinity);
          }
          localP.targetX = localP.state.x;
          localP.targetY = localP.state.y;
          this.uiManager.addKillfeed(`Selamat datang kembali ${localP.state.name}! Stats HP & posisi dipulihkan.`, 'system');
        }
      } else if (!this.isGameStarted) {
        // If in Lobby, force 0 scores for local player and all existing players
        const localP = this.getLocalPlayer();
        if (localP) {
          localP.state.knowledgeScore = 0;
          localP.state.esgScore = 0;
          localP.state.koCount = 0;
          localP.state.score = 0;
          localP.state.hp = 100;
        }
        for (const p of this.players.values()) {
          p.state.knowledgeScore = 0;
          p.state.esgScore = 0;
          p.state.koCount = 0;
          p.state.score = 0;
          p.state.hp = 100;
        }
      }
    } else if (data.type === 'match_duration_updated') {
      if (data.durationMinutes) {
        this.matchConfig.durationMinutes = data.durationMinutes;
        this.matchTimerSeconds = data.durationMinutes * 60;
        this.uiManager.addKillfeed(`Host mengatur durasi pertandingan: ${data.durationMinutes} menit.`, 'system');
      }
    } else if (data.type === 'map_layout_updated' || data.type === 'update_map_layout') {
      if (data.layoutId && MAP_LAYOUTS[data.layoutId as MapLayoutId]) {
        this.currentLayoutId = data.layoutId as MapLayoutId;
        this.currentPlatforms = JSON.parse(JSON.stringify(MAP_LAYOUTS[this.currentLayoutId].platforms));
        this.currentKnowledgeNodes = JSON.parse(JSON.stringify(MAP_LAYOUTS[this.currentLayoutId].nodes));
        this.uiManager.addKillfeed(`Layout arena diubah ke: ${MAP_LAYOUTS[this.currentLayoutId].name}`, 'system');
      }
    } else if (data.type === 'map_theme_updated' || data.type === 'update_map_theme') {
      if (data.themeId && MAP_THEMES[data.themeId as MapThemeId]) {
        this.currentThemeId = data.themeId as MapThemeId;
        this.uiManager.addKillfeed(`Tema visual arena diubah ke: ${MAP_THEMES[this.currentThemeId].name}`, 'system');
      }
    } else if (data.type === 'request_room_info') {
      if (this.isHost && data.senderId !== this.localPlayerId) {
        this.broadcastNetworkMessage({
          type: 'room_info_response',
          hostId: this.localPlayerId,
          isGameStarted: this.isGameStarted,
          durationMinutes: this.matchConfig.durationMinutes,
          matchTimerSeconds: this.matchTimerSeconds,
          mapLayout: this.currentLayoutId,
          mapTheme: this.currentThemeId,
        });
      }
    } else if (data.type === 'room_info_response') {
      if (data.hostId !== this.localPlayerId) {
        this.isHost = false;
        const localP = this.getLocalPlayer();
        if (localP) localP.state.isHost = false;
      }
      if (data.mapLayout && MAP_LAYOUTS[data.mapLayout as MapLayoutId]) {
        this.currentLayoutId = data.mapLayout as MapLayoutId;
        this.currentPlatforms = JSON.parse(JSON.stringify(MAP_LAYOUTS[this.currentLayoutId].platforms));
        this.currentKnowledgeNodes = JSON.parse(JSON.stringify(MAP_LAYOUTS[this.currentLayoutId].nodes));
      }
      if (data.mapTheme && MAP_THEMES[data.mapTheme as MapThemeId]) {
        this.currentThemeId = data.mapTheme as MapThemeId;
      }
      if (data.durationMinutes) {
        this.matchConfig.durationMinutes = data.durationMinutes;
        if (!this.isGameStarted) {
          this.matchTimerSeconds = data.durationMinutes * 60;
        }
      }
      if (data.isGameStarted) {
        this.isGameStarted = true;
        if (data.matchTimerSeconds !== undefined) {
          this.matchTimerSeconds = data.matchTimerSeconds;
        }
      }
    } else if (data.type === 'start_countdown') {
      this.countdownSeconds = 3;
      soundEngine.playTokenCollect();
    } else if (data.type === 'start_match') {
      if (data.durationMinutes) {
        this.matchConfig.durationMinutes = data.durationMinutes;
      }
      if (data.startTime && data.durationMinutes) {
        const elapsedSec = (Date.now() - data.startTime) / 1000;
        this.matchTimerSeconds = Math.max(0, data.durationMinutes * 60 - elapsedSec);
      } else {
        this.matchTimerSeconds = this.matchConfig.durationMinutes * 60;
      }
      this.isGameStarted = true;
      this.countdownSeconds = null;

      // Reset all players scores, hp, and quiz state at match start
      this.quizEngine.resetAll();
      for (const p of this.players.values()) {
        p.state.knowledgeScore = 0;
        p.state.esgScore = 0;
        p.state.koCount = 0;
        p.state.score = 0;
        p.state.hp = 100;
        p.state.isKO = false;
        p.state.currentQuizId = null;
        p.equipWeapon('fists', Infinity);
      }

      soundEngine.playQuizCorrect();
      this.uiManager.addKillfeed('PERTANDINGAN DIMULAI! SELAMAT BERTANDING!', 'system');
    } else if (data.type === 'player_joined' || data.type === 'remote_player_update') {
      const pState = data.playerState;
      if (pState && pState.id !== this.localPlayerId) {
        let remotePlayer = this.players.get(pState.id);
        if (!remotePlayer) {
          remotePlayer = new Player2D(pState.id, pState.name || 'Remote Brawler', false, pState.isHost || false, this.players.size);
          remotePlayer.state.x = pState.x;
          remotePlayer.state.y = pState.y;
          remotePlayer.targetX = pState.x;
          remotePlayer.targetY = pState.y;
          this.players.set(pState.id, remotePlayer);
          this.uiManager.addKillfeed(`${pState.name || 'Pemain Real Baru'} terhubung ke arena!`, 'system');
        }

        // Smooth target positions for LERP interpolation
        remotePlayer.targetX = pState.x;
        remotePlayer.targetY = pState.y;
        remotePlayer.targetVx = pState.vx;
        remotePlayer.targetVy = pState.vy;

        // Update other game states directly
        remotePlayer.state.hp = pState.hp;
        remotePlayer.state.maxHp = pState.maxHp || 100;
        remotePlayer.state.facing = pState.facing;
        
        // In lobby, force 0 scores for fairness until match starts
        if (!this.isGameStarted) {
          remotePlayer.state.knowledgeScore = 0;
          remotePlayer.state.esgScore = 0;
          remotePlayer.state.koCount = 0;
          remotePlayer.state.score = 0;
        } else {
          remotePlayer.state.knowledgeScore = pState.knowledgeScore || 0;
          remotePlayer.state.esgScore = pState.esgScore || 0;
          remotePlayer.state.koCount = pState.koCount || 0;
          remotePlayer.state.score = pState.score || 0;
        }

        remotePlayer.state.activeWeapon = pState.activeWeapon;
        remotePlayer.state.isHost = pState.isHost || false;
        
        remotePlayer.state.isGrounded = pState.isGrounded;
        remotePlayer.state.isAttacking = pState.isAttacking;
        remotePlayer.state.attackType = pState.attackType;
        remotePlayer.state.isInvulnerable = pState.isInvulnerable;
        remotePlayer.state.isKO = pState.isKO;
        remotePlayer.state.shieldActive = pState.shieldActive;
        if (pState.avatar) remotePlayer.state.avatar = pState.avatar;
      }
    } else if (data.type === 'game_event_broadcast' && data.event && data.event.type === 'player_hit') {
      const ev = data.event;
      if (ev.attackerId !== this.localPlayerId) {
        this.applyDamage(ev.victimId, ev.attackerId, ev.attackerName, ev.damage, ev.knockback, ev.attackerX);
      }
    } else if (data.type === 'match_ended' || data.type === 'game_force_ended' || data.type === 'force_end_game') {
      this.isMatchActive = false;
      this.isMatchEnded = true;
      this.isGameStarted = false;
      this.countdownSeconds = null;
      this.matchTimerSeconds = this.matchConfig.durationMinutes * 60;
      this.uiManager.addKillfeed('Sesi pertandingan telah selesai.', 'system');
      if (this.onMatchEnded) {
        this.onMatchEnded();
      }
    } else if (data.type === 'player_left') {
      const toRemove: string[] = [];
      for (const [id, p] of this.players.entries()) {
        if (id === data.playerId || p.state.name === data.playerName) {
          if (id !== this.localPlayerId) {
            toRemove.push(id);
          }
        }
      }
      for (const id of toRemove) {
        this.players.delete(id);
      }
      this.uiManager.addKillfeed(`${data.playerName || 'Pemain'} terputus dari arena.`, 'system');
    } else if (data.type === 'player_emote') {
      if (data.playerId !== this.localPlayerId) {
        let targetX = data.x;
        let targetY = data.y;
        const senderPlayer = this.players.get(data.playerId) || Array.from(this.players.values()).find(p => p.state.name === data.playerName);
        if (senderPlayer) {
          targetX = senderPlayer.state.x;
          targetY = senderPlayer.state.y;
        }

        this.floatingTexts.push({
          id: `emote_${Date.now()}_${Math.random()}`,
          x: targetX,
          y: targetY - 65,
          text: `💬 "${data.emoteText}"`,
          color: '#facc15',
          life: 2.8,
        });

        this.uiManager.addKillfeed(`${data.playerName || 'Pemain'}: "${data.emoteText}"`, 'system');
        soundEngine.playTokenCollect();
      }
    } else if (data.type === 'match_reset') {
      this.isGameStarted = false;
      this.isMatchEnded = false;
      this.isMatchActive = true;
      this.countdownSeconds = null;
      this.matchTimerSeconds = this.matchConfig.durationMinutes * 60;
      this.quizEngine.resetAll();
      for (const player of this.players.values()) {
        player.state.hp = 100;
        player.state.isKO = false;
        player.state.knowledgeScore = 0;
        player.state.esgScore = 0;
        player.state.koCount = 0;
        player.equipWeapon('fists', Infinity);
      }
      this.uiManager.addKillfeed('Pertandingan telah direset untuk sesi baru.', 'system');
    }
  }

  public onMatchEnded?: () => void;

  public forceEndMatch() {
    this.broadcastNetworkMessage({
      type: 'force_end_game',
      roomCode: this.matchConfig.roomCode,
    });
    this.broadcastNetworkMessage({
      type: 'game_force_ended',
      roomCode: this.matchConfig.roomCode,
    });
    this.isMatchActive = false;
    this.isMatchEnded = true;
    this.isGameStarted = false;
    this.uiManager.addKillfeed('Anda telah menghentikan sesi pertandingan.', 'system');
    if (this.onMatchEnded) {
      this.onMatchEnded();
    }
  }

  public broadcastLocalState(immediate: boolean = false) {
    const localPlayer = this.getLocalPlayer();
    if (!localPlayer) return;

    const now = performance.now();
    if (!immediate && now - this.lastBroadcastTime < this.broadcastIntervalMs) {
      return;
    }
    this.lastBroadcastTime = now;

    // Ensure local isHost property is synced
    localPlayer.state.isHost = this.isHost;

    const payload = {
      type: 'remote_player_update',
      roomCode: this.matchConfig.roomCode,
      playerState: localPlayer.state,
    };

    // Send via BroadcastChannel (local browser tabs)
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage(payload);
    }

    // Send via WebSocket (online server)
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(
        JSON.stringify({
          type: 'player_state_update',
          roomCode: this.matchConfig.roomCode,
          playerState: localPlayer.state,
        })
      );
    }
  }

  public setLocalPlayerId(id: string) {
    this.localPlayerId = id;
  }

  public getLocalPlayer(): Player2D | undefined {
    return this.players.get(this.localPlayerId);
  }

  public getPlayerList(): PlayerState[] {
    return Array.from(this.players.values()).map((p) => {
      p.calculateTotalScore();
      return p.state;
    });
  }

  public setMapLayout(layoutId: MapLayoutId) {
    if (!MAP_LAYOUTS[layoutId]) return;
    this.currentLayoutId = layoutId;
    this.currentPlatforms = JSON.parse(JSON.stringify(MAP_LAYOUTS[layoutId].platforms));
    this.currentKnowledgeNodes = JSON.parse(JSON.stringify(MAP_LAYOUTS[layoutId].nodes));
    this.uiManager.addKillfeed(`Layout arena diubah ke: ${MAP_LAYOUTS[layoutId].name}`, 'system');

    if (this.isHost) {
      this.broadcastNetworkMessage({
        type: 'update_map_layout',
        roomCode: this.matchConfig.roomCode,
        layoutId: layoutId,
      });
    }
  }

  public setMapTheme(themeId: MapThemeId) {
    if (!MAP_THEMES[themeId]) return;
    this.currentThemeId = themeId;
    this.uiManager.addKillfeed(`Tema visual arena diubah ke: ${MAP_THEMES[themeId].name}`, 'system');

    if (this.isHost) {
      this.broadcastNetworkMessage({
        type: 'update_map_theme',
        roomCode: this.matchConfig.roomCode,
        themeId: themeId,
      });
    }
  }

  public updateGameLoop(dt: number) {
    if (!this.isMatchActive || this.isMatchEnded) return;

    // Broadcast local player state periodically
    this.broadcastLocalState();

    // Handle Countdown Tick
    if (this.countdownSeconds !== null) {
      this.countdownSeconds -= dt;
      if (this.countdownSeconds <= 0) {
        this.countdownSeconds = null;
        this.isGameStarted = true;
        soundEngine.playQuizCorrect();
        this.uiManager.addKillfeed('PERTANDINGAN DIMULAI! SELAMAT BERTANDING!', 'system');
        if (this.isHost) {
          this.broadcastNetworkMessage({ 
            type: 'start_match',
            roomCode: this.matchConfig.roomCode,
            durationMinutes: this.matchConfig.durationMinutes,
          });
        }
      }
    }

    // Floating Texts Update (always active so emotes work in lobby)
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y -= 30 * dt;
      ft.life -= dt * 1.2;
      if (ft.life <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }

    // Crumbling Platforms state machine (Injak sebentar langsung hilang & regenerasi)
    for (const plat of this.currentPlatforms) {
      if (!plat.isCrumbling) continue;
      if (!plat.crumbleState) plat.crumbleState = 'idle';

      if (plat.crumbleState === 'idle') {
        // Check if any active player is standing on this crumbling platform
        let hasPlayerOnTop = false;
        for (const p of this.players.values()) {
          if (p.state.isKO) continue;
          const feetY = p.state.y + 28;
          const isGroundedOnPlat = p.state.isGrounded && Math.abs(feetY - plat.y) <= 12;
          const isWithinX = p.state.x + 12 >= plat.x && p.state.x - 12 <= plat.x + plat.w;
          if (isGroundedOnPlat && isWithinX) {
            hasPlayerOnTop = true;
            break;
          }
        }

        if (hasPlayerOnTop) {
          plat.crumbleState = 'warning';
          plat.crumbleTimer = 0.75; // 0.75s warning before crumbling!
        }
      } else if (plat.crumbleState === 'warning') {
        plat.crumbleTimer = (plat.crumbleTimer || 0.75) - dt;
        if (plat.crumbleTimer <= 0) {
          plat.crumbleState = 'crumbled';
          plat.respawnTimer = 3.5; // 3.5s before respawning
          soundEngine.playCrumble();
        }
      } else if (plat.crumbleState === 'crumbled') {
        plat.respawnTimer = (plat.respawnTimer || 3.5) - dt;
        if (plat.respawnTimer <= 0) {
          plat.crumbleState = 'idle';
          plat.crumbleTimer = 0;
          plat.respawnTimer = 0;
        }
      }
    }

    // Player Physics (walking and jumping on active platforms)
    for (const player of this.players.values()) {
      const isLocal = player.state.id === this.localPlayerId;
      player.updatePhysics(dt, this.currentPlatforms, isLocal);
      
      // Save local player state periodically
      if (isLocal && Math.random() < 0.05) {
        try {
          localStorage.setItem(`pkt_player_${player.state.name}`, JSON.stringify(player.state));
        } catch(e) {}
      }
    }

    // IF GAME HAS NOT STARTED YET (Lobby/Waiting state):
    // Match timer DOES NOT run, Tokens/Weapons DO NOT spawn or collect.
    if (!this.isGameStarted) {
      return;
    }

    // --- GAME IS ACTIVE BELOW ---

    // Countdown Match Timer (15 minutes)
    this.matchTimerSeconds -= dt;
    if (this.matchTimerSeconds <= 0) {
      this.matchTimerSeconds = 0;
      this.endMatch();
      return;
    }

    // Update Quiz Engine Timer
    if (this.quizEngine.getCurrentQuiz()) {
      const expired = this.quizEngine.updateTimer(dt);
      if (expired) {
        const activeQuiz = this.quizEngine.getCurrentQuiz();
        if (activeQuiz) {
          const victim = this.players.get(activeQuiz.playerId);
          if (victim) {
            victim.state.knowledgeScore = Math.max(0, victim.state.knowledgeScore - 10);
            this.uiManager.addKillfeed(`Waktu Kuis Habis! ${victim.state.name} (-10 Poin)`, 'quiz');
            if (victim.state.id === this.localPlayerId) soundEngine.playQuizWrong();
          }
        }
        this.quizEngine.cancelCurrentQuiz();
      }
    }

    // Update Eco Tokens
    this.ecoTokenManager.update(dt);

    // Eco Token & Weapon Collisions
    for (const player of this.players.values()) {
      if (!player.state.isKO) {
        const tokenHit = this.ecoTokenManager.checkCollisions(player.state.x, player.state.y);
        if (tokenHit) {
          player.state.esgScore += tokenHit.pointsGranted;
          this.floatingTexts.push(tokenHit.floatText);
          this.uiManager.addKillfeed(`${player.state.name} mendapatkan +20 ESG Token!`, 'esg');
          if (player.state.id === this.localPlayerId) soundEngine.playTokenCollect();
        }

        // Weapon PowerUp Pickup Check
        for (let wIdx = this.weaponPowerUps.length - 1; wIdx >= 0; wIdx--) {
          const wp = this.weaponPowerUps[wIdx];
          if (!wp.isCollected) {
            const dx = player.state.x - wp.x;
            const dy = player.state.y - wp.y;
            if (dx * dx + dy * dy < 32 * 32) {
              wp.isCollected = true;
              player.equipWeapon(wp.type, wp.ammo);
              this.uiManager.addKillfeed(`${player.state.name} mengambil Senjata Power-Up ${wp.type}!`, 'weapon');
              if (player.state.id === this.localPlayerId) soundEngine.playTokenCollect();
              this.weaponPowerUps.splice(wIdx, 1);
            }
          }
        }
      }
    }
  }

  public handlePlayerAttack(attackerId: string, attackData: { type: WeaponType; x: number; y: number; facing: 'left' | 'right'; damage: number; knockback: number; range: number }) {
    if (!this.isGameStarted) return; // No attacks or damage in lobby!
    const attacker = this.players.get(attackerId);
    if (!attacker) return;

    // Hanya pemain penyerang (attacker lokal) yang menghitung tabrakan dan menyebarkan 'player_hit'
    if (attackerId !== this.localPlayerId) return;

    for (const victim of this.players.values()) {
      if (victim.state.id === attackerId || victim.state.isKO) continue;

      const dx = victim.state.x - attackData.x;
      const dy = victim.state.y - attackData.y;
      const distSq = dx * dx + dy * dy;

      if (distSq <= attackData.range * attackData.range && Math.abs(dy) < 50) {
        // Hit confirmed! Broadcast to others
        const hitPayload = {
          type: 'game_event_broadcast',
          roomCode: this.matchConfig.roomCode,
          event: {
            type: 'player_hit',
            victimId: victim.state.id,
            attackerId: attacker.state.id,
            attackerName: attacker.state.name,
            damage: attackData.damage,
            knockback: attackData.knockback,
            attackerX: attacker.state.x
          }
        };

        if (this.broadcastChannel) this.broadcastChannel.postMessage(hitPayload);
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
          this.socket.send(JSON.stringify(hitPayload));
        }

        // Apply locally
        this.applyDamage(victim.state.id, attacker.state.id, attacker.state.name, attackData.damage, attackData.knockback, attacker.state.x);
      }
    }
  }

  public applyDamage(victimId: string, attackerId: string, attackerName: string, damage: number, knockback: number, attackerX: number) {
    const victim = this.players.get(victimId);
    const attacker = this.players.get(attackerId);
    if (!victim || !attacker) return;

    const wasKO = victim.takeDamageAndKnockback(
      damage,
      knockback,
      attackerX,
      attackerName,
      (victimName, killerName) => {
        attacker.state.koCount += 1;
        this.uiManager.addKillfeed(`${killerName} berhasil menumbangkan ${victimName} (K.O)! (+30 Poin)`, 'ko');
      }
    );

    this.floatingTexts.push({
      id: `dmg_${Date.now()}_${Math.random()}`,
      x: victim.state.x,
      y: victim.state.y - 30,
      text: `-${damage}`,
      color: '#ef4444',
      life: 0.8,
    });

    if (wasKO) {
      this.floatingTexts.push({
        id: `ko_text_${Date.now()}`,
        x: victim.state.x,
        y: victim.state.y - 50,
        text: 'K.O!',
        color: '#dc2626',
        life: 1.2,
      });
    }
  }

  public sendEmote(playerId: string, emoteText: string) {
    const player = this.players.get(playerId);
    if (!player || player.state.isKO) return;

    this.floatingTexts.push({
      id: `emote_${Date.now()}_${Math.random()}`,
      x: player.state.x,
      y: player.state.y - 65,
      text: `💬 "${emoteText}"`,
      color: '#facc15',
      life: 2.8,
    });

    this.uiManager.addKillfeed(`${player.state.name}: "${emoteText}"`, 'system');

    if (playerId === this.localPlayerId) {
      soundEngine.playTokenCollect();
      this.broadcastNetworkMessage({
        type: 'player_emote',
        playerId: this.localPlayerId,
        playerName: player.state.name,
        emoteText: emoteText,
        x: player.state.x,
        y: player.state.y,
        roomCode: this.matchConfig.roomCode,
      });
    }
  }

  public getPlayerNodeProximity(playerId: string): { isNearNode: boolean; isExhausted: boolean; nodeLabel?: string } {
    const player = this.players.get(playerId);
    if (!player) return { isNearNode: false, isExhausted: false };

    for (const node of this.currentKnowledgeNodes) {
      const dx = Math.abs(player.state.x - node.x);
      const dy = Math.abs(player.state.y - node.y);
      if (dx < 60 && dy < 60) {
        const isExhausted = this.quizEngine.isNodeExhausted(node.id, playerId);
        return { isNearNode: true, isExhausted, nodeLabel: node.label };
      }
    }
    return { isNearNode: false, isExhausted: false };
  }

  public interactKnowledgeNode(playerId: string): boolean {
    if (!this.isGameStarted) return false; // No quiz nodes during lobby/waiting room
    const player = this.players.get(playerId);
    if (!player || player.state.isKO) return false;

    for (const node of this.currentKnowledgeNodes) {
      const dx = Math.abs(player.state.x - node.x);
      const dy = Math.abs(player.state.y - node.y);
      if (dx < 50 && dy < 50) {
        if (this.quizEngine.isNodeExhausted(node.id, playerId)) {
          if (playerId === this.localPlayerId) {
            this.uiManager.addKillfeed(`Tower ${node.label} telah Anda selesaikan! Silakan berpindah ke Tower Kuis lain.`, 'system');
            soundEngine.playTokenCollect();
          }
          return false;
        }

        player.state.currentQuizId = Number(node.id.replace('node_', ''));
        const quiz = this.quizEngine.popNextQuestionForNode(node.id, playerId);
        return quiz !== null;
      }
    }
    return false;
  }

  public submitQuizAnswer(playerId: string, selectedOptionKey: string) {
    const player = this.players.get(playerId);
    if (!player) return null;

    const result = this.quizEngine.evaluateAnswer(selectedOptionKey);
    player.state.knowledgeScore += result.pointsDelta;
    player.state.currentQuizId = null;

    if (result.isCorrect) {
      this.uiManager.addKillfeed(`BENAR! ${player.state.name} menjawab Kuis Manajemen Risiko (+50 Poin)!`, 'quiz');
      if (player.state.id === this.localPlayerId) soundEngine.playQuizCorrect();

      if (result.spawnedWeapon) {
        const wConfig = WEAPON_CONFIGS[result.spawnedWeapon];
        player.equipWeapon(result.spawnedWeapon, wConfig.maxAmmo === Infinity ? 10 : wConfig.maxAmmo);

        const weaponMsg = `🎁 SENJATA UNIK: [${wConfig.name}] (Damage: ${wConfig.damage} | Knockback: ${wConfig.knockback} | Ammo: ${wConfig.maxAmmo})`;
        this.uiManager.addKillfeed(`${player.state.name} membuka ${weaponMsg}!`, 'weapon');

        this.floatingTexts.push({
          id: `wpn_${Date.now()}`,
          x: player.state.x,
          y: player.state.y - 60,
          text: `🎁 SENJATA UNIK: ${wConfig.name} (Dmg: ${wConfig.damage})`,
          color: wConfig.color,
          life: 2.0,
        });
      }
    } else {
      if (player.state.id === this.localPlayerId) soundEngine.playQuizWrong();
      player.takeDamageAndKnockback(10, 200, player.state.x - 20, 'Kuis Kepatuhan PKT');
      this.uiManager.addKillfeed(`SALAH! ${player.state.name} dikenakan penalti (-10 Poin & Knockback)!`, 'quiz');
    }

    return result;
  }

  public endMatch() {
    this.isMatchActive = false;
    this.isMatchEnded = true;
    this.isGameStarted = false;
    this.countdownSeconds = null;

    this.broadcastNetworkMessage({
      type: 'match_ended',
      roomCode: this.matchConfig.roomCode,
    });

    const sorted = this.uiManager.getSortedLeaderboard(this.getPlayerList());
    if (sorted.length > 0) {
      const winner = sorted[0];
      this.uiManager.addKillfeed(`PERTANDINGAN SELESAI! Pemenang: ${winner.name} dengan Total Skor ${winner.score}!`, 'system');
    }

    if (this.onMatchEnded) {
      this.onMatchEnded();
    }
  }

  public resetMatchForNewGame() {
    this.isGameStarted = false;
    this.isMatchEnded = false;
    this.isMatchActive = true;
    this.countdownSeconds = null;
    this.matchTimerSeconds = this.matchConfig.durationMinutes * 60;
    
    // Reset tokens & powerups
    this.ecoTokenManager.resetTokens();
    this.weaponPowerUps = [];
    this.floatingTexts = [];

    // Reset local and remote player states (scores, hp, weapons)
    for (const player of this.players.values()) {
      player.state.hp = 100;
      player.state.maxHp = 100;
      player.state.isKO = false;
      player.state.knowledgeScore = 0;
      player.state.esgScore = 0;
      player.state.koCount = 0;
      player.equipWeapon('fists', Infinity);
      player.state.shieldActive = false;
      player.state.isInvulnerable = false;
      player.state.currentQuizId = null;
    }

    // Reset quiz engine state
    this.quizEngine.resetAll();

    // Broadcast reset to all clients and server
    this.broadcastNetworkMessage({
      type: 'reset_match',
      roomCode: this.matchConfig.roomCode,
    });
  }
}

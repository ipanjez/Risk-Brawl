import express from 'express';
import http from 'http';
import path from 'path';
import os from 'os';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';

function getLocalIpAddress(): string {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

function getAllIpAddresses(): string[] {
  const ips: string[] = [];
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push(iface.address);
      }
    }
  }
  return ips;
}

async function startServer() {
  const app = express();
  const PORT = 3000;
  const server = http.createServer(app);

  // WebSocket Server attached to the HTTP server
  const wss = new WebSocketServer({ server, path: '/ws/brawler' });

  interface ConnectedClient {
    ws: WebSocket;
    playerId: string;
    playerName: string;
    roomCode: string;
  }

  interface RoomState {
    isGameStarted: boolean;
    startTime: number | null;
    durationMinutes: number;
    mapLayout: string;
    mapTheme: string;
    hostPlayerName: string | null;
    players: Map<string, any>; // keyed by playerName
    disconnectedPlayerStates: Map<string, any>; // keyed by playerName
  }

  const clientsMap = new Map<string, ConnectedClient>();
  const roomsMap = new Map<string, RoomState>();

  function getRoom(code: string): RoomState {
    if (!roomsMap.has(code)) {
      roomsMap.set(code, {
        isGameStarted: false,
        startTime: null,
        durationMinutes: 15,
        mapLayout: 'standard',
        mapTheme: 'industrial_green',
        hostPlayerName: null,
        players: new Map(),
        disconnectedPlayerStates: new Map(),
      });
    }
    const room = roomsMap.get(code)!;
    // Auto-expire match if duration has passed
    if (room.isGameStarted && room.startTime) {
      const elapsedSec = (Date.now() - room.startTime) / 1000;
      if (elapsedSec >= (room.durationMinutes || 15) * 60) {
        room.isGameStarted = false;
        room.startTime = null;
        room.hostPlayerName = null; // Session expired, reset host for next game
      }
    }
    return room;
  }

  wss.on('connection', (ws: WebSocket) => {
    let clientId = `p_net_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message.toString());

        if (data.type === 'join_room') {
          const playerName = (data.name || 'Auditor').trim();
          clientsMap.set(clientId, {
            ws,
            playerId: clientId,
            playerName: playerName,
            roomCode: data.roomCode || 'PKT-ESG-2026',
          });

          // Acknowledge Join & Send Room State + Any Saved Disconnected State
          const room = getRoom(data.roomCode || 'PKT-ESG-2026');
          const savedPlayerState = room.disconnectedPlayerStates.get(playerName);

          // The first player to enter the room becomes the Host throughout this session
          if (!room.hostPlayerName) {
            room.hostPlayerName = playerName;
          }

          // If the player reconnects with the same name, they keep their host privileges!
          const isHost = !!(room.hostPlayerName && room.hostPlayerName.toLowerCase() === playerName.toLowerCase());

          // If game is in Lobby, force 0 scores for all players
          if (!room.isGameStarted) {
            if (savedPlayerState) {
              savedPlayerState.knowledgeScore = 0;
              savedPlayerState.esgScore = 0;
              savedPlayerState.koCount = 0;
              savedPlayerState.score = 0;
            }
            room.players.forEach((p) => {
              p.knowledgeScore = 0;
              p.esgScore = 0;
              p.koCount = 0;
              p.score = 0;
            });
          }

          ws.send(
            JSON.stringify({
              type: 'room_joined',
              playerId: clientId,
              isHost: isHost,
              hostPlayerName: room.hostPlayerName,
              connectedCount: clientsMap.size,
              savedPlayerState: savedPlayerState || null,
              roomState: {
                isGameStarted: room.isGameStarted,
                startTime: room.startTime,
                durationMinutes: room.durationMinutes,
                mapLayout: room.mapLayout || 'standard',
                mapTheme: room.mapTheme || 'industrial_green',
                hostPlayerName: room.hostPlayerName,
                players: Array.from(room.players.entries()),
              }
            })
          );

          // Broadcast to all clients in same room
          broadcastToRoom(data.roomCode, {
            type: 'player_joined',
            playerId: clientId,
            playerName: data.name,
            totalPlayers: clientsMap.size,
          });
        } else if (data.type === 'update_match_duration') {
          const room = getRoom(data.roomCode || 'PKT-ESG-2026');
          if (data.durationMinutes) {
            room.durationMinutes = data.durationMinutes;
          }
          broadcastToRoom(data.roomCode, {
            type: 'match_duration_updated',
            durationMinutes: room.durationMinutes,
          });
        } else if (data.type === 'update_map_layout') {
          const room = getRoom(data.roomCode || 'PKT-ESG-2026');
          if (data.layoutId) {
            room.mapLayout = data.layoutId;
          }
          broadcastToRoom(data.roomCode, {
            type: 'map_layout_updated',
            layoutId: room.mapLayout,
          });
        } else if (data.type === 'update_map_theme') {
          const room = getRoom(data.roomCode || 'PKT-ESG-2026');
          if (data.themeId) {
            room.mapTheme = data.themeId;
          }
          broadcastToRoom(data.roomCode, {
            type: 'map_theme_updated',
            themeId: room.mapTheme,
          });
        } else if (data.type === 'player_state_update') {
          // Relaying real-time position/action
          const client = clientsMap.get(clientId);
          if (client && data.playerState) {
            const room = getRoom(client.roomCode);
            // In lobby, ensure player state reports 0 score
            if (!room.isGameStarted) {
              data.playerState.knowledgeScore = 0;
              data.playerState.esgScore = 0;
              data.playerState.koCount = 0;
              data.playerState.score = 0;
            }
            room.players.set(client.playerName, data.playerState);
            room.disconnectedPlayerStates.set(client.playerName, data.playerState);
          }
          
          broadcastToRoom(data.roomCode, {
            type: 'remote_player_update',
            playerState: data.playerState,
          }, clientId);
        } else if (data.type === 'start_match') {
          const room = getRoom(data.roomCode || 'PKT-ESG-2026');
          room.isGameStarted = true;
          room.startTime = Date.now();
          if (data.durationMinutes) {
            room.durationMinutes = data.durationMinutes;
          }
          // Reset all players scores to 0 at match start
          room.players.forEach((p) => {
            p.knowledgeScore = 0;
            p.esgScore = 0;
            p.koCount = 0;
            p.score = 0;
            p.hp = 100;
          });
          room.disconnectedPlayerStates.forEach((p) => {
            p.knowledgeScore = 0;
            p.esgScore = 0;
            p.koCount = 0;
            p.score = 0;
          });
          broadcastToRoom(data.roomCode, { 
            type: 'start_match',
            durationMinutes: room.durationMinutes,
            startTime: room.startTime,
          });
        } else if (data.type === 'start_countdown') {
          const client = clientsMap.get(clientId);
          const roomCode = data.roomCode || (client ? client.roomCode : 'PKT-ESG-2026');
          broadcastToRoom(roomCode, { type: 'start_countdown' }, clientId);
        } else if (data.type === 'match_ended' || data.type === 'end_match') {
          const client = clientsMap.get(clientId);
          const roomCode = data.roomCode || (client ? client.roomCode : 'PKT-ESG-2026');
          const room = getRoom(roomCode);
          room.isGameStarted = false;
          room.startTime = null;
          room.players.forEach((p) => {
            p.knowledgeScore = 0;
            p.esgScore = 0;
            p.koCount = 0;
            p.score = 0;
          });
          room.disconnectedPlayerStates.clear();
          broadcastToRoom(roomCode, { type: 'match_ended' });
        } else if (data.type === 'reset_match' || data.type === 'restart_match') {
          const client = clientsMap.get(clientId);
          const roomCode = data.roomCode || (client ? client.roomCode : 'PKT-ESG-2026');
          const room = getRoom(roomCode);
          room.isGameStarted = false;
          room.startTime = null;
          room.players.forEach((p) => {
            p.knowledgeScore = 0;
            p.esgScore = 0;
            p.koCount = 0;
            p.score = 0;
          });
          room.disconnectedPlayerStates.clear();
          broadcastToRoom(roomCode, { type: 'match_reset' });
        } else if (data.type === 'force_end_game' || data.type === 'game_force_ended') {
          const client = clientsMap.get(clientId);
          const roomCode = data.roomCode || (client ? client.roomCode : 'PKT-ESG-2026');
          const room = getRoom(roomCode);
          room.isGameStarted = false;
          room.startTime = null;
          room.disconnectedPlayerStates.clear();
          broadcastToRoom(roomCode, { type: 'game_force_ended' });
          broadcastToRoom(roomCode, { type: 'force_end_game' });
        } else if (data.type === 'player_emote') {
          const client = clientsMap.get(clientId);
          const roomCode = data.roomCode || (client ? client.roomCode : 'PKT-ESG-2026');
          broadcastToRoom(roomCode, {
            type: 'player_emote',
            playerId: data.playerId || clientId,
            playerName: data.playerName || (client ? client.playerName : 'Auditor'),
            emoteText: data.emoteText,
            x: data.x,
            y: data.y,
          }, clientId);
        } else if (data.type === 'game_event') {
          broadcastToRoom(data.roomCode, {
            type: 'game_event_broadcast',
            event: data.event,
          });
        } else {
          const client = clientsMap.get(clientId);
          if (client) {
            broadcastToRoom(client.roomCode, data, clientId);
          }
        }
      } catch (err) {
        console.error('WebSocket parse error:', err);
      }
    });

    ws.on('close', () => {
      const client = clientsMap.get(clientId);
      if (client) {
        const room = getRoom(client.roomCode);
        const lastState = room.players.get(client.playerName);
        if (lastState) {
          room.disconnectedPlayerStates.set(client.playerName, lastState);
        }
        room.players.delete(client.playerName);
        clientsMap.delete(clientId);

        // If all clients left and game is in lobby, reset host for next session
        if (clientsMap.size === 0 && !room.isGameStarted) {
          room.hostPlayerName = null;
        }

        broadcastToRoom(client.roomCode, {
          type: 'player_left',
          playerId: clientId,
          playerName: client.playerName,
          totalPlayers: clientsMap.size,
        });
      }
    });
  });

  function broadcastToRoom(roomCode: string, payload: any, excludeClientId?: string) {
    const msg = JSON.stringify(payload);
    clientsMap.forEach((client, id) => {
      if (client.roomCode === roomCode && id !== excludeClientId && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(msg);
      }
    });
  }

  // Healthcheck endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', activeSessions: clientsMap.size });
  });

  // Room State API
  app.get('/api/room/:code', (req, res) => {
    const code = req.params.code;
    if (!roomsMap.has(code)) {
      res.json({ isGameStarted: false, players: [], hostPlayerName: null });
      return;
    }
    const room = roomsMap.get(code)!;
    
    // Gabungkan pemain dari clientsMap (aktif) dan roomsMap (tersimpan)
    const activeNames = new Set<string>();
    clientsMap.forEach(client => {
      if (client.roomCode === code) activeNames.add(client.playerName);
    });
    
    const allPlayers = Array.from(room.players.keys()).map(name => ({
      name,
      isActive: activeNames.has(name)
    }));
    
    res.json({
      isGameStarted: room.isGameStarted,
      startTime: room.startTime,
      durationMinutes: room.durationMinutes || 15,
      hostPlayerName: room.hostPlayerName,
      players: allPlayers,
    });
  });

  // Server Network Info API
  app.get('/api/server-info', (req, res) => {
    const localIp = getLocalIpAddress();
    res.json({
      ip: localIp,
      port: PORT,
      url: `http://${localIp}:${PORT}`,
      allIps: getAllIpAddresses(),
    });
  });

  // Vite middleware in dev mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    const localIp = getLocalIpAddress();
    console.log(`=================================================`);
    console.log(`🚀 PKT Brawler Multi-Device Game Server Aktif!`);
    console.log(`- Local Access : http://localhost:${PORT}`);
    console.log(`- Wi-Fi / LAN  : http://${localIp}:${PORT}`);
    console.log(`=================================================`);
  });
}

startServer();

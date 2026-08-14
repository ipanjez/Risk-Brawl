import { EcoTokenState, FloatingText } from '../types';

export const INITIAL_ECO_TOKEN_NODES = [
  { id: 'token_1', x: 200, y: 350 },
  { id: 'token_2', x: 500, y: 220 },
  { id: 'token_3', x: 800, y: 220 },
  { id: 'token_4', x: 1100, y: 350 },
  { id: 'token_5', x: 640, y: 500 },
  { id: 'token_6', x: 340, y: 600 },
  { id: 'token_7', x: 940, y: 600 },
  { id: 'token_8', x: 640, y: 150 },
];

export class EcoTokenManager {
  public tokens: EcoTokenState[] = [];

  constructor() {
    this.resetTokens();
  }

  public resetTokens() {
    this.tokens = INITIAL_ECO_TOKEN_NODES.map((node) => ({
      id: node.id,
      x: node.x,
      y: node.y,
      isCollected: false,
      respawnTimer: 0,
    }));
  }

  public update(dt: number) {
    for (const token of this.tokens) {
      if (token.isCollected) {
        token.respawnTimer -= dt;
        if (token.respawnTimer <= 0) {
          token.isCollected = false;
          token.respawnTimer = 0;
        }
      }
    }
  }

  public checkCollisions(
    playerX: number,
    playerY: number,
    playerRadius: number = 24
  ): { collectedTokenId: string; pointsGranted: number; floatText: FloatingText } | null {
    for (const token of this.tokens) {
      if (!token.isCollected) {
        const dx = playerX - token.x;
        const dy = playerY - token.y;
        const distSq = dx * dx + dy * dy;
        const collisionDist = playerRadius + 18; // Token radius ~18

        if (distSq <= collisionDist * collisionDist) {
          token.isCollected = true;
          token.respawnTimer = 12.0; // 12 seconds respawn time

          return {
            collectedTokenId: token.id,
            pointsGranted: 20, // +20 ESG Points
            floatText: {
              id: `float_esg_${Date.now()}_${Math.random()}`,
              x: token.x,
              y: token.y - 20,
              text: '+20 ESG!',
              color: '#10b981',
              life: 1.0,
            },
          };
        }
      }
    }
    return null;
  }

  public static drawToken(ctx: CanvasRenderingContext2D, token: EcoTokenState, pulseTime: number) {
    if (token.isCollected) return;

    ctx.save();
    ctx.translate(token.x, token.y + Math.sin(pulseTime * 4) * 4); // Floating bounce

    // Outer glow ring
    ctx.fillStyle = 'rgba(16, 185, 129, 0.25)';
    ctx.beginPath();
    ctx.arc(0, 0, 20 + Math.sin(pulseTime * 6) * 3, 0, Math.PI * 2);
    ctx.fill();

    // ESG Token Coin
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#a7f3d0';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Leaf symbol
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🌱', 0, 4);

    ctx.restore();
  }
}

import { PlayerState, AvatarCustomization, WeaponType, HeadgearType, EyewearType, FootwearType, OutfitType } from '../types';
import { soundEngine } from '../utils/audio';
import { MapPlatform } from './IndustrialMap';

export const MAP_BOUNDS = {
  width: 1280,
  height: 720,
  groundY: 640,
};

export const SPAWN_NODES = [
  { x: 120, y: 520 },
  { x: 340, y: 380 },
  { x: 640, y: 260 },
  { x: 940, y: 380 },
  { x: 1160, y: 520 },
  { x: 200, y: 200 },
  { x: 1080, y: 200 },
  { x: 640, y: 540 },
];

export const WEAPON_CONFIGS: Record<WeaponType, { name: string; damage: number; knockback: number; range: number; cooldown: number; maxAmmo: number; color: string }> = {
  fists: { name: 'Audit Fists', damage: 15, knockback: 350, range: 45, cooldown: 0.35, maxAmmo: Infinity, color: '#f59e0b' },
  beam_rifle: { name: 'Laser Beam Rifle', damage: 35, knockback: 600, range: 400, cooldown: 0.6, maxAmmo: 8, color: '#3b82f6' },
  risk_hammer: { name: 'Risk Audit Hammer', damage: 50, knockback: 850, range: 75, cooldown: 0.9, maxAmmo: 5, color: '#ef4444' },
  esg_shield: { name: 'ESG Plasma Shield', damage: 10, knockback: 400, range: 60, cooldown: 0.2, maxAmmo: 10, color: '#10b981' },
  compliance_sword: { name: 'Compliance Sword', damage: 30, knockback: 500, range: 65, cooldown: 0.4, maxAmmo: 12, color: '#8b5cf6' },
  decarb_blaster: { name: 'Decarb Blaster', damage: 25, knockback: 450, range: 320, cooldown: 0.45, maxAmmo: 10, color: '#06b6d4' },
};

export function createDefaultAvatar(index: number = 0, name: string = 'Auditor'): AvatarCustomization {
  const headgears: HeadgearType[] = ['helmet_yellow', 'helmet_red', 'helmet_white', 'risk_hat', 'ai_visor', 'none'];
  const eyewears: EyewearType[] = ['safety_goggles', 'ar_glasses', 'monocle', 'none'];
  const footwears: FootwearType[] = ['safety_boots', 'agility_shoes', 'steel_boots'];
  const outfits: OutfitType[] = ['pkt_uniform', 'esg_suit', 'audit_blazer', 'executive_suit'];
  const hairColors = ['#27272a', '#451a03', '#713f12', '#b45309', '#1e293b'];
  const primaryColors = ['#16a34a', '#0284c7', '#dc2626', '#d97706', '#9333ea', '#2563eb'];

  return {
    headgear: headgears[index % headgears.length],
    eyewear: eyewears[index % eyewears.length],
    footwear: footwears[index % footwears.length],
    outfit: outfits[index % outfits.length],
    faceShape: 'oval',
    hairStyle: 'short',
    hairColor: hairColors[index % hairColors.length],
    skinColor: '#fde047',
    primaryColor: primaryColors[index % primaryColors.length],
  };
}

export class Player2D {
  public state: PlayerState;
  public targetX?: number;
  public targetY?: number;
  public targetVx?: number;
  public targetVy?: number;

  constructor(id: string, name: string, isBot: boolean = false, isHost: boolean = false, spawnIndex: number = 0) {
    const spawnNode = SPAWN_NODES[spawnIndex % SPAWN_NODES.length];
    this.state = {
      id,
      name,
      isBot,
      isHost,
      x: spawnNode.x,
      y: spawnNode.y,
      vx: 0,
      vy: 0,
      hp: 100,
      maxHp: 100,
      score: 0,
      knowledgeScore: 0,
      koCount: 0,
      esgScore: 0,
      facing: 'right',
      isGrounded: false,
      isDoubleJumping: false,
      isAttacking: false,
      attackType: null,
      attackTimer: 0,
      isInvulnerable: true,
      invulnerableTimer: 2.0, // Start with 2s shield
      isKO: false,
      koTimer: 0,
      activeWeapon: 'fists',
      activeWeaponAmmo: Infinity,
      avatar: createDefaultAvatar(spawnIndex, name),
      currentQuizId: null,
      shieldActive: false,
      shieldTimer: 0,
    };
    this.targetX = spawnNode.x;
    this.targetY = spawnNode.y;
    this.targetVx = 0;
    this.targetVy = 0;
  }

  public updatePhysics(dt: number, platforms: MapPlatform[], isLocal: boolean = true) {
    if (this.state.isKO) {
      this.state.koTimer -= dt;
      if (this.state.koTimer <= 0) {
        this.respawn();
      }
      return;
    }

    if (this.state.invulnerableTimer > 0) {
      this.state.invulnerableTimer -= dt;
      if (this.state.invulnerableTimer < 0) this.state.invulnerableTimer = 0;
    }

    if (this.state.attackTimer > 0) {
      this.state.attackTimer -= dt;
      if (this.state.attackTimer <= 0) {
        this.state.isAttacking = false;
        this.state.attackType = null;
      }
    }

    if (this.state.shieldTimer > 0) {
      this.state.shieldTimer -= dt;
      if (this.state.shieldTimer <= 0) {
        this.state.shieldActive = false;
      }
    }

    if ((this.state.hitFlashTimer || 0) > 0) {
      this.state.hitFlashTimer = Math.max(0, (this.state.hitFlashTimer || 0) - dt);
    }

    if (this.state.tiltAngle) {
      this.state.tiltAngle *= Math.pow(0.05, dt * 5);
      if (Math.abs(this.state.tiltAngle) < 0.01) this.state.tiltAngle = 0;
    }

    // Update Walk Cycle Time
    if (Math.abs(this.state.vx) > 10 && this.state.isGrounded) {
      this.state.walkCycleTime = (this.state.walkCycleTime || 0) + dt * 14;
    } else if (this.state.isGrounded) {
      this.state.walkCycleTime = 0;
    }

    if (!isLocal) {
      // Smooth Linear Interpolation (LERP) & dead reckoning for remote players
      if (this.targetX !== undefined && this.targetY !== undefined) {
        const dx = this.targetX - this.state.x;
        const dy = this.targetY - this.state.y;
        const dist = Math.hypot(dx, dy);

        if (dist > 250) {
          // Snap on huge displacement (teleport / spawn)
          this.state.x = this.targetX;
          this.state.y = this.targetY;
        } else {
          // Butter-smooth 60 FPS interpolation
          const lerpFactor = Math.min(1, dt * 18);
          this.state.x += dx * lerpFactor;
          this.state.y += dy * lerpFactor;
        }

        if (this.targetVx !== undefined) {
          this.state.vx += (this.targetVx - this.state.vx) * Math.min(1, dt * 15);
        }
        if (this.targetVy !== undefined) {
          this.state.vy += (this.targetVy - this.state.vy) * Math.min(1, dt * 15);
        }
      }
      return;
    }
      // Apply Gravity
      const gravity = 1200;
      this.state.vy += gravity * dt;

      // Apply Friction
      this.state.vx *= Math.pow(0.85, dt * 60);

      // Update Position
      this.state.x += this.state.vx * dt;
      this.state.y += this.state.vy * dt;

      // Map Horizontal Limits
      const widthMargin = 20;
      if (this.state.x < widthMargin) {
        this.state.x = widthMargin;
        this.state.vx = 0;
      } else if (this.state.x > MAP_BOUNDS.width - widthMargin) {
        this.state.x = MAP_BOUNDS.width - widthMargin;
        this.state.vx = 0;
      }

      // Platform Collisions (Solid one-way top collisions)
      let landed = false;
      const playerFeet = this.state.y + 28;
      const playerWidth = 24;

      // Check main ground
      if (playerFeet >= MAP_BOUNDS.groundY) {
        this.state.y = MAP_BOUNDS.groundY - 28;
        this.state.vy = 0;
        landed = true;
      } else {
        // Check elevated platforms (Lini I, Lini II, Lini III, ESG Center, Crumbling)
        for (const plat of platforms) {
          // Skip if platform is currently crumbled / fallen
          if (plat.isCrumbling && plat.crumbleState === 'crumbled') {
            continue;
          }

          const isHorizontallyAligned =
            this.state.x + playerWidth / 2 >= plat.x &&
            this.state.x - playerWidth / 2 <= plat.x + plat.w;

          if (isHorizontallyAligned) {
            const prevFeet = playerFeet - this.state.vy * dt;
            const isLandingFromAbove =
              this.state.vy >= 0 &&
              prevFeet <= plat.y + 12 &&
              playerFeet >= plat.y - 4 &&
              playerFeet <= plat.y + plat.h + 12;
            const isWalkingOnPlatform = this.state.isGrounded && Math.abs(playerFeet - plat.y) <= 10;

            if (isLandingFromAbove || isWalkingOnPlatform) {
              this.state.y = plat.y - 28;
              this.state.vy = 0;
              landed = true;
              break;
            }
          }
        }
      }

      this.state.isGrounded = landed;
      if (landed) {
        this.state.isDoubleJumping = false;
      }
  }

  public moveLeft() {
    if (this.state.isKO) return;
    this.state.vx = -320;
    this.state.facing = 'left';
  }

  public moveRight() {
    if (this.state.isKO) return;
    this.state.vx = 320;
    this.state.facing = 'right';
  }

  public jump() {
    if (this.state.isKO) return;

    if (this.state.isGrounded) {
      this.state.vy = -560;
      this.state.isGrounded = false;
      if (!this.state.isBot) soundEngine.playJump();
    } else if (!this.state.isDoubleJumping) {
      // Double Jump execution
      this.state.vy = -500;
      this.state.isDoubleJumping = true;
      if (!this.state.isBot) soundEngine.playJump();
    }
  }

  public attack(): { type: WeaponType; x: number; y: number; facing: 'left' | 'right'; damage: number; knockback: number; range: number } | null {
    if (this.state.isKO || this.state.attackTimer > 0) return null;

    const config = WEAPON_CONFIGS[this.state.activeWeapon];
    this.state.isAttacking = true;
    this.state.attackType = this.state.activeWeapon;
    this.state.attackTimer = config.cooldown;

    if (!this.state.isBot) soundEngine.playAttack(this.state.activeWeapon);

    if (this.state.activeWeapon === 'esg_shield') {
      this.state.shieldActive = true;
      this.state.shieldTimer = 3.0;
    }

    if (this.state.activeWeaponAmmo !== Infinity) {
      this.state.activeWeaponAmmo -= 1;
      if (this.state.activeWeaponAmmo <= 0) {
        this.state.activeWeapon = 'fists';
        this.state.activeWeaponAmmo = Infinity;
      }
    }

    return {
      type: this.state.attackType,
      x: this.state.x + (this.state.facing === 'right' ? 30 : -30),
      y: this.state.y - 10,
      facing: this.state.facing,
      damage: config.damage,
      knockback: config.knockback,
      range: config.range,
    };
  }

  public takeDamageAndKnockback(
    damage: number,
    knockbackForce: number,
    attackerPositionX: number,
    attackerName: string,
    onKOCallback?: (victimName: string, killerName: string) => void
  ) {
    if (this.state.isKO || this.state.invulnerableTimer > 0) return false;

    // Apply shield mitigation
    if (this.state.shieldActive) {
      damage = Math.floor(damage * 0.3);
      knockbackForce = Math.floor(knockbackForce * 0.4);
    }

    this.state.hp -= damage;
    this.state.hitFlashTimer = 0.35; // Red flash
    if (!this.state.isBot) soundEngine.playHit();

    // Directional knockback impulse & tilt angle
    const direction = this.state.x >= attackerPositionX ? 1 : -1;
    this.state.tiltAngle = direction * 0.45; // Lean backwards on knockback
    this.state.vx += direction * knockbackForce;
    this.state.vy -= Math.abs(knockbackForce) * 0.5;

    if (this.state.hp <= 0) {
      this.state.hp = 0;
      this.state.isKO = true;
      this.state.koTimer = 3.5; // 3.5s KO delay before respawn
      if (onKOCallback) onKOCallback(this.state.name, attackerName);
    }

    return true;
  }

  public equipWeapon(weaponType: WeaponType, ammo: number) {
    this.state.activeWeapon = weaponType;
    this.state.activeWeaponAmmo = ammo;
  }

  public calculateTotalScore(): number {
    this.state.score = this.state.knowledgeScore + this.state.koCount * 30 + this.state.esgScore;
    return this.state.score;
  }

  public static drawPlayerSprite(ctx: CanvasRenderingContext2D, p: PlayerState, isLocal: boolean) {
    if (p.isKO) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.globalAlpha = 0.6;
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('⚡ K.O.', 0, 0);
      ctx.restore();
      return;
    }

    ctx.save();
    ctx.translate(p.x, p.y);

    // Apply Knockback Tilt Rotation
    if (p.tiltAngle) {
      ctx.rotate(p.tiltAngle);
    }

    // LOCAL PLAYER HIGHLIGHT & BEACON (Ground Spotlight Ring & Glowing Outline Aura)
    if (isLocal) {
      const pulse = (Math.sin(Date.now() / 150) + 1) / 2; // 0..1 pulse

      // 1. Pulsing Ground Spotlight Ring under feet
      ctx.save();
      ctx.translate(0, 18);
      ctx.scale(1, 0.4); // Oval perspective ring
      ctx.fillStyle = `rgba(134, 239, 172, ${0.2 + pulse * 0.2})`;
      ctx.beginPath();
      ctx.arc(0, 0, 32 + pulse * 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, 26 + pulse * 4, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = '#86efac';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.arc(0, 0, 34 + pulse * 2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // 2. Character Body Glow Halo
      ctx.save();
      ctx.shadowColor = '#86efac';
      ctx.shadowBlur = 12 + pulse * 8;
      ctx.strokeStyle = '#86efac';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, -12, 28, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Invulnerable Spawn Shield Halo
    if (p.isInvulnerable) {
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, -10, 30, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Active Shield Skill Aura
    if (p.shieldActive) {
      ctx.fillStyle = 'rgba(134, 239, 172, 0.25)';
      ctx.beginPath();
      ctx.arc(0, -10, 34, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#86efac';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    const isFacingLeft = p.facing === 'left';
    const walkCycle = p.walkCycleTime || 0;
    const bodyBob = Math.abs(Math.sin(walkCycle)) * 3;
    const legSwing = Math.sin(walkCycle) * 8;
    const dir = isFacingLeft ? -1 : 1;
    const isHit = !!(p.hitFlashTimer && p.hitFlashTimer > 0);

    const avatar = p.avatar || createDefaultAvatar(0);
    const primaryColor = isHit ? '#ef4444' : (avatar.primaryColor || '#16a34a');
    const skinColor = isHit ? '#fca5a5' : (avatar.skinColor || '#fde047');
    const hairColor = avatar.hairColor || '#27272a';

    // 1. FOOTWEAR (Animated Walk Legs & Shoes)
    const fType = avatar.footwear || 'safety_boots';
    const leftLegX = -12 - legSwing * 0.5;
    const rightLegX = 3 + legSwing * 0.5;

    if (fType === 'safety_boots') {
      // Steel-toe Safety Boots
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(leftLegX, 10, 9, 8);
      ctx.fillRect(rightLegX, 10, 9, 8);
      // Steel/Yellow Toe Cap
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(isFacingLeft ? leftLegX : leftLegX + 5, 14, 4, 4);
      ctx.fillRect(isFacingLeft ? rightLegX : rightLegX + 5, 14, 4, 4);
      // Sole
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(leftLegX - 1, 17, 11, 2);
      ctx.fillRect(rightLegX - 1, 17, 11, 2);
    } else if (fType === 'agility_shoes') {
      // Sleek Blue/White Athletic Shoes
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(leftLegX, 10, 9, 8);
      ctx.fillRect(rightLegX, 10, 9, 8);
      // White Stripe
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(leftLegX + 1, 13, 7, 2);
      ctx.fillRect(rightLegX + 1, 13, 7, 2);
      // Thick Cushion Sole
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(leftLegX - 1, 17, 11, 2);
      ctx.fillRect(rightLegX - 1, 17, 11, 2);
    } else if (fType === 'steel_boots') {
      // Heavy Steel Armor Boots
      ctx.fillStyle = '#334155';
      ctx.fillRect(leftLegX - 1, 9, 11, 9);
      ctx.fillRect(rightLegX - 1, 9, 11, 9);
      // Silver Shin Guards
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(leftLegX, 10, 9, 4);
      ctx.fillRect(rightLegX, 10, 9, 4);
      // Sole
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(leftLegX - 2, 17, 13, 2);
      ctx.fillRect(rightLegX - 2, 17, 13, 2);
    }

    // 2. BODY OUTFIT (With walking body bob)
    const oType = avatar.outfit || 'pkt_uniform';
    ctx.fillStyle = primaryColor;
    ctx.fillRect(-12, -18 - bodyBob, 24, 28);

    if (!isHit) {
      if (oType === 'pkt_uniform') {
        // PKT Werpak Operational Vest + Reflective Stripes + Badge
        // Hi-Vis Yellow Vest
        ctx.fillStyle = '#eab308';
        ctx.fillRect(-11, -16 - bodyBob, 22, 18);
        // Silver Reflective Band
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(-11, -10 - bodyBob, 22, 3);
        ctx.fillRect(-11, -4 - bodyBob, 22, 3);
        // PKT Logo Emblem Badge
        ctx.fillStyle = '#15803d';
        ctx.fillRect(dir > 0 ? -9 : 4, -14 - bodyBob, 5, 4);
      } else if (oType === 'esg_suit') {
        // ESG Green Suit + White Collared Shirt + Leaf Tie
        // White V-Shirt
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(-6, -18 - bodyBob);
        ctx.lineTo(6, -18 - bodyBob);
        ctx.lineTo(0, -6 - bodyBob);
        ctx.closePath();
        ctx.fill();
        // Emerald Leaf Tie
        ctx.fillStyle = '#10b981';
        ctx.fillRect(-1.5, -16 - bodyBob, 3, 12);
        // Lapel Folds
        ctx.fillStyle = '#047857';
        ctx.fillRect(-12, -18 - bodyBob, 5, 16);
        ctx.fillRect(7, -18 - bodyBob, 5, 16);
      } else if (oType === 'audit_blazer') {
        // Professional Navy Blazer + White Shirt + Crimson Tie + ID Card
        // White Shirt
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.moveTo(-5, -18 - bodyBob);
        ctx.lineTo(5, -18 - bodyBob);
        ctx.lineTo(0, -8 - bodyBob);
        ctx.closePath();
        ctx.fill();
        // Crimson Audit Tie
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(-1.5, -16 - bodyBob, 3, 10);
        // Lanyard ID Card
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(dir > 0 ? 3 : -8, -6 - bodyBob, 5, 6);
      } else if (oType === 'executive_suit') {
        // Executive Suit + Gold Tie + Pocket Square
        // White Dress Shirt
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(-6, -18 - bodyBob);
        ctx.lineTo(6, -18 - bodyBob);
        ctx.lineTo(0, -7 - bodyBob);
        ctx.closePath();
        ctx.fill();
        // Executive Gold Silk Tie
        ctx.fillStyle = '#facc15';
        ctx.fillRect(-2, -16 - bodyBob, 4, 12);
        // Suit Gold Buttons
        ctx.fillStyle = '#eab308';
        ctx.fillRect(-1, -2 - bodyBob, 2, 2);
        ctx.fillRect(-1, 3 - bodyBob, 2, 2);
        // Pocket Square
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(dir > 0 ? -9 : 5, -14 - bodyBob, 4, 2);
      }
    }

    // 3. HEAD & FACE / SKIN
    const faceShape = avatar.faceShape || 'oval';
    ctx.fillStyle = skinColor;

    if (faceShape === 'round') {
      ctx.beginPath();
      ctx.arc(0, -28 - bodyBob, 13, 0, Math.PI * 2);
      ctx.fill();
    } else if (faceShape === 'square') {
      ctx.beginPath();
      ctx.fillRect(-11, -39 - bodyBob, 22, 22);
      ctx.fill();
    } else {
      // oval (default)
      ctx.beginPath();
      ctx.arc(0, -28 - bodyBob, 12, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. HAIR (Rendered around head before headgear / eyewear)
    const hairStyle = avatar.hairStyle || 'short';
    ctx.fillStyle = hairColor;

    if (hairStyle === 'short') {
      // Short Neat Hair Cap
      ctx.beginPath();
      ctx.arc(0, -30 - bodyBob, 13, Math.PI * 0.8, Math.PI * 2.2);
      ctx.fill();
    } else if (hairStyle === 'spiky') {
      // Spiky Audit Hair
      ctx.beginPath();
      ctx.arc(0, -30 - bodyBob, 12, Math.PI * 0.85, Math.PI * 2.15);
      ctx.fill();
      // Spikes
      ctx.beginPath();
      ctx.moveTo(-10, -36 - bodyBob);
      ctx.lineTo(-12, -43 - bodyBob);
      ctx.lineTo(-5, -39 - bodyBob);
      ctx.lineTo(0, -45 - bodyBob);
      ctx.lineTo(5, -39 - bodyBob);
      ctx.lineTo(12, -43 - bodyBob);
      ctx.lineTo(10, -36 - bodyBob);
      ctx.closePath();
      ctx.fill();
    } else if (hairStyle === 'bun') {
      // Hair Cap + Back Bun
      ctx.beginPath();
      ctx.arc(0, -30 - bodyBob, 12.5, Math.PI * 0.7, Math.PI * 2.3);
      ctx.fill();
      // Hair Bun
      ctx.beginPath();
      ctx.arc(dir * -10, -38 - bodyBob, 5, 0, Math.PI * 2);
      ctx.fill();
    } else if (hairStyle === 'curly') {
      // Textured Curly Hair Loops
      const curls = [
        { x: -10, y: -32 },
        { x: -8, y: -38 },
        { x: -2, y: -41 },
        { x: 4, y: -41 },
        { x: 10, y: -38 },
        { x: 11, y: -32 },
      ];
      curls.forEach((c) => {
        ctx.beginPath();
        ctx.arc(c.x, c.y - bodyBob, 4.5, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // EYES
    ctx.fillStyle = '#000000';
    const eyeX = isFacingLeft ? -4 : 4;
    ctx.fillRect(eyeX - 1, -30 - bodyBob, 3, 3);

    // 5. EYEWEAR
    const eType = avatar.eyewear || 'none';
    if (eType === 'safety_goggles') {
      // Translucent Blue Safety Goggles
      ctx.fillStyle = 'rgba(56, 189, 248, 0.85)';
      ctx.fillRect(isFacingLeft ? -11 : -3, -33 - bodyBob, 14, 6);
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(isFacingLeft ? -11 : -3, -33 - bodyBob, 14, 6);
      // Strap
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-12, -32 - bodyBob, 24, 2);
    } else if (eType === 'ar_glasses') {
      // Cyber AR Visor HUD
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(isFacingLeft ? -12 : -2, -33 - bodyBob, 14, 4);
      ctx.fillStyle = '#a5f3fc';
      ctx.fillRect(isFacingLeft ? -10 : 0, -32 - bodyBob, 4, 2);
    } else if (eType === 'monocle') {
      // Gold Monocle
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(eyeX, -29 - bodyBob, 4, 0, Math.PI * 2);
      ctx.stroke();
      // Fine Chain
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(eyeX, -25 - bodyBob);
      ctx.lineTo(eyeX + dir * 4, -18 - bodyBob);
      ctx.stroke();
    }

    // 6. HEADGEAR
    const hType = avatar.headgear || 'helmet_yellow';
    if (hType === 'helmet_yellow' || hType === 'helmet_red' || hType === 'helmet_white') {
      const hColor = hType === 'helmet_yellow' ? '#facc15' : hType === 'helmet_red' ? '#ef4444' : '#ffffff';
      ctx.fillStyle = hColor;
      ctx.beginPath();
      ctx.arc(0, -32 - bodyBob, 14, Math.PI, 0);
      ctx.fill();
      ctx.fillRect(-16, -32 - bodyBob, 32, 4);
      // Hardhat Emblem / Lamp
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(dir > 0 ? 6 : -10, -38 - bodyBob, 4, 4);
    } else if (hType === 'risk_hat') {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-16, -34 - bodyBob, 32, 5);
      ctx.fillRect(-10, -42 - bodyBob, 20, 9);
      // Gold Auditor Badge
      ctx.fillStyle = '#facc15';
      ctx.fillRect(-2, -40 - bodyBob, 4, 4);
    } else if (hType === 'ai_visor') {
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(isFacingLeft ? -12 : -2, -36 - bodyBob, 14, 6);
      ctx.fillStyle = '#a5f3fc';
      ctx.fillRect(isFacingLeft ? -10 : 0, -35 - bodyBob, 4, 2);
    }

    // Unique Held Weapon Rendering
    if (p.activeWeapon && p.activeWeapon !== 'fists') {
      ctx.save();
      const dir = isFacingLeft ? -1 : 1;
      ctx.translate(dir * 12, -10 - bodyBob);

      if (p.activeWeapon === 'beam_rifle') {
        // Laser Rifle Barrel
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(dir > 0 ? 0 : -18, -4, 18, 6);
        ctx.fillStyle = '#93c5fd';
        ctx.fillRect(dir > 0 ? 18 : -22, -3, 4, 4);
      } else if (p.activeWeapon === 'risk_hammer') {
        // Heavy Audit Mallet
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(dir > 0 ? 0 : -14, -14, 4, 20);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(dir > 0 ? -4 : -18, -18, 20, 10);
      } else if (p.activeWeapon === 'esg_shield') {
        // ESG Plasma Aegis
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(dir * 4, 0, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#a7f3d0';
        ctx.lineWidth = 2;
        ctx.stroke();
      } else if (p.activeWeapon === 'compliance_sword') {
        // Glowing Compliance Saber
        ctx.fillStyle = '#8b5cf6';
        ctx.fillRect(dir > 0 ? 0 : -22, -12, 22, 4);
        ctx.fillStyle = '#c084fc';
        ctx.fillRect(dir > 0 ? 22 : -24, -12, 2, 4);
      } else if (p.activeWeapon === 'decarb_blaster') {
        // Decarb Plasma Blaster
        ctx.fillStyle = '#06b6d4';
        ctx.beginPath();
        ctx.arc(dir * 8, -2, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#a5f3fc';
        ctx.fillRect(dir > 0 ? 8 : -14, -3, 6, 2);
      }

      ctx.restore();
    }

    // Attack Slash Effect
    if (p.isAttacking) {
      const dir = isFacingLeft ? -1 : 1;
      ctx.fillStyle = WEAPON_CONFIGS[p.activeWeapon]?.color || '#facc15';
      ctx.beginPath();
      ctx.arc(dir * 28, -10 - bodyBob, 18, 0, Math.PI * 2);
      ctx.fill();
    }

    // Name & HP Bar Overlay
    const hpPercent = Math.max(0, Math.min(100, (p.hp / p.maxHp) * 100));

    // Name Tag
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = isLocal ? '#86efac' : '#ffffff';
    ctx.fillText(p.name, 0, -48 - bodyBob);

    // HP Bar
    ctx.fillStyle = '#080d0a';
    ctx.fillRect(-20, -44 - bodyBob, 40, 5);
    ctx.fillStyle = hpPercent > 40 ? '#22c55e' : '#ef4444';
    ctx.fillRect(-20, -44 - bodyBob, 40 * (hpPercent / 100), 5);
    ctx.strokeStyle = '#2d4d3e';
    ctx.lineWidth = 1;
    ctx.strokeRect(-20, -44 - bodyBob, 40, 5);

    // "ANDA" Beacon Badge & Bouncing Indicator Arrow
    if (isLocal) {
      const bounce = Math.sin(Date.now() / 120) * 4; // Up and down bounce
      const beaconY = -56 - bodyBob + bounce;

      // Glowing Badge Background
      ctx.fillStyle = '#facc15';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      ctx.fillRect(-22, beaconY - 14, 44, 13);
      ctx.strokeRect(-22, beaconY - 14, 44, 13);

      // "ANDA" Text
      ctx.fillStyle = '#000000';
      ctx.font = 'black 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('▼ ANDA', 0, beaconY - 4);

      // Downward Pointer Arrow
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.moveTo(-6, beaconY - 1);
      ctx.lineTo(6, beaconY - 1);
      ctx.lineTo(0, beaconY + 6);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }

  public respawn() {
    const randomSpawn = SPAWN_NODES[Math.floor(Math.random() * SPAWN_NODES.length)];
    this.state.x = randomSpawn.x;
    this.state.y = randomSpawn.y;
    this.state.vx = 0;
    this.state.vy = 0;
    this.state.hp = this.state.maxHp;
    this.state.isKO = false;
    this.state.invulnerableTimer = 2.0; // 2s spawn invulnerability
    this.state.activeWeapon = 'fists';
    this.state.activeWeaponAmmo = Infinity;
  }
}

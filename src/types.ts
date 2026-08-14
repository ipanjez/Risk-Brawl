export type HeadgearType = 'helmet_yellow' | 'helmet_red' | 'helmet_white' | 'risk_hat' | 'ai_visor' | 'none';
export type EyewearType = 'safety_goggles' | 'monocle' | 'ar_glasses' | 'none';
export type FootwearType = 'safety_boots' | 'agility_shoes' | 'steel_boots';
export type OutfitType = 'pkt_uniform' | 'esg_suit' | 'audit_blazer' | 'executive_suit';
export type WeaponType = 'fists' | 'beam_rifle' | 'risk_hammer' | 'esg_shield' | 'compliance_sword' | 'decarb_blaster';

export interface AvatarCustomization {
  headgear: HeadgearType;
  eyewear: EyewearType;
  footwear: FootwearType;
  outfit: OutfitType;
  faceShape: 'oval' | 'round' | 'square';
  hairStyle: 'short' | 'spiky' | 'bun' | 'curly' | 'none';
  hairColor: string;
  skinColor: string;
  primaryColor: string;
}

export interface PlayerState {
  id: string;
  name: string;
  isBot: boolean;
  isHost: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  hp: number;
  maxHp: number;
  score: number;
  knowledgeScore: number;
  koCount: number;
  esgScore: number;
  facing: 'left' | 'right';
  isGrounded: boolean;
  isDoubleJumping: boolean;
  isAttacking: boolean;
  attackType: WeaponType | null;
  attackTimer: number;
  isInvulnerable: boolean;
  invulnerableTimer: number;
  isKO: boolean;
  koTimer: number;
  activeWeapon: WeaponType;
  activeWeaponAmmo: number;
  avatar: AvatarCustomization;
  currentQuizId: number | null;
  shieldActive: boolean;
  shieldTimer: number;
  walkCycleTime?: number;
  hitFlashTimer?: number;
  tiltAngle?: number;
}

export interface QuizQuestion {
  id: number;
  nodeId?: string;
  category: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface EcoTokenState {
  id: string;
  x: number;
  y: number;
  isCollected: boolean;
  respawnTimer: number;
}

export interface KnowledgeNodeState {
  id: string;
  x: number;
  y: number;
  label: string;
  isBusy: boolean;
}

export interface WeaponPowerUpState {
  id: string;
  type: WeaponType;
  x: number;
  y: number;
  ammo: number;
  isCollected: boolean;
}

export interface KillfeedEntry {
  id: string;
  text: string;
  timestamp: number;
  type: 'ko' | 'weapon' | 'quiz' | 'esg' | 'system';
}

export interface FloatingText {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  life: number; // 0 to 1
}

export interface MatchConfig {
  durationMinutes: number; // 5, 10, 15, 30
  maxPlayers: number; // up to 20
  botCount: number; // fill empty slots up to 20
  roomCode: string;
}

export interface GameStatePayload {
  players: PlayerState[];
  ecoTokens: EcoTokenState[];
  knowledgeNodes: KnowledgeNodeState[];
  weaponPowerUps: WeaponPowerUpState[];
  killfeed: KillfeedEntry[];
  matchTimerSeconds: number;
  isMatchActive: boolean;
  isMatchEnded: boolean;
}

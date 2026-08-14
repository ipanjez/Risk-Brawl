export interface MapPlatform {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  isCrumbling?: boolean;
  crumbleState?: 'idle' | 'warning' | 'crumbled';
  crumbleTimer?: number;
  respawnTimer?: number;
}

export interface KnowledgeNodeMap {
  id: string;
  x: number;
  y: number;
  label: string;
}

export type MapLayoutId = 'standard' | 'pyramid' | 'twin_towers' | 'islands';
export type MapThemeId = 'industrial_green' | 'cyberpunk_2060' | 'eco_marine' | 'sunset_solaris';

export interface MapThemeConfig {
  id: MapThemeId;
  name: string;
  subtitle: string;
  skyColors: [string, string, string];
  groundColors: [string, string];
  platformBody: string;
  platformTrim: string;
  hazardLine: string;
  pipeColor: string;
  crumbleWarning: string;
  accentColor: string;
  labelColor: string;
  particleColor: string;
}

export const MAP_THEMES: Record<MapThemeId, MapThemeConfig> = {
  industrial_green: {
    id: 'industrial_green',
    name: 'Petrokimia Hijau Klasik',
    subtitle: 'Suasana Pabrik Amoniak & Urea PKT Standar',
    skyColors: ['#1a2e24', '#0c1410', '#080d0a'],
    groundColors: ['#1a2e24', '#080d0a'],
    platformBody: '#2d4d3e',
    platformTrim: '#86efac',
    hazardLine: '#2d4d3e',
    pipeColor: '#2d4d3e',
    crumbleWarning: '#f59e0b',
    accentColor: '#86efac',
    labelColor: '#86efac',
    particleColor: 'rgba(134, 239, 172, 0.15)',
  },
  cyberpunk_2060: {
    id: 'cyberpunk_2060',
    name: 'Cyberpunk Net-Zero 2060',
    subtitle: 'Masa Depan Dekarbonisasi Neon & AI Grid',
    skyColors: ['#240d3a', '#110620', '#060210'],
    groundColors: ['#240d3a', '#060210'],
    platformBody: '#1e1b4b',
    platformTrim: '#38bdf8',
    hazardLine: '#a855f7',
    pipeColor: '#6366f1',
    crumbleWarning: '#ec4899',
    accentColor: '#38bdf8',
    labelColor: '#38bdf8',
    particleColor: 'rgba(56, 189, 248, 0.2)',
  },
  eco_marine: {
    id: 'eco_marine',
    name: 'Eco-Marine Pesisir Bontang',
    subtitle: 'Konservasi Terumbu Karang & Samudera Pesisir',
    skyColors: ['#082f49', '#0c4a6e', '#02182b'],
    groundColors: ['#0c4a6e', '#02182b'],
    platformBody: '#134e4a',
    platformTrim: '#2dd4bf',
    hazardLine: '#0e7490',
    pipeColor: '#0e7490',
    crumbleWarning: '#f97316',
    accentColor: '#2dd4bf',
    labelColor: '#2dd4bf',
    particleColor: 'rgba(45, 212, 191, 0.2)',
  },
  sunset_solaris: {
    id: 'sunset_solaris',
    name: 'Sunset Solaris Decarb',
    subtitle: 'Senja Emas PLTS Atap & Energi Terbarukan',
    skyColors: ['#451a03', '#2a0e02', '#0f0500'],
    groundColors: ['#451a03', '#0f0500'],
    platformBody: '#431407',
    platformTrim: '#fb923c',
    hazardLine: '#c2410c',
    pipeColor: '#b45309',
    crumbleWarning: '#ef4444',
    accentColor: '#facc15',
    labelColor: '#facc15',
    particleColor: 'rgba(251, 146, 60, 0.2)',
  },
};

export const MAP_LAYOUTS: Record<
  MapLayoutId,
  {
    name: string;
    description: string;
    platforms: MapPlatform[];
    nodes: KnowledgeNodeMap[];
  }
> = {
  standard: {
    name: 'Standard 3-Tier Lini',
    description: 'Tata letak bertingkat klasik Lini I, II, III & Puncak ESG dengan 2 jembatan kerapuhan (crumbling)',
    platforms: [
      { id: 'p_std_1', x: 100, y: 520, w: 220, h: 18, label: 'Lini I — Pabrik Urea 5' },
      { id: 'p_std_2', x: 380, y: 380, w: 240, h: 18, label: 'Lini II — Manajemen Risiko' },
      { id: 'p_std_3', x: 660, y: 380, w: 240, h: 18, label: 'Lini II — Kompartemen Tata Kelola' },
      { id: 'p_std_4', x: 960, y: 520, w: 220, h: 18, label: 'Lini I — Amoniak 1B' },
      { id: 'p_std_5', x: 220, y: 240, w: 200, h: 18, label: 'Lini III — Komite Audit' },
      { id: 'p_std_6', x: 860, y: 240, w: 200, h: 18, label: 'Lini III — Dewan Komisaris' },
      { id: 'p_std_7', x: 520, y: 200, w: 240, h: 18, label: 'Pusat Pengendalian ESG Net-Zero' },
      // Crumbling Bridge Platforms (Injak Sebentar Hilang!)
      { id: 'p_std_c1', x: 250, y: 390, w: 110, h: 16, label: '⚠️ Jembatan Kerapuhan Barat', isCrumbling: true },
      { id: 'p_std_c2', x: 920, y: 390, w: 110, h: 16, label: '⚠️ Jembatan Kerapuhan Timur', isCrumbling: true },
    ],
    nodes: [
      { id: 'node_1', x: 220, y: 480, label: 'Risk Based Thinking' },
      { id: 'node_2', x: 500, y: 340, label: 'Risk Mitigation' },
      { id: 'node_3', x: 780, y: 340, label: 'Tata Kelola & SMAP' },
      { id: 'node_4', x: 1060, y: 480, label: 'Audit & Siber' },
      { id: 'node_5', x: 640, y: 160, label: 'ESG Decarbonization' },
      { id: 'node_6', x: 300, y: 200, label: 'AI & Implementasi Kerja' },
      { id: 'node_7', x: 960, y: 200, label: 'EcoMove & Lingkungan PKT' },
    ],
  },
  pyramid: {
    name: 'Piramida Bertingkat',
    description: 'Arena simetris piramida dengan tangga kerapuhan & panggung puncak ESG yang megah',
    platforms: [
      { id: 'p_pyr_1', x: 80, y: 530, w: 200, h: 18, label: 'Lini I — Sayap Barat' },
      { id: 'p_pyr_2', x: 1000, y: 530, w: 200, h: 18, label: 'Lini I — Sayap Timur' },
      // Tangga Kerapuhan
      { id: 'p_pyr_c1', x: 250, y: 440, w: 120, h: 16, label: '⚠️ Tangga Transisi Barat', isCrumbling: true },
      { id: 'p_pyr_c2', x: 910, y: 440, w: 120, h: 16, label: '⚠️ Tangga Transisi Timur', isCrumbling: true },
      { id: 'p_pyr_3', x: 360, y: 350, w: 230, h: 18, label: 'Lini II — Teras Manajemen' },
      { id: 'p_pyr_4', x: 690, y: 350, w: 230, h: 18, label: 'Lini II — Teras Kepatuhan' },
      // Jembatan Tengah Kerapuhan
      { id: 'p_pyr_c3', x: 570, y: 350, w: 140, h: 16, label: '⚠️ Jembatan Kristal Tengah', isCrumbling: true },
      { id: 'p_pyr_5', x: 170, y: 250, w: 180, h: 18, label: 'Lini III — Satelit Audit' },
      { id: 'p_pyr_6', x: 930, y: 250, w: 180, h: 18, label: 'Lini III — Satelit Dewan' },
      { id: 'p_pyr_7', x: 470, y: 190, w: 340, h: 18, label: 'Pusat Pengendalian ESG Net-Zero' },
    ],
    nodes: [
      { id: 'node_1', x: 180, y: 490, label: 'Risk Based Thinking' },
      { id: 'node_2', x: 470, y: 310, label: 'Risk Mitigation' },
      { id: 'node_3', x: 810, y: 310, label: 'Tata Kelola & SMAP' },
      { id: 'node_4', x: 1100, y: 490, label: 'Audit & Siber' },
      { id: 'node_5', x: 640, y: 150, label: 'ESG Decarbonization' },
      { id: 'node_6', x: 260, y: 210, label: 'AI & Implementasi Kerja' },
      { id: 'node_7', x: 1020, y: 210, label: 'EcoMove & Lingkungan PKT' },
    ],
  },
  twin_towers: {
    name: 'Menara Kembar (Twin Towers)',
    description: 'Dua menara vertikal tinggi di sisi kiri dan kanan dengan skybridge gantung kerapuhan',
    platforms: [
      { id: 'p_tt_1', x: 100, y: 530, w: 260, h: 18, label: 'Menara Barat — Lt 1 (Lini I)' },
      { id: 'p_tt_2', x: 920, y: 530, w: 260, h: 18, label: 'Menara Timur — Lt 1 (Lini I)' },
      { id: 'p_tt_3', x: 100, y: 370, w: 260, h: 18, label: 'Menara Barat — Lt 2 (Lini II)' },
      { id: 'p_tt_4', x: 920, y: 370, w: 260, h: 18, label: 'Menara Timur — Lt 2 (Lini II)' },
      { id: 'p_tt_5', x: 120, y: 210, w: 220, h: 18, label: 'Menara Barat — Puncak Lini III' },
      { id: 'p_tt_6', x: 940, y: 210, w: 220, h: 18, label: 'Menara Timur — Puncak Lini III' },
      // Skybridges Gantung Kerapuhan
      { id: 'p_tt_c1', x: 440, y: 450, w: 400, h: 16, label: '⚠️ Skybridge Gantung Bawah', isCrumbling: true },
      { id: 'p_tt_7', x: 500, y: 300, w: 280, h: 18, label: 'Pusat Pengendalian ESG Net-Zero' },
      { id: 'p_tt_c2', x: 350, y: 210, w: 140, h: 16, label: '⚠️ Jembatan Angkasa Barat', isCrumbling: true },
      { id: 'p_tt_c3', x: 790, y: 210, w: 140, h: 16, label: '⚠️ Jembatan Angkasa Timur', isCrumbling: true },
    ],
    nodes: [
      { id: 'node_1', x: 230, y: 490, label: 'Risk Based Thinking' },
      { id: 'node_2', x: 230, y: 330, label: 'Risk Mitigation' },
      { id: 'node_3', x: 1050, y: 330, label: 'Tata Kelola & SMAP' },
      { id: 'node_4', x: 1050, y: 490, label: 'Audit & Siber' },
      { id: 'node_5', x: 640, y: 260, label: 'ESG Decarbonization' },
      { id: 'node_6', x: 230, y: 170, label: 'AI & Implementasi Kerja' },
      { id: 'node_7', x: 1050, y: 170, label: 'EcoMove & Lingkungan PKT' },
    ],
  },
  islands: {
    name: 'Kepulauan Mengambang',
    description: 'Platform pulau apung tersebar cepat dan lincah dengan jembatan awan kerapuhan',
    platforms: [
      { id: 'p_isl_1', x: 90, y: 500, w: 200, h: 18, label: 'Pulau Pesisir Barat (Lini I)' },
      { id: 'p_isl_2', x: 990, y: 500, w: 200, h: 18, label: 'Pulau Pesisir Timur (Lini I)' },
      { id: 'p_isl_c1', x: 320, y: 460, w: 130, h: 16, label: '⚠️ Karang Apung Barat', isCrumbling: true },
      { id: 'p_isl_c2', x: 830, y: 460, w: 130, h: 16, label: '⚠️ Karang Apung Timur', isCrumbling: true },
      { id: 'p_isl_3', x: 480, y: 410, w: 320, h: 18, label: 'Pulau Sentral Manajemen' },
      { id: 'p_isl_4', x: 180, y: 300, w: 220, h: 18, label: 'Pulau Melayang Barat' },
      { id: 'p_isl_5', x: 880, y: 300, w: 220, h: 18, label: 'Pulau Melayang Timur' },
      { id: 'p_isl_c3', x: 550, y: 260, w: 180, h: 16, label: '⚠️ Jembatan Awan Tengah', isCrumbling: true },
      { id: 'p_isl_6', x: 520, y: 150, w: 240, h: 18, label: 'Pusat Pengendalian ESG Net-Zero' },
    ],
    nodes: [
      { id: 'node_1', x: 190, y: 460, label: 'Risk Based Thinking' },
      { id: 'node_2', x: 640, y: 370, label: 'Risk Mitigation' },
      { id: 'node_3', x: 990, y: 260, label: 'Tata Kelola & SMAP' },
      { id: 'node_4', x: 1090, y: 460, label: 'Audit & Siber' },
      { id: 'node_5', x: 640, y: 110, label: 'ESG Decarbonization' },
      { id: 'node_6', x: 290, y: 260, label: 'AI & Implementasi Kerja' },
      { id: 'node_7', x: 990, y: 460, label: 'EcoMove & Lingkungan PKT' },
    ],
  },
};

// Legacy exports for backward compatibility
export const INDUSTRIAL_PLATFORMS = MAP_LAYOUTS.standard.platforms;
export const KNOWLEDGE_NODES_MAP = MAP_LAYOUTS.standard.nodes;

export class IndustrialMap {
  public static drawMap(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    time: number,
    platforms: MapPlatform[] = MAP_LAYOUTS.standard.platforms,
    nodes: KnowledgeNodeMap[] = MAP_LAYOUTS.standard.nodes,
    themeId: MapThemeId = 'industrial_green',
    exhaustedNodes?: Set<string>
  ) {
    const theme = MAP_THEMES[themeId] || MAP_THEMES.industrial_green;

    // Background Sky / Atmosphere Gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
    skyGradient.addColorStop(0, theme.skyColors[0]);
    skyGradient.addColorStop(0.5, theme.skyColors[1]);
    skyGradient.addColorStop(1, theme.skyColors[2]);
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, width, height);

    // Dynamic Theme Specific Background Silhouettes
    if (themeId === 'cyberpunk_2060') {
      // Cyberpunk Neon Grid & High-tech Towers
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.15)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 60) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Neon Skyline Silhouettes
      ctx.fillStyle = 'rgba(6, 2, 16, 0.8)';
      ctx.fillRect(40, 140, 90, 500);
      ctx.fillRect(160, 220, 70, 420);
      ctx.fillRect(1040, 160, 80, 480);
      ctx.fillRect(1150, 110, 100, 530);

      // Cyan / Magenta Holo Beams
      ctx.fillStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.fillRect(80, 0, 12, height);
      ctx.fillRect(1190, 0, 16, height);
    } else if (themeId === 'eco_marine') {
      // Marine Light Rays & Coral Silhouettes
      ctx.fillStyle = 'rgba(45, 212, 191, 0.05)';
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(200 + i * 280, 0);
        ctx.lineTo(340 + i * 280, height);
        ctx.lineTo(260 + i * 280, height);
        ctx.lineTo(160 + i * 280, 0);
        ctx.fill();
      }

      // Deep sea coral silhouette
      ctx.fillStyle = 'rgba(2, 24, 43, 0.85)';
      ctx.fillRect(50, 240, 90, 400);
      ctx.fillRect(1100, 220, 110, 420);
    } else if (themeId === 'sunset_solaris') {
      // Sunset Golden Horizon & Solar Matrix
      const sunGrad = ctx.createRadialGradient(width / 2, height - 100, 50, width / 2, height - 100, 450);
      sunGrad.addColorStop(0, 'rgba(251, 146, 60, 0.4)');
      sunGrad.addColorStop(0.5, 'rgba(234, 88, 12, 0.15)');
      sunGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = sunGrad;
      ctx.fillRect(0, 0, width, height);

      // Wind Turbines Silhouettes in background
      ctx.fillStyle = 'rgba(15, 5, 0, 0.85)';
      ctx.fillRect(80, 200, 70, 440);
      ctx.fillRect(1120, 180, 80, 460);
    } else {
      // Classic Industrial Silhouettes (Ammonia & Urea Towers)
      ctx.fillStyle = 'rgba(8, 13, 10, 0.85)';
      // Ammonia Tower 1
      ctx.fillRect(60, 180, 80, 460);
      ctx.beginPath();
      ctx.arc(100, 180, 40, Math.PI, 0);
      ctx.fill();

      // Urea Granulation Tower 2
      ctx.fillRect(1080, 200, 100, 440);
      ctx.beginPath();
      ctx.arc(1130, 200, 50, Math.PI, 0);
      ctx.fill();

      // Industrial Steam Vent Pipes
      ctx.strokeStyle = theme.pipeColor;
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(100, 280);
      ctx.lineTo(400, 280);
      ctx.lineTo(400, 400);
      ctx.lineTo(900, 400);
      ctx.lineTo(900, 280);
      ctx.lineTo(1130, 280);
      ctx.stroke();
    }

    // Atmospheric Floating Energy Particles
    ctx.fillStyle = theme.particleColor;
    for (let i = 0; i < 8; i++) {
      const px = (width * 0.15 + (i * 140) + Math.sin(time * 1.5 + i) * 35) % width;
      const py = (height - 120 - ((time * 30 + i * 45) % (height - 180)));
      ctx.beginPath();
      ctx.arc(px, py, 4 + (i % 4) * 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Main Floor (Ground)
    const groundY = 640;
    const groundGrad = ctx.createLinearGradient(0, groundY, 0, height);
    groundGrad.addColorStop(0, theme.groundColors[0]);
    groundGrad.addColorStop(1, theme.groundColors[1]);
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, groundY, width, height - groundY);

    ctx.strokeStyle = theme.hazardLine;
    ctx.lineWidth = 4;
    ctx.strokeRect(0, groundY, width, 4);

    // Draw Platforms (Solid & Crumbling/Vanishing Platforms)
    for (const plat of platforms) {
      const isCrumbling = !!plat.isCrumbling;
      const state = plat.crumbleState || 'idle';

      // If crumbled/vanished, render transparent respawn phantom and skip solid body
      if (isCrumbling && state === 'crumbled') {
        const respawnProgress = Math.max(0, 1 - (plat.respawnTimer || 0) / 3.5);
        ctx.save();
        ctx.globalAlpha = 0.25 + respawnProgress * 0.25;
        ctx.strokeStyle = '#ef4444';
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1.5;
        ctx.strokeRect(plat.x, plat.y, plat.w, plat.h);

        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`REGENERASI... ${Math.ceil(plat.respawnTimer || 0)}s`, plat.x + plat.w / 2, plat.y + plat.h / 2 + 3);
        ctx.restore();
        continue;
      }

      ctx.save();

      // Crumbling warning shake effect
      let drawX = plat.x;
      let drawY = plat.y;
      if (isCrumbling && state === 'warning') {
        const shake = Math.sin(time * 45) * 3;
        drawX += shake;
      }

      if (isCrumbling) {
        // Crumbling Platform Style
        if (state === 'warning') {
          // Warning blinking state (Stepped on!)
          ctx.fillStyle = '#78350f';
          ctx.fillRect(drawX, drawY, plat.w, plat.h);

          // Pulsing yellow/red hazard warning
          ctx.fillStyle = Math.floor(time * 12) % 2 === 0 ? '#ef4444' : '#f59e0b';
          ctx.fillRect(drawX, drawY, plat.w, 4);

          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(drawX, drawY, plat.w, plat.h);

          // Crumble Countdown Badge
          ctx.fillStyle = '#ef4444';
          ctx.font = 'bold 9px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(`RUNTUH DALAM ${(plat.crumbleTimer || 0).toFixed(1)}s!`, drawX + plat.w / 2, drawY + plat.h + 12);
        } else {
          // Idle Crumbling Platform (Glowing Amber Striped)
          ctx.fillStyle = '#3b200b';
          ctx.fillRect(drawX, drawY, plat.w, plat.h);

          // Striped hazard top trim
          ctx.fillStyle = theme.crumbleWarning;
          ctx.fillRect(drawX, drawY, plat.w, 3.5);

          ctx.strokeStyle = theme.crumbleWarning;
          ctx.lineWidth = 1;
          ctx.setLineDash([6, 3]);
          ctx.strokeRect(drawX, drawY, plat.w, plat.h);
          ctx.setLineDash([]);

          ctx.fillStyle = theme.crumbleWarning;
          ctx.font = '9px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(plat.label, drawX + plat.w / 2, drawY + plat.h + 12);
        }
      } else {
        // Solid Platform Style
        ctx.fillStyle = theme.platformBody;
        ctx.fillRect(drawX, drawY, plat.w, plat.h);

        // Top Safety Trim
        ctx.fillStyle = theme.platformTrim;
        ctx.fillRect(drawX, drawY, plat.w, 3);

        // Platform Name Label
        ctx.fillStyle = theme.labelColor;
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(plat.label, drawX + plat.w / 2, drawY + plat.h + 12);
      }

      ctx.restore();
    }

    // Draw Knowledge Nodes (Floating Quiz Stations)
    for (const node of nodes) {
      const isExhausted = exhaustedNodes ? exhaustedNodes.has(node.id) : false;

      ctx.save();
      ctx.translate(node.x, node.y + (isExhausted ? 0 : Math.sin(time * 3) * 3));

      if (isExhausted) {
        // Dimmed / Exhausted Node Visuals
        ctx.fillStyle = 'rgba(71, 85, 105, 0.15)';
        ctx.beginPath();
        ctx.arc(0, 0, 22, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.moveTo(0, -16);
        ctx.lineTo(16, 0);
        ctx.lineTo(0, 16);
        ctx.lineTo(-16, 0);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('DONE', 0, 3);

        ctx.fillStyle = '#64748b';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(`${node.label} [REDUP]`, 0, -22);
      } else {
        // Active Pulsing Node Visuals
        ctx.fillStyle = 'rgba(250, 204, 21, 0.2)';
        ctx.beginPath();
        ctx.arc(0, 0, 26 + Math.sin(time * 5) * 4, 0, Math.PI * 2);
        ctx.fill();

        // Node Gold / ESG Diamond Icon
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.moveTo(0, -18);
        ctx.lineTo(18, 0);
        ctx.lineTo(0, 18);
        ctx.lineTo(-18, 0);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#000000';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('ESG', 0, 4);

        ctx.fillStyle = theme.accentColor;
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, 0, -24);
      }

      ctx.restore();
    }
  }
}

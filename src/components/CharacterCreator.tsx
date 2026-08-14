import React, { useRef, useEffect, useState } from 'react';
import { AvatarCustomization, HeadgearType, EyewearType, FootwearType, OutfitType } from '../types';
import { Player2D } from '../game/Player2D';
import { Shield, Sparkles, User, Palette, HardHat, AlertCircle, Wifi, Copy, Check, Smartphone, Laptop, Crown } from 'lucide-react';

interface CharacterCreatorProps {
  name: string;
  setName: (name: string) => void;
  avatar: AvatarCustomization;
  setAvatar: React.Dispatch<React.SetStateAction<AvatarCustomization>>;
  onStartGame: () => void;
  roomState?: { isGameStarted: boolean; startTime: number | null; players: {name: string, isActive: boolean}[] } | null;
}

export const CharacterCreator: React.FC<CharacterCreatorProps> = ({
  name,
  setName,
  avatar,
  setAvatar,
  onStartGame,
  roomState,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [error, setError] = useState<string>('');
  const [serverInfo, setServerInfo] = useState<{ ip: string; port: number; url: string } | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Fetch Server Network IP
  useEffect(() => {
    fetch('/api/server-info')
      .then((res) => res.json())
      .then((data) => setServerInfo(data))
      .catch(() => {
        // Fallback default
        setServerInfo({ ip: '10.127.30.151', port: 3000, url: 'http://10.127.30.151:3000' });
      });
  }, []);

  const handleCopyUrl = () => {
    const targetUrl = serverInfo?.url || `http://${window.location.hostname}:3000`;
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleProceed = () => {
    if (!name || !name.trim()) {
      setError('Wajib mengisi Nama Peserta / Kode Pegawai sebelum melanjutkan!');
      return;
    }
    // Save to localStorage
    try {
      localStorage.setItem('pkt_player_name', name.trim());
      localStorage.setItem('pkt_player_avatar', JSON.stringify(avatar));
    } catch (e) {}

    setError('');
    onStartGame();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background spotlight
    const grad = ctx.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      10,
      canvas.width / 2,
      canvas.height / 2,
      120
    );
    grad.addColorStop(0, '#10b98122');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render Preview Avatar
    const dummyPlayerState = {
      id: 'preview',
      name: name || 'Auditor PKT',
      isBot: false,
      isHost: true,
      x: canvas.width / 2,
      y: canvas.height / 2 + 10,
      vx: 0,
      vy: 0,
      hp: 100,
      maxHp: 100,
      score: 0,
      knowledgeScore: 0,
      koCount: 0,
      esgScore: 0,
      facing: 'right' as const,
      isGrounded: true,
      isDoubleJumping: false,
      isAttacking: false,
      attackType: null,
      attackTimer: 0,
      isInvulnerable: false,
      invulnerableTimer: 0,
      isKO: false,
      koTimer: 0,
      activeWeapon: 'fists' as const,
      activeWeaponAmmo: Infinity,
      avatar,
      currentQuizId: null,
      shieldActive: false,
      shieldTimer: 0,
    };

    ctx.save();
    ctx.scale(1.8, 1.8);
    ctx.translate(-canvas.width / 4, -canvas.height / 4 + 10);
    Player2D.drawPlayerSprite(ctx, dummyPlayerState, true);
    ctx.restore();
  }, [avatar, name]);

  const headgears: { id: HeadgearType; label: string }[] = [
    { id: 'helmet_yellow', label: 'Safety Helmet (Yellow)' },
    { id: 'helmet_red', label: 'Safety Helmet (Red)' },
    { id: 'helmet_white', label: 'Executive Helmet (White)' },
    { id: 'risk_hat', label: 'Risk Auditor Hat' },
    { id: 'ai_visor', label: 'Optik Visor K3' },
    { id: 'none', label: 'None' },
  ];

  const eyewears: { id: EyewearType; label: string }[] = [
    { id: 'safety_goggles', label: 'Safety Goggles' },
    { id: 'ar_glasses', label: 'AR Glasses' },
    { id: 'monocle', label: 'Audit Monocle' },
    { id: 'none', label: 'None' },
  ];

  const footwears: { id: FootwearType; label: string }[] = [
    { id: 'safety_boots', label: 'Safety Boots (Steel)' },
    { id: 'agility_shoes', label: 'Agility Shoes' },
    { id: 'steel_boots', label: 'Heavy Steel Boots' },
  ];

  const outfits: { id: OutfitType; label: string }[] = [
    { id: 'pkt_uniform', label: 'PKT Operational Uniform' },
    { id: 'esg_suit', label: 'ESG Green Suit' },
    { id: 'audit_blazer', label: 'Audit Committee Blazer' },
    { id: 'executive_suit', label: 'Executive Suit' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto bg-[#1a2e24] border border-[#2d4d3e] rounded-2xl p-4 sm:p-6 shadow-2xl text-white font-sans max-h-[92vh] overflow-y-auto custom-scrollbar">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2d4d3e] pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 sm:p-3 bg-[#2d4d3e] rounded-xl border border-[#86efac]/40 text-[#86efac] shrink-0">
            <HardHat className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#86efac] font-mono font-bold">
              Session Profile & Setup
            </span>
            <h2 className="text-base sm:text-xl font-bold tracking-wide text-white">
              Kustomisasi Karakter Pegawai PKT
            </h2>
          </div>
        </div>

        {/* LAN / Wi-Fi IP Badge */}
        {serverInfo && (
          <div className="bg-[#0c1410] border border-[#86efac]/40 rounded-xl px-3 py-2 flex items-center justify-between sm:justify-start gap-2 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-slate-300 min-w-0">
              <Wifi className="w-4 h-4 text-[#86efac] shrink-0" />
              <span className="text-[11px] truncate">
                <span className="text-slate-400">IP Mabar: </span>
                <strong className="text-[#facc15]">{serverInfo.url}</strong>
              </span>
            </div>
            <button
              onClick={handleCopyUrl}
              className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition flex items-center gap-1 cursor-pointer shrink-0 ${
                copied
                  ? 'bg-emerald-500 text-black'
                  : 'bg-[#1f382b] hover:bg-[#2d4d3e] text-[#86efac] border border-[#86efac]/40'
              }`}
              title="Salin tautan untuk peserta lain di Wi-Fi yang sama"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Tersalin!' : 'Salin'}
            </button>
          </div>
        )}
      </div>

      {roomState?.isGameStarted && (
        <div className="bg-red-500/15 border border-red-500/60 rounded-xl p-3.5 sm:p-4 mb-4 animate-pulse shadow-lg shadow-red-500/10">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span className="text-red-400 font-extrabold font-mono text-xs sm:text-sm uppercase tracking-wide">
              Pertandingan Sedang Berlangsung (Live Match)
            </span>
          </div>
          <p className="text-xs text-red-200/90 mb-2 leading-relaxed">
            Sesi sudah dimulai oleh Host. Anda dapat langsung <b>menyusul masuk</b> ke arena untuk mengejar poin & mengumpulkan token ESG!
          </p>
          {roomState.players.length > 0 && (
            <div className="bg-black/50 rounded-lg p-2 border border-red-500/30">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block mb-1 font-mono">Peserta Aktif:</span>
              <div className="flex flex-wrap gap-1.5">
                {roomState.players.map((p, i) => (
                  <span key={i} className={`text-[10px] px-2 py-0.5 rounded border font-mono ${p.isActive ? 'bg-green-500/20 border-green-500/50 text-green-300' : 'bg-slate-700/50 border-slate-600 text-slate-400'}`}>
                    {p.name} {p.isActive ? '⚡' : '(Terputus)'}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Canvas Preview Box */}
        <div className="md:col-span-5 flex flex-col items-center justify-center bg-[#0c1410] border border-[#2d4d3e] rounded-lg p-6 relative">
          <div className="absolute top-3 left-3 bg-[#162a21] border border-[#2d4d3e] px-2.5 py-1 rounded text-[10px] text-[#86efac] font-mono font-bold tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#facc15]" /> AVATAR PREVIEW
          </div>
          <canvas ref={canvasRef} width={220} height={220} className="my-2" />
          <div className="text-center mt-2">
            <div className="font-bold text-base text-white">{name || 'Auditor PKT'}</div>
            <div className="text-xs text-[#86efac] font-mono font-medium">Lini II</div>
          </div>
        </div>

        {/* Customization Options Controls */}
        <div className="md:col-span-7 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#86efac] mb-1.5 uppercase tracking-widest font-mono flex items-center justify-between">
              <span>Nama Peserta / Kode Pegawai <span className="text-red-400">*</span></span>
              <span className="text-[10px] text-red-400 font-normal">Wajib Diisi</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (e.target.value.trim()) setError('');
                }}
                placeholder="Masukkan Nama Lengkap / NIK Pegawai..."
                className={`w-full bg-[#080d0a] border ${
                  error ? 'border-red-500 ring-1 ring-red-500' : 'border-[#2d4d3e] focus:border-[#86efac]'
                } rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition font-sans`}
              />
              <User className="w-4 h-4 text-[#86efac] absolute right-3 top-3" />
            </div>
            {name.trim().toLowerCase().includes('farhan') ? (
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-[#facc15] font-mono animate-fade-in bg-[#facc15]/10 border border-[#facc15]/30 px-2.5 py-1 rounded-md">
                <Crown className="w-3.5 h-3.5 shrink-0" />
                <span>Hak Akses <strong>HOST</strong> Aktif untuk <strong>Farhan</strong> (Dapat mengatur tema, layout, durasi, dan memulai game).</span>
              </div>
            ) : name.trim() ? (
              <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-slate-400 font-mono">
                <span>👤 Masuk sebagai <strong>Peserta / Pemain</strong> (Host Sesi: Farhan).</span>
              </div>
            ) : null}
            {error && (
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-red-400 font-mono animate-shake">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#86efac] mb-1 uppercase tracking-wider font-mono">
                Headgear (Pelindung Kepala)
              </label>
              <select
                value={avatar.headgear}
                onChange={(e) => setAvatar({ ...avatar, headgear: e.target.value as HeadgearType })}
                className="w-full bg-[#080d0a] border border-[#2d4d3e] focus:border-[#86efac] rounded px-3 py-2 text-xs text-white outline-none"
              >
                {headgears.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#86efac] mb-1 uppercase tracking-wider font-mono">
                Eyewear (Kacamata K3)
              </label>
              <select
                value={avatar.eyewear}
                onChange={(e) => setAvatar({ ...avatar, eyewear: e.target.value as EyewearType })}
                className="w-full bg-[#080d0a] border border-[#2d4d3e] focus:border-[#86efac] rounded px-3 py-2 text-xs text-white outline-none"
              >
                {eyewears.map((eOpt) => (
                  <option key={eOpt.id} value={eOpt.id}>
                    {eOpt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#86efac] mb-1 uppercase tracking-wider font-mono">
                Outfit (Pakaian Operasional)
              </label>
              <select
                value={avatar.outfit}
                onChange={(e) => setAvatar({ ...avatar, outfit: e.target.value as OutfitType })}
                className="w-full bg-[#080d0a] border border-[#2d4d3e] focus:border-[#86efac] rounded px-3 py-2 text-xs text-white outline-none"
              >
                {outfits.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#86efac] mb-1 uppercase tracking-wider font-mono">
                Footwear (Sepatu K3)
              </label>
              <select
                value={avatar.footwear}
                onChange={(e) => setAvatar({ ...avatar, footwear: e.target.value as FootwearType })}
                className="w-full bg-[#080d0a] border border-[#2d4d3e] focus:border-[#86efac] rounded px-3 py-2 text-xs text-white outline-none"
              >
                {footwears.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#86efac] mb-1 uppercase tracking-wider font-mono">
              Gaya & Warna Rambut
            </label>
            <div className="grid grid-cols-2 gap-3">
              <select
                value={avatar.hairStyle}
                onChange={(e) =>
                  setAvatar({ ...avatar, hairStyle: e.target.value as 'short' | 'spiky' | 'bun' | 'curly' | 'none' })
                }
                className="bg-[#080d0a] border border-[#2d4d3e] focus:border-[#86efac] rounded px-3 py-2 text-xs text-white outline-none"
              >
                <option value="short">Rambut Pendek Rapi</option>
                <option value="spiky">Spiky Audit Style</option>
                <option value="bun">Sanggul / Bun</option>
                <option value="curly">Ikal / Curly</option>
                <option value="none">Botak / Hijab</option>
              </select>

              <div className="flex items-center gap-2 bg-[#080d0a] border border-[#2d4d3e] rounded px-3 py-1.5">
                <Palette className="w-4 h-4 text-[#86efac]" />
                <input
                  type="color"
                  value={avatar.hairColor}
                  onChange={(e) => setAvatar({ ...avatar, hairColor: e.target.value })}
                  className="w-8 h-6 bg-transparent cursor-pointer rounded border-0"
                />
                <span className="text-xs text-slate-300">Warna Rambut</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#86efac] mb-1 uppercase tracking-wider font-mono">
                Bentuk Wajah & Skin Tone
              </label>
              <div className="flex gap-2">
                <select
                  value={avatar.faceShape}
                  onChange={(e) =>
                    setAvatar({ ...avatar, faceShape: e.target.value as 'oval' | 'round' | 'square' })
                  }
                  className="w-1/2 bg-[#080d0a] border border-[#2d4d3e] focus:border-[#86efac] rounded px-2 py-2 text-xs text-white outline-none"
                >
                  <option value="oval">Oval</option>
                  <option value="round">Bulat</option>
                  <option value="square">Kotak</option>
                </select>
                <div className="w-1/2 flex items-center justify-center gap-1.5 bg-[#080d0a] border border-[#2d4d3e] rounded px-2 py-1.5">
                  <input
                    type="color"
                    value={avatar.skinColor}
                    onChange={(e) => setAvatar({ ...avatar, skinColor: e.target.value })}
                    className="w-7 h-5 bg-transparent cursor-pointer rounded border-0"
                  />
                  <span className="text-[11px] text-slate-300 font-mono">Kulit</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#86efac] mb-1 uppercase tracking-wider font-mono">
                Warna Dasar Uniform
              </label>
              <div className="flex items-center gap-2 bg-[#080d0a] border border-[#2d4d3e] rounded px-3 py-2">
                <Palette className="w-4 h-4 text-[#86efac]" />
                <input
                  type="color"
                  value={avatar.primaryColor}
                  onChange={(e) => setAvatar({ ...avatar, primaryColor: e.target.value })}
                  className="w-8 h-5 bg-transparent cursor-pointer rounded border-0"
                />
                <span className="text-xs text-slate-300 font-mono">Warna Utama</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleProceed}
              className="w-full bg-[#86efac] text-black hover:bg-[#86efac]/90 font-bold py-3.5 px-6 rounded-lg shadow-lg transition flex items-center justify-center gap-2 uppercase tracking-widest text-sm font-mono cursor-pointer"
            >
              <Shield className="w-5 h-5 text-black" /> {roomState?.isGameStarted ? 'GABUNG KE ARENA BERJALAN' : 'MASUK KE RISK BRAWLER ARENA'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

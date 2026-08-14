import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  X,
  Smartphone,
  Gamepad2,
  HelpCircle,
  Leaf,
  Users,
  ShieldCheck,
  Sparkles,
  Zap,
  AlertTriangle,
  RotateCcw,
  Target,
  Clock,
  Shield,
  FileText,
  Award,
  Download,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Crown,
  Wifi,
  Bot,
  Cpu,
  Mic,
  FileSpreadsheet,
  DollarSign,
  Flame,
  Lock,
  Radio,
  ExternalLink,
  Globe,
} from 'lucide-react';
import { downloadTutorialPDF } from '../utils/tutorialPdfGenerator';
import logoTkmr from '../assets/logo-tkmr.png';

interface TutorialModalProps {
  onClose: () => void;
  playerName?: string;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ onClose, playerName = 'Insan Pupuk Kaltim' }) => {
  const [currentSlide, setCurrentSlide] = useState<number>(1);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);
  const TOTAL_SLIDES = 9;

  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    try {
      await downloadTutorialPDF(playerName || 'Insan Pupuk Kaltim');
    } catch (e) {
      console.error('Error downloading tutorial PDF:', e);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // Keyboard Navigation (Arrow Keys & Space)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        setCurrentSlide((prev) => Math.min(TOTAL_SLIDES, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentSlide((prev) => Math.max(1, prev - 1));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const slideTitles = [
    'Cover & Sambutan',
    'Kontrol PC & HP',
    'Host & Mabar Wi-Fi',
    'Sistem Skor & Tower',
    'Daftar 6 Senjata',
    'Node 1 & Node 2',
    'Node 3 & Node 4',
    'Node 5 & Node 6',
    'Node 7 & Penutup',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fade-in font-sans text-white select-none">
      {/* 16:9 Presentation Container */}
      <div className="bg-[#0b1611] border-2 border-[#86efac] rounded-2xl w-full max-w-6xl h-[90vh] max-h-[760px] flex flex-col overflow-hidden shadow-[0_0_60px_rgba(16,185,129,0.25)] relative">
        
        {/* Slide Header Bar */}
        <div className="bg-[#12231b] border-b border-[#2d4d3e] px-4 py-2.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <img src={logoTkmr} alt="Logo TKMR PKT" className="w-8 h-8 object-contain rounded-lg bg-[#0b1611] p-1 border border-[#86efac]/40 shadow-sm" />
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#86efac] font-bold block leading-tight">
                PT PUPUK KALIMANTAN TIMUR — KOMPARTEMEN TATA KELOLA & MANAJEMEN RISIKO
              </span>
              <h2 className="text-xs sm:text-sm md:text-base font-black text-[#facc15] tracking-wide flex items-center gap-2">
                <span>BUKU PANDUAN EKSEKUTIF 16:9</span>
                <span className="text-slate-400 text-xs font-normal">|</span>
                <span className="text-white text-xs font-bold font-mono">SLIDE {currentSlide} / {TOTAL_SLIDES}</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="bg-[#2d4d3e] hover:bg-[#3d6652] text-[#86efac] border border-[#86efac]/60 font-bold px-3 py-1.5 rounded-xl text-xs font-mono transition flex items-center gap-1.5 cursor-pointer shadow-md"
              title="Unduh slide presentasi 16:9 format PDF beresolusi tinggi"
            >
              <Download className={`w-3.5 h-3.5 ${isDownloadingPdf ? 'animate-bounce text-[#facc15]' : ''}`} />
              <span className="hidden sm:inline">{isDownloadingPdf ? 'Membuat PDF...' : 'Unduh Slide PDF 16:9'}</span>
              <span className="sm:hidden">PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white bg-[#1a2e24] hover:bg-[#2d4d3e] border border-[#2d4d3e] rounded-xl transition cursor-pointer"
              title="Tutup Panduan (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Slide Category Jump Tabs */}
        <div className="bg-[#080d0a] border-b border-[#2d4d3e] px-3 py-1.5 flex items-center gap-1.5 overflow-x-auto shrink-0 font-mono text-[10px] sm:text-xs custom-scrollbar">
          {slideTitles.map((title, idx) => {
            const slideNum = idx + 1;
            const isActive = currentSlide === slideNum;
            return (
              <button
                key={idx}
                onClick={() => setCurrentSlide(slideNum)}
                className={`px-3 py-1 rounded-lg transition font-bold whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#86efac] text-black shadow-md'
                    : 'bg-[#14241c] text-slate-400 hover:text-white hover:bg-[#1a2e24]'
                }`}
              >
                <span className="opacity-70 font-mono">{slideNum}.</span> {title}
              </button>
            );
          })}
        </div>

        {/* Main Slide Content Stage */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar flex flex-col justify-center bg-[#070e0a]">
          
          {/* ========================================== */}
          {/* SLIDE 1: COVER & HERO SAMBUTAN */}
          {/* ========================================== */}
          {currentSlide === 1 && (
            <div className="space-y-4 animate-fade-in max-w-4xl mx-auto w-full">
              <div className="bg-gradient-to-r from-[#12281e] via-[#1a3a2d] to-[#12281e] border-2 border-[#facc15] rounded-2xl p-5 sm:p-7 text-center relative shadow-2xl">
                <img src={logoTkmr} alt="Logo TKMR" className="w-16 h-16 sm:w-20 sm:h-20 mx-auto object-contain mb-3 drop-shadow" />
                <span className="text-xs font-mono font-bold text-[#86efac] uppercase tracking-widest block">
                  EDISI RESMI SMART FRIDAY 2026
                </span>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-wide mt-1">
                  PANDUAN LENGKAP & MODUL EDUKASI RISK BRAWLER
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto mt-2 leading-relaxed">
                  Platform Gamifikasi Interaktif Tata Kelola (GCG), ISO 31000 ERM, SMAP ISO 37001, ESG Dekarbonisasi, dan Penerapan AI Enterprise PT Pupuk Kaltim.
                </p>

                <div className="inline-block mt-4 px-4 py-1.5 rounded-full bg-black/60 border border-[#facc15] text-[#facc15] font-mono font-bold text-xs sm:text-sm shadow-md">
                  ★ Selamat Datang di Risk Brawler, {playerName}! ★
                </div>
              </div>

              {/* 4 Feature Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#12231b] border border-[#2d4d3e] rounded-xl p-3 text-center space-y-1">
                  <Gamepad2 className="w-5 h-5 text-[#86efac] mx-auto" />
                  <strong className="text-xs font-bold text-white block">Arena Brawler 2D</strong>
                  <p className="text-[11px] text-slate-400 leading-tight">Duel taktis menguji ketangkasan & manajemen risiko.</p>
                </div>
                <div className="bg-[#12231b] border border-[#2d4d3e] rounded-xl p-3 text-center space-y-1">
                  <HelpCircle className="w-5 h-5 text-[#facc15] mx-auto" />
                  <strong className="text-xs font-bold text-white block">Knowledge Tower</strong>
                  <p className="text-[11px] text-slate-400 leading-tight">Kuis node +50 poin, tanpa repetisi, tower redup saat selesai.</p>
                </div>
                <div className="bg-[#12231b] border border-[#2d4d3e] rounded-xl p-3 text-center space-y-1">
                  <Wifi className="w-5 h-5 text-[#38bdf8] mx-auto" />
                  <strong className="text-xs font-bold text-white block">Mabar Wi-Fi LAN</strong>
                  <p className="text-[11px] text-slate-400 leading-tight">Multi-device Laptop & HP tanpa instalasi via URL server.</p>
                </div>
                <div className="bg-[#12231b] border border-[#2d4d3e] rounded-xl p-3 text-center space-y-1">
                  <Award className="w-5 h-5 text-[#4ade80] mx-auto" />
                  <strong className="text-xs font-bold text-white block">Sertifikat Digital</strong>
                  <p className="text-[11px] text-slate-400 leading-tight">Unduh Sertifikat PDF resmi langsung dari Kompartemen TKMR.</p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* SLIDE 2: KONTROL PC VS KONTROL HP */}
          {/* ========================================== */}
          {currentSlide === 2 && (
            <div className="space-y-4 animate-fade-in max-w-4xl mx-auto w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Keyboard PC Box */}
                <div className="bg-[#12231b] border-2 border-[#86efac] rounded-2xl p-4 sm:p-5 space-y-3 shadow-xl">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#86efac] border-b border-[#2d4d3e] pb-2">
                    <Gamepad2 className="w-4 h-4" /> KONTROL KEYBOARD (LAPTOP / PC)
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="bg-[#080d0a] p-2.5 rounded-xl border border-[#2d4d3e] flex items-center gap-3">
                      <span className="font-mono font-bold px-2 py-1 bg-[#1a2e24] border border-[#86efac] text-[#86efac] rounded text-xs">[A] [D]</span>
                      <div>
                        <strong className="text-white block">Jalan Kiri / Kanan</strong>
                        <span className="text-[11px] text-slate-400">Menjelajahi arena & bermanuver di atas platform pabrik.</span>
                      </div>
                    </div>
                    <div className="bg-[#080d0a] p-2.5 rounded-xl border border-[#2d4d3e] flex items-center gap-3">
                      <span className="font-mono font-bold px-2 py-1 bg-[#1a2e24] border border-[#38bdf8] text-[#38bdf8] rounded text-xs">[W] / [↑]</span>
                      <div>
                        <strong className="text-white block">Lompat & Double Jump</strong>
                        <span className="text-[11px] text-slate-400">Tekan 2x di udara untuk mencapai platform bertingkat atas.</span>
                      </div>
                    </div>
                    <div className="bg-[#080d0a] p-2.5 rounded-xl border border-[#2d4d3e] flex items-center gap-3">
                      <span className="font-mono font-bold px-2 py-1 bg-[#450a0a] border border-red-500 text-red-300 rounded text-xs">[Z] / [Spasi]</span>
                      <div>
                        <strong className="text-white block">Serang Lawan (Attack)</strong>
                        <span className="text-[11px] text-slate-400">Pukulan tinju audit atau tembakan proyektil senjata aktif.</span>
                      </div>
                    </div>
                    <div className="bg-[#080d0a] p-2.5 rounded-xl border border-[#2d4d3e] flex items-center gap-3">
                      <span className="font-mono font-bold px-2.5 py-1 bg-[#451a03] border border-amber-500 text-amber-300 rounded text-xs">[E]</span>
                      <div>
                        <strong className="text-white block">Interaksi Kuis Tower</strong>
                        <span className="text-[11px] text-slate-400">Membuka popup soal kuis saat berada dekat Knowledge Tower.</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Touch HP Box */}
                <div className="bg-[#12231b] border-2 border-[#38bdf8] rounded-2xl p-4 sm:p-5 space-y-3 shadow-xl">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#38bdf8] border-b border-[#2d4d3e] pb-2">
                    <Smartphone className="w-4 h-4" /> KONTROL SENTUH HP (PORTRAIT & LANDSCAPE)
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="bg-[#080d0a] p-2.5 rounded-xl border border-[#2d4d3e] flex items-center gap-3">
                      <div className="flex gap-1">
                        <span className="w-6 h-6 bg-[#1a2e24] border border-[#38bdf8] text-[#38bdf8] rounded flex items-center justify-center font-bold text-xs">&lt;</span>
                        <span className="w-6 h-6 bg-[#1a2e24] border border-[#38bdf8] text-[#38bdf8] rounded flex items-center justify-center font-bold text-xs">&gt;</span>
                      </div>
                      <div>
                        <strong className="text-white block">D-Pad Tekan Tahan (Continuous Hold)</strong>
                        <span className="text-[11px] text-slate-400">Tahan jari pada tombol untuk melangkah mulus tanpa jeda.</span>
                      </div>
                    </div>
                    <div className="bg-[#080d0a] p-2.5 rounded-xl border border-[#2d4d3e] flex items-center gap-3">
                      <span className="w-6 h-6 bg-blue-950 border border-blue-400 text-blue-300 rounded flex items-center justify-center font-bold text-xs">^</span>
                      <div>
                        <strong className="text-white block">Tombol Lompat Biru</strong>
                        <span className="text-[11px] text-slate-400">Ketuk 2x untuk manuver Double Jump di atas rintangan.</span>
                      </div>
                    </div>
                    <div className="bg-[#080d0a] p-2.5 rounded-xl border border-[#2d4d3e] flex items-center gap-3">
                      <span className="w-6 h-6 bg-red-950 border border-red-400 text-red-300 rounded flex items-center justify-center font-bold text-xs">⚡</span>
                      <div>
                        <strong className="text-white block">Tombol Serang Merah</strong>
                        <span className="text-[11px] text-slate-400">Ketuk untuk melancarkan serangan tinju / tembakan proyektil.</span>
                      </div>
                    </div>
                    <div className="bg-[#080d0a] p-2.5 rounded-xl border border-[#2d4d3e] flex items-center gap-3">
                      <span className="w-6 h-6 bg-amber-950 border border-amber-400 text-amber-300 rounded flex items-center justify-center font-bold text-xs">❓</span>
                      <div>
                        <strong className="text-white block">Tombol Kuis Kuning</strong>
                        <span className="text-[11px] text-slate-400">Otomatis aktif berdenyut ketika berada di dekat Tower Kuis.</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* SLIDE 3: HOST & MABAR WI-FI */}
          {/* ========================================== */}
          {currentSlide === 3 && (
            <div className="space-y-4 animate-fade-in max-w-4xl mx-auto w-full">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-[#12231b] border-2 border-[#facc15] rounded-2xl p-4 space-y-2 shadow-xl">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#facc15] border-b border-[#2d4d3e] pb-2">
                    <Crown className="w-4 h-4" /> 1. KENDALI PENUH HOST
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    • Mengatur durasi pertandingan (5, 10, atau 15 Menit).<br/>
                    • Memulai hitung mundur sesi (3-2-1 Mulai).<br/>
                    • Menghentikan laga darurat kapan saja.
                  </p>
                </div>

                <div className="bg-[#12231b] border-2 border-[#38bdf8] rounded-2xl p-4 space-y-2 shadow-xl">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#38bdf8] border-b border-[#2d4d3e] pb-2">
                    <Wifi className="w-4 h-4" /> 2. MABAR WI-FI LAN
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    • Sambungkan seluruh device ke Wi-Fi yang sama.<br/>
                    • Buka browser: <strong className="text-[#86efac] font-mono">http://10.127.30.151:3000</strong>.<br/>
                    • Langsung masuk arena tanpa instalasi software!
                  </p>
                </div>

                <div className="bg-[#12231b] border-2 border-[#4ade80] rounded-2xl p-4 space-y-2 shadow-xl">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#4ade80] border-b border-[#2d4d3e] pb-2">
                    <Zap className="w-4 h-4" /> 3. REKONEKSI PRESISI
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    • Saat terputus/refresh, karakter hilang otomatis.<br/>
                    • Saat masuk kembali, posisi koordinat, sisa HP, dan skor langsung dipulihkan 100%.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* SLIDE 4: SISTEM SKOR & ATURAN TOWER */}
          {/* ========================================== */}
          {currentSlide === 4 && (
            <div className="space-y-4 animate-fade-in max-w-4xl mx-auto w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="bg-[#12231b] border-2 border-[#86efac] rounded-2xl p-4 space-y-2.5 shadow-xl">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#86efac] border-b border-[#2d4d3e] pb-2">
                    <Target className="w-4 h-4" /> PERHITUNGAN SKOR AKHIR
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="bg-[#080d0a] p-2 rounded-xl border border-[#2d4d3e] flex justify-between items-center">
                      <span className="text-slate-200">✅ Jawab Kuis Benar di Tower</span>
                      <span className="font-mono font-bold text-[#86efac]">+50 Poin</span>
                    </div>
                    <div className="bg-[#080d0a] p-2 rounded-xl border border-[#2d4d3e] flex justify-between items-center">
                      <span className="text-slate-200">❌ Jawab Salah / Waktu Habis</span>
                      <span className="font-mono font-bold text-red-400">-10 Poin & Knockback</span>
                    </div>
                    <div className="bg-[#080d0a] p-2 rounded-xl border border-[#2d4d3e] flex justify-between items-center">
                      <span className="text-slate-200">🍃 Ambil ESG Eco Leaf Token</span>
                      <span className="font-mono font-bold text-[#4ade80]">+20 Poin</span>
                    </div>
                    <div className="bg-[#080d0a] p-2 rounded-xl border border-[#2d4d3e] flex justify-between items-center">
                      <span className="text-slate-200">💥 Mengeliminasi Lawan (K.O)</span>
                      <span className="font-mono font-bold text-[#facc15]">+30 Poin</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#12231b] border-2 border-[#facc15] rounded-2xl p-4 space-y-2.5 shadow-xl">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#facc15] border-b border-[#2d4d3e] pb-2">
                    <HelpCircle className="w-4 h-4" /> ATURAN KNOWLEDGE TOWER
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    • Setiap Tower Kuis mewakili materi edukasi spesifik.<br/>
                    • <strong>Tanpa Repetisi Soal:</strong> Setiap soal unik dan tidak akan berulang.<br/>
                    • Menjawab benar akan <strong>membuka Senjata Spesial</strong> (Hammer, Sword, Shield, Blaster) dengan damage & knockback tinggi!
                  </p>
                  <div className="bg-[#080d0a] border border-[#facc15] rounded-xl p-2.5 text-center font-mono text-[11px] text-[#facc15]">
                    ★ Tower akan otomatis redup saat bank soal Anda di node tersebut selesai! ★
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* SLIDE 5: DAFTAR 6 SENJATA INDUSTRI */}
          {/* ========================================== */}
          {currentSlide === 5 && (
            <div className="space-y-3 animate-fade-in max-w-4xl mx-auto w-full">
              <div className="text-center mb-1">
                <span className="text-[11px] font-mono text-[#86efac] uppercase tracking-wider font-bold">ARSENAL TAKTIS AUDITOR</span>
                <h3 className="text-sm sm:text-base font-extrabold text-white">6 SENJATA INDUSTRI DENGAN BATAS AMUNISI</h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="bg-[#12231b] border-2 border-sky-400 rounded-xl p-3 space-y-1.5 shadow">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-400">🔫 Laser Beam Rifle</span>
                    <span className="text-[10px] font-mono bg-sky-950 px-2 py-0.5 rounded text-sky-300 font-bold border border-sky-500/40">8 Ammo</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">Tembakan proyektil laser jarak jauh berkecepatan tinggi melumpuhkan musuh dari jauh.</p>
                </div>

                <div className="bg-[#12231b] border-2 border-amber-400 rounded-xl p-3 space-y-1.5 shadow">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300">🔨 Risk Audit Hammer</span>
                    <span className="text-[10px] font-mono bg-amber-950 px-2 py-0.5 rounded text-amber-300 font-bold border border-amber-500/40">5 Ammo</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">Ayunan knockback berat, menghasilkan hentakan mementalkan lawan jatuh dari platform.</p>
                </div>

                <div className="bg-[#12231b] border-2 border-purple-400 rounded-xl p-3 space-y-1.5 shadow">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-400">⚔️ Compliance Sword</span>
                    <span className="text-[10px] font-mono bg-purple-950 px-2 py-0.5 rounded text-purple-300 font-bold border border-purple-500/40">12 Ammo</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">Tebasan cepat jarak dekat dengan jeda *cooldown* singkat untuk serangan beruntun.</p>
                </div>

                <div className="bg-[#12231b] border-2 border-emerald-400 rounded-xl p-3 space-y-1.5 shadow">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400">🛡️ ESG Plasma Shield</span>
                    <span className="text-[10px] font-mono bg-emerald-950 px-2 py-0.5 rounded text-emerald-300 font-bold border border-emerald-500/40">10 Ammo</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">Perisai pelindung yang membuat brawler kebal terhadap semua serangan selama 3 detik.</p>
                </div>

                <div className="bg-[#12231b] border-2 border-red-400 rounded-xl p-3 space-y-1.5 shadow">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-red-400">💥 Decarb Blaster</span>
                    <span className="text-[10px] font-mono bg-red-950 px-2 py-0.5 rounded text-red-300 font-bold border border-red-500/40">10 Ammo</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">Meriam ledakan area (AoE) menghasilkan gelombang kejut mengenai banyak lawan.</p>
                </div>

                <div className="bg-[#12231b] border-2 border-[#86efac] rounded-xl p-3 space-y-1.5 shadow">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#86efac]">🥊 Audit Fists</span>
                    <span className="text-[10px] font-mono bg-green-950 px-2 py-0.5 rounded text-green-300 font-bold border border-green-500/40">Tak Terbatas (∞)</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">Pukulan dasar default yang selalu siap saat amunisi senjata khusus habis terpakai.</p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* SLIDE 6: NODE 1 & NODE 2 (MATERI & CONTOH SOAL) */}
          {/* ========================================== */}
          {currentSlide === 6 && (
            <div className="space-y-3 animate-fade-in max-w-4xl mx-auto w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                
                {/* Node 1 */}
                <div className="bg-[#12231b] border-2 border-[#86efac] rounded-xl p-3.5 space-y-2.5 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#86efac] border-b border-[#2d4d3e] pb-1.5">
                      <Shield className="w-4 h-4" /> NODE 1: GCG, AKHLAK & ISO 31000 ERM
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed mt-2">
                      • <strong>Prinsip TARIF:</strong> Transparansi, Akuntabilitas, Responsibilitas, Independensi, Fairness.<br/>
                      • <strong>Three Lines Model:</strong> Lini 1 (Pabrik), Lini 2 (Tata Kelola & Risiko), Lini 3 (SPI/Audit).<br/>
                      • <strong>Risk Appetite:</strong> Batas ambang toleransi risiko disetujui Direksi & Komisaris.
                    </p>
                  </div>
                  <div className="bg-[#080d0a] border border-[#facc15] rounded-lg p-2.5 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[10px] text-[#facc15] font-bold">💡 CONTOH SOAL KUIS NODE 1</span>
                      <span className="font-mono text-[9px] bg-[#1a2e24] text-[#86efac] px-1.5 py-0.5 rounded font-bold">Kunci: B</span>
                    </div>
                    <strong className="text-[11px] text-white block leading-snug">Apa kepanjangan dan makna dari prinsip TARIF dalam GCG PKT?</strong>
                    <span className="text-[10px] text-[#86efac] font-bold block">→ B. Transparansi, Akuntabilitas, Responsibilitas, Independensi, dan Fairness</span>
                    <span className="text-[9px] text-slate-400 block"><em>Pembahasan: Pilar utama GCG penjamin integritas operasional PT Pupuk Kaltim.</em></span>
                  </div>
                </div>

                {/* Node 2 */}
                <div className="bg-[#12231b] border-2 border-sky-400 rounded-xl p-3.5 space-y-2.5 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-400 border-b border-[#2d4d3e] pb-1.5">
                      <Lock className="w-4 h-4" /> NODE 2: KEPATUHAN & SMAP ISO 37001
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed mt-2">
                      • <strong>Prinsip 4 NOs:</strong> No Bribery, No Kickback, No Gift, No Luxurious Hospitality.<br/>
                      • <strong>Whistleblowing System:</strong> Kanal 24/7 rahasia dengan perlindungan penuh pelapor.<br/>
                      • <strong>Fraud Control System:</strong> Uji tuntas vendor & deteksi dini kecurangan.
                    </p>
                  </div>
                  <div className="bg-[#080d0a] border border-[#facc15] rounded-lg p-2.5 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[10px] text-[#facc15] font-bold">💡 CONTOH SOAL KUIS NODE 2</span>
                      <span className="font-mono text-[9px] bg-[#1a2e24] text-[#86efac] px-1.5 py-0.5 rounded font-bold">Kunci: B</span>
                    </div>
                    <strong className="text-[11px] text-white block leading-snug">Manakah yang merupakan implementasi dari prinsip 4 NOs di PKT?</strong>
                    <span className="text-[10px] text-[#86efac] font-bold block">→ B. No Bribery, No Kickback, No Gift, No Luxurious Hospitality</span>
                    <span className="text-[9px] text-slate-400 block"><em>Pembahasan: Komitmen Zero Tolerance terhadap suap, gratifikasi, dan jamuan mewah berlebih.</em></span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* SLIDE 7: NODE 3 & NODE 4 (MATERI & CONTOH SOAL) */}
          {/* ========================================== */}
          {currentSlide === 7 && (
            <div className="space-y-3 animate-fade-in max-w-4xl mx-auto w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                
                {/* Node 3 */}
                <div className="bg-[#12231b] border-2 border-emerald-400 rounded-xl p-3.5 space-y-2.5 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 border-b border-[#2d4d3e] pb-1.5">
                      <Leaf className="w-4 h-4" /> NODE 3: ESG & PETA JALAN NET ZERO
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed mt-2">
                      • <strong>Penerapan CCUS:</strong> Menangkap gas CO2 pabrik Ammonia untuk bahan baku Urea.<br/>
                      • <strong>Transisi Energi:</strong> PLTS Atap Solar PV & Co-firing biomassa cangkang sawit.<br/>
                      • <strong>Green Ammonia:</strong> Pengembangan amonia hijau rendah emisi karbon.
                    </p>
                  </div>
                  <div className="bg-[#080d0a] border border-[#facc15] rounded-lg p-2.5 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[10px] text-[#facc15] font-bold">💡 CONTOH SOAL KUIS NODE 3</span>
                      <span className="font-mono text-[9px] bg-[#1a2e24] text-[#86efac] px-1.5 py-0.5 rounded font-bold">Kunci: C</span>
                    </div>
                    <strong className="text-[11px] text-white block leading-snug">Inisiatif dekarbonisasi Net Zero PKT mencakup hal berikut, KECUALI:</strong>
                    <span className="text-[10px] text-red-400 font-bold block">→ C. Konversi pabrik ke bahan bakar batu bara mentah</span>
                    <span className="text-[9px] text-slate-400 block"><em>Pembahasan: Dekarbonisasi berfokus pada energi hijau dan CCUS, bukan menambah batu bara mentah.</em></span>
                  </div>
                </div>

                {/* Node 4 */}
                <div className="bg-[#12231b] border-2 border-red-400 rounded-xl p-3.5 space-y-2.5 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-red-400 border-b border-[#2d4d3e] pb-1.5">
                      <Flame className="w-4 h-4" /> NODE 4: K3LL & PROCESS SAFETY (PSM)
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed mt-2">
                      • <strong>5 Golden Rules K3:</strong> Work Permit, APD Lengkap, LOTO, Ketinggian, Confined Space.<br/>
                      • <strong>Process Safety Management:</strong> Integritas pipa gas alam & amonia tekanan tinggi.<br/>
                      • <strong>CSMS:</strong> Standar keselamatan kontraktor setara standar pegawai PKT.
                    </p>
                  </div>
                  <div className="bg-[#080d0a] border border-[#facc15] rounded-lg p-2.5 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[10px] text-[#facc15] font-bold">💡 CONTOH SOAL KUIS NODE 4</span>
                      <span className="font-mono text-[9px] bg-[#1a2e24] text-[#86efac] px-1.5 py-0.5 rounded font-bold">Kunci: B</span>
                    </div>
                    <strong className="text-[11px] text-white block leading-snug">Apa syarat wajib sebelum bekerja di ruang terbatas (Confined Space) PKT?</strong>
                    <span className="text-[10px] text-[#86efac] font-bold block">→ B. Surat Izin Kerja SIKA, uji gas atmosfer, LOTO, dan pengawas siaga</span>
                    <span className="text-[9px] text-slate-400 block"><em>Pembahasan: Standar ketat untuk mencegah kecelakaan fatal dan mempertahankan Zero Accident.</em></span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* SLIDE 8: NODE 5 & NODE 6 (MATERI & CONTOH SOAL) */}
          {/* ========================================== */}
          {currentSlide === 8 && (
            <div className="space-y-3 animate-fade-in max-w-4xl mx-auto w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                
                {/* Node 5 */}
                <div className="bg-[#12231b] border-2 border-purple-400 rounded-xl p-3.5 space-y-2.5 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-400 border-b border-[#2d4d3e] pb-1.5">
                      <Cpu className="w-4 h-4" /> NODE 5: TEORI AI & MACHINE LEARNING
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed mt-2">
                      • <strong>Supervised (Berlabel):</strong> Predictive Maintenance pompa & deteksi retak pipa.<br/>
                      • <strong>Unsupervised (Tanpa Label):</strong> Klaster pola konsumsi gas alam antarpabrik.<br/>
                      • <strong>Reinforcement:</strong> Optimasi rute distribusi armada kapal pupuk nasional.
                    </p>
                  </div>
                  <div className="bg-[#080d0a] border border-[#facc15] rounded-lg p-2.5 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[10px] text-[#facc15] font-bold">💡 CONTOH SOAL KUIS NODE 5</span>
                      <span className="font-mono text-[9px] bg-[#1a2e24] text-[#86efac] px-1.5 py-0.5 rounded font-bold">Kunci: B</span>
                    </div>
                    <strong className="text-[11px] text-white block leading-snug">Manakah penerapan metode Supervised Learning yang tepat di pabrik PKT?</strong>
                    <span className="text-[10px] text-[#86efac] font-bold block">→ B. Data getaran berlabel untuk prediksi kerusakan pompa (Predictive Maintenance)</span>
                    <span className="text-[9px] text-slate-400 block"><em>Pembahasan: Supervised learning memprediksi kegagalan mesin secara akurat sebelum breakdown.</em></span>
                  </div>
                </div>

                {/* Node 6 */}
                <div className="bg-[#12231b] border-2 border-orange-400 rounded-xl p-3.5 space-y-2.5 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-orange-400 border-b border-[#2d4d3e] pb-1.5">
                      <Radio className="w-4 h-4" /> NODE 6: TOOLS AI, API RAG & PLAUD NOTE
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed mt-2">
                      • <strong>Tools:</strong> Tactiq.io & AudioConvert.ai (MoM rapat), MS 365 Copilot & Claude Work.<br/>
                      • <strong>API RAG:</strong> Kueri dokumen internal aman tanpa kebocoran data rahasia.<br/>
                      • <strong>PLAUD NOTE (~Rp 2,5jt):</strong> Perekam fisik offline untuk inspeksi pabrik bising.
                    </p>
                  </div>
                  <div className="bg-[#080d0a] border border-[#facc15] rounded-lg p-2.5 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[10px] text-[#facc15] font-bold">💡 CONTOH SOAL KUIS NODE 6</span>
                      <span className="font-mono text-[9px] bg-[#1a2e24] text-[#86efac] px-1.5 py-0.5 rounded font-bold">Kunci: B</span>
                    </div>
                    <strong className="text-[11px] text-white block leading-snug">Mengapa arsitektur RAG & Claude Cowork sangat disarankan untuk audit risiko PKT?</strong>
                    <span className="text-[10px] text-[#86efac] font-bold block">→ B. Menghubungkan LLM ke dokumen internal terenkripsi tanpa kebocoran data rahasia</span>
                    <span className="text-[9px] text-slate-400 block"><em>Pembahasan: Mencegah halusinasi AI dan menjaga kerahasiaan dokumen korporasi.</em></span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* SLIDE 9: NODE 7 & PENUTUP SERTIFIKASI */}
          {/* ========================================== */}
          {currentSlide === 9 && (
            <div className="space-y-3 animate-fade-in max-w-4xl mx-auto w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                
                {/* Node 7 */}
                <div className="bg-[#12231b] border-2 border-teal-400 rounded-xl p-3.5 space-y-2.5 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-teal-400 border-b border-[#2d4d3e] pb-1.5">
                      <Globe className="w-4 h-4" /> NODE 7: ECOM MOVE & KEHATI PESISIR BONTANG
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed mt-2">
                      • <strong>EcoMove:</strong> Pemilahan sampah dari sumber (Organik, Residu, Anorganik/Plastik).<br/>
                      • <strong>Konservasi Laut:</strong> Ribuan modul terumbu karang buatan & reboisasi mangrove.<br/>
                      • <strong>Kehati Anggrek Hitam:</strong> Kultur jaringan spesies flora endemik langka.
                    </p>
                  </div>
                  <div className="bg-[#080d0a] border border-[#facc15] rounded-lg p-2.5 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[10px] text-[#facc15] font-bold">💡 CONTOH SOAL KUIS NODE 7</span>
                      <span className="font-mono text-[9px] bg-[#1a2e24] text-[#86efac] px-1.5 py-0.5 rounded font-bold">Kunci: B</span>
                    </div>
                    <strong className="text-[11px] text-white block leading-snug">Program EcoMove dan Kehati PKT di pesisir Bontang mencakup inisiatif:</strong>
                    <span className="text-[10px] text-[#86efac] font-bold block">→ B. Terumbu Karang buatan, Hutan Mangrove, Anggrek Hitam, & Daur Ulang Plastik</span>
                    <span className="text-[9px] text-slate-400 block"><em>Pembahasan: Komitmen pelestarian keanekaragaman hayati bersertifikasi PROPER Emas.</em></span>
                  </div>
                </div>

                {/* Closing & Certificate Box */}
                <div className="bg-gradient-to-b from-[#13281f] to-[#0b1611] border-2 border-[#facc15] rounded-xl p-4 text-center flex flex-col items-center justify-between shadow-2xl">
                  <img src={logoTkmr} alt="Seal PKT" className="w-12 h-12 object-contain drop-shadow-lg" />
                  <div className="my-1">
                    <span className="text-[10px] text-[#86efac] font-mono uppercase tracking-wider block font-bold">SERTIFIKAT KELULUSAN RESMI</span>
                    <h4 className="text-sm sm:text-base font-extrabold text-white">Selamat Bertanding, {playerName}!</h4>
                    <p className="text-[11px] text-slate-300 mt-1 leading-relaxed max-w-sm">
                      Kuasai arena brawler, raih poin kuis di setiap Knowledge Tower, dan unduh Sertifikat Kelulusan Resmi Digital Anda di akhir pertandingan!
                    </p>
                  </div>
                  <div className="w-full space-y-2 pt-2 border-t border-[#2d4d3e]">
                    <button
                      onClick={handleDownloadPdf}
                      disabled={isDownloadingPdf}
                      className="w-full bg-[#1a2e24] hover:bg-[#2d4d3e] text-[#86efac] border border-[#86efac]/50 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Download className="w-3.5 h-3.5" /> {isDownloadingPdf ? 'Membuat PDF...' : 'Unduh Slide PDF 16:9'}
                    </button>
                    <button
                      onClick={onClose}
                      className="w-full bg-[#86efac] hover:bg-[#86efac]/90 text-black py-2 rounded-xl text-xs font-mono font-black uppercase tracking-wider transition cursor-pointer shadow-lg"
                    >
                      SIAP MASUK KE ARENA
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Slide Navigation Footer Bar */}
        <div className="bg-[#12231b] border-t border-[#2d4d3e] px-4 py-2.5 flex items-center justify-between shrink-0 font-mono text-xs">
          <button
            onClick={() => setCurrentSlide((prev) => Math.max(1, prev - 1))}
            disabled={currentSlide === 1}
            className={`px-3.5 py-1.5 rounded-xl border font-bold flex items-center gap-1.5 transition cursor-pointer ${
              currentSlide === 1
                ? 'opacity-40 border-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-[#1a2e24] hover:bg-[#2d4d3e] text-white border-[#2d4d3e]'
            }`}
          >
            <ChevronLeft className="w-4 h-4" /> <span className="hidden sm:inline">Sebelumnya</span>
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-2">
            {Array.from({ length: TOTAL_SLIDES }).map((_, idx) => {
              const slideNum = idx + 1;
              const isActive = currentSlide === slideNum;
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(slideNum)}
                  className={`transition-all rounded-full cursor-pointer ${
                    isActive ? 'w-7 h-2.5 bg-[#86efac]' : 'w-2.5 h-2.5 bg-[#2d4d3e] hover:bg-[#86efac]/50'
                  }`}
                  title={`Ke Slide ${slideNum}`}
                />
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden md:inline font-mono">
              Slide {currentSlide} dari {TOTAL_SLIDES}
            </span>
            <button
              onClick={() => {
                if (currentSlide < TOTAL_SLIDES) {
                  setCurrentSlide((prev) => prev + 1);
                } else {
                  onClose();
                }
              }}
              className="px-4 py-1.5 rounded-xl bg-[#86efac] hover:bg-[#86efac]/90 text-black font-extrabold flex items-center gap-1.5 shadow transition cursor-pointer"
            >
              <span>{currentSlide < TOTAL_SLIDES ? 'Selanjutnya' : 'Selesai'}</span> <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

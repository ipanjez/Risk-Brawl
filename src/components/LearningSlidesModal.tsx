import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  X,
  ChevronLeft,
  ChevronRight,
  Shield,
  Award,
  Leaf,
  HardHat,
  AlertCircle,
  CheckCircle2,
  Zap,
  Target,
  FileText,
  Sparkles,
  Lock,
  Flame,
  Bot,
  Mic,
  FileSpreadsheet,
  Cpu,
  Globe,
  Headphones,
  Laptop,
  Database,
  DollarSign,
  TrendingUp,
  Radio,
  Layers,
  Smartphone,
  Download,
  HelpCircle,
} from 'lucide-react';
import { downloadTutorialPDF } from '../utils/tutorialPdfGenerator';

interface LearningSlidesModalProps {
  onClose: () => void;
  playerName?: string;
}

interface ExampleQuiz {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

interface SlideContent {
  id: number;
  category: string;
  shortTitle: string;
  categoryColor: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  keyPoints: { title: string; desc: string; icon?: React.ReactNode }[];
  exampleQuiz: ExampleQuiz;
  summaryBadge: string;
  quote?: string;
}

const SLIDES: SlideContent[] = [
  {
    id: 1,
    category: 'Node 1: Tata Kelola (GCG) & Manajemen Risiko (ISO 31000)',
    shortTitle: 'Node 1: GCG & Risiko',
    categoryColor: '#86efac',
    icon: <Shield className="w-6 h-6 text-[#86efac]" />,
    title: 'Tata Kelola Perusahaan (GCG), Budaya AKHLAK & ERM ISO 31000',
    subtitle: 'Fondasi Utama Integritas, Transparansi, dan Pengendalian Risiko Terintegrasi PT Pupuk Kaltim',
    keyPoints: [
      {
        title: 'Prinsip TARIF & Budaya AKHLAK',
        desc: '• Transparansi: Keterbukaan info material & relevan bagi publik.\n• Akuntabilitas: Kejelasan fungsi & pertanggungjawaban organ.\n• Responsibilitas: Kepatuhan pada regulasi hukum & lingkungan.\n• Independensi: Bebas benturan kepentingan & intervensi.\n• Fairness: Kesetaraan hak seluruh pemangku kepentingan.\n• AKHLAK: Amanah, Kompeten, Harmonis, Loyal, Adaptif, Kolaboratif.',
        icon: <CheckCircle2 className="w-4 h-4 text-[#86efac]" />,
      },
      {
        title: 'Three Lines Model (Tiga Lini)',
        desc: '• Lini 1 (Unit Operasional & Pabrik): Pemilik & pengelola risiko harian.\n• Lini 2 (Tata Kelola & Risiko): Pengawas kerangka kerja & kepatuhan.\n• Lini 3 (SPI/Internal Audit): Audit independen & jaminan mutu.',
        icon: <Shield className="w-4 h-4 text-[#facc15]" />,
      },
      {
        title: 'Risk Appetite & Pakta Integritas',
        desc: '• Risk Appetite: Batas toleransi risiko dari Direksi & Komisaris.\n• Pedoman penentu kelayakan investasi pabrik & operasional.\n• Penandatanganan Pakta Integritas & Code of Conduct tahunan.',
        icon: <Target className="w-4 h-4 text-red-400" />,
      },
    ],
    exampleQuiz: {
      question: 'Dalam kerangka Tata Kelola Perusahaan yang Baik (GCG) dan Manajemen Risiko Terintegrasi (ISO 31000) PT Pupuk Kaltim, apa kepanjangan dan makna dari prinsip TARIF?',
      options: [
        'A. Total, Akuntabel, Ritel, Insentif, Finansial',
        'B. Transparansi, Akuntabilitas, Responsibilitas, Independensi, dan Fairness (Kesetaraan)',
        'C. Tanggung Jawab, Agilitas, Regulasi, Investasi, Fleksibilitas',
        'D. Tata Usaha, Analisis, Risiko, Informasi, Finansial'
      ],
      answer: 'B',
      explanation: 'Prinsip TARIF (Transparansi, Akuntabilitas, Responsibilitas, Independensi, Fairness) merupakan pilar utama GCG yang diterapkan di seluruh lini operasional PT Pupuk Kaltim guna menjamin integritas dan kepatuhan hukum.',
    },
    summaryBadge: 'Predikat GCG Sangat Baik (Excellent) & ISO 31000 ERM Terintegrasi di Seluruh Pabrik',
    quote: '"Tata kelola yang bersih dan mitigasi risiko presisi menghasilkan nilai berkelanjutan bagi negeri."',
  },
  {
    id: 2,
    category: 'Node 2: Kepatuhan, Anti-Fraud & SMAP SNI ISO 37001',
    shortTitle: 'Node 2: SMAP & WBS',
    categoryColor: '#38bdf8',
    icon: <Lock className="w-6 h-6 text-[#38bdf8]" />,
    title: 'Sistem Manajemen Anti Penyuapan (ISO 37001) & Whistleblowing',
    subtitle: 'Komitmen Tanpa Toleransi (Zero Tolerance) terhadap Kecurangan, Gratifikasi, dan Penyuapan',
    keyPoints: [
      {
        title: 'Prinsip 4 NOs Anti Penyuapan',
        desc: '1. No Bribery: Tanpa suap menyuap dalam bentuk apapun.\n2. No Kickback: Tanpa uang pelicin/komisi rahasia ilegal.\n3. No Gift: Tanpa hadiah yang melanggar ketentuan korporasi.\n4. No Luxurious Hospitality: Tanpa jamuan berlebihan.',
        icon: <CheckCircle2 className="w-4 h-4 text-[#38bdf8]" />,
      },
      {
        title: 'Whistleblowing System (WBS) PKT',
        desc: '• Kanal pengaduan independen, aman, dan rahasia 24/7.\n• Perlindungan penuh bagi identitas pelapor (Whistleblower).\n• Investigasi objektif, transparan, dan bebas intimidasi.',
        icon: <Shield className="w-4 h-4 text-purple-400" />,
      },
      {
        title: 'Fraud Control System & Due Diligence',
        desc: '• Deteksi dini (Early Warning System) potensi kecurangan.\n• Uji tuntas (Due Diligence) rekanan vendor & jabatan strategis.\n• Penegakan sanksi disiplin tegas & mitigasi risiko hukum.',
        icon: <AlertCircle className="w-4 h-4 text-amber-400" />,
      },
    ],
    exampleQuiz: {
      question: 'Sesuai standar Sistem Manajemen Anti Penyuapan (SMAP SNI ISO 37001) di PT Pupuk Kaltim, manakah yang merupakan implementasi dari prinsip "4 NOs"?',
      options: [
        'A. No Speed, No Risk, No Cost, No Limit',
        'B. No Bribery, No Kickback, No Gift, No Luxurious Hospitality',
        'C. No Overtime, No Penalty, No Inspection, No Delay',
        'D. No Cash, No Transfer, No Voucher, No Invoice'
      ],
      answer: 'B',
      explanation: '4 NOs (No Bribery, No Kickback, No Gift, No Luxurious Hospitality) adalah komitmen Zero Tolerance Pupuk Kaltim terhadap segala bentuk suap, uang pelicin, penerimaan hadiah ilegal, dan jamuan mewah yang dapat memicu benturan kepentingan.',
    },
    summaryBadge: 'Sertifikasi SMAP SNI ISO 37001 Terakreditasi Nasional & Internasional',
    quote: '"Integritas adalah harga mati dalam setiap keputusan operasional dan pengadaan barang/jasa."',
  },
  {
    id: 3,
    category: 'Node 3: ESG & Peta Jalan Dekarbonisasi (Net Zero 2050/2060)',
    shortTitle: 'Node 3: Net Zero & ESG',
    categoryColor: '#4ade80',
    icon: <Leaf className="w-6 h-6 text-[#4ade80]" />,
    title: 'Transformasi Industri Hijau Menuju Net Zero Emission & Kehati',
    subtitle: 'Penerapan CCUS, Transisi Energi Bersih, Green Ammonia, dan Konservasi Keanekaragaman Hayati',
    keyPoints: [
      {
        title: 'Penerapan CCUS Pabrik Ammonia',
        desc: '• Carbon Capture, Utilization & Storage di pabrik Ammonia.\n• Penangkapan emisi CO2 untuk bahan baku produksi Urea.\n• Pengurangan emisi Gas Rumah Kaca (GRK) secara terukur.',
        icon: <Leaf className="w-4 h-4 text-[#4ade80]" />,
      },
      {
        title: 'Transisi Energi Bersih (Solar PV & Biomassa)',
        desc: '• PLTS Atap (Solar PV) di kompleks perkantoran & pabrik.\n• Co-firing biomassa cangkang sawit pada boiler utilitas.\n• Elektrifikasi armada logistik & operasional ramah lingkungan.',
        icon: <Sparkles className="w-4 h-4 text-[#facc15]" />,
      },
      {
        title: 'Green Ammonia & Konservasi Kehati',
        desc: '• Pengembangan Green Ammonia berbasis hidrogen hijau.\n• Pemanfaatan CO2 untuk bahan baku pabrik Soda Ash nasional.\n• Konservasi Terumbu Karang, Mangrove, & Anggrek Hitam.\n• EcoMove: Pemilahan sampah organik, residu, & plastik PET/HDPE.',
        icon: <CheckCircle2 className="w-4 h-4 text-cyan-400" />,
      },
    ],
    exampleQuiz: {
      question: 'Proyek strategis Dekarbonisasi Pupuk Kaltim dalam mencapai target Net Zero Emission mencakup inisiatif teknologi berikut, KECUALI:',
      options: [
        'A. Pemanfaatan PLTS Atap (Solar PV) & Co-firing Biomassa pada boiler utilitas',
        'B. Penerapan Carbon Capture, Utilization, and Storage (CCUS) pada pabrik Ammonia',
        'C. Konversi penuh seluruh fasilitas pabrik menggunakan bahan bakar batu bara mentah',
        'D. Pengembangan Green Ammonia berbasis hidrogen hijau ramah lingkungan'
      ],
      answer: 'C',
      explanation: 'Peta jalan Dekarbonisasi PKT berfokus pada transisi energi bersih (PLTS, Biomassa), penangkapan karbon (CCUS), dan amonia hijau, BUKAN meningkatkan pemakaian bahan bakar batu bara mentah.',
    },
    summaryBadge: 'Target Penurunan Emisi GRK Industri Petrokimia & Pelestarian Ekosistem Berkelanjutan',
    quote: '"Melestarikan bumi untuk generasi mendatang melalui inovasi teknologi hijau berkelanjutan."',
  },
  {
    id: 4,
    category: 'Node 4: Keselamatan Kerja K3LL & Process Safety Management',
    shortTitle: 'Node 4: K3 & Safety',
    categoryColor: '#f87171',
    icon: <HardHat className="w-6 h-6 text-[#f87171]" />,
    title: 'Process Safety Management (PSM) & Zero Accident Golden Rules',
    subtitle: 'Standar Tertinggi Keselamatan Operasional Kompleks Industri Pupuk & Amonia Bertekanan Tinggi',
    keyPoints: [
      {
        title: 'Golden Rules K3 Pupuk Kaltim',
        desc: '1. Izin Kerja Aman (Work Permit) sebelum memulai pekerjaan.\n2. APD Lengkap & Sesuai potensi bahaya area kerja.\n3. Isolasi Energi LOTO (Lock Out Tag Out).\n4. Bekerja di Ketinggian Aman & bersertifikasi.\n5. Prosedur Masuk Ruang Terbatas (Confined Space).',
        icon: <CheckCircle2 className="w-4 h-4 text-[#f87171]" />,
      },
      {
        title: 'Process Safety Management (PSM)',
        desc: '• Integritas mekanikal pipa gas alam & amonia bertekanan tinggi.\n• Inspeksi berkala katup pengaman (PSV) & bejana tekan.\n• Simulasi tanggap darurat (Emergency Drill) berkala.',
        icon: <Flame className="w-4 h-4 text-orange-400" />,
      },
      {
        title: 'CSMS Mitra Kerja & Zero Accident',
        desc: '• Standar keselamatan setara bagi seluruh vendor & kontraktor.\n• Safety induction wajib sebelum masuk kompleks industri.\n• Mempertahankan rekor Zero Accident (Kecelakaan Nihil).',
        icon: <Shield className="w-4 h-4 text-[#86efac]" />,
      },
    ],
    exampleQuiz: {
      question: 'Sesuai 5 Golden Rules K3 dan Process Safety Management (PSM) di kompleks pabrik Pupuk Kaltim, apa tindakan wajib sebelum melakukan pekerjaan berisiko tinggi di ruang terbatas (Confined Space)?',
      options: [
        'A. Memulai pekerjaan langsung asalkan memakai helm proyek standar',
        'B. Menerbitkan Surat Izin Kerja Aman (SIKA), pengujian gas atmosfer bebas racun/ledakan, isolasi LOTO, dan ada pengawas siaga bersertifikat',
        'C. Membawa kipas angin biasa dan bekerja tanpa pengawasan orang lain',
        'D. Menunggu instruksi lisan dari rekan kerja tanpa dokumen tertulis'
      ],
      answer: 'B',
      explanation: 'Pekerjaan di ruang terbatas (Confined Space) pada pabrik pupuk/amonia mewajibkan SIKA, pengukuran kadar oksigen/gas beracun, isolasi energi (LOTO), dan standby person siaga demi mencegah kecelakaan fatal dan mempertahankan Zero Accident.',
    },
    summaryBadge: 'Raihan Penghargaan Zero Accident (Kecelakaan Nihil) Berkelanjutan dari Kemenaker',
    quote: '"Tidak ada pekerjaan yang begitu penting sampai mengorbankan keselamatan nyawa manusia."',
  },
  {
    id: 5,
    category: 'Node 5: Teori AI, Supervised & Unsupervised Learning',
    shortTitle: 'Node 5: Landasan AI',
    categoryColor: '#a855f7',
    icon: <Cpu className="w-6 h-6 text-[#a855f7]" />,
    title: 'Definisi Kecerdasan Buatan, Supervised vs Unsupervised Learning',
    subtitle: 'Pemahaman Fondasi Cara Kerja Algoritma AI, Klasifikasi Data, dan Penerapan Sehari-hari',
    keyPoints: [
      {
        title: 'Definisi AI & Cara Kerjanya',
        desc: '• Definisi AI: Sistem komputasi cerdas yang meniru kemampuan kognitif manusia (menalar, belajar dari data, dan memecahkan masalah).\n• Data sebagai Bahan Bakar: Semakin berkualitas data yang diberikan, semakin akurat keputusan model AI.',
        icon: <Bot className="w-4 h-4 text-[#a855f7]" />,
      },
      {
        title: 'Supervised vs Unsupervised Learning',
        desc: '• Supervised (Berlabel): Dilatih dengan input + target jawaban.\n  → Contoh PKT: Prediksi kerusakan pompa (Predictive Maintenance), deteksi retak pipa dari foto kamera, deteksi fraud.\n• Unsupervised (Tanpa Label): Menemukan klaster/pola data.\n  → Contoh PKT: Klaster anomali konsumsi gas alam, segmentasi profil risiko vendor.',
        icon: <Database className="w-4 h-4 text-[#38bdf8]" />,
      },
      {
        title: 'Reinforcement AI & Contoh Sehari-hari',
        desc: '• Reinforcement Learning: Belajar melalui reward/penalti (misal: optimasi rute pelayaran kapal distribusi pupuk).\n• Contoh Nyata Kehidupan Sehari-hari:\n  - Rekomendasi YouTube, Netflix, & Spotify (Unsupervised/Filtering)\n  - Filter Spam Email & Face ID Smartphone (Supervised Classification)\n  - Navigasi Rute Cepat Google Maps (Graph & Reinforcement AI)',
        icon: <Sparkles className="w-4 h-4 text-[#facc15]" />,
      },
    ],
    exampleQuiz: {
      question: 'Dalam implementasi Machine Learning di industri petrokimia, manakah skenario yang tepat untuk penerapan metode "Supervised Learning" (Pembelajaran Terarah)?',
      options: [
        'A. Mengelompokkan vendor tanpa label profil risiko sama sekali',
        'B. Melatih model dengan data historis suhu/getaran berlabel untuk memprediksi kerusakan pompa pabrik (Predictive Maintenance)',
        'C. Membiarkan algoritma mencari klaster pola konsumsi gas tanpa data target',
        'D. Menghasilkan gambar acak untuk dekorasi presentasi'
      ],
      answer: 'B',
      explanation: 'Supervised Learning menggunakan data historis berlabel (misal: rekaman vibrasi normal vs anomali) untuk memprediksi kegagalan mesin sebelum terjadi breakdown, sehingga jadwal pemeliharaan pabrik dapat dilakukan secara prediktif.',
    },
    summaryBadge: 'Fondasi Teori Machine Learning untuk Otomasi & Efisiensi Industri Petrokimia',
    quote: '"Kecerdasan Buatan mengubah data mentah menjadi wawasan prediktif yang mendorong keputusan tepat."',
  },
  {
    id: 6,
    category: 'Node 6: AI Produktivitas, API RAG & Device Perekam Offline',
    shortTitle: 'Node 6: Tools & Device AI',
    categoryColor: '#f97316',
    icon: <Radio className="w-6 h-6 text-[#f97316]" />,
    title: 'Pemanfaatan AI Terkini: Tools Kerja, Integrasi API & Device Offline',
    subtitle: 'Tactiq, Copilot, Claude, Gemini, Arsitektur RAG Internal, serta PLAUD Note Perekam Fisik',
    keyPoints: [
      {
        title: 'Tools Rapat & Office AI',
        desc: '• Tactiq.io & AudioConvert: Transkripsi & MoM rapat otomatis di Meet/Zoom/Teams, konversi voice notes audit lapangan.\n• MS 365 Copilot & Claude Work: Draf SOP di Word, Risk Heatmap di Excel, slide di PPT, sintesis regulasi tebal ratusan halaman.',
        icon: <FileSpreadsheet className="w-4 h-4 text-[#f97316]" />,
      },
      {
        title: 'Integrasi API RAG Enterprise & Biaya',
        desc: '• Arsitektur RAG: Menghubungkan LLM ke dokumen internal PKT secara aman tanpa kebocoran data rahasia.\n• Biaya Token API: Gemini Flash ($0.075-$0.15/1M token ≈ Rp 1.200 - Rp 2.500), GPT-4o-mini ($0.15/1M token), Claude ($3/1M token).\n• ROI: Memangkas 80% verifikasi berkas, hemat 1.000+ jam/tahun (ROI 500-800%).',
        icon: <DollarSign className="w-4 h-4 text-[#facc15]" />,
      },
      {
        title: 'Device Perekam Offline & Komparasi LLM',
        desc: '• PLAUD NOTE / NotePin (~Rp 2,5jt - Rp 3jt): Perekam fisik offline nempel di HP/baju, dual-mic noise-canceling untuk audit inspeksi pabrik bising tanpa laptop.\n• Komparasi LLM: Claude (terbaik untuk hukum/audit ID) vs Gemini (Context Window 1-2 Juta token raksasa) vs ChatGPT (Voice Mode & Custom GPTs).',
        icon: <Radio className="w-4 h-4 text-[#38bdf8]" />,
      },
    ],
    exampleQuiz: {
      question: 'Mengapa arsitektur Retrieval-Augmented Generation (RAG) dan fitur Claude Cowork sangat disarankan untuk audit kepatuhan internal di Kompartemen Manajemen Risiko PKT?',
      options: [
        'A. Karena dapat menggantikan seluruh jajaran manajemen secara otomatis',
        'B. Menghubungkan model LLM ke dokumen internal PKT secara terenkripsi sehingga jawaban akurat berbasis fakta tanpa risiko kebocoran data rahasia',
        'C. Memungkinkan sistem AI menghapus berkas audit yang bermasalah secara mandiri',
        'D. Biaya pemakaiannya gratis tanpa membutuhkan infrastruktur server'
      ],
      answer: 'B',
      explanation: 'Arsitektur RAG membatasi jawaban AI hanya pada arsip dokumen internal perusahaan yang terverifikasi, sehingga mencegah halusinasi model AI serta menjamin keamanan data rahasia korporasi tetap terlindungi.',
    },
    summaryBadge: 'Otomasi Produktivitas Harian, Perekaman Audio Cerdas, dan Efisiensi Berkelanjutan',
    quote: '"Kombinasi AI software dan device perekam pintar melipatgandakan efisiensi operasional insan PKT."',
  },
  {
    id: 7,
    category: 'Node 7: EcoMove & Konservasi Lingkungan PKT',
    shortTitle: 'Node 7: EcoMove & Kehati',
    categoryColor: '#2dd4bf',
    icon: <Globe className="w-6 h-6 text-[#2dd4bf]" />,
    title: 'Program EcoMove, Sirkular Ekonomi & Konservasi Kehati Bontang',
    subtitle: 'Rehabilitasi Terumbu Karang, Hutan Mangrove, Budidaya Anggrek Hitam, dan Pemilahan Sampah',
    keyPoints: [
      {
        title: 'EcoMove Sirkular Ekonomi',
        desc: '• Pemilahan sampah dari sumber: Organik, Residu, dan Anorganik (Plastik PET, HDPE, Logam, Kertas).\n• Bank Sampah binaan Pupuk Kaltim untuk pemberdayaan masyarakat pesisir Bontang.',
        icon: <Leaf className="w-4 h-4 text-[#2dd4bf]" />,
      },
      {
        title: 'Konservasi Terumbu Karang & Mangrove',
        desc: '• Penurunan ribuan modul terumbu karang buatan di perairan Bontang untuk memulihkan biota laut.\n• Penanaman ratusan ribu bibit mangrove guna mitigasi abrasi dan penyerapan karbon biru (Blue Carbon).',
        icon: <Sparkles className="w-4 h-4 text-[#38bdf8]" />,
      },
      {
        title: 'Pelestarian Flora Endemik Anggrek Hitam',
        desc: '• Laboratorium kultur jaringan untuk pembudidayaan spesies langka Anggrek Hitam (Coelogyne pandurata).\n• Komitmen pelestarian keanekaragaman hayati (Kehati) bersertifikasi PROPER Emas.',
        icon: <Award className="w-4 h-4 text-[#facc15]" />,
      },
    ],
    exampleQuiz: {
      question: 'Program "EcoMove" dan Keanekaragaman Hayati (Kehati) PT Pupuk Kaltim di pesisir Bontang mencakup inisiatif pelestarian lingkungan berikut, YAITU:',
      options: [
        'A. Pembuangan residu sampah plastik langsung ke perairan laut terbuka',
        'B. Konservasi Terumbu Karang buatan, reboisasi Hutan Mangrove, budidaya Anggrek Hitam, dan pemilahan sampah plastik terintegrasi',
        'C. Penebangan pohon mangrove untuk perluasan area parkir kendaraan',
        'D. Penghentian program daur ulang limbah pabrik'
      ],
      answer: 'B',
      explanation: 'EcoMove dan program Kehati PKT berfokus pada ekonomi sirkular pemilahan sampah, rehabilitasi ekosistem terumbu karang perairan Bontang, penanaman mangrove, dan konservasi anggrek hitam yang mengantarkan raihan PROPER Emas.',
    },
    summaryBadge: 'Predikat PROPER Emas KemenLHK & Komitmen Keanekaragaman Hayati Berkelanjutan',
    quote: '"Harmonisasi industri petrokimia kelas dunia dengan kelestarian alam hayati pesisir Kalimantan."',
  },
];

export const LearningSlidesModal: React.FC<LearningSlidesModalProps> = ({ onClose, playerName = 'Insan Pupuk Kaltim' }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);
  const slide = SLIDES[currentSlideIndex];

  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    try {
      await downloadTutorialPDF(playerName || 'Insan Pupuk Kaltim');
    } catch (e) {
      console.error('Error downloading presentation PDF:', e);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : SLIDES.length - 1));
  };

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev < SLIDES.length - 1 ? prev + 1 : 0));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fade-in font-sans text-white select-none">
      <div className="bg-[#12231b] border-2 border-[#86efac] rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.9)] relative">
        
        {/* Header Bar */}
        <div className="bg-[#0b1611] border-b border-[#2d4d3e] px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="p-2 sm:p-2.5 bg-[#1a2e24] rounded-xl border border-[#86efac]/40 text-[#86efac] shrink-0">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-[#86efac]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-widest text-[#86efac] truncate">
                  Pedoman & Contoh Soal Kuis Per Node
                </span>
                <span className="text-[9px] sm:text-[10px] bg-[#2d4d3e] text-[#facc15] px-1.5 py-0.5 rounded font-mono font-bold shrink-0">
                  Slide {currentSlideIndex + 1}/{SLIDES.length}
                </span>
              </div>
              <h2 className="text-xs sm:text-sm md:text-base font-extrabold text-white tracking-wide truncate">
                {slide.category}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="bg-[#1a2e24] hover:bg-[#2d4d3e] text-[#86efac] border border-[#86efac]/50 font-mono font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md"
              title="Unduh slide presentasi 16:9 format PDF"
            >
              <Download className={`w-3.5 h-3.5 ${isDownloadingPdf ? 'animate-bounce text-[#facc15]' : ''}`} />
              <span className="hidden sm:inline">{isDownloadingPdf ? 'Membuat PDF...' : 'Unduh Slide PDF 16:9'}</span>
              <span className="sm:hidden">PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 text-slate-400 hover:text-white bg-[#1a2e24] hover:bg-[#2d4d3e] border border-[#2d4d3e] rounded-xl transition cursor-pointer shrink-0"
              title="Tutup Materi Belajar"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Slide Pagination Pills Header */}
        <div className="flex border-b border-[#2d4d3e] bg-[#0c1410] px-3 sm:px-6 py-2 gap-1.5 overflow-x-auto shrink-0 custom-scrollbar">
          {SLIDES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-mono font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                idx === currentSlideIndex
                  ? 'bg-[#86efac] text-black shadow-md shadow-[#86efac]/20'
                  : 'bg-[#162a21] text-slate-400 hover:text-slate-200 border border-[#2d4d3e]'
              }`}
            >
              <span className="opacity-75">{idx + 1}.</span>
              <span>{s.shortTitle}</span>
            </button>
          ))}
        </div>

        {/* Slide Content Body (Scrollable for mobile support) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5 text-slate-200 custom-scrollbar">
          {/* Title Banner */}
          <div className="bg-[#182c22] border border-[#2d4d3e] rounded-xl p-4 sm:p-5 shadow-inner">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="p-3 bg-[#0c1410] border border-[#86efac]/30 rounded-xl shrink-0 mt-0.5">
                {slide.icon}
              </div>
              <div className="min-w-0">
                <span
                  className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider block mb-0.5"
                  style={{ color: slide.categoryColor }}
                >
                  {slide.category}
                </span>
                <h3 className="text-base sm:text-lg md:text-xl font-black text-white leading-tight">
                  {slide.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                  {slide.subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Key Learning Points Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            {slide.keyPoints.map((point, pIdx) => (
              <div
                key={pIdx}
                className="bg-[#0e1a14] border border-[#2d4d3e] hover:border-[#86efac]/50 rounded-xl p-3.5 sm:p-4 transition flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {point.icon || <CheckCircle2 className="w-4 h-4 text-[#86efac]" />}
                    <h4 className="text-xs sm:text-sm font-bold text-white font-mono leading-snug">
                      {point.title}
                    </h4>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                    {point.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Dedicated Example Quiz Section */}
          <div className="bg-[#0b1812] border-2 border-[#facc15]/70 rounded-xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-[#2d4d3e]">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#facc15]" />
                <span className="font-mono text-xs sm:text-sm font-black text-[#facc15] uppercase tracking-wide">
                  💡 CONTOH SOAL KUIS TOWER (+50 POIN)
                </span>
              </div>
              <span className="text-[10px] font-mono bg-[#1a2e24] text-[#86efac] px-2 py-0.5 rounded border border-[#86efac]/40 font-bold">
                Kunci Jawaban: {slide.exampleQuiz.answer}
              </span>
            </div>

            <p className="text-xs sm:text-sm font-bold text-white mb-3 leading-snug">
              {slide.exampleQuiz.question}
            </p>

            {/* Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
              {slide.exampleQuiz.options.map((opt, oIdx) => {
                const isCorrect = opt.startsWith(slide.exampleQuiz.answer);
                return (
                  <div
                    key={oIdx}
                    className={`p-2.5 rounded-lg text-[11px] sm:text-xs font-mono transition flex items-start gap-2 border ${
                      isCorrect
                        ? 'bg-[#143322] border-[#86efac] text-[#86efac] font-bold shadow-sm'
                        : 'bg-[#080d0a] border-[#2d4d3e] text-slate-300'
                    }`}
                  >
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-black shrink-0 ${isCorrect ? 'bg-[#86efac] text-black' : 'bg-[#1a2e24] text-slate-400'}`}>
                      {opt.substring(0, 2)}
                    </span>
                    <span className="leading-snug">{opt.substring(3)}</span>
                  </div>
                );
              })}
            </div>

            {/* Explanation Box */}
            <div className="bg-[#080d0a] border border-[#2d4d3e] rounded-lg p-2.5 sm:p-3 text-[11px] sm:text-xs text-slate-300 flex items-start gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#facc15] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#86efac] font-mono mr-1">Pembahasan:</strong>
                <span>{slide.exampleQuiz.explanation}</span>
              </div>
            </div>
          </div>

          {/* Summary Badge & Quotation */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#080d0a] border border-[#2d4d3e] rounded-xl p-3.5 sm:p-4">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#86efac]">
              <Sparkles className="w-4 h-4 text-[#facc15] shrink-0" />
              <span>{slide.summaryBadge}</span>
            </div>
            {slide.quote && (
              <div className="text-[10px] sm:text-xs text-slate-400 italic font-mono text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-white/10">
                {slide.quote}
              </div>
            )}
          </div>
        </div>

        {/* Footer Navigation Bar */}
        <div className="bg-[#0b1611] border-t border-[#2d4d3e] px-4 sm:px-6 py-3 flex items-center justify-between shrink-0 gap-3">
          <button
            onClick={handlePrev}
            className="px-3 sm:px-4 py-2 bg-[#162a21] hover:bg-[#2d4d3e] text-white font-mono font-bold text-xs rounded-xl border border-[#2d4d3e] flex items-center gap-1.5 transition cursor-pointer shadow"
          >
            <ChevronLeft className="w-4 h-4 text-[#86efac]" />
            <span className="hidden sm:inline">Sebelumnya</span>
            <span className="sm:hidden">Prev</span>
          </button>

          {/* Progress Indicator Dots */}
          <div className="flex items-center gap-1.5">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlideIndex(i)}
                className={`transition-all rounded-full ${
                  i === currentSlideIndex
                    ? 'w-5 sm:w-6 h-2 bg-[#86efac]'
                    : 'w-2 h-2 bg-slate-600 hover:bg-slate-400'
                }`}
                title={`Lompat ke Slide ${i + 1}`}
              />
            ))}
          </div>

          {currentSlideIndex < SLIDES.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-3 sm:px-4 py-2 bg-[#86efac] hover:bg-[#86efac]/90 text-black font-mono font-extrabold text-xs rounded-xl border border-[#86efac] flex items-center gap-1.5 transition cursor-pointer shadow-lg"
            >
              <span className="hidden sm:inline">Lanjut Slide</span>
              <span className="sm:hidden">Next</span>
              <ChevronRight className="w-4 h-4 text-black" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-3 sm:px-4 py-2 bg-[#facc15] hover:bg-[#facc15]/90 text-black font-mono font-extrabold text-xs rounded-xl border border-[#facc15] flex items-center gap-1.5 transition cursor-pointer shadow-lg animate-pulse"
            >
              <span>Siap Tanding!</span>
              <ChevronRight className="w-4 h-4 text-black" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

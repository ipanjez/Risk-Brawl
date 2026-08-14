# 🥊 PKT Governance, Risk Management & ESG Brawler 🎮

Selamat datang di **PKT Governance, Risk Management & ESG Brawler**! Sebuah aplikasi game edukasi aksi platformer multipemain *real-time* (Real-Time Multiplayer 2D Arena Brawler) yang dirancang untuk pembelajaran interaktif mengenai Tata Kelola Perusahaan (GCG), Manajemen Risiko (ISO 31000), Sistem Manajemen Anti Penyuapan (SMAP ISO 37001), Ketahanan Siber & Audit, Kerangka Kerja ESG & Dekarbonisasi Net-Zero 2030, serta Pemanfaatan Artificial Intelligence (AI) di lingkungan **PT Pupuk Kalimantan Timur (PKT)**. 🚀🏆

Game ini menggabungkan mekanisme aksi arena pertarungan yang kompetitif, kuis tantangan *Knowledge Tower*, pengumpulan *Eco-Tokens*, perebutan senjata *Power-Up*, hingga penerbitan sertifikat kelulusan PDF resmi secara otomatis. Dirancang dengan visual modern, performa tinggi 60 FPS, serta dukungan jaringan lokal (LAN) maupun *online*. 🌿⚡

---

## ✨ Fitur Unggulan

- 🎮 **Real-Time Multiplayer Arena (WebSocket 60 FPS):** Pertarungan aksi *real-time* mulus dengan sinkronisasi posisi, pergerakan, proyektil senjata, sistem serang, dan reaksi *emote* percakapan antar pemain di jaringan LAN maupun internet.
- 🧠 **7 Knowledge Towers & 84 Bank Soal Terstandar:** Menjelajahi 7 menara ilmu tata kelola dengan 84 butir soal berbobot tinggi. Didesain secara psikometris dengan panjang opsi jawaban yang seimbang dan distribusi kunci merata (25% untuk A, B, C, D) sehingga pemain tidak dapat menebak jawaban hanya dari panjang teks.
- 👑 **Sistem Otoritas Host Dinamis & Persisten:** Pemain pertama yang memasuki ruang tunggu sesi otomatis diangkat sebagai **Host** dengan wewenang mengatur durasi pertandingan (5–30 menit), memilih tata letak arena, mengganti tema visual, dan memulai permainan. Status Host ini bertahan sepanjang sesi pertandingan meskipun sempat terputus koneksi (otomatis memulihkan hak Host saat bergabung kembali).
- 🏗️ **4 Layout Platform & Crumbling Mechanics:** Pilihan tata letak arena fleksibel (*3-Tier Lini Standar, Piramida Bertingkat, Menara Kembar, Kepulauan Mengambang*) dilengkapi platform dinamis yang dapat berguncang dan runtuh saat diinjak (*Crumbling Platform*).
- 🎨 **4 Tema Visual Dinamis (Thematic Maps):** 
  - 🟢 **Petrokimia Hijau Klasik:** Suasana pabrik amoniak & urea PKT standar.
  - 🟣 **Cyberpunk Net-Zero 2060:** Suasana masa depan dekarbonisasi neon & AI grid.
  - 🔵 **Eco-Marine Pesisir Bontang:** Nuansa konservasi terumbu karang & samudera pesisir.
  - 🟠 **Sunset Solaris Decarb:** Kehangatan senja PLTS atap & transisi energi terbarukan.
- 🥋 **Kustomisasi Avatar APD K3:** Personalisasi karakter lengkap dengan helm keselamatan K3, kacamata pelindung (*eyewear*), pakaian operasional lini, sepatu safety, gaya rambut, dan warna avatar.
- ⚔️ **Sistem Senjata Power-Up & ESG Tokens:** Kumpulkan *Eco-Tokens* untuk poin ESG, serta rebut senjata bertema tata kelola (*Compliance Sword, Risk Hammer, Beam Rifle, Decarb Blaster, ESG Shield*).
- 📜 **Penerbitan Sertifikat PDF Otomatis:** Menghasilkan sertifikat kelulusan beresolusi tinggi (A4 Landscape) lengkap dengan nama peserta, total skor, peringkat podium, dan tanda tangan digital resmi yang dapat langsung diunduh setelah pertandingan selesai.
- 📱 **Desain Responsif & On-Screen Touch Controls:** Mendukung perangkat Desktop (Keyboard) dan Mobile/Tablet dengan tombol D-Pad joystick sentuh, kontrol melompat, menyerang, interaksi kuis, dan orientasi layar *landscape helper*.
- 📖 **Modul Pembelajaran & Slide Interaktif:** Akses cepat ke materi edukasi Tata Kelola, Tiga Lini Pertahanan, ERM ISO 31000, SMAP ISO 37001, Cyber Security, dan ESG langsung di dalam aplikasi.

---

## 🛠️ Tech Stack

| Teknologi | Fungsi & Peran |
|-----------|----------------|
| **React 19 & TypeScript** | Komponen UI reaktif, manajemen *state*, dan *type-safety* |
| **HTML5 Canvas 2D API** | *Rendering engine* fisika grafis 60 FPS dan sistem partikel |
| **Node.js, Express & ws** | Server backend WebSocket *real-time* & *state sync manager* |
| **Vite** | *High-performance build tool* dan *bundler* |
| **jsPDF** | Pembuat dokumen Sertifikat Kelulusan PDF A4 otomatis |
| **Web Audio API** | Efek suara interaktif (*SFX*) dinamis tanpa dependensi aset audio eksternal |
| **Lucide React** | Ikon modern untuk UI, D-Pad, dan status indikator |
| **Vanilla CSS** | Desain bertema *Glassmorphism*, palet HSL gelap, dan animasi transisi |

---

## 🚀 Cara Penggunaan & Instalasi

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di perangkat lokal atau jaringan kantor:

### 1. Clone Repositori
```bash
git clone https://github.com/ipanjez/Risk-Brawl.git
cd Risk-Brawl
```

### 2. Instal Dependensi
```bash
npm install
```

### 3. Konfigurasi Lingkungan (Opsional)
Buat file `.env.local` di *root folder* proyek (Anda dapat menyalin dari `.env.example`):
```env
GEMINI_API_KEY="ISI_API_KEY_ANDA_DI_SINI"
APP_URL="http://localhost:3000"
```

### 4. Jalankan Server Pengembangan
```bash
npm run dev
```

### 5. Akses Aplikasi
- **Dari Komputer Sendiri (Host / Localhost):** Buka browser dan kunjungi `http://localhost:3000`
- **Dari Perangkat Lain / Mobile (Jaringan LAN / Wi-Fi yang Sama):** Buka browser dan akses alamat IP komputer host, contoh: `http://192.168.1.10:3000` atau `http://10.127.30.151:3000`

> 💡 **Tips Mengetahui IP Komputer:** Jalankan perintah `ipconfig` di Command Prompt (Windows) atau `ifconfig` di Terminal (Mac/Linux). Alamat IP jaringan lokal juga ditampilkan secara otomatis pada layar utama pembuatan karakter.

---

## 🎮 Panduan Kontrol & Mekanik Permainan

### ⌨️ Kontrol Keyboard & Layar Sentuh

| Aksi | Keyboard PC | Tombol Mobile / Touchscreen |
|------|-------------|-----------------------------|
| **Gerak Kiri** | `A` atau `Panah Kiri` | Tombol D-Pad `◀` (Tekan Tahan) |
| **Gerak Kanan** | `D` atau `Panah Kanan` | Tombol D-Pad `▶` (Tekan Tahan) |
| **Lompat / Double Jump** | `W`, `Panah Atas`, atau `Spasi` | Tombol Biru `▲` |
| **Menyerang / Serangan Senjata** | `J` atau `F` | Tombol Merah `⚡` (Serang) |
| **Interaksi Kuis Knowledge Tower** | `E` | Tombol Kuning `[E] Mulai Kuis` |
| **Kirim Emote Reaksi Cepat** | `T` | Tombol Emote `💬` (🛡️ / ⚡ / 🌿) |

---

### 🏆 Sistem Penghitungan Skor

Skor total akhir dihitung berdasarkan akumulasi performa komprehensif:

$$\text{Total Skor} = \text{Knowledge Score} + (\text{K.O. Count} \times 30) + \text{ESG Score}$$

- 📘 **Knowledge Score (+50 Poin):** Diperoleh saat menjawab benar kuis *Knowledge Tower* (Jawaban salah dikenakan penalti -10 Poin & *knockback*).
- 🥊 **K.O. Points (+30 Poin):** Diperoleh saat berhasil menumbangkan lawan dalam pertarungan arena.
- 🌿 **ESG Score (+20 Poin):** Diperoleh saat mengambil *Eco-Tokens* hijau yang tersebar di arena.

---

## 🏛️ Struktur 7 Knowledge Towers

| Node | Kategori Materi | Fokus Pembelajaran |
|------|-----------------|--------------------|
| **Node 1** | *Three Lines Model & Governance* | Lini 1 (Operasional), Lini 2 (MR & Kepatuhan), Lini 3 (SPI/Audit), Direksi & Dekom |
| **Node 2** | *Enterprise Risk Management (ERM)* | ISO 31000, Risk Appetite, Matriks Risiko, Key Risk Indicator (KRI), Root Cause Analysis |
| **Node 3** | *Tata Kelola GCG & SMAP* | Prinsip TARIF, ISO 37001, Whistleblowing System (WBS), UPG Gratifikasi, Pakta Integritas |
| **Node 4** | *Audit Internal & Cyber Security* | Audit Berbasis Risiko, ISO 27001 CIA Triad, Keamanan SCADA/OT, Anti-Phishing, DRP |
| **Node 5** | *ESG Framework & Dekarbonisasi* | Scope 1 2 3 Emissions, Carbon Capture & Storage (CCUS), Green Ammonia, Proper Emas |
| **Node 6** | *Penerapan AI & GenAI di Industri* | Predictive Maintenance, Digital Twin, Etika AI & Data Privacy, Human-in-the-Loop |
| **Node 7** | *Konservasi Kehati & Eco-Move* | Terumbu Karang Bontang, Hutan Mangrove, Bank Sampah Eco-Move, Inklusi Sosial |

---

## 🔄 Arsitektur Jaringan Real-Time

```
┌─────────────────────────────────────────────────────────┐
│                    KLIEN BROWSER                        │
│  ┌───────────────────────┐   ┌───────────────────────┐  │
│  │   React UI & HUD      │   │   HTML5 Canvas 2D     │  │
│  │  (Leaderboard, Quiz,  │   │  (Physics, Particle,  │  │
│  │   Certificate Modal)  │   │   Sprites, Platforms) │  │
│  └───────────┬───────────┘   └───────────▲───────────┘  │
│              │                           │              │
│              ▼                           │              │
│  ┌───────────────────────────────────────┴───────────┐  │
│  │              LocalSessionManager                  │  │
│  │    (State Machine, Quiz Engine, Audio Engine)     │  │
│  └───────────────────────▲───────────────────────────┘  │
└──────────────────────────┼──────────────────────────────┘
                           │ WebSocket (ws:// / /ws/brawler)
                           ▼
┌─────────────────────────────────────────────────────────┐
│               NODE.JS EXPRESS SERVER                    │
│  ┌───────────────────────────────────────────────────┐  │
│  │             WebSocket Server (WSS)                │  │
│  │  - Dynamic First-Player Host Authorization        │  │
│  │  - Persistent Session & Reconnect Preservation    │  │
│  │  - Dynamic Map Layout & Theme Broadcaster         │  │
│  │  - Position & Action Interpolation Relayer        │  │
│  │  - Match Timer & Score Lifecycle Coordinator      │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 📄 Lisensi & Hak Cipta

Dikembangkan untuk **PT Pupuk Kalimantan Timur** — *Kompartemen Tata Kelola & Manajemen Risiko*.  
Didedikasikan untuk edukasi kepatuhan, penguatan budaya sadar risiko, dan pencapaian target Net-Zero Emission ESG 2030. 🌾🇲🇨

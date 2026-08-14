import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import logoTkmr from '../assets/logo-tkmr.png';

/**
 * Robust, self-contained PDF generator for the 16:9 Widescreen Presentation Slide Deck.
 * Builds an isolated staging container with all 9 slides in full 16:9 HD (1280x720),
 * complete with example quiz questions and explanations for every node.
 */
export async function downloadTutorialPDF(playerName: string = 'Insan Pupuk Kaltim'): Promise<void> {
  const slideWidth = 297;
  const slideHeight = 167.0625; // Exact 16:9 ratio

  // 1. Create a dedicated offscreen staging container
  const staging = document.createElement('div');
  staging.id = 'pdf-render-staging';
  staging.style.position = 'fixed';
  staging.style.left = '0';
  staging.style.top = '0';
  staging.style.zIndex = '-99999';
  staging.style.opacity = '1';
  staging.style.pointerEvents = 'none';
  staging.style.width = '1280px';
  staging.style.background = '#070e0a';
  staging.style.color = '#ffffff';
  staging.style.fontFamily = 'system-ui, -apple-system, sans-serif';

  // 2. Define the 9 high-definition 16:9 slide HTML contents
  const slidesHtml = [
    // Slide 1: Cover & Sambutan
    `
    <div class="slide-item" style="width: 1280px; height: 720px; box-sizing: border-box; background: #070e0a; border: 5px solid #facc15; padding: 36px 48px; display: flex; flex-direction: column; justify-content: space-between;">
      <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #2d4d3e; padding-bottom: 14px;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <img src="${logoTkmr}" style="width: 52px; height: 52px; object-fit: contain;" />
          <div>
            <span style="font-family: monospace; font-size: 13px; font-weight: bold; color: #86efac; letter-spacing: 2px; text-transform: uppercase;">PT PUPUK KALIMANTAN TIMUR — KOMPARTEMEN TKMR</span>
            <h2 style="margin: 2px 0 0 0; font-size: 20px; font-weight: 900; color: #facc15; letter-spacing: 1px;">BUKU PANDUAN EKSEKUTIF 16:9 • RISK BRAWLER PKT</h2>
          </div>
        </div>
        <span style="font-family: monospace; font-size: 14px; font-weight: bold; background: #1a2e24; color: #86efac; padding: 6px 16px; border-radius: 10px; border: 1px solid #2d4d3e;">SLIDE 01 / 09</span>
      </div>

      <div style="background: linear-gradient(135deg, #12281e, #1a3a2d, #12281e); border: 2px solid #facc15; border-radius: 24px; padding: 28px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
        <img src="${logoTkmr}" style="width: 72px; height: 72px; margin: 0 auto 10px auto; object-fit: contain;" />
        <span style="font-family: monospace; font-size: 13px; font-weight: 800; color: #86efac; letter-spacing: 3px; text-transform: uppercase;">EDISI RESMI SMART FRIDAY 2026</span>
        <h1 style="margin: 6px 0 0 0; font-size: 32px; font-weight: 900; color: #ffffff; letter-spacing: 1px;">PANDUAN LENGKAP & MODUL EDUKASI RISK BRAWLER</h1>
        <p style="margin: 8px auto 0 auto; font-size: 15px; color: #86efac; max-width: 900px; line-height: 1.5;">Platform Gamifikasi Tata Kelola (GCG), ISO 31000 ERM, SMAP ISO 37001, ESG Dekarbonisasi & AI Enterprise</p>
        <div style="display: inline-block; margin-top: 14px; background: rgba(0,0,0,0.75); border: 1.5px solid #facc15; padding: 8px 24px; border-radius: 999px; font-size: 15px; font-weight: bold; color: #facc15; font-family: monospace;">
          ★ Selamat Datang di Risk Brawler, ${playerName}! ★
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;">
        <div style="background: #12231b; border: 1.5px solid #2d4d3e; border-radius: 16px; padding: 14px; text-align: center;">
          <strong style="display: block; font-size: 14px; color: #86efac; margin-bottom: 4px;">1. Arena Brawler 2D</strong>
          <p style="margin: 0; font-size: 12px; color: #cbd5e1; line-height: 1.4;">Duel taktis real-time menguji ketangkasan & tata kelola risiko.</p>
        </div>
        <div style="background: #12231b; border: 1.5px solid #2d4d3e; border-radius: 16px; padding: 14px; text-align: center;">
          <strong style="display: block; font-size: 14px; color: #facc15; margin-bottom: 4px;">2. Knowledge Tower</strong>
          <p style="margin: 0; font-size: 12px; color: #cbd5e1; line-height: 1.4;">Kuis node +50 poin, tanpa repetisi soal, tower redup saat selesai.</p>
        </div>
        <div style="background: #12231b; border: 1.5px solid #2d4d3e; border-radius: 16px; padding: 14px; text-align: center;">
          <strong style="display: block; font-size: 14px; color: #38bdf8; margin-bottom: 4px;">3. Mabar Wi-Fi LAN</strong>
          <p style="margin: 0; font-size: 12px; color: #cbd5e1; line-height: 1.4;">Multi-device Laptop & HP tanpa instalasi via URL IP server.</p>
        </div>
        <div style="background: #12231b; border: 1.5px solid #2d4d3e; border-radius: 16px; padding: 14px; text-align: center;">
          <strong style="display: block; font-size: 14px; color: #4ade80; margin-bottom: 4px;">4. Sertifikat Digital</strong>
          <p style="margin: 0; font-size: 12px; color: #cbd5e1; line-height: 1.4;">Unduh Sertifikat PDF resmi diterbitkan langsung oleh TKMR PKT.</p>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; font-family: monospace; font-size: 11px; color: #64748b; border-top: 1px solid #2d4d3e; padding-top: 10px;">
        <span>Kompartemen Tata Kelola & Manajemen Risiko — PT Pupuk Kalimantan Timur</span>
        <span>Peserta: ${playerName}</span>
      </div>
    </div>
    `,

    // Slide 2: Kontrol PC vs HP
    `
    <div class="slide-item" style="width: 1280px; height: 720px; box-sizing: border-box; background: #070e0a; border: 5px solid #86efac; padding: 36px 48px; display: flex; flex-direction: column; justify-content: space-between;">
      <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #2d4d3e; padding-bottom: 14px;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <img src="${logoTkmr}" style="width: 52px; height: 52px; object-fit: contain;" />
          <div>
            <span style="font-family: monospace; font-size: 13px; font-weight: bold; color: #86efac; letter-spacing: 2px; text-transform: uppercase;">PANDUAN KONTROL MULTI-DEVICE</span>
            <h2 style="margin: 2px 0 0 0; font-size: 20px; font-weight: 900; color: #facc15;">KONTROL KEYBOARD (LAPTOP/PC) VS KONTROL SENTUH HP</h2>
          </div>
        </div>
        <span style="font-family: monospace; font-size: 14px; font-weight: bold; background: #1a2e24; color: #86efac; padding: 6px 16px; border-radius: 10px; border: 1px solid #2d4d3e;">SLIDE 02 / 09</span>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 28px; margin: auto 0;">
        <div style="background: #12231b; border: 2px solid #86efac; border-radius: 20px; padding: 22px; box-shadow: 0 8px 25px rgba(0,0,0,0.4);">
          <h3 style="margin: 0 0 14px 0; font-family: monospace; font-size: 15px; font-weight: 900; color: #86efac; border-bottom: 1px solid #2d4d3e; padding-bottom: 8px;">⌨️ KONTROL KEYBOARD (LAPTOP / PC)</h3>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="background: #080d0a; border: 1px solid #2d4d3e; border-radius: 14px; padding: 10px 14px; display: flex; align-items: center; gap: 16px;">
              <span style="font-family: monospace; font-weight: 900; font-size: 14px; background: #1a2e24; border: 2px solid #86efac; color: #86efac; padding: 6px 12px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.5);">[A] [D]</span>
              <div>
                <strong style="display: block; font-size: 14px; color: #ffffff;">Jalan Kiri / Kanan</strong>
                <span style="font-size: 12px; color: #94a3b8;">Menjelajahi arena & bermanuver di atas platform pabrik.</span>
              </div>
            </div>
            <div style="background: #080d0a; border: 1px solid #2d4d3e; border-radius: 14px; padding: 10px 14px; display: flex; align-items: center; gap: 16px;">
              <span style="font-family: monospace; font-weight: 900; font-size: 14px; background: #1a2e24; border: 2px solid #38bdf8; color: #38bdf8; padding: 6px 12px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.5);">[W] / [↑]</span>
              <div>
                <strong style="display: block; font-size: 14px; color: #ffffff;">Lompat & Double Jump</strong>
                <span style="font-size: 12px; color: #94a3b8;">Tekan 2x di udara untuk mencapai platform bertingkat atas.</span>
              </div>
            </div>
            <div style="background: #080d0a; border: 1px solid #2d4d3e; border-radius: 14px; padding: 10px 14px; display: flex; align-items: center; gap: 16px;">
              <span style="font-family: monospace; font-weight: 900; font-size: 14px; background: #450a0a; border: 2px solid #ef4444; color: #f87171; padding: 6px 12px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.5);">[Z] / [Spasi]</span>
              <div>
                <strong style="display: block; font-size: 14px; color: #ffffff;">Serang Lawan (Attack)</strong>
                <span style="font-size: 12px; color: #94a3b8;">Pukulan tinju audit atau tembakan proyektil senjata aktif.</span>
              </div>
            </div>
            <div style="background: #080d0a; border: 1px solid #2d4d3e; border-radius: 14px; padding: 10px 14px; display: flex; align-items: center; gap: 16px;">
              <span style="font-family: monospace; font-weight: 900; font-size: 14px; background: #451a03; border: 2px solid #f59e0b; color: #fcd34d; padding: 6px 14px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.5);">[E]</span>
              <div>
                <strong style="display: block; font-size: 14px; color: #ffffff;">Interaksi Kuis Tower</strong>
                <span style="font-size: 12px; color: #94a3b8;">Membuka popup soal kuis saat berada dekat Knowledge Tower.</span>
              </div>
            </div>
          </div>
        </div>

        <div style="background: #12231b; border: 2px solid #38bdf8; border-radius: 20px; padding: 22px; box-shadow: 0 8px 25px rgba(0,0,0,0.4);">
          <h3 style="margin: 0 0 14px 0; font-family: monospace; font-size: 15px; font-weight: 900; color: #38bdf8; border-bottom: 1px solid #2d4d3e; padding-bottom: 8px;">📱 KONTROL SENTUH HP (PORTRAIT & LANDSCAPE)</h3>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="background: #080d0a; border: 1px solid #2d4d3e; border-radius: 14px; padding: 10px 14px; display: flex; align-items: center; gap: 16px;">
              <div style="display: flex; gap: 6px;">
                <span style="width: 32px; height: 32px; background: #1a2e24; border: 2px solid #38bdf8; color: #38bdf8; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-family: monospace;">&lt;</span>
                <span style="width: 32px; height: 32px; background: #1a2e24; border: 2px solid #38bdf8; color: #38bdf8; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-family: monospace;">&gt;</span>
              </div>
              <div>
                <strong style="display: block; font-size: 14px; color: #ffffff;">D-Pad Tekan Tahan (Continuous Hold)</strong>
                <span style="font-size: 12px; color: #94a3b8;">Tahan jari pada tombol untuk melangkah mulus tanpa jeda.</span>
              </div>
            </div>
            <div style="background: #080d0a; border: 1px solid #2d4d3e; border-radius: 14px; padding: 10px 14px; display: flex; align-items: center; gap: 16px;">
              <span style="width: 34px; height: 34px; background: #172554; border: 2px solid #60a5fa; color: #60a5fa; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-family: monospace;">^</span>
              <div>
                <strong style="display: block; font-size: 14px; color: #ffffff;">Tombol Lompat Biru</strong>
                <span style="font-size: 12px; color: #94a3b8;">Ketuk 2x untuk manuver Double Jump di atas rintangan.</span>
              </div>
            </div>
            <div style="background: #080d0a; border: 1px solid #2d4d3e; border-radius: 14px; padding: 10px 14px; display: flex; align-items: center; gap: 16px;">
              <span style="width: 34px; height: 34px; background: #450a0a; border: 2px solid #ef4444; color: #f87171; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 900;">⚡</span>
              <div>
                <strong style="display: block; font-size: 14px; color: #ffffff;">Tombol Serang Merah</strong>
                <span style="font-size: 12px; color: #94a3b8;">Ketuk untuk melancarkan serangan tinju / tembakan proyektil.</span>
              </div>
            </div>
            <div style="background: #080d0a; border: 1px solid #2d4d3e; border-radius: 14px; padding: 10px 14px; display: flex; align-items: center; gap: 16px;">
              <span style="width: 34px; height: 34px; background: #451a03; border: 2px solid #f59e0b; color: #fcd34d; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 900;">❓</span>
              <div>
                <strong style="display: block; font-size: 14px; color: #ffffff;">Tombol Kuis Kuning (Interact)</strong>
                <span style="font-size: 12px; color: #94a3b8;">Otomatis aktif berdenyut ketika berada di dekat Tower Kuis.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; font-family: monospace; font-size: 11px; color: #64748b; border-top: 1px solid #2d4d3e; padding-top: 10px;">
        <span>Kompartemen Tata Kelola & Manajemen Risiko — PT Pupuk Kalimantan Timur</span>
        <span>Peserta: ${playerName}</span>
      </div>
    </div>
    `,

    // Slide 3: Host & Mabar Wi-Fi
    `
    <div class="slide-item" style="width: 1280px; height: 720px; box-sizing: border-box; background: #070e0a; border: 5px solid #38bdf8; padding: 36px 48px; display: flex; flex-direction: column; justify-content: space-between;">
      <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #2d4d3e; padding-bottom: 14px;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <img src="${logoTkmr}" style="width: 52px; height: 52px; object-fit: contain;" />
          <div>
            <span style="font-family: monospace; font-size: 13px; font-weight: bold; color: #38bdf8; letter-spacing: 2px; text-transform: uppercase;">JARINGAN & MULTIPLAYER LAN</span>
            <h2 style="margin: 2px 0 0 0; font-size: 20px; font-weight: 900; color: #facc15;">PERAN HOST, WI-FI LAN LOKAL & FITUR REKONEKSI OTOMATIS</h2>
          </div>
        </div>
        <span style="font-family: monospace; font-size: 14px; font-weight: bold; background: #1a2e24; color: #86efac; padding: 6px 16px; border-radius: 10px; border: 1px solid #2d4d3e;">SLIDE 03 / 09</span>
      </div>

      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: auto 0;">
        <div style="background: #12231b; border: 2px solid #facc15; border-radius: 18px; padding: 18px; box-shadow: 0 6px 20px rgba(0,0,0,0.4);">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px; border-bottom: 1px solid #2d4d3e; padding-bottom: 6px;">
            <span style="font-size: 18px;">👑</span>
            <h3 style="margin: 0; font-size: 14px; font-weight: 900; color: #facc15;">1. KENDALI PENUH HOST</h3>
          </div>
          <p style="margin: 0; font-size: 12px; color: #cbd5e1; line-height: 1.6;">
            • Mengatur durasi pertandingan (5, 10, atau 15 Menit).<br/>
            • Memulai hitung mundur sesi (3-2-1 Mulai).<br/>
            • Menghentikan laga darurat kapan saja.
          </p>
        </div>

        <div style="background: #12231b; border: 2px solid #38bdf8; border-radius: 18px; padding: 18px; box-shadow: 0 6px 20px rgba(0,0,0,0.4);">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px; border-bottom: 1px solid #2d4d3e; padding-bottom: 6px;">
            <span style="font-size: 18px;">🌐</span>
            <h3 style="margin: 0; font-size: 14px; font-weight: 900; color: #38bdf8;">2. MABAR WI-FI LAN</h3>
          </div>
          <p style="margin: 0; font-size: 12px; color: #cbd5e1; line-height: 1.6;">
            • Sambungkan seluruh device ke Wi-Fi / Hotspot yang sama.<br/>
            • Buka browser HP/Laptop: <strong>http://10.127.30.151:3000</strong>.<br/>
            • Langsung masuk arena tanpa instalasi software!
          </p>
        </div>

        <div style="background: #12231b; border: 2px solid #4ade80; border-radius: 18px; padding: 18px; box-shadow: 0 6px 20px rgba(0,0,0,0.4);">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px; border-bottom: 1px solid #2d4d3e; padding-bottom: 6px;">
            <span style="font-size: 18px;">⚡</span>
            <h3 style="margin: 0; font-size: 14px; font-weight: 900; color: #4ade80;">3. REKONEKSI PRESISI</h3>
          </div>
          <p style="margin: 0; font-size: 12px; color: #cbd5e1; line-height: 1.6;">
            • Saat terputus/refresh, karakter hilang otomatis.<br/>
            • Saat masuk kembali, posisi koordinat, sisa HP, dan skor langsung dipulihkan 100%.
          </p>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; font-family: monospace; font-size: 11px; color: #64748b; border-top: 1px solid #2d4d3e; padding-top: 10px;">
        <span>Kompartemen Tata Kelola & Manajemen Risiko — PT Pupuk Kalimantan Timur</span>
        <span>Peserta: ${playerName}</span>
      </div>
    </div>
    `,

    // Slide 4: Sistem Skor & Tower
    `
    <div class="slide-item" style="width: 1280px; height: 720px; box-sizing: border-box; background: #070e0a; border: 5px solid #facc15; padding: 36px 48px; display: flex; flex-direction: column; justify-content: space-between;">
      <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #2d4d3e; padding-bottom: 14px;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <img src="${logoTkmr}" style="width: 52px; height: 52px; object-fit: contain;" />
          <div>
            <span style="font-family: monospace; font-size: 13px; font-weight: bold; color: #facc15; letter-spacing: 2px; text-transform: uppercase;">MEKANIK ARENA & LEADERBOARD</span>
            <h2 style="margin: 2px 0 0 0; font-size: 20px; font-weight: 900; color: #ffffff;">SISTEM SKORING, KUIS TOWER & SPAWN SENJATA SPESIAL</h2>
          </div>
        </div>
        <span style="font-family: monospace; font-size: 14px; font-weight: bold; background: #1a2e24; color: #86efac; padding: 6px 16px; border-radius: 10px; border: 1px solid #2d4d3e;">SLIDE 04 / 09</span>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 28px; margin: auto 0;">
        <div style="background: #12231b; border: 2px solid #86efac; border-radius: 20px; padding: 22px; box-shadow: 0 8px 25px rgba(0,0,0,0.4);">
          <h3 style="margin: 0 0 14px 0; font-family: monospace; font-size: 15px; font-weight: 900; color: #86efac; border-bottom: 1px solid #2d4d3e; padding-bottom: 8px;">📊 PERHITUNGAN SKOR AKHIR</h3>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <div style="background: #080d0a; border: 1px solid #2d4d3e; border-radius: 12px; padding: 8px 14px; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 13px; color: #ffffff;">✅ Jawab Kuis Benar di Tower</span>
              <span style="font-family: monospace; font-weight: 900; font-size: 14px; color: #86efac;">+50 Poin</span>
            </div>
            <div style="background: #080d0a; border: 1px solid #2d4d3e; border-radius: 12px; padding: 8px 14px; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 13px; color: #ffffff;">❌ Jawab Salah / Waktu Habis</span>
              <span style="font-family: monospace; font-weight: 900; font-size: 14px; color: #f87171;">-10 Poin & Knockback</span>
            </div>
            <div style="background: #080d0a; border: 1px solid #2d4d3e; border-radius: 12px; padding: 8px 14px; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 13px; color: #ffffff;">🍃 Ambil ESG Eco Leaf Token</span>
              <span style="font-family: monospace; font-weight: 900; font-size: 14px; color: #4ade80;">+20 Poin</span>
            </div>
            <div style="background: #080d0a; border: 1px solid #2d4d3e; border-radius: 12px; padding: 8px 14px; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 13px; color: #ffffff;">💥 Mengeliminasi Lawan (K.O)</span>
              <span style="font-family: monospace; font-weight: 900; font-size: 14px; color: #facc15;">+30 Poin</span>
            </div>
          </div>
        </div>

        <div style="background: #12231b; border: 2px solid #facc15; border-radius: 20px; padding: 22px; box-shadow: 0 8px 25px rgba(0,0,0,0.4);">
          <h3 style="margin: 0 0 14px 0; font-family: monospace; font-size: 15px; font-weight: 900; color: #facc15; border-bottom: 1px solid #2d4d3e; padding-bottom: 8px;">🏛️ ATURAN KNOWLEDGE TOWER</h3>
          <p style="font-size: 13px; color: #cbd5e1; line-height: 1.6; margin: 0 0 12px 0;">
            • Setiap Tower Kuis mewakili materi edukasi spesifik.<br/>
            • <strong>Tanpa Repetisi Soal:</strong> Setiap soal unik dan tidak akan berulang.<br/>
            • Menjawab benar akan <strong>membuka Senjata Spesial</strong> (Hammer, Sword, Shield, Blaster) dengan damage & knockback tinggi!
          </p>
          <div style="background: #080d0a; border: 1px solid #facc15; border-radius: 12px; padding: 10px; text-align: center; font-family: monospace; font-size: 12px; color: #facc15;">
            ★ Tower akan otomatis redup saat bank soal Anda di node tersebut selesai! ★
          </div>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; font-family: monospace; font-size: 11px; color: #64748b; border-top: 1px solid #2d4d3e; padding-top: 10px;">
        <span>Kompartemen Tata Kelola & Manajemen Risiko — PT Pupuk Kalimantan Timur</span>
        <span>Peserta: ${playerName}</span>
      </div>
    </div>
    `,

    // Slide 5: Daftar 6 Senjata
    `
    <div class="slide-item" style="width: 1280px; height: 720px; box-sizing: border-box; background: #070e0a; border: 5px solid #c084fc; padding: 36px 48px; display: flex; flex-direction: column; justify-content: space-between;">
      <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #2d4d3e; padding-bottom: 14px;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <img src="${logoTkmr}" style="width: 52px; height: 52px; object-fit: contain;" />
          <div>
            <span style="font-family: monospace; font-size: 13px; font-weight: bold; color: #c084fc; letter-spacing: 2px; text-transform: uppercase;">ARSENAL TAKTIS AUDITOR</span>
            <h2 style="margin: 2px 0 0 0; font-size: 20px; font-weight: 900; color: #facc15;">6 SENJATA INDUSTRI LENGKAP DENGAN BATAS AMUNISI</h2>
          </div>
        </div>
        <span style="font-family: monospace; font-size: 14px; font-weight: bold; background: #1a2e24; color: #86efac; padding: 6px 16px; border-radius: 10px; border: 1px solid #2d4d3e;">SLIDE 05 / 09</span>
      </div>

      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: auto 0;">
        <div style="background: #12231b; border: 2px solid #38bdf8; border-radius: 18px; padding: 18px; box-shadow: 0 6px 20px rgba(0,0,0,0.4);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 15px; font-weight: bold; color: #38bdf8;">🔫 Laser Beam Rifle</span>
            <span style="font-family: monospace; font-size: 12px; font-weight: bold; background: #082f49; color: #7dd3fc; padding: 3px 8px; border-radius: 6px; border: 1px solid #0284c7;">8 Ammo</span>
          </div>
          <p style="margin: 0; font-size: 12px; color: #cbd5e1; line-height: 1.5;">Tembakan proyektil laser jarak jauh berkecepatan tinggi melumpuhkan musuh dari jauh.</p>
        </div>

        <div style="background: #12231b; border: 2px solid #f59e0b; border-radius: 18px; padding: 18px; box-shadow: 0 6px 20px rgba(0,0,0,0.4);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 15px; font-weight: bold; color: #fcd34d;">🔨 Risk Audit Hammer</span>
            <span style="font-family: monospace; font-size: 12px; font-weight: bold; background: #451a03; color: #fde68a; padding: 3px 8px; border-radius: 6px; border: 1px solid #d97706;">5 Ammo</span>
          </div>
          <p style="margin: 0; font-size: 12px; color: #cbd5e1; line-height: 1.5;">Ayunan knockback berat, menghasilkan hentakan mementalkan lawan jatuh dari platform.</p>
        </div>

        <div style="background: #12231b; border: 2px solid #c084fc; border-radius: 18px; padding: 18px; box-shadow: 0 6px 20px rgba(0,0,0,0.4);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 15px; font-weight: bold; color: #c084fc;">⚔️ Compliance Sword</span>
            <span style="font-family: monospace; font-size: 12px; font-weight: bold; background: #3b0764; color: #e9d5ff; padding: 3px 8px; border-radius: 6px; border: 1px solid #9333ea;">12 Ammo</span>
          </div>
          <p style="margin: 0; font-size: 12px; color: #cbd5e1; line-height: 1.5;">Tebasan cepat jarak dekat dengan jeda cooldown singkat untuk serangan beruntun.</p>
        </div>

        <div style="background: #12231b; border: 2px solid #4ade80; border-radius: 18px; padding: 18px; box-shadow: 0 6px 20px rgba(0,0,0,0.4);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 15px; font-weight: bold; color: #4ade80;">🛡️ ESG Plasma Shield</span>
            <span style="font-family: monospace; font-size: 12px; font-weight: bold; background: #052e16; color: #bbf7d0; padding: 3px 8px; border-radius: 6px; border: 1px solid #16a34a;">10 Ammo</span>
          </div>
          <p style="margin: 0; font-size: 12px; color: #cbd5e1; line-height: 1.5;">Perisai pelindung yang membuat brawler kebal terhadap semua serangan selama 3 detik.</p>
        </div>

        <div style="background: #12231b; border: 2px solid #f87171; border-radius: 18px; padding: 18px; box-shadow: 0 6px 20px rgba(0,0,0,0.4);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 15px; font-weight: bold; color: #f87171;">💥 Decarb Blaster</span>
            <span style="font-family: monospace; font-size: 12px; font-weight: bold; background: #450a0a; color: #fecaca; padding: 3px 8px; border-radius: 6px; border: 1px solid #dc2626;">10 Ammo</span>
          </div>
          <p style="margin: 0; font-size: 12px; color: #cbd5e1; line-height: 1.5;">Meriam ledakan area (AoE) menghasilkan gelombang kejut mengenai banyak lawan sekaligus.</p>
        </div>

        <div style="background: #12231b; border: 2px solid #86efac; border-radius: 18px; padding: 18px; box-shadow: 0 6px 20px rgba(0,0,0,0.4);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 15px; font-weight: bold; color: #86efac;">🥊 Audit Fists</span>
            <span style="font-family: monospace; font-size: 12px; font-weight: bold; background: #064e3b; color: #86efac; padding: 3px 8px; border-radius: 6px; border: 1px solid #059669;">Tak Terbatas (∞)</span>
          </div>
          <p style="margin: 0; font-size: 12px; color: #cbd5e1; line-height: 1.5;">Pukulan dasar default yang selalu siap saat amunisi senjata khusus habis terpakai.</p>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; font-family: monospace; font-size: 11px; color: #64748b; border-top: 1px solid #2d4d3e; padding-top: 10px;">
        <span>Kompartemen Tata Kelola & Manajemen Risiko — PT Pupuk Kalimantan Timur</span>
        <span>Peserta: ${playerName}</span>
      </div>
    </div>
    `,

    // Slide 6: Node 1 & Node 2 (Materi & Contoh Soal)
    `
    <div class="slide-item" style="width: 1280px; height: 720px; box-sizing: border-box; background: #070e0a; border: 5px solid #86efac; padding: 36px 48px; display: flex; flex-direction: column; justify-content: space-between;">
      <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #2d4d3e; padding-bottom: 14px;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <img src="${logoTkmr}" style="width: 52px; height: 52px; object-fit: contain;" />
          <div>
            <span style="font-family: monospace; font-size: 13px; font-weight: bold; color: #86efac; letter-spacing: 2px; text-transform: uppercase;">MODUL EDUKASI & CONTOH SOAL (BAGIAN I)</span>
            <h2 style="margin: 2px 0 0 0; font-size: 20px; font-weight: 900; color: #facc15;">NODE 1: GCG & RISIKO (ISO 31000)  |  NODE 2: SMAP (ISO 37001) & ANTI-FRAUD</h2>
          </div>
        </div>
        <span style="font-family: monospace; font-size: 14px; font-weight: bold; background: #1a2e24; color: #86efac; padding: 6px 16px; border-radius: 10px; border: 1px solid #2d4d3e;">SLIDE 06 / 09</span>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin: auto 0;">
        <!-- Node 1 -->
        <div style="background: #12231b; border: 2px solid #86efac; border-radius: 18px; padding: 18px; box-shadow: 0 8px 25px rgba(0,0,0,0.4); display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <h3 style="margin: 0 0 10px 0; font-family: monospace; font-size: 14px; font-weight: 900; color: #86efac; border-bottom: 1px solid #2d4d3e; padding-bottom: 6px;">🛡️ NODE 1: GCG, AKHLAK & ISO 31000 ERM</h3>
            <p style="font-size: 11px; color: #cbd5e1; margin: 0 0 10px 0; line-height: 1.5;">
              • <strong>Prinsip TARIF:</strong> Transparansi, Akuntabilitas, Responsibilitas, Independensi, Fairness.<br/>
              • <strong>Three Lines Model:</strong> Lini 1 (Pabrik), Lini 2 (Tata Kelola & Risiko), Lini 3 (SPI/Audit).<br/>
              • <strong>Risk Appetite:</strong> Batas ambang toleransi risiko disetujui Direksi & Komisaris.
            </p>
          </div>
          <div style="background: #080d0a; border: 1.5px solid #facc15; border-radius: 12px; padding: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span style="font-family: monospace; font-size: 11px; font-weight: bold; color: #facc15;">💡 CONTOH SOAL KUIS NODE 1</span>
              <span style="font-family: monospace; font-size: 10px; background: #1a2e24; color: #86efac; padding: 2px 6px; border-radius: 4px; font-weight: bold;">Kunci: B</span>
            </div>
            <strong style="display: block; font-size: 11px; color: #ffffff; margin-bottom: 4px; line-height: 1.4;">Apa kepanjangan dan makna dari prinsip TARIF dalam GCG PKT?</strong>
            <span style="font-size: 10px; color: #86efac; display: block; font-weight: bold;">→ B. Transparansi, Akuntabilitas, Responsibilitas, Independensi, dan Fairness</span>
            <span style="font-size: 10px; color: #94a3b8; display: block; margin-top: 4px;"><em>Pembahasan: Pilar utama GCG penjamin integritas operasional PT Pupuk Kaltim.</em></span>
          </div>
        </div>

        <!-- Node 2 -->
        <div style="background: #12231b; border: 2px solid #38bdf8; border-radius: 18px; padding: 18px; box-shadow: 0 8px 25px rgba(0,0,0,0.4); display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <h3 style="margin: 0 0 10px 0; font-family: monospace; font-size: 14px; font-weight: 900; color: #38bdf8; border-bottom: 1px solid #2d4d3e; padding-bottom: 6px;">🔒 NODE 2: KEPATUHAN & SMAP ISO 37001</h3>
            <p style="font-size: 11px; color: #cbd5e1; margin: 0 0 10px 0; line-height: 1.5;">
              • <strong>Prinsip 4 NOs:</strong> No Bribery, No Kickback, No Gift, No Luxurious Hospitality.<br/>
              • <strong>Whistleblowing System:</strong> Kanal 24/7 rahasia dengan perlindungan penuh pelapor.<br/>
              • <strong>Fraud Control System (FCS):</strong> Uji tuntas vendor & deteksi dini fraud.
            </p>
          </div>
          <div style="background: #080d0a; border: 1.5px solid #facc15; border-radius: 12px; padding: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span style="font-family: monospace; font-size: 11px; font-weight: bold; color: #facc15;">💡 CONTOH SOAL KUIS NODE 2</span>
              <span style="font-family: monospace; font-size: 10px; background: #1a2e24; color: #86efac; padding: 2px 6px; border-radius: 4px; font-weight: bold;">Kunci: B</span>
            </div>
            <strong style="display: block; font-size: 11px; color: #ffffff; margin-bottom: 4px; line-height: 1.4;">Manakah yang merupakan implementasi dari prinsip 4 NOs di PKT?</strong>
            <span style="font-size: 10px; color: #86efac; display: block; font-weight: bold;">→ B. No Bribery, No Kickback, No Gift, No Luxurious Hospitality</span>
            <span style="font-size: 10px; color: #94a3b8; display: block; margin-top: 4px;"><em>Pembahasan: Komitmen Zero Tolerance terhadap suap, gratifikasi, dan jamuan mewah berlebih.</em></span>
          </div>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; font-family: monospace; font-size: 11px; color: #64748b; border-top: 1px solid #2d4d3e; padding-top: 10px;">
        <span>Kompartemen Tata Kelola & Manajemen Risiko — PT Pupuk Kalimantan Timur</span>
        <span>Peserta: ${playerName}</span>
      </div>
    </div>
    `,

    // Slide 7: Node 3 & Node 4 (Materi & Contoh Soal)
    `
    <div class="slide-item" style="width: 1280px; height: 720px; box-sizing: border-box; background: #070e0a; border: 5px solid #4ade80; padding: 36px 48px; display: flex; flex-direction: column; justify-content: space-between;">
      <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #2d4d3e; padding-bottom: 14px;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <img src="${logoTkmr}" style="width: 52px; height: 52px; object-fit: contain;" />
          <div>
            <span style="font-family: monospace; font-size: 13px; font-weight: bold; color: #4ade80; letter-spacing: 2px; text-transform: uppercase;">MODUL EDUKASI & CONTOH SOAL (BAGIAN II)</span>
            <h2 style="margin: 2px 0 0 0; font-size: 20px; font-weight: 900; color: #facc15;">NODE 3: ESG DEKARBONISASI  |  NODE 4: K3LL & PROCESS SAFETY</h2>
          </div>
        </div>
        <span style="font-family: monospace; font-size: 14px; font-weight: bold; background: #1a2e24; color: #86efac; padding: 6px 16px; border-radius: 10px; border: 1px solid #2d4d3e;">SLIDE 07 / 09</span>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin: auto 0;">
        <!-- Node 3 -->
        <div style="background: #12231b; border: 2px solid #4ade80; border-radius: 18px; padding: 18px; box-shadow: 0 8px 25px rgba(0,0,0,0.4); display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <h3 style="margin: 0 0 10px 0; font-family: monospace; font-size: 14px; font-weight: 900; color: #4ade80; border-bottom: 1px solid #2d4d3e; padding-bottom: 6px;">🌱 NODE 3: ESG & PETA JALAN NET ZERO</h3>
            <p style="font-size: 11px; color: #cbd5e1; margin: 0 0 10px 0; line-height: 1.5;">
              • <strong>Penerapan CCUS:</strong> Menangkap gas CO2 pabrik Ammonia untuk bahan baku Urea.<br/>
              • <strong>Transisi Energi:</strong> PLTS Atap Solar PV & Co-firing biomassa cangkang sawit.<br/>
              • <strong>Green Ammonia:</strong> Pengembangan amonia hijau rendah emisi karbon.
            </p>
          </div>
          <div style="background: #080d0a; border: 1.5px solid #facc15; border-radius: 12px; padding: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span style="font-family: monospace; font-size: 11px; font-weight: bold; color: #facc15;">💡 CONTOH SOAL KUIS NODE 3</span>
              <span style="font-family: monospace; font-size: 10px; background: #1a2e24; color: #86efac; padding: 2px 6px; border-radius: 4px; font-weight: bold;">Kunci: C</span>
            </div>
            <strong style="display: block; font-size: 11px; color: #ffffff; margin-bottom: 4px; line-height: 1.4;">Program dekarbonisasi Net Zero PKT mencakup inisiatif berikut, KECUALI:</strong>
            <span style="font-size: 10px; color: #f87171; display: block; font-weight: bold;">→ C. Konversi pabrik ke bahan bakar batu bara mentah</span>
            <span style="font-size: 10px; color: #94a3b8; display: block; margin-top: 4px;"><em>Pembahasan: Dekarbonisasi berfokus pada energi hijau dan CCUS, bukan menambah batu bara mentah.</em></span>
          </div>
        </div>

        <!-- Node 4 -->
        <div style="background: #12231b; border: 2px solid #f87171; border-radius: 18px; padding: 18px; box-shadow: 0 8px 25px rgba(0,0,0,0.4); display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <h3 style="margin: 0 0 10px 0; font-family: monospace; font-size: 14px; font-weight: 900; color: #f87171; border-bottom: 1px solid #2d4d3e; padding-bottom: 6px;">🔥 NODE 4: K3LL & PROCESS SAFETY (PSM)</h3>
            <p style="font-size: 11px; color: #cbd5e1; margin: 0 0 10px 0; line-height: 1.5;">
              • <strong>5 Golden Rules K3:</strong> Work Permit, APD Lengkap, LOTO, Ketinggian, Confined Space.<br/>
              • <strong>Process Safety Management:</strong> Integritas pipa gas alam & amonia tekanan tinggi.<br/>
              • <strong>CSMS:</strong> Standar keselamatan kontraktor setara standar pegawai PKT.
            </p>
          </div>
          <div style="background: #080d0a; border: 1.5px solid #facc15; border-radius: 12px; padding: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span style="font-family: monospace; font-size: 11px; font-weight: bold; color: #facc15;">💡 CONTOH SOAL KUIS NODE 4</span>
              <span style="font-family: monospace; font-size: 10px; background: #1a2e24; color: #86efac; padding: 2px 6px; border-radius: 4px; font-weight: bold;">Kunci: B</span>
            </div>
            <strong style="display: block; font-size: 11px; color: #ffffff; margin-bottom: 4px; line-height: 1.4;">Apa syarat wajib sebelum bekerja di ruang terbatas (Confined Space) PKT?</strong>
            <span style="font-size: 10px; color: #86efac; display: block; font-weight: bold;">→ B. Surat Izin Kerja SIKA, uji gas atmosfer, LOTO, dan pengawas siaga</span>
            <span style="font-size: 10px; color: #94a3b8; display: block; margin-top: 4px;"><em>Pembahasan: Standar ketat untuk mencegah kecelakaan fatal dan mempertahankan Zero Accident.</em></span>
          </div>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; font-family: monospace; font-size: 11px; color: #64748b; border-top: 1px solid #2d4d3e; padding-top: 10px;">
        <span>Kompartemen Tata Kelola & Manajemen Risiko — PT Pupuk Kalimantan Timur</span>
        <span>Peserta: ${playerName}</span>
      </div>
    </div>
    `,

    // Slide 8: Node 5 & Node 6 (Materi & Contoh Soal)
    `
    <div class="slide-item" style="width: 1280px; height: 720px; box-sizing: border-box; background: #070e0a; border: 5px solid #c084fc; padding: 36px 48px; display: flex; flex-direction: column; justify-content: space-between;">
      <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #2d4d3e; padding-bottom: 14px;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <img src="${logoTkmr}" style="width: 52px; height: 52px; object-fit: contain;" />
          <div>
            <span style="font-family: monospace; font-size: 13px; font-weight: bold; color: #c084fc; letter-spacing: 2px; text-transform: uppercase;">MODUL EDUKASI & CONTOH SOAL (BAGIAN III)</span>
            <h2 style="margin: 2px 0 0 0; font-size: 20px; font-weight: 900; color: #facc15;">NODE 5: TEORI AI  |  NODE 6: TOOLS KERJA, API RAG & PLAUD NOTE</h2>
          </div>
        </div>
        <span style="font-family: monospace; font-size: 14px; font-weight: bold; background: #1a2e24; color: #86efac; padding: 6px 16px; border-radius: 10px; border: 1px solid #2d4d3e;">SLIDE 08 / 09</span>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin: auto 0;">
        <!-- Node 5 -->
        <div style="background: #12231b; border: 2px solid #c084fc; border-radius: 18px; padding: 18px; box-shadow: 0 8px 25px rgba(0,0,0,0.4); display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <h3 style="margin: 0 0 10px 0; font-family: monospace; font-size: 14px; font-weight: 900; color: #c084fc; border-bottom: 1px solid #2d4d3e; padding-bottom: 6px;">🤖 NODE 5: TEORI AI & MACHINE LEARNING</h3>
            <p style="font-size: 11px; color: #cbd5e1; margin: 0 0 10px 0; line-height: 1.5;">
              • <strong>Supervised (Berlabel):</strong> Predictive Maintenance pompa & deteksi retak pipa.<br/>
              • <strong>Unsupervised (Tanpa Label):</strong> Klaster pola konsumsi gas alam antarpabrik.<br/>
              • <strong>Reinforcement:</strong> Optimasi rute distribusi armada kapal pupuk nasional.
            </p>
          </div>
          <div style="background: #080d0a; border: 1.5px solid #facc15; border-radius: 12px; padding: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span style="font-family: monospace; font-size: 11px; font-weight: bold; color: #facc15;">💡 CONTOH SOAL KUIS NODE 5</span>
              <span style="font-family: monospace; font-size: 10px; background: #1a2e24; color: #86efac; padding: 2px 6px; border-radius: 4px; font-weight: bold;">Kunci: B</span>
            </div>
            <strong style="display: block; font-size: 11px; color: #ffffff; margin-bottom: 4px; line-height: 1.4;">Manakah penerapan metode Supervised Learning yang tepat di pabrik PKT?</strong>
            <span style="font-size: 10px; color: #86efac; display: block; font-weight: bold;">→ B. Data getaran berlabel untuk prediksi kerusakan pompa (Predictive Maintenance)</span>
            <span style="font-size: 10px; color: #94a3b8; display: block; margin-top: 4px;"><em>Pembahasan: Supervised learning memprediksi kegagalan mesin secara akurat sebelum breakdown.</em></span>
          </div>
        </div>

        <!-- Node 6 -->
        <div style="background: #12231b; border: 2px solid #f97316; border-radius: 18px; padding: 18px; box-shadow: 0 8px 25px rgba(0,0,0,0.4); display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <h3 style="margin: 0 0 10px 0; font-family: monospace; font-size: 14px; font-weight: 900; color: #f97316; border-bottom: 1px solid #2d4d3e; padding-bottom: 6px;">📻 NODE 6: TOOLS KERJA AI, API RAG & PLAUD NOTE</h3>
            <p style="font-size: 11px; color: #cbd5e1; margin: 0 0 10px 0; line-height: 1.5;">
              • <strong>Tools:</strong> Tactiq.io & AudioConvert.ai (MoM rapat), MS 365 Copilot & Claude Work.<br/>
              • <strong>API RAG:</strong> Kueri dokumen internal aman tanpa kebocoran data rahasia.<br/>
              • <strong>PLAUD NOTE (~Rp 2,5jt):</strong> Perekam fisik offline untuk inspeksi pabrik bising.
            </p>
          </div>
          <div style="background: #080d0a; border: 1.5px solid #facc15; border-radius: 12px; padding: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span style="font-family: monospace; font-size: 11px; font-weight: bold; color: #facc15;">💡 CONTOH SOAL KUIS NODE 6</span>
              <span style="font-family: monospace; font-size: 10px; background: #1a2e24; color: #86efac; padding: 2px 6px; border-radius: 4px; font-weight: bold;">Kunci: B</span>
            </div>
            <strong style="display: block; font-size: 11px; color: #ffffff; margin-bottom: 4px; line-height: 1.4;">Mengapa arsitektur RAG & Claude Cowork sangat disarankan untuk audit risiko PKT?</strong>
            <span style="font-size: 10px; color: #86efac; display: block; font-weight: bold;">→ B. Menghubungkan LLM ke dokumen internal terenkripsi tanpa kebocoran data rahasia</span>
            <span style="font-size: 10px; color: #94a3b8; display: block; margin-top: 4px;"><em>Pembahasan: Mencegah halusinasi AI dan menjaga kerahasiaan dokumen korporasi.</em></span>
          </div>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; font-family: monospace; font-size: 11px; color: #64748b; border-top: 1px solid #2d4d3e; padding-top: 10px;">
        <span>Kompartemen Tata Kelola & Manajemen Risiko — PT Pupuk Kalimantan Timur</span>
        <span>Peserta: ${playerName}</span>
      </div>
    </div>
    `,

    // Slide 9: Node 7 (EcoMove & Kehati) & Penutup Sertifikat
    `
    <div class="slide-item" style="width: 1280px; height: 720px; box-sizing: border-box; background: #070e0a; border: 5px solid #2dd4bf; padding: 36px 48px; display: flex; flex-direction: column; justify-content: space-between;">
      <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #2d4d3e; padding-bottom: 14px;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <img src="${logoTkmr}" style="width: 52px; height: 52px; object-fit: contain;" />
          <div>
            <span style="font-family: monospace; font-size: 13px; font-weight: bold; color: #2dd4bf; letter-spacing: 2px; text-transform: uppercase;">MODUL EDUKASI & SERTIFIKASI KELULUSAN RESMI</span>
            <h2 style="margin: 2px 0 0 0; font-size: 20px; font-weight: 900; color: #facc15;">NODE 7: E жест MOVE & KEHATI BONTANG  |  PENUTUP & SERTIFIKASI</h2>
          </div>
        </div>
        <span style="font-family: monospace; font-size: 14px; font-weight: bold; background: #1a2e24; color: #86efac; padding: 6px 16px; border-radius: 10px; border: 1px solid #2d4d3e;">SLIDE 09 / 09</span>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin: auto 0;">
        <!-- Node 7 -->
        <div style="background: #12231b; border: 2px solid #2dd4bf; border-radius: 18px; padding: 18px; box-shadow: 0 8px 25px rgba(0,0,0,0.4); display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <h3 style="margin: 0 0 10px 0; font-family: monospace; font-size: 14px; font-weight: 900; color: #2dd4bf; border-bottom: 1px solid #2d4d3e; padding-bottom: 6px;">🌊 NODE 7: ECOM MOVE & KEHATI PESISIR BONTANG</h3>
            <p style="font-size: 11px; color: #cbd5e1; margin: 0 0 10px 0; line-height: 1.5;">
              • <strong>EcoMove:</strong> Pemilahan sampah dari sumber (Organik, Residu, Anorganik/Plastik).<br/>
              • <strong>Konservasi Laut:</strong> Ribuan modul terumbu karang buatan & reboisasi mangrove.<br/>
              • <strong>Kehati Anggrek Hitam:</strong> Kultur jaringan spesies flora endemik langka.
            </p>
          </div>
          <div style="background: #080d0a; border: 1.5px solid #facc15; border-radius: 12px; padding: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span style="font-family: monospace; font-size: 11px; font-weight: bold; color: #facc15;">💡 CONTOH SOAL KUIS NODE 7</span>
              <span style="font-family: monospace; font-size: 10px; background: #1a2e24; color: #86efac; padding: 2px 6px; border-radius: 4px; font-weight: bold;">Kunci: B</span>
            </div>
            <strong style="display: block; font-size: 11px; color: #ffffff; margin-bottom: 4px; line-height: 1.4;">Program EcoMove dan Kehati PKT di pesisir Bontang mencakup inisiatif:</strong>
            <span style="font-size: 10px; color: #86efac; display: block; font-weight: bold;">→ B. Terumbu Karang buatan, Hutan Mangrove, Anggrek Hitam, & Daur Ulang Plastik</span>
            <span style="font-size: 10px; color: #94a3b8; display: block; margin-top: 4px;"><em>Pembahasan: Komitmen pelestarian keanekaragaman hayati bersertifikasi PROPER Emas.</em></span>
          </div>
        </div>

        <!-- Closing & Certificate Box -->
        <div style="background: linear-gradient(to bottom, #13281f, #0b1611); border: 2px solid #facc15; border-radius: 18px; padding: 20px; text-align: center; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 8px 25px rgba(0,0,0,0.5);">
          <img src="${logoTkmr}" style="width: 58px; height: 58px; margin: 0 auto; object-fit: contain;" />
          <div style="margin: 6px 0;">
            <span style="font-family: monospace; font-size: 12px; font-weight: bold; color: #86efac; letter-spacing: 2px; text-transform: uppercase; display: block;">SERTIFIKAT KELULUSAN RESMI</span>
            <h4 style="margin: 4px 0 0 0; font-size: 17px; font-weight: 900; color: #ffffff;">Selamat Bertanding, ${playerName}!</h4>
            <p style="margin: 6px 0 0 0; font-size: 12px; color: #cbd5e1; line-height: 1.5;">
              Kuasai arena brawler, raih poin kuis di setiap Knowledge Tower, dan unduh Sertifikat Kelulusan Resmi Digital Anda di akhir pertandingan!
            </p>
          </div>
          <div style="font-family: monospace; font-size: 11px; color: #86efac; background: rgba(0,0,0,0.7); padding: 6px 14px; border-radius: 999px; border: 1px solid rgba(134,239,172,0.4); display: inline-block; margin: 0 auto;">
            Kompartemen Tata Kelola & Manajemen Risiko — PT Pupuk Kaltim
          </div>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; font-family: monospace; font-size: 11px; color: #64748b; border-top: 1px solid #2d4d3e; padding-top: 10px;">
        <span>Kompartemen Tata Kelola & Manajemen Risiko — PT Pupuk Kalimantan Timur</span>
        <span>Peserta: ${playerName}</span>
      </div>
    </div>
    `,
  ];

  // 3. Mount all slide items to the staging container
  staging.innerHTML = slidesHtml.join('');
  document.body.appendChild(staging);

  try {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [slideWidth, slideHeight],
    });

    const slideElements = staging.querySelectorAll<HTMLElement>('.slide-item');

    for (let i = 0; i < slideElements.length; i++) {
      const el = slideElements[i];

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#070e0a',
        logging: false,
        width: 1280,
        height: 720,
      });

      const imgData = canvas.toDataURL('image/png', 1.0);

      if (i > 0) {
        doc.addPage([slideWidth, slideHeight], 'landscape');
      }

      doc.addImage(imgData, 'PNG', 0, 0, slideWidth, slideHeight);
    }

    const cleanName = playerName.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `Slide_Panduan_Lengkap_16x9_${cleanName || 'Insan_Pupuk_Kaltim'}.pdf`;

    // Download file
    doc.save(filename);
  } finally {
    // 4. Clean up staging container from DOM
    if (document.body.contains(staging)) {
      document.body.removeChild(staging);
    }
  }
}

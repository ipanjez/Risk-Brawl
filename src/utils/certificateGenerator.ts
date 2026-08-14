import { PlayerState } from '../types';
import { jsPDF } from 'jspdf';
import logoTkmrUrl from '../assets/logoAsset';

/**
 * Loads an image from a URL and returns an HTMLImageElement
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

/**
 * Renders the certificate onto a high-resolution canvas
 */
export async function renderCertificateCanvas(player: PlayerState, rank: number): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  canvas.width = 1600;
  canvas.height = 1060;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not create canvas context');

  // Load Logo TKMR
  let logoImg: HTMLImageElement | null = null;
  try {
    logoImg = await loadImage(logoTkmrUrl);
  } catch (e) {
    console.warn('Failed to load logoTkmrUrl:', e);
  }

  // 1. Background Gradient (Corporate PKT Dark Forest & Gold Accent)
  const bg = ctx.createLinearGradient(0, 0, 1600, 1060);
  bg.addColorStop(0, '#0a1410');
  bg.addColorStop(0.5, '#13281f');
  bg.addColorStop(1, '#060d09');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1600, 1060);

  // Background Watermark / Grid Lines
  ctx.strokeStyle = 'rgba(134, 239, 172, 0.03)';
  ctx.lineWidth = 1;
  for (let x = 0; x < 1600; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1060);
    ctx.stroke();
  }
  for (let y = 0; y < 1060; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1600, y);
    ctx.stroke();
  }

  // 2. Decorative Double Border Frame
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 10;
  ctx.strokeRect(40, 40, 1520, 980);

  ctx.strokeStyle = '#86efac';
  ctx.lineWidth = 3;
  ctx.strokeRect(55, 55, 1490, 950);

  // Corner Ornaments
  const drawCorner = (x: number, y: number) => {
    ctx.fillStyle = '#facc15';
    ctx.fillRect(x - 20, y - 20, 40, 40);
    ctx.fillStyle = '#13281f';
    ctx.fillRect(x - 12, y - 12, 24, 24);
    ctx.fillStyle = '#86efac';
    ctx.fillRect(x - 6, y - 6, 12, 12);
  };
  drawCorner(40, 40);
  drawCorner(1560, 40);
  drawCorner(40, 1020);
  drawCorner(1560, 1020);

  // Top Logo (TKMR Logo at Header)
  if (logoImg) {
    ctx.drawImage(logoImg, 140, 75, 75, 75);
  }

  // 3. Header Title
  ctx.fillStyle = '#86efac';
  ctx.font = 'bold 24px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('PT PUPUK KALIMANTAN TIMUR', 800, 110);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 42px sans-serif';
  ctx.fillText('SERTIFIKAT KELULUSAN & PENCAPAIAN', 800, 170);

  ctx.fillStyle = '#facc15';
  ctx.font = 'bold 18px monospace';
  ctx.fillText('GOVERNANCE, RISK MANAGEMENT & ESG DECARBONIZATION BRAWLER', 800, 215);

  ctx.strokeStyle = '#2d4d3e';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(250, 245);
  ctx.lineTo(1350, 245);
  ctx.stroke();

  // 4. Award Statement
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '20px monospace';
  ctx.fillText('Sertifikat ini diberikan dengan bangga kepada:', 800, 305);

  // Participant Name
  ctx.fillStyle = '#86efac';
  ctx.font = '900 52px sans-serif';
  ctx.fillText(player.name.toUpperCase(), 800, 385);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '19px monospace';
  ctx.fillText('Atas keberhasilan menyelesaikan Sesi Edukasi & Simulation Challenge pada Arena Risk Brawler 2D', 800, 445);

  // 5. Score Details Grid Box
  ctx.fillStyle = '#11221a';
  ctx.fillRect(320, 490, 960, 230);
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 3;
  ctx.strokeRect(320, 490, 960, 230);

  const totalScore = player.score || (player.knowledgeScore + player.koCount * 30 + player.esgScore);

  ctx.fillStyle = '#facc15';
  ctx.font = 'bold 28px monospace';
  ctx.fillText(`PERINGKAT SIKLUS: #${rank}   |   TOTAL SKOR: ${totalScore.toLocaleString()} POIN`, 800, 545);

  ctx.fillStyle = '#ffffff';
  ctx.font = '20px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`• Knowledge Score (Kuis Kepatuhan) : ${player.knowledgeScore} Pts`, 380, 605);
  ctx.fillText(`• KO Knockouts (Keberanian Risk)   : ${player.koCount} KO (+${player.koCount * 30} Pts)`, 380, 645);
  ctx.fillText(`• ESG Tokens (Decarbonization)     : ${player.esgScore} Tokens`, 380, 685);

  // 6. Seal Badge & Signature Area
  ctx.textAlign = 'center';

  // Draw Official Seal with Logo TKMR
  const sealCenterX = 450;
  const sealCenterY = 870;

  // Outer glowing seal circle
  ctx.save();
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.arc(sealCenterX, sealCenterY, 60, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#0a1410';
  ctx.beginPath();
  ctx.arc(sealCenterX, sealCenterY, 54, 0, Math.PI * 2);
  ctx.fill();

  // Draw Logo in Seal
  if (logoImg) {
    ctx.drawImage(logoImg, sealCenterX - 40, sealCenterY - 40, 80, 80);
  } else {
    ctx.fillStyle = '#facc15';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('OFFICIAL SEAL', sealCenterX, sealCenterY);
  }
  ctx.restore();

  ctx.fillStyle = '#facc15';
  ctx.font = 'bold 14px monospace';
  ctx.fillText('OFFICIAL SEAL TKMR PKT', sealCenterX, 955);

  // Signature / Publisher Info Area
  ctx.textAlign = 'center';
  ctx.fillStyle = '#94a3b8';
  ctx.font = '16px monospace';
  ctx.fillText('Diterbitkan Oleh:', 1150, 835);

  ctx.fillStyle = '#86efac';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('Kompartemen Tata Kelola & Manajemen Risiko', 1150, 875);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = 'bold 16px monospace';
  ctx.fillText('PT Pupuk Kalimantan Timur', 1150, 905);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px monospace';
  ctx.fillText(`Tanggal: ${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}`, 1150, 940);

  return canvas;
}

/**
 * Generates and downloads the Certificate as a PDF document
 */
export async function downloadCertificatePDF(player: PlayerState, rank: number): Promise<void> {
  const canvas = await renderCertificateCanvas(player, rank);
  const imgData = canvas.toDataURL('image/png', 1.0);

  // Create A4 Landscape PDF (297mm x 210mm)
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  doc.addImage(imgData, 'PNG', 0, 0, 297, 210, undefined, 'FAST');

  const sanitizedName = player.name.replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `Sertifikat_Risk_Brawler_${sanitizedName}.pdf`;

  // Mobile-safe download method using Blob & URL
  try {
    const pdfBlob = doc.output('blob');
    const blobUrl = URL.createObjectURL(pdfBlob);

    // Create invisible anchor
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    }, 2000);
  } catch (err) {
    console.warn('Blob download error, falling back to doc.save():', err);
    doc.save(fileName);
  }
}


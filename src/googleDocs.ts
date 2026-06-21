import { LessonDesignOutput } from "./types";

// Configuration from environment variables
const CLIENT_ID = (import.meta as any).env.VITE_GOOGLE_CLIENT_ID || "";
const REDIRECT_URI = window.location.origin + window.location.pathname;
const SCOPES = [
  "https://www.googleapis.com/auth/documents",
  "https://www.googleapis.com/auth/drive.file"
];

export interface GoogleAuthSession {
  accessToken: string;
  expiresAt: number; // timestamp in ms
}

// Memory cache for active session
let authSession: GoogleAuthSession | null = null;

/**
 * Check URL hash for OAuth token on app load
 */
export function checkUrlForAuthToken(): GoogleAuthSession | null {
  try {
    const hash = window.location.hash;
    if (!hash) return null;

    const params: Record<string, string> = {};
    const cleanHash = hash.startsWith("#") ? hash.substring(1) : hash;
    cleanHash.split("&").forEach((part) => {
      const [key, val] = part.split("=");
      if (key && val) {
        params[decodeURIComponent(key)] = decodeURIComponent(val);
      }
    });

    if (params.access_token) {
      const expiresIn = params.expires_in ? parseInt(params.expires_in, 10) : 3600;
      const session: GoogleAuthSession = {
        accessToken: params.access_token,
        expiresAt: Date.now() + expiresIn * 1000,
      };
      
      authSession = session;
      
      // Clear URL hash to clean up the browser address bar
      window.history.replaceState(
        null, 
        document.title, 
        window.location.pathname + window.location.search
      );
      
      return session;
    }
  } catch (e) {
    console.error("Error parsing auth token", e);
  }
  return null;
}

/**
 * Redirect user to Google OAuth 2.0 authorization page
 */
export function initiateGoogleOAuth() {
  if (!CLIENT_ID) {
    throw new Error("Client ID Google belum terkonfigurasi. Silakan tambahkan VITE_GOOGLE_CLIENT_ID di pengaturan.");
  }
  
  const url = [
    "https://accounts.google.com/o/oauth2/v2/auth",
    `?client_id=${encodeURIComponent(CLIENT_ID)}`,
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`,
    "&response_type=token",
    `&scope=${encodeURIComponent(SCOPES.join(" "))}`,
    "&prompt=consent"
  ].join("");
  
  window.location.href = url;
}

/**
 * Validate that we have an active, non-expired session
 */
export function getActiveSession(): GoogleAuthSession | null {
  if (!authSession) {
    // Try to restore from SessionStorage (safe and persistent across reloads)
    try {
      const saved = sessionStorage.getItem("gdoc_auth_session");
      if (saved) {
        const parsed: GoogleAuthSession = JSON.parse(saved);
        if (parsed.expiresAt > Date.now() + 60000) { // token still has at least 1 min
          authSession = parsed;
        }
      }
    } catch (_) {}
  }
  
  if (authSession && authSession.expiresAt > Date.now()) {
    return authSession;
  }
  
  return null;
}

/**
 * Save active session
 */
export function saveSession(session: GoogleAuthSession) {
  authSession = session;
  try {
    sessionStorage.setItem("gdoc_auth_session", JSON.stringify(session));
  } catch (_) {}
}

/**
 * Clear cached login session
 */
export function clearSession() {
  authSession = null;
  try {
    sessionStorage.removeItem("gdoc_auth_session");
  } catch (_) {}
}

interface FormatRequest {
  insertText?: {
    text: string;
    location: { index: number };
  };
  updateTextStyle?: {
    range: { startIndex: number; endIndex: number };
    textStyle: {
      bold?: boolean;
      italic?: boolean;
      fontSize?: { magnitude: number; unit: string };
      foregroundColor?: { color: { rgbColor: { red: number; green: number; blue: number } } };
      fontFamily?: string;
    };
    fields: string;
  };
  updateParagraphStyle?: {
    range: { startIndex: number; endIndex: number };
    paragraphStyle: {
      namedStyleType: "TITLE" | "SUBTITLE" | "HEADING_1" | "HEADING_2" | "HEADING_3" | "NORMAL_TEXT";
      alignment?: "START" | "CENTER" | "END" | "JUSTIFY";
      lineSpacing?: number;
      spaceAbove?: { magnitude: number; unit: string };
      spaceBelow?: { magnitude: number; unit: string };
    };
    fields: string;
  };
}

/**
 * Compiles a structured Google Doc from the Modul Ajar object.
 * Returns the URL of the created document on Google Docs.
 */
export async function exportToGoogleDocs(
  lesson: LessonDesignOutput,
  token: string,
  meta?: {
    namaSekolah?: string;
    namaKepsek?: string;
    nipGuru?: string;
    nipKepsek?: string;
  }
): Promise<string> {
  // 1. Create a blank document with the Lesson Topic as title
  const title = `MODUL AJAR: ${lesson.identitas.topik} - ${lesson.identitas.mapel}`;
  const createResponse = await fetch("https://docs.googleapis.com/v1/documents", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });

  if (!createResponse.ok) {
    const errText = await createResponse.text();
    let errorMessage = errText;
    try {
      const parsed = JSON.parse(errText);
      if (parsed?.error?.message) {
        errorMessage = parsed.error.message;
      }
    } catch (_) {}

    if (createResponse.status === 401) {
      throw new Error("Sesi Google Docs kedaluwarsa atau tidak valid (Error 401). Silakan putuskan koneksi akun lalu tempelkan Access Token yang baru atau hubungkan ulang akun Google Anda.");
    }
    throw new Error(`Gagal membuat dokumen baru: ${errorMessage}`);
  }

  const documentData = await createResponse.json();
  const documentId = documentData.documentId;

  // 2. Build the document text and track exact character indices
  const textBlocks: string[] = [];
  const formatRequests: FormatRequest[] = [];
  
  let currentIndex = 1; // Google Docs indices start at 1

  function appendText(text: string, style?: {
    bold?: boolean;
    italic?: boolean;
    size?: number;
    color?: { red: number; green: number; blue: number };
    paragraphStyle?: "TITLE" | "SUBTITLE" | "HEADING_1" | "HEADING_2" | "HEADING_3" | "NORMAL_TEXT";
    align?: "START" | "CENTER" | "END" | "JUSTIFY";
  }) {
    const length = text.length;
    if (length === 0) return;
    
    textBlocks.push(text);
    const startIndex = currentIndex;
    const endIndex = currentIndex + length;
    
    // Track requested styles
    if (style) {
      if (style.bold || style.italic || style.size || style.color) {
        formatRequests.push({
          updateTextStyle: {
            range: { startIndex, endIndex },
            textStyle: {
              ...(style.bold !== undefined && { bold: style.bold }),
              ...(style.italic !== undefined && { italic: style.italic }),
              ...(style.size !== undefined && { fontSize: { magnitude: style.size, unit: "PT" } }),
              ...(style.color !== undefined && {
                foregroundColor: {
                  color: { rgbColor: { red: style.color.red, green: style.color.green, blue: style.color.blue } }
                }
              }),
            },
            fields: "bold,italic,fontSize,foregroundColor",
          }
        });
      }
      
      if (style.paragraphStyle || style.align) {
        formatRequests.push({
          updateParagraphStyle: {
            range: { startIndex, endIndex },
            paragraphStyle: {
              namedStyleType: style.paragraphStyle || "NORMAL_TEXT",
              ...(style.align && { alignment: style.align }),
            },
            fields: "namedStyleType,alignment",
          }
        });
      }
    }
    
    currentIndex = endIndex;
  }

  // --- Document Construction ---

  // Main Header
  appendText("MODUL AJAR (RPP INOVATIF - HOTS)\n", { 
    bold: true, 
    size: 18, 
    color: { red: 0.1, green: 0.1, blue: 0.3 },
    paragraphStyle: "TITLE",
    align: "CENTER"
  });
  
  appendText("STANDAR KEPUTUSAN KEPALA BSKAP NO. 046/H/KR/2025\n\n", {
    italic: true,
    size: 10,
    color: { red: 0.4, green: 0.4, blue: 0.4 },
    paragraphStyle: "SUBTITLE",
    align: "CENTER"
  });

  // Section I: Identitas
  appendText("I. IDENTITAS MODUL & ANALISIS DEMOGRAFI KELAS\n", {
    bold: true,
    size: 14,
    color: { red: 0.2, green: 0.2, blue: 0.6 },
    paragraphStyle: "HEADING_1"
  });
  
  appendText("Berikut adalah identitas modul ajar dan profil kesiapan peserta didik:\n\n", { italic: true });

  const identitasItems = [
    ["Nama Sekolah", meta?.namaSekolah || "SMA Negeri 1 Jakarta"],
    ["Nama Penyusun / Guru", lesson.identitas.namaGuru],
    ["NIP Guru", meta?.nipGuru || "-"],
    ["Kepala Sekolah", meta?.namaKepsek || "Dr. H. Ahmad Yani, M.Pd"],
    ["NIP Kepsek", meta?.nipKepsek || "-"],
    ["Mata Pelajaran", lesson.identitas.mapel],
    ["Kelas / Fase", lesson.identitas.kelasFase],
    ["Alokasi Waktu", lesson.identitas.alokasiWaktu],
    ["Topik Utama Sesi", lesson.identitas.topik]
  ];

  identitasItems.forEach(([label, value]) => {
    appendText(`• ${label}: `, { bold: true });
    appendText(`${value}\n`);
  });
  
  appendText("\n");

  appendText("Analisis Profil & Karakteristik Kelas:\n", { bold: true, size: 12, paragraphStyle: "HEADING_2" });
  
  appendText("• Minat Peserta Didik:\n", { bold: true });
  appendText(`${lesson.profilMurid.minat}\n\n`);
  
  appendText("• Cara & Ragam Gaya Belajar Murid:\n", { bold: true });
  appendText(`${lesson.profilMurid.caraBelajar}\n\n`);
  
  appendText("• Temu Kenal Keadaan Sosiologis/Lingkungan:\n", { bold: true });
  appendText(`${lesson.profilMurid.lingkungan}\n\n`);

  appendText("Pilar Dimensi Profil Lulusan (DPL) yang Diaktifkan:\n", { bold: true });
  appendText(`${lesson.identifikasiDPL.penjelasan}\n\n\n`);

  // Section II: Desain Kurikulum
  appendText("II. DESAIN KURIKULUM & STRATEGI DIFERENSIASI\n", {
    bold: true,
    size: 14,
    color: { red: 0.2, green: 0.2, blue: 0.6 },
    paragraphStyle: "HEADING_1"
  });

  appendText("A. Target Tujuan Pembelajaran (TP):\n", { bold: true, size: 12, paragraphStyle: "HEADING_2" });
  lesson.tujuanPembelajaran.forEach((tp, idx) => {
    appendText(`  ${idx + 1}. `, { bold: true });
    appendText(`${tp}\n`);
  });
  
  appendText("\n");

  appendText("B. Praktik Pedagogis Diferensiasi:\n", { bold: true, size: 12, paragraphStyle: "HEADING_2" });
  appendText("• Diferensiasi Konten:\n", { bold: true });
  appendText(`${lesson.praktikPedagogis.diferensiasiKonten}\n\n`);
  
  appendText("• Diferensiasi Proses:\n", { bold: true });
  appendText(`${lesson.praktikPedagogis.diferensiasiProses}\n\n`);
  
  appendText("• Diferensiasi Produk:\n", { bold: true });
  appendText(`${lesson.praktikPedagogis.diferensiasiProduk}\n\n`);

  appendText("C. Kemitraan Pembelajaran:\n", { bold: true, size: 12, paragraphStyle: "HEADING_2" });
  appendText("• Orang Tua: ", { bold: true });
  appendText(`${lesson.kemitraanPembelajaran.orangTua}\n`);
  if (lesson.kemitraanPembelajaran.komunitas) {
    appendText("• Lingkungan/Komunitas: ", { bold: true });
    appendText(`${lesson.kemitraanPembelajaran.komunitas}\n`);
  }
  
  appendText("\n");

  appendText("D. Dukungan Lingkungan Pembelajaran:\n", { bold: true, size: 12, paragraphStyle: "HEADING_2" });
  lesson.lingkunganPembelajaran.forEach((lp) => {
    appendText(`• ${lp}\n`);
  });
  
  appendText("\n\n");

  // Section III: Pemanfaatan Digital & Skenario
  appendText("III. PEMANFAATAN DIGITAL & SKENARIO PEMBELAJARAN (GALLERY WALK)\n", {
    bold: true,
    size: 14,
    color: { red: 0.2, green: 0.2, blue: 0.6 },
    paragraphStyle: "HEADING_1"
  });

  // Pemanfaatan Digital
  appendText("Teknologi Digital Terintegrasi:\n", { bold: true, size: 12, paragraphStyle: "HEADING_2" });
  appendText("• Sumber Belajar Digital: ", { bold: true });
  appendText(`${lesson.pemanfaatanDigital.sumberBelajar}\n`);
  appendText("• Aktivitas Digital: ", { bold: true });
  appendText(`${lesson.pemanfaatanDigital.aktivitas}\n`);
  appendText("• Produk Proyek: ", { bold: true });
  appendText(`${lesson.pemanfaatanDigital.produkProyek}\n`);
  appendText("• Kolaborasi Digital: ", { bold: true });
  appendText(`${lesson.pemanfaatanDigital.kolaborasi}\n\n`);

  // Pengalaman Belajar
  appendText("Detail Skenario Pengalaman Belajar:\n", { bold: true, size: 12, paragraphStyle: "HEADING_2" });
  
  appendText("1. Tahap Memahami (Understanding):\n", { bold: true });
  appendText(`${lesson.pengalamanBelajar.memahami}\n\n`);

  appendText(`2. Tahap Mengaplikasikan (Gallery Walk 4 Stasiun - ${lesson.pengalamanBelajar.mengaplikasikan.judul}):\n`, { bold: true });
  appendText(`${lesson.pengalamanBelajar.mengaplikasikan.deskripsi}\n\n`);

  lesson.pengalamanBelajar.mengaplikasikan.stasiun.forEach((st, idx) => {
    appendText(`   Stasiun ${idx + 1} (${st.tipe}) - ${st.nama}:\n`, { bold: true });
    appendText(`   Misi Aktivitas: ${st.misi}\n\n`);
  });

  appendText("3. Tahap Merefleksikan (Reflecting):\n", { bold: true });
  lesson.pengalamanBelajar.merefleksikan.forEach((ref) => {
    appendText(`• ${ref}\n`);
  });
  
  appendText("\n\n");

  // Section IV: Komponen Rencana Ajar Rinci
  appendText("IV. KOMPONEN RENCANA AJAR RINCI\n", {
    bold: true,
    size: 14,
    color: { red: 0.2, green: 0.2, blue: 0.6 },
    paragraphStyle: "HEADING_1"
  });

  appendText("Pemahaman Bermakna (Deep Meaning):\n", { bold: true, size: 11 });
  appendText(`"${lesson.modulAjarCP.pemahamanBermakna}"\n\n`);

  appendText("Pertanyaan Pemantik Logika Kritis:\n", { bold: true, size: 11 });
  lesson.modulAjarCP.pertanyaanPemantik.forEach((p) => {
    appendText(`• ${p}\n`);
  });
  
  appendText("\n");

  appendText("Skenario Kesiapan Pembelajar:\n", { bold: true, size: 11 });
  lesson.modulAjarCP.kesiapanBelajar.forEach((kb) => {
    appendText(`• ${kb}\n`);
  });
  
  appendText("\n");

  appendText("ALUR & LANGKAH KEGIATAN PEMBELAJARAN (90 MENIT):\n", { bold: true, size: 12, paragraphStyle: "HEADING_2" });
  
  appendText("A. Kegiatan Pendahuluan (10 Menit):\n", { bold: true });
  lesson.modulAjarCP.kegiatanPendahuluan.forEach((act) => {
    appendText(`• ${act}\n`);
  });
  
  appendText("\n");

  appendText("B. Kegiatan Inti - Skenario Diferensiasi (60 Menit):\n", { bold: true });
  lesson.modulAjarCP.kegiatanInti.forEach((act) => {
    appendText(`• ${act}\n`);
  });
  
  appendText("\n");

  appendText("C. Kegiatan Penutup & Refleksi (20 Menit):\n", { bold: true });
  lesson.modulAjarCP.kegiatanPenutup.forEach((act) => {
    appendText(`• ${act}\n`);
  });
  
  appendText("\n\n");

  // Section V: Asesmen & Lampiran
  appendText("V. ASESMEN & LAMPIRAN PEMBELAJARAN\n", {
    bold: true,
    size: 14,
    color: { red: 0.2, green: 0.2, blue: 0.6 },
    paragraphStyle: "HEADING_1"
  });

  // Asesmen
  appendText("Rencana Evaluasi Diagnostik, Formatif & Sumatif:\n", { bold: true, size: 12, paragraphStyle: "HEADING_2" });
  
  appendText("• Assessment as Learning (Diagnostik Awal):\n", { bold: true });
  lesson.asesmen.awal.forEach((as) => {
    appendText(`• ${as}\n`);
  });
  
  appendText("\n");
  
  appendText("• Assessment for Learning (Formatif Proses):\n", { bold: true });
  appendText(`${lesson.asesmen.proses}\n\n`);

  appendText("• Assessment of Learning (Sumatif Akhir):\n", { bold: true });
  lesson.asesmen.akhir.forEach((as) => {
    appendText(`• ${as}\n`);
  });
  
  appendText("\n");

  // Matriks Tabel Asesmen
  appendText("Mata Rantai & Teknik Pembelajaran Asesmen:\n", { bold: true });
  lesson.tabelAsesmen.forEach((t) => {
    appendText(`- [${t.jenis}] dengan teknik "${t.teknik}"\n`, { bold: true });
    appendText(`  Detail: ${t.detail}\n\n`);
  });

  // Lampiran
  appendText("Lampiran Pendukung & Media Guru:\n", { bold: true, size: 12, paragraphStyle: "HEADING_2" });
  lesson.lampiran.forEach((lam) => {
    appendText(`• ${lam}\n`);
  });

  // Lembar Pengesahan
  appendText("\n\nLEMBAR MANIFESTASI & PENGESAHAN MODUL AJAR\n\n", { bold: true, size: 12, align: "CENTER" });

  const instansi = meta?.namaSekolah || "SMA Negeri 1 Jakarta";
  const tglStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  // Neatly formatted signatures
  appendText("Mengetahui,\n", { bold: true });
  appendText(`Kepala Sekolah ${instansi}\n\n\n\n\n`);
  appendText(`${meta?.namaKepsek || "Dr. H. Ahmad Yani, M.Pd"}\n`, { bold: true });
  appendText(`NIP. ${meta?.nipKepsek || "19720815 199803 1 001"}\n\n\n\n`);

  appendText(`Disetujui di ${instansi.replace(/SMA Negeri|SMA/i, '').trim() || "Instansi"}, ${tglStr}\n`, { bold: true });
  appendText("Guru Mata Pelajaran\n\n\n\n\n");
  appendText(`${lesson.identitas.namaGuru}\n`, { bold: true });
  appendText(`NIP. ${meta?.nipGuru || "19850412 201001 1 002"}\n\n`);

  appendText("\n\n");
  appendText("--- Akhir Dokumen Rencana Ajar ---\n", { italic: true, align: "CENTER" });

  const finalPlanText = textBlocks.join("");

  // 3. Send insertText request to fill the document
  const populateResponse = await fetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      requests: [
        {
          insertText: {
            text: finalPlanText,
            location: { index: 1 },
          },
        },
      ],
    }),
  });

  if (!populateResponse.ok) {
    const errText = await populateResponse.text();
    throw new Error(`Gagal menyisipkan teks modul: ${errText}`);
  }

  // 4. Send all typography & paragraph formatting requests in a single batch
  if (formatRequests.length > 0) {
    const formatResponse = await fetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requests: formatRequests,
      }),
    });

    if (!formatResponse.ok) {
      console.warn("Formatting failed, but document was created successfully with plain text.");
    }
  }

  // 5. Construct user-friendly edit URL
  return `https://docs.google.com/document/d/${documentId}/edit`;
}

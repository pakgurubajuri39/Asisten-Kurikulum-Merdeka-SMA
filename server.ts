import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { PREDEFINED_SUBJECTS } from "./src/data/cpMerdeka";
import { Fase } from "./src/types";

dotenv.config();

const app = express();
app.use(express.json());
const PORT = 3000;

// Initialize Gemini client on the server
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("WARNING: GEMINI_API_KEY is not defined in the environment.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key || "",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// ---------------------- API ROUTES ----------------------

const defaultDPLMapping: Record<string, string[]> = {
  "biologi": ["Keimanan", "Penalaran Kritis", "Kolaborasi", "Kesehatan"],
  "fisika": ["Penalaran Kritis", "Kemandirian", "Kreativitas", "Kolaborasi"],
  "kimia": ["Penalaran Kritis", "Kreativitas", "Kolaborasi", "Kesehatan"],
  "matematika": ["Penalaran Kritis", "Kemandirian", "Kreativitas"],
  "sejarah": ["Penalaran Kritis", "Kewargaan", "Komunikasi", "Keimanan"],
};

// Fetch CP (Phase 1)
app.post("/api/cp/fetch", async (req, res) => {
  try {
    const { mapel, fase } = req.body;
    if (!mapel || !fase) {
      return res.status(400).json({ error: "mapel dan fase wajib ditentukan." });
    }

    // Try finding in predefined first
    const found = PREDEFINED_SUBJECTS.find(
      (s) => s.mapel.toLowerCase() === mapel.toLowerCase() && s.fase === fase
    );

    if (found) {
      const mapelLower = mapel.toLowerCase();
      const defaultDPLs = defaultDPLMapping[mapelLower] || ["Penalaran Kritis", "Kreativitas", "Kolaborasi"];
      return res.json({
        source: "local_database",
        data: {
          ...found,
          rekomendasiDimensiLulusan: defaultDPLs
        },
      });
    }

    // If not found in local DB, fetch from Gemini AI based on Keputusan Kepala BSKAP Nomor 046/H/KR/2025
    const prompt = `Anda adalah Pakar Kurikulum Nasional Indonesia. Berdasarkan aturan resmi Keputusan Kepala BSKAP Nomor 046/H/KR/2025 untuk tingkat SMA, rumuskan Capaian Pembelajaran (CP) dan Elemen yang paling akurat serta saran rekomendasi Dimensi Profil Lulusan untuk:
Mata Pelajaran: ${mapel}
Fase: ${fase}

Format output harus strictly berupa JSON dengan struktur berikut:
{
  "mapel": "${mapel}",
  "fase": "${fase}",
  "deskripsiCP": "Isi deskripsi CP utama yang komprehensif panjang dan resmi",
  "elemen": [
    {
      "nama": "Nama Elemen 1 (misal: Pemahaman Matematika / Pemahaman Konsep)",
      "deskripsi": "Deskripsi lengkap operasional dari elemen ini"
    }
  ],
  "rekomendasiDimensiLulusan": ["Penalaran Kritis", "Kreativitas", "Kolaborasi"]
}

Pilihan rekomendasiDimensiLulusan didasarkan dari 8 Dimensi ini (pilih 3-5):
- "Keimanan" (Keimanan & Ketakwaan terhadap Tuhan YME)
- "Kewargaan" (Kebinekaan Global / Kewargaan)
- "Penalaran Kritis" (Bernalar Kritis)
- "Kreativitas" (Kreatif)
- "Kolaborasi" (Gotong Royong / Kolaborasi)
- "Kemandirian" (Mandiri)
- "Kesehatan" (Kesehatan Fisik dan Mental)
- "Komunikasi" (Komunikasi Efektif)

Pastikan teks bernuansa resmi, baku, dan sesuai peraturan BSKAP 046/H/KR/2025. Kembalikan JSON murni tanpa membungkusnya dalam markdown code block.`;

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    const parsed = JSON.parse(text);

    return res.json({
      source: "gemini_api",
      data: parsed,
    });
  } catch (error: any) {
    console.error("Error fetching CP from Gemini:", error);
    return res.status(500).json({
      error: "Gagal memproses permintaan CP.",
      details: error.message,
    });
  }
});

// Generate Lesson Design (Phase 2)
app.post("/api/lesson-plan/generate", async (req, res) => {
  try {
    const params = req.body;
    if (!params.mapel || !params.kelas || !params.topik) {
      return res.status(400).json({ error: "Parameter wajib (mapel, kelas, topik) kurang lengkap." });
    }

    const jumlPertemuan = params.jumlahPertemuan || "3 Pertemuan";

    const prompt = `Anda adalah Pakar Kurikulum Merdeka Indonesia tingkat SMA, Ahli Desain Pembelajaran, dan AI Edukasi yang bersertifikasi. Berdasarkan Keputusan Kepala BSKAP Nomor 046/H/KR/2025, buatlah suatu Desain Pembelajaran (Modul Ajar) komprehensif untuk beberapa sesi/pertemuan, dilengkapi analisis tingkat kerumitan materi, serta saran penyelesaian materi terbaik.

Berikut adalah parameter input guru:
- Nama Guru: ${params.guruNama || "Luky, S.Pt"}
- Mapel: ${params.mapel}
- Kelas & Fase: ${params.kelas} / ${params.fase}
- Alokasi Sesi Skenario Rinci: ${params.alokasiWaktu || "Pertemuan 1 (2 x 45 menit)"}
- Rencana Jumlah Pertemuan Total: ${jumlPertemuan}
- Topik Pembelajaran: ${params.topik}
- Fokus Elemen CP: ${JSON.stringify(params.elemenDipilih || [])}
- Deskripsi CP Dipakai: "${params.customCPDescription}"
- Profil Murid:
  * Minat: ${params.profilMurid?.minat || "Sebagian besar menyukai konten visual media sosial, game, olahraga/kesehatan."}
  * Cara Belajar: ${params.profilMurid?.caraBelajar || "Pembelajar visual, auditori, kinestetik secara merata."}
  * Lingkungan Tempat Tinggal: ${params.profilMurid?.lingkungan || "Urban/sub-urban dengan gawai aktif namun sering sedentari."}
- Dimensi Profil Lulusan (DPL) Utama disasar: ${JSON.stringify(params.dimensiLulusan || [])}

Tugas Anda adalah merumuskan rencana pembelajaran yang detail, bervariasi, ramah diferensiasi, interaktif secara digital, dan terstruktur persis seperti standar modul ajar kelas dunia.

STRUKTUR OUTPUT HARUS BERUPA JSON YANG MATANG:
Berikan output JSON murni tanpa backticks markdown (\`\`\`json ...) dengan kunci persis sesuai struktur ini:

{
  "identitas": {
    "namaGuru": "${params.guruNama || "Luky, S.Pt"}",
    "kelasFase": "${params.kelas} / ${params.fase}",
    "mapel": "${params.mapel}",
    "topik": "${params.topik}",
    "alokasiWaktu": "${params.alokasiWaktu || "Pertemuan 1 (2 x 45 menit)"}",
    "jumlahPertemuan": "${jumlPertemuan}"
  },
  "profilMurid": {
    "minat": "Teks analisis minat terperinci sesuai input",
    "caraBelajar": "Teks penjelasan variasi gaya belajar kelas",
    "lingkungan": "Teks gambaran sosiologis/lingkungan murid"
  },
  "identifikasiDPL": {
    "dipilih": ${JSON.stringify(params.dimensiLulusan || [])},
    "penjelasan": "Deskripsi bagaimana dimensi lulusan ini dimanifestasikan dalam tindakan nyata di kelas ini (misalnya pembiasaan mindfulness, gotong royong memecahkan misi, penalaran kritis membedah kasus)."
  },
  "elemenCP": [
    { "nama": "Nama elemen", "deskripsi": "Deskripsi ringkas yang disasar" }
  ],
  "tujuanPembelajaran": [
    "TP 1 yang spesifik, operasional, dan mengandung Kriteria Ketercapaian (KKTP), misalnya: Murid mampu menjelaskan...",
    "TP 2 terkait analisis...",
    "TP 3 terkait penyelidikan/karya..."
  ],
  "praktikPedagogis": {
    "pendekatan": "Pembelajaran Berdiferensiasi yang terintegrasi dengan model Project-Based Learning (PjBL) atau Problem-Based Learning (PBL) / Inquiry",
    "diferensiasiKonten": "Teks rincian konkret bagaimana konten dibedakan berdasarkan gaya belajar visual, auditori, kinestetik",
    "diferensiasiProses": "Teks rincian konkret bantuan/scaffolding bertahap dari guru untuk kelompok kesiapan berbeda (Cepat, Sedang, Perlu Bimbingan)",
    "diferensiasiProduk": "Rincian kebebasan murid menentukan produk akhir kampanye atau laporan kreatif mereka (Video, Poster, Podcast, Artikel)"
  },
  "kemitraanPembelajaran": {
    "orangTua": "Cara konkret melibatkan orang tua di rumah mendukung kegiatan belajar terkait topik ini",
    "komunitas": "Cara melibatkan ekosistem komunitas / praktisi ahli (misalnya fisioterapis, guru olahraga, dokter, ahli gizi, komite sekolah)"
  },
  "lingkunganPembelajaran": [
    "Kondisi fisik fleksibel dan berbasis zona (diskusi, eksplorasi digital, papan ide).",
    "Membangun suasana aman, terbuka untuk eksplorasi dan kesalahan.",
    "Persiapan area pajang karya atau gallery walk dan papan refleksi."
  ],
  "pemanfaatanDigital": {
    "sumberBelajar": "Bahan belajar online berkualitas (YouTube, link virtual lab, artikel tepercaya)",
    "aktivitas": "Kuis interaktif digital (Kahoot, Quizizz, Wordwall)",
    "produkProyek": "Peralatan digital pembuat produk (Canva, CapCut, VN, Anchor, Anchor)",
    "kolaborasi": "Alat kolaborasi kelompok (Google Docs/Jamboard/Padlet)"
  },
  "pengalamanBelajar": {
    "memahami": "Bagaimana siswa membangun pemahaman mendasar yang hidup tentang topik ini (misalnya rangka bukan sekadar tulang mati, tetapi struktur dinamis)",
    "mengaplikasikan": {
      "judul": "Gallery Walk Eksplorasi (durasi total menit)",
      "deskripsi": "Penjelasan umum bagaimana teknis rotasi kelompok berjalan di kelas",
      "stasiun": [
        { "nama": "Nama Stasiun 1 (Kinestetik)", "tipe": "Kinestetik", "misi": "Deskripsi misi eksplorasi fisik konkret, meraba, mendemonstrasikan, merancang" },
        { "nama": "Nama Stasiun 2 (Visual)", "tipe": "Visual", "misi": "Deskripsi misi mengamati poster, diagram, mencocokkan kartu, infografis" },
        { "nama": "Nama Stasiun 3 (Digital)", "tipe": "Digital", "misi": "Deskripsi misi menggunakan perangkat digital untuk mendedah struktur 3D virtual, simulasikan lab" },
        { "nama": "Nama Stasiun 4 (Auditori & Diskusi)", "tipe": "Auditori & Diskusi", "misi": "Deskripsi misi memindai QR, menyimak video pendek/podcast, dan berdiskusi kritis memecahkan masalah kontekstatif" }
      ]
    },
    "merefleksikan": [
      "Setelah rotasi selesai, bagaimana guru memandu murid kembali ke tempat duduk untuk berbagi temuan mengejutkan (misal: 'WOW' moment).",
      "Bagaimana guru menegaskan pemahaman, mengklarifikasi miskonsepsi, dan merangkum koneksi antarseluruh stasiun."
    ]
  },
  "asesmen": {
    "awal": [
      "Pertanyaan pemantik atau kuis diagnostik kognitif singkat.",
      "Misalnya pertanyaan reflektif: Bagaimana jika tubuh kita tidak memiliki..."
    ],
    "proses": "Metode pemantauan berkala (observasi di stasiun pembelajaran, kuis singkat digital selama proses, atau tanggapan LKPD kelompok).",
    "akhir": [
      "Detail instrumen penilaian akhir (misalnya, membuat lembar exit ticket pada Padlet, atau evaluasi rubrik produk diferensiasi)."
    ]
  },
  "modulAjarCP": {
    "pemahamanBermakna": "Intisari esensial dari materi ini yang akan terus diingat murid seumur hidupnya (Filosofis & Relevan)",
    "pertanyaanPemantik": [
      "Pertanyaan memicu logika berpikir kritis tingkat tinggi 1?",
      "Pertanyaan memicu logika berpikir kritis tingkat tinggi 2?"
    ],
    "kesiapanBelajar": [
      "Persiapan fisik: Menata kelas menjadi 4 stasiun eksplorasi.",
      "Persiapan dokumen: Mencetak LKPD dan menyinkronkan QR stasiun.",
      "Persiapan teknologi: Memastikan gawai, proyektor, dan koneksi internet stabil."
    ],
    "kegiatanPendahuluan": [
      "(Menit 1-2) Pembukaan ramah dengan salam, doa bersama, dan presensi.",
      "(Menit 3-5) Latihan kesadaran penuh (Mindfulness/Somatic) bertema materi untuk memfokuskan mental siswa.",
      "(Menit 6-7) Penyajian stimulus visual atau video pemantik singkat yang menginspirasi.",
      "(Menit 8-10) Asesmen diagnostik non-angka (Kuis singkat) untuk memetakan pemahaman awal kelas."
    ],
    "kegiatanInti": [
      "(Menit 11-15) Pengorganisasian murid ke dalam kelompok kecil heterogen dan briefing misi detektif stasiun.",
      "(Menit 16-60) Fase Eksplorasi Gallery Walk: Setiap kelompok berpindah stasiun secara simultan dengan durasi masing-masing 10-15 menit.",
      "(Menit 61-70) Fase Konsolidasi & Diskusi Kelas: Semua kelompok melengkapi LKPD dan berbagi temuan 'WOW' moment di bawah panduan guru."
    ],
    "kegiatanPenutup": [
      "(Menit 71-80) Refleksi Pembelajaran mandiri menggunakan sticky notes / Padlet.",
      "(Menit 81-87) Penguatan & Kesimpulan: Guru membaca refleksi secara anonim dan menyimpulkan esensi hari ini.",
      "(Menit 88-90) Tindak Lanjut & Salam Penutup: Memberikan preview menarik untuk materi berikutnya (misal: mesin pendorong otot)."
    ]
  },
  "tabelAsesmen": [
    { "jenis": "Diagnostik", "teknik": "Kuis Interaktif / Curah Pendapat", "detail": "Mengukur kesiapan belajarmurid sebelum pembelajaran." },
    { "jenis": "Formatif (Observasi)", "teknik": "Lembar Ceklis Kerja Kelompok", "detail": "Menilai aspek gotong-royong dan bernalar kritis di stasiun belajar." },
    { "jenis": "Formatif (LKPD)", "teknik": "Analisis Berkas LKPD", "detail": "Memeriksa ketepatan murid dalam menjawab misi eksplorasi anatomi." },
    { "jenis": "Sumatif (Produk)", "teknik": "Rubrik Penilaian Produk Karya", "detail": "Menilai kualitas desain produk diferensiasi (poster/video/podcast)." }
  ],
  "lampiran": [
    "Link Sumber Belajar Digital dan QR Code Stasiun.",
    "Draft Lembar Kerja Peserta Didik (LKPD) 'Eksplorasi Detektif Anatomi' dengan tabel misi.",
    "Panduan Observasi Rubrik untuk Penilaian Sikap Pancasila (Gotong Royong & Bernalar Kritis)."
  ],
  "rekomendasiAlur": {
    "tingkatKerumitan": "Analisis terperinci tingkat kerumitan topik materi ini (apakah Rendah, Sedang, Tinggi, atau Kompleks Konseptual/Abstrak) beserta alasannya.",
    "saranRekomendasi": "Saran rekomendasi strategis terbaik langkah demi langkah untuk menyelesaikan seluruh bahasan materi ini dengan sukses sesuai target jam pelajaran Kurikulum Merdeka.",
    "pembagianPertemuan": [
      {
        "pertemuan": "Pertemuan 1",
        "subTopik": "Konsep atau subtopik pertama yang harus dituntaskan",
        "alokasi": "2 JP (2 x 45 menit)",
        "aktivitasUtama": "Memahami dasar-dasar, konsep awal, dsb."
      },
      {
        "pertemuan": "Pertemuan 2",
        "subTopik": "Subtopik kedua untuk memperdalam pemahaman",
        "alokasi": "2 JP (2 x 45 menit)",
        "aktivitasUtama": "Eksplorasi mendalam, stasiun belajar Gallery Walk dsb."
      },
      {
        "pertemuan": "Pertemuan 3",
        "subTopik": "Evaluasi, produk akhir atau refleksi kolaboratif",
        "alokasi": "2 JP (2 x 45 menit)",
        "aktivitasUtama": "Penyelesaian tugas karya kreatif dan presentasi kelayakan produk"
      }
    ]
  }
}

Pastikan isi rekomendasiAlur ini dianalisis secara akurat terhadap materi ${params.topik} tingkat kelas ${params.kelas}. Untuk jumlahPertemuan yang diset: [${jumlPertemuan}], pastikan daftar pembagianPertemuan memiliki jumlah item pertemuan yang cocok dengan jumlah pertemuan tersebut (misalkan jika guru meminta 2 pertemuan, berikan pembagianPertemuan bernomor 1 dan 2; jika meminta 4 pertemuan, berikan 4 item pertemuan).

Pastikan semua nilai teks bernuansa sangat lengkap, analitis, profesional, menginspirasi, ditulis secara akademis dengan tata bahasa yang indah, dan 100% menggunakan Bahasa Indonesia yang fasih. JANGAN gunakan singkatan tidak perlu.`;

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    const parsed = JSON.parse(text);

    return res.json({
      success: true,
      data: parsed,
    });
  } catch (error: any) {
    console.error("Error generating lesson plan from Gemini:", error);
    return res.status(500).json({
      success: false,
      error: "Gagal merumuskan Desain Pembelajaran Kurikulum Merdeka.",
      details: error.message,
    });
  }
});

// Serve frontend assets in development and production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Only run app.listen if not inside Vercel Serverless environment
  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`[OK] Server running on http://0.0.0.0:${PORT}`);
    });
  }
}

startServer();

export default app;

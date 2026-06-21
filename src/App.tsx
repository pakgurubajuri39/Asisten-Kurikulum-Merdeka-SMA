import React, { useState, useEffect, useRef } from "react";
import { 
  BookOpen, Sparkles, User, Users, AlignLeft, CheckCircle, 
  ChevronRight, Download, Printer, Plus, Trash2, Edit3, 
  MapPin, RefreshCw, Layers, Check, Info, FileText, Compass, 
  Heart, Cpu, ArrowRight, Eye, Settings, HelpCircle, Activity,
  ChevronDown
} from "lucide-react";
import { Fase, SubjectData, StudentProfile, LessonDesignParams, LessonDesignOutput } from "./types";
import { PREDEFINED_SUBJECTS } from "./data/cpMerdeka";
import { 
  checkUrlForAuthToken, 
  initiateGoogleOAuth, 
  getActiveSession, 
  saveSession, 
  clearSession, 
  exportToGoogleDocs 
} from "./googleDocs";


// Beautiful Predefined DPL dimensions matching the grid on Page 1
const DIMENSI_LULUSAN_OPTIONS = [
  { id: "Keimanan", label: "Keimanan & Ketakwaan terhadap Tuhan YME", dpl: "DPL 1", color: "text-rose-600 bg-rose-50 border-rose-200" },
  { id: "Kewargaan", label: "Kewargaan", dpl: "DPL 2", color: "text-blue-600 bg-blue-50 border-blue-200" },
  { id: "Penalaran Kritis", label: "Penalaran Kritis", dpl: "DPL 3", color: "text-amber-600 bg-amber-50 border-amber-200" },
  { id: "Kreativitas", label: "Kreativitas", dpl: "DPL 4", color: "text-purple-600 bg-purple-50 border-purple-200" },
  { id: "Kolaborasi", label: "Kolaborasi", dpl: "DPL 5", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  { id: "Kemandirian", label: "Kemandirian", dpl: "DPL 6", color: "text-orange-600 bg-orange-50 border-orange-200" },
  { id: "Kesehatan", label: "Kesehatan", dpl: "DPL 7", color: "text-teal-600 bg-teal-50 border-teal-200" },
  { id: "Komunikasi", label: "Komunikasi", dpl: "DPL 8", color: "text-indigo-600 bg-indigo-50 border-indigo-200" },
];

export default function App() {
  const isIframe = typeof window !== "undefined" && window.self !== window.top;
  const [isPrintPreviewActive, setIsPrintPreviewActive] = useState<boolean>(false);

  // Input states
  const [selectedMapel, setSelectedMapel] = useState<string>("Biologi");
  const [customMapel, setCustomMapel] = useState<string>("");
  const [selectedFase, setSelectedFase] = useState<Fase>(Fase.FASE_F);
  const [selectedKelas, setSelectedKelas] = useState<string>("XI");
  const [guruNama, setGuruNama] = useState<string>("Luky, S.Pt");
  const [nipGuru, setNipGuru] = useState<string>("19850412 201001 1 002");
  const [namaSekolah, setNamaSekolah] = useState<string>("SMA Negeri 1 Jakarta");
  const [namaKepsek, setNamaKepsek] = useState<string>("Dr. H. Ahmad Yani, M.Pd");
  const [nipKepsek, setNipKepsek] = useState<string>("19720815 199803 1 001");
  const [alokasiWaktu, setAlokasiWaktu] = useState<string>("Pertemuan 1 (2 x 45 menit)");
  const [jumlahPertemuan, setJumlahPertemuan] = useState<string>("3 Pertemuan (6 JP)");
  const [topik, setTopik] = useState<string>("Sistem Gerak");
  
  // Student Profile preset templates
  const STUDENT_PRESETS = [
    {
      name: "Default (Urban Aktif, Minat Olahraga & Sosmed)",
      minat: "Sebagian besar murid aktif menggunakan media sosial (Instagram, TikTok) dan tertarik pada konten visual seperti video pendek dan infografis. Banyak yang memiliki minat pada olahraga, game, e-sports, dan kesehatan tubuh/kebugaran.",
      caraBelajar: "Murid memiliki gaya belajar yang beragam. Sebagian adalah pembelajar visual (lebih mudah paham melalui gambar, video, dan demonstrasi), sebagian auditori (melalui diskusi dan penjelasan), dan sebagian kinestetik (melalui praktik langsung, peragaan, atau pembuatan model). Mereka lebih termotivasi saat pembelajaran bersifat interaktif, kolaboratif, dan relevan dengan kehidupan sehari-hari.",
      lingkungan: "Murid berasal dari lingkungan urban dan sub-urban dengan akses internet yang memadai. Sebagian besar menjalani gaya hidup yang cukup dinamis, namun tidak sedikit pula yang memiliki gaya hidup sedentari (banyak duduk) karena penggunaan gawai dan fasilitas transportasi. Isu seperti postur tubuh yang salah saat belajar daring atau bermain game menjadi relevan."
    },
    {
      name: "Sains & Analitis (Suburban, Minat Tekno & Lingkungan)",
      minat: "Tertarik pada isu lingkungan hidup, pemanasan global, gadget terkini, dan eksperimen ilmiah praktis. Suka bermain puzzle atau tantangan bernalar.",
      caraBelajar: "Didominasi oleh pembelajar visual-analitis (suka struktur data, infografis) dan kinestetik mandiri. Menyenangi eksplorasi digital luar ruang atau simulasi virtual.",
      lingkungan: "Daerah penyangga kota (suburban) dengan akses internet menengah-keatas. Sering menghadapi polusi industri lokal, sehingga kepedulian lingkungan terasa nyata."
    },
    {
      name: "Sederhana & Kolaboratif (Urban/Semi-rural, Kreatif Seni Budaya)",
      minat: "Menyukai seni musik, menggambar, pembuatan kerajinan tangan, kewirausahaan, serta konten hiburan receh kreatif.",
      caraBelajar: " dominan pendengar (auditori) dan penjiwa (interpersonal). Sangat menikmati ruang bercerita (roleplay), belajar kelompok bersosialisasi, dan presentasi lisan.",
      lingkungan: "Lingkungan semi-urban padat karya, memegang nilai-nilai gotong royong warga yang erat namun gawai pintar terbatas pada perangkat keluarga."
    }
  ];

  const [profilMurid, setProfilMurid] = useState<StudentProfile>({
    minat: STUDENT_PRESETS[0].minat,
    caraBelajar: STUDENT_PRESETS[0].caraBelajar,
    lingkungan: STUDENT_PRESETS[0].lingkungan,
  });

  const [selectedDPL, setSelectedDPL] = useState<string[]>(["Keimanan", "Penalaran Kritis", "Kolaborasi", "Kesehatan"]);

  // Fase 1 state
  const [loadingCP, setLoadingCP] = useState<boolean>(false);
  const [loadedCPData, setLoadedCPData] = useState<SubjectData | null>(null);
  const [selectedCPId, setSelectedCPId] = useState<number>(0);
  const [elemenTerpilih, setElemenTerpilih] = useState<string[]>([]);
  const [customCPDescription, setCustomCPDescription] = useState<string>("");

  // Fase 2 state
  const [loadingLesson, setLoadingLesson] = useState<boolean>(false);
  const [generatedLesson, setGeneratedLesson] = useState<LessonDesignOutput | null>(null);
  const [activeTab, setActiveTab] = useState<string>("identitas");
  
  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">("success");

  // Show Toast
  const showToast = (msg: string, type: "success" | "error" | "info" = "success") => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(""), 4000);
  };

  // Google Docs state & integration logic
  const [gdocToken, setGdocToken] = useState<string | null>(null);
  const [isExportingGdoc, setIsExportingGdoc] = useState<boolean>(false);
  const [showGdocModal, setShowGdocModal] = useState<boolean>(false);
  const [manualGdocToken, setManualGdocToken] = useState<string>("");
  const [gdocUrl, setGdocUrl] = useState<string>("");

  // Handle OAuth callback & active session parsing
  useEffect(() => {
    const session = checkUrlForAuthToken();
    if (session) {
      saveSession(session);
      setGdocToken(session.accessToken);
      showToast("Koneksi Google Docs berhasil diaktifkan!", "success");
      setShowGdocModal(true);
    } else {
      const active = getActiveSession();
      if (active) {
        setGdocToken(active.accessToken);
      }
    }
  }, []);

  const handleOAuthLogin = () => {
    try {
      initiateGoogleOAuth();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Gagal membuka otorisasi Google.", "error");
    }
  };

  const handleManualTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualGdocToken.trim()) {
      showToast("Access token manual tidak boleh kosong!", "error");
      return;
    }
    const session = {
      accessToken: manualGdocToken.trim(),
      expiresAt: Date.now() + 3600 * 1000,
    };
    saveSession(session);
    setGdocToken(session.accessToken);
    showToast("Token Google Docs berhasil disimpan!", "success");
  };

  const handleDisconnectGdoc = () => {
    clearSession();
    setGdocToken(null);
    setManualGdocToken("");
    setGdocUrl("");
    showToast("Koneksi akun Google Docs diputuskan.", "info");
  };

  const handleExportToGoogleDocs = async () => {
    if (!generatedLesson) {
      showToast("Tidak ada Modul Ajar yang tersedia untuk diekspor!", "error");
      return;
    }

    const tokenToUse = gdocToken;
    if (!tokenToUse) {
      setShowGdocModal(true);
      return;
    }

    setIsExportingGdoc(true);
    try {
      const docLink = await exportToGoogleDocs(generatedLesson, tokenToUse, {
        namaSekolah,
        namaKepsek,
        nipGuru,
        nipKepsek,
      });
      setGdocUrl(docLink);
      showToast("Modul Ajar berhasil diekspor ke Google Docs!", "success");
    } catch (err: any) {
      console.error(err);
      if (err.message && (err.message.includes("401") || err.message.includes("Unauthorized"))) {
        showToast("Sesi kedaluwarsa atau tidak valid. Silakan sambungkan ulang.", "error");
        clearSession();
        setGdocToken(null);
      } else {
        showToast(err.message || "Gagal mengekspor dokumen.", "error");
      }
    } finally {
      setIsExportingGdoc(false);
    }
  };


  // Preset loading for custom subjects or fast changes
  useEffect(() => {
    // Attempt to match predefined subject to assist teacher load quickly
    const mapelName = selectedMapel === "Custom" ? customMapel : selectedMapel;
    const match = PREDEFINED_SUBJECTS.find(
      (s) => s.mapel.toLowerCase() === mapelName.toLowerCase() && s.fase === selectedFase
    );
    if (match) {
      // Auto fill some sensible defaults
      if (mapelName === "Biologi") {
        setTopik("Sistem Gerak");
        setSelectedKelas("XI");
      } else if (mapelName === "Fisika") {
        setTopik(selectedFase === Fase.FASE_E ? "Sumber Energi Alternatif" : "Kinetika Gerak & Fluida");
        setSelectedKelas(selectedFase === Fase.FASE_E ? "X" : "XI");
      } else if (mapelName === "Kimia") {
        setTopik(selectedFase === Fase.FASE_E ? "Prinsip Kimia Hijau" : "Termokimia Larutan");
        setSelectedKelas(selectedFase === Fase.FASE_E ? "X" : "XI");
      } else if (mapelName === "Matematika") {
        setTopik(selectedFase === Fase.FASE_E ? "Eksponen & Trigonometri" : "Persamaan Lingkaran");
        setSelectedKelas(selectedFase === Fase.FASE_E ? "X" : "XI");
      } else if (mapelName === "Sejarah") {
        setTopik(selectedFase === Fase.FASE_E ? "Konsep Ilmu Sejarah" : "Kolonialisme Barat");
        setSelectedKelas(selectedFase === Fase.FASE_E ? "X" : "XI");
      }
    }
  }, [selectedMapel, selectedFase, customMapel]);

  // Load CP (Fase 1 API Call)
  const handleFetchCP = async () => {
    setLoadingCP(true);
    const mapelName = selectedMapel === "Custom" ? customMapel : selectedMapel;
    if (!mapelName.trim()) {
      showToast("Nama Mata Pelajaran tidak boleh kosong!", "error");
      setLoadingCP(false);
      return;
    }

    try {
      const response = await fetch("/api/cp/fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mapel: mapelName, fase: selectedFase }),
      });

      if (!response.ok) {
        throw new Error("Gagal mengambil data CP dari server.");
      }

      const resJson = await response.json();
      const cpData: SubjectData & { rekomendasiDimensiLulusan?: string[] } = resJson.data;

      setLoadedCPData(cpData);
      setCustomCPDescription(cpData.deskripsiCP);
      // Select all elements by default
      const elementNames = cpData.elemen.map(e => e.nama);
      setElemenTerpilih(elementNames);

      if (cpData.rekomendasiDimensiLulusan && cpData.rekomendasiDimensiLulusan.length > 0) {
        setSelectedDPL(cpData.rekomendasiDimensiLulusan);
        showToast(`Capaian Pembelajaran (CP) ${mapelName} teridentifikasi! Dimensi Profil Lulusan disesuaikan otomatis berdasarkan topik materi.`, "success");
      } else {
        showToast(`Capaian Pembelajaran (CP) ${mapelName} teridentifikasi!`, "success");
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Gagal menghubungi API server.", "error");
    } finally {
      setLoadingCP(false);
    }
  };

  // Generate Learning Design (Fase 2 API Call)
  const handleGenerateLessonDesign = async () => {
    if (!loadedCPData) {
      showToast("Harap selesaikan Tahap 1 (Ambil CP) terlebih dahulu!", "error");
      return;
    }

    setLoadingLesson(true);
    const mapelName = selectedMapel === "Custom" ? customMapel : selectedMapel;

    const payload: LessonDesignParams = {
      guruNama,
      mapel: mapelName,
      fase: selectedFase,
      kelas: selectedKelas,
      alokasiWaktu,
      topik,
      elemenDipilih: elemenTerpilih,
      customCPDescription,
      profilMurid,
      dimensiLulusan: selectedDPL,
      jumlahPertemuan,
    };

    try {
      const response = await fetch("/api/lesson-plan/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Gagal merumuskan desain pembelajaran modul ajar.");
      }

      const resJson = await response.json();
      if (resJson.success && resJson.data) {
        setGeneratedLesson(resJson.data);
        setActiveTab("identitas");
        showToast("Modul Ajar Pembelajaran Rinci Berhasil Dirumuskan!", "success");
      } else {
        throw new Error(resJson.error || "Gagal menganalisis struktur AI.");
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Terjadi kesalahan koneksi server AI.", "error");
    } finally {
      setLoadingLesson(false);
    }
  };

  // Multi-select handling for DPL
  const toggleDPL = (dplId: string) => {
    if (selectedDPL.includes(dplId)) {
      setSelectedDPL(selectedDPL.filter(id => id !== dplId));
    } else {
      setSelectedDPL([...selectedDPL, dplId]);
    }
  };

  // Toggle selected CP elements
  const toggleElemenCP = (namaElemen: string) => {
    if (elemenTerpilih.includes(namaElemen)) {
      setElemenTerpilih(elemenTerpilih.filter(name => name !== namaElemen));
    } else {
      setElemenTerpilih([...elemenTerpilih, namaElemen]);
    }
  };

  // Live editing support for Generated Modul Ajar (Deeply professional feature for teachers)
  const handleLiveEditValue = (path: string, newValue: any) => {
    if (!generatedLesson) return;

    const updated = { ...generatedLesson };
    
    // Simple path resolver
    if (path.includes(".")) {
      const parts = path.split(".");
      let current: any = updated;
      for (let i = 0; i < parts.length - 1; i++) {
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = newValue;
    } else {
      (updated as any)[path] = newValue;
    }

    setGeneratedLesson(updated);
  };

  // Trigger standard printable window.print() flow or toggle live preview
  const triggerPrint = () => {
    setIsPrintPreviewActive(true);
    showToast("Pratinjau cetak A4 diaktifkan secara instan!", "info");
  };

  // Generate and download standalone print-ready HTML page
  const downloadCleanPrintDocument = () => {
    const printAreaEl = document.getElementById("rancangan-cetak-resmi");
    if (!printAreaEl) {
      showToast("Gagal mendeteksi area cetak resmi!", "error");
      return;
    }
    
    // Clone element to prevent styling contamination
    const cloned = printAreaEl.cloneNode(true) as HTMLElement;
    
    // Remove any sticky floating preview toolbar if copied
    const toolbars = cloned.querySelectorAll('.no-print');
    toolbars.forEach(el => el.remove());

    const innerHTML = cloned.innerHTML;
    const mapelName = generatedLesson?.identitas?.mapel || "Modul_Ajar";
    const topikName = generatedLesson?.identitas?.topik || "Sesi";

    // Build the standalone premium HTML file with embedded styles
    const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cetak_Modul_Ajar_${mapelName.replace(/\s+/g, '_')}</title>
  
  <!-- Tailwind CSS Play CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- Google Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  
  <style>
    body {
      background-color: #f1f5f9;
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    @page {
      size: A4;
      margin: 15mm 20mm;
    }

    @media print {
      body {
        background-color: white !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      .no-print-toolbar {
        display: none !important;
      }
      .no-print {
        display: none !important;
      }
      .print-container {
        border: none !important;
        box-shadow: none !important;
        padding: 0 !important;
        margin: 0 !important;
        max-width: 100% !important;
      }
      .print-page-break {
        page-break-after: always !important;
        break-after: page !important;
      }
    }

    .print-container {
      background-color: white;
      color: #0f172a;
      width: 100%;
      max-width: 58rem;
      margin: 2rem auto;
      border: 1px solid #e2e8f0;
      border-radius: 1.5rem;
      padding: 3.5rem;
      box-shadow: 0 20px 25px -5px rgba(0,0,0,0.05), 0 10px 10px -6px rgba(0,0,0,0.05);
    }
    
    .print-page-break {
      page-break-after: always;
      break-after: page;
    }
  </style>
</head>
<body>

  <!-- FLOATING UTILITY HEADER (Auto-hidden on print) -->
  <div class="no-print-toolbar sticky top-0 z-50 bg-slate-900 text-white border-b border-slate-800 px-6 py-4.5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 font-sans print:hidden">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-lg shadow-md">
        📄
      </div>
      <div class="text-left">
        <h3 class="text-sm font-bold text-slate-100 uppercase tracking-wide">Modul Ajar Diferensiasi Terbentuk</h3>
        <p class="text-[10.5px] text-indigo-300 font-semibold">Siap Cetak Kertas A4 / Simpan PDF Resmi (Kurikulum Merdeka)</p>
      </div>
    </div>
    
    <div class="flex items-center gap-3">
      <button 
        onclick="window.print()" 
        style="background: linear-gradient(135deg, #4f46e5, #4338ca); border: none; padding: 0.65rem 1.3rem; border-radius: 0.75rem; color: white; font-weight: 850; font-size: 0.75rem; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);"
        onmouseover="this.style.transform='scale(1.03)'"
        onmouseout="this.style.transform='none'"
      >
        🖨️ CETAK / SIMPAN SEBAGAI PDF
      </button>
      <button 
        onclick="window.close()" 
        style="background: #334155; border: none; padding: 0.65rem 1.1rem; border-radius: 0.75rem; color: #cbd5e1; font-weight: 700; font-size: 0.75rem; cursor: pointer;"
      >
        Tutup Halaman
      </button>
    </div>
  </div>

  <div class="py-4">
    ${innerHTML}
  </div>

</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Modul_Ajar_${mapelName.replace(/\s+/g, '_')}_${topikName.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast("File cetak mandiri (.html) berhasil diunduh! Buka file tersebut untuk cetak instan.", "success");
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50/40 to-emerald-50/40 font-sans text-slate-800 transition-colors p-3 sm:p-6 md:p-8 overflow-x-hidden">
      
      {/* Glow shapes matching the glass theme */}
      <div className="absolute top-[-10%] left-[-15%] w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-indigo-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-15%] w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-emerald-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 pointer-events-none"></div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl backdrop-blur-md border transition-all duration-300 animate-slide-in ${
          toastType === "success" 
            ? "bg-emerald-50/90 text-emerald-800 border-emerald-200/60 shadow-emerald-100" 
            : toastType === "error"
            ? "bg-rose-50/90 text-rose-800 border-rose-200/60 shadow-rose-100"
            : "bg-indigo-50/90 text-indigo-800 border-indigo-200/60 shadow-indigo-100"
        }`}>
          {toastType === "success" && <div className="p-1 rounded-full bg-emerald-500 text-white"><Check className="w-4 h-4" /></div>}
          {toastType === "error" && <div className="p-1 rounded-full bg-rose-500 text-white"><Info className="w-4 h-4" /></div>}
          {toastType === "info" && <div className="p-1 rounded-full bg-indigo-500 text-white"><Sparkles className="w-4 h-4" /></div>}
          <p className="text-sm font-semibold">{toastMessage}</p>
        </div>
      )}

      {/* Main glass frame wrapper */}
      <div className={`no-print ${isPrintPreviewActive ? 'hidden' : 'flex'} max-w-7xl mx-auto bg-white/50 backdrop-blur-xl border border-white/40 rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] flex-col overflow-hidden relative z-10 min-h-[90vh]`}>
        
        {/* App Header */}
        <header className="px-6 md:px-10 py-5 border-b border-white/40 bg-white/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                Asisten Kurikulum Merdeka SMA
              </h1>
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider flex items-center gap-1">
                <span>Alur Keputusan Kepala BSKAP No. 046/H/KR/2025</span>
                <span className="px-2 py-0.5 bg-indigo-100 text-[10px] rounded-full text-indigo-700 ml-1">Pakar AI Indonesia</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {generatedLesson && (
              <>
                <button 
                  onClick={triggerPrint}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-full shadow-lg shadow-indigo-100 transition-all flex items-center gap-2 active:scale-95"
                >
                  <Printer className="w-4 h-4" />
                  Cetak Modul Jurnal (PDF)
                </button>
                <button 
                  onClick={() => setShowGdocModal(true)}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 text-white text-sm font-medium rounded-full shadow-lg shadow-emerald-100 transition-all flex items-center gap-2 active:scale-95"
                >
                  <FileText className="w-4 h-4" />
                  Ekspor ke Google Docs
                </button>
              </>
            )}
            
            <a 
              href="https://pusatinformasi.kolaborasi.kemdikbud.go.id" 
              target="_blank" 
              rel="noreferrer" 
              className="p-2 sm:px-4 sm:py-2.5 text-slate-600 hover:text-slate-800 text-sm font-medium rounded-full bg-white/80 border border-slate-200 transition-all hover:bg-white flex items-center gap-1"
            >
              <Info className="w-4 h-4" />
              <span className="hidden sm:inline">Portal BSKAP</span>
            </a>
          </div>
        </header>

        {/* Content Body Grid */}
        <div className="flex-1 lg:grid lg:grid-cols-12 overflow-hidden">
          
          {/* Controls Sidebar (Left Column - 5 cols) */}
          <section className="lg:col-span-5 border-r border-white/30 bg-white/10 p-5 md:p-8 overflow-y-auto max-h-[82vh] space-y-8">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  Langkah 1: Parameter & Profil Murid
                </h3>
                <span className="px-2.5 py-1 text-[10px] uppercase tracking-widest font-bold bg-white/70 border border-indigo-100 text-indigo-700 rounded-full">
                  Fase E/F SMA
                </span>
              </div>
              
              {/* Form entries */}
              <div className="space-y-4 bg-white/40 p-4 sm:p-5 rounded-2xl border border-white/60 shadow-sm">
                
                {/* Guru & NIP */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nama Guru Pengampu</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                        <User className="w-3.5 h-3.5" />
                      </span>
                      <input 
                        type="text" 
                        value={guruNama} 
                        onChange={(e) => setGuruNama(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 font-medium text-slate-800"
                        placeholder="Nama Guru"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-mono text-[9px]">NIP Guru Pengampu</label>
                    <input 
                      type="text" 
                      value={nipGuru} 
                      onChange={(e) => setNipGuru(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 font-medium text-slate-800 font-mono text-xs"
                      placeholder="Masukkan NIP Guru"
                    />
                  </div>
                </div>

                {/* Kepala Sekolah & NIP */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nama Kepala Sekolah</label>
                    <input 
                      type="text" 
                      value={namaKepsek} 
                      onChange={(e) => setNamaKepsek(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 font-medium text-slate-800"
                      placeholder="Nama Kepala Sekolah"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-mono text-[9px]">NIP Kepala Sekolah</label>
                    <input 
                      type="text" 
                      value={nipKepsek} 
                      onChange={(e) => setNipKepsek(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 font-medium text-slate-800 font-mono text-xs"
                      placeholder="Masukkan NIP Kepsek"
                    />
                  </div>
                </div>

                {/* Nama Sekolah, Alokasi & Jumlah Pertemuan */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nama Sekolah / Instansi</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                        <MapPin className="w-3.5 h-3.5" />
                      </span>
                      <input 
                        type="text" 
                        value={namaSekolah} 
                        onChange={(e) => setNamaSekolah(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 font-semibold text-slate-800"
                        placeholder="Nama Sekolah"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Alokasi Waktu Sesi</label>
                    <input 
                      type="text" 
                      value={alokasiWaktu} 
                      onChange={(e) => setAlokasiWaktu(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 font-medium text-slate-800"
                      placeholder="Contoh: 2 x 45 menit"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Rencana Jumlah Pertemuan</label>
                    <select 
                      value={jumlahPertemuan} 
                      onChange={(e) => setJumlahPertemuan(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 font-semibold text-slate-800"
                    >
                      <option value="1 Pertemuan">1 Pertemuan</option>
                      <option value="2 Pertemuan">2 Pertemuan</option>
                      <option value="3 Pertemuan">3 Pertemuan</option>
                      <option value="4 Pertemuan">4 Pertemuan</option>
                      <option value="5 Pertemuan">5 Pertemuan</option>
                      <option value="6 Pertemuan">6 Pertemuan</option>
                    </select>
                  </div>
                </div>

                {/* Subject Selector */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Mata Pelajaran</label>
                    <select 
                      value={selectedMapel} 
                      onChange={(e) => setSelectedMapel(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 font-medium text-slate-800"
                    >
                      <option value="Biologi">Biologi</option>
                      <option value="Fisika">Fisika</option>
                      <option value="Kimia">Kimia</option>
                      <option value="Matematika">Matematika</option>
                      <option value="Sejarah">Sejarah</option>
                      <option value="Custom">Mata Pelajaran Lain...</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Kelas & Fase</label>
                    <div className="grid grid-cols-2 gap-2">
                      <select 
                        value={selectedFase} 
                        onChange={(e) => {
                          const val = e.target.value as Fase;
                          setSelectedFase(val);
                          setSelectedKelas(val === Fase.FASE_E ? "X" : "XI");
                        }}
                        className="w-full px-2 py-2 text-xs bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 font-semibold text-slate-800"
                      >
                        <option value={Fase.FASE_E}>Fase E (10)</option>
                        <option value={Fase.FASE_F}>Fase F (11-12)</option>
                      </select>

                      <select 
                        value={selectedKelas} 
                        onChange={(e) => setSelectedKelas(e.target.value)}
                        className="w-full px-2 py-2 text-xs bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 font-semibold text-slate-800"
                      >
                        {selectedFase === Fase.FASE_E ? (
                          <option value="X">Kelas X</option>
                        ) : (
                          <>
                            <option value="XI">Kelas XI</option>
                            <option value="XII">Kelas XII</option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Custom Mapel text field */}
                {selectedMapel === "Custom" && (
                  <div>
                    <label className="block text-[11px] font-bold text-rose-500 uppercase tracking-wider mb-1.5">Tulis Mata Pelajaran Custom</label>
                    <input 
                      type="text" 
                      value={customMapel} 
                      onChange={(e) => setCustomMapel(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-rose-50/50 border border-rose-200 rounded-xl focus:outline-none focus:border-rose-400 font-medium text-slate-800"
                      placeholder="Masukkan nama mapel, misal: Geografi, Ekonomi..."
                    />
                  </div>
                )}

                {/* Topik Pembelajaran */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Topik / Bahasan Utama Pembelajaran</label>
                  <input 
                    type="text" 
                    value={topik} 
                    onChange={(e) => setTopik(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 font-semibold text-slate-800"
                    placeholder="Contoh: Sistem Gerak Konten Anatomi"
                  />
                </div>
              </div>
            </div>

            {/* Profil Murid (Minat, Gaya Belajar, Lingkungan) with Quick Preset Selector */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Langkah 2: Profil & Karakteristik Kelas
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 font-sans">Presets:</span>
                  <select 
                    onChange={(e) => {
                      const idx = parseInt(e.target.value);
                      if (!isNaN(idx)) {
                        setProfilMurid({
                          minat: STUDENT_PRESETS[idx].minat,
                          caraBelajar: STUDENT_PRESETS[idx].caraBelajar,
                          lingkungan: STUDENT_PRESETS[idx].lingkungan,
                        });
                        showToast("Preset Profil Murid Diaplikasikan!", "info");
                      }
                    }}
                    className="px-2 py-0.5 text-[10px] bg-white border border-slate-200 rounded-lg text-slate-600 font-medium focus:outline-none focus:border-emerald-300"
                    defaultValue="0"
                  >
                    {STUDENT_PRESETS.map((p, i) => (
                      <option key={i} value={i}>{p.name.substring(0, 24)}...</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-3.5 bg-white/40 p-4 sm:p-5 rounded-2xl border border-white/60 shadow-sm text-xs">
                <div>
                  <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1">Menganalisis Minat Murid</label>
                  <textarea 
                    value={profilMurid.minat}
                    onChange={(e) => setProfilMurid({ ...profilMurid, minat: e.target.value })}
                    rows={2}
                    className="w-full p-2.5 bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 font-sans text-slate-700 leading-relaxed"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1">Cara & Variasi Gaya Belajar</label>
                  <textarea 
                    value={profilMurid.caraBelajar}
                    onChange={(e) => setProfilMurid({ ...profilMurid, caraBelajar: e.target.value })}
                    rows={2}
                    className="w-full p-2.5 bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 font-sans text-slate-700 leading-relaxed"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1">Keadaan Sosiologis & Lingkungan Hidup</label>
                  <textarea 
                    value={profilMurid.lingkungan}
                    onChange={(e) => setProfilMurid({ ...profilMurid, lingkungan: e.target.value })}
                    rows={2}
                    className="w-full p-2.5 bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 font-sans text-slate-700 leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* Dimensions of Profil Lulusan */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                Langkah 3: Dimensi Profil Lulusan (DPL)
              </h3>
              
              <div className="bg-white/40 p-4 rounded-2xl border border-white/60 shadow-sm grid grid-cols-2 gap-2 text-xs">
                {DIMENSI_LULUSAN_OPTIONS.map((opt) => {
                  const active = selectedDPL.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => toggleDPL(opt.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between h-18 text-[11px] ${
                        active 
                          ? `${opt.color} ring-2 ring-indigo-400/50 font-bold shadow-sm` 
                          : "bg-white/60 border-slate-200 text-slate-600 hover:bg-white"
                      }`}
                    >
                      <span className="font-mono text-[9px] text-slate-400 font-bold block">{opt.dpl}</span>
                      <span className="leading-tight">{opt.id}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Fetch CP Button Trigger */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleFetchCP}
                disabled={loadingCP}
                className="w-full py-3.5 px-6 rounded-full text-sm font-bold bg-white text-indigo-700 border border-indigo-200/60 hover:bg-indigo-50 active:scale-95 shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 group disabled:opacity-55"
              >
                {loadingCP ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
                    Menghubungkan BSKAP 046/H/KR/2025...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-indigo-500 group-hover:rotate-12 transition-transform" />
                    Mulai Tahap 1: Tarik Capaian Pembelajaran (CP)
                  </>
                )}
              </button>
            </div>

            {/* Phase 1 display and confirmation */}
            {loadedCPData && (
              <div className="space-y-4 bg-white/60 p-4 sm:p-5 rounded-2xl border border-white/80 shadow-md animate-fade-in">
                <div className="flex items-center gap-2 text-indigo-900">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span className="font-bold text-sm tracking-tight">CP Resmi Teridentifikasi!</span>
                </div>

                <div className="space-y-3">
                  <div className="text-xs text-slate-600 space-y-1">
                    <span className="font-bold text-slate-700 uppercase tracking-wider block">Deskripsi Capaian Pembelajaran (CP) Utama:</span>
                    <textarea
                      value={customCPDescription}
                      onChange={(e) => setCustomCPDescription(e.target.value)}
                      rows={4}
                      className="w-full text-xs p-2.5 bg-white/90 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 font-sans leading-relaxed text-slate-700"
                    />
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Silakan Pilih / Tandai Fokus Elemen CP:</span>
                    
                    <div className="space-y-2">
                      {loadedCPData.elemen.map((el, i) => {
                        const checked = elemenTerpilih.includes(el.nama);
                        return (
                          <div 
                            key={i}
                            onClick={() => toggleElemenCP(el.nama)}
                            className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-2.5 ${
                              checked 
                                ? "bg-indigo-50/70 border-indigo-200 text-slate-800" 
                                : "bg-white/40 border-slate-200 text-slate-500 hover:bg-white"
                            }`}
                          >
                            <input 
                              type="checkbox" 
                              checked={checked} 
                              onChange={() => {}} // toggled on div click
                              className="mt-0.5 pointer-events-none rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <div className="space-y-1">
                              <span className="font-bold block text-slate-800">{el.nama}</span>
                              <span className="text-slate-600 leading-normal block text-[10.5px]">{el.deskripsi}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Phase 2 generator trigger */}
                  <div className="pt-2 border-t border-slate-200/60">
                    <p className="text-[11px] text-slate-500 mb-3.5 italic leading-snug">
                      Pilihan elemen di atas akan menjadi sumbu utama struktur diferensiasi dan pilar aktivitas dalam Modul Ajar pembelajaran.
                    </p>
                    
                    <button
                      type="button"
                      onClick={handleGenerateLessonDesign}
                      disabled={loadingLesson}
                      className="w-full py-4 px-6 rounded-full text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-2 group disabled:opacity-55"
                    >
                      {loadingLesson ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-white" />
                          Memproses Rekayasa Modul HOTS...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-indigo-200 animate-pulse" />
                          Mulai Tahap 2: Buat Skenario Desain Rinci
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Interactive Preview / Live Editor (Right Col - 7 cols) */}
          <main className="lg:col-span-7 p-4 sm:p-6 md:p-8 flex flex-col overflow-y-auto max-h-[82vh] bg-white/20">
            
            {loadingLesson && (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"></div>
                  <div className="absolute inset-2 bg-indigo-50 rounded-full flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">Menyusun Rencana Pembelajaran Berdiferensiasi...</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                    AI sedang merancang silabus, 4 Stasiun Gallery Walk (Kinestetik, Visual, Digital, Audio), instrumen Asesmen Diagnostik (Kahoot/Quizizz) & Formatif sesuai Keputusan Kepala BSKAP Nomor 046/H/KR/2025.
                  </p>
                </div>
              </div>
            )}

            {!loadingLesson && !generatedLesson && (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 max-w-lg mx-auto space-y-4 min-h-[300px]">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center shadow-lg shadow-indigo-100/55 animate-bounce">
                  <Compass className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-800">Belum Ada Desain Pembelajaran Terkoneksi</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Silakan isi parameter di kolom sebelah kiri dan klik <strong className="text-indigo-600">Tarik Capaian Pembelajaran (Tahap 1)</strong>, lalu klik tombol <strong className="text-indigo-600">Terbitkan Desain Rincinya (Tahap 2)</strong>.
                  </p>
                </div>
                
                <div className="p-4 rounded-2xl bg-indigo-900/5 border border-indigo-200/50 text-left text-xs text-slate-600 space-y-2">
                  <p className="font-bold text-indigo-950 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-indigo-500" />
                    Keunggulan Asisten Desain Pembelajaran:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-500">
                    <li>100% Sesuai standardisasi Kurikulum Merdeka BSKAP 046/2025.</li>
                    <li>Skenario interaktif Gallery Walk 4 stasiun kecerdasan majemuk siswa.</li>
                    <li>Opsi Diferensiasi dan rekomendasi digital termutakhir.</li>
                    <li>Dua format lengkap siap unduh/cetak sebagai Modul Ajar Jurnal Kelas.</li>
                  </ul>
                </div>
              </div>
            )}

            {generatedLesson && !loadingLesson && (
              <div className="flex-1 flex flex-col space-y-6 animate-fade-in">
                
                {/* Visual Header / Summary Card of outcome */}
                <div className="p-5 rounded-2xl bg-white/70 border border-white/60 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      Desain Siap Pakai
                    </span>
                    <h2 className="text-xl font-bold text-slate-800">
                      Modul Ajar Pembelajaran: {generatedLesson.identitas.topik}
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Disusun oleh {generatedLesson.identitas.namaGuru} untuk {generatedLesson.identitas.kelasFase}
                    </p>
                  </div>
                  
                  {/* Quick stats tags */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-[10px] uppercase font-bold tracking-wider rounded-lg border border-emerald-100 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      Diferensiasi Aktif
                    </span>
                    <span className="px-3 py-1 bg-amber-50 text-amber-800 text-[10px] uppercase font-bold tracking-wider rounded-lg border border-amber-100 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                      4 Stasiun Belajar
                    </span>
                  </div>
                </div>

                {/* Sub tabs to navigate editor of generated lesson */}
                <div className="border-b border-white/40 flex flex-wrap gap-1">
                  {[
                    { id: "identitas", label: "Profil & Identitas", icon: User },
                    { id: "desain", label: "Kurikulum & Diferensiasi", icon: Compass },
                    { id: "aktivitas", label: "Gallery Walk & Aktivitas", icon: Layers },
                    { id: "asesmen", label: "Asesmen & Lampiran", icon: FileText },
                    { id: "modulAjar", label: "Rencana Ajar Rinci", icon: BookOpen },
                    { id: "cetak", label: "Cetak & Unduh", icon: Printer },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id)}
                      className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all flex items-center gap-1.5 border-b-2 ${
                        activeTab === t.id 
                          ? "border-indigo-600 text-indigo-700 bg-white/40 font-bold" 
                          : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-white/20"
                      }`}
                    >
                      <t.icon className="w-3.5 h-3.5" />
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* Tab content wrappers + live editing textarea controls */}
                <div className="bg-white/40 p-5 sm:p-6 rounded-2xl border border-white/60 shadow-sm space-y-6">
                  
                  {/* TAB 1: IDENTITAS */}
                  {activeTab === "identitas" && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
                        <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-widest font-mono">
                          I. Identitas Sekolah & Analisis Demografi Kelas
                        </h4>
                        <span className="text-[10px] italic text-slate-400">Gunakan textbox untuk mengedit secara instan</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Nama Penyusun</span>
                          <input 
                            type="text" 
                            value={generatedLesson.identitas.namaGuru} 
                            onChange={(e) => handleLiveEditValue("identitas.namaGuru", e.target.value)}
                            className="w-full text-xs p-2.5 bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 font-semibold"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Mata Pelajaran</span>
                          <input 
                            type="text" 
                            value={generatedLesson.identitas.mapel} 
                            onChange={(e) => handleLiveEditValue("identitas.mapel", e.target.value)}
                            className="w-full text-xs p-2.5 bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 font-semibold"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Topik Utama</span>
                          <input 
                            type="text" 
                            value={generatedLesson.identitas.topik} 
                            onChange={(e) => handleLiveEditValue("identitas.topik", e.target.value)}
                            className="w-full text-xs p-2.5 bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 font-semibold"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Lama Pembelajaran / Alokasi</span>
                          <input 
                            type="text" 
                            value={generatedLesson.identitas.alokasiWaktu} 
                            onChange={(e) => handleLiveEditValue("identitas.alokasiWaktu", e.target.value)}
                            className="w-full text-xs p-2.5 bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 font-semibold"
                          />
                        </div>
                      </div>

                      <hr className="border-indigo-100" />

                      <div className="space-y-4">
                        <h5 className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">
                          Analisis Profil Kesiapan Murid (Bentuk Otentik)
                        </h5>
                        
                        <div className="space-y-3.5">
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-indigo-600 uppercase">1. Minat Peserta Didik</span>
                            <textarea 
                              value={generatedLesson.profilMurid.minat} 
                              onChange={(e) => handleLiveEditValue("profilMurid.minat", e.target.value)}
                              rows={3}
                              className="w-full text-xs p-2.5 bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 font-sans leading-relaxed text-slate-600"
                            />
                          </div>
                          
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-indigo-600 uppercase">2. Cara & Gaya Belajar Murid</span>
                            <textarea 
                              value={generatedLesson.profilMurid.caraBelajar} 
                              onChange={(e) => handleLiveEditValue("profilMurid.caraBelajar", e.target.value)}
                              rows={3}
                              className="w-full text-xs p-2.5 bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 font-sans leading-relaxed text-slate-600"
                            />
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-indigo-600 uppercase">3. Temu Kenal Keadaan Sosiologis/Lingkungan Tempat Tinggal</span>
                            <textarea 
                              value={generatedLesson.profilMurid.lingkungan} 
                              onChange={(e) => handleLiveEditValue("profilMurid.lingkungan", e.target.value)}
                              rows={3}
                              className="w-full text-xs p-2.5 bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 font-sans leading-relaxed text-slate-600"
                            />
                          </div>
                        </div>
                      </div>

                      <hr className="border-indigo-100" />

                      <div className="space-y-2">
                        <h5 className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">
                          Hubungan Dengan Dimensi Profil Lulusan (DPL)
                        </h5>
                        <textarea 
                          value={generatedLesson.identifikasiDPL.penjelasan} 
                          onChange={(e) => handleLiveEditValue("identifikasiDPL.penjelasan", e.target.value)}
                          rows={3}
                          className="w-full text-xs p-2.5 bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 font-sans leading-relaxed text-slate-600"
                        />
                      </div>

                      {generatedLesson.rekomendasiAlur && (
                        <>
                          <hr className="border-indigo-100" />
                          <div className="space-y-4 bg-indigo-50/40 p-4 sm:p-5 rounded-2xl border border-indigo-100/60 shadow-inner">
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
                              <h5 className="text-sm font-bold text-indigo-900 uppercase tracking-wide">
                                Rekomendasi Alur Pertemuan & Analisis Kerumitan Materi
                              </h5>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">1. Tingkat Kerumitan Materi</span>
                                <textarea
                                  value={generatedLesson.rekomendasiAlur.tingkatKerumitan}
                                  onChange={(e) => {
                                    const alur = { ...generatedLesson.rekomendasiAlur!, tingkatKerumitan: e.target.value };
                                    handleLiveEditValue("rekomendasiAlur", alur);
                                  }}
                                  rows={3}
                                  className="w-full text-xs p-2.5 bg-white/90 border border-indigo-100 rounded-xl focus:outline-none focus:border-indigo-400 font-medium text-slate-700 leading-relaxed shadow-sm"
                                />
                              </div>

                              <div className="space-y-1.5">
                                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">2. Saran Strategi Penyelesaian Rinci</span>
                                <textarea
                                  value={generatedLesson.rekomendasiAlur.saranRekomendasi}
                                  onChange={(e) => {
                                    const alur = { ...generatedLesson.rekomendasiAlur!, saranRekomendasi: e.target.value };
                                    handleLiveEditValue("rekomendasiAlur", alur);
                                  }}
                                  rows={3}
                                  className="w-full text-xs p-2.5 bg-white/90 border border-indigo-100 rounded-xl focus:outline-none focus:border-indigo-400 font-medium text-slate-700 leading-relaxed shadow-sm"
                                />
                              </div>
                            </div>

                            <div className="space-y-2.5 mt-2">
                              <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider block">
                                Rencana Rekomendasi Langkah per Pertemuan ({generatedLesson.identitas.jumlahPertemuan || "Multi-Sesi"})
                              </span>
                              <div className="grid grid-cols-1 gap-3">
                                {generatedLesson.rekomendasiAlur.pembagianPertemuan.map((pertemuan, index) => (
                                  <div key={index} className="bg-white/80 p-3.5 rounded-xl border border-indigo-100 shadow-sm flex flex-col md:flex-row gap-3">
                                    <div className="md:w-1/4">
                                      <div className="text-[10px] font-black text-indigo-600 font-mono tracking-widest uppercase mb-1">
                                        Sesi / Pertemuan {index + 1}
                                      </div>
                                      <input
                                        type="text"
                                        value={pertemuan.pertemuan}
                                        onChange={(e) => {
                                          const pembagian = [...generatedLesson.rekomendasiAlur!.pembagianPertemuan];
                                          pembagian[index] = { ...pembagian[index], pertemuan: e.target.value };
                                          handleLiveEditValue("rekomendasiAlur", { ...generatedLesson.rekomendasiAlur!, pembagianPertemuan: pembagian });
                                        }}
                                        className="w-full text-xs font-bold p-1 border-b border-dashed border-slate-300 focus:outline-none focus:border-indigo-500 bg-transparent text-slate-800"
                                      />
                                      <div className="text-[9px] font-bold text-slate-400 uppercase mt-1">Alokasi JP</div>
                                      <input
                                        type="text"
                                        value={pertemuan.alokasi}
                                        onChange={(e) => {
                                          const pembagian = [...generatedLesson.rekomendasiAlur!.pembagianPertemuan];
                                          pembagian[index] = { ...pembagian[index], alokasi: e.target.value };
                                          handleLiveEditValue("rekomendasiAlur", { ...generatedLesson.rekomendasiAlur!, pembagianPertemuan: pembagian });
                                        }}
                                        className="w-full text-[10px] font-mono p-1 border-b border-dashed border-slate-300 focus:outline-none focus:border-indigo-500 bg-transparent text-indigo-600 font-bold"
                                      />
                                    </div>
                                    <div className="md:w-3/4 flex flex-col gap-2">
                                      <div>
                                        <div className="text-[9px] font-bold text-slate-400 uppercase">Sub-Materi & Bahasan Utama</div>
                                        <input
                                          type="text"
                                          value={pertemuan.subTopik}
                                          onChange={(e) => {
                                            const pembagian = [...generatedLesson.rekomendasiAlur!.pembagianPertemuan];
                                            pembagian[index] = { ...pembagian[index], subTopik: e.target.value };
                                            handleLiveEditValue("rekomendasiAlur", { ...generatedLesson.rekomendasiAlur!, pembagianPertemuan: pembagian });
                                          }}
                                          className="w-full text-xs p-1.5 bg-slate-50/50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-400 font-semibold text-slate-700"
                                        />
                                      </div>
                                      <div>
                                        <div className="text-[9px] font-bold text-slate-400 uppercase">Ringkasan Aktivitas Utama</div>
                                        <textarea
                                          value={pertemuan.aktivitasUtama}
                                          onChange={(e) => {
                                            const pembagian = [...generatedLesson.rekomendasiAlur!.pembagianPertemuan];
                                            pembagian[index] = { ...pembagian[index], aktivitasUtama: e.target.value };
                                            handleLiveEditValue("rekomendasiAlur", { ...generatedLesson.rekomendasiAlur!, pembagianPertemuan: pembagian });
                                          }}
                                          rows={2}
                                          className="w-full text-xs p-1.5 bg-slate-50/50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-400 text-slate-600 leading-normal"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* TAB 2: DESAIN & DIFERENSIASI */}
                  {activeTab === "desain" && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
                        <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-widest font-mono">
                          II. Kerangka Kurikulum & Strategi Diferensiasi
                        </h4>
                      </div>

                      <div className="space-y-3">
                        <h5 className="text-[11px] font-bold text-slate-700 uppercase">Target Tujuan Pembelajaran (TP)</h5>
                        <div className="space-y-2">
                          {generatedLesson.tujuanPembelajaran.map((tp, idx) => (
                            <div key={idx} className="flex gap-2.5">
                              <span className="px-2.5 py-1 text-[11px] text-indigo-800 bg-indigo-50 font-bold rounded-lg h-7 font-mono">
                                TP {idx + 1}
                              </span>
                              <textarea 
                                value={tp}
                                onChange={(e) => {
                                  const tps = [...generatedLesson.tujuanPembelajaran];
                                  tps[idx] = e.target.value;
                                  handleLiveEditValue("tujuanPembelajaran", tps);
                                }}
                                rows={2}
                                className="flex-1 text-xs p-2 bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 text-slate-700 leading-normal"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <hr className="border-indigo-100" />

                      <div className="space-y-4">
                        <h5 className="text-[11px] font-bold text-indigo-950 uppercase tracking-widest">
                          Penerapan Strategi Pembelajaran Berdiferensiasi
                        </h5>

                        <div className="space-y-3.5">
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded-full">
                              1. Diferensiasi Konten (Sumber & Bentuk Berbeda)
                            </span>
                            <textarea 
                              value={generatedLesson.praktikPedagogis.diferensiasiKonten}
                              onChange={(e) => handleLiveEditValue("praktikPedagogis.diferensiasiKonten", e.target.value)}
                              rows={3}
                              className="w-full text-xs p-2.5 bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 text-slate-600 leading-normal"
                            />
                          </div>
                          
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-indigo-700 uppercase bg-indigo-50 px-2 py-0.5 rounded-full">
                              2. Diferensiasi Proses (Bantuan & Scaffolding)
                            </span>
                            <textarea 
                              value={generatedLesson.praktikPedagogis.diferensiasiProses}
                              onChange={(e) => handleLiveEditValue("praktikPedagogis.diferensiasiProses", e.target.value)}
                              rows={3}
                              className="w-full text-xs p-2.5 bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 text-slate-600 leading-normal"
                            />
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-purple-700 uppercase bg-purple-50 px-2 py-0.5 rounded-full">
                              3. Diferensiasi Produk (Pilihan Karya Murid)
                            </span>
                            <textarea 
                              value={generatedLesson.praktikPedagogis.diferensiasiProduk}
                              onChange={(e) => handleLiveEditValue("praktikPedagogis.diferensiasiProduk", e.target.value)}
                              rows={3}
                              className="w-full text-xs p-2.5 bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 text-slate-600 leading-normal"
                            />
                          </div>
                        </div>
                      </div>

                      <hr className="border-indigo-100" />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Kemitraan Orang Tua</span>
                          <textarea 
                            value={generatedLesson.kemitraanPembelajaran.orangTua}
                            onChange={(e) => handleLiveEditValue("kemitraanPembelajaran.orangTua", e.target.value)}
                            rows={3}
                            className="w-full text-xs p-2 bg-white/80 border border-slate-200 rounded-xl focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Kemitraan Komunitas & Praktisi</span>
                          <textarea 
                            value={generatedLesson.kemitraanPembelajaran.komunitas || ""}
                            onChange={(e) => handleLiveEditValue("kemitraanPembelajaran.komunitas", e.target.value)}
                            rows={3}
                            className="w-full text-xs p-2 bg-white/80 border border-slate-200 rounded-xl focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: GALLERY WALK & AKTIVITAS */}
                  {activeTab === "aktivitas" && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
                        <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-widest font-mono">
                          III. Misi Gallery Walk (4 Stasiun Kecerdasan Majemuk)
                        </h4>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Judul Eksplorasi Global</span>
                        <input 
                          type="text"
                          value={generatedLesson.pengalamanBelajar.mengaplikasikan.judul}
                          onChange={(e) => handleLiveEditValue("pengalamanBelajar.mengaplikasikan.judul", e.target.value)}
                          className="w-full text-xs p-2 bg-white border border-slate-200 rounded-xl font-bold"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Deskripsi Teknis Jalannya Roll Tour</span>
                        <textarea 
                          value={generatedLesson.pengalamanBelajar.mengaplikasikan.deskripsi}
                          onChange={(e) => handleLiveEditValue("pengalamanBelajar.mengaplikasikan.deskripsi", e.target.value)}
                          rows={2.5}
                          className="w-full text-xs p-2.5 bg-white/80 border border-slate-200 rounded-xl font-sans leading-normal text-slate-600"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        {generatedLesson.pengalamanBelajar.mengaplikasikan.stasiun.map((st, i) => {
                          const borderColors = [
                            "border-rose-200 bg-rose-50/20",
                            "border-amber-200 bg-amber-50/20",
                            "border-blue-200 bg-blue-50/20",
                            "border-purple-200 bg-purple-50/20"
                          ];
                          return (
                            <div key={i} className={`p-4 rounded-2xl border ${borderColors[i % 4]} space-y-2`}>
                              <div className="flex items-center justify-between">
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                  st.tipe === "Kinestetik" ? "bg-rose-100 text-rose-800" :
                                  st.tipe === "Visual" ? "bg-amber-100 text-amber-800" :
                                  st.tipe === "Digital" ? "bg-blue-100 text-blue-800" :
                                  "bg-purple-100 text-purple-800"
                                }`}>
                                  Stasiun {i+1} ({st.tipe})
                                </span>
                              </div>
                              <input 
                                type="text"
                                value={st.nama}
                                onChange={(e) => {
                                  const sts = [...generatedLesson.pengalamanBelajar.mengaplikasikan.stasiun];
                                  sts[i] = { ...sts[i], nama: e.target.value };
                                  handleLiveEditValue("pengalamanBelajar.mengaplikasikan.stasiun", sts);
                                }}
                                className="w-full text-xs font-bold p-1 bg-white border border-slate-200 rounded-lg focus:outline-none"
                              />
                              <textarea 
                                value={st.misi}
                                onChange={(e) => {
                                  const sts = [...generatedLesson.pengalamanBelajar.mengaplikasikan.stasiun];
                                  sts[i] = { ...sts[i], misi: e.target.value };
                                  handleLiveEditValue("pengalamanBelajar.mengaplikasikan.stasiun", sts);
                                }}
                                rows={3}
                                className="w-full text-xs p-2 bg-white/95 border border-slate-200 rounded-lg focus:outline-none text-slate-600 leading-normal font-sans"
                              />
                            </div>
                          );
                        })}
                      </div>

                      <hr className="border-indigo-100" />

                      <div className="space-y-3">
                        <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">Pilar Pemanfaatan Teknologi Digital</span>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="space-y-1 bg-white/70 p-3 rounded-xl border border-slate-100">
                            <span className="font-bold text-slate-500 text-[10px] uppercase">Rekomendasi Sumber Beljar</span>
                            <textarea 
                              value={generatedLesson.pemanfaatanDigital.sumberBelajar} 
                              onChange={(e) => handleLiveEditValue("pemanfaatanDigital.sumberBelajar", e.target.value)}
                              rows={2} className="w-full p-1 bg-transparent border-0 focus:outline-none resize-none text-slate-600 leading-relaxed font-sans"
                            />
                          </div>
                          <div className="space-y-1 bg-white/70 p-3 rounded-xl border border-slate-100">
                            <span className="font-bold text-slate-500 text-[10px] uppercase">Aktivitas Evaluasi Kuis</span>
                            <textarea 
                              value={generatedLesson.pemanfaatanDigital.aktivitas} 
                              onChange={(e) => handleLiveEditValue("pemanfaatanDigital.aktivitas", e.target.value)}
                              rows={2} className="w-full p-1 bg-transparent border-0 focus:outline-none resize-none text-slate-600 leading-relaxed font-sans"
                            />
                          </div>
                          <div className="space-y-1 bg-white/70 p-3 rounded-xl border border-slate-100">
                            <span className="font-bold text-slate-500 text-[10px] uppercase">Produk Kreatif Proyek</span>
                            <textarea 
                              value={generatedLesson.pemanfaatanDigital.produkProyek} 
                              onChange={(e) => handleLiveEditValue("pemanfaatanDigital.produkProyek", e.target.value)}
                              rows={2} className="w-full p-1 bg-transparent border-0 focus:outline-none resize-none text-slate-600 leading-relaxed font-sans"
                            />
                          </div>
                          <div className="space-y-1 bg-white/70 p-3 rounded-xl border border-slate-100">
                            <span className="font-bold text-slate-500 text-[10px] uppercase">Media Kolaborasi</span>
                            <textarea 
                              value={generatedLesson.pemanfaatanDigital.kolaborasi} 
                              onChange={(e) => handleLiveEditValue("pemanfaatanDigital.kolaborasi", e.target.value)}
                              rows={2} className="w-full p-1 bg-transparent border-0 focus:outline-none resize-none text-slate-600 leading-relaxed font-sans"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: ASESMEN & LAMPIRAN */}
                  {activeTab === "asesmen" && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
                        <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-widest font-mono">
                          IV. Integrasi Rencana Asesmen Komprehensif
                        </h4>
                      </div>

                      <div className="space-y-4">
                        <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">Matriks Jenis & Teknik Asesmen</span>
                        
                        <div className="space-y-3.5">
                          {generatedLesson.tabelAsesmen.map((as, idx) => (
                            <div key={idx} className="bg-white/85 p-4 rounded-xl border border-slate-200/80 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-800 text-xs">{as.jenis}</span>
                                <input 
                                  type="text"
                                  value={as.teknik}
                                  onChange={(e) => {
                                    const nextAs = [...generatedLesson.tabelAsesmen];
                                    nextAs[idx] = { ...nextAs[idx], teknik: e.target.value };
                                    handleLiveEditValue("tabelAsesmen", nextAs);
                                  }}
                                  className="text-[11px] px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg font-bold text-indigo-700 text-right w-1/2"
                                />
                              </div>
                              <textarea 
                                value={as.detail}
                                onChange={(e) => {
                                  const nextAs = [...generatedLesson.tabelAsesmen];
                                  nextAs[idx] = { ...nextAs[idx], detail: e.target.value };
                                  handleLiveEditValue("tabelAsesmen", nextAs);
                                }}
                                rows={2}
                                className="w-full text-xs p-1.5 bg-transparent border-0 focus:outline-none text-slate-600 leading-relaxed font-sans"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <hr className="border-indigo-100" />

                      <div className="space-y-3">
                        <span className="text-[11px] font-bold text-slate-700 uppercase block">Lampiran & Pendukung Guru</span>
                        <div className="space-y-2 bg-indigo-50/20 p-4 rounded-xl border border-indigo-100">
                          {generatedLesson.lampiran.map((lam, idx) => (
                            <div key={idx} className="flex gap-2.5">
                              <span className="text-xs font-bold text-indigo-600 font-mono pt-1">📎</span>
                              <textarea 
                                value={lam}
                                onChange={(e) => {
                                  const nextLam = [...generatedLesson.lampiran];
                                  nextLam[idx] = e.target.value;
                                  handleLiveEditValue("lampiran", nextLam);
                                }}
                                rows={2}
                                className="flex-1 text-xs p-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 5: RENCANA AJAR RINCI */}
                  {activeTab === "modulAjar" && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
                        <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-widest font-mono">
                          V. Alur Rinci Pembelajaran (Modul Ajar Rinci)
                        </h4>
                      </div>

                      <div className="space-y-3.5">
                        <div className="space-y-1">
                          <span className="text-[11.5px] font-bold text-slate-800 uppercase block">A. Pemahaman Bermakna (Filosofi Kehidupan)</span>
                          <textarea 
                            value={generatedLesson.modulAjarCP.pemahamanBermakna}
                            onChange={(e) => handleLiveEditValue("modulAjarCP.pemahamanBermakna", e.target.value)}
                            rows={3.5}
                            className="w-full text-xs p-3 bg-white border border-slate-200 rounded-xl leading-relaxed text-slate-700 font-sans"
                          />
                        </div>

                        <hr className="border-indigo-100" />

                        <div className="space-y-3">
                          <span className="text-[11px] font-bold text-slate-800 uppercase block">B. Pertanyaan Pemantik Logika Berpikir Kritis</span>
                          {generatedLesson.modulAjarCP.pertanyaanPemantik.map((pem, idx) => (
                            <div key={idx} className="flex gap-2">
                              <span className="text-xs font-bold text-amber-500 font-mono mt-2">?</span>
                              <textarea 
                                value={pem}
                                onChange={(e) => {
                                  const nextPems = [...generatedLesson.modulAjarCP.pertanyaanPemantik];
                                  nextPems[idx] = e.target.value;
                                  handleLiveEditValue("modulAjarCP.pertanyaanPemantik", nextPems);
                                }}
                                rows={2}
                                className="flex-1 text-xs p-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:border-indigo-400"
                              />
                            </div>
                          ))}
                        </div>

                        <hr className="border-indigo-100" />

                        {/* Rencana Skenario Per Perjalanan Waktu */}
                        <div className="space-y-4">
                          <span className="text-[11.5px] font-bold text-indigo-950 uppercase block">C. Skenario & Langkah Pembelajaran Terjadwal (90 Menit)</span>

                          <div className="space-y-4">
                            {/* Pendahuluan */}
                            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 relative">
                              <span className="absolute -top-2.5 left-4 px-2 py-0.5 text-[9px] font-bold bg-indigo-600 text-white rounded-full uppercase tracking-widest">
                                1. Pendahuluan (10 Menit)
                              </span>
                              <div className="space-y-2 mt-1">
                                {generatedLesson.modulAjarCP.kegiatanPendahuluan.map((k, idx) => (
                                  <textarea 
                                    key={idx}
                                    value={k}
                                    onChange={(e) => {
                                      const nextKeg = [...generatedLesson.modulAjarCP.kegiatanPendahuluan];
                                      nextKeg[idx] = e.target.value;
                                      handleLiveEditValue("modulAjarCP.kegiatanPendahuluan", nextKeg);
                                    }}
                                    rows={2}
                                    className="w-full text-xs p-1.5 bg-white border border-slate-100 rounded-lg focus:outline-none font-sans text-slate-600"
                                  />
                                ))}
                              </div>
                            </div>

                            {/* Inti */}
                            <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/10 relative">
                              <span className="absolute -top-2.5 left-4 px-2 py-0.5 text-[9px] font-bold bg-indigo-600 text-white rounded-full uppercase tracking-widest">
                                2. Kegiatan Inti (60 Menit)
                              </span>
                              <div className="space-y-2 mt-1">
                                {generatedLesson.modulAjarCP.kegiatanInti.map((k, idx) => (
                                  <textarea 
                                    key={idx}
                                    value={k}
                                    onChange={(e) => {
                                      const nextKeg = [...generatedLesson.modulAjarCP.kegiatanInti];
                                      nextKeg[idx] = e.target.value;
                                      handleLiveEditValue("modulAjarCP.kegiatanInti", nextKeg);
                                    }}
                                    rows={2}
                                    className="w-full text-xs p-1.5 bg-white border border-indigo-100 rounded-lg focus:outline-none font-sans text-slate-600"
                                  />
                                ))}
                              </div>
                            </div>

                            {/* Penutup */}
                            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 relative">
                              <span className="absolute -top-2.5 left-4 px-2 py-0.5 text-[9px] font-bold bg-indigo-600 text-white rounded-full uppercase tracking-widest">
                                3. Penutup (20 Menit)
                              </span>
                              <div className="space-y-2 mt-1">
                                {generatedLesson.modulAjarCP.kegiatanPenutup.map((k, idx) => (
                                  <textarea 
                                    key={idx}
                                    value={k}
                                    onChange={(e) => {
                                      const nextKeg = [...generatedLesson.modulAjarCP.kegiatanPenutup];
                                      nextKeg[idx] = e.target.value;
                                      handleLiveEditValue("modulAjarCP.kegiatanPenutup", nextKeg);
                                    }}
                                    rows={2}
                                    className="w-full text-xs p-1.5 bg-white border border-slate-100 rounded-lg focus:outline-none font-sans text-slate-600"
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                  {activeTab === "cetak" && (
                    <div className="space-y-6 animate-fade-in text-left">
                      <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
                        <h4 className="text-sm font-bold text-indigo-700 uppercase tracking-widest font-mono flex items-center gap-2">
                          <Printer className="w-4 h-4 text-indigo-600" />
                          VI. Cetak & Unduh PDF Modul Ajar Resmi
                        </h4>
                        <span className="px-2 py-0.5 text-[9px] font-bold bg-indigo-100 text-indigo-700 rounded-full uppercase tracking-wider">
                          Ready to Print
                        </span>
                      </div>

                      {isIframe && (
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex gap-3 items-start text-xs text-amber-900 leading-relaxed shadow-sm">
                          <span className="text-lg">⚠️</span>
                          <div>
                            <span className="font-bold block text-amber-950 mb-0.5">Membuka di dalam Preview Iframe Terdeteksi</span>
                            <span className="text-slate-600 block mb-2">
                              Beberapa browser melarang perintah cetak <code className="font-mono bg-amber-100/60 px-1 rounded text-amber-950">window.print()</code> diluncurkan langsung dari dalam panel pratinjau yang terisolasi.
                            </span>
                            <div className="space-y-1 bg-white/60 p-2.5 rounded-xl border border-amber-250 text-[11px] text-amber-900">
                              <p className="font-bold">Agar bisa mencetak dengan lancar:</p>
                              <ol className="list-decimal pl-4.5 space-y-0.5 text-slate-700">
                                <li>Klik ikon <strong className="text-slate-900">"Open in new tab" (Buka di tab baru)</strong> di pojok kanan paling atas layar Anda.</li>
                                <li>Setelah terbuka di tab baru, kembali ke menu ini dan klik tombol <strong className="text-slate-900">"Cetak"</strong> sekali lagi!</li>
                                <li>Sebagai alternatif instan, tekan tombol kombinasi <kbd className="font-mono bg-white border px-1 rounded text-slate-700">Ctrl + P</kbd> (Windows/Linux) atau <kbd className="font-mono bg-white border px-1 rounded text-slate-700">Cmd + P</kbd> (Mac) di keyboard Anda saat berada di tab baru tersebut.</li>
                              </ol>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="bg-indigo-50/40 p-5 rounded-2xl border border-indigo-100/60 space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5 shadow-inner animate-pulse">
                            <Info className="w-5 h-5" />
                          </div>
                          <div className="space-y-1">
                            <h5 className="text-xs font-bold text-slate-800">Panduan Cetak Langsung dan Pengunduhan PDF Resmi</h5>
                            <p className="text-[11px] text-slate-600 leading-relaxed text-justify">
                              Gunakan tombol cetak resmi di bawah untuk mencetak dokumen secara fisik atau menyimpannya sebagai file **PDF resolusi tinggi**. Desain halaman cetak telah diformat secara presisi untuk konsistensi ukuran kertas **A4** dan margin kurikulum formal Kemendikbudristek (2cm).
                            </p>
                          </div>
                        </div>

                        <div className="bg-white p-3.5 rounded-xl border border-indigo-100/30 text-[11px] text-slate-600 space-y-1">
                          <p className="font-bold text-indigo-950">⚙️ Pengaturan Dialog Cetak Browser yang Disarankan:</p>
                          <ol className="list-decimal pl-4.5 space-y-1 text-slate-600">
                            <li>Atur **Tujuan (Destination)** ke <span className="font-bold text-slate-800">"Save as PDF"</span> (Simpan sebagai PDF).</li>
                            <li>Pilih ukuran kertas <span className="font-bold text-slate-800">"A4"</span>.</li>
                            <li>Centang opsi **"Background graphics"** (Grafis Latar Belakang) agar warna aksen, bingkai, dan struktur tabel tercetak dengan sempurna.</li>
                            <li>Hapus centang pada **"Headers and footers"** (Kepala & Kaki Halaman) agar garis url halaman browser tidak mengganggu layout rapi dokumen.</li>
                          </ol>
                        </div>
                      </div>

                      {/* Identitas Guru, Kepala Sekolah & Judul Panel Edit */}
                      <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-205/60 space-y-4">
                        <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-200/60">
                          <User className="w-3.5 h-3.5 text-slate-600" />
                          Verifikasi Identitas & Lembar Pengesahan
                        </h5>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5 text-left">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase">Nama Penyusun / Guru Pengampu</label>
                            <input 
                              type="text" 
                              value={guruNama} 
                              onChange={(e) => setGuruNama(e.target.value)}
                              className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 font-semibold text-slate-800 shadow-sm"
                            />
                          </div>

                          <div className="space-y-1.5 text-left">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase">NIP Guru</label>
                            <input 
                              type="text" 
                              value={nipGuru} 
                              onChange={(e) => setNipGuru(e.target.value)}
                              className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 font-mono text-slate-800 shadow-sm"
                              placeholder="Masukkan NIP Guru"
                            />
                          </div>

                          <div className="space-y-1.5 text-left">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase">Nama Kepala Sekolah</label>
                            <input 
                              type="text" 
                              value={namaKepsek} 
                              onChange={(e) => setNamaKepsek(e.target.value)}
                              className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 font-semibold text-slate-800 shadow-sm"
                            />
                          </div>

                          <div className="space-y-1.5 text-left">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase">NIP Kepala Sekolah</label>
                            <input 
                              type="text" 
                              value={nipKepsek} 
                              onChange={(e) => setNipKepsek(e.target.value)}
                              className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 font-mono text-slate-800 shadow-sm"
                              placeholder="Masukkan NIP Kepala Sekolah"
                            />
                          </div>

                          <div className="space-y-1.5 md:col-span-2 text-left">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase">Mata Pelajaran & Kelas</label>
                            <div className="grid grid-cols-2 gap-3">
                              <input 
                                type="text" 
                                value={generatedLesson.identitas.mapel} 
                                onChange={(e) => handleLiveEditValue("identitas.mapel", e.target.value)}
                                className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 font-semibold text-slate-800 shadow-sm"
                              />
                              <input 
                                type="text" 
                                value={generatedLesson.identitas.kelasFase} 
                                onChange={(e) => handleLiveEditValue("identitas.kelasFase", e.target.value)}
                                className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 font-semibold text-slate-800 shadow-sm"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Mock Tanda Tangan Preview */}
                      <div className="border border-dashed border-indigo-200 p-4 rounded-2xl bg-white/50 space-y-3">
                        <div className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider block text-left">Pratinjau Lembar Tanda Tangan Resmi:</div>
                        <div className="grid grid-cols-2 gap-8 text-[11px] font-medium text-slate-700 bg-white p-4 rounded-xl border border-slate-100 shadow-sm leading-relaxed text-left">
                          <div className="space-y-12">
                            <div>
                              <p className="text-slate-400 text-[10px]">Mengetahui,</p>
                              <p className="font-bold text-slate-800 text-[11.5px]">Kepala Sekolah {namaSekolah}</p>
                            </div>
                            <div>
                              <p className="font-bold underline text-slate-900 uppercase">{namaKepsek || "Silakan Isi Nama Kepsek"}</p>
                              <p className="text-[9px] text-slate-400 font-mono">NIP. {nipKepsek || "________________________"}</p>
                            </div>
                          </div>

                          <div className="space-y-12">
                            <div>
                              <p className="text-slate-400 text-[10px]">Disetujui di {namaSekolah.replace(/SMA Negeri|SMA/i, '').trim() || "Sekolah"}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                              <p className="font-bold text-slate-800 text-[11.5px]">Guru Mata Pelajaran</p>
                            </div>
                            <div>
                              <p className="font-bold underline text-slate-900 uppercase">{guruNama || "Silakan Isi Nama Guru"}</p>
                              <p className="text-[9px] text-slate-400 font-mono">NIP. {nipGuru || "________________________"}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Print Activations */}
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3.5">
                        <button 
                          onClick={triggerPrint}
                          className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-black text-xs rounded-2xl shadow-xl shadow-indigo-100 uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] active:scale-95 duration-200"
                        >
                          <Printer className="w-5 h-5 text-indigo-50" />
                          Pratinjau Kertas A4 & Cetak (Layar Penuh)
                        </button>
                        
                        <button 
                          onClick={downloadCleanPrintDocument}
                          className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-black text-xs rounded-2xl shadow-xl shadow-emerald-100 uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] active:scale-95 duration-200 border border-emerald-500/20"
                        >
                          <FileText className="w-5 h-5 text-emerald-50 animate-bounce" />
                          Unduh Dokumen Cetak Mandiri (HTML / PDF)
                        </button>
                      </div>
                    </div>
                  )}

                </div>

                {/* Footer status buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/70 border border-white/60 rounded-2xl gap-3">
                  <div className="text-xs text-slate-500 font-medium space-y-1.5 max-w-xl">
                     <div>Perubahan di atas disimpan secara lokal di memori dan siap dicetak.</div>
                     <div className="text-[10.5px] text-indigo-600 bg-indigo-50/50 px-2.5 py-1.5 rounded-lg border border-indigo-100 flex items-start gap-1">
                       <span className="font-bold shrink-0">💡 Tips Unduh PDF:</span>
                       <span>Klik tombol <strong>"Format Cetak PDF"</strong> di samping, lalu pilih printer tujuan (Destination) sebagai <strong>"Save as PDF"</strong> atau <strong>"Simpan sebagai PDF"</strong> pada dialog cetak sistem browser Anda.</span>
                     </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button 
                      onClick={triggerPrint}
                      className="px-6 py-2.5 bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold rounded-full text-xs transition-all hover:bg-slate-100"
                    >
                      Format Cetak PDF
                    </button>
                    <button 
                      onClick={() => setShowGdocModal(true)}
                      className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-indigo-500 text-white font-bold rounded-full text-xs transition-all shadow-md shadow-emerald-100 hover:scale-[1.02] flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Ekspor ke Google Docs
                    </button>
                  </div>
                </div>

              </div>
            )}
          </main>
        </div>

        {/* App Footer */}
        <footer className="no-print px-6 md:px-10 py-5 border-t border-slate-200/60 bg-white/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500 text-center sm:text-left z-10 transition-all">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Terintegrasi dengan Model Gemini AI Resmi Kemendikbudristek 2025/2026</span>
          </div>
          <span className="text-slate-700 font-bold">
            Asisten Kurikulum Merdeka SMA <span className="text-indigo-600">@Copyright by. Pak GuruAI</span>
          </span>
        </footer>

      </div>

      {/* -------------------- PRINT-ONLY COMPREHENSIVE VIEW -------------------- */}
      {/* This renders pages exactly structured, detailed and identical layout style as the user's uploaded images */}
      {generatedLesson && (
        <div id="rancangan-cetak-resmi" className={isPrintPreviewActive 
          ? "fixed inset-0 z-50 bg-slate-950/95 overflow-y-auto p-4 sm:p-8 flex flex-col items-center backdrop-blur-md pt-24 print:relative print:inset-auto print:z-auto print:bg-white print:p-0 print:overflow-visible print:block" 
          : "print-only font-sans leading-relaxed text-slate-900 bg-white p-0"
        }>
          {isPrintPreviewActive && (
            <div className="no-print print:hidden w-full max-w-4xl bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 mb-6 sticky top-2 z-50 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                  <Printer className="w-5 h-5 animate-pulse" />
                </div>
                <div className="text-left font-sans">
                  <h3 className="text-sm font-bold text-slate-800">Modul Ajar Diferensiasi - Pratinjau Kertas A4 Resmi</h3>
                  <p className="text-[10.5px] text-indigo-600 font-semibold bg-indigo-50/50 px-2 py-0.5 rounded-full inline-block mt-0.5">Format Standar Kurikulum Merdeka Kemendikbudristek</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
                {isIframe && (
                  <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-[10px] text-amber-800 font-bold rounded-xl border border-amber-200/60 max-w-xs text-left leading-normal">
                    <span>💡 Tips: Klik 'Buka di Tab Baru' di kanan atas jika cetak tidak merespons</span>
                  </div>
                )}
                
                <button 
                  onClick={() => {
                    window.print();
                  }}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl transition-all shadow-lg shadow-indigo-100 flex items-center gap-1.5 hover:scale-[1.02] active:scale-95 whitespace-nowrap"
                >
                  <Printer className="w-4 h-4 text-indigo-50" />
                  Mulai Cetak / Simpan PDF
                </button>
                
                <button 
                  onClick={downloadCleanPrintDocument}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl transition-all shadow-lg shadow-emerald-100 flex items-center gap-1.5 hover:scale-[1.02] active:scale-95 whitespace-nowrap"
                >
                  <FileText className="w-4 h-4 text-emerald-50" />
                  Unduh File HTML Cetak Mandiri
                </button>

                <button 
                  onClick={() => setIsPrintPreviewActive(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200/50 transition-all whitespace-nowrap"
                >
                  Keluar Pratinjau
                </button>
              </div>
            </div>
          )}
          
          {/* PAGE 1 */}
          <div className={`print-container w-full max-w-4xl mx-auto ${isPrintPreviewActive ? 'bg-white text-slate-800 shadow-2xl rounded-3xl p-8 sm:p-12 mb-8 border border-slate-200' : 'border-0'} print:shadow-none print:border-0 print:p-0 print:m-0 print:bg-white print:rounded-none`}>
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-500 border-b pb-1 mb-6">
              <span>{generatedLesson.identitas.mapel} / Rancangan Sesi Pembelajaran Resmi</span>
              <span>{generatedLesson.identitas.kelasFase}</span>
            </div>

            {/* Header Judul Modul Ajar Resmi */}
            <div className="text-center space-y-2 mb-8 mt-2">
              <h1 className="text-2xl font-black uppercase tracking-widest text-slate-950 border-b-4 border-slate-950 pb-3 font-sans">
                MODUL AJAR DIFERENSIASI KURIKULUM MERDEKA
              </h1>
              <div className="text-xs font-bold text-slate-800 tracking-wide uppercase flex flex-wrap justify-center items-center gap-x-4 gap-y-1">
                <span>MATAPELAJARAN: {generatedLesson.identitas.mapel}</span>
                <span className="text-slate-400">•</span>
                <span>KELAS & FASE: {generatedLesson.identitas.kelasFase}</span>
                <span className="text-slate-400">•</span>
                <span>TOPIK SESI: {generatedLesson.identitas.topik}</span>
              </div>
              <div className="text-[11px] text-slate-600 font-medium">
                Penyusun: <span className="font-bold text-slate-900">{guruNama}</span> | Sekolah: <span className="font-bold text-slate-900">{namaSekolah}</span>
              </div>
            </div>

            {/* Main grid structure page 1 */}
            <table className="w-full border-collapse border border-slate-300 text-[11px] sm:text-xs">
              <tbody>
                {/* Identitas */}
                <tr className="border-b border-slate-300">
                  <td className="w-[120px] p-4 font-bold border-r border-slate-300 align-top uppercase tracking-wider bg-slate-50">Identitas</td>
                  <td className="p-4 space-y-2.5 font-medium">
                    <div className="grid grid-cols-2 gap-4">
                      <div><strong>Nama Sekolah / Instansi :</strong> {namaSekolah}</div>
                      <div><strong>Alokasi Sesi :</strong> {generatedLesson.identitas.alokasiWaktu}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><strong>Nama Guru Pengampu :</strong> {guruNama}</div>
                      <div><strong>NIP Guru :</strong> {nipGuru || "-"}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><strong>Kepala Sekolah :</strong> {namaKepsek}</div>
                      <div><strong>NIP Kepsek :</strong> {nipKepsek || "-"}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-2 text-[10.5px]">
                      <div><strong>Mata Pelajaran & Fase :</strong> {generatedLesson.identitas.mapel} / {generatedLesson.identitas.kelasFase}</div>
                      <div><strong>Topik Utama Sesi :</strong> {generatedLesson.identitas.topik}</div>
                    </div>
                  </td>
                </tr>

                {/* Profil Murid */}
                <tr className="border-b border-slate-300">
                  <td className="p-4 font-bold border-r border-slate-300 align-top uppercase tracking-wider bg-slate-50">Profil Murid</td>
                  <td className="p-4 space-y-3 text-justify leading-relaxed">
                    <div>
                      <strong className="text-slate-800 block mb-1">Minat :</strong>
                      {generatedLesson.profilMurid.minat}
                    </div>
                    <div>
                      <strong className="text-slate-800 block mb-1">Cara Belajar :</strong>
                      {generatedLesson.profilMurid.caraBelajar}
                    </div>
                    <div>
                      <strong className="text-slate-800 block mb-1">Lingkungan Tempat Tinggal :</strong>
                      {generatedLesson.profilMurid.lingkungan}
                    </div>
                  </td>
                </tr>

                {/* Identifikasi */}
                <tr className="border-b border-slate-300">
                  <td className="p-4 font-bold border-r border-slate-300 align-top uppercase tracking-wider bg-slate-50">Identifikasi</td>
                  <td className="p-4 space-y-3">
                    <strong className="text-slate-800 block mb-2">Dimensi Profil Lulusan (PPP) yang Aktif di Rangka Pembelajaran Sesi Ini:</strong>
                    
                    <div className="grid grid-cols-4 border border-slate-300 text-center">
                      {DIMENSI_LULUSAN_OPTIONS.slice(0, 4).map((o) => {
                        const hasSelected = selectedDPL.includes(o.id);
                        return (
                          <div key={o.id} className="border-r border-b border-slate-300 p-2 flex flex-col justify-between h-20">
                            <span className="font-bold text-[9px] text-slate-400">{o.dpl}</span>
                            <span className={`text-[10px] leading-tight ${hasSelected ? "font-bold text-rose-600" : "text-slate-400"}`}>
                              {o.id}
                            </span>
                          </div>
                        );
                      })}
                      {DIMENSI_LULUSAN_OPTIONS.slice(4, 8).map((o) => {
                        const hasSelected = selectedDPL.includes(o.id);
                        return (
                          <div key={o.id} className="border-r border-slate-300 p-2 flex flex-col justify-between h-20">
                            <span className="font-bold text-[9px] text-slate-400">{o.dpl}</span>
                            <span className={`text-[10px] leading-tight ${hasSelected ? "font-bold text-rose-600" : "text-slate-400"}`}>
                              {o.id}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="text-[10px] italic text-slate-500 mt-2">
                      * Penjelasan Manifestasi DPL: {generatedLesson.identifikasiDPL.penjelasan}
                    </div>
                  </td>
                </tr>

                {/* Elemen */}
                <tr>
                  <td className="p-4 font-bold border-r border-slate-300 align-top uppercase bg-slate-50">Elemen</td>
                  <td className="p-4 space-y-2">
                    {generatedLesson.elemenCP.map((el, i) => (
                      <div key={i} className="text-xs">
                        <strong>● {el.nama} :</strong> <span className="text-slate-700">{el.deskripsi}</span>
                      </div>
                    ))}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* PAGE 1.5 (Rekomendasi Alur Sesi & Kompleksitas) */}
          {generatedLesson.rekomendasiAlur && (
            <div className={`print-page-break print-container w-full max-w-4xl mx-auto text-xs ${isPrintPreviewActive ? 'bg-white text-slate-800 shadow-2xl rounded-3xl p-8 sm:p-12 mb-8 border border-slate-200' : 'border-0 p-8'} print:shadow-none print:border-0 print:p-0 print:m-0 print:bg-white print:rounded-none`}>
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-500 border-b pb-1 mb-6">
                <span>{generatedLesson.identitas.mapel} / Rekomendasi Sesi & Kompleksitas</span>
                <span>{generatedLesson.identitas.kelasFase}</span>
              </div>

              <div className="space-y-6">
                <div className="text-center space-y-2 mb-6">
                  <h1 className="text-lg font-black uppercase tracking-widest text-slate-950 border-b-2 border-slate-950 pb-2">
                    REKOMENDASI ALUR BELAJAR & KOMPLEKSITAS MATERI
                  </h1>
                  <p className="text-[10px] text-slate-500 font-medium">Berdasarkan Rencana Pembelajaran {generatedLesson.identitas.jumlahPertemuan || "Multi-Sesi"}</p>
                </div>

                <div className="grid grid-cols-2 gap-6 leading-relaxed">
                  <div className="border border-slate-300 p-4 bg-slate-50/50 rounded-xl">
                    <h3 className="font-black text-slate-900 border-b pb-1 mb-2 uppercase text-[10px] tracking-wider text-indigo-900">
                      I. Analisis Tingkat Kerumitan Materi
                    </h3>
                    <p className="text-slate-700 whitespace-pre-line leading-relaxed text-justify">{generatedLesson.rekomendasiAlur.tingkatKerumitan}</p>
                  </div>

                  <div className="border border-slate-300 p-4 bg-slate-50/50 rounded-xl">
                    <h3 className="font-black text-slate-900 border-b pb-1 mb-2 uppercase text-[10px] tracking-wider text-indigo-900">
                      II. Saran Strategi Penyelesaian Rinci
                    </h3>
                    <p className="text-slate-700 whitespace-pre-line leading-relaxed text-justify">{generatedLesson.rekomendasiAlur.saranRekomendasi}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-black text-slate-900 border-b pb-1.5 mb-3 uppercase text-[10px] tracking-wide text-indigo-950">
                    III. Rencana Alur & Pembagian Sesi Pertemuan ({generatedLesson.identitas.jumlahPertemuan || "Multi-Sesi"})
                  </h3>

                  <table className="w-full border-collapse border border-slate-300 text-[10.5px]">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-300">
                        <th className="p-3 border-r border-slate-300 text-left font-black uppercase w-[120px]">Pertemuan</th>
                        <th className="p-3 border-r border-slate-300 text-left font-black uppercase w-[180px]">Sub-Materi / Topik</th>
                        <th className="p-3 border-r border-slate-300 text-left font-black uppercase w-[80px]">Alokasi JP</th>
                        <th className="p-3 text-left font-black uppercase">Ringkasan Skenario Utama</th>
                      </tr>
                    </thead>
                    <tbody>
                      {generatedLesson.rekomendasiAlur.pembagianPertemuan.map((pemb, i) => (
                        <tr key={i} className="border-b border-slate-300">
                          <td className="p-3 border-r border-slate-300 font-bold bg-slate-50">{pemb.pertemuan}</td>
                          <td className="p-3 border-r border-slate-300 font-bold text-indigo-950">{pemb.subTopik}</td>
                          <td className="p-3 border-r border-slate-300 font-black font-mono text-slate-700">{pemb.alokasi}</td>
                          <td className="p-3 font-medium text-slate-600 leading-normal text-justify">{pemb.aktivitasUtama}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* PAGE 2 */}
          <div className={`print-page-break print-container w-full max-w-4xl mx-auto ${isPrintPreviewActive ? 'bg-white text-slate-800 shadow-2xl rounded-3xl p-8 sm:p-12 mb-8 border border-slate-200' : 'border-0'} print:shadow-none print:border-0 print:p-0 print:m-0 print:bg-white print:rounded-none`}>
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-500 border-b pb-1 mb-6">
              <span>{generatedLesson.identitas.mapel} / Desain Pembelajaran</span>
              <span>{generatedLesson.identitas.kelasFase}</span>
            </div>

            <table className="w-full border-collapse border border-slate-300 text-[11px] sm:text-xs">
              <tbody>
                <tr>
                  <td className="w-[124px] p-4 font-bold border-r border-slate-300 align-top uppercase tracking-wider bg-slate-50">
                    Desain Pembelajaran
                  </td>
                  <td className="p-4 space-y-6">
                    <div>
                      <h4 className="font-bold text-slate-900 border-b pb-1 mb-2">Tujuan Pembelajaran</h4>
                      <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
                        {generatedLesson.tujuanPembelajaran.map((tp, idx) => (
                          <li key={idx}>{tp}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 border-b pb-1 mb-2">Praktik Pedagogis</h4>
                      <p className="text-[10px] text-slate-500 italic mb-2">Pendekatan: {generatedLesson.praktikPedagogis.pendekatan}</p>
                      
                      <div className="space-y-3 text-slate-700">
                        <div>
                          <strong>Diferensiasi Konten:</strong> {generatedLesson.praktikPedagogis.diferensiasiKonten}
                        </div>
                        <div>
                          <strong>Diferensiasi Proses:</strong> {generatedLesson.praktikPedagogis.diferensiasiProses}
                        </div>
                        <div>
                          <strong>Diferensiasi Produk:</strong> {generatedLesson.praktikPedagogis.diferensiasiProduk}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 border-b pb-1 mb-2">Kemitraan Pembelajaran</h4>
                      <div className="space-y-2 text-slate-700">
                        <div><strong>Orang Tua:</strong> {generatedLesson.kemitraanPembelajaran.orangTua}</div>
                        {generatedLesson.kemitraanPembelajaran.komunitas && (
                          <div><strong>Komunitas (Opsional):</strong> {generatedLesson.kemitraanPembelajaran.komunitas}</div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 border-b pb-1 mb-2">Lingkungan Pembelajaran</h4>
                      <ul className="list-disc pl-5 space-y-1 text-slate-700">
                        {generatedLesson.lingkunganPembelajaran.map((lp, idx) => (
                          <li key={idx}>{lp}</li>
                        ))}
                      </ul>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* PAGE 3 */}
          <div className={`print-page-break print-container w-full max-w-4xl mx-auto ${isPrintPreviewActive ? 'bg-white text-slate-800 shadow-2xl rounded-3xl p-8 sm:p-12 mb-8 border border-slate-200' : 'border-0'} print:shadow-none print:border-0 print:p-0 print:m-0 print:bg-white print:rounded-none`}>
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-500 border-b pb-1 mb-6">
              <span>{generatedLesson.identitas.mapel} / Pemanfaatan Digital & Aktivitas</span>
              <span>{generatedLesson.identitas.kelasFase}</span>
            </div>

            <table className="w-full border-collapse border border-slate-300 text-[11px] sm:text-xs">
              <tbody>
                <tr>
                  <td className="w-[124px] p-4 font-bold border-r border-slate-300 align-top uppercase tracking-wider bg-slate-50">
                    Skenario Media
                  </td>
                  <td className="p-4 space-y-6">
                    <div>
                      <h4 className="font-bold text-slate-900 border-b pb-1 mb-2">Pemanfaatan Digital</h4>
                      <div className="space-y-2 text-slate-700">
                        <div><strong>Sumber Belajar:</strong> {generatedLesson.pemanfaatanDigital.sumberBelajar}</div>
                        <div><strong>Aktivitas:</strong> {generatedLesson.pemanfaatanDigital.aktivitas}</div>
                        <div><strong>Produk Proyek:</strong> {generatedLesson.pemanfaatanDigital.produkProyek}</div>
                        <div><strong>Kolaborasi:</strong> {generatedLesson.pemanfaatanDigital.kolaborasi}</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 border-b pb-1 mb-2">Pengalaman Belajar</h4>
                      
                      <div className="space-y-4">
                        <div>
                          <strong className="text-indigo-900 block mb-1 font-mono text-[10.5px]">MEMAHAMI :</strong>
                          <p className="text-slate-700 text-justify mb-2">{generatedLesson.pengalamanBelajar.memahami}</p>
                        </div>

                        <div>
                          <strong className="text-indigo-900 block mb-1 font-mono text-[10.5px]">MENGAPLIKASIKAN (GALLERY WALK 4 STASIUN):</strong>
                          <p className="text-slate-500 italic mb-3">{generatedLesson.pengalamanBelajar.mengaplikasikan.judul} - {generatedLesson.pengalamanBelajar.mengaplikasikan.deskripsi}</p>
                          
                          <div className="space-y-3.5 pl-3 border-l-2 border-indigo-400">
                            {generatedLesson.pengalamanBelajar.mengaplikasikan.stasiun.map((st, i) => (
                              <div key={i} className="text-[11px]">
                                <span className="font-bold text-slate-900 block">Stasiun {i+1} ({st.tipe}) - {st.nama}:</span>
                                <span className="text-slate-600 block">{st.misi}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <strong className="text-indigo-900 block mb-1 font-mono text-[10.5px]">MEREFLEKSIKAN :</strong>
                          <ul className="list-disc pl-5 space-y-1 text-slate-700">
                            {generatedLesson.pengalamanBelajar.merefleksikan.map((refItem, idx) => (
                              <li key={idx}>{refItem}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* PAGE 4 */}
          <div className={`print-page-break print-container w-full max-w-4xl mx-auto ${isPrintPreviewActive ? 'bg-white text-slate-800 shadow-2xl rounded-3xl p-8 sm:p-12 mb-8 border border-slate-200' : 'border-0'} print:shadow-none print:border-0 print:p-0 print:m-0 print:bg-white print:rounded-none`}>
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-500 border-b pb-1 mb-6">
              <span>{generatedLesson.identitas.mapel} / Rencana Asesmen</span>
              <span>{generatedLesson.identitas.kelasFase}</span>
            </div>

            <table className="w-full border-collapse border border-slate-300 text-[11px] sm:text-xs text-justify">
              <tbody>
                <tr>
                  <td className="w-[124px] p-4 font-bold border-r border-slate-300 align-top uppercase tracking-wider bg-slate-50">
                    Asesmen
                  </td>
                  <td className="p-4 space-y-6">
                    <div>
                      <h4 className="font-bold text-slate-900 border-b pb-1 mb-2 uppercase text-[10px] tracking-wider text-amber-800">
                        Assessment as Learning (Awal / Diagnostik)
                      </h4>
                      <ul className="list-disc pl-5 space-y-1 text-slate-700">
                        {generatedLesson.asesmen.awal.map((aw, i) => <li key={i}>{aw}</li>)}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 border-b pb-1 mb-2 uppercase text-[10px] tracking-wider text-indigo-700">
                        Assessment for Learning (Proses / Formatif)
                      </h4>
                      <p className="text-slate-700 whitespace-pre-line leading-relaxed">{generatedLesson.asesmen.proses}</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 border-b pb-1 mb-2 uppercase text-[10px] tracking-wider text-emerald-800">
                        Assessment of Learning (Akhir / Sumatif)
                      </h4>
                      <ul className="list-disc pl-5 space-y-1 text-slate-700">
                        {generatedLesson.asesmen.akhir.map((akh, i) => <li key={i}>{akh}</li>)}
                      </ul>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* PAGE 5 */}
          <div className={`print-page-break print-container w-full max-w-4xl mx-auto ${isPrintPreviewActive ? 'bg-white text-slate-800 shadow-2xl rounded-3xl p-8 sm:p-12 mb-8 border border-slate-200' : 'border-0 p-8'} print:shadow-none print:border-0 print:p-0 print:m-0 print:bg-white print:rounded-none`}>
            <div className="text-center space-y-2 mb-10">
              <h1 className="text-2xl font-black uppercase tracking-widest text-slate-950 border-b-4 border-double border-slate-950 pb-2">
                MODUL AJAR (RPP HOTS)
              </h1>
              
              <div className="grid grid-cols-2 text-left max-w-xl mx-auto border p-4 text-xs font-semibold gap-3 border-slate-300 bg-slate-50/50">
                <div><strong>Mata Pelajaran :</strong> {generatedLesson.identitas.mapel}</div>
                <div><strong>Topik Modul :</strong> {generatedLesson.identitas.topik}</div>
                <div><strong>Kelas/Fase :</strong> {generatedLesson.identitas.kelasFase}</div>
                <div><strong>Durasi :</strong> {generatedLesson.identitas.alokasiWaktu}</div>
                <div><strong>Nama Sekolah :</strong> {namaSekolah}</div>
                <div><strong>Nama Guru :</strong> {guruNama} (NIP: {nipGuru || "-"})</div>
                <div className="col-span-2"><strong>Kepala Sekolah :</strong> {namaKepsek} (NIP: {nipKepsek || "-"})</div>
              </div>
            </div>

            <div className="space-y-6 text-xs text-slate-800 text-justify">
              <h2 className="text-sm font-black uppercase text-indigo-950 border-b pb-1">B. KOMPONEN INTI</h2>
              
              <div className="space-y-2">
                <h3 className="font-black">1. Tujuan Pembelajaran</h3>
                <p className="text-[11px] mb-1 italic">Pada akhir pertemuan ini, murid diharapkan mampu:</p>
                <ol className="list-decimal pl-5 space-y-1 font-medium text-slate-700">
                  {generatedLesson.tujuanPembelajaran.map((tp, i) => <li key={i}>{tp}</li>)}
                </ol>
              </div>

              <div className="space-y-2">
                <h3 className="font-black">2. Pembiasaan Nilai Profil Lulusan</h3>
                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                  <li><strong>Tingkah Laku / Nilai Pancasila:</strong> {generatedLesson.identifikasiDPL.penjelasan}</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-black">3. Pemahaman Bermakna (Deep Meaning)</h3>
                <p className="p-3 bg-slate-50 border-l-4 border-indigo-600 italic font-medium leading-relaxed">
                  "{generatedLesson.modulAjarCP.pemahamanBermakna}"
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-black">4. Pertanyaan Pemantik</h3>
                <ol className="list-decimal pl-5 space-y-1 text-slate-700 font-medium">
                  {generatedLesson.modulAjarCP.pertanyaanPemantik.map((p, i) => <li key={i}>{p}</li>)}
                </ol>
              </div>
            </div>
          </div>

          {/* PAGE 6 */}
          <div className={`print-page-break print-container w-full max-w-4xl mx-auto text-xs ${isPrintPreviewActive ? 'bg-white text-slate-800 shadow-2xl rounded-3xl p-8 sm:p-12 mb-8 border border-slate-200' : 'border-0 p-8'} print:shadow-none print:border-0 print:p-0 print:m-0 print:bg-white print:rounded-none`}>
            <div className="space-y-5">
              <div className="space-y-2 text-justify">
                <h3 className="font-black text-slate-900 uppercase">5. Kesiapan Pembelajaran</h3>
                <p className="mb-1 text-slate-600">Sebelum kelas dimulai, langkah mutlak guru:</p>
                <ol className="list-decimal pl-5 space-y-1 text-slate-700 font-medium">
                  {generatedLesson.modulAjarCP.kesiapanBelajar.map((ks, i) => <li key={i}>{ks}</li>)}
                </ol>
              </div>

              <hr className="border-slate-300" />

              <div className="space-y-4">
                <h2 className="text-sm font-black uppercase text-indigo-950 border-b pb-1">C. KEGIATAN PEMBELAJARAN (ALUR RINCI)</h2>
                <div className="p-2 border bg-slate-50 font-bold mb-2">Total Alokasi Waktu: 90 Menit</div>

                {/* Pendahuluan */}
                <div className="space-y-2 text-justify">
                  <h3 className="font-black text-slate-900">Tahap 1: Pendahuluan (10 Menit)</h3>
                  <ul className="list-disc pl-5 space-y-1.5 font-medium text-slate-700">
                    {generatedLesson.modulAjarCP.kegiatanPendahuluan.map((k, i) => <li key={i}>{k}</li>)}
                  </ul>
                </div>

                {/* Inti */}
                <div className="space-y-2 text-justify pt-4">
                  <h3 className="font-black text-slate-900">Tahap 2: Kegiatan Inti (60 Menit)</h3>
                  <ul className="list-disc pl-5 space-y-1.5 font-medium text-slate-700">
                    {generatedLesson.modulAjarCP.kegiatanInti.map((k, i) => <li key={i}>{k}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* PAGE 7 */}
          <div className={`print-page-break print-container w-full max-w-4xl mx-auto text-xs ${isPrintPreviewActive ? 'bg-white text-slate-800 shadow-2xl rounded-3xl p-8 sm:p-12 mb-8 border border-slate-200' : 'border-0 p-8'} print:shadow-none print:border-0 print:p-0 print:m-0 print:bg-white print:rounded-none`}>
            <div className="space-y-6">
              {/* Penutup */}
              <div className="space-y-2 text-justify">
                <h3 className="font-black text-slate-900">Tahap 3: Penutup (20 Menit)</h3>
                <ul className="list-disc pl-5 space-y-1.5 font-medium text-slate-700">
                  {generatedLesson.modulAjarCP.kegiatanPenutup.map((k, i) => <li key={i}>{k}</li>)}
                </ul>
              </div>

              <hr className="border-slate-300" />

              {/* Asesmen Table identical format to Page 7 of screenshot */}
              <div className="space-y-3">
                <h2 className="text-sm font-black uppercase text-indigo-950 border-b pb-1">D. ASESMEN PEMBELAJARAN</h2>
                
                <table className="w-full border-collapse border border-slate-300 text-[10.5px] leading-relaxed text-justify">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300">
                      <th className="p-3 border-r border-slate-300 text-left font-black uppercase w-[150px]">Jenis Asesmen</th>
                      <th className="p-3 border-r border-slate-300 text-left font-black uppercase w-[200px]">Teknik dan Instrumen</th>
                      <th className="p-3 text-left font-black uppercase">Detail dan Tujuan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {generatedLesson.tabelAsesmen.map((as, i) => (
                      <tr key={i} className="border-b border-slate-300">
                        <td className="p-3 border-r border-slate-300 font-bold bg-slate-50/50">{as.jenis}</td>
                        <td className="p-3 border-r border-slate-300 font-medium text-indigo-900">{as.teknik}</td>
                        <td className="p-3 font-medium text-slate-700">{as.detail}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* PAGE 8 */}
          <div className={`print-page-break print-container w-full max-w-4xl mx-auto text-xs ${isPrintPreviewActive ? 'bg-white text-slate-800 shadow-2xl rounded-3xl p-8 sm:p-12 mb-8 border border-slate-200' : 'border-0 p-8'} print:shadow-none print:border-0 print:p-0 print:m-0 print:bg-white print:rounded-none`}>
            <div className="space-y-4 text-justify leading-relaxed flex flex-col justify-between h-full">
              <div>
                <h2 className="text-sm font-black uppercase text-indigo-950 border-b-2 border-indigo-900 pb-1">E. LAMPIRAN PENDUKUNG</h2>
                
                <ol className="list-decimal pl-5 space-y-3 font-medium text-slate-700 mt-4">
                  {generatedLesson.lampiran.map((lam, i) => (
                    <li key={i} className="pl-1">
                      {lam}
                    </li>
                  ))}
                </ol>
              </div>

              {/* LEMBAR PENGESAHAN / SIGNATURE PANEL */}
              <div className="mt-16 pt-8 border-t-2 border-slate-300">
                <div className="text-center font-bold uppercase tracking-wider text-slate-900 text-xs mb-8">
                  LEMBAR MANIFESTASI & PENGESAHAN MODUL AJAR
                </div>
                
                <div className="grid grid-cols-2 gap-12 text-xs font-semibold text-slate-800">
                  <div className="space-y-20">
                    <div>
                      <p className="text-slate-500">Mengetahui,</p>
                      <p className="font-bold text-slate-900">Kepala Sekolah {namaSekolah}</p>
                    </div>
                    <div>
                      <p className="font-bold underline text-slate-950 uppercase decoration-slate-400 decoration-1">{namaKepsek}</p>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">NIP. {nipKepsek || "________________________"}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-20">
                    <div>
                      <p className="text-slate-500">Disetujui di {namaSekolah.replace(/SMA Negeri|SMA/i, '').trim() || "Instansi"}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      <p className="font-bold text-slate-900">Guru Mata Pelajaran</p>
                    </div>
                    <div>
                      <p className="font-bold underline text-slate-950 uppercase decoration-slate-400 decoration-1">{guruNama}</p>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">NIP. {nipGuru || "________________________"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-12 text-[10px] text-slate-400 italic text-center">
                Disusun Berdasarkan Hak Cipta & Standarisasi Kurikulum Merdeka Kemendikbudristek RI 2025.
              </div>
            </div>
          </div>

        </div>
      )}

      {/* -------------------- GOOGLE DOCS EXPORT MODAL -------------------- */}
      {showGdocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="w-full max-w-lg bg-white/90 backdrop-blur-2xl border border-white/50 rounded-3xl p-6 sm:p-8 shadow-2xl relative animate-scale-in">
            {/* Close Button */}
            <button 
              onClick={() => {
                setShowGdocModal(false);
                setGdocUrl("");
              }}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-all"
            >
              <span className="text-xl font-bold font-mono">×</span>
            </button>

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Ekspor Modul ke Google Docs</h3>
                <p className="text-xs text-slate-500 font-medium">Standardisasi Kurikulum Merdeka SMA</p>
              </div>
            </div>

            {/* Main Content Area */}
            {isExportingGdoc ? (
              <div className="py-8 flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-800 animate-pulse">Sedang mengompilasi desain pembelajaran...</p>
                  <p className="text-xs text-slate-500 mt-1">Mengunggah ke layanan Google Docs API</p>
                </div>
              </div>
            ) : gdocUrl ? (
              <div className="space-y-6">
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-emerald-800">Dokumen Berhasil Dibuat!</h4>
                    <p className="text-xs text-emerald-600 mt-0.5">Modul pembelajaran dan alur aktivitas diferensiasi Anda sekarang siap dalam format dokumen.</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <a 
                    href={gdocUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="w-full py-3 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 text-white font-bold rounded-xl text-center text-sm shadow-lg shadow-emerald-100 transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Eye className="w-4 h-4" />
                    Buka Hasil di Google Docs
                  </a>
                  <button 
                    onClick={() => {
                      setGdocUrl("");
                      setShowGdocModal(false);
                    }}
                    className="w-full py-2.5 text-slate-500 hover:text-slate-800 text-xs font-semibold text-center transition-all bg-slate-100 hover:bg-slate-200 rounded-xl"
                  >
                    Kembali ke Aplikasi
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {gdocToken ? (
                  // Connected State
                  <div className="space-y-5">
                    <div className="p-4 bg-indigo-50/60 border border-indigo-100/60 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
                        <div>
                          <p className="text-xs font-bold text-slate-700">Akun Google Terhubung</p>
                          <p className="text-[10px] text-slate-400 font-mono">Token Aktif Terdeteksi</p>
                        </div>
                      </div>
                      <button 
                        onClick={handleDisconnectGdoc}
                        className="px-3 py-1 bg-rose-50 border border-rose-100 text-rose-600 rounded-lg text-[10px] font-bold hover:bg-rose-100 transition-all"
                      >
                        Putuskan
                      </button>
                    </div>

                    <div className="text-xs text-slate-500 leading-relaxed">
                      Sesi autentikasi Anda valid. Klik tombol di bawah untuk langsung menyusun, memformat, dan mengekspor rencana ajar modul rincian ke Google Drive Anda sendiri secara instan.
                    </div>

                    <button 
                      onClick={handleExportToGoogleDocs}
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      Mulai Kompilasi & Ekspor Sekarang
                    </button>
                  </div>
                ) : (
                  // Disconnected State (Requires Authentication)
                  <div className="space-y-6">
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Layanan ini memerlukan izin untuk menulis dokumen rencana ajar ke akun **Google Drive / Google Docs** Anda agar memudahkan pengeditan lanjutan dengan rekan sejawat.
                    </p>

                    <div className="space-y-4">
                      {/* Option A: OAuth Sign-In */}
                      <div className="p-4 border border-slate-200 bg-slate-50/40 rounded-2xl relative">
                        <span className="absolute -top-2.5 left-4 px-2 py-0.5 text-[9px] font-black bg-indigo-600 text-white rounded-full uppercase">
                          Rekomendasi: Otorisasi Google Autentikasi
                        </span>
                        
                        <p className="text-[11px] text-slate-400 mb-3 mt-1 font-medium">Otorisasi langsung melalui login aman Google Account.</p>
                        
                        <button 
                          onClick={handleOAuthLogin}
                          className="w-full py-2.5 bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm"
                        >
                          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24">
                            <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.428-2.534 4.114-5.3 4.114-3.567 0-6.429-2.862-6.429-6.429s2.862-6.429 6.429-6.429c1.558 0 3.012.569 4.148 1.637l2.97-2.97C18.665.913 15.54 0 12.24 0 5.58 0 0 5.58 0 12.24s5.58 12.24 12.24 12.24c6.336 0 11.238-4.47 11.238-11.238 0-.743-.075-1.464-.207-2.15l-11.03-.007z"/>
                          </svg>
                          Sambungkan dengan Akun Google
                        </button>
                      </div>

                      {/* Divider */}
                      <div className="flex items-center justify-center gap-3">
                        <div className="h-[1px] bg-slate-200 flex-1"></div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Atau</span>
                        <div className="h-[1px] bg-slate-200 flex-1"></div>
                      </div>

                      {/* Option B: Manual token pasting */}
                      <form onSubmit={handleManualTokenSubmit} className="p-4 border border-indigo-100 bg-indigo-50/10 rounded-2xl relative space-y-3">
                        <span className="absolute -top-2.5 left-4 px-2 py-0.5 text-[9px] font-black bg-indigo-500 text-white rounded-full uppercase">
                          Bypass Instan / Sesi Playground (Alt)
                        </span>

                        <div className="text-[11px] text-slate-500 mt-1 space-y-1.5 leading-relaxed bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100/40">
                          <p className="font-bold text-indigo-950">Cara mendapatkan Access Token Google Docs dalam 30 detik:</p>
                          <ol className="list-decimal pl-4 space-y-1 text-slate-600">
                            <li>Buka <a href="https://developers.google.com/oauthplayground" target="_blank" rel="noreferrer" className="text-indigo-600 underline font-semibold hover:text-indigo-800">Google OAuth Playground</a> di tab baru.</li>
                            <li>Pada panel kiri (Step 1), di kotak Input pencarian di bawah, ketik dan centang:
                              <div className="font-mono text-[10px] bg-white p-1 rounded border border-slate-200 mt-0.5 space-y-0.5 text-slate-500">
                                <div>• https://www.googleapis.com/auth/documents</div>
                                <div>• https://www.googleapis.com/auth/drive.file</div>
                              </div>
                            </li>
                            <li>Klik tombol biru <strong>Authorize APIs</strong>, lalu pilih & masuk dengan Google Account Anda.</li>
                            <li>Pada Step 2, klik tombol biru <strong>Exchange authorization code for tokens</strong>.</li>
                            <li>Salin isi nilai dari kotak <strong>Access Token</strong> (bukan Authorization Code), lalu tempel di bawah ini!</li>
                          </ol>
                        </div>

                        <div className="flex gap-2">
                          <input 
                            type="password" 
                            className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 focus:border-indigo-400 focus:outline-none rounded-xl font-mono text-slate-700"
                            placeholder="Salin token ya29.a0..."
                            value={manualGdocToken}
                            onChange={(e) => setManualGdocToken(e.target.value)}
                          />
                          <button 
                            type="submit"
                            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shrink-0"
                          >
                            Terapkan Sesi
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

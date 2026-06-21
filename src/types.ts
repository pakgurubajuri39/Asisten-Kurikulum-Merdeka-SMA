export enum Fase {
  FASE_E = "Fase E (Kelas X)",
  FASE_F = "Fase F (Kelas XI & XII)",
}

export interface CPElement {
  nama: string;
  deskripsi: string;
}

export interface SubjectData {
  mapel: string;
  fase: Fase;
  deskripsiCP: string;
  elemen: CPElement[];
}

export interface StudentProfile {
  minat: string;
  caraBelajar: string;
  lingkungan: string;
}

export interface LessonDesignParams {
  guruNama: string;
  mapel: string;
  fase: Fase;
  kelas: string;
  alokasiWaktu: string;
  topik: string;
  elemenDipilih: string[];
  customCPDescription: string;
  profilMurid: StudentProfile;
  dimensiLulusan: string[]; // ['Keimanan', 'Penalaran Kritis', 'Kolaborasi', 'Kesehatan', etc.]
  jumlahPertemuan?: string;
}

export interface MeetingPlan {
  pertemuan: string;
  subTopik: string;
  alokasi: string;
  aktivitasUtama: string;
}

export interface RekomendasiAlur {
  tingkatKerumitan: string;
  saranRekomendasi: string;
  pembagianPertemuan: MeetingPlan[];
}

export interface LessonDesignOutput {
  identitas: {
    namaGuru: string;
    kelasFase: string;
    mapel: string;
    topik: string;
    alokasiWaktu: string;
    jumlahPertemuan?: string;
  };
  profilMurid: StudentProfile;
  identifikasiDPL: {
    dipilih: string[]; // List of selected DPLs
    penjelasan: string; // Brief description
  };
  elemenCP: {
    nama: string;
    deskripsi: string;
  }[];
  tujuanPembelajaran: string[];
  praktikPedagogis: {
    pendekatan: string;
    diferensiasiKonten: string;
    diferensiasiProses: string;
    diferensiasiProduk: string;
  };
  kemitraanPembelajaran: {
    orangTua: string;
    komunitas?: string;
  };
  lingkunganPembelajaran: string[];
  pemanfaatanDigital: {
    sumberBelajar: string;
    aktivitas: string;
    produkProyek: string;
    kolaborasi: string;
  };
  pengalamanBelajar: {
    memahami: string;
    mengaplikasikan: {
      judul: string;
      deskripsi: string;
      stasiun: {
        nama: string;
        tipe: string;
        misi: string;
      }[];
    };
    merefleksikan: string[];
  };
  asesmen: {
    awal: string[];
    proses: string;
    akhir: string[];
  };
  modulAjarCP: {
    pemahamanBermakna: string;
    pertanyaanPemantik: string[];
    kesiapanBelajar: string[];
    kegiatanPendahuluan: string[]; // step by step with minutes
    kegiatanInti: string[];       // step by step with minutes
    kegiatanPenutup: string[];    // step by step with minutes
  };
  tabelAsesmen: {
    jenis: string;
    teknik: string;
    detail: string;
  }[];
  lampiran: string[];
  rekomendasiAlur?: RekomendasiAlur;
}

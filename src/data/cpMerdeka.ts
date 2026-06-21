import { Fase, SubjectData } from "../types";

export const PREDEFINED_SUBJECTS: SubjectData[] = [
  {
    mapel: "Biologi",
    fase: Fase.FASE_E,
    deskripsiCP: "Pada akhir fase E, peserta didik memiliki kemampuan memecahkan masalah terhadap isu-isu lokal maupun global dalam kehidupan sehari-hari terkait keanekaragaman hayati, virus dan peranannya, serta perubahan lingkungan di sekitarnya.",
    elemen: [
      {
        nama: "Pemahaman Biologi",
        deskripsi: "Menganalisis konsep keanekaragaman hayati dan peranannya, virus dan kaitannya dengan kesehatan manusia, interaksi dalam ekosistem, serta tindakan adaptasi/mitigasi terhadap perubahan lingkungan."
      },
      {
        nama: "Keterampilan Proses",
        deskripsi: "Mengamati, mempertanyakan dan memprediksi, merencanakan dan melakukan penyelidikan, memproses dan menganalisis data, mengevaluasi dan refleksi, serta mengomunikasikan hasil penyelidikan ilmiah."
      }
    ]
  },
  {
    mapel: "Biologi",
    fase: Fase.FASE_F,
    deskripsiCP: "Pada akhir fase F, peserta didik memiliki kemampuan menganalisis keanekaragaman bioproses pada tingkat seluler hingga organisme, kaitan antara struktur dan fungsi organ tubuh manusia untuk memelihara kesehatan, serta penerapan bioteknologi modern dan konvensional.",
    elemen: [
      {
        nama: "Pemahaman Biologi",
        deskripsi: "Menganalisis proses pembelahan sel, transpor membran, sintesis protein, metabolisme; menganalisis sistem organ gerak, sirkulasi, pencernaan, respirasi, ekskresi, koordinasi, reproduksi, pertahanan tubuh; menganalisis pewarisan sifat, evolusi, dan rekayasa genetika dalam bioteknologi."
      },
      {
        nama: "Keterampilan Proses",
        deskripsi: "Melakukan eksperimen biologi secara mandiri atau berkelompok, menyusun laporan ilmiah terstruktur, mengevaluasi validitas data, dan mendesain solusi atas permasalahan biomedis atau bioteknologi sederhana."
      }
    ]
  },
  {
    mapel: "Fisika",
    fase: Fase.FASE_E,
    deskripsiCP: "Pada akhir fase E, peserta didik memiliki kemampuan menerapkan konsep pengukuran, mengidentifikasi pemanfaatan sumber energi alternatif, memahami gejala pemanasan global beserta langkah-langkah mitigasinya.",
    elemen: [
      {
        nama: "Pemahaman Fisika",
        deskripsi: "Memahami hakikat fisika dan metode ilmiah, konsep pengukuran (alat ukur, ketidakpastian), hukum kekekalan energi, pemanfaatan energi alternatif terbarukan, serta sains perubahan iklim."
      },
      {
        nama: "Keterampilan Proses",
        deskripsi: "Merencanakan eksperimen pengukuran besaran fisika, mengolah data kuantitatif menggunakan angka penting, mengevaluasi sisa karbon dari penggunaan energi sehari-hari."
      }
    ]
  },
  {
    mapel: "Fisika",
    fase: Fase.FASE_F,
    deskripsiCP: "Pada akhir fase F, peserta didik mampu menerapkan prinsip mekanika klasik (kinematika, dinamika), fluida dinamis, termodinamika, gelombang mekanik dan optik, kelistrikan dan kemagnetan, serta pengantar fisika modern dan radioaktivitas.",
    elemen: [
      {
        nama: "Pemahaman Fisika",
        deskripsi: "Menerapkan kinematika gerak lurus dan melingkar, dinamika rotasi, keseimbangan benda tegar, mekanika fluida, hukum termodinamika, persamaan gelombang bunyi dan optik fisis, medan listrik dan magnet, induksi elektromagnetik, serta relativitas khusus."
      },
      {
        nama: "Keterampilan Proses",
        deskripsi: "Mengoperasikan peralatan laboratorium fisika lanjut, menganalisis hubungan grafik variabel fisik, merumuskan hipotesis, dan mempublikasikan hasil eksperimen berupa prototipe fungsional."
      }
    ]
  },
  {
    mapel: "Kimia",
    fase: Fase.FASE_E,
    deskripsiCP: "Pada akhir fase E, peserta didik mampu menerapkan prinsip kimia hijau (green chemistry) dalam kehidupan sehari-hari, menuliskan persamaan reaksi kimia berimbang, serta memahami kontribusi kimia terhadap pencapaian SDGs.",
    elemen: [
      {
        nama: "Pemahaman Kimia",
        deskripsi: "Memahami 12 prinsip kimia hijau, mengidentifikasi lambang bahaya bahan kimia, menuliskan rumus kimia senyawa sederhana, dan menerapkan hukum dasar kimia (Lavoisier, Proust, Dalton, Gay-Lussac, Avogadro) secara konseptual."
      },
      {
        nama: "Keterampilan Proses",
        deskripsi: "Menyelidiki kelestarian lingkungan berdasarkan praktik ramah lingkungan, membuat poster kampanye pembatasan limbah plastik sekali pakai, serta mengklasifikasi perubahan materi fisik dan kimia."
      }
    ]
  },
  {
    mapel: "Kimia",
    fase: Fase.FASE_F,
    deskripsiCP: "Pada akhir fase F, peserta didik memahami struktur atom modern, ikatan kimia, teori kinetika gas, stoikiometri larutan, termokimia, laju reaksi, kesetimbangan kimia, larutan asam-basa, elektrokimia, senyawa organik karbon, dan makromolekul.",
    elemen: [
      {
        nama: "Pemahaman Kimia",
        deskripsi: "Menjelaskan diagram orbital elektron, bentuk molekul berdasarkan teori VSEPR, menghitung perubahan entalpi standar ($$\\Delta H$$), tetapan kesetimbangan ($$K_c$$, $$K_p$$), pH larutan penyangga, menentukan sel volta, dan menganalisis reaksi adisi/substitusi senyawa karbon."
      },
      {
        nama: "Keterampilan Proses",
        deskripsi: "Melakukan titrasi asam-basa dengan ketelitian tinggi, membuat baterai buah sederhana untuk mempelajari elektrokimia, mengukur laju reaksi berdasarkan pengaruh suhu/konsentrasi."
      }
    ]
  },
  {
    mapel: "Matematika",
    fase: Fase.FASE_E,
    deskripsiCP: "Pada akhir fase E, peserta didik mampu menggeneralisasi sifat-sifat operasi eksponen dan logaritma, menyelesaikan sistem persamaan linear tiga variabel, memahami konsep dasar trigonometri pada segitiga siku-siku, serta menyajikan data dalam bentuk histogram dan box plot.",
    elemen: [
      {
        nama: "Bilangan",
        deskripsi: "Menggunakan sifat eksponen, logaritma, serta barisan dan deret (aritmetika dan geometri) dalam memecahkan masalah finansial atau pertumbuhan mikroba."
      },
      {
        nama: "Aljabar dan Fungsi",
        deskripsi: "Menyelesaikan sistem persamaan linear tiga variabel (SPLTV), sistem pertidaksamaan linear dua variabel (SPtLDV), serta karakteristik fungsi kuadrat."
      },
      {
        nama: "Geometri",
        deskripsi: "Menerapkan perbandingan trigonometri (sin, cos, tan) pada segitiga siku-siku untuk mengukur tinggi objek tinggi tak langsung."
      },
      {
        nama: "Analisis Data dan Peluang",
        deskripsi: "Merepresentasikan data statistik menggunakan ukuran pemusatan dan penyebaran (mean, median, modus, kuartil, simpangan baku) serta menghitung peluang kejadian saling lepas."
      }
    ]
  },
  {
    mapel: "Matematika",
    fase: Fase.FASE_F,
    deskripsiCP: "Pada akhir fase F, peserta didik menguasai konsep polinomial, komposisi dan invers fungsi, geometri lingkaran (analitik), transformasi geometri, kombinatorika (permutasi, kombinasi), kalkulus diferensial dan integral fungsi aljabar dasar.",
    elemen: [
      {
        nama: "Aljabar dan Fungsi",
        deskripsi: "Melakukan operasi penjumlahan, perkalian, dan pembagian bersisa pada polinomial; menentukan invers dari komposisi fungsi."
      },
      {
        nama: "Geometri",
        deskripsi: "Menyusun persamaan lingkaran, kedudukan garis terhadap lingkaran, serta merumuskan transformasi matriks (translasi, refleksi, rotasi, dilatasi) dalam koordinat kartesius."
      },
      {
        nama: "Analisis Data dan Peluang",
        deskripsi: "Memahami aturan pengisian tempat (filling slots), menghitung permutasi dan kombinasi untuk menyelesaikan masalah probabilitas kompleks."
      },
      {
        nama: "Kalkulus",
        deskripsi: "Memahami limit fungsi aljabar secara intuitif, menghitung turunan fungsi aljabar menggunakan aturan rantai, menerapkan integral tak tentu untuk mencari fungsi fluks."
      }
    ]
  },
  {
    mapel: "Sejarah",
    fase: Fase.FASE_E,
    deskripsiCP: "Pada akhir fase E, peserta didik mampu mengidentifikasi konsep dasar ilmu sejarah (manusia, ruang, waktu, diakronik, sinkronis) serta menganalisis corak kehidupan prasejarah dan perkembangan awal peradaban di Nusantara.",
    elemen: [
      {
        nama: "Pemahaman Konsep Sejarah",
        deskripsi: "Memahami sejarah sebagai ilmu, kisah, dan seni; menganalisis asal-usul nenek moyang bangsa Indonesia serta jalur rempah Nusantara."
      },
      {
        nama: "Keterampilan Proses Sejarah",
        deskripsi: "Melakukan penelitian sejarah lokal sederhana (heuristik, verifikasi, interpretasi, historiografi) berbasis wawancara sesepuh."
      }
    ]
  },
  {
    mapel: "Sejarah",
    fase: Fase.FASE_F,
    deskripsiCP: "Pada akhir fase F, peserta didik mampu menganalisis sejarah Indonesia secara kritis sejak masa kolonialisme Eropa, kebangkitan nasionalisme, pendudukan Jepang, proklamasi kemerdekaan, perjuangan mempertahankan kemerdekaan, hingga masa reformasi.",
    elemen: [
      {
        nama: "Pemahaman Konsep Sejarah",
        deskripsi: "Menganalisis motif imperialisme kuno dan modern di Indonesia, strategi perjuangan organisasi nasional (Budi Utomo, Sarekat Islam), dinamika politik demokrasi liberal, terpimpin, konstitusi Orde Baru, serta lahirnya gerak mahasiswa tahun 1998."
      },
      {
        nama: "Keterampilan Proses Sejarah",
        deskripsi: "Menganalisis sumber primer kolonial secara kritis, mendeteksi bias sejarah, menyusun kajian sejarah tematik dalam bentuk narasi digital."
      }
    ]
  }
];

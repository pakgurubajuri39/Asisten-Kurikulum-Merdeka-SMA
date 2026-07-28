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
  },
  {
    mapel: "Bahasa Indonesia",
    fase: Fase.FASE_E,
    deskripsiCP: "Pada akhir fase E, peserta didik memiliki kemampuan berbahasa untuk berkomunikasi dan bernalar sesuai dengan tujuan, konteks sosial, akademis, dan dunia kerja. Peserta didik mampu memahami, mengolah, menginterpretasi, dan mengevaluasi informasi dari berbagai tipe teks tentang topik yang beragam.",
    elemen: [
      {
        nama: "Menyimak",
        deskripsi: "Mengevaluasi dan mengapresiasi informasi berupa gagasan, pikiran, perasaan, pandangan, arahan atau pesan yang akurat dari menyimak teks sastra dan non-sastra."
      },
      {
        nama: "Membaca dan Memirsa",
        deskripsi: "Mengevaluasi informasi berupa gagasan, pikiran, pandangan, arahan atau pesan dari teks deskripsi, laporan, narasi, rekon, eksplanasi, eksposisi dan diskusi, dari teks visual dan audiovisual."
      },
      {
        nama: "Berbicara dan Mempresentasikan",
        deskripsi: "Menyajikan gagasan, pikiran, dan pandangan secara kritis dan kreatif dalam bentuk teks formal maupun informal dengan mengutamakan kesantunan berbahasa."
      },
      {
        nama: "Menulis",
        deskripsi: "Menulis berbagai gagasan, pikiran, pandangan, arahan atau pesan tertulis untuk berbagai tujuan secara logis, kritis, dan kreatif."
      }
    ]
  },
  {
    mapel: "Bahasa Indonesia",
    fase: Fase.FASE_F,
    deskripsiCP: "Pada akhir fase F, peserta didik memiliki kemampuan berbahasa untuk berkomunikasi dan bernalar sesuai dengan tujuan, konteks sosial, akademis, dan dunia kerja tingkat lanjut. Peserta didik mampu memahami, menginterpretasi, dan mengevaluasi teks kompleks serta karya sastra multidisiplin.",
    elemen: [
      {
        nama: "Menyimak",
        deskripsi: "Mengevaluasi berbagai gagasan dan pandangan berdasarkan kaidah logika berpikir dari menyimak teks monolog, dialog, dan gelar wicara."
      },
      {
        nama: "Membaca dan Memirsa",
        deskripsi: "Mengevaluasi informasi dan struktur teks dari berbagai jenis karya sastra dan ilmiah, serta memahami nuansa makna implisit dan eksplisit."
      },
      {
        nama: "Berbicara dan Mempresentasikan",
        deskripsi: "Mempresentasikan argumen yang kuat, ilmiah, dan terstruktur dalam forum diskusi, debat, dan seminar akademik."
      },
      {
        nama: "Menulis",
        deskripsi: "Menulis karya ilmiah, esai kritis, teks jurnalistik, serta karya sastra kreatif (cerpen, puisi, drama) dengan memperhatikan kaidah PUEBI/EYD."
      }
    ]
  },
  {
    mapel: "Bahasa Inggris",
    fase: Fase.FASE_E,
    deskripsiCP: "Pada akhir Fase E, peserta didik menggunakan teks lisan, tulisan dan visual dalam bahasa Inggris untuk berkomunikasi sesuai dengan situasi, tujuan, dan pemirsa/pembacanya. Berbagai jenis teks seperti narasi, deskripsi, prosedur, eksposisi, rekon, dan report menjadi rujukan utama.",
    elemen: [
      {
        nama: "Menyimak dan Berbicara (Listening and Speaking)",
        deskripsi: "Menggunakan bahasa Inggris untuk berkomunikasi dengan guru, teman sebaya dan orang lain dalam berbagai macam situasi dan tujuan sehari-hari maupun akademis."
      },
      {
        nama: "Membaca dan Memirsa (Reading and Viewing)",
        deskripsi: "Membaca dan merespons berbagai macam teks seperti narasi, deskripsi, prosedur, eksposisi, rekon, dan report secara mandiri."
      },
      {
        nama: "Menulis dan Mempresentasikan (Writing and Presenting)",
        deskripsi: "Menulis berbagai jenis teks fiksi dan faktual secara mandiri, menunjukkan kesadaran atas tujuan dan target pembaca."
      }
    ]
  },
  {
    mapel: "Bahasa Inggris",
    fase: Fase.FASE_F,
    deskripsiCP: "Pada akhir Fase F, peserta didik menggunakan bahasa Inggris tingkat lanjut untuk berkomunikasi secara mandiri dan kritis dalam konteks akademis, profesional, dan sosial global, menguasai teks analitis, naratif kompleks, serta argumentasi ilmiah.",
    elemen: [
      {
        nama: "Menyimak dan Berbicara (Listening and Speaking)",
        deskripsi: "Berpartisipasi aktif dalam diskusi akademis, debat, dan wawancara menggunakan bahasa Inggris yang fasih, akurat, dan kontekstual."
      },
      {
        nama: "Membaca dan Memirsa (Reading and Viewing)",
        deskripsi: "Menganalisis ide pokok, argumen pendukung, dan perspektif penulis dari teks ilmiah kompleks, artikel berita internasional, dan literatur barat."
      },
      {
        nama: "Menulis dan Mempresentasikan (Writing and Presenting)",
        deskripsi: "Menulis esai argumentatif, surat resmi bisnis/akademik, dan laporan penelitian terstruktur dengan tata bahasa (grammar) dan kosakata (vocabulary) tingkat lanjut."
      }
    ]
  },
  {
    mapel: "Ekonomi",
    fase: Fase.FASE_E,
    deskripsiCP: "Pada akhir fase E, peserta didik mampu memahami kelangkaan sebagai inti dari masalah ilmu ekonomi, mengenali konsep biaya peluang (opportunity cost), menganalisis sistem ekonomi, skala prioritas, serta literasi keuangan dan perbankan dasar.",
    elemen: [
      {
        nama: "Pemahaman Konsep Ekonomi",
        deskripsi: "Memahami konsep kelangkaan, kebutuhan dan keinginan, biaya peluang, kegiatan ekonomi (produksi, distribusi, konsumsi), serta literasi keuangan dasar."
      },
      {
        nama: "Keterampilan Proses Ekonomi",
        deskripsi: "Menyusun skala prioritas kebutuhan pribadi, mengelola anggaran keuangan sederhana, dan mengamati fenomena inflasi atau harga di pasar lokal."
      }
    ]
  },
  {
    mapel: "Ekonomi",
    fase: Fase.FASE_F,
    deskripsiCP: "Pada akhir fase F, peserta didik mampu menguasai konsep makroekonomi dan mikroekonomi lanjut, menganalisis pendapatan nasional, pertumbuhan dan pembangunan ekonomi, ketenagakerjaan, inflasi, kebijakan moneter dan fiskal, serta perdagangan internasional.",
    elemen: [
      {
        nama: "Pemahaman Konsep Ekonomi",
        deskripsi: "Menganalisis perhitungan pendapatan nasional (PDB/GNP), indeks harga dan inflasi, kebijakan APBN/APBD, kebijakan moneter Bank Indonesia, serta kerja sama ekonomi internasional."
      },
      {
        nama: "Keterampilan Proses Ekonomi",
        deskripsi: "Menganalisis data statistik ekonomi nasional, mengevaluasi dampak kebijakan fiskal terhadap inflasi, dan merumuskan solusi atas masalah ketenagakerjaan."
      }
    ]
  },
  {
    mapel: "Geografi",
    fase: Fase.FASE_E,
    deskripsiCP: "Pada akhir fase E, peserta didik mampu memahami konsep dasar ilmu geografi, pendekatan geografi, prinsip dan aspek geografi, keterampilan memetakan fenomena spasial, serta dinamika litosfer, atmosfer, dan hidrosfer.",
    elemen: [
      {
        nama: "Pemahaman Konsep Geografi",
        deskripsi: "Memahami objek studi geografi, pendekatan keruangan, kelingkungan, dan kompleks wilayah, serta pengantar kartografi (peta, pengindraan jauh, dan SIG)."
      },
      {
        nama: "Keterampilan Proses Geografi",
        deskripsi: "Membaca dan menginterpretasikan peta tematik sederhana, mengamati fenomena cuaca/iklim di lingkungan sekitar, serta memitigasi bencana alam lokal."
      }
    ]
  },
  {
    mapel: "Geografi",
    fase: Fase.FASE_F,
    deskripsiCP: "Pada akhir fase F, peserta didik mampu menganalisis dinamika kependudukan dan lingkungan hidup, pengelolaan sumber daya alam berkelanjutan, mitigasi bencana, serta konsep pengembangan wilayah dan tata ruang nasional maupun global.",
    elemen: [
      {
        nama: "Pemahaman Konsep Geografi",
        deskripsi: "Menganalisis persebaran flora dan fauna di Indonesia dan dunia, dinamika antroposfer (kependudukan), ketahanan pangan dan energi, serta struktur keruangan desa dan kota."
      },
      {
        nama: "Keterampilan Proses Geografi",
        deskripsi: "Menggunakan aplikasi Sistem Informasi Geografis (SIG) dasar, menganalisis citra satelit untuk pemetaan tutupan lahan, dan merancang strategi mitigasi bencana kawasan."
      }
    ]
  },
  {
    mapel: "Sosiologi",
    fase: Fase.FASE_E,
    deskripsiCP: "Pada akhir fase E, peserta didik mampu memahami fungsi sosiologi sebagai ilmu yang mengkaji masyarakat dan lingkungan sosial, interaksi sosial, sosialisasi, nilai dan norma sosial, serta pembentukan identitas diri dalam masyarakat multikultural.",
    elemen: [
      {
        nama: "Pemahaman Konsep Sosiologi",
        deskripsi: "Memahami sejarah lahirnya sosiologi, konsep interaksi sosial dan bentuk-bentuknya, proses sosialisasi, serta peran nilai dan norma dalam keteraturan sosial."
      },
      {
        nama: "Keterampilan Proses Sosiologi",
        deskripsi: "Melakukan pengamatan sederhana terhadap dinamika kelompok sosial di sekolah atau masyarakat sekitar dan menyusun laporan observasi sosiologis."
      }
    ]
  },
  {
    mapel: "Sosiologi",
    fase: Fase.FASE_F,
    deskripsiCP: "Pada akhir fase F, peserta didik mampu menganalisis ragam gejala sosial di masyarakat, kelompok sosial, permasalahan sosial akibat eksklusi atau ketimpangan, konflik dan integrasi sosial, serta perubahan sosial di era globalisasi dan digitalisasi.",
    elemen: [
      {
        nama: "Pemahaman Konsep Sosiologi",
        deskripsi: "Menganalisis pembentukan kelompok sosial, dinamika konflik dan resolusi konflik, ketimpangan sosial ekonomi, harmoni sosial, serta dampak modernisasi dan globalisasi."
      },
      {
        nama: "Keterampilan Proses Sosiologi",
        deskripsi: "Melakukan penelitian sosial metode kualitatif atau kuantitatif sederhana, merancang proyek pemberdayaan masyarakat berbasis kearifan lokal untuk mengatasi masalah sosial."
      }
    ]
  },
  {
    mapel: "Pendidikan Pancasila",
    fase: Fase.FASE_E,
    deskripsiCP: "Pada akhir fase E, peserta didik mampu menganalisis cara pandang para pendiri bangsa tentang rumusan dan isi Pancasila, menganalisis penerapan nilai-nilai Pancasila dalam kehidupan sehari-hari, serta memahami konstitusi UUD NRI Tahun 1945.",
    elemen: [
      {
        nama: "Pancasila",
        deskripsi: "Menganalisis sejarah perumusan Pancasila, fungsi dan kedudukan Pancasila sebagai dasar negara, ideologi terbuka, dan identitas nasional."
      },
      {
        nama: "Undang-Undang Dasar Negara Republik Indonesia Tahun 1945",
        deskripsi: "Menganalisis struktur dan isi UUD NRI Tahun 1945, hak dan kewajiban warga negara, serta kepatuhan terhadap hukum dan peraturan perundang-undangan."
      },
      {
        nama: "Bhinneka Tunggal Ika & NKRI",
        deskripsi: "Mengidentifikasi keberagaman identitas budaya, suku, agama, serta menjaga keutuhan Negara Kesatuan Republik Indonesia (NKRI) dari ancaman disintegrasi."
      }
    ]
  },
  {
    mapel: "Pendidikan Pancasila",
    fase: Fase.FASE_F,
    deskripsiCP: "Pada akhir fase F, peserta didik mampu menganalisis kedudukan Pancasila sebagai ideologi terbuka, mengevaluasi pelanggaran hak dan pengingkaran kewajiban warga negara, serta menganalisis peran kelembagaan negara dan sistem pemerintahan demokrasi konstitusional.",
    elemen: [
      {
        nama: "Pancasila",
        deskripsi: "Mengevaluasi aktualisasi nilai Pancasila dalam kebijakan publik, menghadapi tantangan ideologi global, dan menjadi pelopor praksis Pancasila di era digital."
      },
      {
        nama: "Undang-Undang Dasar Negara Republik Indonesia Tahun 1945",
        deskripsi: "Menganalisis kasus pelanggaran hak asasi manusia (HAM), penegakan hukum yang berkeadilan, dan dinamika hubungan antarlembaga negara."
      },
      {
        nama: "Bhinneka Tunggal Ika & NKRI",
        deskripsi: "Menganalisis strategi resolusi konflik SARA, geopolitik Wawasan Nusantara, serta peran aktif Indonesia dalam perdamaian dunia."
      }
    ]
  },
  {
    mapel: "Informatika",
    fase: Fase.FASE_E,
    deskripsiCP: "Pada akhir fase E, peserta didik peserta didik mampu memahami pemikiran komputasional (computational thinking), literasi digital, sistem komputer, jaringan komputer dan internet, analisis data, algoritma dan pemrograman dasar, serta dampak sosial informatika.",
    elemen: [
      {
        nama: "Berpikir Komputasional (BK)",
        deskripsi: "Menerapkan dekomposisi, pengenalan pola, abstraksi, dan algoritma untuk menyelesaikan masalah kompleks secara logis dan efisien."
      },
      {
        nama: "Teknologi Informasi & Komunikasi (TIK) dan Sistem Komputer",
        deskripsi: "Menggunakan aplikasi perkantoran terintegrasi, memahami cara kerja perangkat keras (hardware), sistem operasi, dan perangkat lunak (software)."
      },
      {
        nama: "Algoritma dan Pemrograman (AP)",
        deskripsi: "Menerapkan struktur kontrol pemrograman, variabel, tipe data, dan instruksi kondisional menggunakan bahasa pemrograman prosedural/visual."
      }
    ]
  },
  {
    mapel: "Informatika",
    fase: Fase.FASE_F,
    deskripsiCP: "Pada akhir fase F, peserta didik mampu menguasai strategi pemecahan masalah algoritma tingkat lanjut, pemrograman berorientasi objek atau struktur data, analisis data big data sederhana, kecerdasan buatan (AI) dasar, serta keamanan siber dan etika digital.",
    elemen: [
      {
        nama: "Algoritma dan Pemrograman (AP) Lanjut",
        deskripsi: "Mengembangkan program komputer modular, memahami struktur data array dan list, serta menerapkan algoritma pengurutan (sorting) dan pencarian (searching)."
      },
      {
        nama: "Analisis Data (AD) & Kecerdasan Buatan (AI)",
        deskripsi: "Mengolah, memvisualisasikan, dan menginterpretasikan dataset berskala besar, serta memahami konsep dasar pemodelan Machine Learning dan AI generatif."
      },
      {
        nama: "Dampak Sosial Informatika (DSI) & Keamanan Siber",
        deskripsi: "Mengevaluasi perlindungan data pribadi, kriptografi dasar, hak kekayaan intelektual perangkat lunak, dan etika pemanfaatan teknologi digital."
      }
    ]
  },
  {
    mapel: "Seni Budaya",
    fase: Fase.FASE_E,
    deskripsiCP: "Pada akhir fase E, peserta didik mampu mengapresiasi dan berkarya seni (seni rupa, seni musik, seni tari, atau seni teater) dengan memahami unsur-unsur estetika, prinsip desain, teknik berkarya tradisional maupun modern, serta merefleksikan nilai budaya Nusantara.",
    elemen: [
      {
        nama: "Mengalami dan Mengapresiasi (Experiencing & Appreciating)",
        deskripsi: "Mengamati, menganalisis unsur estetika, dan menghargai keberagaman karya seni rupa/musik/tari/teater Nusantara dan global."
      },
      {
        nama: "Menciptakan dan Merefleksikan (Creating & Reflecting)",
        deskripsi: "Menciptakan karya seni orisinil menggunakan berbagai media, teknik, dan teknologi, serta mengevaluasi proses kreatif secara kritis."
      }
    ]
  },
  {
    mapel: "Seni Budaya",
    fase: Fase.FASE_F,
    deskripsiCP: "Pada akhir fase F, peserta didik mampu merancang, memproduksi, dan menyelenggarakan pameran atau pertunjukan seni komprehensif, mengintegrasikan pendekatan multidisiplin, serta menganalisis kritik seni secara filosofis dan kontekstual.",
    elemen: [
      {
        nama: "Mengalami dan Mengapresiasi",
        deskripsi: "Menganalisis sejarah aliran seni, melakukan kritik seni formal berdasarkan pendekatan objektif dan ekspresif."
      },
      {
        nama: "Menciptakan dan Menyajikan",
        deskripsi: "Mengelola manajemen produksi seni, membuat kurasi pameran/pertunjukan, dan mempublikasikan karya seni kontemporer kepada masyarakat."
      }
    ]
  },
  {
    mapel: "Pendidikan Agama Islam",
    fase: Fase.FASE_E,
    deskripsiCP: "Pada akhir fase E, peserta didik mampu menganalisis ayat Al-Qur'an dan Hadis tentang kontrol diri (mujahadah an-nafs), prasangka baik (husnuzzan), dan persaudaraan (ukhuwah); memahami makna Asmaul Husna; serta menganalisis syarah fiqih muamalah dan sejarah dakwah Islam di Nusantara.",
    elemen: [
      {
        nama: "Al-Qur'an dan Hadis",
        deskripsi: "Membaca dengan tartil, menghafal, dan menganalisis kandungan ayat-ayat suci terkait akhlak mulia dan etika sosial dalam kehidupan berbangsa."
      },
      {
        nama: "Akidah dan Akhlak",
        deskripsi: "Memahami hakikat keimanan kepada Allah Swt melalui Asmaul Husna, serta menghindari akhlak tercela (riya, sum'ah, hasad, takabur)."
      },
      {
        nama: "Fiqih dan Sejarah Peradaban Islam",
        deskripsi: "Memahami kaidah fiqih muamalah ekonomi Islam (jual beli, riba, syirkah), serta meneladani strategi dakwah damai Wali Songo di Indonesia."
      }
    ]
  },
  {
    mapel: "Pendidikan Agama Islam",
    fase: Fase.FASE_F,
    deskripsiCP: "Pada akhir fase F, peserta didik mampu menganalisis ayat Al-Qur'an dan Hadis tentang berpikir kritis dan ilmu pengetahuan; memahami aqidah hari akhir dan qada/qadar; menguasai hukum waris Islam (faraid), pernikahan dalam Islam; serta menganalisis kemajuan peradaban Islam di dunia.",
    elemen: [
      {
        nama: "Al-Qur'an, Hadis & Akidah",
        deskripsi: "Menganalisis kewajiban menuntut ilmu, bernalar kritis, bekerja keras, serta menghayati keimanan terhadap takdir Allah dan kehidupan akhirat."
      },
      {
        nama: "Fiqih dan Sejarah Peradaban Islam",
        deskripsi: "Menerapkan ketentuan syariat pernikahan, mawaris (hukum waris), hukum pidana Islam dasar, serta mengambil ibrah dari era kejayaan peradaban Islam di Baghdad dan Andalusia."
      }
    ]
  },
  {
    mapel: "PJOK",
    fase: Fase.FASE_E,
    deskripsiCP: "Pada akhir fase E, peserta didik dapat mempraktikkan keterampilan gerak fundamental dan aktivitas kebugaran jasmani, memahami permainan bola besar/kecil, atletik, beladiri, senam, kebugaran terkait kesehatan, serta pola hidup sehat dan pencegahan bahaya narkoba/pergaulan bebas.",
    elemen: [
      {
        nama: "Keterampilan Gerak",
        deskripsi: "Mempraktikkan teknik dasar permainan bola basket/voli/sepak bola, lari sprint, lompat jauh, atau pencak silat dengan biomekanika gerak yang benar."
      },
      {
        nama: "Pengetahuan Gerak & Kebugaran Jasmani",
        deskripsi: "Menganalisis konsep latihan komponen kebugaran jasmani (daya tahan, kekuatan, kelenturan, kelincahan) serta menyusun program latihan pribadi yang sehat."
      }
    ]
  },
  {
    mapel: "PJOK",
    fase: Fase.FASE_F,
    deskripsiCP: "Pada akhir fase F, peserta didik mampu merancang dan merancang taktik serta strategi permainan olahraga kompetitif, mengelola program kebugaran jasmani berkelanjutan, menguasai teknik pertolongan pertama pada kecelakaan (P3K) olahraga, dan mempromosikan gaya hidup aktif kepada komunitas.",
    elemen: [
      {
        nama: "Keterampilan dan Taktik Gerak",
        deskripsi: "Menerapkan strategi menyerang dan bertahan dalam olahraga beregu maupun perorangan, mengelola wasit dan kepanitiaan pertandingan olahraga sekolah."
      },
      {
        nama: "Kebugaran dan Perilaku Hidup Sehat",
        deskripsi: "Mengevaluasi efektivitas program kebugaran jangka panjang, merancang diet nutrisi atlet sederhana, dan menerapkan teknik resusitasi jantung paru (CPR/P3K) dasar."
      }
    ]
  }
];

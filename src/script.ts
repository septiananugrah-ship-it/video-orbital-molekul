// Naskah narasi "Elektron Tanpa Alamat" — Kimia Kuantum pertemuan 10: Teori Orbital Molekul (molekul diatomik).
// Setiap adegan berisi baris narasi. Durasi baris dihitung otomatis dari jumlah
// suku kata (lihat timeline.ts) atau dari rekaman suara bila sudah ada,
// jadi cukup ubah teks di sini: visual, subtitle, dan musik ikut menyesuaikan.
//
// Aturan menulis teks narasi (dibaca mesin TTS):
//  - angka & simbol ditulis sebagai kata ("dua puluh meter per detik"),
//  - rumus ditulis sebagai kalimat; rumus rapi tampil di layar (komponen Formula).
// Angka & term sudah dicek di naskah/AUDIT.md (Atkins, Levine, CRC, NIST CCCBDB).
//
// hl     : kata/frasa yang disorot pada subtitle
// pause  : jeda (detik) SETELAH baris dibacakan
// lead   : jeda (detik) sebelum baris pertama adegan
// tail   : jeda (detik) setelah baris terakhir adegan
// fixed  : durasi tetap (detik) untuk adegan tanpa narasi

export type Line = {
  text: string;
  /** Teks khusus TTS (opsional). Bila kosong, dibuat otomatis oleh src/tts.ts. */
  tts?: string;
  hl?: string[];
  pause?: number;
};

export type SceneScript = {
  id: string;
  chapter: string; // nomor bab di heading, "" untuk tanpa heading
  part?: 1 | 2 | 3; // 1 prinsip & teori dasar, 2 implementasi dalam kimia, 3 penerapan
  title: string;
  lines: Line[];
  lead?: number;
  tail?: number;
  fixed?: number;
  mood: 'mystery' | 'title' | 'wonder' | 'build' | 'quantum' | 'tension' | 'bright' | 'resolve' | 'outro';
};

export const SCRIPT: SceneScript[] = [
  {
    "id": "hook",
    "chapter": "",
    "title": "Oksigen yang menempel",
    "mood": "mystery",
    "lead": 1.6,
    "tail": 1.2,
    "lines": [
      {
        "text": "Tuang oksigen cair di antara kutub magnet, dan cairan biru pucat itu menggantung, menolak jatuh.",
        "hl": [
          "menggantung"
        ],
        "pause": 0.9
      },
      {
        "text": "Di video sebelumnya, teori ikatan valensi gagal menjelaskannya. Menurut teori itu, semua elektron oksigen berpasangan.",
        "hl": [
          "gagal"
        ],
        "pause": 0.9
      },
      {
        "text": "Masalahnya ada pada satu anggapan: bahwa setiap elektron ikatan tetap tinggal di antara dua atom tertentu.",
        "hl": [
          "satu anggapan"
        ],
        "pause": 0.7
      },
      {
        "text": "Bagaimana kalau elektron tidak punya alamat tetap, dan menyebar ke seluruh molekul?",
        "hl": [
          "tidak punya alamat tetap"
        ],
        "pause": 0.9
      },
      {
        "text": "Itulah gagasan teori orbital molekul, dan dengan gagasan itu, misteri oksigen terpecahkan.",
        "hl": [
          "teori orbital molekul"
        ],
        "pause": 1.0
      }
    ]
  },
  {
    "id": "title",
    "chapter": "",
    "title": "Elektron Tanpa Alamat",
    "mood": "title",
    "fixed": 7,
    "lines": []
  },
  {
    "id": "roadmap",
    "chapter": "",
    "title": "Peta video",
    "mood": "wonder",
    "lead": 0.8,
    "tail": 1.4,
    "lines": [
      {
        "text": "Perjalanan kita punya tiga bagian.",
        "pause": 0.6
      },
      {
        "text": "Pertama, prinsip dasar: menggabungkan orbital atom, orbital ikatan dan antiikatan, serta orde ikatan.",
        "hl": [
          "prinsip dasar"
        ],
        "pause": 0.7
      },
      {
        "text": "Kedua, implementasi dalam kimia: diagram molekul periode dua, oksigen, ion oksigen, dan molekul beda atom seperti karbon monoksida.",
        "hl": [
          "implementasi dalam kimia"
        ],
        "pause": 0.7
      },
      {
        "text": "Ketiga, penerapan: bukti dari spektroskopi, oksigen singlet di dunia medis, dan nitrogen yang sulit dipecah.",
        "hl": [
          "penerapan"
        ],
        "pause": 0.9
      }
    ]
  },
  {
    "id": "lcao",
    "chapter": "01",
    "title": "Menggabungkan orbital atom",
    "mood": "build",
    "part": 1,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Mulai dari molekul paling sederhana: H dua plus, dua proton dan satu elektron.",
        "hl": [
          "H dua plus"
        ],
        "pause": 0.7,
        "tts": "Mulai dari molekul paling sederhana: ha dua plus, dua proton dan satu elektron."
      },
      {
        "text": "Di dekat proton A, elektron tampak seperti di orbital satu s milik A. Di dekat B, seperti di satu s milik B.",
        "hl": [
          "satu s"
        ],
        "pause": 0.7,
        "tts": "Di dekat proton a, elektron tampak seperti di orbital satu es milik a. Di dekat be, seperti di satu es milik be."
      },
      {
        "text": "Maka tebakan terbaik untuk orbital molekul adalah gabungan linear keduanya: c A kali phi A, ditambah atau dikurangi c B kali phi B.",
        "hl": [
          "gabungan linear"
        ],
        "pause": 0.7,
        "tts": "Maka tebakan terbaik untuk orbital molekul adalah gabungan linear keduanya: ce a kali fi a, ditambah atau dikurangi ce be kali fi be."
      },
      {
        "text": "Cara ini disebut LCAO: kombinasi linear orbital atom.",
        "hl": [
          "LCAO"
        ],
        "pause": 0.7,
        "tts": "Cara ini disebut el-ce-a-o: kombinasi linear orbital atom."
      },
      {
        "text": "Aturannya sederhana: dua orbital atom yang digabung selalu menghasilkan dua orbital molekul.",
        "hl": [
          "dua orbital molekul"
        ],
        "pause": 0.9
      }
    ]
  },
  {
    "id": "bonding",
    "chapter": "02",
    "title": "Ikatan dan antiikatan",
    "mood": "quantum",
    "part": 1,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Bila kedua gelombang dijumlahkan sefase, keduanya saling menguatkan di antara inti.",
        "hl": [
          "saling menguatkan"
        ],
        "pause": 0.7
      },
      {
        "text": "Elektron terkumpul di antara dua proton dan merekatkan keduanya. Ini orbital ikatan, sigma satu s.",
        "hl": [
          "orbital ikatan"
        ],
        "pause": 0.7
      },
      {
        "text": "Bila dikurangkan, kedua gelombang saling meniadakan di tengah dan muncul simpul.",
        "hl": [
          "simpul"
        ],
        "pause": 0.7
      },
      {
        "text": "Elektron terdorong ke sisi luar, dan inti-inti saling tolak. Ini orbital antiikatan, sigma bintang satu s.",
        "hl": [
          "orbital antiikatan"
        ],
        "pause": 0.7
      },
      {
        "text": "Pada diagram energi, orbital ikatan turun di bawah orbital atom, dan orbital antiikatan naik sedikit lebih jauh di atasnya.",
        "hl": [
          "naik sedikit lebih jauh"
        ],
        "pause": 0.9
      }
    ]
  },
  {
    "id": "h2",
    "chapter": "03",
    "title": "Mengisi elektron: H₂ dan He₂",
    "mood": "build",
    "part": 1,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Elektron diisikan ke orbital molekul seperti ke orbital atom: dari energi terendah, paling banyak dua per orbital, spin berlawanan.",
        "hl": [
          "dari energi terendah"
        ],
        "pause": 0.7
      },
      {
        "text": "H dua punya dua elektron. Keduanya masuk ke sigma satu s, berpasangan. Molekul jadi stabil.",
        "hl": [
          "stabil"
        ],
        "pause": 0.7,
        "tts": "Ha dua punya dua elektron. Keduanya masuk ke sigma satu es, berpasangan. Molekul jadi stabil."
      },
      {
        "text": "Kekuatan ikatan diukur dengan orde ikatan: elektron ikatan dikurangi elektron antiikatan, dibagi dua.",
        "hl": [
          "orde ikatan"
        ],
        "pause": 0.7
      },
      {
        "text": "Untuk H dua, dua dikurangi nol, dibagi dua: orde ikatan satu, sebuah ikatan tunggal.",
        "hl": [
          "orde ikatan satu"
        ],
        "pause": 0.7,
        "tts": "Untuk ha dua, dua dikurangi nol, dibagi dua: orde ikatan satu, sebuah ikatan tunggal."
      },
      {
        "text": "Helium dua punya empat elektron: dua di ikatan, dua di antiikatan. Orde ikatannya nol, jadi tidak ada ikatan kovalen.",
        "hl": [
          "Orde ikatannya nol"
        ],
        "pause": 0.7
      },
      {
        "text": "Itulah sebabnya helium tetap berupa atom tunggal. Teori ini menjelaskannya dengan satu hitungan sederhana.",
        "hl": [
          "atom tunggal"
        ],
        "pause": 0.9
      }
    ]
  },
  {
    "id": "rules",
    "chapter": "04",
    "title": "Syarat orbital bergabung",
    "mood": "tension",
    "part": 1,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Tidak semua orbital atom bisa digabung secara efektif. Ada tiga syarat.",
        "hl": [
          "tiga syarat"
        ],
        "pause": 0.7
      },
      {
        "text": "Pertama, energinya harus berdekatan. Orbital satu s dan dua p, misalnya, terlalu jauh untuk bercampur berarti.",
        "hl": [
          "energinya harus berdekatan"
        ],
        "pause": 0.7,
        "tts": "Pertama, energinya harus berdekatan. Orbital satu es dan dua pe, misalnya, terlalu jauh untuk bercampur berarti."
      },
      {
        "text": "Kedua, keduanya harus cukup bertumpang tindih di ruang.",
        "hl": [
          "bertumpang tindih"
        ],
        "pause": 0.7
      },
      {
        "text": "Ketiga, simetrinya harus cocok. Orbital s dengan orbital p yang tegak lurus sumbu: bagian positif dan negatifnya saling menghapus, tumpang tindih totalnya nol.",
        "hl": [
          "simetrinya harus cocok"
        ],
        "pause": 0.7,
        "tts": "Ketiga, simetrinya harus cocok. Orbital es dengan orbital pe yang tegak lurus sumbu: bagian positif dan negatifnya saling menghapus, tumpang tindih totalnya nol."
      },
      {
        "text": "Syarat simetri ini akan muncul lagi, lebih rapi, ketika kita belajar grup titik.",
        "hl": [
          "grup titik"
        ],
        "pause": 0.9
      }
    ]
  },
  {
    "id": "p2",
    "chapter": "05",
    "title": "Orbital dari 2p: σ dan π",
    "mood": "wonder",
    "part": 1,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Pada periode dua, orbital dua p ikut bergabung. Ambil sumbu ikatan sebagai sumbu z.",
        "hl": [
          "sumbu z"
        ],
        "pause": 0.7,
        "tts": "Pada periode dua, orbital dua pe ikut bergabung. Ambil sumbu ikatan sebagai sumbu zet."
      },
      {
        "text": "Dua orbital p z bertemu ujung ke ujung: membentuk sigma dua p dan sigma bintang dua p.",
        "hl": [
          "sigma dua p"
        ],
        "pause": 0.7,
        "tts": "Dua orbital pe zet bertemu ujung ke ujung: membentuk sigma dua pe dan sigma bintang dua pe."
      },
      {
        "text": "Orbital p x dan p y bertemu dari samping: membentuk dua orbital pi yang sama energinya, dan dua orbital pi bintang.",
        "hl": [
          "dua orbital pi"
        ],
        "pause": 0.7,
        "tts": "Orbital pe eks dan pe ye bertemu dari samping: membentuk dua orbital pi yang sama energinya, dan dua orbital pi bintang."
      },
      {
        "text": "Orbital antiikatan selalu punya simpul tambahan di antara kedua inti.",
        "hl": [
          "simpul tambahan"
        ],
        "pause": 0.7
      },
      {
        "text": "Jadi delapan orbital atom valensi menghasilkan delapan orbital molekul: sigma dua s, sigma bintang dua s, dua pi, dua pi bintang, sigma dua p, dan sigma bintang dua p.",
        "hl": [
          "delapan orbital molekul"
        ],
        "pause": 0.9,
        "tts": "Jadi delapan orbital atom valensi menghasilkan delapan orbital molekul: sigma dua es, sigma bintang dua es, dua pi, dua pi bintang, sigma dua pe, dan sigma bintang dua pe."
      }
    ]
  },
  {
    "id": "oxygen",
    "chapter": "06",
    "title": "Misteri oksigen terpecahkan",
    "mood": "bright",
    "part": 2,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Sekarang oksigen. Setiap atom oksigen punya enam elektron valensi, jadi O dua punya dua belas.",
        "hl": [
          "dua belas"
        ],
        "pause": 0.7,
        "tts": "Sekarang oksigen. Setiap atom oksigen punya enam elektron valensi, jadi o dua punya dua belas."
      },
      {
        "text": "Isi dari bawah: sigma dua s, sigma bintang dua s, sigma dua p, lalu dua orbital pi. Sudah sepuluh elektron.",
        "hl": [
          "sepuluh elektron"
        ],
        "pause": 0.7,
        "tts": "Isi dari bawah: sigma dua es, sigma bintang dua es, sigma dua pe, lalu dua orbital pi. Sudah sepuluh elektron."
      },
      {
        "text": "Dua elektron terakhir masuk ke dua orbital pi bintang yang sama energinya.",
        "hl": [
          "pi bintang"
        ],
        "pause": 0.7
      },
      {
        "text": "Menurut aturan Hund, keduanya menempati orbital berbeda dengan spin sejajar. Dua elektron tak berpasangan!",
        "hl": [
          "Dua elektron tak berpasangan"
        ],
        "pause": 0.7,
        "tts": "Menurut aturan Hun, keduanya menempati orbital berbeda dengan spin sejajar. Dua elektron tak berpasangan!"
      },
      {
        "text": "Inilah sebabnya oksigen paramagnetik, dan keadaan dasarnya triplet.",
        "hl": [
          "paramagnetik"
        ],
        "pause": 0.7
      },
      {
        "text": "Orde ikatannya: delapan dikurangi empat, dibagi dua, sama dengan dua. Tetap ikatan rangkap dua, sesuai struktur Lewis. Tapi kini magnetnya juga terjelaskan.",
        "hl": [
          "magnetnya juga terjelaskan"
        ],
        "pause": 1.0
      }
    ]
  },
  {
    "id": "mixing",
    "chapter": "07",
    "title": "Urutan yang tertukar",
    "mood": "tension",
    "part": 2,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Ada satu kejutan. Untuk boron, karbon, dan nitrogen, urutan orbitalnya sedikit berbeda.",
        "hl": [
          "kejutan"
        ],
        "pause": 0.7
      },
      {
        "text": "Pada atom-atom ini, orbital dua s dan dua p cukup berdekatan sehingga ikut bercampur.",
        "hl": [
          "ikut bercampur"
        ],
        "pause": 0.7,
        "tts": "Pada atom-atom ini, orbital dua es dan dua pe cukup berdekatan sehingga ikut bercampur."
      },
      {
        "text": "Akibatnya orbital sigma dua p terdorong naik, melewati orbital pi.",
        "hl": [
          "terdorong naik"
        ],
        "pause": 0.7,
        "tts": "Akibatnya orbital sigma dua pe terdorong naik, melewati orbital pi."
      },
      {
        "text": "Buktinya B dua: dengan urutan ini, dua elektron terakhirnya masuk ke dua orbital pi terpisah, dan B dua memang paramagnetik.",
        "hl": [
          "B dua memang paramagnetik"
        ],
        "pause": 0.7,
        "tts": "Buktinya be dua: dengan urutan ini, dua elektron terakhirnya masuk ke dua orbital pi terpisah, dan be dua memang paramagnetik."
      },
      {
        "text": "Mulai oksigen dan fluor, celah dua s dan dua p melebar, dan urutan normal kembali.",
        "hl": [
          "urutan normal kembali"
        ],
        "pause": 0.7,
        "tts": "Mulai oksigen dan fluor, celah dua es dan dua pe melebar, dan urutan normal kembali."
      }
    ]
  },
  {
    "id": "period2",
    "chapter": "08",
    "title": "Deret Li₂ sampai Ne₂",
    "mood": "build",
    "part": 2,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Dengan diagram ini, kita bisa meramal seluruh molekul diatomik periode dua.",
        "hl": [
          "meramal"
        ],
        "pause": 0.7
      },
      {
        "text": "Orde ikatan naik dari litium dua, satu; berilium dua, nol; boron dua, satu; karbon dua, dua; sampai puncaknya nitrogen dua, tiga.",
        "hl": [
          "puncaknya nitrogen dua, tiga"
        ],
        "pause": 0.7
      },
      {
        "text": "Lalu turun lagi: oksigen dua, dua; fluor dua, satu; neon dua, nol.",
        "hl": [
          "turun lagi"
        ],
        "pause": 0.7
      },
      {
        "text": "Makin besar orde ikatan, makin pendek dan makin kuat ikatannya.",
        "hl": [
          "makin pendek dan makin kuat"
        ],
        "pause": 0.7
      },
      {
        "text": "Nitrogen seratus sepuluh pikometer dan sekitar sembilan ratus empat puluh lima kilojoule per mol; oksigen seratus dua puluh satu pikometer dan empat ratus sembilan puluh delapan; fluor seratus empat puluh dua pikometer dan hanya sekitar seratus lima puluh delapan.",
        "hl": [
          "seratus sepuluh pikometer"
        ],
        "pause": 0.9
      }
    ]
  },
  {
    "id": "ions",
    "chapter": "09",
    "title": "Ion-ion oksigen",
    "mood": "quantum",
    "part": 2,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Teori orbital molekul juga meramal ion. Lepaskan satu elektron pi bintang dari oksigen: terbentuk O dua plus.",
        "hl": [
          "O dua plus"
        ],
        "pause": 0.7,
        "tts": "Teori orbital molekul juga meramal ion. Lepaskan satu elektron pi bintang dari oksigen: terbentuk o dua plus."
      },
      {
        "text": "Elektron antiikatan berkurang, orde ikatan naik menjadi dua setengah, dan ikatannya memendek, sekitar seratus dua belas pikometer.",
        "hl": [
          "dua setengah"
        ],
        "pause": 0.7
      },
      {
        "text": "Tambahkan satu elektron: ion superoksida, O dua minus, orde ikatan satu setengah, sekitar seratus tiga puluh tiga pikometer.",
        "hl": [
          "superoksida"
        ],
        "pause": 0.7,
        "tts": "Tambahkan satu elektron: ion superoksida, o dua minus, orde ikatan satu setengah, sekitar seratus tiga puluh tiga pikometer."
      },
      {
        "text": "Tambahkan dua: ion peroksida, O dua dua minus, orde ikatan satu, sekitar seratus empat puluh sembilan pikometer.",
        "hl": [
          "peroksida"
        ],
        "pause": 0.7,
        "tts": "Tambahkan dua: ion peroksida, o dua dua minus, orde ikatan satu, sekitar seratus empat puluh sembilan pikometer."
      },
      {
        "text": "Superoksida dan peroksida bukan hanya contoh soal. Keduanya muncul di sel tubuh kita sebagai spesies oksigen reaktif.",
        "hl": [
          "spesies oksigen reaktif"
        ],
        "pause": 0.9
      }
    ]
  },
  {
    "id": "hetero",
    "chapter": "10",
    "title": "Molekul beda atom: CO",
    "mood": "wonder",
    "part": 2,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Bagaimana jika kedua atom berbeda? Orbital atom yang lebih elektronegatif berenergi lebih rendah.",
        "hl": [
          "lebih elektronegatif"
        ],
        "pause": 0.7
      },
      {
        "text": "Orbital ikatan lebih mirip orbital atom yang rendah, dan orbital antiikatan lebih mirip atom yang tinggi. Elektron tidak lagi dibagi rata.",
        "hl": [
          "tidak lagi dibagi rata"
        ],
        "pause": 0.7
      },
      {
        "text": "Karbon monoksida punya sepuluh elektron valensi, sama dengan nitrogen. Orde ikatannya juga tiga.",
        "hl": [
          "Orde ikatannya juga tiga"
        ],
        "pause": 0.7
      },
      {
        "text": "Tetapi orbital terisi tertingginya, HOMO, terpusat di atom karbon, seperti sepasang tangan yang terjulur dari ujung karbon.",
        "hl": [
          "HOMO"
        ],
        "pause": 0.7,
        "tts": "Tetapi orbital terisi tertingginya, homo, terpusat di atom karbon, seperti sepasang tangan yang terjulur dari ujung karbon."
      },
      {
        "text": "Itulah sebabnya CO mengikat besi dalam hemoglobin melalui atom karbonnya, jauh lebih kuat daripada oksigen. Inilah dasar keracunan karbon monoksida.",
        "hl": [
          "keracunan karbon monoksida"
        ],
        "pause": 0.9,
        "tts": "Itulah sebabnya ce o mengikat besi dalam hemoglobin melalui atom karbonnya, jauh lebih kuat daripada oksigen. Inilah dasar keracunan karbon monoksida."
      }
    ]
  },
  {
    "id": "frontier",
    "chapter": "11",
    "title": "HOMO dan LUMO",
    "mood": "bright",
    "part": 2,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Orbital terisi tertinggi disebut HOMO, dan orbital kosong terendah disebut LUMO.",
        "hl": [
          "LUMO"
        ],
        "pause": 0.7,
        "tts": "Orbital terisi tertinggi disebut homo, dan orbital kosong terendah disebut lumo."
      },
      {
        "text": "Keduanya disebut orbital perbatasan, karena hampir semua kimia terjadi di sana.",
        "hl": [
          "orbital perbatasan"
        ],
        "pause": 0.7
      },
      {
        "text": "Saat bereaksi, elektron mengalir dari HOMO satu molekul ke LUMO molekul lain.",
        "hl": [
          "dari HOMO"
        ],
        "pause": 0.7,
        "tts": "Saat bereaksi, elektron mengalir dari homo satu molekul ke lumo molekul lain."
      },
      {
        "text": "Saat menyerap cahaya, elektron melompat dari HOMO ke LUMO. Celah energinya menentukan warna yang diserap.",
        "hl": [
          "Celah energinya"
        ],
        "pause": 0.7,
        "tts": "Saat menyerap cahaya, elektron melompat dari homo ke lumo. Celah energinya menentukan warna yang diserap."
      },
      {
        "text": "Gagasan orbital perbatasan ini diganjar Nobel Kimia tahun seribu sembilan ratus delapan puluh satu, untuk Kenichi Fukui dan Roald Hoffmann.",
        "hl": [
          "Nobel Kimia"
        ],
        "pause": 0.9,
        "tts": "Gagasan orbital perbatasan ini diganjar Nobel Kimia tahun seribu sembilan ratus delapan puluh satu, untuk Kenici Fukui dan Rold Hofman."
      }
    ]
  },
  {
    "id": "pes",
    "chapter": "12",
    "title": "Melihat orbital: spektroskopi fotoelektron",
    "mood": "wonder",
    "part": 3,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Apakah orbital molekul sungguh ada, atau hanya alat hitung? Kita bisa mengukurnya.",
        "hl": [
          "mengukurnya"
        ],
        "pause": 0.7
      },
      {
        "text": "Tembakkan foton ultraviolet berenergi tetap ke gas nitrogen. Foton itu melepaskan elektron dari orbital-orbitalnya.",
        "hl": [
          "melepaskan elektron"
        ],
        "pause": 0.7
      },
      {
        "text": "Ukur energi kinetik elektron yang terlepas. Selisihnya dengan energi foton adalah energi ionisasi tiap orbital.",
        "hl": [
          "energi ionisasi"
        ],
        "pause": 0.7
      },
      {
        "text": "Spektrum nitrogen menunjukkan tiga kelompok puncak: sekitar lima belas koma enam, enam belas koma tujuh, dan delapan belas koma delapan elektronvolt.",
        "hl": [
          "tiga kelompok puncak"
        ],
        "pause": 0.7
      },
      {
        "text": "Puncak terendah berasal dari sigma dua p, lalu pi, lalu sigma bintang dua s: urutan tertukar yang tadi kita ramalkan, terlihat langsung.",
        "hl": [
          "terlihat langsung"
        ],
        "pause": 0.9,
        "tts": "Puncak terendah berasal dari sigma dua pe, lalu pi, lalu sigma bintang dua es: urutan tertukar yang tadi kita ramalkan, terlihat langsung."
      }
    ]
  },
  {
    "id": "singlet",
    "chapter": "13",
    "title": "Oksigen singlet & mengapa kita tidak terbakar",
    "mood": "tension",
    "part": 3,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Oksigen triplet ternyata menyimpan rahasia penting bagi kehidupan.",
        "hl": [
          "rahasia penting"
        ],
        "pause": 0.7
      },
      {
        "text": "Hampir semua molekul organik, termasuk tubuh kita, berada dalam keadaan singlet. Reaksi langsung triplet dengan singlet terhambat aturan spin.",
        "hl": [
          "terhambat aturan spin"
        ],
        "pause": 0.7
      },
      {
        "text": "Itulah salah satu alasan kayu dan kertas tidak terbakar sendiri di udara, walau reaksinya melepaskan banyak energi. Perlu api pemantik.",
        "hl": [
          "tidak terbakar sendiri"
        ],
        "pause": 0.7
      },
      {
        "text": "Jika kedua elektron pi bintang dipaksa berpasangan, terbentuk oksigen singlet, sekitar nol koma sembilan delapan elektronvolt di atas keadaan dasar, dan jauh lebih reaktif.",
        "hl": [
          "oksigen singlet"
        ],
        "pause": 0.7
      },
      {
        "text": "Dokter memanfaatkannya dalam terapi fotodinamik: zat peka cahaya disinari, membentuk oksigen singlet yang merusak sel kanker.",
        "hl": [
          "terapi fotodinamik"
        ],
        "pause": 0.9
      }
    ]
  },
  {
    "id": "nitrogen",
    "chapter": "14",
    "title": "Ikatan rangkap tiga nitrogen",
    "mood": "bright",
    "part": 3,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Udara kita tujuh puluh delapan persen nitrogen, tapi tumbuhan tidak bisa langsung memakainya.",
        "hl": [
          "tujuh puluh delapan persen"
        ],
        "pause": 0.7
      },
      {
        "text": "Orde ikatan tiga dan orbital ikatan yang semuanya terisi membuat N dua salah satu molekul paling stabil.",
        "hl": [
          "paling stabil"
        ],
        "pause": 0.7,
        "tts": "Orde ikatan tiga dan orbital ikatan yang semuanya terisi membuat en dua salah satu molekul paling stabil."
      },
      {
        "text": "Memecah ikatannya butuh sekitar sembilan ratus empat puluh lima kilojoule per mol.",
        "hl": [
          "sembilan ratus empat puluh lima"
        ],
        "pause": 0.7
      },
      {
        "text": "Proses Haber–Bosch memaksanya bereaksi dengan hidrogen pada suhu dan tekanan tinggi, menghasilkan amonia untuk pupuk, dan memakan sekitar satu sampai dua persen energi dunia.",
        "hl": [
          "Haber–Bosch"
        ],
        "pause": 0.7,
        "tts": "Proses Haber Bosch memaksanya bereaksi dengan hidrogen pada suhu dan tekanan tinggi, menghasilkan amonia untuk pupuk, dan memakan sekitar satu sampai dua persen energi dunia."
      },
      {
        "text": "Bakteri tanah melakukannya pada suhu kamar dengan enzim nitrogenase. Memahami orbitalnya adalah langkah pertama meniru mereka.",
        "hl": [
          "nitrogenase"
        ],
        "pause": 0.9
      }
    ]
  },
  {
    "id": "recap",
    "chapter": "15",
    "title": "Merangkai semuanya",
    "mood": "resolve",
    "lead": 1.0,
    "tail": 2.4,
    "lines": [
      {
        "text": "Mari rangkum.",
        "pause": 0.6
      },
      {
        "text": "Orbital molekul adalah gabungan linear orbital atom. Dua orbital atom menghasilkan satu orbital ikatan dan satu antiikatan.",
        "hl": [
          "gabungan linear"
        ],
        "pause": 0.7
      },
      {
        "text": "Orde ikatan sama dengan elektron ikatan dikurangi antiikatan, dibagi dua.",
        "hl": [
          "Orde ikatan"
        ],
        "pause": 0.7
      },
      {
        "text": "Dua elektron tak berpasangan di pi bintang menjelaskan oksigen yang tertarik magnet.",
        "hl": [
          "pi bintang"
        ],
        "pause": 0.7
      },
      {
        "text": "Pencampuran s dan p menukar urutan pada boron sampai nitrogen, dan spektroskopi fotoelektron membuktikannya.",
        "hl": [
          "spektroskopi fotoelektron"
        ],
        "pause": 0.7,
        "tts": "Pencampuran es dan pe menukar urutan pada boron sampai nitrogen, dan spektroskopi fotoelektron membuktikannya."
      },
      {
        "text": "HOMO dan LUMO menentukan reaksi dan warna.",
        "hl": [
          "HOMO dan LUMO"
        ],
        "pause": 0.7,
        "tts": "Homo dan lumo menentukan reaksi dan warna."
      },
      {
        "text": "Berikutnya: orbital molekul untuk molekul banyak atom, dan peran simetri. Sampai jumpa.",
        "hl": [
          "molekul banyak atom"
        ],
        "pause": 1.0
      }
    ]
  },
  {
    "id": "outro",
    "chapter": "",
    "title": "Penutup",
    "mood": "outro",
    "fixed": 15,
    "lines": []
  }
];

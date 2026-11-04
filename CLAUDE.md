# Konteks repo (untuk asisten AI)

- Video **"Elektron Tanpa Alamat" — Kimia Kuantum: Teori Orbital Molekul (diatomik)** (S1 Kimia UNESA, RPS pertemuan 10) milik **Yayan** (Septian Anugrah). Mesin disalin dari `video-ikatan-valensi` (komponen vbB: peta kerapatan & orbital 2D; vbC: orbital 3D). Sebelumnya: VBT (video-ikatan-valensi). Berikutnya: MO poliatomik/Hückel & simetri. Aturan umum & pelajaran teknis: repo `septiananugrah-ship-it/science-intro` → `CLAUDE.md`.
- Gaya seri kuantum Yayan: panggung gelap, aksen **emas–sian**, font Outfit + Source Serif 4 + JetBrains Mono, subtitle kata-per-kata. Tanpa nama di video (aturan video kuantum).
- Benang merah cerita: **oksigen cair yang menempel di magnet** (cliffhanger video VBT) → LCAO, ikatan/antiikatan, orde ikatan → diagram O₂ dengan dua elektron π* sejajar (terpecahkan) → ion, CO, HOMO/LUMO → bukti PES, oksigen singlet, nitrogen.
- **Kode warna**: orbital ikatan = sian `C.cyan`, antiikatan = merah `C.red`, orbital atom = abu-biru `C.muted`/`C.blue`, fase + / − = emas `C.gold` / ungu `C.violet`, σ = sian, π = jingga `C.amber`, π* = merah muda `C.pink`, spin ↑ sian / ↓ merah muda, HOMO = emas, LUMO = mint `C.mint`; atom CPK (O merah, N biru, C abu, H putih).
- Diagram MO: dua kolom orbital atom di kiri/kanan, MO di tengah, garis putus-putus penghubung, elektron sebagai panah ↑↓ yang diisi bergiliran (Aufbau, Pauli, Hund); energi kualitatif (tidak berskala).
- **Semua adegan harus terus bergerak** (elektron di kotak orbital, vektor L/S berpresesi, tabel mikrostatus yang terkelupas, garis spektrum menyala).
- **Claude tidak menjalankan workflow GitHub Actions.** Setelah merge ke `main`, minta pengguna menekan *Run workflow*.
- Narasi menyusul. Selalu sediakan versi tanpa narasi.

## Aturan konten & tata letak
- Rumus/simbol term utama ≥ 56 px (`Formula`), satu kartu per momen; zona subtitle (bawah 180 px) bebas; margin ≥ 80 px. Komponen HTML di luar `<Stage>`.
- Rumus kimia & hibrida ditulis dengan subskrip/superskrip benar (H₂, sp³; `Sup`/`Sub` di HTML, `tspan baselineShift` di SVG). Orbital 3D digambar dengan proyeksi sederhana dan rotasi pelan. Angka dicek di `naskah/AUDIT.md`.
- Teks TTS terpisah dari subtitle (`tts:` per baris; huruf tunggal dieja di `src/tts.ts`).
- Kemulusan: `EASE` lembut, fade keluar `EASE_IN_OUT`; tanpa ganti berdasarkan ambang (silang-pudar); tanpa CSS blur; tanpa filter pada garis lurus.

## QA
- `CHROME_PATH=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell node scripts/qa-lines.mjs out/x <adegan...>` lalu `python3 scripts/contact.py out/x out/x-s 9`.
- `npm run check` (cek kata `wordOf`), uji kemulusan `node scripts/qa-film.mjs out/a.mp4 0 99999 0.25` lalu `python3 scripts/qa-glitch.py out/a.mp4 0`.

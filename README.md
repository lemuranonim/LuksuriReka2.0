# Luksuri Reka · Studio Digital

Website studio ID/EN dengan pengalaman Level 2: satu Canvas dan tiga komposisi Identitas, Solusi, serta Karya. Isi, navigasi, Composer, dan tiga komposisi SVG statis tersedia melalui HTML server. Gunakan Node.js 24 dan lockfile yang tersedia.

## Menjalankan

```sh
npm ci
npm run dev
```

Buka `http://localhost:3000`. Halaman Indonesia berada di `/`, pasangan Inggris di `/en`.

```sh
npm run test:foundation
npm run test:experience
npm run build
npm run test:production
```

Pengujian menggunakan Node bawaan dan TypeScript yang sudah ada, tanpa dependensi pengujian tambahan. `FOUNDATION_TEST_URL` dapat menunjuk port localhost lain. Pengujian HTTP dibatasi ke localhost.

`test:production` menjalankan server pada port 3000, memeriksa halaman dan komposisi SVG ID/EN, lalu menghentikan server. Pastikan port tersedia. Untuk menjalankan situs setelah build, gunakan `npm run start`.

## GitHub Actions dan produksi

Workflow **Production checks** berjalan pada push/pull request ke `master` dan pemicu manual. Pemeriksaan mencakup instalasi dari lockfile, tes logika, build produksi, serta HTTP halaman. Integrasi Git Vercel yang sudah terhubung menangani deployment setelah push ke branch produksi `master`.

Build standar sudah mengaktifkan Level 2 dan memakai `.next`. Flag `NEXT_PUBLIC_LR_EXPERIENCE=0` menonaktifkan pengayaan pada build berikutnya. Perintah `build:foundation` dan `start:foundation` juga tersedia; profil fondasi memakai folder `.next` yang sama. Jalankan ulang `npm run build` untuk kembali ke produksi Level 2. Deployment fondasi sebelumnya dapat dipakai sebagai pilihan rollback.

## Struktur

- `src/lib/site-content.ts`: registry URL, copy ID/EN, solusi, studi kasus, dan kontak.
- `src/components/site/`: halaman, navigasi, komposisi identitas, Composer, dan adapter event.
- `src/app/foundation.css`: sistem visual yang dibatasi ke `.lr-foundation`.
- `src/app/`: entry halaman eksplisit; metadata, sitemap, robots, dan gambar berbagi.
- `src/lib/composer.ts`: aturan ringkasan dan penyusunan draf kontak tanpa basis data.
- `scripts/`: pemeriksaan logika dan HTTP.

Laporan/proposal lama tetap memakai entry dan komponen sebelumnya. Komponen 3D lama disimpan untuk tahap pengembangan berikutnya; halaman fondasi tidak mengimpornya.

Catatan keputusan, sumber konten, verifikasi, dan batas pelaksanaan tersedia di [catatan implementasi](outputs/luksuri-reka-implementasi-fondasi.md).

## Prototipe Level 2 lokal

```sh
npm run dev:experience
# http://127.0.0.1:3001

npm run test:experience
npm run build:experience
npm run start:experience
# Terminal kedua, saat preview produksi berjalan:
npm run test:experience:http
```

Profil ini mengaktifkan `NEXT_PUBLIC_LR_EXPERIENCE=1` dan `LR_EXPERIENCE_LOCAL_OUTPUT=1`, memakai output `.next-experience` terpisah. Flag fungsional dan lokasi output lokal dipisahkan agar build produksi standar tetap memakai `.next`.

Tautan pratinjau `/?effects=still` atau `/?effects=light` dapat menentukan pilihan awal tanpa penyimpanan browser. Preferensi sistem/hemat data tetap dihormati. Tanpa parameter, muat ulang memulai penentuan otomatis.

Tambahkan `&inspect=1` pada URL localhost untuk alat pemeriksaan, misalnya `http://127.0.0.1:3001/?effects=auto&inspect=1`. Panel membaca Resource Timing dan statistik renderer, serta dapat memutus konteks WebGL untuk menguji fallback. Parameter ini tidak mengaktifkan panel pada domain publik. Tidak ada pengiriman data.

`npm run check:experience:bundle` merupakan alat QA lanjutan yang membutuhkan file bukti browser lokal sesuai identitas build. Bukti di `outputs/` bukan syarat CI. Setelah rebuild, ambil bukti baru sebelum memeriksa bundle. Ini bukan pengujian perangkat atau Core Web Vitals.

Profil Level 2 memakai satu Canvas dinamis, tiga komposisi beranda, poster SVG inline dalam HTML server, preferensi efek di memori, serta fallback HTML. Source berada di `src/components/experience/` dan `src/lib/experience.ts`. Perintah `dev:experience`/`build:experience` otomatis menyusun `ExperiencePoster.tsx` dari `public/experience/*.svg`; tidak ada permintaan gambar poster pada runtime. Kontur identitas tetap berasal dari bitmap yang tersedia, dengan sumber/status studi prototipe tercatat; sumber logo vektor resmi masih dibutuhkan untuk finalisasi identitas. Adegan Karya tetap skema sampai aset asli tersedia.

Lihat [catatan rilis Level 2](docs/level-2.md). Sumber vektor identitas, tampilan karya asli, serta pengujian perangkat/kinerja lanjutan tetap tercatat untuk pengembangan berikutnya. Dokumen masukan dan arsip penelitian lokal tidak ditambahkan ke publikasi source aplikasi.

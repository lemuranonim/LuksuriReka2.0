# Luksuri Reka · Studio Digital

Website studio berdasarkan master prinsip v1.3, fondasi v1.4, dan hasil review keselarasan. Fokus fondasi: identitas yang jelas, bukti karya, solusi sesuai konteks, akses produk, dan percakapan proyek.

## Menjalankan

```sh
npm install
npm run dev
```

Buka `http://localhost:3000`. Halaman Indonesia berada di `/`, pasangan Inggris di `/en`.

```sh
npm run test:foundation
npm run build
npm run start
# Terminal kedua, saat preview produksi berjalan:
npm run test:foundation:http
```

Pengujian menggunakan Node bawaan dan TypeScript yang sudah ada, tanpa dependensi pengujian tambahan. `FOUNDATION_TEST_URL` dapat menunjuk port localhost lain. Pengujian HTTP dibatasi ke localhost.

## Struktur

- `src/lib/site-content.ts`: registry URL, copy ID/EN, solusi, studi kasus, dan kontak.
- `src/components/site/`: halaman, navigasi, komposisi identitas, Composer, dan adapter event.
- `src/app/foundation.css`: sistem visual yang dibatasi ke `.lr-foundation`.
- `src/app/`: entry halaman eksplisit; metadata, sitemap, robots, dan gambar berbagi.
- `src/lib/composer.ts`: aturan ringkasan dan penyusunan draf kontak tanpa basis data.
- `scripts/`: pemeriksaan logika dan HTTP.

Laporan/proposal lama tetap memakai entry dan komponen sebelumnya. Komponen 3D lama disimpan untuk tahap pengembangan berikutnya; halaman fondasi tidak mengimpornya.

Catatan keputusan, sumber konten, verifikasi, dan batas pelaksanaan tersedia di [catatan implementasi](outputs/luksuri-reka-implementasi-fondasi.md).

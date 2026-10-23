# Rilis Level 2 — Luksuri Reka

23 Oktober 2026

Pengalaman studio menggunakan satu komposisi yang berkembang: identitas memberi bentuk, tiga kemampuan disusun dan dihubungkan, lalu bidang memperlihatkan skema alur karya. Nama Luksuri Reka · Studio Digital, janji merek, tujuh bab, serta jalur solusi/produk/kontak dipertahankan.

## Perilaku

- Satu Canvas dekoratif dengan render on-demand; pose selesai dan area di luar layar menghentikan render.
- Keadaan Penuh, Ringan, Diam, dan Dasar. Reduced motion, hemat data, pilihan pengguna, dan kegagalan render dipertimbangkan sebelum pengayaan.
- Kontrol HTML serta navigasi tetap berfungsi tanpa Canvas. Jeda/Lanjutkan mengembalikan pilihan animasi sebelumnya.
- SVG statis disertakan langsung dalam HTML server; pergantian komposisi menunggu frame yang sesuai.
- Preferensi hanya berada dalam memori, tanpa penyimpanan browser atau pengiriman analitik baru.
- Inspeksi teknis dibatasi ke localhost dan parameter eksplisit.

## Penyempurnaan gerak — 23 Oktober 2026

Panah pada hero membawa pengunjung ke kebutuhan dalam 520 ms dengan perlambatan di akhir. Wheel, sentuhan, tombol navigasi, Back, dan perpindahan halaman dapat menghentikannya. Riwayat menyimpan posisi keberangkatan dan fokus berpindah ke bagian tujuan setelah tiba. Reduced motion dari OS memakai perpindahan langsung; tautan HTML tetap menjadi fallback tanpa JavaScript.

Komposisi kini dirakit otomatis saat bab visual berganti: dua bagian simbol dan lapisan kedalaman menyatu, tiga bidang solusi masuk bergiliran dengan jalur penghubung, kemudian bidang karya membuka skema alur. Posisi scroll memengaruhi sudut dan jarak bidang pada mode Penuh. Mode Ringan memakai jarak gerak lebih kecil serta perakitan lebih singkat. Tombol “Rakit ulang” tersedia melalui mouse maupun keyboard pada setiap komposisi animasi. Perakitan selesai sekitar 1,3 detik pada Penuh dan 0,65 detik pada Ringan, kemudian render kembali berhenti. Kontrol Jeda/Tanpa gerak dan poster tetap berlaku.

## Sumber visual dan batas bahan

Identitas memakai studi kontur dari bitmap logo yang tersedia, dengan sumber/hash tercatat. Studi tersebut belum menggantikan sumber vektor identitas resmi. Karya tetap berupa skema berlabel, dan tidak menyatakan bahwa diagram adalah tampilan aplikasi asli.

Pengujian lokal sebelumnya mencakup Penuh/Ringan/Diam, context loss nyata, fallback dan jalur kontak, keyboard, Composer, anchor/Back, serta viewport desktop dan ponsel. Satu chunk tambahan yang diamati berukuran sekitar 234 KB gzip. Ukuran dan timing sampel lokal/cache tidak menggantikan gerbang perangkat fisik atau Web Vitals lapangan.

## Produksi dan pemeriksaan

Build standar mengaktifkan Level 2 dan memakai `.next`. `NEXT_PUBLIC_LR_EXPERIENCE=0` menyediakan pilihan build fondasi. Profil pratinjau lokal memakai `.next-experience` secara terpisah.

Workflow GitHub Actions menjalankan logika fondasi/Level 2, build produksi, dan pemeriksaan HTTP untuk 28 halaman publik, metadata/CSP/heading, tautan internal, pengalihan/404, laporan lama, sitemap/robots, gambar berbagi, serta tiga komposisi SVG ID/EN. Vercel menjalankan deployment melalui integrasi Git yang sudah terhubung ke `master`.

Lanjutan visual memerlukan sumber logo yang disahkan dan minimal satu tampilan karya asli beserta konteks/peran/keterangan data. Pengujian perangkat fisik, preferensi OS/hemat data pada browser nyata, kegagalan inisialisasi WebGL sejak awal, dan baseline kinerja beberapa ulangan/lapangan tetap dicatat sebagai pekerjaan lanjutan.

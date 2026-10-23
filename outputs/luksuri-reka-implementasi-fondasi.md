# Luksuri Reka — Implementasi Tahap Fondasi

23 Oktober 2026 · Implementasi lokal · Belum dipublikasikan ke domain

## Hasil

Website studio telah dibangun berdasarkan master prinsip v1.3, lampiran fondasi v1.4, dan koreksi pada review v1.4. Implementasi ini menggantikan pengalaman utama berbasis kanvas dengan halaman studio yang dapat dibaca dari HTML awal. Identitas tetap **Luksuri Reka · Studio Digital / Digital Studio**.

Janji merek: **Dirancang dengan makna. Dibangun untuk bekerja.** / **Designed with purpose. Built to work.**

Prinsip publik yang dipertahankan: jelas, berguna, berkarakter; mengikuti konteks pengguna; keputusan dan lingkup dijelaskan dengan alasan. Solusi dapat digabung dan disusun mengikuti tujuan, pengguna, sistem, serta prioritas calon klien.

## Yang sudah diterapkan

| Area | Implementasi |
| --- | --- |
| Identitas | Logo yang tersedia, navy–pearl–cyan, geometri dan bidang bertumpuk, garis sambungan, komposisi editorial |
| Beranda | Tujuh bagian: identitas → kebutuhan → solusi → karya → produk → cara kerja → kolaborasi |
| Solusi | Tiga kelompok kemampuan, halaman detail, situasi pengguna, pertanyaan awal, kemungkinan keluaran, karya terkait |
| Karya | KrosCekApps dan Scify CompFeed: konteks, peran, keputusan, alur, stack yang relevan |
| Bukti visual | Diagram berlabel **Skema alur**; ilustrasi produk berlabel ilustrasi konsep; tidak dipresentasikan sebagai screenshot |
| Produk | Indeks Produk dan halaman Luksuri Sign, akses langsung ke alamat produk yang sudah digunakan sebelumnya |
| Studio | Posisi studio, prinsip, proses, dan lokasi kota dari konten sebelumnya |
| Kontak | WhatsApp dan email langsung, Composer opsional, templat ringkasan tanpa JavaScript |
| Bantuan | Akses produk, petunjuk pemeriksaan dokumen, FAQ, dan kontak |
| Bahasa | Empat belas halaman dalam ID/EN; navigasi, ringkasan, validasi, label, dan CTA tersedia pada kedua bahasa |
| SEO | Metadata halaman, canonical, pasangan hreflang, sitemap, robots, Organization JSON-LD, gambar berbagi |
| Struktur akses | Skip link, heading, label input, fokus, kontrol native, preferensi reduced motion, menu seluler native |
| Header | CSP pada halaman publik studio, nosniff, Referrer-Policy |

Hero dan ilustrasi memakai komposisi CSS dari geometri logo. Tidak ada runtime WebGL, maskot, suara, splash screen, atau animasi pembuka pada halaman fondasi. Source komponen 3D lama tetap tersedia untuk tahap berikutnya.

## Peta halaman

| Halaman | Indonesia | English |
| --- | --- | --- |
| Beranda | `/` | `/en` |
| Karya | `/karya` | `/en/work` |
| KrosCekApps | `/karya/kroscekapps` | `/en/work/kroscekapps` |
| Scify CompFeed | `/karya/scify-compfeed` | `/en/work/scify-compfeed` |
| Solusi | `/solusi` | `/en/solutions` |
| Website | `/solusi/website-pengalaman-digital` | `/en/solutions/websites-digital-experience` |
| Aplikasi operasional | `/solusi/aplikasi-bisnis-operasional` | `/en/solutions/business-operations-apps` |
| Integrasi | `/solusi/integrasi-otomasi` | `/en/solutions/integration-automation` |
| Produk | `/produk` | `/en/products` |
| Luksuri Sign | `/produk/luksuri-sign` | `/en/product/luksuri-sign` |
| Studio | `/studio` | `/en/studio` |
| Kontak | `/kontak` | `/en/contact` |
| Bantuan | `/bantuan` | `/en/help` |
| Privasi | `/privasi` | `/en/privacy` |

Masing-masing menggunakan entry App Router eksplisit. Registry terpusat ada di `src/lib/site-content.ts`. Pengalih bahasa membuka halaman padanan. Locale HTML ditentukan dari route melalui proxy. Layout memakai header permintaan sehingga halaman studio dirender oleh server saat diminta.

URL lama `?section=portfolio`, `?section=about`, `?section=casestudy`, `?section=services`, `?action=contact`, serta `/help` diarahkan ke halaman yang sesuai. Sembilan entry laporan/proposal lama tetap dipertahankan dan tidak dimasukkan ke sitemap studio.

Halaman 404 memakai dokumen global agar isi, bahasa, dan tautan pemulihan tersedia sebelum JavaScript aktif. Implementasi mengaktifkan `experimental.globalNotFound` pada Next.js 16.1.6 yang sudah digunakan repo; perilakunya diuji pada build produksi. Konvensinya mengikuti [dokumentasi resmi Next.js](https://nextjs.org/docs/app/api-reference/file-conventions/not-found).

## Composer dan data

1. Pilih satu atau beberapa kebutuhan. Pilihan **belum yakin** bersifat eksklusif.
2. Isi konteks opsional: tujuan, pengguna, tempat penggunaan, sistem saat ini.
3. Tinjau jawaban, dugaan awal, serta pertanyaan yang belum terjawab; kembali untuk mengubah masukan.
4. Salin ringkasan atau buka draf WhatsApp/email. Bila clipboard gagal, teks ringkasan disediakan untuk penyalinan manual.

Penggunaan di lapangan menambah pertanyaan tentang koneksi; tidak otomatis menjanjikan fitur offline. Sistem yang sudah ada menambah pertanyaan tentang akses dan integrasi. Ringkasan tidak menetapkan harga, arsitektur, atau komitmen fitur.

Pilihan dan teks berada pada state sementara di browser. Tidak ada basis data, API pengiriman, cookie, localStorage, sessionStorage, atau persistensi ringkasan. Halaman yang dimuat ulang memulai ulang Composer. Tombol draf tidak dianggap sebagai pengiriman pesan.

Adapter event hanya memancarkan `CustomEvent` dalam memori browser. Belum ada penyedia analitik atau pengiriman event ke jaringan. Isi jawaban, ringkasan, identitas, dan URL draf tidak menjadi payload. Adapter ini merupakan titik sambung pengukuran, bukan dashboard analitik yang sudah aktif.

## Sumber dan keputusan isi

| Materi | Sumber / keputusan |
| --- | --- |
| Nama, deskriptor, prinsip, urutan pengalaman | Percakapan, master v1.3, fondasi v1.4, dan review keselarasan |
| Logo | `public/logo.png` yang sudah ada |
| Font | Inter dan JetBrains Mono yang sudah digunakan repo, melalui `next/font` |
| Cyan `#67e1de`, permukaan, garis | Keputusan art direction implementasi; bukan klaim pedoman warna resmi perusahaan |
| KrosCekApps dan Scify CompFeed | Uraian karya di `src/components/ui/ContentOverlay.tsx` pada baseline Git `5701e6c` |
| Luksuri Sign dan alamat akses | Halaman bantuan lama pada baseline yang sama; fungsi tanda tangan/verifikasi dan alamat produk sudah disebut di sana |
| Email, WhatsApp, lokasi kota | Konten kontak lama pada baseline yang sama |
| Proses dan keluaran | Penjabaran konsep yang disetujui; lingkup aktual dibahas per proyek |

Konten karya sebelumnya menjadi dasar penyusunan studi kasus. Ini tidak menambahkan bukti verifikasi langsung terhadap aplikasi atau izin publikasi baru. Angka hasil, testimoni, nama klien tambahan, jaminan layanan, SLA, orang, badan usaha, dan klaim legal baru tidak dibuat. Tidak ada placeholder publik.

## Verifikasi

| Pemeriksaan | Hasil |
| --- | --- |
| Build produksi, termasuk pemeriksaan TypeScript | Lulus |
| Delapan pengujian logika/kontras dasar | Lulus |
| 28 halaman publik ID/EN | HTTP 200; locale, heading, canonical, hreflang, CSP diperiksa |
| 682 tautan internal yang ditemukan pada HTML | Mengarah ke halaman publik atau anchor yang tersedia |
| Enam pintu masuk lama | Pengalihan 307/308 sesuai tujuan |
| 404 ID/EN dan alamat file yang tidak ada | HTTP 404, noindex, heading dan konten pada HTML awal |
| Composer dari parameter `need` | Pilihan valid diterapkan; nilai tidak dikenal diabaikan |
| Sembilan halaman laporan/proposal lama | HTTP 200 |
| Sitemap, robots, gambar OG | Lulus; OG PNG 1200×630 juga diperiksa secara visual |

Kontras yang diuji mencakup teks utama/pendukung, tombol utama pada permukaan gelap/terang, serta batas input dan checkbox Composer. Ini bukan audit WCAG lengkap.

Pemeriksaan visual interaktif desktop/ponsel, keyboard nyata, screen reader, clipboard nyata, dan pembukaan aplikasi WhatsApp/email **belum terverifikasi**. Browser tugas tidak tersedia; pembacaan tab Chrome pribadi ditolak oleh pemeriksaan persetujuan otomatis karena berada di luar tugas, dan percobaan membuka jendela preview khusus gagal pada akses kontrol Windows. Panel preview Codex mengembalikan status antre, sehingga tidak dianggap sebagai bukti bahwa preview sudah terlihat.

Belum ada hasil uji lima detik dengan calon pengguna, hasil perangkat fisik, Lighthouse, atau data lapangan Core Web Vitals. Tidak ada klaim angka performa atau kepatuhan yang diterbitkan.

## Peninjauan sebelum publikasi

Tinjau tampilan pada desktop dan ponsel, fungsi Composer di browser nyata, serta akses produk. Pastikan kembali izin/fakta karya yang sebelumnya sudah dicantumkan, materi screenshot yang dapat dipakai, dan kesesuaian teks dengan fungsi produk terkini. Keterangan infrastruktur/privasi diselaraskan dengan hosting yang dipilih saat publikasi.

Fondasi ini sudah dapat dijalankan lokal. Pengalaman 3D, sumber logo vektor untuk pemodelan, pengayaan bukti karya, serta penyedia analitik mengikuti tahap keputusan berikutnya. Tidak ada deployment, perubahan DNS, push Git, atau pesan kepada calon klien yang dilakukan.

## Menjalankan ulang

```sh
npm run dev
# http://localhost:3000 atau http://localhost:3000/en

npm run test:foundation
npm run build
npm run start
# Terminal kedua:
npm run test:foundation:http
```

Server pengujian yang dibuat untuk pengerjaan dihentikan setelah verifikasi. Gambar berbagi hasil build disimpan sebagai `outputs/luksuri-reka-fondasi-og.png`.

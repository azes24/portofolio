# Portofolio — Fathul Aziz Saifuddin

Website portofolio pribadi bergaya *Editorial Newspaper / Retro Broadsheet* untuk **Fathul Aziz Saifuddin** (Web Developer, Asisten Praktikum, dan Multimedia Designer).

---

## 📁 Struktur Direktori & File

Struktur folder telah dirapikan agar mudah dipahami dan dikelola:

```text
Portofolio/
│
├── index.html                      # Halaman Utama (Home / Beranda)
├── profile.html                    # Halaman Profil & Arsip Interaktif (Rak Buku + Proyek)
├── about.html                      # Halaman Tentang Saya, Prestasi, dan Unduh CV
├── work.html                       # Mirror/Sync dari profile.html
├── beranda.html                    # Pengalihan otomatis (redirect) ke index.html
│
├── style.css                       # Desain CSS utama (Typography, Layout Koran, Dark/Paper theme, Responsive)
├── script.js                       # Logika interaktif (Slider Karosel, Akordeon Lipat, Menu Navigasi, Share Link)
├── CV_Fathul_Aziz_Saifuddin.pdf    # Dokumen CV ATS-Friendly resmi
│
├── icon.webp                       # Favicon utama (WebP - 108 KB)
├── favicon.png                     # Favicon fallback (PNG 32x32)
├── icon-192.webp                   # Ikon resolusi tinggi untuk Mobile / PWA
│
└── images/                         # 📁 FOLDER ASET GAMBAR LOKAL
    ├── PANDUAN_GAMBAR.md           # Panduan lengkap mengganti gambar
    │
    ├── projects/                   # 🖼️ Screenshot / Mockup Proyek Web
    │   ├── ilsah-madura.webp       # Proyek: Website Resmi ILSAH Madura (Sorotan Utama)
    │   ├── nexlab.webp             # Proyek: NEXLAB EthnoSTEM Laboratory
    │   ├── folklore-hub.webp       # Proyek: Madurese Folklore Hub
    │   └── unipustaka.webp         # Proyek: Sistem Perpustakaan UNIPUSTAKA
    │
    ├── profile/                    # 👤 Foto Pribadi & Suasana Kerja
    │   ├── fathul-aziz.webp        # Foto profil utama Fathul Aziz
    │   ├── workspace.webp          # Foto meja kerja / aktivitas coding
    │   └── matrix-code.webp        # Background visual showcase kode
    │
    └── awards/                     # 🏆 Sertifikat & Foto Prestasi / Asistensi
        ├── unisza-malaysia.webp    # Prestasi: Bronze Medal IICFE UniSZA Malaysia
        ├── praktikum-web.webp      # Asistensi: Praktikum Pemrograman Web UTM
        ├── infografis.webp         # Prestasi: Juara 2 Desain Infografis UTM
        ├── lidm-utm.webp           # Prestasi: Juara 3 Tim Seleksi Internal LIDM UTM
        ├── esai-sore.webp          # Prestasi: Bronze Medal Esai Nasional SORE 2
        ├── videografi.webp         # Prestasi: Finalis Videografi PRODISTIK ITS
        └── ilsah-leadership.webp   # Kepemimpinan: Ketua Umum ILSAH Madura
```

---

## 🖼️ Cara Menambahkan / Mengganti Gambar

Semua gambar di website telah diarahkan ke file lokal di dalam folder `images/`. Untuk mengganti gambar dengan foto/tangkapan layar Anda sendiri:

1. **Siapkan Gambar Anda** (disarankan rasio landscape 16:9 atau 4:3, format `.webp`, `.jpg`, atau `.png`).
2. **Ganti File Terkait di Folder `images/`**:
   - Cukup timpa (*replace*) nama file yang sudah ada (misalnya ganti `images/projects/ilsah-madura.webp` dengan screenshot website ILSAH Madura milik Anda).
   - *Tips:* Jika menggunakan format `.png` atau `.jpg`, Anda cukup mengubah ekstensi file di `index.html` dan `profile.html` sesuai nama file baru Anda.
3. **Buka Panduan Detail**: Silakan baca [`images/PANDUAN_GAMBAR.md`](file:///d:/DATA/ME/Portofolio/images/PANDUAN_GAMBAR.md) untuk rincian ukuran rekomendasi setiap gambar.

---

## 🌟 Sorotan Proyek Terkini
- **Website Resmi ILSAH Madura** (*Ikatan Alumni Santri Tarbiyatut Tholabah*):
  - Kategori: Website Organisasi & Jejaring Alumni
  - Tech Stack: PHP, MySQL, CSS, JS, HTML
  - Live Demo: [https://ilsahmadura.page.gd/](https://ilsahmadura.page.gd/)
  - Repositori: [https://github.com/azes24/ilsahMadura](https://github.com/azes24/ilsahMadura)

---

## 🚀 Menjalankan Secara Lokal

Cukup jalankan server lokal sederhana (misalnya dengan Python):
```bash
python -m http.server 3000
```
Buka browser dan akses `http://localhost:3000/`.

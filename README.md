# CLAIMGRAPH-X

### Sistem Investigasi Risiko Klaim JKN Berbasis Graph Neural Network
**Badan Penyelenggara Jaminan Sosial Kesehatan Republik Indonesia**

---

## 1. Ringkasan Eksekutif

CLAIMGRAPH-X adalah sistem analitik cerdas berbasis Graph Neural Network (GNN) dan mesin aturan (Rule Engine) terintegrasi yang dikembangkan untuk mendeteksi, menganalisis, dan memprioritaskan potensi anomali serta kecurangan (fraud) pada klaim Jaminan Kesehatan Nasional (JKN).

Sistem ini mentransformasikan data transaksi klaim relasional menjadi representasi graf multirelasi heterogen. Pendekatan ini memungkinkan pemetaan hubungan kompleks antara Peserta, Tenaga Medis, Fasilitas Kesehatan Rujukan Tingkat Lanjutan (FKRTL), Fasilitas Kesehatan Tingkat Pertama (FKTP), serta Kode Diagnosis (ICD-10) dan Tindakan Medis (INA-CBG). Dengan kapabilitas tersebut, klaster anomali tersembunyi—seperti klaster duplikasi prosedur (K-04), klaim berulang (repeat billing), klaim fiktif (phantom billing), dan penggelembungan kode (upcoding)—dapat diidentifikasi dengan tingkat akurasi tinggi sebelum pembayaran klaim direalisasikan.

---

## 2. Fitur Utama Sistem

### A. Deteksi Jaringan & Klaster Multirelasi (Graph Analytics)
* **Graph Neural Network (GNN) Engine**: Mengagregasi informasi struktural dan kontekstual dari node nakes, pasien, dan faskes untuk mengidentifikasi anomali koordinasi tindakan.
* **Canvas Graf Interaktif**: Visualisasi node entitas dengan filter kategori, penandaan jalur bukti anomali (evidence path), penyorotan klaster, serta animasi aliran transfer data klaim secara real-time.
* **Inspeksi Klaster K-04**: Analisis keterikatan hubungan dokter penanggung jawab pelayanan (DPJP) terhadap beberapa pasien dengan prosedur identik dalam rentang waktu yang tidak wajar.

### B. Stratifikasi Risiko dan Explainable AI (XAI)
* **Skor Risiko Terurai (Multi-Signal Scoring)**:
  * Sinyal Aturan Medis & Restriksi INA-CBG (Maks. 30 poin)
  * Sinyal Anomali Statistik Frekuensi Klaim (Maks. 25 poin)
  * Sinyal Graf Sentralitas & Klaster Jaringan (Maks. 25 poin)
  * Sinyal Kewajaran Waktu dan Kronologi Tindakan (Maks. 20 poin)
* **Penjelasan Kontekstual Klaim**: Setiap klaim yang ditandai dilengkapi ringkasan naratif alasan penandaan, ambang batas deviasi, serta rekomendasi langkah investigasi selanjutnya.

### C. Alur Kerja Investigasi Terpadu (Human-in-the-Loop)
* **Antrean Klaim Berprioritas**: Pengelompokan klaim berdasarkan tingkat risiko (Tinggi, Sedang, Rendah) dengan kemampuan pemuatan data berurutan (pagination) dan pencarian global.
* **Lembar Kerja Penetapan Keputusan**: Checklist verifikasi bukti, input catatan temuan klinis, dan opsi keputusan resmi:
  * Tervalidasi Anomali (Validated Fraud)
  * Sesuai Ketentuan (Dismissed / Cleared)
  * Eskalasi ke Tim Satgassus Anti-Fraud
* **Jejak Audit Kriptografis Imutabel (Append-Only Audit Trail)**: Seluruh tindakan verifikasi, pembaruan status, dan sesi akses dicatat secara permanen dan dapat diekspor ke dalam format CSV untuk keperluan audit negara (BPKP/Inspektorat).

### D. Fleksibilitas Antarmuka Ganda (Dual Presentation Mode)
* **Mode Mobile App (PDF Reference)**: Tampilan viewport smartphone presisi dengan status bar SatuSehat dan navigasi bawah, dirancang sesuai cetak biru dokumen spesifikasi CLAIMGRAPH-X.pdf.
* **Mode Desktop Console Workstation**: Tata letak enterprise layar penuh dengan sidebar navigasi terpadu untuk produktivitas analis di kantor cabang dan kantor pusat.

### E. Statistik dan Diagram Aliran Data Real-Time
* Metrik agregat jumlah klaim terproses, nilai finansial batch, rasio anomali, dan potensi penyelamatan dana JKN.
* Visualisasi diagram alur pipeline data end-to-end (E-Klaim Ingestion -> Rule Engine -> GNN Engine -> Scoring Prioritas -> Antrean Investigasi) dengan visualisasi paket data transfer interaktif.
* Analisis sebaran 5 pola kecurangan dominan dan peringkat faskes dengan konsentrasi anomali tertinggi.

---

## 3. Kepatuhan Regulasi dan Keamanan Data Pemerintah

Mengingat data yang diproses mencakup data klaim dan informasi kesehatan masyarakat Indonesia, CLAIMGRAPH-X dirancang dengan mematuhi kerangka hukum dan standar keamanan nasional:

1. **Undang-Undang No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP)**
   * Perlindungan Data Sensitif / Spesifik: Informasi kesehatan pasien diproses dengan kepatuhan penuh terhadap ketentuan privasi data pribadi.
   * Penyamaran Identitas (Data Masking): Nomor Induk Kependudukan (NIK) dan nama lengkap peserta disamarkan secara dinamis menggunakan algoritma hashing deterministik berkunci.

2. **Standar Kriptografi Badan Siber dan Sandi Negara (BSSN)**
   * Data at Rest: Enkripsi basis data menggunakan Advanced Encryption Standard dengan mode Galois/Counter Mode 256-bit (AES-256-GCM). Kunci enkripsi dikelola secara terpusat melalui modul Hardware Security Module (HSM).
   * Data in Transit: Pengamanan seluruh saluran transmisi jaringan internal menggunakan Transport Layer Security (TLS 1.3).
   * Verifikasi Integritas: Pengecekan nilai hash SHA-256 pada seluruh arsip berkas klaim untuk mencegah manipulasi data.

3. **Autentikasi Aparatur Pemerintahan Terpercaya (SSO & 2FA)**
   * Portal Single Sign-On (SSO) terintegrasi untuk pejabat dan aparatur yang berwenang.
   * Dukungan Multi-Factor Authentication (MFA) berbasis BSSN Gov-Authenticator Token (RFC 6238 TOTP) dan kunci keamanan berbasis standar FIDO2.
   * Kontrol Akses Berbasis Peran (Role-Based Access Control / RBAC) dengan tingkat izin keamanan (Clearance Level 2 hingga Level 4).

4. **Panel Diagnostik Audit Mandiri**
   * Fasilitas uji diagnostik keamanan mandiri untuk memverifikasi kesesuaian parameter kriptografis sistem secara real-time langsung dari antarmuka pengguna.

---

## 4. Peran Pengguna (Role-Based Access Control)

Sistem memfasilitasi 4 profil akun dinas aparatur terverifikasi:

| NPP / ID | Nama & Gelar | Jabatan Dinas | Peran Teknis | Tingkat Izin Keamanan |
| :--- | :--- | :--- | :--- | :--- |
| INV-07 | Dr. Aris Prasetyo, Sp.A | Investigator Utama Anti-Fraud JKN | investigator | Tingkat 3 (Rahasia/Investigasi) |
| ANL-01 | Ns. Ratna Dewi, S.Kep | Verifikator Medis & Analis Klaim FKRTL | analyst | Tingkat 2 (Terbatas) |
| AUD-03 | Bambang Supriyadi, S.E., Ak., CA | Auditor Utama Forensik Keuangan Negara (BPKP) | viewer | Tingkat 3 (Audit/Pengawasan) |
| SEC-99 | Ir. Teguh Wicaksono, M.Kom, CISSP | Administrator Keamanan Siber (DPO UU PDP) | investigator | Tingkat 4 (Super-Admin Siber) |

---

## 5. Struktur Repositori

```text
CLAIMGRAPH-X/
├── CLAIMGRAPH-X.pdf              # Dokumen cetak biru spesifikasi UI/UX dan alur sistem
├── PRD_CLAIMGRAPH-X_MVP.md       # Product Requirement Document (PRD) komprehensif
├── README.md                     # Dokumentasi teknis dan panduan operasional proyek
├── .gitignore                    # Konfigurasi pengabaian berkas repositori
└── claimgraph-app/               # Sumber kode aplikasi frontend web
    ├── index.html                # Entry point HTML aplikasi
    ├── package.json              # Manifes dependensi Node.js
    ├── tsconfig.json             # Konfigurasi kompilator TypeScript
    ├── vite.config.ts            # Konfigurasi bundler Vite
    └── src/
        ├── App.tsx               # Komponen utama aplikasi dan routing tampilan
        ├── types.ts              # Definisi tipe data TypeScript
        ├── main.tsx              # Titik masuk pemuatan DOM React
        ├── index.css             # Desain sistem global dan utilitas CSS
        ├── components/           # Komponen modular reusable
        │   ├── Header.tsx        # Navigasi atas, profil kredensial, dan status BSSN
        │   ├── Navigation.tsx    # Bar navigasi bawah mobile dan sidebar desktop
        │   ├── GraphCanvas.tsx   # Canvas visualisasi graf multirelasi interaktif
        │   ├── ScoreBar.tsx      # Komponen visualisasi 4 sinyal risiko terurai
        │   ├── RiskNotice.tsx    # Banner kepatuhan tata kelola investigasi
        │   ├── SyntheticBadge.tsx# Indikator validasi data sintetis terverifikasi
        │   └── SecurityAuditModal.tsx # Panel inspeksi keamanan data dan UU PDP
        ├── views/                # Halaman dan tampilan utama sistem
        │   ├── LoginView.tsx     # Portal autentikasi tunggal (SSO) kredensial dinas
        │   ├── DashboardView.tsx # Beranda overview metrik klaim dan prioritas
        │   ├── QueueView.tsx     # Antrean klaim terdaftar dengan filter anomali
        │   ├── ClaimDetailView.tsx# Lembar telaah rincian klaim, nakes, dan kronologi
        │   ├── GraphView.tsx     # Visualisasi penuh klaster graf jaringan K-04
        │   ├── StatisticsView.tsx# Analitik klaim, SVG pipeline, dan sebaran kecurangan
        │   ├── InvestigationView.tsx # Lembar keputusan human-in-the-loop dan checklist
        │   ├── EvaluationView.tsx# Metrik evaluasi akurasi model GNN
        │   ├── AuditLogView.tsx  # Catatan log append-only permanen dan ekspor CSV
        │   ├── RulesView.tsx     # Katalog aturan deteksi medis dan INA-CBG
        │   ├── FacilitiesView.tsx# Analisis konsentrasi anomali faskes per wilayah
        │   └── SyntheticDataView.tsx # Metodologi pembentukan dataset klaim JKN
        └── data/
            ├── mockData.ts       # Dataset sintetis klaim, graf K-04, dan log audit
            └── authUsers.ts      # Kredensial dinas aparatur dan metrik keamanan
```

---

## 6. Persyaratan Sistem dan Instalasi

### Persyaratan Lingkungan
* **Node.js**: Versi 18.x atau 20.x (disarankan versi LTS)
* **Package Manager**: npm versi 9.x atau yang lebih baru
* **Browser**: Google Chrome, Mozilla Firefox, Microsoft Edge, atau Safari modern dengan akselerasi WebGL/Canvas aktif

### Langkah Instalasi

1. **Kloning Repositori**:
   ```bash
   git clone https://github.com/livai12/CLAIMGRAPH-X.git
   cd CLAIMGRAPH-X/claimgraph-app
   ```

2. **Pemasangan Dependensi**:
   ```bash
   npm install
   ```

3. **Menjalankan Server Pengembangan Lokal**:
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan pada alamat lokal:
   ```text
   http://localhost:3000/
   ```

4. **Kompilasi Bundle Produksi**:
   ```bash
   npm run build
   ```
   Hasil berkas siap rilis akan dihasilkan pada direktori `claimgraph-app/dist/`.

---

## 7. Teknologi yang Digunakan

* **Bahasa & Runtime**: TypeScript, Node.js
* **Framework Frontend**: React 19
* **Build Tool & Bundler**: Vite 8
* **Styling**: Tailwind CSS, CSS Variables
* **Ikonografi & Visual**: Lucide React
* **Standar Aksesibilitas**: WAI-ARIA compliant dialogs and controls

---

## 8. Hak Cipta dan Lisensi

Hak Cipta (c) 2026 Badan Penyelenggara Jaminan Sosial Kesehatan Republik Indonesia (BPJS Kesehatan RI). Seluruh hak cipta dilindungi undang-undang. Sistem ini dikembangkan untuk kepentingan pengelolaan, pengawasan, dan perlindungan integritas dana program Jaminan Kesehatan Nasional Republik Indonesia.

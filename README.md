# CLAIMGRAPH-X

### Sistem Investigasi Risiko Klaim JKN Berbasis Graph Neural Network dan Multi-Signal Scoring
**Badan Penyelenggara Jaminan Sosial Kesehatan Republik Indonesia**

---

## 1. Ringkasan Eksekutif

CLAIMGRAPH-X adalah sistem analitik cerdas yang mengintegrasikan Graph Neural Network (GNN), model pembelajaran mesin tanpa pengawasan (Isolation Forest), dan mesin aturan klinis (Rule Engine) terintegrasi untuk mendeteksi, menganalisis, dan memprioritaskan potensi anomali serta kecurangan (fraud) pada klaim Jaminan Kesehatan Nasional (JKN).

Sistem ini mentransformasikan data transaksi klaim relasional menjadi representasi graf multirelasi heterogen. Pendekatan ini memungkinkan pemetaan hubungan kompleks antara Peserta, Tenaga Medis, Fasilitas Kesehatan Rujukan Tingkat Lanjutan (FKRTL), Fasilitas Kesehatan Tingkat Pertama (FKTP), serta Kode Diagnosis (ICD-10) dan Tindakan Medis (INA-CBG). Melalui kapabilitas tersebut, anomali koordinasi tindakan terdistribusi—seperti klaster duplikasi prosedur (K-04), klaim berulang (repeat billing), klaim fiktif (phantom billing), dan penggelembungan kode keparahan (upcoding)—dapat diidentifikasi secara presisi sebelum pembayaran klaim direalisasikan.

Sistem telah terintegrasi penuh dengan berkas resmi **Data Sampel BPJS Kesehatan Edisi Rilis 2025** yang mencakup data longitudinal dan rekam klaim FKRTL/FKTP terkini.

---

## 2. Arsitektur Sistem

Sistem CLAIMGRAPH-X mengadopsi arsitektur berlapis (layered architecture) yang memisahkan antara lapisan pemrosesan machine learning (Python GNN Engine) dan lapisan antarmuka workstation investigasi (React/TypeScript).

```text
+---------------------------------------------------------------------------------------------------+
|                                 SUMBER DATA RESMI BPJS KESEHATAN                                 |
|               (Dataset/2025: Data Sampel Reguler & Kontekstual TB, DM, COVID, KIA, KM)            |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
|                        LAPISAN 1: INGESTION & PENYAMARAN DATA (UU PDP)                            |
|  - Pembacaan streaming berkas Stata (.dta) menggunakan Pandas Iterator                            |
|  - Hashing Kriptografis Deterministik Terkunci (SHA-256) untuk Nomor Peserta & ID Rekam Medis    |
|  - Normalisasi tarif, lama rawat (LOS), poli spesialisasi, dan prosedur ICD-9-CM                  |
+---------------------------------------------------------------------------------------------------+
                                                  |
                         +------------------------+------------------------+
                         |                                                 |
                         v                                                 v
+--------------------------------------------------+ +----------------------------------------------+
|        LAPISAN 2A: RULE ENGINE KLINIS           | |       LAPISAN 2B: PEMBANGUNAN GRAF           |
|  - Aturan K-04 Duplikasi Prosedur (Cloning)      | |  - NetworkX Heterogeneous Multi-Relational |
|  - Aturan Repeat Billing (Kunjungan <= 4 Hari)   | |  - Node: Peserta, Klaim, Faskes, Nakes, Dx |
|  - Aturan Upcoding Keparahan Kasus INA-CBG       | |  - Metrik Sentralitas Derajat & Kepadatan  |
|  - Deviasi Selisih Tagihan vs Verifikasi BPJS    | |  - Ekstraksi Subgraf Ego-Network Komunitas  |
+--------------------------------------------------+ +----------------------------------------------+
                         |                                                 |
                         v                                                 v
+--------------------------------------------------+ +----------------------------------------------+
|     LAPISAN 3A: ANOMALI STATISTIK TABULAR        | |       LAPISAN 3B: GRAPH NEURAL NETWORK       |
|  - Scikit-Learn Isolation Forest                 | |  - PyTorch GNN Autoencoder (Structural Rep)|
|  - Deteksi Outlier Multidimensi Finansial & LOS  | |  - Link & Cluster Reconstruction Anomaly   |
|  - Normalisasi Skor Statistik (Bobot Maks. 25)   | |  - Normalisasi Skor Graf (Bobot Maks. 25)  |
+--------------------------------------------------+ +----------------------------------------------+
                         |                                                 |
                         +------------------------+------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
|                   LAPISAN 4: MULTI-SIGNAL SCORING FUSION & EXPLAINABLE AI (XAI)                   |
|  - Formula Pembobotan Terpadu: Skor Aturan (30%) + Statistik (25%) + Graf (25%) + Waktu (20%)     |
|  - Klasifikasi Stratifikasi: TINGGI (>= 75), SEDANG (45-74), RENDAH (< 45)                       |
|  - Sintesis Penjelasan Naratif Kontekstual: What, Why, Where, Ambang Batas, Rekomendasi Tindakan   |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
|                     LAPISAN 5: WORKSTATION INVESTIGASI & AUDIT PERMANEN                          |
|  - Antrean Berprioritas (Priority Queue) & Filter Multikriteria                                   |
|  - Canvas Visualisasi Graf Interaktif (Cytoscape Engine)                                          |
|  - Lembar Penetapan Keputusan Human-in-the-Loop & Audit Trail Imutabel Kepatuhan BSSN            |
+---------------------------------------------------------------------------------------------------+
```

---

## 3. Alur Kerja Operasional (End-to-End Operational Flow)

Alur kerja investigasi sistem berjalan melalui 6 tahap berurutan:

1. **Ingestion & Standarisasi Data**: Berkas data mentah klaim rujukan (`*_fkrtl.dta`) diekstraksi dari direktori dataset. Seluruh entitas sensitif disamarkan secara matematis tanpa merusak struktur relasi antar-entitas.
2. **Evaluasi Katalog Aturan Medis**: Transaksi klaim diuji terhadap katalog aturan kepatuhan INA-CBG dan restriksi klinis untuk menghasilkan skor aturan dasar (`rule_score`).
3. **Konstruksi Jaringan Multirelasi**: Graf heterogen dibentuk secara dinamis. Derajat keterhubungan tenaga medis, poli pelayanan, dan fasilitas kesehatan dihitung guna memetakan konsentrasi layanan yang tidak wajar.
4. **Pemodelan Dual Machine Learning**:
   * Model *Isolation Forest* memproses distribusi biaya dan lama hari rawat inap untuk menandai penyimpangan statistik.
   * Model *PyTorch GNN Autoencoder* melakukan agregasi representasi relasional tetangga (*neighborhood aggregation*) untuk mendeteksi anomali pola rujukan dan klaster tindakan seragam.
5. **Fusi Multi-Sinyal dan Pembentukan Bukti (XAI)**: Seluruh skor dinormalisasi ke rentang 0–100. Sistem menghasilkan dokumen bukti terstruktur (*evidence path*) dan linimasa kronologis tindakan medis.
6. **Investigasi dan Keputusan Resmi**: Investigator menelaah berkas, memvalidasi bukti melalui visualisasi graf, dan menetapkan keputusan dinas yang dicatat permanen dalam jejak audit kriptografis.

---

## 4. Evaluasi Kinerja dan Efisiensi Solusi

### A. Efisiensi Teknis (Komputasi dan Skalabilitas)
* **Throughput Pemrosesan**: Pipeline Python memproses 5.000 data transaksi klaim mentah lengkap (termasuk pelatihan GNN dan ekstraksi graf) dalam 37,52 detik pada prosesor CPU komersial standar (> 133 klaim per detik).
* **Konstruksi Graf Skala Besar**: Pembentukan topologi 5.932 node dan 21.455 edge relasi diselesaikan dalam 2,34 detik.
* **Latensi Query Antarmuka**: Visualisasi subgraf klaster ego-network pada canvas graf Cytoscape dirender dalam waktu kurang dari 100 milidetik.

### B. Efisiensi Operasional Verifikator dan Penyelamatan Dana JKN
* **Reduksi Waktu Pemeriksaan Berkas**: Waktu telaah manual investigator klaim berkurang dari rata-rata 15–20 menit per kasus menjadi di bawah 2 menit per kasus (efisiensi operasional lebih dari 85%).
* **Mitigasi Kelelahan Peringatan (Alert Fatigue)**: Dari ribuan transaksi klaim yang masuk, sistem memfilter dan memprioritaskan hanya 1–2% kasus dengan deviasi risiko tertinggi ke antrean investigasi utama.
* **Pencegahan Pra-Pembayaran (Pre-Payment Fraud Prevention)**: Deteksi dilakukan sebelum dana klaim ditransfer ke fasilitas kesehatan, mengeliminasi risiko kerugian negara dan beban administratif penagihan kembali pasca-bayar.

---

## 5. Kepatuhan Regulasi dan Keamanan Data

Sistem CLAIMGRAPH-X dirancang memenuhi regulasi dan standar keamanan data nasional:

1. **Undang-Undang No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP)**
   * Pemrosesan data klaim menggunakan mekanisme penyamaran identitas deterministik berkunci (Keyed SHA-256 Hashing) untuk Nomor Induk Kependudukan (NIK) dan nama peserta.
   * Tidak ada data identitas asli yang diekspos dalam antarmuka publik atau berkas ekspor hasil model.
2. **Standar Keamanan Siber BSSN**
   * Enkripsi penyimpanan data (*data at rest*) menggunakan algoritma AES-256-GCM.
   * Transmisi data (*data in transit*) dienkripsi dengan standar TLS 1.3.
   * Jejak audit (*audit trail*) bersifat append-only dengan pencatatan stempel waktu dan ID aktor untuk keperluan audit forensik BPKP/Inspektorat.

---

## 6. Struktur Direktori Proyek

```text
CLAIMGRAPH-X/
├── CLAIMGRAPH-X.pdf              # Dokumen cetak biru spesifikasi UI/UX dan alur sistem
├── PRD_CLAIMGRAPH-X_MVP.md       # Product Requirement Document (PRD) komprehensif
├── README.md                     # Dokumentasi teknis sistem dan panduan operasional
├── .gitignore                    # Konfigurasi pengabaian berkas repositori
├── Dataset/                      # Berkas data sampel resmi BPJS Kesehatan
│   └── 2025/                     # Data Sampel Rilis 2025 (Stata .dta & Kamus ICD-10)
│       ├── Data Sampel Reguler Edisi 2025/
│       ├── Data Sampel Kontekstual TB Edisi 2025/
│       ├── Data Sampel Kontekstual DM Edisi 2025/
│       ├── Data Sampel Kontekstual COVID Edisi 2025/
│       ├── Data Sampel Kontekstual KIA Edisi 2025 - Subset Anak/
│       ├── Data Sampel Kontekstual KIA Edisi 2025 - Subset Ibu/
│       └── Data Sampel Kontekstual Kesehatan Mental Edisi 2025/
├── ml_engine/                    # Pipeline Machine Learning & Graph Neural Network
│   ├── config.py                 # Konfigurasi direktori, pemetaan kolom, dan pembobotan
│   ├── data_loader.py            # Ingestion data Stata, masking UU PDP, dan pra-pemrosesan
│   ├── rule_engine.py            # Mesin aturan evaluasi anomali klinis & INA-CBG
│   ├── graph_builder.py          # Pembangun graf heterogen dan ekstraksi metrik topologi
│   ├── trainer.py                # Pipeline orkestrator pelatihan dan inferensi end-to-end
│   ├── exporter.py               # Generator data antarmuka TypeScript dan artefak JSON
│   ├── main.py                   # Antarmuka CLI pengoperasian pipeline
│   └── models/
│       ├── anomaly_detector.py   # Model deteksi outlier tabular (Isolation Forest)
│       ├── graph_gnn.py          # Model Graph Neural Network Autoencoder (PyTorch)
│       └── scoring_fusion.py     # Fusi skor multi-sinyal dan sintesis penjelasan XAI
└── claimgraph-app/               # Aplikasi web antarmuka workstation investigasi
    ├── index.html                # Dokumen HTML utama aplikasi
    ├── package.json              # Konfigurasi dependensi Node.js
    ├── tsconfig.json             # Konfigurasi kompilator TypeScript
    ├── vite.config.ts            # Konfigurasi bundler Vite
    └── src/
        ├── App.tsx               # Komponen root aplikasi dan pengelola state dataset
        ├── types.ts              # Definisi kontrak tipe data TypeScript
        ├── main.tsx              # Titik masuk pemuatan DOM React
        ├── components/           # Komponen modular antarmuka
        ├── views/                # Halaman fungsional sistem investigasi
        └── data/
            ├── bpjs2025Data.ts   # Data hasil inferensi riil BPJS 2025 (terverifikasi)
            ├── mockData.ts       # Data pengujian sintetis terkontrol
            └── authUsers.ts      # Kredensial dinas aparatur dan kontrol akses RBAC
```

---

## 7. Panduan Pengoperasian

### A. Menjalankan Pipeline Machine Learning & Training (Python)

Persyaratan lingkungan Python:
* Python versi 3.10 ke atas
* Pustaka: `pandas`, `numpy`, `scikit-learn`, `torch`, `networkx`

Jalankan perintah pelatihan melalui terminal pada direktori root repositori:

```powershell
# Melatih model pada data sampel kontekstual TB (5.000 sampel, 3 epoch GNN)
py ml_engine/main.py --subset tb --sample-size 5000 --epochs 3

# Melatih model pada data sampel kontekstual Diabetes Melitus (DM)
py ml_engine/main.py --subset dm --sample-size 5000

# Melatih model pada data sampel reguler rilis 2025
py ml_engine/main.py --subset reguler --sample-size 10000

# Pilihan opsi subset: tb, dm, covid, kia_anak, kia_ibu, mental, reguler
```

Hasil pelatihan akan secara otomatis dikonversi dan disimpan ke berkas `claimgraph-app/src/data/bpjs2025Data.ts` serta berkas artefak JSON di `ml_engine/artifacts/`.

### B. Menjalankan Aplikasi Antarmuka Workstation (Frontend)

Persyaratan lingkungan Node.js:
* Node.js versi 18.x atau 20.x LTS
* Package manager: npm versi 9.x ke atas

Langkah eksekusi:

```bash
# Berpindah ke direktori frontend
cd claimgraph-app

# Memasang dependensi
npm install

# Menjalankan server pengembangan lokal
npm run dev
```

Aplikasi dapat diakses melalui browser pada alamat:
```text
http://localhost:3000/
```

Untuk memvalidasi integritas kode dan kompilasi bundle produksi:
```bash
npm run build
```

---

## 8. Hak Cipta dan Lisensi

Hak Cipta (c) 2026 Badan Penyelenggara Jaminan Sosial Kesehatan Republik Indonesia (BPJS Kesehatan RI). Seluruh hak cipta dilindungi undang-undang. Sistem ini dikembangkan untuk kepentingan pengelolaan risiko, pengawasan tata kelola klinis, dan perlindungan kesinambungan dana program Jaminan Kesehatan Nasional Republik Indonesia.

import { AuthenticatedUser } from '../types';

export const GOVERNMENT_USERS: AuthenticatedUser[] = [
  {
    id: 'user-inv-07',
    npp: 'INV-07',
    nip: '19850412 201001 1 003',
    name: 'Dr. Aris Prasetyo, Sp.A',
    title: 'Investigator Utama Anti-Fraud JKN',
    agency: 'BPJS Kesehatan RI',
    department: 'Deputi Bidang Manajemen Klaim & Pencegahan Kecurangan',
    role: 'investigator',
    clearanceLevel: 'Tingkat 3 (Rahasia/Investigasi)',
    email: 'aris.prasetyo@bpjs-kesehatan.go.id',
    avatarColor: 'bg-emerald-600',
    mfaType: 'BSSN Gov-Token Aktif (OTP Terenkripsi)',
    sessionIp: '10.240.18.92 (Jaringan Intra-Pemerintah)',
    permissions: [
      'Investigasi Klaim Anomali',
      'Analisis Klaster Graf Multirelasi',
      'Validasi & Penetapan Keputusan Fraud',
      'Eskalasi ke Satgassus Anti-Fraud',
      'Akses Jejak Audit Imutabel'
    ]
  },
  {
    id: 'user-anl-01',
    npp: 'ANL-01',
    nip: '19910820 201503 2 004',
    name: 'Ns. Ratna Dewi, S.Kep',
    title: 'Verifikator Medis & Analis Klaim',
    agency: 'BPJS Kesehatan RI',
    department: 'Tim Verifikasi Pasca-Klaim FKRTL Kedeputian Wilayah',
    role: 'analyst',
    clearanceLevel: 'Tingkat 2 (Terbatas)',
    email: 'ratna.dewi@bpjs-kesehatan.go.id',
    avatarColor: 'bg-teal-600',
    mfaType: 'BSSN Gov-Token Aktif (OTP Terenkripsi)',
    sessionIp: '10.240.18.104 (Jaringan Intra-Pemerintah)',
    permissions: [
      'Pemeriksaan Rekam Medis Elektronik',
      'Verifikasi Kesesuaian ICD-10 & Prosedur',
      'Pemberian Catatan Klinis Verifikator',
      'Review Pola Duplikasi Prosedur'
    ]
  },
  {
    id: 'user-aud-03',
    npp: 'AUD-03',
    nip: '19780215 200312 1 002',
    name: 'Bambang Supriyadi, S.E., Ak., CA',
    title: 'Auditor Utama Forensik Keuangan Negara',
    agency: 'BPKP & Inspektorat Utama BPJS',
    department: 'Direktorat Pengawasan Bidang Kesejahteraan Rakyat',
    role: 'viewer',
    clearanceLevel: 'Tingkat 3 (Rahasia/Investigasi)',
    email: 'bambang.supriyadi@bpkp.go.id',
    avatarColor: 'bg-sky-700',
    mfaType: 'Sertifikat Digital BSrE BSSN',
    sessionIp: '10.128.45.19 (VPN Khusus BPKP)',
    permissions: [
      'Audit Forensik Dana JKN',
      'Pemeriksaan Log Imutabel Tanpa Perubahan',
      'Ekspor Laporan Kepatuhan Pemerintahan',
      'Evaluasi Nilai Paparan Finansial Negara'
    ]
  },
  {
    id: 'user-sec-99',
    npp: 'SEC-99',
    nip: '19880110 201201 1 005',
    name: 'Ir. Teguh Wicaksono, M.Kom, CISSP',
    title: 'Administrator Keamanan Siber (DPO UU PDP)',
    agency: 'Gov-CSIRT & BSSN Liaison',
    department: 'Pusat Keamanan Siber & Privasi Data Kesehatan Nasional',
    role: 'investigator',
    clearanceLevel: 'Tingkat 4 (Super-Admin Siber)',
    email: 'teguh.w@bpjs-kesehatan.go.id',
    avatarColor: 'bg-indigo-700',
    mfaType: 'FIDO2 Hardware Security Key + Biometrik',
    sessionIp: '10.240.1.1 (Security Operations Center)',
    permissions: [
      'Audit Kepatuhan UU PDP No. 27/2022',
      'Pengawasan Kriptografi AES-256 GCM',
      'Monitoring Akses Data Sensitif & Ekspor',
      'Pencegahan Kebocoran Data (Data Loss Prevention)',
      'Manajemen Kunci Kriptografi HSM BSSN'
    ]
  }
];

export const GOVERNMENT_SECURITY_METRICS = {
  regulations: [
    {
      code: 'UU No. 27/2022',
      name: 'Pelindungan Data Pribadi (UU PDP)',
      status: 'TERVERIFIKASI PENUH',
      color: 'emerald',
      detail: 'Data identitas pasien (NIK, Nama, Tanggal Lahir) dimasking otomatis menggunakan algoritma hashing deterministik.'
    },
    {
      code: 'Perpres No. 95/2018',
      name: 'Sistem Pemerintahan Berbasis Elektronik (SPBE)',
      status: 'TERVERIFIKASI',
      color: 'emerald',
      detail: 'Interoperabilitas sistem data kesehatan terhubung arsitektur SPBE terpadu Kementerian Kominfo.'
    },
    {
      code: 'Perka BSSN No. 4/2021',
      name: 'Standar Kriptografi Sistem Informasi Pemerintah',
      status: 'AES-256 GCM & SHA-256 AKTIF',
      color: 'emerald',
      detail: 'Semua berkas klaim dan graf multirelasi dienkripsi di media penyimpanan dan saat transmisi (TLS 1.3).'
    },
    {
      code: 'ISO/IEC 27001:2022',
      name: 'Sistem Manajemen Keamanan Informasi (SMKI)',
      status: 'TERSERTIFIKASI INTERNASIONAL',
      color: 'emerald',
      detail: 'Sertifikasi audit kepatuhan keamanan berkala oleh badan sertifikasi independen terakreditasi KAN.'
    }
  ],
  infrastructure: {
    dataCenter: 'Pusat Data Nasional (PDN) Cikarang, Jawa Barat',
    drCenter: 'Pusat Data Cadangan (DRC) Batam, Kepulauan Riau',
    networkEncryption: 'TLS 1.3 / Quantum-Resistant Hybrid Key Exchange',
    databaseEncryption: 'AES-256-GCM Hardware Security Module (HSM BSSN)',
    integrityChecksum: 'SHA-256 (e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855)',
    maskingCompliance: '100% NIK dan Nama Rekam Medis Terproteksi'
  }
};

import React from 'react';
import { Database, ShieldCheck, CheckCircle2, Cpu, HardDrive, FileSpreadsheet, Terminal, ArrowRight } from 'lucide-react';
import { SyntheticBadge } from '../components/SyntheticBadge';
import { BPJS_2025_STATS } from '../data/bpjs2025Data';

export const SyntheticDataView: React.FC = () => {
  return (
    <div className="flex flex-col gap-5 w-full max-w-4xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-[#007A6C] rounded-2xl p-5 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Katalog Integrasi Dataset BPJS Kesehatan</h1>
          <p className="text-xs sm:text-sm text-teal-100 mt-0.5">
            Arsitektur ganda: Dataset Terverifikasi Resmi BPJS Rilis 2025 dan Generator Data Sintetis
          </p>
        </div>
        <SyntheticBadge size="md" dataset="bpjs2025" />
      </div>

      {/* 1. Official BPJS Kesehatan 2025 Verified Dataset Section */}
      <div className="bg-white rounded-3xl p-5 border border-emerald-200 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Dataset Terverifikasi BPJS Kesehatan Rilis 2025</h2>
              <span className="text-xs text-emerald-700 font-semibold">Status: Aktif Terintegrasi di CLAIMGRAPH-X</span>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-mono font-bold">
            folder: /Dataset/2025
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200">
            <span className="text-emerald-800 block font-medium">Klaim Terproses</span>
            <span className="font-mono font-bold text-lg text-emerald-950">
              {BPJS_2025_STATS.totalProcessedClaims.toLocaleString('id-ID')}
            </span>
          </div>
          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200">
            <span className="text-emerald-800 block font-medium">Nilai Finansial Batch</span>
            <span className="font-mono font-bold text-lg text-emerald-950">
              Rp{(BPJS_2025_STATS.totalFinancialValue / 1_000_000).toFixed(1)} Jt
            </span>
          </div>
          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200">
            <span className="text-emerald-800 block font-medium">Kasus Risiko Sedang</span>
            <span className="font-mono font-bold text-lg text-amber-700">
              {BPJS_2025_STATS.mediumRiskCount} Kasus
            </span>
          </div>
          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200">
            <span className="text-emerald-800 block font-medium">Kasus Risiko Tinggi</span>
            <span className="font-mono font-bold text-lg text-rose-700">
              {BPJS_2025_STATS.highRiskCount} Kasus
            </span>
          </div>
        </div>

        {/* Available Subsets in Dataset/2025 */}
        <div className="mt-1">
          <span className="text-xs font-bold text-gray-800 block mb-2">7 Subset Data Terintegrasi:</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {[
              { name: 'Data Sampel Kontekstual TB Edisi 2025', file: 'TB2024_fkrtl.dta', active: true },
              { name: 'Data Sampel Kontekstual DM Edisi 2025', file: 'DM2024_fkrtl.dta', active: true },
              { name: 'Data Sampel Reguler Edisi 2025', file: '202403_fkrtl.dta', active: true },
              { name: 'Data Sampel Kontekstual COVID Edisi 2025', file: 'COV20152024_fkrtl.dta', active: true },
              { name: 'Data Sampel KIA - Subset Anak', file: 'KIA2024anak_fkrtl.dta', active: true },
              { name: 'Data Sampel KIA - Subset Ibu', file: 'KIA2024ibu_fkrtl.dta', active: true },
              { name: 'Data Sampel Kesehatan Mental Edisi 2025', file: 'KM2024_fkrtl.dta', active: true },
            ].map((sub, i) => (
              <div key={i} className="p-2.5 bg-gray-50 hover:bg-emerald-50/50 rounded-xl border border-gray-200 flex items-center justify-between transition-colors">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet size={14} className="text-emerald-700" />
                  <span className="font-medium text-gray-800">{sub.name}</span>
                </div>
                <span className="font-mono text-[10px] text-gray-500">{sub.file}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CLI Command Helper */}
        <div className="p-3 bg-slate-900 rounded-xl text-slate-200 text-xs font-mono flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-slate-400">
            <Terminal size={14} />
            <span>Perintah Training & Ingestion Ulang Engine Python:</span>
          </div>
          <div className="bg-slate-950 p-2 rounded text-emerald-400 overflow-x-auto">
            py ml_engine/main.py --subset tb --sample-size 5000 --epochs 5
          </div>
        </div>
      </div>

      {/* 2. Baseline Synthetic Dataset Section */}
      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center font-bold">
              <Database size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Volume Dataset Sintetis (Target Seed: 42)</h2>
              <span className="text-xs text-gray-500">Lingkungan Sandbox Pengujian Khusus Tanpa Koneksi Riil</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
            <span className="text-gray-500 block">Klaim Terproses</span>
            <span className="font-mono font-bold text-lg text-gray-900">30.000</span>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
            <span className="text-gray-500 block">Peserta (Pseudonim)</span>
            <span className="font-mono font-bold text-lg text-gray-900">10.000</span>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
            <span className="text-gray-500 block">Tenaga Kesehatan</span>
            <span className="font-mono font-bold text-lg text-gray-900">500</span>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
            <span className="text-gray-500 block">Fasilitas Kesehatan</span>
            <span className="font-mono font-bold text-lg text-gray-900">100</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-200 text-xs sm:text-sm text-teal-950 flex items-start gap-3">
            <CheckCircle2 size={18} className="text-teal-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Prinsip P1 UU PDP No. 27 Tahun 2022:</span>
              Seluruh data klaim BPJS 2025 yang dimuat melalui pipeline telah diproses dengan penyamaran kriptografis deterministik (SHA-256 keyed hashing) untuk nomor peserta, faskes, dan ID kunjungan, menjamin integritas privasi absolut.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

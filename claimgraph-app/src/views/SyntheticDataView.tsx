import React from 'react';
import { Database, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { SyntheticBadge } from '../components/SyntheticBadge';

export const SyntheticDataView: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 w-full max-w-4xl mx-auto pb-12">
      <div className="bg-[#007A6C] rounded-2xl p-5 text-white shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Katalog Data Sintetis (FHIR-Aligned)</h1>
          <p className="text-xs sm:text-sm text-teal-100 mt-0.5">
            Arsitektur generator data sintetis terkontrol 100% privasi tanpa data riil peserta JKN
          </p>
        </div>
        <SyntheticBadge size="md" />
      </div>

      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm flex flex-col gap-4">
        <h2 className="text-base font-bold text-gray-900">Volume Dataset Sintetis (Target Seed: 42)</h2>

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

        <div className="mt-2 space-y-3">
          <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-200 text-xs sm:text-sm text-teal-950 flex items-start gap-3">
            <CheckCircle2 size={18} className="text-teal-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Prinsip P1 Synthetic Only:</span>
              Seluruh NIK, nama, alamat, nomor telepon, dan nomor rekam medis digenerate secara sintetis menggunakan sebaran realistis non-uniform sesuai standar resmi BPJS Kesehatan RI.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { BarChart3, AlertCircle, ShieldCheck, CheckCircle2, Layers } from 'lucide-react';
import { EVALUATION_METRICS } from '../data/mockData';
import { SyntheticBadge } from '../components/SyntheticBadge';

export const EvaluationView: React.FC = () => {
  const m = EVALUATION_METRICS;

  return (
    <div className="flex flex-col gap-5 w-full max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-[#007A6C] rounded-2xl p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Evaluasi Model (Data Sintetis)
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-teal-100">
            Metrik kinerja model deteksi multi-sinyal pada lingkungan evaluasi sintetis terkontrol
          </p>
        </div>
        <div className="self-start sm:self-auto">
          <SyntheticBadge size="md" />
        </div>
      </div>

      {/* Mandatory Disclaimer Note (PRD Section 12 & Appendix A) */}
      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-3">
        <AlertCircle size={20} className="text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block mb-0.5">Catatan Evaluasi Sintetis:</span>
          Hasil ini berasal dari data sintetis dengan pola yang disuntikkan dan bukan estimasi kinerja pada data JKN riil. Pengujian dilakukan dengan temporal split bulan 1-6 (latih), 7-8 (validasi), dan 9-10 (uji).
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col">
          <span className="text-xs text-gray-500 font-medium">Precision (Sintetis)</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#008272] mt-1 font-mono">
            {(m.summary.precision * 100).toFixed(1)}%
          </span>
          <span className="text-[11px] text-gray-400 mt-1">Akurasi deteksi positif</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col">
          <span className="text-xs text-gray-500 font-medium">Recall (Sintetis)</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#0284C7] mt-1 font-mono">
            {(m.summary.recall * 100).toFixed(1)}%
          </span>
          <span className="text-[11px] text-gray-400 mt-1">Cakupan kasus terinjeksi</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col">
          <span className="text-xs text-gray-500 font-medium">F1-Score (Sintetis)</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-indigo-600 mt-1 font-mono">
            {(m.summary.f1Score * 100).toFixed(1)}%
          </span>
          <span className="text-[11px] text-gray-400 mt-1">Keseimbangan harmonik</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col">
          <span className="text-xs text-gray-500 font-medium">PR-AUC (Sintetis)</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1 font-mono">
            {m.summary.prAuc.toFixed(3)}
          </span>
          <span className="text-[11px] text-gray-400 mt-1">Area di bawah kurva PR</span>
        </div>
      </div>

      {/* Potential Exposure Flagged Card */}
      <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">
            Potential Claim Exposure (Synthetic Evaluation)
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-0.5 font-mono">
            Rp{(m.summary.potentialExposureIdentified / 1000000000).toFixed(2)} Miliar
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Total nilai klaim berisiko teridentifikasi pada dataset evaluasi sintetis 30.000 klaim (bukan klaim penghematan riil).
          </p>
        </div>

        <div className="px-3.5 py-2 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold shrink-0">
          {m.summary.injectedCasesFound} dari {m.summary.injectedCasesTotal} pola ditemukan
        </div>
      </div>

      {/* Ablation Study Table (PRD Section 12) */}
      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Layers size={18} className="text-[#008272]" />
          <h2 className="text-base font-bold text-gray-900">
            Ablation Study: Perbandingan Kontribusi Komponen Sinyal
          </h2>
        </div>
        <p className="text-xs text-gray-500">
          Membuktikan bahwa fusi multi-sinyal (Aturan + Tabular ML + Graf Jaringan) secara signifikan mengungguli model tunggal.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600">
                <th className="p-3 font-semibold">Varian Komponen</th>
                <th className="p-3 font-semibold">Precision</th>
                <th className="p-3 font-semibold">Recall</th>
                <th className="p-3 font-semibold">F1-Score</th>
                <th className="p-3 font-semibold">PR-AUC</th>
              </tr>
            </thead>
            <tbody>
              {m.ablation.map((row, idx) => (
                <tr
                  key={idx}
                  className={`border-b border-gray-100 ${
                    row.isBest ? 'bg-emerald-50/70 font-semibold text-emerald-950' : 'hover:bg-gray-50'
                  }`}
                >
                  <td className="p-3 flex items-center gap-2">
                    {row.isBest && <CheckCircle2 size={15} className="text-emerald-700 shrink-0" />}
                    <span>{row.component}</span>
                  </td>
                  <td className="p-3 font-mono">{(row.precision * 100).toFixed(1)}%</td>
                  <td className="p-3 font-mono">{(row.recall * 100).toFixed(1)}%</td>
                  <td className="p-3 font-mono">{(row.f1 * 100).toFixed(1)}%</td>
                  <td className="p-3 font-mono">{row.prAuc.toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Precision@K Table (PRD Section 12) */}
      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm flex flex-col gap-3">
        <h2 className="text-base font-bold text-gray-900">
          Metrik Prioritas Antrean: Precision@K & Recall@K
        </h2>
        <p className="text-xs text-gray-500">
          Menilai keefektifan urutan pemeriksaan investigator: 10 klaim teratas memiliki precision 100% tanpa positif palsu.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600">
                <th className="p-3 font-semibold">Ambang K Teratas</th>
                <th className="p-3 font-semibold">Precision@K</th>
                <th className="p-3 font-semibold">Recall@K</th>
                <th className="p-3 font-semibold">Positif Palsu (FP)</th>
              </tr>
            </thead>
            <tbody>
              {m.precisionAtK.map((row) => (
                <tr key={row.k} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-3 font-bold font-mono">Top {row.k} Klaim</td>
                  <td className="p-3 font-mono text-emerald-700 font-bold">
                    {(row.precision * 100).toFixed(1)}%
                  </td>
                  <td className="p-3 font-mono">{(row.recall * 100).toFixed(1)}%</td>
                  <td className="p-3 font-mono text-gray-600">{row.falsePositives}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

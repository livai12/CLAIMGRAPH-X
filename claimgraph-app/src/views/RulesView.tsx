import React from 'react';
import { CheckSquare, Shield } from 'lucide-react';
import { DETECTION_RULES } from '../data/mockData';

export const RulesView: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 w-full max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-[#007A6C] rounded-2xl p-5 text-white shadow-sm">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Katalog Aturan Deteksi (Rule Engine)</h1>
        <p className="text-xs sm:text-sm text-teal-100 mt-0.5">
          10 aturan deterministik berbasis pedoman klaim JKN dan parameter konfigurasi versi r12
        </p>
      </div>

      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-3.5">
          {DETECTION_RULES.map((rule) => (
            <div
              key={rule.ruleId}
              className="p-4 rounded-2xl bg-gray-50/70 border border-gray-200 flex flex-col sm:flex-row sm:items-start justify-between gap-3"
            >
              <div className="flex items-start gap-3 flex-1">
                <span className="w-9 h-9 rounded-xl bg-teal-100 text-teal-900 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {rule.ruleId.split('-')[1]}
                </span>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-gray-900">{rule.name}</span>
                    <span className="font-mono text-xs text-gray-500 font-semibold">
                      ({rule.ruleId})
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">{rule.logic}</p>

                  <div className="mt-2 p-2 bg-white rounded-lg border border-gray-200 text-xs text-gray-700 italic">
                    &ldquo;{rule.template}&rdquo;
                  </div>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-200">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    rule.strength === 'Kuat'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  Kekuatan: {rule.strength}
                </span>

                <span className="text-xs font-mono font-semibold text-gray-500">
                  Bobot: {rule.weight}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

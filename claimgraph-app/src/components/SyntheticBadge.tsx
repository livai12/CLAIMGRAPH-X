import React from 'react';
import { Database, CheckCircle2, RefreshCw } from 'lucide-react';

interface SyntheticBadgeProps {
  size?: 'sm' | 'md';
  dataset?: 'bpjs2025' | 'synthetic';
  onToggle?: () => void;
}

export const SyntheticBadge: React.FC<SyntheticBadgeProps> = ({ 
  size = 'sm', 
  dataset = 'bpjs2025',
  onToggle 
}) => {
  const isBpjs = dataset === 'bpjs2025';

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`inline-flex items-center gap-1.5 font-bold rounded-lg border transition-all cursor-pointer ${
        size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm'
      } ${
        isBpjs
          ? 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-800 shadow-2xs'
          : 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-900 shadow-2xs'
      }`}
      title={
        isBpjs
          ? 'Dataset Aktif: Resmi BPJS Kesehatan Rilis 2025 (Terverifikasi). Klik untuk alih ke mode demo sintetis.'
          : 'Dataset Aktif: Demo Sintetis FHIR. Klik untuk alih ke dataset terverifikasi BPJS 2025.'
      }
    >
      {isBpjs ? (
        <CheckCircle2 size={size === 'sm' ? 13 : 15} className="text-emerald-600" />
      ) : (
        <Database size={size === 'sm' ? 13 : 15} className="text-amber-600" />
      )}
      <span className="tracking-wide">
        {isBpjs ? 'BPJS 2025 TERVERIFIKASI' : 'DATA SINTETIS (DEMO)'}
      </span>
      {onToggle && (
        <RefreshCw size={11} className="opacity-60 hover:opacity-100 transition-opacity ml-0.5" />
      )}
    </button>
  );
};

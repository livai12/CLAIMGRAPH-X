import React from 'react';
import { Info } from 'lucide-react';

interface RiskNoticeProps {
  customText?: string;
  className?: string;
}

export const RiskNotice: React.FC<RiskNoticeProps> = ({ 
  customText = "Skor ini menentukan urutan pemeriksaan. Ini bukan pernyataan bahwa kecurangan terjadi.",
  className = ""
}) => {
  return (
    <div
      className={`flex items-start gap-3 p-3.5 rounded-lg border ${className}`}
      style={{
        backgroundColor: '#F0F7F6',
        borderColor: '#C7E4DD',
        color: 'var(--text)',
      }}
      role="note"
      aria-label="Pemberitahuan Etika dan Kepatuhan Risiko"
    >
      <Info size={18} className="shrink-0 mt-0.5" style={{ color: 'var(--bpjs-teal)' }} />
      <div className="text-xs sm:text-sm leading-relaxed" style={{ color: '#1B4D3E' }}>
        <span className="font-semibold block mb-0.5">Pemberitahuan Investigasi:</span>
        {customText}
      </div>
    </div>
  );
};

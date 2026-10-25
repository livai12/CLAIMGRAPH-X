import React from 'react';
import { ShieldAlert, AlertTriangle, ShieldCheck } from 'lucide-react';
import { RiskLevel } from '../types';

interface RiskChipProps {
  score?: number;
  level?: RiskLevel;
  showIcon?: boolean;
  variant?: 'pill' | 'badge' | 'hero';
}

export const RiskChip: React.FC<RiskChipProps> = ({
  score,
  level,
  showIcon = true,
  variant = 'pill',
}) => {
  const calculatedLevel = level || (score !== undefined ? (score >= 75 ? 'HIGH' : score >= 50 ? 'MEDIUM' : 'LOW') : 'LOW');

  let label = 'Risiko Rendah';
  let Icon = ShieldCheck;
  let color = '#059669';
  let badgeBg = '#ECFDF5';
  let badgeBorder = '#A7F3D0';
  let topBarColor = '#059669';

  if (calculatedLevel === 'HIGH') {
    label = 'Risiko Tinggi';
    Icon = ShieldAlert;
    color = '#DC2626';
    badgeBg = '#FEF2F2';
    badgeBorder = '#FECACA';
    topBarColor = '#DC2626';
  } else if (calculatedLevel === 'MEDIUM') {
    label = 'Risiko Sedang';
    Icon = AlertTriangle;
    color = '#D97706';
    badgeBg = '#FFFBEB';
    badgeBorder = '#FDE68A';
    topBarColor = '#D97706';
  }

  // 1. HERO VARIANT (Replaces the awkward transparent red card with a proper, solid, premium score card)
  if (variant === 'hero' && score !== undefined) {
    return (
      <div 
        className="relative flex flex-col items-center justify-center w-24 h-24 rounded-2xl bg-white border border-gray-200/90 shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden shrink-0"
      >
        {/* Top colored indicator bar */}
        <div 
          className="w-full h-1.5 absolute top-0 left-0 right-0"
          style={{ backgroundColor: topBarColor }}
        />
        
        <div className="flex items-baseline gap-0.5 mt-1.5">
          <span 
            className="text-3xl font-black font-sans tracking-tight"
            style={{ color }}
          >
            {score}
          </span>
          <span className="text-[11px] font-bold text-gray-400">/100</span>
        </div>

        <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mt-0.5">
          Skor Risiko
        </span>

        <div 
          className="mt-1 flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border"
          style={{ backgroundColor: badgeBg, borderColor: badgeBorder, color }}
        >
          {showIcon && <Icon size={11} strokeWidth={2.4} />}
          <span>{label}</span>
        </div>
      </div>
    );
  }

  // 2. BADGE VARIANT (Used in list items)
  if (variant === 'badge' && score !== undefined) {
    return (
      <div 
        className="inline-flex flex-col items-center justify-center w-12 h-12 rounded-xl font-bold border shadow-2xs font-sans shrink-0"
        style={{
          backgroundColor: badgeBg,
          borderColor: badgeBorder,
          color,
        }}
      >
        <span className="text-base font-extrabold leading-none">{score}</span>
        <span className="text-[8px] font-bold uppercase tracking-wider opacity-70 mt-0.5">Skor</span>
      </div>
    );
  }

  // 3. PILL VARIANT
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border shadow-2xs"
      style={{
        backgroundColor: badgeBg,
        borderColor: badgeBorder,
        color,
      }}
    >
      {showIcon && <Icon size={13} strokeWidth={2.2} />}
      {score !== undefined ? `${score} • ${label}` : label}
    </span>
  );
};

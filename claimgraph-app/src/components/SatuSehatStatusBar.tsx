import React from 'react';
import { Wifi, Battery, Signal, Share2 } from 'lucide-react';

export const MobileStatusBar: React.FC = () => {
  return (
    <div className="w-full flex items-center justify-between px-6 pt-2 pb-1 text-gray-800 text-xs font-semibold select-none z-30">
      <div className="font-bold tracking-tight text-[13px]">12.34</div>
      <div className="flex items-center gap-1.5 text-gray-700">
        <Signal size={13} strokeWidth={2.5} />
        <span className="text-[10px] font-bold tracking-tight">LTE</span>
        <Wifi size={13} strokeWidth={2.5} />
        <Battery size={15} strokeWidth={2.2} className="fill-gray-700" />
      </div>
    </div>
  );
};

export const SatuSehatStatusBar = MobileStatusBar;

export const ClaimGraphLogo: React.FC<{ size?: 'sm' | 'md' | 'lg'; showText?: boolean }> = ({ 
  size = 'md',
  showText = true 
}) => {
  const dim = size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-9 h-9' : 'w-7 h-7';
  const iconSize = size === 'sm' ? 14 : size === 'lg' ? 20 : 16;

  return (
    <div className="flex items-center gap-2">
      {/* Authentic ClaimGraph-X Logo (Teal Network Squircle) */}
      <div 
        className={`${dim} rounded-xl bg-gradient-to-tr from-[#008272] to-[#00A99D] text-white flex items-center justify-center shadow-xs shrink-0 border border-white/40`}
      >
        <Share2 size={iconSize} strokeWidth={2.5} />
      </div>
      {showText && (
        <div className="flex flex-col leading-tight">
          <span className="text-xs font-black text-gray-900 tracking-tight font-sans">
            CLAIMGRAPH<span className="text-[#008272]">-X</span>
          </span>
          <span className="text-[9px] text-gray-500 font-semibold tracking-tight">BPJS Kesehatan JKN</span>
        </div>
      )}
    </div>
  );
};

// Backwards compatibility alias
export const SatuSehatLogo = ClaimGraphLogo;

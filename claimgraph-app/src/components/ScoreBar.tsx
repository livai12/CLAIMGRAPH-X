import React from 'react';
import { SignalScores } from '../types';
import { FileText, BarChart3, Share2, Clock } from 'lucide-react';

interface ScoreBarProps {
  signals: SignalScores;
  onOpenStatistics?: () => void;
  onOpenGraph?: () => void;
  onOpenRules?: () => void;
}

export const ScoreBar: React.FC<ScoreBarProps> = ({ 
  signals, 
  onOpenStatistics, 
  onOpenGraph, 
  onOpenRules 
}) => {
  const items = [
    {
      id: 'rules',
      label: 'Aturan',
      val: signals.ruleScore,
      max: 30,
      icon: FileText,
      color: '#0284C7',
      bg: '#E0F2FE',
      onClick: onOpenRules,
      tooltip: 'Buka aturan deteksi medis',
    },
    {
      id: 'statistics',
      label: 'Statistik',
      val: signals.statisticalScore,
      max: 25,
      icon: BarChart3,
      color: '#008272',
      bg: '#E0F2EF',
      onClick: onOpenStatistics,
      tooltip: 'Buka halaman statistik klaim terlaporkan',
    },
    {
      id: 'graph',
      label: 'Graf',
      val: signals.graphScore,
      max: 25,
      icon: Share2,
      color: '#0D9488',
      bg: '#CCFBF1',
      onClick: onOpenGraph,
      tooltip: 'Buka diagram jaringan graf',
    },
    {
      id: 'time',
      label: 'Waktu',
      val: signals.temporalScore,
      max: 20,
      icon: Clock,
      color: '#16A34A',
      bg: '#DCFCE7',
      onClick: undefined,
      tooltip: 'Kronologi urutan waktu',
    },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-2.5">
        <span>Empat sinyal yang membentuk skor</span>
        <span className="text-[10px] text-teal-700 font-medium hidden sm:inline">
          (Klik untuk telusuri)
        </span>
      </div>
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {items.map((item) => {
          const Icon = item.icon;
          const pct = Math.min(100, Math.round((item.val / item.max) * 100));
          const isClickable = Boolean(item.onClick);

          return (
            <div 
              key={item.label} 
              onClick={item.onClick}
              title={item.tooltip}
              className={`flex flex-col rounded-lg p-1 transition-all ${
                isClickable 
                  ? 'cursor-pointer hover:bg-gray-50 active:scale-95' 
                  : ''
              }`}
            >
              <div className="flex items-center gap-1 text-xs font-medium text-gray-600 mb-1">
                <Icon size={12} style={{ color: item.color }} />
                <span className={`truncate ${isClickable ? 'hover:underline' : ''}`}>{item.label}</span>
              </div>
              <div
                className="w-full h-1.5 rounded-full overflow-hidden mb-1"
                style={{ backgroundColor: 'var(--border)' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
              <div className="text-xs font-bold" style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
                {item.val}<span className="text-gray-400 font-normal">/{item.max}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

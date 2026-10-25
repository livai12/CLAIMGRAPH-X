import React from 'react';
import { 
  Home, 
  ListChecks, 
  Search, 
  Share2, 
  User, 
  ClipboardCheck, 
  BarChart3, 
  History, 
  CheckSquare, 
  Building2, 
  Database,
  FileText
} from 'lucide-react';
import { Role } from '../types';

interface NavigationProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  currentRole: Role;
  mode: 'mobile-bar' | 'desktop-sidebar';
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onTabChange,
  currentRole,
  mode,
}) => {
  if (mode === 'mobile-bar') {
    return (
      <nav className="sticky bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-3 py-2 flex items-center justify-around w-full">
        {/* Beranda */}
        <button
          onClick={() => onTabChange('dashboard')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            currentTab === 'dashboard' ? 'text-[#00A99D] font-bold' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Home size={20} strokeWidth={currentTab === 'dashboard' ? 2.5 : 1.8} />
          <span className="text-[10px] tracking-tight">Beranda</span>
        </button>

        {/* Antrean */}
        <button
          onClick={() => onTabChange('queue')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all relative ${
            currentTab === 'queue' ? 'text-[#00A99D] font-bold' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <ListChecks size={20} strokeWidth={currentTab === 'queue' ? 2.5 : 1.8} />
          <span className="text-[10px] tracking-tight">Antrean</span>
          <span className="absolute -top-0.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
        </button>

        {/* Center Periksa Button */}
        <button
          onClick={() => onTabChange('claim')}
          className="flex flex-col items-center -mt-6 group"
          title="Periksa Klaim Prioritas C-10291"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#00A99D] to-[#00B4D8] text-white flex items-center justify-center shadow-lg shadow-teal-500/30 group-hover:scale-105 transition-all group-active:scale-95 border-3 border-white">
            <Search size={21} strokeWidth={2.6} />
          </div>
          <span className="text-[10px] font-bold text-[#00A99D] mt-0.5">Periksa</span>
        </button>

        {/* Graf */}
        <button
          onClick={() => onTabChange('graph')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            currentTab === 'graph' ? 'text-[#00A99D] font-bold' : 'text-gray-400 hover:text-gray-600'
          }`}
          title="Diagram Jaringan Graf"
        >
          <Share2 size={20} strokeWidth={currentTab === 'graph' ? 2.5 : 1.8} />
          <span className="text-[10px] tracking-tight">Graf</span>
        </button>

        {/* Statistik */}
        <button
          onClick={() => onTabChange('statistics')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            currentTab === 'statistics' ? 'text-[#00A99D] font-bold' : 'text-gray-400 hover:text-gray-600'
          }`}
          title="Statistik Klaim Terlaporkan"
        >
          <BarChart3 size={20} strokeWidth={currentTab === 'statistics' ? 2.5 : 1.8} />
          <span className="text-[10px] tracking-tight">Statistik</span>
        </button>
      </nav>
    );
  }

  // Desktop Sidebar (232px width) as specified in PRD Section 6.5
  const navItems = [
    { id: 'dashboard', label: 'Ringkasan', icon: Home, roles: ['investigator', 'analyst', 'viewer'] },
    { id: 'queue', label: 'Antrean Risiko', icon: ListChecks, roles: ['investigator', 'analyst'] },
    { id: 'claim', label: 'Detail Klaim (C-10291)', icon: FileText, roles: ['investigator', 'analyst'] },
    { id: 'graph', label: 'Jaringan Risiko', icon: Share2, roles: ['investigator', 'analyst'] },
    { id: 'statistics', label: 'Statistik Klaim', icon: BarChart3, roles: ['investigator', 'analyst', 'viewer'] },
    { id: 'investigation', label: 'Investigasi', icon: ClipboardCheck, roles: ['investigator', 'analyst'] },
    { id: 'evaluation', label: 'Evaluasi Model', icon: Database, roles: ['investigator', 'analyst', 'viewer'] },
    { id: 'audit', label: 'Jejak Audit', icon: History, roles: ['investigator', 'analyst'] },
    { id: 'rules', label: 'Aturan Deteksi', icon: CheckSquare, roles: ['investigator', 'analyst'] },
    { id: 'facilities', label: 'Kelompok Sebaya', icon: Building2, roles: ['investigator', 'analyst', 'viewer'] },
    { id: 'synthetic', label: 'Data Sintetis', icon: Database, roles: ['investigator', 'analyst', 'viewer'] },
  ];

  return (
    <aside className="w-60 bg-white border-r border-gray-200 flex flex-col shrink-0 select-none">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#008272] text-white flex items-center justify-center font-bold font-serif text-lg">
            C
          </div>
          <div>
            <h2 className="font-serif font-bold text-gray-900 text-sm tracking-tight">CLAIMGRAPH-X</h2>
            <p className="text-[10px] text-gray-500 font-mono">JKN Risk Intelligence</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {navItems
          .filter((item) => item.roles.includes(currentRole))
          .map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all relative ${
                  isActive
                    ? 'bg-[#E3ECE8] text-[#2F5D50]'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#2F5D50] rounded-r" />
                )}
                <Icon size={16} strokeWidth={isActive ? 2.2 : 1.8} />
                <span>{item.label}</span>
              </button>
            );
          })}
      </nav>

      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-6 h-6 rounded-full bg-[#008272] text-white flex items-center justify-center font-bold text-[10px]">
            {currentRole === 'investigator' ? 'INV' : currentRole === 'analyst' ? 'ANL' : 'VIW'}
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-bold text-gray-800 block truncate">
              {currentRole === 'investigator' ? 'INV-07 (Investigator)' : currentRole === 'analyst' ? 'Analis Risiko' : 'Eksekutif (Viewer)'}
            </span>
            <span className="text-[10px] text-gray-500">Peran aktif</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

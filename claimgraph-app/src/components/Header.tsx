import React, { useEffect, useRef, useState } from 'react';
import { 
  Search, 
  Smartphone, 
  Monitor, 
  ShieldCheck, 
  ChevronDown, 
  LogOut, 
  Lock, 
  KeyRound, 
  UserCheck, 
  Building2,
  FileCheck2
} from 'lucide-react';
import { AuthenticatedUser } from '../types';
import { GOVERNMENT_USERS } from '../data/authUsers';
import { SyntheticBadge } from './SyntheticBadge';

interface HeaderProps {
  currentUser: AuthenticatedUser;
  onSwitchUser: (user: AuthenticatedUser) => void;
  onOpenSecurityModal: () => void;
  onLogout: () => void;
  viewMode: 'mobile-mockup' | 'desktop-workstation';
  onViewModeChange: (mode: 'mobile-mockup' | 'desktop-workstation') => void;
  onSearchFocus?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onSwitchUser,
  onOpenSecurityModal,
  onLogout,
  viewMode,
  onViewModeChange,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Global `/` hotkey for search as required by PRD Section 6.5
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 px-3 sm:px-6 py-2 flex items-center justify-between gap-3 shadow-xs">
      {/* Brand Wordmark & Mode Switcher */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#008272] to-[#00A99D] text-white flex items-center justify-center font-serif font-bold text-lg shadow-sm">
            C
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-bold tracking-tight text-gray-900 font-serif leading-none">
              CLAIMGRAPH-X
            </span>
            <span className="text-[10px] text-gray-500 font-mono tracking-wider uppercase font-semibold">
              BPJS Kesehatan RI
            </span>
          </div>
        </div>

        {/* Prototype View Mode Switcher Toggle (Mobile Mockup vs Desktop Console) */}
        <div className="hidden lg:flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200 text-xs">
          <button
            onClick={() => onViewModeChange('mobile-mockup')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              viewMode === 'mobile-mockup'
                ? 'bg-white text-[#008272] shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="Tampilkan prototype dalam bingkai smartphone presisi sesuai rancangan CLAIMGRAPH-X.pdf"
          >
            <Smartphone size={14} />
            <span>Mode Mobile App (PDF)</span>
          </button>
          <button
            onClick={() => onViewModeChange('desktop-workstation')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              viewMode === 'desktop-workstation'
                ? 'bg-white text-[#008272] shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="Tampilkan prototype workstation desktop penuh sesuai spesifikasi PRD Section 6.5"
          >
            <Monitor size={14} />
            <span>Mode Desktop Console</span>
          </button>
        </div>
      </div>

      {/* Center Search Input */}
      <div className="hidden md:flex items-center relative max-w-xs w-full">
        <Search size={15} className="absolute left-3 text-gray-400" />
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Cari klaim (tekan '/' untuk fokus)..."
          className="w-full pl-8 pr-8 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#008272]"
        />
        <kbd className="absolute right-2 px-1.5 py-0.5 rounded bg-gray-200 text-[10px] text-gray-500 font-mono">
          /
        </kbd>
      </div>

      {/* Right Controls: Security Badge, Synthetic Badge & Authenticated Government User */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Government Security & UU PDP Verification Button */}
        <button
          onClick={onOpenSecurityModal}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all shadow-2xs cursor-pointer"
          title="Klik untuk membuka status verifikasi keamanan data pemerintah BSSN & UU PDP"
        >
          <ShieldCheck size={15} className="text-emerald-600" />
          <span className="hidden sm:inline">Terverifikasi BSSN</span>
          <span className="px-1.5 py-0.2 rounded bg-emerald-200/80 text-[10px] font-mono text-emerald-900">
            UU PDP
          </span>
        </button>

        <div className="hidden sm:block">
          <SyntheticBadge size="sm" />
        </div>

        {/* User Profile & Account Switcher Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs transition-colors cursor-pointer"
            aria-expanded={isDropdownOpen}
            aria-label="Menu akun kredensial dinas"
          >
            <div className={`w-7 h-7 rounded-lg ${currentUser.avatarColor} text-white flex items-center justify-center font-bold text-xs shadow-2xs shrink-0`}>
              {currentUser.npp.replace('-', '')}
            </div>
            <div className="text-left hidden md:block">
              <span className="block font-bold text-gray-900 leading-tight truncate max-w-[130px]">
                {currentUser.name}
              </span>
              <span className="block text-[10px] text-gray-500 font-mono">
                {currentUser.npp} • {currentUser.role}
              </span>
            </div>
            <ChevronDown size={14} className="text-gray-400" />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-gray-200 p-2 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
              {/* Current Active Account Header */}
              <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200/70 mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg ${currentUser.avatarColor} text-white flex items-center justify-center font-bold text-xs shadow-2xs`}>
                    {currentUser.npp.replace('-', '')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-extrabold text-gray-900 block truncate">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] text-emerald-800 font-bold block truncate">
                      {currentUser.title}
                    </span>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-emerald-200/60 flex items-center justify-between text-[10px] font-mono text-gray-600">
                  <span>NIP: {currentUser.nip}</span>
                  <span className="font-bold text-emerald-700 bg-white px-1.5 py-0.5 rounded border border-emerald-200">
                    {currentUser.clearanceLevel.split(' ')[0]}
                  </span>
                </div>
              </div>

              {/* Quick Switch to Any Other User */}
              <div className="px-2 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Ganti Akun Dinas Terverifikasi:
              </div>
              <div className="space-y-1 mb-2">
                {GOVERNMENT_USERS.filter((u) => u.id !== currentUser.id).map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      onSwitchUser(u);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-2.5 cursor-pointer"
                  >
                    <div className={`w-6 h-6 rounded-md ${u.avatarColor} text-white flex items-center justify-center font-bold text-[10px] shrink-0`}>
                      {u.npp.replace('-', '')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="font-bold text-gray-800 block truncate">
                        {u.name}
                      </span>
                      <span className="text-[10px] text-gray-500 block truncate">
                        {u.title}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-gray-100 space-y-1">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onOpenSecurityModal();
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-emerald-50 text-emerald-800 font-bold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <ShieldCheck size={14} className="text-emerald-600" />
                  <span>Audit Kepatuhan BSSN & UU PDP</span>
                </button>

                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onLogout();
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-700 font-bold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <LogOut size={14} className="text-rose-600" />
                  <span>Kunci Workstation / Ganti Akun</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

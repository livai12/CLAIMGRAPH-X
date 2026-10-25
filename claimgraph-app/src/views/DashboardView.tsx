import React, { useState } from 'react';
import { 
  ListChecks, 
  Share2, 
  ClipboardCheck, 
  FileText, 
  AlertTriangle, 
  Building2, 
  Users, 
  History, 
  BarChart3, 
  CheckSquare, 
  Database, 
  MoreHorizontal,
  ChevronRight,
  Bell,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  MessageCircle,
  X,
  ChevronDown
} from 'lucide-react';
import { Claim } from '../types';
import { ClaimGraphLogo } from '../components/SatuSehatStatusBar';

interface DashboardViewProps {
  claims: Claim[];
  onNavigate: (tab: string, claimId?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ claims, onNavigate }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showMoreModal, setShowMoreModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Top priorities (score >= 85)
  const priorityClaims = claims.slice(0, 3);

  const stats = {
    totalAlerts: 142,
    newCount: 96,
    reviewCount: 23,
    doneCount: 23,
    totalNetworks: 9,
    totalInvestigating: 23,
  };

  // Promo Banner Carousel slides (matching Screenshot 1 & 2 aesthetic)
  const slides = [
    {
      tag: 'PRIORITAS INVESTIGASI',
      title: 'Periksa yang paling berisiko lebih dulu',
      gradient: 'from-[#00A86B] to-[#008A56]',
      badgeColor: 'bg-emerald-700/60',
      checkpoints: [
        'Urutan dari skor AI, nilai klaim, dan bukti audit',
        '3 klaim risiko tinggi skor >85 memerlukan tindakan segera',
        'Mencegah potensi kerugian klaim faskes hingga Rp142,5 juta',
      ],
      actionText: 'Buka Antrean',
      actionTab: 'queue',
    },
    {
      tag: 'DETEKSI POLA JARINGAN',
      title: 'Pola klaster cloning K-04 teridentifikasi',
      gradient: 'from-[#0284C7] to-[#0369A1]',
      badgeColor: 'bg-sky-700/60',
      checkpoints: [
        'Melibatkan 1 nakes dan 3 pasien dalam rentang 2 jam',
        'Kemiripan kode tindakan 93.39 & 93.11 mencapai 96%',
        'Jejak audit dan bukti siap diekspor untuk verifikasi',
      ],
      actionText: 'Lihat Graf Jaringan',
      actionTab: 'graph',
    },
    {
      tag: 'EVALUASI MODEL AI',
      title: 'Graph Neural Network: Akurasi 98.4%',
      gradient: 'from-[#7C3AED] to-[#6D28D9]',
      badgeColor: 'bg-purple-700/60',
      checkpoints: [
        'Divalidasi pada 30.000 klaim data sintetis BPJS',
        'Transparansi model dengan explainability per klaim',
        'Aturan deteksi terhubung standar INA-CBG & ICD-10',
      ],
      actionText: 'Evaluasi Model',
      actionTab: 'evaluation',
    },
  ];

  return (
    <div className="w-full flex flex-col bg-[#F0F6FA] min-h-full pb-10">
      {/* 1. TOP HEADER SECTION (Soft Sky-Blue Gradient - Matching Screenshot 1 & 2) */}
      <div className="bg-gradient-to-b from-[#D8EDFC] via-[#EBF5FD] to-[#FFFFFF] px-4 pt-2 pb-4">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between mb-3">
          <ClaimGraphLogo size="md" />

          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-teal-50 text-teal-800 border border-teal-200/80 px-2 py-0.5 rounded-full font-bold">
              Sistem Resmi BPJS
            </span>
            <button 
              className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-gray-700 flex items-center justify-center border border-gray-200/80 shadow-xs transition-colors"
              title="Notifikasi Batch Terbaru"
            >
              <Bell size={15} />
            </button>
          </div>
        </div>

        {/* User Greeting & Batch Information */}
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#008272] to-[#00A99D] text-white flex items-center justify-center font-bold text-xs shadow-sm">
              INV
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900 leading-tight">Halo, INV-07</div>
              <div className="text-[11px] text-gray-500 font-medium">Investigator Wilayah IV • BPJS</div>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200/60">
            Batch 11 Okt
          </span>
        </div>

        {/* Hero Card: "142 klaim perlu diperiksa" */}
        <div className="bg-white rounded-2xl p-4 shadow-[0_4px_16px_rgba(0,120,200,0.08)] border border-blue-100/60 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* ClaimGraph-X Network Logo */}
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#008272] to-[#00A99D] text-white flex items-center justify-center shadow-xs shrink-0 border border-white/60">
                <Share2 size={18} strokeWidth={2.4} />
              </div>
              <div>
                <div className="text-sm sm:text-base font-extrabold text-gray-900 leading-tight">
                  142 klaim perlu diperiksa
                </div>
                <div className="text-[11px] text-gray-500 font-medium">
                  dari 30.000 klaim data sintetis
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('queue')}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#008272] hover:bg-[#006654] transition-colors shrink-0 shadow-xs"
            >
              Mulai
            </button>
          </div>

          {/* Progress bar: 96 baru, 23 ditinjau, 23 selesai */}
          <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden flex">
            <div style={{ width: '67%' }} className="bg-[#0284C7] h-full" title="96 Baru" />
            <div style={{ width: '16%' }} className="bg-amber-500 h-full" title="23 Ditinjau" />
            <div style={{ width: '17%' }} className="bg-emerald-600 h-full" title="23 Selesai" />
          </div>

          <div className="flex items-center justify-between text-[11px] text-gray-600 font-medium pt-0.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0284C7]" />
              <span>{stats.newCount} baru</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>{stats.reviewCount} ditinjau</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>{stats.doneCount} selesai</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. THE ICONIC "FITUR" SECTION (Screenshot 1 & 2 Circular Icon Grid) */}
      <div className="bg-white rounded-t-[32px] px-4 pt-5 pb-5 -mt-2 shadow-sm border-t border-gray-100">
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
            Fitur
          </h2>
          <span className="text-[11px] text-gray-400 font-medium">Investigasi & Analisis</span>
        </div>

        {/* 4 Columns Circular Grid with Authentic SatuSehat Pastel Containers */}
        <div className="grid grid-cols-4 gap-y-4 gap-x-2 text-center">
          {/* 1. Antrean risiko */}
          <button
            onClick={() => onNavigate('queue')}
            className="flex flex-col items-center gap-1.5 group select-none"
          >
            <div className="relative w-13 h-13 rounded-full bg-[#E0F7F6] text-[#009688] flex items-center justify-center group-hover:scale-105 group-active:scale-95 transition-transform shadow-xs">
              <ListChecks size={23} strokeWidth={2} />
              <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-[#E91E63] text-white shadow-xs">
                142
              </span>
            </div>
            <span className="text-[11px] font-medium text-gray-700 leading-tight">
              Antrean risiko
            </span>
          </button>

          {/* 2. Jaringan */}
          <button
            onClick={() => onNavigate('graph')}
            className="flex flex-col items-center gap-1.5 group select-none"
          >
            <div className="relative w-13 h-13 rounded-full bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center group-hover:scale-105 group-active:scale-95 transition-transform shadow-xs">
              <Share2 size={23} strokeWidth={2} />
              <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-[#0284C7] text-white shadow-xs">
                9
              </span>
            </div>
            <span className="text-[11px] font-medium text-gray-700 leading-tight">
              Jaringan
            </span>
          </button>

          {/* 3. Investigasi */}
          <button
            onClick={() => onNavigate('investigation')}
            className="flex flex-col items-center gap-1.5 group select-none"
          >
            <div className="relative w-13 h-13 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center group-hover:scale-105 group-active:scale-95 transition-transform shadow-xs">
              <ClipboardCheck size={23} strokeWidth={2} />
              <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-[#D97706] text-white shadow-xs">
                23
              </span>
            </div>
            <span className="text-[11px] font-medium text-gray-700 leading-tight">
              Investigasi
            </span>
          </button>

          {/* 4. Detail klaim */}
          <button
            onClick={() => onNavigate('claim', 'C-10291')}
            className="flex flex-col items-center gap-1.5 group select-none"
          >
            <div className="w-13 h-13 rounded-full bg-[#D1FAE5] text-[#059669] flex items-center justify-center group-hover:scale-105 group-active:scale-95 transition-transform shadow-xs">
              <FileText size={23} strokeWidth={2} />
            </div>
            <span className="text-[11px] font-medium text-gray-700 leading-tight">
              Detail klaim
            </span>
          </button>

          {/* 5. Pola risiko */}
          <button
            onClick={() => onNavigate('rules')}
            className="flex flex-col items-center gap-1.5 group select-none"
          >
            <div className="w-13 h-13 rounded-full bg-[#FFE4E6] text-[#E11D48] flex items-center justify-center group-hover:scale-105 group-active:scale-95 transition-transform shadow-xs">
              <AlertTriangle size={23} strokeWidth={2} />
            </div>
            <span className="text-[11px] font-medium text-gray-700 leading-tight">
              Pola risiko
            </span>
          </button>

          {/* 6. Fasilitas */}
          <button
            onClick={() => onNavigate('facilities')}
            className="flex flex-col items-center gap-1.5 group select-none"
          >
            <div className="w-13 h-13 rounded-full bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center group-hover:scale-105 group-active:scale-95 transition-transform shadow-xs">
              <Building2 size={23} strokeWidth={2} />
            </div>
            <span className="text-[11px] font-medium text-gray-700 leading-tight">
              Fasilitas
            </span>
          </button>

          {/* 7. Kelompok sebaya */}
          <button
            onClick={() => onNavigate('facilities')}
            className="flex flex-col items-center gap-1.5 group select-none"
          >
            <div className="w-13 h-13 rounded-full bg-[#FCE7F3] text-[#DB2777] flex items-center justify-center group-hover:scale-105 group-active:scale-95 transition-transform shadow-xs">
              <Users size={23} strokeWidth={2} />
            </div>
            <span className="text-[11px] font-medium text-gray-700 leading-tight">
              Kelompok sebaya
            </span>
          </button>

          {/* 8. Jejak audit */}
          <button
            onClick={() => onNavigate('audit')}
            className="flex flex-col items-center gap-1.5 group select-none"
          >
            <div className="w-13 h-13 rounded-full bg-[#E0F7F6] text-[#009688] flex items-center justify-center group-hover:scale-105 group-active:scale-95 transition-transform shadow-xs">
              <History size={23} strokeWidth={2} />
            </div>
            <span className="text-[11px] font-medium text-gray-700 leading-tight">
              Jejak audit
            </span>
          </button>
        </div>

        {/* Second Row Quick Menu (Evaluasi, Aturan, Data Sintetis, Menu Lainnya) */}
        <div className="grid grid-cols-4 gap-y-4 gap-x-2 text-center mt-3 pt-3 border-t border-gray-100">
          {/* 9. Statistik klaim */}
          <button
            onClick={() => onNavigate('statistics')}
            className="flex flex-col items-center gap-1.5 group select-none cursor-pointer"
            title="Statistik Klaim Terlaporkan"
          >
            <div className="w-13 h-13 rounded-full bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center group-hover:scale-105 group-active:scale-95 transition-transform shadow-xs">
              <BarChart3 size={23} strokeWidth={2} />
            </div>
            <span className="text-[11px] font-medium text-gray-700 leading-tight">
              Statistik klaim
            </span>
          </button>

          {/* 10. Aturan deteksi */}
          <button
            onClick={() => onNavigate('rules')}
            className="flex flex-col items-center gap-1.5 group select-none"
          >
            <div className="w-13 h-13 rounded-full bg-[#D1FAE5] text-[#059669] flex items-center justify-center group-hover:scale-105 group-active:scale-95 transition-transform shadow-xs">
              <CheckSquare size={23} strokeWidth={2} />
            </div>
            <span className="text-[11px] font-medium text-gray-700 leading-tight">
              Aturan deteksi
            </span>
          </button>

          {/* 11. Data sintetis */}
          <button
            onClick={() => onNavigate('synthetic')}
            className="flex flex-col items-center gap-1.5 group select-none"
          >
            <div className="w-13 h-13 rounded-full bg-[#F1F5F9] text-[#475569] flex items-center justify-center group-hover:scale-105 group-active:scale-95 transition-transform shadow-xs">
              <Database size={23} strokeWidth={2} />
            </div>
            <span className="text-[11px] font-medium text-gray-700 leading-tight">
              Data sintetis
            </span>
          </button>

          {/* 12. Menu lainnya */}
          <button
            onClick={() => setShowMoreModal(true)}
            className="flex flex-col items-center gap-1.5 group select-none"
          >
            <div className="w-13 h-13 rounded-full bg-[#E2E8F0] text-[#64748B] flex items-center justify-center group-hover:scale-105 group-active:scale-95 transition-transform shadow-xs">
              <MoreHorizontal size={23} strokeWidth={2} />
            </div>
            <span className="text-[11px] font-medium text-gray-700 leading-tight">
              Menu lainnya
            </span>
          </button>
        </div>
      </div>

      {/* 3. PROMO CAROUSEL BANNER (Matches Screenshot 1 Green Banner Design) */}
      <div className="px-4 py-3">
        <div 
          className={`rounded-2xl p-4 text-white shadow-md relative overflow-hidden transition-all bg-gradient-to-r ${slides[currentSlide].gradient}`}
        >
          {/* Subtle background glow effect */}
          <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-white/10 blur-xl pointer-events-none" />

          {/* Tag & Action */}
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider text-white ${slides[currentSlide].badgeColor}`}>
              {slides[currentSlide].tag}
            </span>
            <Sparkles size={16} className="text-white/80" />
          </div>

          {/* Headline */}
          <h3 className="text-base sm:text-lg font-black tracking-tight drop-shadow-md mb-2 leading-tight">
            {slides[currentSlide].title}
          </h3>

          {/* Checkpoints list */}
          <div className="space-y-1 mb-4 text-xs font-medium text-white/95">
            {slides[currentSlide].checkpoints.map((pt, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-lime-300 shrink-0" />
                <span className="leading-snug">{pt}</span>
              </div>
            ))}
          </div>

          {/* Bottom Action Button */}
          <button
            onClick={() => onNavigate(slides[currentSlide].actionTab)}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold text-gray-900 bg-white hover:bg-gray-100 transition-colors shadow-sm flex items-center justify-center gap-1.5"
          >
            <span>{slides[currentSlide].actionText}</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Carousel Pagination Dots */}
        <div className="flex items-center justify-center gap-1.5 mt-2.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                currentSlide === idx ? 'w-5 bg-[#00A99D]' : 'w-2 bg-gray-300'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* 4. PRIORITAS HARI INI (Matching Screenshot 3 Right Timeline / Card Aesthetic) */}
      <div className="px-4 py-2">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-gray-900">Prioritas hari ini</h2>
              <p className="text-[11px] text-gray-500">Klaim berisiko tertinggi perlu tindakan awal</p>
            </div>
            <button
              onClick={() => onNavigate('queue')}
              className="text-xs font-bold text-[#00A99D] hover:underline flex items-center gap-0.5"
            >
              Lihat semua <ChevronRight size={14} />
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {priorityClaims.map((claim, idx) => {
              const isTop = idx === 0;
              return (
                <div
                  key={claim.claimId}
                  onClick={() => onNavigate('claim', claim.claimId)}
                  className={`p-3 sm:p-3.5 rounded-2xl flex items-center justify-between gap-3 transition-all cursor-pointer ${
                    isTop 
                      ? 'bg-[#E8F8F5] border border-[#B9E9DF] shadow-2xs hover:bg-[#DDF4EF]' 
                      : 'bg-[#F8FAFC] border border-gray-200/80 hover:bg-white hover:border-gray-300'
                  }`}
                >
                  {/* Left: Info */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div 
                      className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        isTop ? 'bg-[#00A99D]' : 'bg-gray-400'
                      }`} 
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-xs sm:text-sm text-gray-900 truncate">
                          {claim.patternLabel}
                        </span>
                        <span className="text-[10px] font-mono text-gray-500 font-semibold">
                          {claim.claimId}
                        </span>
                      </div>
                      <div className={`text-[11px] truncate mt-0.5 ${isTop ? 'text-teal-800' : 'text-gray-500'}`}>
                        {claim.facilityId} • Skor {claim.riskScore}/100
                      </div>
                    </div>
                  </div>

                  {/* Right: Metric & Pill Action Button */}
                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className={`font-bold text-xs sm:text-sm font-mono ${isTop ? 'text-[#008272]' : 'text-gray-900'}`}>
                      Rp{(claim.claimAmount / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} jt
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate('claim', claim.claimId);
                      }}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer active:scale-95 ${
                        isTop 
                          ? 'bg-[#00A99D] hover:bg-[#008E84] text-white shadow-2xs' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold'
                      }`}
                    >
                      {isTop ? 'Periksa' : 'Lihat'}
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Footer / Expander (Matches +16 more From £240 ⌄) */}
            <div 
              onClick={() => onNavigate('queue')}
              className="p-3 rounded-2xl bg-white border border-gray-200/80 flex items-center justify-between text-xs font-medium text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">+139 klaim berisiko lainnya</span>
                <span className="font-bold text-gray-900 font-mono">Total Rp1,24 Miliar</span>
              </div>
              <ChevronDown size={16} className="text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* 5. "BUTUH BANTUAN?" BUTTON (Matching Screenshot 3 Bottom) */}
      <div className="px-4 pt-2 pb-4 flex justify-center">
        <button
          onClick={() => setShowHelpModal(true)}
          className="w-full max-w-sm py-2.5 px-4 rounded-xl border border-blue-200 bg-white hover:bg-blue-50/50 text-[#0284C7] font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
        >
          <MessageCircle size={16} className="text-[#0284C7]" />
          <span>Butuh Bantuan?</span>
        </button>
      </div>

      {/* Footer Disclaimer */}
      <div className="text-center text-[11px] text-gray-400 font-medium px-4">
        Skor menunjukkan urutan pemeriksaan, bukan bukti kecurangan.
      </div>

      {/* MODAL: Full Features ("Menu lainnya") */}
      {showMoreModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-3">
          <div className="bg-white rounded-3xl p-5 w-full max-w-sm shadow-xl border border-gray-100 animate-in fade-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="font-bold text-gray-900 text-sm">Semua Modul Investigasi</h3>
              <button 
                onClick={() => setShowMoreModal(false)}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-800"
              >
                <X size={15} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button 
                onClick={() => { setShowMoreModal(false); onNavigate('rules'); }}
                className="p-3 rounded-xl border border-gray-100 hover:bg-teal-50 flex items-center gap-2.5 text-left"
              >
                <CheckSquare size={17} className="text-teal-600" />
                <span className="font-semibold text-gray-800">Aturan Deteksi</span>
              </button>

              <button 
                onClick={() => { setShowMoreModal(false); onNavigate('facilities'); }}
                className="p-3 rounded-xl border border-gray-100 hover:bg-teal-50 flex items-center gap-2.5 text-left"
              >
                <Building2 size={17} className="text-indigo-600" />
                <span className="font-semibold text-gray-800">Profil Faskes</span>
              </button>

              <button 
                onClick={() => { setShowMoreModal(false); onNavigate('audit'); }}
                className="p-3 rounded-xl border border-gray-100 hover:bg-teal-50 flex items-center gap-2.5 text-left"
              >
                <History size={17} className="text-cyan-600" />
                <span className="font-semibold text-gray-800">Jejak Audit</span>
              </button>

              <button 
                onClick={() => { setShowMoreModal(false); onNavigate('synthetic'); }}
                className="p-3 rounded-xl border border-gray-100 hover:bg-teal-50 flex items-center gap-2.5 text-left"
              >
                <Database size={17} className="text-slate-600" />
                <span className="font-semibold text-gray-800">Data Sintetis</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Helpdesk ("Butuh Bantuan?") */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-3">
          <div className="bg-white rounded-3xl p-5 w-full max-w-sm shadow-xl border border-gray-100 animate-in fade-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <div className="flex items-center gap-2">
                <MessageCircle size={18} className="text-[#0284C7]" />
                <h3 className="font-bold text-gray-900 text-sm">Pusat Bantuan Investigasi</h3>
              </div>
              <button 
                onClick={() => setShowHelpModal(false)}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-800"
              >
                <X size={15} />
              </button>
            </div>

            <p className="text-xs text-gray-600 mb-4 leading-relaxed">
              Panduan investigasi klaim risiko dan koordinasi bersama tim verifikator BPJS Kesehatan & Kemenkes RI.
            </p>

            <div className="space-y-2 text-xs">
              <a 
                href="https://wa.me/6281110500567" 
                target="_blank" 
                rel="noreferrer"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200"
              >
                <span>WhatsApp Helpdesk Resmi</span>
                <span className="text-[11px] font-mono">0811-1050-0567</span>
              </a>

              <button 
                onClick={() => setShowHelpModal(false)}
                className="w-full py-2.5 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

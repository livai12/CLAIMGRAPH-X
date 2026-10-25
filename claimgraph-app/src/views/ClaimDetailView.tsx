import React from 'react';
import { 
  ArrowLeft, 
  Share2, 
  CheckSquare, 
  FileText, 
  Calendar, 
  User, 
  Building2, 
  Activity, 
  Stethoscope, 
  Clock, 
  BarChart2, 
  CheckCircle,
  Copy,
  ChevronDown
} from 'lucide-react';
import { Claim } from '../types';
import { RiskChip } from '../components/RiskChip';
import { StatusChip } from '../components/StatusChip';
import { ScoreBar } from '../components/ScoreBar';
import { RiskNotice } from '../components/RiskNotice';

interface ClaimDetailViewProps {
  claim: Claim;
  onBack: () => void;
  onOpenGraph: (claimId: string) => void;
  onOpenStatistics?: () => void;
  onOpenRules?: () => void;
  onStartInvestigation: (claimId: string) => void;
  onSelectClaim?: (claimId: string) => void;
}

export const ClaimDetailView: React.FC<ClaimDetailViewProps> = ({
  claim,
  onBack,
  onOpenGraph,
  onOpenStatistics,
  onOpenRules,
  onStartInvestigation,
  onSelectClaim,
}) => {
  return (
    <div className="flex flex-col gap-4 w-full max-w-4xl mx-auto px-3.5 pt-2 pb-12">
      {/* Top Header Bar */}
      <div className="bg-gradient-to-r from-[#00A99D] via-[#0284C7] to-[#008272] rounded-2xl p-4 sm:p-5 text-white flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            title="Kembali ke antrean"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="text-[10px] uppercase tracking-wider font-bold text-teal-100">
              CLAIMGRAPH-X • Investigasi Klaim
            </div>
            <h1 className="text-lg sm:text-xl font-bold font-mono tracking-tight">
              {claim.claimId}
            </h1>
            <p className="text-xs text-teal-100 font-medium">
              {claim.facilityId} • {claim.serviceDate}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenGraph(claim.claimId)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-xs font-semibold text-white border border-white/20 transition-colors"
          >
            <Share2 size={14} />
            <span className="hidden sm:inline">Lihat Graf</span>
          </button>
        </div>
      </div>

      {/* Score Hero Card (Proper mobile layout, button never clipped) */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-200/90 shadow-sm flex flex-col gap-3.5">
        {/* Top: Category Title & Status */}
        <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-gray-100">
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
              Pola Deteksi Sistem
            </div>
            <h2 className="text-base sm:text-lg font-extrabold text-gray-900 leading-tight mt-0.5">
              {claim.patternLabel}
            </h2>
          </div>
          <StatusChip status={claim.status} />
        </div>

        {/* Middle: Proper Score Box & Summary */}
        <div className="flex items-center gap-3">
          <RiskChip score={claim.riskScore} variant="hero" />

          <div className="flex-1 min-w-0 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <RiskChip level={claim.riskLevel} />
              <span className="text-[11px] font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md whitespace-nowrap">
                Nilai: Rp{(claim.claimAmount / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 2 })} jt
              </span>
            </div>
            <p className="text-xs text-gray-600 leading-snug line-clamp-2">
              Terindikasi pola replikasi tindakan medis identik pada 3 pasien berbeda oleh satu DPJP.
            </p>
          </div>
        </div>

        {/* Action Button - 100% Full Width, Never Clipped on Mobile */}
        <button
          onClick={() => onStartInvestigation(claim.claimId)}
          className="w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#008272] hover:bg-[#006654] transition-all shadow-sm flex items-center justify-center gap-2 active:scale-98"
        >
          <CheckSquare size={16} />
          <span>Mulai Tinjauan Investigasi</span>
        </button>

        {/* Four Signal Progress Bars (Single clean header from ScoreBar with interactive links) */}
        <div className="pt-2 border-t border-gray-100">
          <ScoreBar 
            signals={claim.signals} 
            onOpenStatistics={onOpenStatistics}
            onOpenGraph={() => onOpenGraph(claim.claimId)}
            onOpenRules={onOpenRules}
          />
        </div>

        {/* Risk Notice Banner */}
        <RiskNotice />
      </div>

      {/* Card "Alasan & Temuan Penandaan Klaim" (Replaces the AI-slop diagram) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200/90 shadow-sm flex flex-col gap-4">
        <div>
          <div className="text-[10px] uppercase font-bold tracking-wider text-teal-700">
            Bukti Analisis Korelasi
          </div>
          <h3 className="text-base font-bold text-gray-900 mt-0.5">
            Dasar & Alasan Penandaan Anomali
          </h3>
          <p className="text-xs text-gray-500">
            Rekonstruksi korelasi nakes, prosedur medis, dan interval waktu tindakan
          </p>
        </div>

        {/* Professional DPJP Card */}
        <div className="bg-[#F8FAFC] rounded-2xl p-3.5 border border-gray-200/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0284C7] to-[#0EA5E9] text-white flex items-center justify-center shadow-xs shrink-0 font-bold">
              <User size={18} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-xs sm:text-sm text-gray-900 truncate">
                  {claim.practitionerName || 'dr. Hendra Sp.KFR'}
                </span>
                <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-semibold whitespace-nowrap shrink-0">
                  {claim.practitionerId}
                </span>
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5 truncate">
                Spesialis Kedokteran Fisik & Rehabilitasi • {claim.facilityId}
              </div>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 shrink-0 whitespace-nowrap">
            DPJP Terkait
          </span>
        </div>

        {/* Comparative Claims List with User's Reference Card Design */}
        {/* Comparative Claims List with User's Reference Card Design */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 px-1 mb-0.5">
            <span>KLAIM TERKAIT KLASTER K-04</span>
            <span className="text-[#008272] font-extrabold whitespace-nowrap">96% Kemiripan Tindakan</span>
          </div>

          {/* Card 1: Highlighted Active Claim (Matches Booking.com £220 View card) */}
          <div 
            onClick={() => onStartInvestigation(claim.claimId)}
            className="p-3 sm:p-3.5 rounded-2xl bg-[#E8F8F5] border border-[#B9E9DF] flex items-center justify-between gap-2.5 shadow-2xs transition-all cursor-pointer hover:bg-[#DCF3EE]"
            title="Klik untuk tinjau investigasi klaim ini"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-2.5 h-2.5 rounded-full bg-[#00A99D] shrink-0" />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xs sm:text-sm text-gray-900 font-mono whitespace-nowrap">
                    {claim.patientId}
                  </span>
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-[#00A99D] text-white shrink-0">
                    Fokus
                  </span>
                </div>
                <div className="text-[11px] text-teal-800 font-medium truncate mt-0.5">
                  09:52 WIB • {claim.claimId} • Tindakan: 93.39, 93.11, 99.29
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="font-bold text-xs sm:text-sm text-[#008272] font-mono whitespace-nowrap">
                Rp4,86 jt
              </span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onStartInvestigation(claim.claimId);
                }}
                className="px-3 py-1.5 rounded-full text-xs font-bold text-white bg-[#00A99D] hover:bg-[#008E84] transition-all shadow-2xs active:scale-95 whitespace-nowrap cursor-pointer flex items-center gap-1"
                title="Mulai investigasi klaim ini"
              >
                <span>Klaim Ini</span>
              </button>
            </div>
          </div>

          {/* Card 2: Cloned Case 1 (Matches Lastminute.com £235 View card) */}
          <div 
            onClick={() => onSelectClaim ? onSelectClaim('C-10288') : onOpenGraph(claim.claimId)}
            className="p-3 sm:p-3.5 rounded-2xl bg-[#F8FAFC] border border-gray-200/80 flex items-center justify-between gap-2.5 hover:bg-white hover:border-gray-300 transition-all cursor-pointer"
            title="Klik untuk melihat klaim C-10288"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-2.5 h-2.5 rounded-full bg-gray-400 shrink-0" />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs sm:text-sm text-gray-800 font-mono whitespace-nowrap">
                    PST-8F2A1
                  </span>
                </div>
                <div className="text-[11px] text-gray-500 font-medium truncate mt-0.5">
                  09:05 WIB • C-10288 • Tindakan: 93.39, 93.11, 99.29
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="font-bold text-xs sm:text-sm text-gray-900 font-mono whitespace-nowrap">
                Rp4,86 jt
              </span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSelectClaim) {
                    onSelectClaim('C-10288');
                  } else {
                    onOpenGraph(claim.claimId);
                  }
                }}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors whitespace-nowrap cursor-pointer active:scale-95"
                title="Buka klaim C-10288"
              >
                Lihat
              </button>
            </div>
          </div>

          {/* Card 3: Cloned Case 2 (Matches Trip.com £238 View card) */}
          <div 
            onClick={() => onSelectClaim ? onSelectClaim('C-10295') : onOpenGraph(claim.claimId)}
            className="p-3 sm:p-3.5 rounded-2xl bg-[#F8FAFC] border border-gray-200/80 flex items-center justify-between gap-2.5 hover:bg-white hover:border-gray-300 transition-all cursor-pointer"
            title="Klik untuk melihat klaim C-10295"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-2.5 h-2.5 rounded-full bg-gray-400 shrink-0" />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs sm:text-sm text-gray-800 font-mono whitespace-nowrap">
                    PST-71E40
                  </span>
                </div>
                <div className="text-[11px] text-gray-500 font-medium truncate mt-0.5">
                  11:15 WIB • C-10295 • Tindakan: 93.39, 93.11, 99.29
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="font-bold text-xs sm:text-sm text-gray-900 font-mono whitespace-nowrap">
                Rp4,86 jt
              </span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSelectClaim) {
                    onSelectClaim('C-10295');
                  } else {
                    onOpenGraph(claim.claimId);
                  }
                }}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors whitespace-nowrap cursor-pointer active:scale-95"
                title="Buka klaim C-10295"
              >
                Lihat
              </button>
            </div>
          </div>

          {/* Card 4: Footer / Expander (Matches +16 more From £240 ⌄) */}
          <div 
            onClick={() => onOpenGraph(claim.claimId)}
            className="p-3 rounded-2xl bg-white border border-gray-200/80 flex items-center justify-between text-xs font-medium text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors shadow-2xs"
            title="Buka tampilan graf jaringan klaster K-04"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-semibold text-gray-700 truncate">+6 klaim klaster K-04</span>
              <span className="font-bold text-gray-900 font-mono whitespace-nowrap">Total Rp28,4 jt</span>
            </div>
            <ChevronDown size={16} className="text-gray-400 shrink-0" />
          </div>
        </div>

        {/* Narrative & Clinical Reasoning */}
        <div className="text-xs text-gray-700 leading-relaxed bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
          <p className="font-medium">
            <strong>Analisis Anomali:</strong> Tiga peserta berbeda menerima urutan tindakan fisioterapi yang 96% sama persis dari satu tenaga kesehatan dalam rentang 2 jam 10 menit. Standar waktu pelayanan untuk modalitas tindakan 93.39 dan 93.11 secara klinis memerlukan 45–60 menit per pasien. Interval singkat antar tindakan ini melampaui ambang batas wajar kelompok sebaya (maksimal 85%).
          </p>
        </div>

        {/* Langkah berikutnya Callout */}
        <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start gap-3">
          <CheckSquare size={18} className="text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold text-emerald-900 block">Rekomendasi Tindak Lanjut</span>
            <span className="text-xs sm:text-sm text-emerald-800 mt-0.5 block">
              {claim.explanation.nextStep}
            </span>
          </div>
        </div>
      </div>

      {/* Card "Bukti" (matches PDF Page 3) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-sm flex flex-col gap-4">
        <h3 className="text-base font-bold text-gray-900">Bukti</h3>

        <div className="flex flex-col gap-3">
          {claim.evidenceList.map((ev) => (
            <div
              key={ev.id}
              className="p-3.5 rounded-2xl bg-gray-50/80 border border-gray-200 flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                {ev.category === 'Graf' && <Share2 size={15} className="text-teal-600" />}
                {ev.category === 'Aturan' && <CheckCircle size={15} className="text-sky-600" />}
                {ev.category === 'Kemiripan' && <Copy size={15} className="text-indigo-600" />}
                {ev.category === 'Waktu' && <Clock size={15} className="text-emerald-600" />}
                {ev.category === 'Statistik' && <BarChart2 size={15} className="text-amber-600" />}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-900">{ev.category}</span>
                  {ev.ruleId && (
                    <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-gray-200 text-gray-700">
                      {ev.ruleId}
                    </span>
                  )}
                  {ev.strength && (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        ev.strength === 'Kuat'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      Kekuatan: {ev.strength}
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">{ev.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Card "Urutan kejadian" (Timeline with Centered Column Line & Dots) */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-100 shadow-sm flex flex-col gap-3.5">
        <div>
          <h3 className="text-base font-bold text-gray-900">Kronologi & Urutan Kejadian</h3>
          <p className="text-xs text-gray-500">Jejak waktu validasi sistem dan faskes</p>
        </div>

        {/* Pixel-Perfect Column Timeline */}
        <div className="flex flex-col pt-1">
          {claim.timeline.map((evt, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === claim.timeline.length - 1;

            return (
              <div key={idx} className="relative flex items-stretch gap-3">
                {/* Left Column: Continuous Centered Vertical Spine */}
                <div className="relative flex flex-col items-center w-6 shrink-0">
                  {/* Top line segment (from row top to node center) */}
                  {!isFirst && (
                    <div className="absolute top-0 w-0.5 bg-[#00A99D] h-4" />
                  )}

                  {/* Concentric Node Circle */}
                  <div className="relative z-10 mt-2 flex items-center justify-center">
                    {evt.isCurrent ? (
                      <div className="w-5 h-5 rounded-full bg-teal-100 border border-teal-300 flex items-center justify-center shadow-xs">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#00A99D]" />
                      </div>
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-[#00A99D] bg-white shadow-2xs" />
                    )}
                  </div>

                  {/* Bottom line segment (from node center to row bottom) */}
                  {!isLast && (
                    <div className="absolute top-4 bottom-0 w-0.5 bg-[#00A99D]" />
                  )}
                </div>

                {/* Right Column: Event Card */}
                <div className={`flex-1 min-w-0 ${!isLast ? 'pb-3' : 'pb-0'}`}>
                  <div className={`p-3 rounded-2xl border transition-all ${
                    evt.isCurrent 
                      ? 'bg-emerald-50/60 border-emerald-300 shadow-2xs' 
                      : 'bg-[#F8FAFC] border-gray-200/70 hover:bg-white hover:border-gray-300'
                  }`}>
                    <div className="flex items-center justify-between gap-2 text-xs font-bold text-gray-800">
                      <span className="text-[#008272] font-mono">{evt.date}</span>
                      {evt.time && <span className="text-gray-400 font-mono text-[11px]">{evt.time}</span>}
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-gray-900 mt-0.5">
                      {evt.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5 leading-snug">{evt.description}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Card "Rincian klaim" (Grid 2x3 matches PDF Page 3) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-sm flex flex-col gap-4">
        <h3 className="text-base font-bold text-gray-900">Rincian klaim</h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          {/* Peserta */}
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
            <span className="text-gray-400 block mb-1">Peserta</span>
            <span className="font-bold text-sm font-mono text-gray-900">{claim.patientId}</span>
          </div>

          {/* Fasilitas */}
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
            <span className="text-gray-400 block mb-1">Fasilitas</span>
            <span className="font-bold text-sm font-mono text-gray-900">{claim.facilityId}</span>
          </div>

          {/* Tenaga kesehatan */}
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
            <span className="text-gray-400 block mb-1">Tenaga kesehatan</span>
            <span className="font-bold text-sm font-mono text-gray-900">
              {claim.practitionerId}
            </span>
          </div>

          {/* Tanggal layanan */}
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
            <span className="text-gray-400 block mb-1">Tanggal layanan</span>
            <span className="font-bold text-sm text-gray-900">{claim.serviceDate}</span>
          </div>

          {/* Diagnosis */}
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
            <span className="text-gray-400 block mb-1">Diagnosis</span>
            <span className="font-bold text-sm font-mono text-gray-900">
              {claim.diagnosisCode}
            </span>
          </div>

          {/* Tindakan */}
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
            <span className="text-gray-400 block mb-1">Tindakan</span>
            <span className="font-bold text-sm font-mono text-gray-900">
              {claim.procedureCodes.join(', ')}
            </span>
          </div>
        </div>
      </div>

      {/* "Butuh Bantuan?" WhatsApp Style Button (Screenshot 3 Bottom) */}
      <div className="pt-2 pb-6 flex justify-center">
        <a
          href="https://wa.me/6281110500567"
          target="_blank"
          rel="noreferrer"
          className="w-full max-w-sm py-2.5 px-4 rounded-xl border border-blue-200 bg-white hover:bg-blue-50/50 text-[#0284C7] font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
        >
          <span className="text-base">💬</span>
          <span>Butuh Bantuan?</span>
        </a>
      </div>
    </div>
  );
};

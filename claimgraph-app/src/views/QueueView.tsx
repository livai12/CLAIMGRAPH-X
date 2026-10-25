import React, { useState, useMemo } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  ChevronRight, 
  FileText, 
  Repeat, 
  Copy, 
  HelpCircle, 
  TrendingUp, 
  GitFork,
  ArrowUpDown,
  Loader2
} from 'lucide-react';
import { Claim, RiskPattern, ClaimStatus } from '../types';
import { StatusChip } from '../components/StatusChip';

interface QueueViewProps {
  claims: Claim[];
  onSelectClaim: (claimId: string) => void;
}

// Procedural realistic claim generator up to 142 claims matching PRD queue size
const generateExtendedClaims = (base: Claim[]): Claim[] => {
  const result: Claim[] = [...base];
  const patterns: { pattern: RiskPattern; label: string; diagnosis: string; desc: string; procedures: string[] }[] = [
    { pattern: 'possible_cloning', label: 'Duplikasi Prosedur (Cloning)', diagnosis: 'M54.5', desc: 'Low back pain', procedures: ['93.39', '93.11', '99.29'] },
    { pattern: 'possible_repeat_billing', label: 'Tagihan Berulang (Repeat Billing)', diagnosis: 'K35.8', desc: 'Acute appendicitis', procedures: ['47.01', '89.52'] },
    { pattern: 'possible_phantom_billing', label: 'Layanan Fiktif (Phantom Billing)', diagnosis: 'Z00.0', desc: 'General medical exam', procedures: ['89.07', '90.59'] },
    { pattern: 'possible_upcoding', label: 'Penggelembungan Kode (Upcoding)', diagnosis: 'I21.9', desc: 'Acute myocardial infarction', procedures: ['89.52', '99.15'] },
    { pattern: 'referral_anomaly', label: 'Anomali Rujukan Berjenjang', diagnosis: 'H26.9', desc: 'Cataract, unspecified', procedures: ['95.02'] },
  ];
  
  const facilities = ['FKRTL-021', 'FKRTL-007', 'FKRTL-015', 'FKRTL-030', 'FKTP-044', 'FKTP-112', 'FKRTL-088'];
  const doctors = [
    { id: 'NAKES-0417', name: 'dr. Hendra Sp.KFR' },
    { id: 'NAKES-0192', name: 'dr. Budi Sp.B' },
    { id: 'NAKES-0881', name: 'dr. Siti Rahma' },
    { id: 'NAKES-0344', name: 'dr. Agus Sp.JP' },
    { id: 'NAKES-0512', name: 'dr. Dewi Sp.M' },
  ];

  for (let i = base.length + 1; i <= 142; i++) {
    const pIdx = i % patterns.length;
    const pat = patterns[pIdx];
    const doc = doctors[i % doctors.length];
    const fac = facilities[i % facilities.length];
    const score = Math.max(52, 95 - Math.floor(i * 0.28) - (i % 6));
    const amount = (1800000 + ((i * 470000) % 18000000));

    result.push({
      claimId: `C-${10300 + i}`,
      patientId: `PST-${(10000 + i * 23).toString(16).toUpperCase()}`,
      practitionerId: doc.id,
      practitionerName: doc.name,
      facilityId: fac,
      facilityType: fac.startsWith('FKRTL') ? 'FKRTL' : 'FKTP',
      serviceDate: `${((i % 28) + 1)} Sep 2026`,
      submissionDate: `${((i % 28) + 3)} Sep 2026`,
      claimAmount: amount,
      riskScore: score,
      riskLevel: score >= 85 ? 'HIGH' : score >= 70 ? 'MEDIUM' : 'LOW',
      primaryPattern: pat.pattern,
      patternLabel: pat.label,
      status: i % 4 === 0 ? 'UNDER_REVIEW' : i % 7 === 0 ? 'VALIDATED' : 'NEW',
      priorityScore: Number((score / 100).toFixed(2)),
      signals: {
        ruleScore: Math.round(score * 0.28),
        statisticalScore: Math.round(score * 0.24),
        graphScore: Math.round(score * 0.26),
        temporalScore: Math.round(score * 0.22),
      },
      diagnosisCode: pat.diagnosis,
      diagnosisDesc: pat.desc,
      procedureCodes: pat.procedures,
      explanation: {
        why: `Terdeteksi deviasi statistik pola ${pat.label} melebihi batas kelompok sebaya.`,
        thresholdNote: 'Ambang sistem: 85%.',
        nextStep: 'Lakukan verifikasi berkas klaim dan rekam medis digital.',
      },
      evidenceList: [
        { id: `ev-${i}-1`, category: 'Aturan', text: `Kesesuaian diagnosis ${pat.diagnosis} dan prosedur`, strength: 'Kuat' },
        { id: `ev-${i}-2`, category: 'Statistik', text: 'Nilai klaim di atas median faskes sekelas', strength: 'Sedang' },
      ],
      timeline: [
        { date: `${((i % 28) + 1)} Sep`, time: '09.30', title: 'Pelayanan peserta', description: `Tindakan ${pat.procedures.join(', ')}` },
        { date: `${((i % 28) + 3)} Sep`, time: '14.15', title: 'Pengajuan klaim', description: 'Batch elektronik faskes' },
      ],
      networkId: 'K-04',
    });
  }
  return result;
};

export const QueueView: React.FC<QueueViewProps> = ({ claims, onSelectClaim }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPattern, setSelectedPattern] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'score' | 'amount' | 'date'>('score');
  const [visibleCount, setVisibleCount] = useState<number>(20);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  // Full pool of 142 claims
  const allClaimsPool = useMemo(() => generateExtendedClaims(claims), [claims]);

  const patternTabs = [
    { id: 'all', label: 'Semua', count: 142 },
    { id: 'possible_cloning', label: 'Duplikasi (Cloning)', count: 31 },
    { id: 'possible_repeat_billing', label: 'Tagihan Berulang', count: 48 },
    { id: 'possible_phantom_billing', label: 'Layanan Fiktif', count: 24 },
    { id: 'possible_upcoding', label: 'Upcoding', count: 21 },
    { id: 'referral_anomaly', label: 'Anomali Rujukan', count: 18 },
  ];

  const filteredClaims = allClaimsPool.filter((claim) => {
    const matchesPattern = selectedPattern === 'all' || claim.primaryPattern === selectedPattern;
    const matchesStatus = selectedStatus === 'all' || claim.status === selectedStatus;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      claim.claimId.toLowerCase().includes(q) ||
      claim.facilityId.toLowerCase().includes(q) ||
      claim.practitionerId.toLowerCase().includes(q) ||
      claim.patternLabel.toLowerCase().includes(q);

    return matchesPattern && matchesStatus && matchesSearch;
  });

  const sortedClaims = [...filteredClaims].sort((a, b) => {
    if (sortBy === 'score') return b.riskScore - a.riskScore;
    if (sortBy === 'amount') return b.claimAmount - a.claimAmount;
    return 0;
  });

  const visibleClaims = sortedClaims.slice(0, visibleCount);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + 20, sortedClaims.length));
      setIsLoadingMore(false);
    }, 300);
  };

  const getPatternIcon = (pattern: RiskPattern) => {
    switch (pattern) {
      case 'possible_cloning':
        return <Copy size={18} className="text-sky-600" />;
      case 'possible_repeat_billing':
        return <Repeat size={18} className="text-teal-600" />;
      case 'possible_phantom_billing':
        return <HelpCircle size={18} className="text-indigo-600" />;
      case 'possible_upcoding':
        return <TrendingUp size={18} className="text-rose-600" />;
      case 'referral_anomaly':
        return <GitFork size={18} className="text-amber-600" />;
    }
  };

  const formatIDR = (val: number) => {
    if (val >= 1000000) {
      return `Rp${(val / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 2 })} jt`;
    }
    return `Rp${val.toLocaleString('id-ID')}`;
  };

  return (
    <div className="flex flex-col gap-3.5 w-full max-w-4xl mx-auto px-3.5 pt-2 pb-12">
      {/* Header Banner - SatuSehat Aesthetic */}
      <div className="bg-gradient-to-r from-[#00A99D] via-[#0284C7] to-[#008272] rounded-2xl p-4 sm:p-5 text-white flex items-center justify-between shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full text-white">
              CLAIMGRAPH-X
            </span>
            <span className="text-[10px] text-teal-100">Batch 11 Okt 2026</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Antrean Risiko</h1>
          <p className="text-xs sm:text-sm text-teal-100 mt-0.5">
            142 peringatan • Nilai terkait Rp1,24 miliar
          </p>
        </div>

        <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center border border-white/30 shrink-0">
          <FileText size={22} className="text-white" />
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nomor klaim, nakes, atau fasilitas..."
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#008272] shadow-xs"
          />
        </div>
        <button
          onClick={() => setSortBy(sortBy === 'score' ? 'amount' : 'score')}
          className="p-2.5 bg-white rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 shrink-0 shadow-xs flex items-center gap-1.5 text-xs font-semibold"
          title="Ubah urutan"
        >
          <ArrowUpDown size={16} />
          <span className="hidden sm:inline">Urut: {sortBy === 'score' ? 'Skor' : 'Nilai'}</span>
        </button>
      </div>

      {/* Urgent Callout Card (matches PDF Page 2) */}
      <div
        onClick={() => onSelectClaim('C-10291')}
        className="p-4 rounded-2xl border border-amber-200 bg-amber-50/80 hover:bg-amber-100/80 transition-colors cursor-pointer flex items-center justify-between gap-3 shadow-xs"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-900 font-extrabold flex items-center justify-center text-sm font-mono shrink-0">
            3
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-gray-900">
              3 klaim skor di atas 85 belum dibuka
            </div>
            <div className="text-xs text-gray-600 mt-0.5">
              Mulai dari <span className="font-mono font-bold text-gray-900">C-10291</span>, kemungkinan cloning
            </div>
          </div>
        </div>
        <ChevronRight size={18} className="text-gray-400 shrink-0" />
      </div>

      {/* Horizontal Filter Tabs / Category Pills (matches PDF Page 2) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {patternTabs.map((tab) => {
          const isActive = selectedPattern === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedPattern(tab.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-[#008272] text-white border-[#008272] shadow-xs'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {tab.label} <span className={`ml-1 ${isActive ? 'text-teal-200' : 'text-gray-400'}`}>{tab.count}</span>
            </button>
          );
        })}
      </div>

      {/* Queue Item Cards List (matches PDF Page 2) */}
      <div className="flex flex-col gap-3">
        {visibleClaims.map((claim) => (
          <div
            key={claim.claimId}
            onClick={() => onSelectClaim(claim.claimId)}
            className="p-4 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all cursor-pointer flex flex-col gap-2.5"
          >
            {/* Top row: Type, description, and Score badge */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0 mt-0.5">
                  {getPatternIcon(claim.primaryPattern)}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-xs sm:text-sm text-gray-900 leading-tight">
                      {claim.primaryPattern === 'possible_cloning' ? 'Duplikasi Prosedur (Cloning)' :
                       claim.primaryPattern === 'possible_repeat_billing' ? 'Tagihan Berulang (Repeat Billing)' :
                       claim.primaryPattern === 'possible_phantom_billing' ? 'Layanan Fiktif (Phantom Billing)' :
                       claim.primaryPattern === 'possible_upcoding' ? 'Penggelembungan Kode (Upcoding)' : 'Anomali Rujukan Berjenjang'}
                    </h3>
                    <span className="text-[10px] font-mono font-semibold bg-gray-100 text-gray-600 px-1.5 py-0.2 rounded">
                      {claim.claimId}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                    {claim.explanation.why}
                  </p>
                </div>
              </div>

              {/* Proper Solid Score Chip */}
              <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 border shadow-2xs ${
                claim.riskScore >= 85
                  ? 'bg-rose-50/90 border-rose-300 text-rose-700'
                  : claim.riskScore >= 70
                  ? 'bg-amber-50/90 border-amber-300 text-amber-700'
                  : 'bg-emerald-50/90 border-emerald-300 text-emerald-700'
              }`}>
                <span className="font-black text-base leading-none font-sans">{claim.riskScore}</span>
                <span className="text-[8px] font-bold uppercase tracking-wider text-gray-400 mt-0.5">Skor</span>
              </div>
            </div>

            {/* Bottom row: Facility, amount, and status pill */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-100">
              <div className="flex items-center gap-2 text-gray-500 font-mono">
                <span className="w-2.5 h-2.5 rounded-sm bg-sky-500" />
                <span className="font-semibold text-gray-700">{claim.facilityId}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-bold text-gray-900 font-mono">
                  {formatIDR(claim.claimAmount)}
                </span>
                <StatusChip status={claim.status} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Button (Functional: Loads next 20 claims with spinner & counter) */}
      <div className="flex flex-col items-center gap-2 pt-1">
        <button
          onClick={handleLoadMore}
          disabled={isLoadingMore || visibleCount >= sortedClaims.length}
          className={`w-full py-3 px-4 rounded-xl border text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer ${
            visibleCount >= sortedClaims.length
              ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-white hover:bg-gray-50 border-gray-300 text-gray-800 hover:border-teal-500 hover:text-[#008272] active:scale-98'
          }`}
        >
          {isLoadingMore ? (
            <>
              <Loader2 size={16} className="animate-spin text-[#008272]" />
              <span>Memuat 20 klaim berikutnya...</span>
            </>
          ) : visibleCount >= sortedClaims.length ? (
            <span>Semua {sortedClaims.length} klaim telah ditampilkan ✓</span>
          ) : (
            <>
              <span>Tampilkan 20 berikutnya</span>
              <span className="text-[11px] font-normal text-gray-500">
                ({Math.min(visibleCount, sortedClaims.length)} dari {sortedClaims.length} klaim)
              </span>
            </>
          )}
        </button>

        <p className="text-[11px] text-gray-400 text-center">
          Menampilkan batch antrean terurut berdasarkan skor anomali tertinggi
        </p>
      </div>
    </div>
  );
};

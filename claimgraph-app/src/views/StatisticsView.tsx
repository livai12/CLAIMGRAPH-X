import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Share2, 
  ArrowLeft, 
  CheckSquare, 
  AlertTriangle, 
  ShieldCheck, 
  Activity, 
  Clock, 
  Building2, 
  Layers, 
  Play, 
  Pause, 
  ChevronRight,
  Database,
  Search,
  Filter,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { RiskNotice } from '../components/RiskNotice';

interface StatisticsViewProps {
  onBack?: () => void;
  onNavigate: (tab: string, claimId?: string) => void;
  onSelectClaim?: (claimId: string) => void;
}

export const StatisticsView: React.FC<StatisticsViewProps> = ({
  onBack,
  onNavigate,
  onSelectClaim,
}) => {
  const [selectedPipelineStage, setSelectedPipelineStage] = useState<number>(3);
  const [isFlowPlaying, setIsFlowPlaying] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'ringkasan' | 'faskes' | 'pola'>('ringkasan');

  const pipelineStages = [
    {
      id: 1,
      title: 'E-Klaim Faskes',
      badge: 'Input Raw',
      color: '#0284C7',
      desc: 'Penerimaan berkas tagihan elektronik dari 2.840 FKRTL & 23.400 FKTP se-Indonesia.',
      rate: '1.240 klaim/menit',
      status: 'Terhubung API BPJS',
    },
    {
      id: 2,
      title: 'Validasi Aturan & ICD',
      badge: 'Rule Engine',
      color: '#0D9488',
      desc: 'Pengecekan kesesuaian diagnosis ICD-10 dengan prosedur INA-CBG dan restriksi formularium.',
      rate: '48 Aturan Aktif',
      status: '100% Terverifikasi',
    },
    {
      id: 3,
      title: 'Graph Neural Network',
      badge: 'Jaringan K-04',
      color: '#EA580C',
      desc: 'Analisis graf multirelasi nakes-pasien-faskes untuk mendeteksi klaster duplikasi/cloning tersembunyi.',
      rate: 'Akurasi 98.4%',
      status: 'Klaster K-04 Terdeteksi',
    },
    {
      id: 4,
      title: 'Risk Stratification',
      badge: 'Skor 0-100',
      color: '#E11D48',
      desc: 'Kombinasi 4 sinyal (Aturan, Statistik, Graf, Waktu) menjadi skor prioritas investigasi.',
      rate: 'Skor >85: 3 Kasus',
      status: 'Prioritas Tinggi',
    },
    {
      id: 5,
      title: 'Antrean Verifikator',
      badge: 'Human-in-the-Loop',
      color: '#059669',
      desc: 'Klaim berisiko disalurkan ke dashboard investigasi dengan bukti graf siap audit.',
      rate: '142 Antrean Aktif',
      status: 'Siap Ditindaklanjuti',
    },
  ];

  const fraudPatterns = [
    { name: 'Tagihan Berulang (Repeat Billing)', pct: 34, count: 48, amount: 'Rp421,6 jt', color: '#008272' },
    { name: 'Duplikasi Prosedur (Cloning)', pct: 22, count: 31, amount: 'Rp272,8 jt', color: '#0284C7' },
    { name: 'Layanan Fiktif (Phantom Billing)', pct: 17, count: 24, amount: 'Rp210,8 jt', color: '#6366F1' },
    { name: 'Penggelembungan Kode (Upcoding)', pct: 15, count: 21, amount: 'Rp186,0 jt', color: '#E11D48' },
    { name: 'Anomali Rujukan Berjenjang', pct: 12, count: 18, amount: 'Rp148,8 jt', color: '#D97706' },
  ];

  const topFacilities = [
    { id: 'FKRTL-021', name: 'RSUD Kelas B Harapan Sehat', flagged: 18, total: 342, rate: '5.2%', risk: 'Tinggi', pattern: 'Duplikasi K-04' },
    { id: 'FKRTL-007', name: 'RS Khusus Bedah Medika Utama', flagged: 14, total: 290, rate: '4.8%', risk: 'Tinggi', pattern: 'Repeat Billing' },
    { id: 'FKRTL-015', name: 'RS Mata Permata Hati', flagged: 11, total: 260, rate: '4.2%', risk: 'Sedang', pattern: 'Anomali Rujukan' },
    { id: 'FKRTL-030', name: 'RS Jantung Nusantara', flagged: 9, total: 240, rate: '3.7%', risk: 'Sedang', pattern: 'Upcoding' },
    { id: 'FKTP-133', name: 'Klinik Pratama Rawat Inap Sejahtera', flagged: 6, total: 195, rate: '3.1%', risk: 'Sedang', pattern: 'Phantom Billing' },
  ];

  return (
    <div className="flex flex-col gap-4 w-full max-w-4xl mx-auto px-3.5 pt-2 pb-14">
      {/* Top Header Section */}
      <div className="bg-gradient-to-r from-[#00A99D] via-[#0284C7] to-[#008272] rounded-2xl p-4 sm:p-5 text-white flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors cursor-pointer"
              title="Kembali"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <div>
            <div className="text-[10px] uppercase tracking-wider font-bold text-teal-100 flex items-center gap-1.5">
              <span>CLAIMGRAPH-X</span>
              <span>•</span>
              <span>Statistik & Analitik Real-Time</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-black tracking-tight mt-0.5">
              Statistik Klaim Terlaporkan
            </h1>
            <p className="text-xs text-teal-100 font-medium">
              142.850 klaim diproses • Batch aktif 11 Okt 2026
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('queue')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-xs font-semibold text-white border border-white/20 transition-colors cursor-pointer shadow-xs"
          >
            <CheckSquare size={14} />
            <span className="hidden sm:inline">Buka Antrean</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metric Cards - 2 Columns for clean mobile & mockup view */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* KPI 1 */}
        <div className="bg-white rounded-2xl p-3 border border-gray-200/90 shadow-2xs flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-gray-500">Total Terlaporkan</span>
          <div className="text-xl font-extrabold text-gray-900 font-mono tracking-tight mt-1 whitespace-nowrap">
            142.850
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 mt-1">
            <TrendingUp size={12} className="shrink-0" />
            <span className="truncate">+12.4% vs batch lalu</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white rounded-2xl p-3 border border-gray-200/90 shadow-2xs flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-gray-500">Nilai Klaim Batch</span>
          <div className="text-xl font-extrabold text-[#008272] font-mono tracking-tight mt-1 whitespace-nowrap">
            Rp1,24 M
          </div>
          <div className="text-[10px] text-gray-500 font-medium mt-1 truncate">
            Rata-rata Rp8,6 jt/klaim
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-gradient-to-br from-white to-rose-50/50 rounded-2xl p-3 border border-rose-200/90 shadow-2xs flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-rose-700">Ditandai Anomali</span>
          <div className="text-xl font-extrabold text-rose-600 font-mono tracking-tight mt-1 whitespace-nowrap">
            142 <span className="text-xs font-semibold text-rose-500">klaim</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-rose-600 mt-1">
            <AlertTriangle size={11} className="shrink-0" />
            <span className="truncate">2.4% rasio anomali</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-gradient-to-br from-white to-emerald-50/50 rounded-2xl p-3 border border-emerald-200/90 shadow-2xs flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-emerald-800">Potensi Hemat</span>
          <div className="text-xl font-extrabold text-emerald-700 font-mono tracking-tight mt-1 whitespace-nowrap">
            Rp142,5 Jt
          </div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-medium mt-1">
            <ShieldCheck size={11} className="shrink-0" />
            <span className="truncate">Dana JKN terselamatkan</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ANIMATED PIPELINE FLOW DIAGRAM (Alur Aliran Data Transfer Klaim Real-Time) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-3.5 sm:p-5 border border-gray-200/90 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-gray-100">
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-teal-700 flex items-center gap-1.5">
              <span>Aliran Transfer Data Otomatis</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <h2 className="text-sm sm:text-base font-extrabold text-gray-900 mt-0.5">
              Diagram Pipeline Aliran Data Klaim (End-to-End)
            </h2>
            <p className="text-[11px] sm:text-xs text-gray-500">
              Visualisasi alur data klaim dari faskes hingga deteksi anomali Graph Neural Network
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFlowPlaying((prev) => !prev)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                isFlowPlaying
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                  : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isFlowPlaying ? <Pause size={12} className="text-emerald-700" /> : <Play size={12} className="text-gray-700" />}
              <span>{isFlowPlaying ? 'Aliran Aktif' : 'Jeda Aliran'}</span>
            </button>
          </div>
        </div>

        {/* Interactive SVG Flow Diagram (Compact 700x170 viewBox for crisp mobile rendering) */}
        <div className="relative w-full bg-gradient-to-b from-[#F8FAFC] to-[#F1F5F9] rounded-2xl p-2 sm:p-3 border border-gray-200 overflow-hidden">
          <svg className="w-full h-[145px] sm:h-[175px]" viewBox="0 0 700 170">
            <defs>
              <linearGradient id="pipeGradGreen" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0284C7" />
                <stop offset="50%" stopColor="#00A99D" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>
              <linearGradient id="pipeGradOrange" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00A99D" />
                <stop offset="60%" stopColor="#F97316" />
                <stop offset="100%" stopColor="#EF4444" />
              </linearGradient>
              <filter id="glow-packet" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Connecting Pipeline Paths */}
            {/* Stage 1 to 2 */}
            <path
              id="flow-path-1"
              d="M 115 85 L 180 85"
              stroke="#CBD5E1"
              strokeWidth="3.5"
              strokeDasharray="4 4"
            />
            {/* Stage 2 to 3 */}
            <path
              id="flow-path-2"
              d="M 275 85 L 340 85"
              stroke="#CBD5E1"
              strokeWidth="3.5"
              strokeDasharray="4 4"
            />
            {/* Stage 3 to 4 */}
            <path
              id="flow-path-3"
              d="M 445 85 L 510 85"
              stroke="#FDBA74"
              strokeWidth="4"
            />
            {/* Stage 4 to Green Branch (Fast Track Lolos) */}
            <path
              id="flow-branch-green"
              d="M 605 75 C 618 75, 625 42, 640 42"
              stroke="#10B981"
              strokeWidth="3.5"
              fill="none"
              strokeDasharray="3 3"
            />
            {/* Stage 4 to Red Branch (Antrean Investigasi) */}
            <path
              id="flow-branch-red"
              d="M 605 95 C 618 95, 625 128, 640 128"
              stroke="#EF4444"
              strokeWidth="4"
              fill="none"
            />

            {/* Animated Flow Packets Along the Paths */}
            {isFlowPlaying && (
              <>
                {/* Packets from Stage 1 -> 2 */}
                <circle r="4" fill="#0284C7" filter="url(#glow-packet)">
                  <animateMotion path="M 115 85 L 180 85" dur="1.3s" repeatCount="indefinite" />
                </circle>
                <circle r="2.5" fill="#38BDF8">
                  <animateMotion path="M 115 85 L 180 85" dur="1.3s" begin="0.65s" repeatCount="indefinite" />
                </circle>

                {/* Packets from Stage 2 -> 3 */}
                <circle r="4" fill="#0D9488" filter="url(#glow-packet)">
                  <animateMotion path="M 275 85 L 340 85" dur="1.3s" repeatCount="indefinite" />
                </circle>
                <circle r="2.5" fill="#2DD4BF">
                  <animateMotion path="M 275 85 L 340 85" dur="1.3s" begin="0.65s" repeatCount="indefinite" />
                </circle>

                {/* Packets from Stage 3 -> 4 (GNN Anomaly Stream) */}
                <circle r="4.5" fill="#F97316" filter="url(#glow-packet)">
                  <animateMotion path="M 445 85 L 510 85" dur="1.0s" repeatCount="indefinite" />
                </circle>
                <circle r="3" fill="#FBBF24">
                  <animateMotion path="M 445 85 L 510 85" dur="1.0s" begin="0.5s" repeatCount="indefinite" />
                </circle>

                {/* Branch Green Packets (Fast-Track 88%) */}
                <circle r="3.5" fill="#10B981" filter="url(#glow-packet)">
                  <animateMotion path="M 605 75 C 618 75, 625 42, 640 42" dur="1.1s" repeatCount="indefinite" />
                </circle>

                {/* Branch Red Packets (Ditandai Investigasi 12%) */}
                <circle r="4.5" fill="#EF4444" filter="url(#glow-packet)">
                  <animateMotion path="M 605 95 C 618 95, 625 128, 640 128" dur="0.85s" repeatCount="indefinite" />
                </circle>
              </>
            )}

            {/* Stage Nodes on the Diagram */}
            {/* Stage 1: Ingestion */}
            <g
              className="cursor-pointer"
              onClick={() => setSelectedPipelineStage(1)}
            >
              <rect
                x="20"
                y="55"
                width="95"
                height="60"
                rx="12"
                fill={selectedPipelineStage === 1 ? '#0284C7' : '#FFFFFF'}
                stroke="#0284C7"
                strokeWidth={selectedPipelineStage === 1 ? '3' : '2'}
              />
              <text
                x="67"
                y="80"
                textAnchor="middle"
                fill={selectedPipelineStage === 1 ? '#FFFFFF' : '#0369A1'}
                fontSize="12"
                fontWeight="800"
              >
                1. E-Klaim
              </text>
              <text
                x="67"
                y="98"
                textAnchor="middle"
                fill={selectedPipelineStage === 1 ? '#E0F2FE' : '#64748B'}
                fontSize="10"
                fontWeight="600"
              >
                Ingestion
              </text>
            </g>

            {/* Stage 2: Rule Engine */}
            <g
              className="cursor-pointer"
              onClick={() => setSelectedPipelineStage(2)}
            >
              <rect
                x="180"
                y="55"
                width="95"
                height="60"
                rx="12"
                fill={selectedPipelineStage === 2 ? '#0D9488' : '#FFFFFF'}
                stroke="#0D9488"
                strokeWidth={selectedPipelineStage === 2 ? '3' : '2'}
              />
              <text
                x="227"
                y="80"
                textAnchor="middle"
                fill={selectedPipelineStage === 2 ? '#FFFFFF' : '#0F766E'}
                fontSize="12"
                fontWeight="800"
              >
                2. Aturan
              </text>
              <text
                x="227"
                y="98"
                textAnchor="middle"
                fill={selectedPipelineStage === 2 ? '#CCFBF1' : '#64748B'}
                fontSize="10"
                fontWeight="600"
              >
                ICD & Medis
              </text>
            </g>

            {/* Stage 3: GNN */}
            <g
              className="cursor-pointer"
              onClick={() => setSelectedPipelineStage(3)}
            >
              <rect
                x="340"
                y="48"
                width="105"
                height="74"
                rx="14"
                fill={selectedPipelineStage === 3 ? '#EA580C' : '#FFFFFF'}
                stroke="#EA580C"
                strokeWidth={selectedPipelineStage === 3 ? '3.5' : '2.5'}
              />
              <text
                x="392"
                y="78"
                textAnchor="middle"
                fill={selectedPipelineStage === 3 ? '#FFFFFF' : '#C2410C'}
                fontSize="13"
                fontWeight="900"
              >
                3. GNN
              </text>
              <text
                x="392"
                y="98"
                textAnchor="middle"
                fill={selectedPipelineStage === 3 ? '#FFEDD5' : '#EA580C'}
                fontSize="10"
                fontWeight="700"
              >
                Graf K-04
              </text>
            </g>

            {/* Stage 4: Scoring */}
            <g
              className="cursor-pointer"
              onClick={() => setSelectedPipelineStage(4)}
            >
              <rect
                x="510"
                y="55"
                width="95"
                height="60"
                rx="12"
                fill={selectedPipelineStage === 4 ? '#E11D48' : '#FFFFFF'}
                stroke="#E11D48"
                strokeWidth={selectedPipelineStage === 4 ? '3' : '2'}
              />
              <text
                x="557"
                y="80"
                textAnchor="middle"
                fill={selectedPipelineStage === 4 ? '#FFFFFF' : '#BE123C'}
                fontSize="12"
                fontWeight="800"
              >
                4. Scoring
              </text>
              <text
                x="557"
                y="98"
                textAnchor="middle"
                fill={selectedPipelineStage === 4 ? '#FFE4E6' : '#64748B'}
                fontSize="10"
                fontWeight="600"
              >
                Prioritas
              </text>
            </g>

            {/* Branch Output Top: Lolos / Fast-track */}
            <g>
              <rect
                x="640"
                y="20"
                width="52"
                height="44"
                rx="8"
                fill="#DCFCE7"
                stroke="#10B981"
                strokeWidth="2"
              />
              <text x="666" y="38" textAnchor="middle" fill="#065F46" fontSize="10" fontWeight="800">
                Lolos
              </text>
              <text x="666" y="52" textAnchor="middle" fill="#047857" fontSize="8" fontWeight="700">
                88% Klaim
              </text>
            </g>

            {/* Branch Output Bottom: Investigasi */}
            <g
              className="cursor-pointer"
              onClick={() => onNavigate('queue')}
            >
              <rect
                x="640"
                y="106"
                width="52"
                height="44"
                rx="8"
                fill="#FEE2E2"
                stroke="#EF4444"
                strokeWidth="2.5"
              />
              <text x="666" y="125" textAnchor="middle" fill="#991B1B" fontSize="10" fontWeight="800">
                Antrean
              </text>
              <text x="666" y="139" textAnchor="middle" fill="#B91C1C" fontSize="8" fontWeight="700">
                12% Tinjau
              </text>
            </g>
          </svg>

          {/* Interactive Inspector for Selected Stage */}
          <div className="mt-3 p-3.5 bg-white rounded-2xl border border-gray-200/90 shadow-2xs flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0 shadow-2xs"
                style={{ backgroundColor: pipelineStages[selectedPipelineStage - 1].color }}
              >
                {selectedPipelineStage}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center flex-wrap gap-1.5">
                  <span className="font-extrabold text-xs sm:text-sm text-gray-900">
                    {pipelineStages[selectedPipelineStage - 1].title}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                    {pipelineStages[selectedPipelineStage - 1].badge}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold">
                    {pipelineStages[selectedPipelineStage - 1].rate}
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-gray-600 mt-1 leading-relaxed">
                  {pipelineStages[selectedPipelineStage - 1].desc}
                </p>
              </div>
            </div>

            {selectedPipelineStage === 3 ? (
              <button
                onClick={() => onNavigate('graph')}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-xs shadow-xs cursor-pointer active:scale-98 flex items-center justify-center gap-2 transition-all"
              >
                <Share2 size={14} className="shrink-0" />
                <span>Lihat Visualisasi Graf Klaster Jaringan K-04</span>
                <ChevronRight size={14} className="shrink-0 ml-auto opacity-75" />
              </button>
            ) : selectedPipelineStage === 5 ? (
              <button
                onClick={() => onNavigate('queue')}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-xs cursor-pointer active:scale-98 flex items-center justify-center gap-2 transition-all"
              >
                <CheckSquare size={14} className="shrink-0" />
                <span>Buka Antrean Investigasi Klaim</span>
                <ChevronRight size={14} className="shrink-0 ml-auto opacity-75" />
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Tabs Navigation for Detailed Statistics */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab('ringkasan')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'ringkasan'
              ? 'bg-[#008272] text-white shadow-xs'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          Sebaran 5 Pola Anomali
        </button>
        <button
          onClick={() => setActiveTab('faskes')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'faskes'
              ? 'bg-[#008272] text-white shadow-xs'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          Rasio Anomali Faskes
        </button>
      </div>

      {activeTab === 'ringkasan' ? (
        /* Breakdown by 5 Fraud Patterns */
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-200/90 shadow-sm flex flex-col gap-3.5">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-gray-900">
              Distribusi 5 Pola Kecurangan (Fraud Patterns)
            </h3>
            <p className="text-xs text-gray-500">
              Proporsi jumlah klaim dan nilai finansial yang ditandai oleh sistem
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            {fraudPatterns.map((pat) => (
              <div
                key={pat.name}
                onClick={() => onNavigate('queue')}
                className="p-3 rounded-2xl bg-gray-50/80 border border-gray-200/80 hover:bg-white hover:border-gray-300 transition-all cursor-pointer flex flex-col gap-1.5"
                title="Buka antrean untuk pola ini"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: pat.color }}
                    />
                    <span className="font-bold text-gray-900">{pat.name}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-bold text-gray-900">{pat.amount}</span>
                    <span className="text-gray-400">({pat.count} klaim)</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pat.pct}%`, backgroundColor: pat.color }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-gray-500">
                  <span>Kontribusi: {pat.pct}% dari total klaim berisiko</span>
                  <span className="text-[#008272] font-bold flex items-center gap-0.5">
                    Tinjau Kasus <ChevronRight size={12} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Breakdown by Top Facilities */
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-200/90 shadow-sm flex flex-col gap-3.5">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-gray-900">
              Fasilitas Kesehatan dengan Konsentrasi Anomali Tertinggi
            </h3>
            <p className="text-xs text-gray-500">
              FKRTL dan FKTP dengan frekuensi klaim berisiko di atas rata-rata kelompok sebaya
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-gray-100/80 text-gray-700 border-b border-gray-200">
                  <th className="p-2.5 font-bold">Kode & Nama Faskes</th>
                  <th className="p-2.5 font-bold">Klaim Ditandai</th>
                  <th className="p-2.5 font-bold">Rasio Anomali</th>
                  <th className="p-2.5 font-bold">Pola Dominan</th>
                  <th className="p-2.5 font-bold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {topFacilities.map((fac) => (
                  <tr key={fac.id} className="border-b border-gray-100 hover:bg-gray-50/80">
                    <td className="p-2.5">
                      <div className="font-bold text-gray-900 font-mono">{fac.id}</div>
                      <div className="text-[11px] text-gray-500 truncate max-w-xs">{fac.name}</div>
                    </td>
                    <td className="p-2.5 font-bold text-rose-700 font-mono">
                      {fac.flagged} <span className="text-gray-400 font-normal">/ {fac.total}</span>
                    </td>
                    <td className="p-2.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        {fac.rate}
                      </span>
                    </td>
                    <td className="p-2.5 font-medium text-gray-700">
                      {fac.pattern}
                    </td>
                    <td className="p-2.5 text-right">
                      <button
                        onClick={() => onNavigate('claim', 'C-10291')}
                        className="px-2.5 py-1 rounded-lg bg-[#008272] text-white hover:bg-[#006654] font-semibold text-[11px] shadow-2xs transition-colors cursor-pointer"
                      >
                        Periksa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Persistent Risk Notice */}
      <RiskNotice />
    </div>
  );
};

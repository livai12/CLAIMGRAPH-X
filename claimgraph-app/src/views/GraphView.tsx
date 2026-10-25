import React from 'react';
import { ArrowLeft, CheckSquare, Info } from 'lucide-react';
import { NetworkCommunity } from '../types';
import { GraphCanvas } from '../components/GraphCanvas';
import { RiskNotice } from '../components/RiskNotice';

interface GraphViewProps {
  networkData: NetworkCommunity;
  onBack: () => void;
  onOpenClaim: (claimId: string) => void;
  onStartInvestigation: (claimId: string) => void;
}

export const GraphView: React.FC<GraphViewProps> = ({
  networkData,
  onBack,
  onOpenClaim,
  onStartInvestigation,
}) => {
  return (
    <div className="flex flex-col gap-4 w-full max-w-4xl mx-auto pb-12">
      {/* Header Bar (matches PDF Page 4) */}
      <div className="bg-[#007A6C] rounded-2xl p-4 sm:p-5 text-white flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
            title="Kembali"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight">
              {networkData.title}
            </h1>
            <p className="text-xs text-teal-100 font-medium">
              {networkData.totalEntities} entitas dan {networkData.totalRelations} hubungan di sekitar klaim {networkData.focusedClaimId}
            </p>
          </div>
        </div>

        <button
          onClick={() => onStartInvestigation(networkData.focusedClaimId)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-xs sm:text-sm font-bold text-white transition-colors shadow-sm"
        >
          <CheckSquare size={16} />
          <span className="hidden sm:inline">Mulai Tinjauan</span>
        </button>
      </div>

      {/* Persistent Risk Notice (PRD Section 6.5) */}
      <RiskNotice />

      {/* Interactive Graph Canvas */}
      <GraphCanvas
        data={networkData}
        onSelectClaim={onOpenClaim}
        onStartInvestigation={onStartInvestigation}
      />
    </div>
  );
};

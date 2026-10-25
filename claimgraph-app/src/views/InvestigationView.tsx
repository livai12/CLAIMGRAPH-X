import React from 'react';
import { ArrowLeft, History } from 'lucide-react';
import { InvestigationCase, Role } from '../types';
import { InvestigationForm } from '../components/InvestigationForm';
import { RiskNotice } from '../components/RiskNotice';

interface InvestigationViewProps {
  caseData: InvestigationCase;
  currentRole: Role;
  onBack: () => void;
  onSaveDecision: (decision: 'VALIDATED' | 'DISMISSED' | 'ESCALATED', note: string) => void;
  onOpenClaim: (claimId: string) => void;
  onOpenAudit: () => void;
}

export const InvestigationView: React.FC<InvestigationViewProps> = ({
  caseData,
  currentRole,
  onBack,
  onSaveDecision,
  onOpenClaim,
  onOpenAudit,
}) => {
  return (
    <div className="flex flex-col gap-4 w-full max-w-4xl mx-auto pb-12">
      {/* Header Bar (matches PDF Page 5) */}
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
            <h1 className="text-lg sm:text-xl font-bold tracking-tight">Investigasi</h1>
            <p className="text-xs text-teal-100 font-medium font-mono">
              Kasus {caseData.caseId} untuk klaim {caseData.claimId}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAudit}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-xs font-semibold text-white border border-white/20 transition-colors"
        >
          <History size={14} />
          <span className="hidden sm:inline">Jejak Audit</span>
        </button>
      </div>

      {/* Persistent Risk Notice (PRD Section 6.5) */}
      <RiskNotice />

      {/* Investigation Stepper & Decision Form */}
      <InvestigationForm
        caseData={caseData}
        currentRole={currentRole}
        onSaveDecision={onSaveDecision}
        onOpenClaim={onOpenClaim}
      />
    </div>
  );
};

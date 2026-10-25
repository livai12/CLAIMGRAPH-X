import React, { useState } from 'react';
import { 
  Check, 
  X, 
  Share2, 
  CheckCircle2, 
  Search, 
  ShieldCheck, 
  AlertCircle,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { InvestigationCase, Role } from '../types';

interface InvestigationFormProps {
  caseData: InvestigationCase;
  currentRole: Role;
  onSaveDecision: (decision: 'VALIDATED' | 'DISMISSED' | 'ESCALATED', note: string) => void;
  onOpenClaim?: (claimId: string) => void;
}

export const InvestigationForm: React.FC<InvestigationFormProps> = ({
  caseData,
  currentRole,
  onSaveDecision,
  onOpenClaim,
}) => {
  const [checklist, setChecklist] = useState(caseData.checklist);
  const [selectedDecision, setSelectedDecision] = useState<'VALIDATED' | 'DISMISSED' | 'ESCALATED' | null>(
    caseData.decision || null
  );
  const [note, setNote] = useState(caseData.decisionNote || '');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSaved, setIsSaved] = useState(!!caseData.decision);

  const checkedCount = checklist.filter((item) => item.checked).length;
  const totalCount = checklist.length;
  const progressPercent = Math.round((checkedCount / totalCount) * 100);

  const handleToggleCheck = (id: string) => {
    if (isSaved) return;
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleConfirmSave = () => {
    if (!selectedDecision || note.trim().length < 10) return;

    onSaveDecision(selectedDecision, note);
    setIsSaved(true);
    setShowConfirmModal(false);

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {
      // Ignore if canvas not supported
    }
  };

  const canEdit = currentRole === 'investigator' && !isSaved;

  return (
    <div className="flex flex-col gap-5 max-w-3xl mx-auto w-full">
      {/* Claim Summary Header (matches PDF page 5) */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-[#008272] shrink-0">
            <FileText size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 leading-tight">
              {caseData.patternLabel}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              {caseData.relatedClaimsCount} klaim terkait senilai Rp{(caseData.totalExposure / 1000000).toFixed(2)} juta
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenClaim && (
            <button
              onClick={() => onOpenClaim(caseData.claimId)}
              className="hidden sm:inline-flex px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              Lihat Klaim
            </button>
          )}
          <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center font-mono font-bold text-xl text-orange-600">
            {caseData.riskScore}
          </div>
        </div>
      </div>

      {/* Stepper Status Progression (matches PDF page 5) */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between max-w-md mx-auto relative">
          <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-gray-200 -translate-y-1/2 z-0" />

          {/* Step 1: Baru */}
          <div className="flex flex-col items-center gap-1.5 z-10">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
              <Check size={16} strokeWidth={3} />
            </div>
            <span className="text-xs font-medium text-emerald-800">Baru</span>
          </div>

          {/* Step 2: Sedang Ditinjau */}
          <div className="flex flex-col items-center gap-1.5 z-10">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${
                isSaved ? 'bg-emerald-600 text-white' : 'bg-[#0284C7] text-white ring-4 ring-sky-100'
              }`}
            >
              {isSaved ? <Check size={16} strokeWidth={3} /> : <Search size={15} strokeWidth={2.5} />}
            </div>
            <span className="text-xs font-bold text-sky-800">Sedang ditinjau</span>
          </div>

          {/* Step 3: Keputusan */}
          <div className="flex flex-col items-center gap-1.5 z-10">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                isSaved
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white border-gray-300 text-gray-400'
              }`}
            >
              {isSaved ? <Check size={16} strokeWidth={3} /> : <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />}
            </div>
            <span className={`text-xs font-medium ${isSaved ? 'text-emerald-800 font-bold' : 'text-gray-500'}`}>
              Keputusan
            </span>
          </div>
        </div>
      </div>

      {/* Verification Checklist (matches PDF page 5) */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900">Verifikasi bukti</h3>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            {checkedCount} dari {totalCount} dicek
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-600 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Checklist items */}
        <div className="flex flex-col gap-2.5 mt-2">
          {checklist.map((item) => (
            <div
              key={item.id}
              onClick={() => handleToggleCheck(item.id)}
              className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                canEdit ? 'cursor-pointer hover:bg-gray-50' : 'cursor-default'
              } ${
                item.checked
                  ? 'bg-emerald-50/60 border-emerald-200'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-800">{item.label}</span>
              </div>

              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-colors ${
                  item.checked
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'bg-white border-gray-300'
                }`}
              >
                {item.checked && <Check size={16} strokeWidth={3} />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decision Section (matches PDF page 5) */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex flex-col gap-4">
        <h3 className="text-base font-bold text-gray-900">Keputusan</h3>

        {/* 3 Decision Option Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Validasi */}
          <button
            type="button"
            disabled={!canEdit}
            onClick={() => setSelectedDecision('VALIDATED')}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
              selectedDecision === 'VALIDATED'
                ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-200 shadow-sm'
                : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
            } ${!canEdit ? 'opacity-80 cursor-default' : ''}`}
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2">
              <CheckCircle2 size={22} />
            </div>
            <span className="font-bold text-sm">Validasi</span>
            <span className="text-[11px] text-gray-500 mt-0.5 text-center">Pola berisiko terkonfirmasi</span>
          </button>

          {/* Tolak */}
          <button
            type="button"
            disabled={!canEdit}
            onClick={() => setSelectedDecision('DISMISSED')}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
              selectedDecision === 'DISMISSED'
                ? 'border-gray-600 bg-gray-50 text-gray-800 ring-2 ring-gray-200 shadow-sm'
                : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
            } ${!canEdit ? 'opacity-80 cursor-default' : ''}`}
          >
            <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center mb-2">
              <X size={22} />
            </div>
            <span className="font-bold text-sm">Tolak</span>
            <span className="text-[11px] text-gray-500 mt-0.5 text-center">Peringatan tidak relevan</span>
          </button>

          {/* Eskalasi */}
          <button
            type="button"
            disabled={!canEdit}
            onClick={() => setSelectedDecision('ESCALATED')}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
              selectedDecision === 'ESCALATED'
                ? 'border-amber-600 bg-amber-50 text-amber-900 ring-2 ring-amber-200 shadow-sm'
                : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
            } ${!canEdit ? 'opacity-80 cursor-default' : ''}`}
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-2">
              <Share2 size={22} />
            </div>
            <span className="font-bold text-sm">Eskalasi</span>
            <span className="text-[11px] text-gray-500 mt-0.5 text-center">Untuk tinjauan lanjut</span>
          </button>
        </div>

        {/* Note input */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Catatan Pemeriksaan <span className="text-red-500">* (minimal 10 karakter)</span>
          </label>
          <textarea
            disabled={!canEdit}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Tuliskan justifikasi pemeriksaan, temuan verifikasi berkas, atau rekomendasi audit klinis..."
            rows={3}
            className="w-full text-xs sm:text-sm p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#008272] disabled:bg-gray-50 disabled:text-gray-500"
          />
          <div className="flex justify-between items-center text-[11px] text-gray-400 mt-1">
            <span>{note.length} karakter</span>
            {note.length > 0 && note.length < 10 && (
              <span className="text-amber-600 font-medium">Kurang {10 - note.length} karakter lagi</span>
            )}
          </div>
        </div>

        {/* Save CTA */}
        {canEdit ? (
          <button
            type="button"
            disabled={!selectedDecision || note.trim().length < 10}
            onClick={() => setShowConfirmModal(true)}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-sm sm:text-base text-white bg-[#008272] hover:bg-[#006654] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-md active:scale-[0.99]"
          >
            Simpan ke jejak audit
          </button>
        ) : (
          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs sm:text-sm flex items-center gap-2 font-medium">
            <ShieldCheck size={18} className="text-emerald-700 shrink-0" />
            <span>
              Keputusan telah tercatat secara permanen pada jejak audit ({caseData.decision || selectedDecision}) oleh {caseData.decidedBy || 'INV-07'}.
            </span>
          </div>
        )}

        <div className="text-center text-[11px] text-gray-400 pt-1">
          Tercatat bersama model {caseData.modelVersion}, aturan {caseData.ruleVersion}, dan waktu keputusan.
        </div>
      </div>

      {/* Confirmation Modal (PRD Section 6.8 & Appendix A) */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 flex flex-col gap-4">
            <div className="flex items-center gap-3 text-amber-700">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <AlertCircle size={22} />
              </div>
              <h3 className="font-bold text-lg text-gray-900">Konfirmasi Keputusan</h3>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed">
              Keputusan ini akan tercatat dalam jejak audit dan tidak dapat diubah. Apakah Anda yakin ingin menyimpan status ini?
            </p>

            <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-xs">
              <div className="font-bold text-gray-700">Keputusan: {selectedDecision}</div>
              <div className="text-gray-500 mt-1 line-clamp-2">Catatan: &ldquo;{note}&rdquo;</div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmSave}
                className="px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold text-white bg-[#008272] hover:bg-[#006654]"
              >
                Ya, Simpan Keputusan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

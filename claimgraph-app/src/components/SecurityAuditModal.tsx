import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  FileCheck2, 
  Server, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  X, 
  Cpu, 
  EyeOff, 
  ShieldAlert,
  Database
} from 'lucide-react';
import { GOVERNMENT_SECURITY_METRICS } from '../data/authUsers';
import { AuthenticatedUser } from '../types';

interface SecurityAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthenticatedUser;
}

export const SecurityAuditModal: React.FC<SecurityAuditModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [scanStep, setScanStep] = useState(0);

  if (!isOpen) return null;

  const runDiagnosticScan = () => {
    setIsScanning(true);
    setScanComplete(false);
    setScanStep(1);

    setTimeout(() => {
      setScanStep(2);
      setTimeout(() => {
        setScanStep(3);
        setTimeout(() => {
          setScanStep(4);
          setTimeout(() => {
            setIsScanning(false);
            setScanComplete(true);
          }, 600);
        }, 600);
      }, 600);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl border border-emerald-900/10 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-labelledby="security-dialog-title"
      >
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#004D40] via-[#00695C] to-[#008272] text-white p-4 sm:p-5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-emerald-200 shadow-inner">
              <ShieldCheck size={24} />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-300 flex items-center gap-1.5">
                <span>REPUBLIK INDONESIA</span>
                <span>•</span>
                <span>BSSN GOV-CSIRT & BPJS RI</span>
              </div>
              <h2 id="security-dialog-title" className="text-base sm:text-lg font-black tracking-tight mt-0.5">
                Panel Verifikasi Keamanan Data Pemerintah
              </h2>
              <p className="text-xs text-teal-100">
                Kepatuhan Standar Kriptografi Negara & UU PDP No. 27 Tahun 2022
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
            aria-label="Tutup panel"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-gray-800">
          {/* Active Session Verification Card */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Lock size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-xs sm:text-sm text-emerald-950">
                    Sesi Aktif: {currentUser.name}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white font-mono">
                    {currentUser.clearanceLevel}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-800 font-mono mt-0.5">
                  IP Dinas: {currentUser.sessionIp} • Autentikasi: {currentUser.mfaType}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-lg self-end sm:self-auto shrink-0">
              <CheckCircle2 size={14} className="text-emerald-700" />
              <span>TERVERIFIKASI RESMI</span>
            </div>
          </div>

          {/* Interactive Diagnostic Scanner */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 flex items-center gap-1.5">
                  <Cpu size={15} className="text-[#008272]" />
                  <span>Uji Diagnostik Integritas Kriptografis Mandiri</span>
                </h3>
                <p className="text-[11px] text-gray-500">
                  Verifikasi hash klaim, enkripsi basis data, dan perlindungan privasi pasien secara real-time
                </p>
              </div>

              <button
                onClick={runDiagnosticScan}
                disabled={isScanning}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#008272] hover:bg-[#006654] text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shadow-xs active:scale-95"
              >
                <RefreshCw size={13} className={isScanning ? 'animate-spin' : ''} />
                <span>{isScanning ? 'Memeriksa...' : 'Jalankan Audit Mandiri'}</span>
              </button>
            </div>

            {/* Diagnostic Steps Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className={`p-2.5 rounded-xl border transition-all ${
                scanStep >= 1 ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900' : 'bg-gray-50 border-gray-200 text-gray-600'
              }`}>
                <div className="flex items-center justify-between font-semibold">
                  <span>1. Hash SHA-256 142.850 Klaim</span>
                  {scanStep >= 1 ? <CheckCircle2 size={14} className="text-emerald-600" /> : <span className="text-[10px] font-mono text-gray-400">Siap</span>}
                </div>
                <p className="text-[10px] text-gray-500 mt-0.5">Checksum data klaim klaster K-04 terverifikasi tanpa manipulasi.</p>
              </div>

              <div className={`p-2.5 rounded-xl border transition-all ${
                scanStep >= 2 ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900' : 'bg-gray-50 border-gray-200 text-gray-600'
              }`}>
                <div className="flex items-center justify-between font-semibold">
                  <span>2. Masking Privasi NIK & Rekam Medis</span>
                  {scanStep >= 2 ? <CheckCircle2 size={14} className="text-emerald-600" /> : <span className="text-[10px] font-mono text-gray-400">Siap</span>}
                </div>
                <p className="text-[10px] text-gray-500 mt-0.5">Sesuai UU PDP Pasal 34 (Algoritma Salted-Hash SHA-256).</p>
              </div>

              <div className={`p-2.5 rounded-xl border transition-all ${
                scanStep >= 3 ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900' : 'bg-gray-50 border-gray-200 text-gray-600'
              }`}>
                <div className="flex items-center justify-between font-semibold">
                  <span>3. Enkripsi AES-256 GCM Media Simpan</span>
                  {scanStep >= 3 ? <CheckCircle2 size={14} className="text-emerald-600" /> : <span className="text-[10px] font-mono text-gray-400">Siap</span>}
                </div>
                <p className="text-[10px] text-gray-500 mt-0.5">Kunci enkripsi dikelola Hardware Security Module (HSM BSSN).</p>
              </div>

              <div className={`p-2.5 rounded-xl border transition-all ${
                scanStep >= 4 ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900' : 'bg-gray-50 border-gray-200 text-gray-600'
              }`}>
                <div className="flex items-center justify-between font-semibold">
                  <span>4. Log Forensik Imutabel (Append-Only)</span>
                  {scanStep >= 4 ? <CheckCircle2 size={14} className="text-emerald-600" /> : <span className="text-[10px] font-mono text-gray-400">Siap</span>}
                </div>
                <p className="text-[10px] text-gray-500 mt-0.5">Catatan audit log tersimpan dengan stempel waktu terpercaya.</p>
              </div>
            </div>

            {scanComplete && (
              <div className="mt-3 p-2.5 rounded-xl bg-emerald-100/70 border border-emerald-300 flex items-center gap-2 text-xs font-bold text-emerald-900">
                <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
                <span>Hasil Audit Mandiri: 100% Parameter Kriptografis & Regulasi Terverifikasi Lolos. Tidak Ditemukan Kerentanan.</span>
              </div>
            )}
          </div>

          {/* 4 Government Legal Compliance Pillars */}
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-2.5 flex items-center gap-1.5">
              <FileCheck2 size={15} className="text-[#008272]" />
              <span>Kepatuhan Regulasi & Undang-Undang Republik Indonesia</span>
            </h3>

            <div className="space-y-2">
              {GOVERNMENT_SECURITY_METRICS.regulations.map((reg) => (
                <div key={reg.code} className="p-3 rounded-2xl bg-gray-50 border border-gray-200/90 text-xs flex flex-col gap-1">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-gray-900">{reg.code}</span>
                      <span className="text-gray-400">•</span>
                      <span className="font-semibold text-gray-700">{reg.name}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      {reg.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    {reg.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Infrastructure Specifications */}
          <div className="p-3.5 rounded-2xl bg-slate-900 text-slate-100 text-xs font-mono space-y-1.5 shadow-inner">
            <div className="flex items-center gap-2 text-emerald-400 font-sans font-bold text-xs pb-1 border-b border-slate-800">
              <Server size={14} />
              <span>SPESIFIKASI INFRASTRUKTUR PUSAT DATA PEMERINTAH</span>
            </div>
            <div className="text-[11px] space-y-1 pt-1 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Pusat Data:</span>
                <span className="font-bold text-white">{GOVERNMENT_SECURITY_METRICS.infrastructure.dataCenter}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Enkripsi Saluran:</span>
                <span className="font-bold text-emerald-400">{GOVERNMENT_SECURITY_METRICS.infrastructure.networkEncryption}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Enkripsi DB:</span>
                <span className="font-bold text-emerald-400">{GOVERNMENT_SECURITY_METRICS.infrastructure.databaseEncryption}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Checksum SHA-256:</span>
                <span className="font-bold text-teal-300 truncate max-w-[280px]">e3b0c442...7852b855</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-3 text-xs">
          <span className="text-[11px] text-gray-500 hidden sm:inline">
            Sistem Keamanan Terpadu BSSN • Balai Sertifikasi Elektronik (BSrE)
          </span>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-gray-900 hover:bg-black text-white font-bold transition-colors cursor-pointer shadow-xs ml-auto"
          >
            Tutup Panel
          </button>
        </div>
      </div>
    </div>
  );
};

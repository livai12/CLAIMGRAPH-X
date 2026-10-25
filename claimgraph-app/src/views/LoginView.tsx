import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  User, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Building2, 
  FileText, 
  Fingerprint, 
  BadgeAlert,
  Sparkles,
  Layers
} from 'lucide-react';
import { GOVERNMENT_USERS } from '../data/authUsers';
import { AuthenticatedUser } from '../types';

interface LoginViewProps {
  onLogin: (user: AuthenticatedUser) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [authMode, setAuthMode] = useState<'quick' | 'form'>('quick');
  const [emailOrNpp, setEmailOrNpp] = useState('aris.prasetyo@bpjs-kesehatan.go.id');
  const [password, setPassword] = useState('••••••••••••');
  const [otpToken, setOtpToken] = useState('841920');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleSelectQuickUser = (user: AuthenticatedUser) => {
    setIsAuthenticating(true);
    setAuthError(null);
    setTimeout(() => {
      setIsAuthenticating(false);
      onLogin(user);
    }, 400);
  };

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthError(null);

    setTimeout(() => {
      // Find matching user by email or NPP, or fallback to first
      const found = GOVERNMENT_USERS.find(
        (u) =>
          u.email.toLowerCase() === emailOrNpp.toLowerCase() ||
          u.npp.toLowerCase() === emailOrNpp.toLowerCase()
      ) || GOVERNMENT_USERS[0];

      setIsAuthenticating(false);
      onLogin(found);
    }, 600);
  };

  const generateOtp = () => {
    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtpToken(randomOtp);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#042F2E] to-[#064E3B] text-white flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans">
      {/* Top Government Official Branding */}
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between border-b border-emerald-500/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#00A99D] to-[#10B981] flex items-center justify-center text-white font-serif font-black text-xl shadow-lg shadow-emerald-900/40 border border-white/20">
            C
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-white text-base sm:text-lg font-serif">
                CLAIMGRAPH-X
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Sistem Resmi BPJS
              </span>
            </div>
            <p className="text-[11px] text-emerald-200/80 font-mono">
              Badan Penyelenggara Jaminan Sosial Kesehatan RI • BSSN Gov-CSIRT
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-emerald-300 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
          <ShieldCheck size={16} className="text-emerald-400" />
          <span>Tingkat Keamanan 4 (BSSN)</span>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="w-full max-w-3xl mx-auto my-6 bg-white/95 text-gray-900 rounded-3xl p-5 sm:p-8 shadow-2xl border border-white/40 backdrop-blur-md">
        {/* Government Security & UU PDP Compliance Banner */}
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2.5 mb-6">
          <BadgeAlert size={18} className="text-amber-700 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <strong className="font-bold text-amber-950 block">PERINGATAN RESMI DATA PEMERINTAH INDONESIA (UU PDP NO. 27/2022)</strong>
            Sistem ini mengolah data klaim dan rekam medis JKN berkategori <em>Spesifik/Sensitif</em>. 
            Semua aktivitas masuk dan penelusuran klaim dicatat secara kriptografis dalam <strong>Jejak Audit Imutabel</strong> yang dipantau BSSN & Inspektorat.
          </div>
        </div>

        {/* Tab Selection: Quick Verified Accounts vs Manual SSO */}
        <div className="flex items-center gap-2 p-1.5 bg-gray-100 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => setAuthMode('quick')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              authMode === 'quick'
                ? 'bg-white text-[#008272] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Sparkles size={15} className="text-[#008272]" />
            <span>Pilih Akun Dinas (Login Cepat)</span>
          </button>

          <button
            type="button"
            onClick={() => setAuthMode('form')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              authMode === 'form'
                ? 'bg-white text-[#008272] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <KeyRound size={15} className="text-[#008272]" />
            <span>Login Kredensial Mandiri & 2FA</span>
          </button>
        </div>

        {/* Mode 1: Quick Verified Accounts Selection */}
        {authMode === 'quick' ? (
          <div>
            <div className="mb-4">
              <h2 className="text-sm sm:text-base font-extrabold text-gray-900">
                Pilih Kredensial Akun Pejabat / Pengguna Terverifikasi
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Pilih profil dinas yang berwenang untuk menguji sistem sesuai kewenangan masing-masing peran
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {GOVERNMENT_USERS.map((u) => (
                <div
                  key={u.id}
                  onClick={() => handleSelectQuickUser(u)}
                  className="p-3.5 rounded-2xl border border-gray-200 hover:border-[#008272] hover:bg-emerald-50/40 transition-all cursor-pointer group flex flex-col justify-between shadow-2xs hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-2xl ${u.avatarColor} text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0 group-hover:scale-105 transition-transform`}>
                      {u.npp.replace('-', '')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-extrabold text-xs sm:text-sm text-gray-900 group-hover:text-[#008272] transition-colors truncate">
                          {u.name}
                        </span>
                      </div>
                      <p className="text-[11px] font-bold text-emerald-800 truncate mt-0.5">
                        {u.title}
                      </p>
                      <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                        NIP: {u.nip}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[10px]">
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-semibold font-mono">
                      {u.clearanceLevel.split(' ')[0]}
                    </span>
                    <span className="text-[#008272] font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>Masuk Sesi</span>
                      <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Mode 2: Manual Credentials Form */
          <form onSubmit={handleFormLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Email Dinas / NPP Pegawai BPJS RI
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  required
                  value={emailOrNpp}
                  onChange={(e) => setEmailOrNpp(e.target.value)}
                  placeholder="contoh: aris.prasetyo@bpjs-kesehatan.go.id atau INV-07"
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#008272]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Kata Sandi Dinas (Terkunci Kebijakan SPBE)
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#008272]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-gray-700">
                  Kode Token 2FA (BSSN Authenticator 6-Digit)
                </label>
                <button
                  type="button"
                  onClick={generateOtp}
                  className="text-[11px] font-bold text-[#008272] hover:underline cursor-pointer"
                >
                  Generate Kode Baru
                </button>
              </div>
              <div className="relative">
                <Fingerprint size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otpToken}
                  onChange={(e) => setOtpToken(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-mono tracking-widest text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#008272]"
                />
              </div>
              <p className="text-[10px] text-gray-500 mt-1">
                Token berlaku 30 detik sesuai standar RFC 6238 TOTP BSSN.
              </p>
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#008272] to-[#0284C7] hover:from-[#006654] hover:to-[#0369A1] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <ShieldCheck size={16} />
              <span>{isAuthenticating ? 'Memverifikasi Kredensial Pemerintah...' : 'Masuk dengan Kredensial Terverifikasi'}</span>
            </button>
          </form>
        )}

        {/* Security Parameters Footer inside Card */}
        <div className="mt-6 pt-4 border-t border-gray-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-gray-500 font-mono">
          <div className="p-2 bg-gray-50 rounded-xl">
            <span className="block text-gray-400">ENKRIPSI</span>
            <strong className="text-gray-800">AES-256 GCM</strong>
          </div>
          <div className="p-2 bg-gray-50 rounded-xl">
            <span className="block text-gray-400">KEPATUHAN</span>
            <strong className="text-gray-800">UU PDP 27/2022</strong>
          </div>
          <div className="p-2 bg-gray-50 rounded-xl">
            <span className="block text-gray-400">SERTIFIKASI</span>
            <strong className="text-gray-800">BSSN Level 4</strong>
          </div>
          <div className="p-2 bg-gray-50 rounded-xl">
            <span className="block text-gray-400">IP DINAS</span>
            <strong className="text-gray-800">10.240.18.92</strong>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="w-full max-w-4xl mx-auto text-center text-[11px] text-emerald-200/60 pb-2">
        <p>© 2026 BPJS Kesehatan RI • Sistem Klaim Terintegrasi JKN • Hak Cipta Dilindungi Undang-Undang Republik Indonesia</p>
      </div>
    </div>
  );
};

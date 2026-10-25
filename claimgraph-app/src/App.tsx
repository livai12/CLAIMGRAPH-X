import React, { useState } from 'react';
import { 
  INITIAL_CLAIMS, 
  NETWORK_K04, 
  INITIAL_INVESTIGATION, 
  INITIAL_AUDIT_LOG 
} from './data/mockData';
import { GOVERNMENT_USERS } from './data/authUsers';
import { Claim, Role, InvestigationCase, AuditEntry, AuthenticatedUser } from './types';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { SatuSehatStatusBar } from './components/SatuSehatStatusBar';
import { SecurityAuditModal } from './components/SecurityAuditModal';
import { LoginView } from './views/LoginView';
import { DashboardView } from './views/DashboardView';
import { QueueView } from './views/QueueView';
import { ClaimDetailView } from './views/ClaimDetailView';
import { GraphView } from './views/GraphView';
import { InvestigationView } from './views/InvestigationView';
import { EvaluationView } from './views/EvaluationView';
import { AuditLogView } from './views/AuditLogView';
import { RulesView } from './views/RulesView';
import { FacilitiesView } from './views/FacilitiesView';
import { SyntheticDataView } from './views/SyntheticDataView';
import { StatisticsView } from './views/StatisticsView';
import { ShieldCheck, Lock } from 'lucide-react';

export function App() {
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(GOVERNMENT_USERS[0]);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState<boolean>(false);
  const [claims, setClaims] = useState<Claim[]>(INITIAL_CLAIMS);
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [selectedClaimId, setSelectedClaimId] = useState<string>('C-10291');
  const [currentRole, setCurrentRole] = useState<Role>('investigator');
  const [viewMode, setViewMode] = useState<'mobile-mockup' | 'desktop-workstation'>('mobile-mockup');
  const [investigationCase, setInvestigationCase] = useState<InvestigationCase>(INITIAL_INVESTIGATION);
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>(INITIAL_AUDIT_LOG);

  const selectedClaim = claims.find((c) => c.claimId === selectedClaimId) || claims[0];

  // Login handler
  const handleLogin = (user: AuthenticatedUser) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    const loginEntry: AuditEntry = {
      auditId: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      actorId: user.npp,
      role: user.role,
      action: 'LOGIN_GOV_SSO',
      entityType: 'SESSION',
      entityId: `SES-${Math.floor(100000 + Math.random() * 900000)}`,
      modelVersion: 'GNN-v2.4-GovCertified',
      ruleVersion: 'RULE-2026.10-BSSN',
      note: `Autentikasi Kredensial Terpercaya: ${user.name} (${user.title}), NIP: ${user.nip}. Metode: ${user.mfaType}. Sesi IP: ${user.sessionIp}. Kepatuhan UU PDP No. 27/2022 TERVERIFIKASI RESMI.`,
    };
    setAuditEntries((prev) => [loginEntry, ...prev]);
  };

  // Logout handler
  const handleLogout = () => {
    if (currentUser) {
      const logoutEntry: AuditEntry = {
        auditId: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: new Date().toISOString(),
        actorId: currentUser.npp,
        role: currentUser.role,
        action: 'LOGOUT_SESSION',
        entityType: 'SESSION',
        entityId: 'SES-TERM',
        modelVersion: 'GNN-v2.4-GovCertified',
        ruleVersion: 'RULE-2026.10-BSSN',
        note: `Pengguna ${currentUser.name} (${currentUser.npp}) mengunci sesi kerja dinas.`,
      };
      setAuditEntries((prev) => [logoutEntry, ...prev]);
    }
    setCurrentUser(null);
  };

  // Switch user handler
  const handleSwitchUser = (user: AuthenticatedUser) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    const switchEntry: AuditEntry = {
      auditId: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      actorId: user.npp,
      role: user.role,
      action: 'LOGIN_GOV_SSO',
      entityType: 'SESSION',
      entityId: `SES-${Math.floor(100000 + Math.random() * 900000)}`,
      modelVersion: 'GNN-v2.4-GovCertified',
      ruleVersion: 'RULE-2026.10-BSSN',
      note: `Alih Sesi Akun Dinas: ${user.name} (${user.title}), NIP: ${user.nip}. Hak Akses: ${user.clearanceLevel}.`,
    };
    setAuditEntries((prev) => [switchEntry, ...prev]);
  };

  // Navigation handler
  const handleNavigate = (tab: string, claimId?: string) => {
    if (claimId) {
      setSelectedClaimId(claimId);
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Investigation decision handler (immutable append-only audit trail)
  const handleSaveDecision = (decision: 'VALIDATED' | 'DISMISSED' | 'ESCALATED', note: string) => {
    const now = new Date().toISOString();

    // 1. Update investigation case state
    setInvestigationCase((prev) => ({
      ...prev,
      decision,
      decisionNote: note,
      status: decision === 'VALIDATED' ? 'VALIDATED' : decision === 'DISMISSED' ? 'DISMISSED' : 'ESCALATED',
      decidedAt: now,
      decidedBy: currentUser ? currentUser.npp : 'INV-07',
    }));

    // 2. Update claim status in claims table
    setClaims((prev) =>
      prev.map((c) =>
        c.claimId === selectedClaimId
          ? {
              ...c,
              status: decision === 'VALIDATED' ? 'VALIDATED' : decision === 'DISMISSED' ? 'DISMISSED' : 'ESCALATED',
            }
          : c
      )
    );

    // 3. Append immutable audit log row (PRD Section 5.5 FR-HIT-3)
    const newAuditEntry: AuditEntry = {
      auditId: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: now,
      actorId: currentUser ? currentUser.npp : 'INV-07',
      role: currentRole,
      action: 'DECISION_SAVED',
      entityType: 'INVESTIGATION',
      entityId: investigationCase.caseId,
      riskScoreAtTime: selectedClaim.riskScore,
      modelVersion: investigationCase.modelVersion,
      ruleVersion: investigationCase.ruleVersion,
      note: `Keputusan [${decision}] oleh ${currentUser?.name || 'Investigator'}: ${note}`,
    };

    setAuditEntries((prev) => [newAuditEntry, ...prev]);
  };

  // Content rendering based on current active tab
  const renderTabContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <DashboardView
            claims={claims}
            onNavigate={(tab, claimId) => handleNavigate(tab, claimId)}
          />
        );
      case 'queue':
        return (
          <QueueView
            claims={claims}
            onSelectClaim={(id) => handleNavigate('claim', id)}
          />
        );
      case 'claim':
        return (
          <ClaimDetailView
            claim={selectedClaim}
            onBack={() => handleNavigate('queue')}
            onOpenGraph={() => handleNavigate('graph')}
            onOpenStatistics={() => handleNavigate('statistics')}
            onStartInvestigation={() => handleNavigate('investigation')}
            onSelectClaim={(id) => handleNavigate('claim', id)}
          />
        );
      case 'graph':
        return (
          <GraphView
            networkData={NETWORK_K04}
            onBack={() => handleNavigate('claim', selectedClaimId)}
            onOpenClaim={(id) => handleNavigate('claim', id)}
            onStartInvestigation={() => handleNavigate('investigation')}
          />
        );
      case 'statistics':
        return (
          <StatisticsView
            onBack={() => handleNavigate('claim', selectedClaimId)}
            onNavigate={(tab, claimId) => handleNavigate(tab, claimId)}
            onSelectClaim={(id) => handleNavigate('claim', id)}
          />
        );
      case 'investigation':
        return (
          <InvestigationView
            caseData={investigationCase}
            currentRole={currentRole}
            onBack={() => handleNavigate('claim', selectedClaimId)}
            onSaveDecision={handleSaveDecision}
            onOpenClaim={(id) => handleNavigate('claim', id)}
            onOpenAudit={() => handleNavigate('audit')}
          />
        );
      case 'evaluation':
        return <EvaluationView />;
      case 'audit':
        return <AuditLogView entries={auditEntries} />;
      case 'rules':
        return <RulesView />;
      case 'facilities':
        return <FacilitiesView />;
      case 'synthetic':
        return <SyntheticDataView />;
      default:
        return (
          <DashboardView
            claims={claims}
            onNavigate={(tab, claimId) => handleNavigate(tab, claimId)}
          />
        );
    }
  };

  // If not logged in, render the official Government Login Portal
  if (!currentUser) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6F8]">
      {/* Official Government Security Banner (UU PDP & BSSN Gov-CSIRT) */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 text-emerald-300 text-[10px] font-mono px-3 sm:px-6 py-1.5 flex items-center justify-between border-b border-emerald-500/20 shadow-xs">
        <div className="flex items-center gap-2 truncate">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="truncate">
            🔒 SISTEM PEMERINTAH TERENKRIPSI [AES-256 GCM] • KEPATUHAN UU PDP NO. 27/2022 • STANDAR BSSN TINGKAT 4
          </span>
        </div>
        <div className="hidden md:flex items-center gap-3 shrink-0 text-emerald-200">
          <span>IP DINAS: {currentUser.sessionIp}</span>
          <span>•</span>
          <span className="text-white font-bold bg-white/10 px-2 py-0.5 rounded">
            {currentUser.clearanceLevel}
          </span>
        </div>
      </div>

      {/* Top Header Bar with Government Profile & Security Trigger */}
      <Header
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
        onOpenSecurityModal={() => setIsSecurityModalOpen(true)}
        onLogout={handleLogout}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Main Presentation Layout */}
      {viewMode === 'mobile-mockup' ? (
        /* Mobile App Frame (Matches 100% CLAIMGRAPH-X.pdf) */
        <div className="flex-1 flex flex-col items-center justify-start p-2 sm:p-4 bg-gradient-to-b from-gray-100 to-gray-200">
          {/* Quick Header Notification / Mode Helper */}
          <div className="text-center text-xs text-gray-500 font-medium mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Mode Mockup Mobile: Menampilkan tata letak sesuai file <strong>CLAIMGRAPH-X.pdf</strong></span>
          </div>

          <div className="mobile-device-frame relative flex flex-col h-[844px] max-h-[92vh] bg-white shadow-2xl">
            {/* Phone Notch */}
            <div className="mobile-notch">
              <div className="mobile-speaker" />
            </div>

            {/* SatuSehat Top Status Bar (12.34, LTE, Battery) */}
            <div className="bg-[#D8EDFC] pt-3">
              <SatuSehatStatusBar />
            </div>

            {/* Scrollable Content inside Mobile Phone Viewport */}
            <main className="flex-1 overflow-y-auto scrollbar-none bg-[#F8FAFC]">
              {renderTabContent()}
            </main>

            {/* Mobile Bottom Navigation Bar */}
            <Navigation
              currentTab={currentTab}
              onTabChange={(tab) => handleNavigate(tab)}
              currentRole={currentRole}
              mode="mobile-bar"
            />
          </div>
        </div>
      ) : (
        /* Desktop Enterprise Workstation Layout (PRD Section 6.5) */
        <div className="flex-1 flex w-full max-w-[1440px] mx-auto overflow-hidden">
          {/* Desktop Left Sidebar */}
          <Navigation
            currentTab={currentTab}
            onTabChange={(tab) => handleNavigate(tab)}
            currentRole={currentRole}
            mode="desktop-sidebar"
          />

          {/* Desktop Content Area */}
          <main className="flex-1 p-6 overflow-y-auto max-h-[calc(100vh-60px)]">
            {renderTabContent()}
          </main>
        </div>
      )}

      {/* Interactive Government Security & UU PDP Compliance Modal */}
      <SecurityAuditModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        currentUser={currentUser}
      />
    </div>
  );
}

export default App;

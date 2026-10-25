// Types conforming to CLAIMGRAPH-X PRD and UI/UX specification

export type Role = 'investigator' | 'analyst' | 'viewer';

export interface AuthenticatedUser {
  id: string;
  npp: string;
  nip: string;
  name: string;
  title: string;
  agency: string;
  department: string;
  role: Role;
  clearanceLevel: 'Tingkat 2 (Terbatas)' | 'Tingkat 3 (Rahasia/Investigasi)' | 'Tingkat 4 (Super-Admin Siber)';
  email: string;
  avatarColor: string;
  mfaType: string;
  sessionIp: string;
  permissions: string[];
}

export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export type ClaimStatus = 'NEW' | 'UNDER_REVIEW' | 'VALIDATED' | 'DISMISSED' | 'ESCALATED';

export type RiskPattern = 
  | 'possible_cloning' 
  | 'possible_repeat_billing' 
  | 'possible_phantom_billing' 
  | 'possible_upcoding' 
  | 'referral_anomaly';

export interface SignalScores {
  ruleScore: number;       // out of 30 in display (or 0-100)
  statisticalScore: number; // out of 25 in display
  graphScore: number;       // out of 25 in display
  temporalScore: number;    // out of 20 in display
}

export interface EvidenceItem {
  id: string;
  category: 'Graf' | 'Aturan' | 'Kemiripan' | 'Waktu' | 'Statistik';
  text: string;
  ruleId?: string;
  strength?: 'Kuat' | 'Sedang' | 'Lemah';
}

export interface TimelineEvent {
  date: string;
  time?: string;
  title: string;
  description: string;
  isCurrent?: boolean;
}

export interface Claim {
  claimId: string;
  patientId: string;
  practitionerId: string;
  practitionerName?: string;
  facilityId: string;
  facilityType: 'FKTP' | 'FKRTL';
  serviceDate: string;
  submissionDate: string;
  claimAmount: number;
  riskScore: number;
  riskLevel: RiskLevel;
  primaryPattern: RiskPattern;
  patternLabel: string;
  status: ClaimStatus;
  priorityScore: number;
  signals: SignalScores;
  diagnosisCode: string;
  diagnosisDesc?: string;
  procedureCodes: string[];
  explanation: {
    why: string;
    thresholdNote?: string;
    nextStep: string;
  };
  evidenceList: EvidenceItem[];
  timeline: TimelineEvent[];
  networkId?: string;
  isSeedDemo?: boolean;
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'patient' | 'claim' | 'practitioner' | 'facility' | 'code';
  subType?: string;
  x?: number;
  y?: number;
  isFocused?: boolean;
  isFlagged?: boolean;
  connectionsCount?: number;
  details?: {
    title: string;
    description: string;
    relationCount?: number;
    claimAmount?: number;
  };
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  isEvidencePath?: boolean; // Bold orange path
  label?: string;
}

export interface NetworkCommunity {
  networkId: string;
  title: string;
  totalEntities: number;
  totalRelations: number;
  focusedClaimId: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  summary: {
    practitionerId: string;
    connectionCount: number;
    description: string;
    claimCount: number;
    totalAmount: number;
  };
}

export interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  note?: string;
}

export interface InvestigationCase {
  caseId: string;
  claimId: string;
  alertId: string;
  patternLabel: string;
  relatedClaimsCount: number;
  totalExposure: number;
  riskScore: number;
  status: ClaimStatus;
  checklist: ChecklistItem[];
  decision?: 'VALIDATED' | 'DISMISSED' | 'ESCALATED';
  decisionNote?: string;
  modelVersion: string;
  ruleVersion: string;
  decidedAt?: string;
  decidedBy?: string;
}

export interface AuditEntry {
  auditId: string;
  timestamp: string;
  actorId: string;
  role: Role;
  action: string;
  entityType: string;
  entityId: string;
  riskScoreAtTime?: number;
  modelVersion: string;
  ruleVersion: string;
  note?: string;
}

export interface DetectionRule {
  ruleId: string;
  pattern: string;
  name: string;
  logic: string;
  strength: 'Kuat' | 'Sedang' | 'Lemah';
  template: string;
  weight: number;
  active: boolean;
}

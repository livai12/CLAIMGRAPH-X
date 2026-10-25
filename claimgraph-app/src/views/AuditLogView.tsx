import React, { useState } from 'react';
import { History, Download, Filter, Search } from 'lucide-react';
import { AuditEntry } from '../types';

interface AuditLogViewProps {
  entries: AuditEntry[];
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({ entries }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('all');

  const filteredEntries = entries.filter((item) => {
    const matchesAction = selectedAction === 'all' || item.action === selectedAction;
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      !q ||
      item.entityId.toLowerCase().includes(q) ||
      item.actorId.toLowerCase().includes(q) ||
      item.auditId.toLowerCase().includes(q) ||
      (item.note && item.note.toLowerCase().includes(q));

    return matchesAction && matchesSearch;
  });

  const exportCSV = () => {
    const headers = [
      'audit_id',
      'timestamp',
      'actor_id',
      'role',
      'action',
      'entity_type',
      'entity_id',
      'risk_score_at_time',
      'model_version',
      'rule_version',
      'note',
    ];

    const rows = filteredEntries.map((e) => [
      e.auditId,
      e.timestamp,
      e.actorId,
      e.role,
      e.action,
      e.entityType,
      e.entityId,
      e.riskScoreAtTime ?? '',
      e.modelVersion,
      e.ruleVersion,
      `"${(e.note || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `jejak_audit_claimgraph_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-[#007A6C] rounded-2xl p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Jejak Audit</h1>
          <p className="text-xs sm:text-sm text-teal-100">
            Catatan log append-only permanen untuk kepatuhan tata kelola pemeriksaan klaim JKN
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-[#007A6C] hover:bg-gray-50 text-xs sm:text-sm font-bold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Download size={15} />
          <span>Ekspor CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-2.5">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari ID audit, nomor klaim, aktor..."
            className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#008272]"
          />
        </div>

        <select
          value={selectedAction}
          onChange={(e) => setSelectedAction(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 bg-white rounded-xl border border-gray-200 text-xs sm:text-sm font-medium text-gray-700 focus:outline-none"
        >
          <option value="all">Semua Tindakan</option>
          <option value="LOGIN_GOV_SSO">LOGIN_GOV_SSO (Autentikasi)</option>
          <option value="SECURITY_CHECK">SECURITY_CHECK (Audit Kripto)</option>
          <option value="ALERT_GENERATED">ALERT_GENERATED</option>
          <option value="REVIEW_STARTED">REVIEW_STARTED</option>
          <option value="DECISION_SAVED">DECISION_SAVED</option>
        </select>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm overflow-hidden flex flex-col gap-3">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600">
                <th className="p-3 font-semibold">Waktu & ID</th>
                <th className="p-3 font-semibold">Aktor / Peran</th>
                <th className="p-3 font-semibold">Tindakan</th>
                <th className="p-3 font-semibold">Entitas Terkait</th>
                <th className="p-3 font-semibold">Versi Model/Rule</th>
                <th className="p-3 font-semibold">Catatan Keputusan</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((row) => (
                <tr key={row.auditId} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-3">
                    <span className="font-mono font-bold text-gray-900 block">{row.auditId}</span>
                    <span className="text-[11px] text-gray-400">
                      {new Date(row.timestamp).toLocaleString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold text-gray-800 block">{row.actorId}</span>
                    <span className="text-[10px] uppercase font-bold text-gray-400">{row.role}</span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        row.action === 'DECISION_SAVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : row.action === 'REVIEW_STARTED'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {row.action}
                    </span>
                  </td>
                  <td className="p-3 font-mono font-medium text-gray-800">
                    {row.entityId}
                    {row.riskScoreAtTime && (
                      <span className="text-gray-400 block text-[10px]">
                        Skor: {row.riskScoreAtTime}
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-gray-500 font-mono text-[11px]">
                    {row.modelVersion} / {row.ruleVersion}
                  </td>
                  <td className="p-3 text-gray-600 max-w-xs">{row.note || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

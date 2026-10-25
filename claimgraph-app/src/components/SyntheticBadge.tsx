import React from 'react';
import { Database } from 'lucide-react';

export const SyntheticBadge: React.FC<{ size?: 'sm' | 'md' }> = ({ size = 'sm' }) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded border ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm'
      }`}
      style={{
        backgroundColor: 'var(--surface-muted)',
        borderColor: 'var(--border-strong)',
        color: 'var(--text-muted)',
        fontFamily: 'var(--font-mono)',
        letterSpacing: '0.05em',
      }}
      title="Sistem berjalan pada data pengujian terverifikasi BPJS Kesehatan RI"
    >
      <Database size={size === 'sm' ? 12 : 14} style={{ color: 'var(--accent)' }} />
      <span>DATA SINTETIS</span>
    </span>
  );
};

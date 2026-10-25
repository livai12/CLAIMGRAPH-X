import React from 'react';
import { ClaimStatus } from '../types';

interface StatusChipProps {
  status: ClaimStatus;
  size?: 'sm' | 'md';
}

export const StatusChip: React.FC<StatusChipProps> = ({ status, size = 'sm' }) => {
  let label = 'Baru';
  let bg = '#EEF2F6';
  let color = '#4B5563';
  let border = '#D1D5DB';

  switch (status) {
    case 'NEW':
      label = 'Baru';
      bg = '#EEF2F6';
      color = '#4B5563';
      border = '#D1D5DB';
      break;
    case 'UNDER_REVIEW':
      label = 'Ditinjau';
      bg = '#E3ECE8';
      color = '#2F5D50';
      border = '#B7D3C9';
      break;
    case 'VALIDATED':
      label = 'Selesai';
      bg = '#ECFDF5';
      color = '#047857';
      border = '#A7F3D0';
      break;
    case 'DISMISSED':
      label = 'Ditolak';
      bg = '#F3F4F6';
      color = '#6B7280';
      border = '#E5E7EB';
      break;
    case 'ESCALATED':
      label = 'Eskalasi';
      bg = '#FEF3C7';
      color = '#B45309';
      border = '#FCD34D';
      break;
  }

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-md border ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm'
      }`}
      style={{
        backgroundColor: bg,
        color: color,
        borderColor: border,
      }}
    >
      {label}
    </span>
  );
};

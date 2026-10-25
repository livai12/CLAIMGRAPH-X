import React from 'react';
import { Building2, Users, BarChart } from 'lucide-react';

export const FacilitiesView: React.FC = () => {
  const peerGroups = [
    { id: 'PG-01', name: 'RS Rujukan Tipe B Jawa Barat', members: 14, medianClaim: 8400000, p90Claim: 14200000, referralRate: '22%' },
    { id: 'PG-02', name: 'RS Khusus Tipe C Jabodetabek', members: 18, medianClaim: 6200000, p90Claim: 9800000, referralRate: '18%' },
    { id: 'PG-03', name: 'FKTP Puskesmas Perkotaan', members: 42, medianClaim: 1850000, p90Claim: 2900000, referralRate: '15%' },
    { id: 'PG-04', name: 'Klinik Pratama Swasta', members: 26, medianClaim: 1400000, p90Claim: 2100000, referralRate: '24%' },
  ];

  return (
    <div className="flex flex-col gap-4 w-full max-w-4xl mx-auto pb-12">
      <div className="bg-[#007A6C] rounded-2xl p-5 text-white shadow-sm">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Kelompok Sebaya & Fasilitas (Peer Groups)</h1>
        <p className="text-xs sm:text-sm text-teal-100 mt-0.5">
          Basis pembanding statistik klaim untuk mendeteksi deviasi harga dan konsentrasi rujukan faskes
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {peerGroups.map((pg) => (
          <div key={pg.id} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                {pg.id}
              </span>
              <span className="text-xs text-gray-500 font-medium">{pg.members} Faskes Terdaftar</span>
            </div>

            <h3 className="font-bold text-base text-gray-900">{pg.name}</h3>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 text-xs">
              <div className="bg-gray-50 p-2.5 rounded-xl">
                <span className="text-gray-400 block text-[11px]">Median Nilai Klaim</span>
                <span className="font-bold text-gray-900 font-mono">
                  Rp{pg.medianClaim.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="bg-gray-50 p-2.5 rounded-xl">
                <span className="text-gray-400 block text-[11px]">Persentil-90 (P90)</span>
                <span className="font-bold text-gray-900 font-mono">
                  Rp{pg.p90Claim.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-gray-500 flex items-center justify-between">
              <span>Rata-rata Tingkat Rujukan Keluar:</span>
              <span className="font-bold text-gray-800">{pg.referralRate}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

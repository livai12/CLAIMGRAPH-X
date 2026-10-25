import React, { useState } from 'react';
import { Plus, Minus, RotateCcw, Table as TableIcon, Network, Play, Pause, Zap } from 'lucide-react';
import { NetworkCommunity, GraphNode } from '../types';

interface GraphCanvasProps {
  data: NetworkCommunity;
  onSelectClaim?: (claimId: string) => void;
  onStartInvestigation?: (claimId: string) => void;
}

export const GraphCanvas: React.FC<GraphCanvasProps> = ({
  data,
  onSelectClaim,
  onStartInvestigation,
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<GraphNode>(
    data.nodes.find((n) => n.id === 'NAKES-0417') || data.nodes[0]
  );
  const [viewMode, setViewMode] = useState<'canvas' | 'table'>('canvas');
  const [isFlowActive, setIsFlowActive] = useState<boolean>(true);
  const [flowSpeed, setFlowSpeed] = useState<1 | 2>(1);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.15, 2));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.15, 0.6));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="flex flex-col w-full h-full bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Top Controls Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-200 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-700">{data.title}</span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-500">
            {data.totalEntities} entitas, {data.totalRelations} hubungan
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Animated Flow Toggle & Speed */}
          <button
            onClick={() => setIsFlowActive((prev) => !prev)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded border font-semibold text-xs transition-colors cursor-pointer ${
              isFlowActive
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
            }`}
            title="Animasi aliran data transfer"
          >
            {isFlowActive ? <Pause size={12} className="text-emerald-700" /> : <Play size={12} className="text-gray-600" />}
            <span className="hidden sm:inline">Aliran Data:</span>
            <span>{isFlowActive ? 'Aktif' : 'Jeda'}</span>
            {isFlowActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
          </button>
          {isFlowActive && (
            <button
              onClick={() => setFlowSpeed((prev) => (prev === 1 ? 2 : 1))}
              className="px-2 py-1 rounded border border-gray-300 bg-white hover:bg-gray-50 text-[11px] font-bold text-gray-700 font-mono cursor-pointer"
              title="Ubah kecepatan transfer data"
            >
              {flowSpeed}x
            </button>
          )}

          <button
            onClick={() => setViewMode(viewMode === 'canvas' ? 'table' : 'canvas')}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium cursor-pointer"
            title="Alihkan ke tampilan tabel ramah aksesibilitas"
          >
            {viewMode === 'canvas' ? (
              <>
                <TableIcon size={13} /> Tampilkan Tabel
              </>
            ) : (
              <>
                <Network size={13} /> Tampilkan Graf
              </>
            )}
          </button>
          {viewMode === 'canvas' && (
            <div className="flex items-center border border-gray-300 rounded bg-white">
              <button
                onClick={handleZoomIn}
                className="p-1 hover:bg-gray-100 border-r border-gray-200 cursor-pointer"
                title="Perbesar"
              >
                <Plus size={14} />
              </button>
              <button
                onClick={handleZoomOut}
                className="p-1 hover:bg-gray-100 border-r border-gray-200 cursor-pointer"
                title="Perkecil"
              >
                <Minus size={14} />
              </button>
              <button
                onClick={handleReset}
                className="p-1 hover:bg-gray-100 cursor-pointer"
                title="Kembalikan posisi"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      {viewMode === 'table' ? (
        /* Accessible Table View */
        <div className="p-4 overflow-auto max-h-[480px]">
          <h4 className="font-semibold text-sm text-gray-800 mb-2">Daftar Hubungan & Edges (Jejak Graf)</h4>
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700 border-b">
                <th className="p-2 font-semibold">Simpul Sumber (Source)</th>
                <th className="p-2 font-semibold">Jenis Hubungan</th>
                <th className="p-2 font-semibold">Simpul Tujuan (Target)</th>
                <th className="p-2 font-semibold">Status Jalur</th>
              </tr>
            </thead>
            <tbody>
              {data.edges.map((edge) => (
                <tr key={edge.id} className="border-b hover:bg-gray-50">
                  <td className="p-2 font-mono font-medium">{edge.source}</td>
                  <td className="p-2 text-gray-600">Terhubung Langsung</td>
                  <td className="p-2 font-mono font-medium">{edge.target}</td>
                  <td className="p-2">
                    {edge.isEvidencePath ? (
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-800">
                        Jalur Bukti Utama (Aliran Replikasi)
                      </span>
                    ) : (
                      <span className="text-gray-400">Hubungan Normal</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Interactive SVG Graph Area */
        <div
          className="relative w-full h-[400px] sm:h-[480px] bg-[#FAF9F6] overflow-hidden select-none cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Subtle grid pattern background */}
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage: 'radial-gradient(#CFC8BA 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          <svg
            className="w-full h-full"
            viewBox="0 0 1000 620"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: '50% 50%',
              transition: isDragging ? 'none' : 'transform 0.15s ease-out',
            }}
          >
            <defs>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
              </filter>
              <filter id="glow-orange" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="edgeOrangeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#EA580C" />
                <stop offset="50%" stopColor="#FB923C" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
              <style>{`
                @keyframes flowOrangeDash {
                  from { stroke-dashoffset: 40; }
                  to { stroke-dashoffset: 0; }
                }
                @keyframes flowCyanDash {
                  from { stroke-dashoffset: 32; }
                  to { stroke-dashoffset: 0; }
                }
                .flowing-dash-orange {
                  stroke-dasharray: 6 8;
                  animation: flowOrangeDash ${1.2 / flowSpeed}s linear infinite;
                }
                .flowing-dash-cyan {
                  stroke-dasharray: 4 6;
                  animation: flowCyanDash ${2.0 / flowSpeed}s linear infinite;
                }
              `}</style>
            </defs>

            {/* Edges with Base Line, Flowing Dashes, and Animated Data Packets */}
            <g className="edges">
              {data.edges.map((edge) => {
                const s = data.nodes.find((n) => n.id === edge.source);
                const t = data.nodes.find((n) => n.id === edge.target);
                if (!s || !t) return null;

                const sx = s.x || 0;
                const sy = s.y || 0;
                const tx = t.x || 0;
                const ty = t.y || 0;

                const durPrimary = edge.isEvidencePath ? `${1.4 / flowSpeed}s` : `${2.4 / flowSpeed}s`;
                const durSecondary = `${1.4 / flowSpeed}s`;

                return (
                  <g key={edge.id}>
                    {/* Base Structural Line */}
                    <line
                      x1={sx}
                      y1={sy}
                      x2={tx}
                      y2={ty}
                      stroke={edge.isEvidencePath ? '#EA580C' : '#CBD5E1'}
                      strokeWidth={edge.isEvidencePath ? 4 : 1.5}
                      strokeOpacity={edge.isEvidencePath ? 0.35 : 0.7}
                      strokeLinecap="round"
                    />

                    {/* Flowing Dash Gradient Line */}
                    {isFlowActive && (
                      <line
                        x1={sx}
                        y1={sy}
                        x2={tx}
                        y2={ty}
                        stroke={edge.isEvidencePath ? 'url(#edgeOrangeGrad)' : '#38BDF8'}
                        strokeWidth={edge.isEvidencePath ? 3 : 1.5}
                        className={edge.isEvidencePath ? 'flowing-dash-orange' : 'flowing-dash-cyan'}
                        strokeLinecap="round"
                      />
                    )}

                    {/* Animated Traveling Data Packet Spheres */}
                    {isFlowActive && (
                      <>
                        {/* Primary Traveling Data Packet */}
                        <circle
                          r={edge.isEvidencePath ? 4.5 : 3}
                          fill={edge.isEvidencePath ? '#F97316' : '#0284C7'}
                          filter={edge.isEvidencePath ? 'url(#glow-orange)' : 'url(#glow-cyan)'}
                        >
                          <animateMotion
                            path={`M ${sx} ${sy} L ${tx} ${ty}`}
                            dur={durPrimary}
                            repeatCount="indefinite"
                          />
                        </circle>

                        {/* Secondary trailing particle on evidence anomaly path */}
                        {edge.isEvidencePath && (
                          <circle
                            r={3}
                            fill="#FBBF24"
                            filter="url(#glow-orange)"
                          >
                            <animateMotion
                              path={`M ${sx} ${sy} L ${tx} ${ty}`}
                              dur={durSecondary}
                              begin={`${0.7 / flowSpeed}s`}
                              repeatCount="indefinite"
                            />
                          </circle>
                        )}
                      </>
                    )}
                  </g>
                );
              })}
            </g>

            {/* Nodes */}
            <g className="nodes">
              {data.nodes.map((node) => {
                const nx = node.x || 0;
                const ny = node.y || 0;
                const isSelected = selectedNode?.id === node.id;

                let nodeContent = null;

                if (node.type === 'patient') {
                  // White circle with grey border
                  nodeContent = (
                    <g
                      className="cursor-pointer group"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedNode(node);
                      }}
                    >
                      <circle
                        cx={nx}
                        cy={ny}
                        r={24}
                        fill="#FFFFFF"
                        stroke={isSelected ? '#2F5D50' : '#94A3B8'}
                        strokeWidth={isSelected ? 3 : 2}
                        filter="url(#shadow)"
                      />
                      <text
                        x={nx}
                        y={ny + 38}
                        textAnchor="middle"
                        fill="#1F2937"
                        fontSize="11"
                        fontFamily="var(--font-mono)"
                        fontWeight="600"
                      >
                        {node.label}
                      </text>
                    </g>
                  );
                } else if (node.type === 'claim') {
                  // Claim rounded rectangle
                  const isFocus = node.isFocused;
                  const bgFill = isFocus ? '#EA580C' : '#E0F2FE';
                  const strokeColor = isFocus ? '#C2410C' : '#0284C7';
                  const textColor = isFocus ? '#FFFFFF' : '#0369A1';

                  nodeContent = (
                    <g
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedNode(node);
                        if (onSelectClaim) onSelectClaim(node.id);
                      }}
                    >
                      {isFocus && (
                        <rect
                          x={nx - 42}
                          y={ny - 26}
                          width={84}
                          height={52}
                          rx={10}
                          fill="none"
                          stroke="#FDBA74"
                          strokeWidth={4}
                          strokeOpacity={0.8}
                        />
                      )}
                      <rect
                        x={nx - 38}
                        y={ny - 22}
                        width={76}
                        height={44}
                        rx={8}
                        fill={bgFill}
                        stroke={strokeColor}
                        strokeWidth={isSelected ? 3 : 2}
                        filter="url(#shadow)"
                      />
                      <text
                        x={nx}
                        y={ny + 5}
                        textAnchor="middle"
                        fill={textColor}
                        fontSize="12"
                        fontFamily="var(--font-mono)"
                        fontWeight="700"
                      >
                        {node.label}
                      </text>
                    </g>
                  );
                } else if (node.type === 'practitioner') {
                  // Practitioner deep blue circle
                  nodeContent = (
                    <g
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedNode(node);
                      }}
                    >
                      <circle
                        cx={nx}
                        cy={ny}
                        r={38}
                        fill="#0284C7"
                        stroke="#0369A1"
                        strokeWidth={isSelected ? 4 : 2.5}
                        filter="url(#shadow)"
                      />
                      <circle cx={nx} cy={ny} r={44} fill="none" stroke="#BAE6FD" strokeWidth={2} />
                      <text
                        x={nx}
                        y={ny + 54}
                        textAnchor="middle"
                        fill="#0F172A"
                        fontSize="12"
                        fontFamily="var(--font-mono)"
                        fontWeight="700"
                      >
                        {node.label}
                      </text>
                    </g>
                  );
                } else if (node.type === 'facility') {
                  // Facility green rounded square
                  nodeContent = (
                    <g
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedNode(node);
                      }}
                    >
                      <rect
                        x={nx - 35}
                        y={ny - 25}
                        width={70}
                        height={50}
                        rx={8}
                        fill="#059669"
                        stroke="#047857"
                        strokeWidth={isSelected ? 3 : 2}
                        filter="url(#shadow)"
                      />
                      <text
                        x={nx}
                        y={ny + 44}
                        textAnchor="middle"
                        fill="#065F46"
                        fontSize="12"
                        fontFamily="var(--font-mono)"
                        fontWeight="700"
                      >
                        {node.label}
                      </text>
                    </g>
                  );
                } else if (node.type === 'code') {
                  // Dashed code chip
                  nodeContent = (
                    <g
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedNode(node);
                      }}
                    >
                      <rect
                        x={nx - 45}
                        y={ny - 18}
                        width={90}
                        height={36}
                        rx={6}
                        fill="#F8FAFC"
                        stroke="#64748B"
                        strokeWidth={1.5}
                        strokeDasharray="4 3"
                        filter="url(#shadow)"
                      />
                      <text
                        x={nx}
                        y={ny + 5}
                        textAnchor="middle"
                        fill="#334155"
                        fontSize="11"
                        fontFamily="var(--font-mono)"
                        fontWeight="600"
                      >
                        {node.label}
                      </text>
                    </g>
                  );
                }

                return <g key={node.id}>{nodeContent}</g>;
              })}
            </g>
          </svg>

          {/* Graph Legend (matching PDF page 4 bottom bar) */}
          <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-200 shadow-sm text-xs flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full border border-gray-400 bg-white" />
              <span className="text-gray-600">Peserta</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-2.5 rounded bg-sky-200 border border-sky-600" />
              <span className="text-gray-600">Klaim</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-sky-600 border border-sky-800" />
              <span className="text-gray-600">Nakes</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-600" />
              <span className="text-gray-600">Fasilitas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-2.5 rounded border border-dashed border-gray-500 bg-gray-100" />
              <span className="text-gray-600">Kode</span>
            </div>
            <div className="flex items-center gap-1.5 pl-1 border-l border-gray-300">
              <span className="w-4 h-1 bg-orange-600 rounded-full" />
              <span className="font-semibold text-orange-700">Jalur bukti (Anomali)</span>
            </div>
            {isFlowActive && (
              <div className="flex items-center gap-1.5 pl-2 border-l border-gray-300 text-emerald-700 font-semibold text-[10px]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Aliran transfer data ({flowSpeed}x)</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Selected Entity Details Drawer (matches bottom of PDF page 4) */}
      {selectedNode && (
        <div className="p-4 bg-white border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-wider font-semibold text-gray-500">
                {selectedNode.type === 'practitioner'
                  ? 'Tenaga kesehatan'
                  : selectedNode.type === 'claim'
                  ? 'Klaim JKN'
                  : selectedNode.type === 'facility'
                  ? 'Fasilitas Kesehatan'
                  : selectedNode.type === 'patient'
                  ? 'Peserta'
                  : 'Kode Diagnosa / Tindakan'}
              </span>
              {selectedNode.connectionsCount && (
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  {selectedNode.connectionsCount} hubungan
                </span>
              )}
            </div>

            <h3 className="text-base sm:text-lg font-bold text-gray-900 font-mono">
              {selectedNode.label}
            </h3>

            <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-2xl leading-relaxed">
              {selectedNode.details?.description ||
                'Entitas terkait dalam jaringan pola klaim yang sedang diperiksa.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            {selectedNode.type === 'claim' && onSelectClaim && (
              <button
                onClick={() => onSelectClaim(selectedNode.id)}
                className="w-full sm:w-auto px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm bg-[#008272] text-white hover:bg-[#006654] transition-colors shadow-sm"
              >
                Buka klaim {selectedNode.label}
              </button>
            )}

            {selectedNode.type === 'practitioner' && (
              <button
                onClick={() => onSelectClaim && onSelectClaim('C-10291')}
                className="w-full sm:w-auto px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm bg-[#008272] text-white hover:bg-[#006654] transition-colors shadow-sm"
              >
                Buka klaim C-10291
              </button>
            )}

            {onStartInvestigation && (
              <button
                onClick={() => onStartInvestigation('C-10291')}
                className="w-full sm:w-auto px-3.5 py-2 rounded-lg font-semibold text-xs sm:text-sm bg-orange-600 text-white hover:bg-orange-700 transition-colors shadow-sm"
              >
                Mulai Tinjauan
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

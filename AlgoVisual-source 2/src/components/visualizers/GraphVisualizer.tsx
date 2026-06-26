import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { VisualStep, GraphEdgeHighlight } from '@/types/algo';

const CX = 280, CY = 240, BASE_R = 160;
const NODE_R = 30;

function circularLayout(n: number): Array<{ x: number; y: number }> {
  if (n <= 1) return [{ x: CX, y: CY }];
  return Array.from({ length: n }, (_, i) => {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    return { x: CX + BASE_R * Math.cos(angle), y: CY + BASE_R * Math.sin(angle) };
  });
}

function edgeKey(a: number, b: number): string { return `${Math.min(a, b)}-${Math.max(a, b)}`; }

export default function GraphVisualizer({ step }: { step: VisualStep }) {
  const { data, activeIndices, markedIndices, graphEdges } = step;
  const activeSet = useMemo(() => new Set(activeIndices), [activeIndices]);
  const markedSet = useMemo(() => new Set(markedIndices), [markedIndices]);

  // data = [N, dist0, dist1, ..., dist(N-1)]
  const n = data[0] || 5;
  const dists = data.slice(1, n + 1);
  // Deduplicate edges from graphEdges (each step may have partial list)
  const allEdges = useMemo(() => {
    if (graphEdges && graphEdges.length > 0) return graphEdges;
    return [];
  }, [graphEdges]);
  const positions = useMemo(() => circularLayout(n), [n]);

  const activeEdgeSet = useMemo(() => {
    const s = new Set<string>();
    if (graphEdges) for (const e of graphEdges) if (e.active) s.add(edgeKey(e.from, e.to));
    return s;
  }, [graphEdges]);

  const NODE_LABELS = 'ABCDEFGHIJKLMNOP'.split('');

  const VIEW_W = 560, VIEW_H = 500;

  return (
    <div className="flex items-center justify-center h-full w-full relative bg-canvas-bg">
      <svg width={VIEW_W} height={VIEW_H} viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="overflow-visible">
        <defs>
          <marker id="arrActive" viewBox="0 0 10 10" refX={9} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f9e2af" />
          </marker>
          <filter id="glow"><feGaussianBlur stdDeviation="3" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>

        {/* Draw all known edges */}
        {allEdges.map((e) => {
          const from = e.from, to = e.to, w = e.weight ?? 1;
          const fp = positions[from], tp = positions[to];
          if (!fp || !tp) return null;
          const active = activeEdgeSet.has(edgeKey(from, to));
          const midX = (fp.x + tp.x) / 2, midY = (fp.y + tp.y) / 2;
          const dx = tp.x - fp.x, dy = tp.y - fp.y, len = Math.sqrt(dx * dx + dy * dy);
          const ox = midX + (-dy / len) * 18, oy = midY + (dx / len) * 18;
          return (
            <g key={`e-${from}-${to}`}>
              <motion.line x1={fp.x} y1={fp.y} x2={tp.x} y2={tp.y}
                stroke={active ? '#f9e2af' : '#45475a'} strokeWidth={active ? 2.5 : 1.2}
                filter={active ? 'url(#glow)' : undefined} />
              <rect x={ox - 14} y={oy - 10} width={28} height={20} rx={5}
                fill={active ? '#2a2a1e' : '#1e1e2e'} stroke={active ? '#f9e2af' : '#313244'} strokeWidth={1} />
              <text x={ox} y={oy + 5} textAnchor="middle" className={`text-[10px] font-mono font-bold ${active ? 'fill-ide-warning' : 'fill-ide-text-muted'}`}>{w}</text>
            </g>
          );
        })}

        {/* Nodes */}
        {positions.map((pos, idx) => {
          const dist = dists[idx] ?? -1;
          const isActive = activeSet.has(idx);
          const isMarked = markedSet.has(idx);
          const isInf = dist === -1 || !isFinite(dist);
          let fc = 'rgba(137,180,250,0.08)', sc = '#585b70';
          if (isActive) { fc = 'rgba(249,226,175,0.28)'; sc = '#f9e2af'; }
          else if (isMarked) { fc = 'rgba(166,227,161,0.22)'; sc = '#a6e3a1'; }
          else if (idx === 0) { fc = 'rgba(137,180,250,0.15)'; sc = '#89b4fa'; }

          return (
            <motion.g key={`n-${idx}`} initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: isActive ? 1.12 : 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18, delay: idx * 0.04 }}>
              {isActive && <motion.circle cx={pos.x} cy={pos.y} r={NODE_R + 5} fill="none" stroke="#f9e2af" strokeWidth={2} strokeDasharray="5 3"
                animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} style={{ transformOrigin: `${pos.x}px ${pos.y}px` }} />}
              <circle cx={pos.x} cy={pos.y} r={NODE_R} fill={fc} stroke={sc} strokeWidth={isActive ? 2.5 : 1.5} />
              <text x={pos.x} y={pos.y - 4} textAnchor="middle" className="text-sm font-bold fill-ide-text">{NODE_LABELS[idx]}</text>
              <text x={pos.x} y={pos.y + 16} textAnchor="middle" className={`text-[10px] font-mono font-bold ${isInf ? 'fill-ide-text-muted/40' : isActive ? 'fill-ide-warning' : isMarked ? 'fill-ide-accent2' : 'fill-ide-text-muted'}`}>
                {isInf ? '∞' : dist}
              </text>
            </motion.g>
          );
        })}
      </svg>
      <div className="absolute bottom-3 left-3 flex gap-3 text-[10px] font-mono text-ide-text-muted/60">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full border-2 border-yellow-400 bg-yellow-400/20" />松弛中</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full border-2 border-green-400 bg-green-400/20" />已确定</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full border border-ide-text-muted/40 bg-white/5" />未访问</span>
      </div>
    </div>
  );
}

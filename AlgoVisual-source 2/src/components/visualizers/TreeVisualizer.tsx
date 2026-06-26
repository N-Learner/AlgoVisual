import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { VisualStep } from '@/types/algo';

const NODE_R = 24;
const LEVEL_H = 90;
const SVG_W = 800;
const PAD = 60;

interface TreeNode {
  x: number;
  y: number;
  value: number;
  index: number;
  level: number;
  isActive: boolean;
  isMarked: boolean;
}

const LEVEL_COLORS = ['#89b4fa', '#a6e3a1', '#f9e2af', '#cba6f7', '#f38ba8', '#fab387', '#94e2d5'];

/**
 * Recursive subtree-region layout.
 * Each node's x = midpoint of its left and right subtree boundaries.
 * Left child gets [leftBound, parentX], right child gets [parentX, rightBound].
 *
 * This guarantees: left children always left of parent, right children always right,
 * producing a natural triangular tree shape regardless of balance.
 */
function layoutTree(
  data: number[],
  activeSet: Set<number>,
  markedSet: Set<number>,
): { nodes: TreeNode[]; edges: Array<[number, number]>; maxY: number } {
  // Build index→visible node map (skip zeros)
  const valid = new Set<number>();
  for (let i = 0; i < data.length; i++) {
    if (data[i] !== 0 && data[i] !== undefined) valid.add(i);
  }

  if (valid.size === 0) return { nodes: [], edges: [], maxY: 200 };

  const nodes: TreeNode[] = [];
  const edges: Array<[number, number]> = [];

  /** Get visible child at position childIdx; walk through zeros if needed */
  function visibleChild(parentIdx: number, childIdx: number): number | null {
    if (childIdx >= data.length) return null;
    if (valid.has(childIdx)) return childIdx;
    // Recurse into grandchildren to find visible descendant
    const l = visibleChild(parentIdx, 2 * childIdx + 1);
    if (l !== null) return l;
    const r = visibleChild(parentIdx, 2 * childIdx + 2);
    return r;
  }

  // Recursive layout: assign x based on region [left, right]
  const rootIdx = [...valid][0];
  let maxY = 50;

  function layout(idx: number, leftBound: number, rightBound: number, depth: number) {
    const x = (leftBound + rightBound) / 2;
    const y = 50 + depth * LEVEL_H;
    maxY = Math.max(maxY, y + NODE_R);

    nodes.push({
      x, y,
      value: data[idx],
      index: idx,
      level: depth,
      isActive: activeSet.has(idx),
      isMarked: markedSet.has(idx),
    });

    const leftChild = visibleChild(idx, 2 * idx + 1);
    const rightChild = visibleChild(idx, 2 * idx + 2);

    if (leftChild !== null) {
      edges.push([idx, leftChild]);
      layout(leftChild, leftBound, x, depth + 1);
    }
    if (rightChild !== null) {
      edges.push([idx, rightChild]);
      layout(rightChild, x, rightBound, depth + 1);
    }
  }

  layout(rootIdx, PAD, SVG_W - PAD, 0);
  return { nodes, edges, maxY };
}

export default function TreeVisualizer({ step }: { step: VisualStep }) {
  const { data, activeIndices, markedIndices } = step;
  const activeSet = useMemo(() => new Set(activeIndices), [activeIndices]);
  const markedSet = useMemo(() => new Set(markedIndices), [markedIndices]);

  const { nodes, edges, maxY } = useMemo(
    () => layoutTree(data, activeSet, markedSet),
    [data, activeSet, markedSet],
  );

  const viewH = maxY + 80;
  const maxDepth = nodes.length > 0 ? Math.max(...nodes.map((n) => n.level)) : 0;

  return (
    <div className="flex items-center justify-center h-full w-full overflow-auto p-2">
      <svg width={SVG_W} height={viewH} viewBox={`0 0 ${SVG_W} ${viewH}`}>
        {/* Depth guide lines */}
        {Array.from({ length: maxDepth + 1 }, (_, d) => {
          const y = 10 + d * LEVEL_H;
          return (
            <g key={`level-${d}`}>
              <line
                x1={PAD} y1={y} x2={SVG_W - PAD} y2={y}
                stroke={LEVEL_COLORS[d % LEVEL_COLORS.length]}
                strokeWidth={0.5} strokeDasharray="6 4" opacity={0.25}
              />
              <text
                x={PAD - 4} y={y + 4} textAnchor="end"
                className="text-[10px] font-mono fill-ide-text-muted/40"
              >
                L{d}
              </text>
            </g>
          );
        })}

        {/* Edges */}
        {edges.map(([from, to]) => {
          const p = nodes.find((n) => n.index === from);
          const c = nodes.find((n) => n.index === to);
          if (!p || !c) return null;
          const hl = p.isActive || c.isActive;
          return (
            <motion.line
              key={`e-${from}-${to}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              x1={p.x} y1={p.y + NODE_R}
              x2={c.x} y2={c.y - NODE_R}
              stroke={hl ? '#f9e2af' : '#45475a'}
              strokeWidth={hl ? 2 : 1.2}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => (
          <motion.g
            key={`n-${node.index}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: node.isActive ? 1.15 : 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: node.level * 0.04 }}
          >
            <circle
              cx={node.x} cy={node.y} r={NODE_R}
              fill={
                node.isActive ? 'rgba(249,226,175,0.25)'
                  : node.isMarked ? 'rgba(166,227,161,0.2)'
                  : 'rgba(137,180,250,0.1)'
              }
              stroke={
                node.isActive ? '#f9e2af'
                  : node.isMarked ? '#a6e3a1'
                  : LEVEL_COLORS[node.level % LEVEL_COLORS.length]
              }
              strokeWidth={node.isActive ? 2.5 : 1.5}
            />
            <text
              x={node.x} y={node.y + 5} textAnchor="middle"
              className={`text-xs font-mono font-bold ${
                node.isActive ? 'fill-ide-warning'
                  : node.isMarked ? 'fill-ide-accent2'
                  : 'fill-ide-text'
              }`}
            >
              {node.value}
            </text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}

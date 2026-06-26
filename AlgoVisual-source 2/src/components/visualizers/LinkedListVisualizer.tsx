import { motion } from 'framer-motion';
import type { VisualStep } from '@/types/algo';

interface LinkedListVisualizerProps {
  step: VisualStep;
}

const NODE_SIZE = 56;
const ARROW_LENGTH = 48;
const NODE_GAP = NODE_SIZE + ARROW_LENGTH;

export default function LinkedListVisualizer({ step }: LinkedListVisualizerProps) {
  const { data, activeIndices, markedIndices } = step;
  const activeSet = new Set(activeIndices);
  const markedSet = new Set(markedIndices);

  const totalWidth = data.length * NODE_GAP + 60;
  const startX = Math.max(40, (800 - totalWidth) / 2);

  return (
    <div className="flex items-center justify-center h-full w-full overflow-x-auto">
      <svg
        width={Math.max(800, totalWidth + 80)}
        height={180}
        viewBox={`0 0 ${Math.max(800, totalWidth + 80)} 180`}
        className="overflow-visible"
      >
        {/* Head pointer label */}
        <text x={startX - 20} y={70} textAnchor="end" className="text-[11px] font-mono fill-ide-text-muted">
          head
        </text>
        <line
          x1={startX - 10}
          y1={75}
          x2={startX}
          y2={75}
          stroke="#6c7086"
          strokeWidth={1.5}
          markerEnd="url(#arrowHead)"
          strokeDasharray="4 2"
        />

        {data.map((value, idx) => {
          const cx = startX + idx * NODE_GAP;
          const isActive = activeSet.has(idx);
          const isMarked = markedSet.has(idx);

          return (
            <g key={idx}>
              {/* Arrow from previous node */}
              {idx > 0 && (
                <motion.line
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  x1={startX + (idx - 1) * NODE_GAP + NODE_SIZE / 2 + 4}
                  y1={75}
                  x2={cx - NODE_SIZE / 2}
                  y2={75}
                  stroke={isActive ? '#89b4fa' : '#45475a'}
                  strokeWidth={2}
                  markerEnd="url(#arrowHead)"
                />
              )}

              {/* Node */}
              <motion.g
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                  opacity: 1,
                  scale: isActive ? 1.1 : 1,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: idx * 0.08 }}
              >
                <rect
                  x={cx - NODE_SIZE / 2}
                  y={75 - NODE_SIZE / 2}
                  width={NODE_SIZE}
                  height={NODE_SIZE}
                  rx={8}
                  fill={isActive ? 'rgba(249, 226, 175, 0.2)' : isMarked ? 'rgba(166, 227, 161, 0.15)' : 'rgba(137, 180, 250, 0.1)'}
                  stroke={isActive ? '#f9e2af' : isMarked ? '#a6e3a1' : '#89b4fa'}
                  strokeWidth={isActive ? 2.5 : 1.5}
                />

                {/* Divider line — data | next */}
                <line
                  x1={cx + 4}
                  y1={75 - NODE_SIZE / 2 + 4}
                  x2={cx + 4}
                  y2={75 + NODE_SIZE / 2 - 4}
                  stroke={isActive ? '#f9e2af' : '#45475a'}
                  strokeWidth={1}
                  opacity={0.5}
                />

                {/* Value */}
                <text
                  x={cx - NODE_SIZE / 4}
                  y={75 + 4}
                  textAnchor="middle"
                  className={`text-xs font-mono font-bold ${isActive ? 'fill-ide-warning' : 'fill-ide-text'}`}
                >
                  {value}
                </text>

                {/* Next pointer area */}
                <text
                  x={cx + NODE_SIZE / 4 + 4}
                  y={75 + 4}
                  textAnchor="middle"
                  className={`text-[10px] font-mono ${idx < data.length - 1 ? 'fill-ide-text-muted/60' : 'fill-ide-text-muted/40'}`}
                >
                  {idx < data.length - 1 ? '→' : '·'}
                </text>
              </motion.g>

              {/* Index label */}
              <text
                x={cx}
                y={75 + NODE_SIZE / 2 + 18}
                textAnchor="middle"
                className={`text-[9px] font-mono ${isActive ? 'fill-ide-text' : 'fill-ide-text-muted/50'}`}
              >
                [{idx}]
              </text>
            </g>
          );
        })}

        {/* Null terminator */}
        <line
          x1={startX + (data.length - 1) * NODE_GAP + NODE_SIZE / 2 + 4}
          y1={75}
          x2={startX + data.length * NODE_GAP - NODE_SIZE / 2}
          y2={75}
          stroke="#45475a"
          strokeWidth={1.5}
          markerEnd="url(#arrowHead)"
        />
        <text
          x={startX + data.length * NODE_GAP - NODE_SIZE / 2 + 12}
          y={78}
          className="text-[10px] font-mono fill-ide-text-muted/60"
        >
          null
        </text>

        {/* Arrow marker definition */}
        <defs>
          <marker
            id="arrowHead"
            viewBox="0 0 10 10"
            refX={8}
            refY={5}
            markerWidth={7}
            markerHeight={7}
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#45475a" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}

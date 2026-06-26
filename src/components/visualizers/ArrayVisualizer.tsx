import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { VisualStep, ActionType } from '@/types/algo';

interface ArrayVisualizerProps {
  step: VisualStep;
  horizontal?: boolean;
  showChars?: boolean;
}

const BAR_CONTAINER_H = 320; // px — fixed container height for percentage calc

const ACTION_COLORS: Record<ActionType, string> = {
  compare: '#f9e2af',
  swap: '#f38ba8',
  move: '#89b4fa',
  insert: '#a6e3a1',
  delete: '#f38ba8',
  highlight: '#cba6f7',
  complete: '#a6e3a1',
  'recurse-in': '#89dceb',
  'recurse-out': '#94e2d5',
  divide: '#fab387',
  merge: '#f5c2e7',
  relax: '#f9e2af',
  visit: '#74c7ec',
  backtrack: '#a6adc8',
  'fill-cell': '#f5c2e7',
  traceback: '#fab387',
};

const DEFAULT_FILL = '#89b4fa';
const MARKED_FILL = '#74c7a8';
const ACTIVE_BORDER = 3;
const NORMAL_BORDER = 1;

function ArrayBar({
  value, index, maxValue, isActive, isMarked, actionType, barWidth, showChars,
}: {
  value: number; index: number; maxValue: number;
  isActive: boolean; isMarked: boolean; actionType: ActionType; barWidth: number;
  showChars?: boolean;
}) {
  // Compute pixel height from value. Minimum 6px so bar is always visible.
  const barH = maxValue > 0 ? Math.max(6, (value / maxValue) * (BAR_CONTAINER_H - 40)) : 6;

  // Color logic
  let fill = DEFAULT_FILL;
  if (isMarked) fill = MARKED_FILL;
  else if (isActive) fill = ACTION_COLORS[actionType] ?? DEFAULT_FILL;

  const borderW = isActive ? ACTIVE_BORDER : NORMAL_BORDER;
  const borderColor = isActive
    ? (ACTION_COLORS[actionType] ?? DEFAULT_FILL)
    : 'rgba(137, 180, 250, 0.35)';
  const glow = isActive ? `0 0 12px ${fill}66` : undefined;

  return (
    <div className="flex flex-col items-center" style={{ width: barWidth }}>
      {/* Value above the bar */}
      <motion.span
        animate={{
          scale: isActive ? 1.2 : 1,
          color: isActive ? fill : '#6c7086',
          fontWeight: isActive ? 700 : 500,
        }}
        className="text-[11px] font-mono mb-0.5 tabular-nums"
      >
        {value}
      </motion.span>
      {/* Character label for symbol-mode algorithms */}
      {showChars && value >= 32 && value <= 126 && (
        <span className="text-[11px] font-bold mb-1" style={{ color: isActive ? fill : '#a6adc8' }}>
          '{String.fromCharCode(value)}'
        </span>
      )}

      {/* The bar itself — fills downward from a fixed top */}
      <div
        className="w-full flex flex-col justify-end rounded-t-md"
        style={{
          height: BAR_CONTAINER_H - 40,
        }}
      >
        <motion.div
          layout
          initial={{ height: 0 }}
          animate={{
            height: barH,
            backgroundColor: fill,
            borderWidth: borderW,
            borderColor,
            boxShadow: glow ?? 'none',
          }}
          transition={{
            type: 'spring',
            stiffness: 280,
            damping: 22,
            mass: 0.6,
          }}
          className="w-full rounded-t-md"
          style={{
            borderStyle: 'solid',
            borderBottom: 'none',
          }}
        />
      </div>

      {/* Swap jump overlay — only when swapping */}
      {isActive && actionType === 'swap' && (
        <motion.div
          className="absolute pointer-events-none"
          animate={{ y: [0, -32, 0] }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <span className="text-xs">🔄</span>
        </motion.div>
      )}

      {/* Index below */}
      <span
        className={`text-[9px] font-mono mt-1.5 tabular-nums ${
          isActive ? 'text-ide-text' : 'text-ide-text-muted/50'
        }`}
      >
        [{index}]
      </span>
    </div>
  );
}

function HorizontalBlock({
  value, index, isActive, isMarked, actionType, isTop, showChars,
}: {
  value: number; index: number; isActive: boolean; isMarked: boolean;
  actionType: ActionType; isTop: boolean; showChars?: boolean;
}) {
  if (value === 0 && !isActive) return null;
  const fill = isMarked ? '#74c7a8' : isActive ? (ACTION_COLORS[actionType] ?? '#89b4fa') : '#89b4fa';
  const border = isActive ? (ACTION_COLORS[actionType] ?? '#f9e2af') : 'rgba(137,180,250,0.3)';

  return (
    <motion.div
      initial={isActive ? { x: 60, opacity: 0, scale: 0.8 } : { opacity: 1 }}
      animate={{
        x: 0, opacity: 1, scale: isActive ? 1.08 : 1,
        backgroundColor: `${fill}33`, borderColor: border,
      }}
      exit={{ x: -60, opacity: 0, scale: 0.5 }}
      transition={{ type: 'spring', stiffness: 280, damping: 20 }}
      className="flex flex-col items-center justify-center rounded-lg border-2 min-w-[52px] h-[52px] relative"
    >
      <span className={`text-sm font-mono font-bold ${isActive ? 'text-ide-warning' : 'text-ide-text'}`}>
        {value > 0 ? value : ''}
      </span>
      {showChars && value >= 32 && value <= 126 && (
        <span className="text-[10px] font-bold" style={{ color: isActive ? fill : '#a6adc8' }}>'{String.fromCharCode(value)}'</span>
      )}
      <span className="text-[9px] font-mono text-ide-text-muted/50 mt-0.5">[{index}]</span>
      {isTop && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-ide-warning font-mono">
          ▼ top
        </div>
      )}
    </motion.div>
  );
}

export default function ArrayVisualizer({ step, horizontal, showChars }: ArrayVisualizerProps) {
  const { data, activeIndices, markedIndices, actionType } = step;

  const maxValue = useMemo(() => Math.max(...data, 1), [data]);
  const totalBars = data.length;
  const gapPx = Math.max(6, 14 - totalBars * 0.6);
  const maxTotalW = 700;
  const barWidth = Math.max(28, Math.min(70, (maxTotalW - gapPx * (totalBars - 1)) / totalBars));
  const activeSet = useMemo(() => new Set(activeIndices), [activeIndices]);
  const markedSet = useMemo(() => new Set(markedIndices), [markedIndices]);

  if (horizontal) {
    // Find "top" of stack — rightmost non-zero element
    let topIdx = -1;
    for (let i = data.length - 1; i >= 0; i--) {
      if (data[i] !== 0) { topIdx = i; break; }
    }

    return (
      <div className="flex items-center justify-center h-full w-full px-4 overflow-hidden">
        <div className="flex items-center gap-2 p-4 rounded-xl border-2 border-ide-border bg-ide-bg/50 min-h-[80px]"
          style={{ borderStyle: 'dashed' }}>
          <span className="text-[10px] text-ide-text-muted mr-1 font-mono shrink-0">底</span>
          <div className="flex items-center gap-2">
            {data.map((value, idx) => (
              <HorizontalBlock
                key={`h-${idx}`}
                value={value} index={idx}
                isActive={activeSet.has(idx)}
                isMarked={markedSet.has(idx)}
                actionType={actionType}
                isTop={idx === topIdx && value !== 0}
                showChars={showChars}
              />
            ))}
          </div>
          <span className="text-[10px] text-ide-text-muted ml-1 font-mono shrink-0">顶</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end justify-center h-full w-full px-4 pb-6 pt-4 overflow-hidden">
      <div className="flex items-end justify-center" style={{ gap: gapPx }}>
        {data.map((value, idx) => (
          <ArrayBar
            key={`bar-${idx}`}
            value={value} index={idx} maxValue={maxValue}
            isActive={activeSet.has(idx)} isMarked={markedSet.has(idx)}
            actionType={actionType} barWidth={barWidth} showChars={showChars}
          />
        ))}
      </div>
    </div>
  );
}

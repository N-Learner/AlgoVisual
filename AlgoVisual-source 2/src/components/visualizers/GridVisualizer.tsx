import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { VisualStep, GridCell } from '@/types/algo';

const CELL_SIZE = 36;
const GAP = 1;

const CELL_COLORS: Record<GridCell['state'], { fill: string; stroke: string }> = {
  wall:     { fill: '#313244', stroke: '#45475a' },
  path:     { fill: '#a6e3a1', stroke: '#74c7a8' },
  start:    { fill: '#89b4fa', stroke: '#74a1e0' },
  end:      { fill: '#f38ba8', stroke: '#e07085' },
  visited:  { fill: 'rgba(137,180,250,0.15)', stroke: '#585b70' },
  visiting: { fill: 'rgba(249,226,175,0.35)', stroke: '#f9e2af' },
  queen:    { fill: 'rgba(203,166,247,0.3)', stroke: '#cba6f7' },
  empty:    { fill: 'rgba(137,180,250,0.03)', stroke: '#45475a' },
};

interface Props {
  step: VisualStep;
}

function getCellState(
  gridData: number[][],
  gridCells: GridCell[] | undefined,
  row: number,
  col: number,
): GridCell['state'] {
  if (gridCells) {
    for (const c of gridCells) {
      if (c.row === row && c.col === col) return c.state;
    }
  }
  const val = gridData[row]?.[col];
  if (val === 1 || val === -1) return 'wall';
  if (val === 2) return 'start';
  if (val === 3) return 'end';
  if (val === 5) return 'visited';
  if (val === 6) return 'visiting';
  if (val === 7) return 'queen';
  if (val === 8) return 'path';
  return 'empty';
}

export default function GridVisualizer({ step }: Props) {
  const { data, activeIndices, gridData, gridCells } = step;

  // If there's gridData, use it. Otherwise, build grid from data array (DP mode).
  const hasGridData = gridData && gridData.length > 0;

  const rows = hasGridData ? gridData!.length : 0;
  const cols = hasGridData && rows > 0 ? gridData![0].length : 0;

  // For DP table mode (no gridData, data array holds flat values)
  const isDPMode = !hasGridData;

  // In DP mode, show data as a single row of cells
  const dpCells = useMemo(() => {
    if (!isDPMode) return null;
    return data;
  }, [isDPMode, data]);

  if (isDPMode && dpCells) {
    // DP table mode: render as 1D row (for simpler DP), or as multi-row table
    // For single-row display
    const cellW = Math.min(56, Math.max(36, 600 / dpCells.length));
    const totalW = dpCells.length * (cellW + GAP);

    return (
      <div className="flex items-center justify-center h-full w-full overflow-auto p-4">
        <div className="flex flex-col gap-2">
          <div className="flex" style={{ gap: GAP }}>
            {dpCells.map((val, idx) => {
              const isActive = activeIndices.includes(idx);
              const isMarked = activeIndices.length === 0 ? false : !isActive;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: 1,
                    scale: isActive ? 1.1 : 1,
                    backgroundColor: isActive
                      ? 'rgba(249,226,175,0.3)'
                      : 'rgba(137,180,250,0.08)',
                    borderColor: isActive ? '#f9e2af' : '#45475a',
                  }}
                  transition={{ type: 'spring', stiffness: 260, damping: 18, delay: idx * 0.03 }}
                  className="flex items-center justify-center rounded-md font-mono text-sm font-bold border"
                  style={{ width: cellW, height: cellW }}
                >
                  <span className={isActive ? 'text-ide-warning' : 'text-ide-text'}>
                    {val === -1 || val === Infinity ? '∞' : val}
                  </span>
                  {/* Index label */}
                  <span className="absolute -bottom-5 text-[9px] text-ide-text-muted/50 font-mono">
                    [{idx}]
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (!hasGridData || rows === 0) {
    return (
      <div className="flex items-center justify-center h-full text-ide-text-muted text-sm">
        无网格数据
      </div>
    );
  }

  const totalW = cols * (CELL_SIZE + GAP);
  const totalH = rows * (CELL_SIZE + GAP);

  return (
    <div className="flex items-center justify-center h-full w-full overflow-auto p-4">
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${CELL_SIZE}px)`,
          gap: GAP,
        }}
      >
        {Array.from({ length: rows * cols }, (_, i) => {
          const row = Math.floor(i / cols);
          const col = i % cols;
          const state = getCellState(gridData!, gridCells, row, col);
          const colors = CELL_COLORS[state];
          const isActive = gridCells?.some(
            (c) => c.row === row && c.col === col && c.state === 'visiting'
          );

          return (
            <motion.div
              key={`${row}-${col}`}
              initial={{ opacity: 0.5 }}
              animate={{
                opacity: 1,
                scale: isActive ? 1.12 : 1,
              }}
              transition={{ duration: 0.2 }}
              className="rounded-sm flex items-center justify-center text-[9px] font-mono"
              style={{
                width: CELL_SIZE,
                height: CELL_SIZE,
                backgroundColor: colors.fill,
                border: `1px solid ${colors.stroke}`,
              }}
            >
              {/* Show cell value */}
              {state === 'start' && 'S'}
              {state === 'end' && 'E'}
              {state === 'queen' && '♛'}
              {state === 'wall' && '█'}
              {(state === 'path' || state === 'visiting' || state === 'visited') && gridData && gridData[row][col] > 0 && (
                <span className="text-[9px] font-mono font-bold" style={{ color: '#11111b' }}>{gridData[row][col]}</span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

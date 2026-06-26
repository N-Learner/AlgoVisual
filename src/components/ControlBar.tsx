import { useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAlgoStore } from '@/context/AlgoContext';
import { SPEED_VALUES, SPEED_LABELS, type SpeedMultiplier, type ActionType } from '@/types/algo';

const ACTION_DOT_COLORS: Record<ActionType, string> = {
  compare: '#f9e2af', swap: '#f38ba8', move: '#89b4fa', insert: '#a6e3a1',
  delete: '#f38ba8', highlight: '#cba6f7', complete: '#a6e3a1',
  'recurse-in': '#89dceb', 'recurse-out': '#94e2d5', divide: '#fab387',
  merge: '#f5c2e7', relax: '#f9e2af', visit: '#74c7ec', backtrack: '#a6adc8',
  'fill-cell': '#f5c2e7', traceback: '#fab387',
};

export default function ControlBar() {
  const selectedAlgorithm = useAlgoStore((s) => s.selectedAlgorithm);
  const playState = useAlgoStore((s) => s.playState);
  const speed = useAlgoStore((s) => s.speed);
  const currentStep = useAlgoStore((s) => s.currentStep);
  const steps = useAlgoStore((s) => s.steps);

  const play = useAlgoStore((s) => s.play);
  const pause = useAlgoStore((s) => s.pause);
  const stepForward = useAlgoStore((s) => s.stepForward);
  const stepBackward = useAlgoStore((s) => s.stepBackward);
  const reset = useAlgoStore((s) => s.reset);
  const setSpeed = useAlgoStore((s) => s.setSpeed);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-play timer
  useEffect(() => {
    if (playState === 'playing') {
      const baseInterval = 1000;
      const delay = baseInterval / speed;

      intervalRef.current = setInterval(() => {
        const state = useAlgoStore.getState();
        if (state.currentStep >= state.steps.length - 1) {
          useAlgoStore.getState().pause();
          useAlgoStore.setState({ playState: 'completed' });
          return;
        }
        state.stepForward();
      }, delay);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [playState, speed]);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          if (playState === 'playing') pause();
          else play();
          break;
        case 'ArrowRight':
          e.preventDefault();
          stepForward();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          stepBackward();
          break;
        case 'r':
        case 'R':
          if (!e.metaKey && !e.ctrlKey) {
            e.preventDefault();
            reset();
          }
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playState, play, pause, stepForward, stepBackward, reset]);

  const totalSteps = steps.length;
  const progress = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;
  const isPlaying = playState === 'playing';
  const isCompleted = playState === 'completed';

  return (
    <header className="h-12 min-h-[48px] bg-ide-panel border-b border-ide-border flex items-center px-4 gap-3 select-none">
      {/* Playback Controls */}
      <div className="flex items-center gap-1">
        <ControlButton
          onClick={stepBackward}
          disabled={currentStep <= 0 || isPlaying}
          title="上一步 (←)"
        >
          ⏮
        </ControlButton>

        <ControlButton
          onClick={isPlaying ? pause : play}
          disabled={!selectedAlgorithm}
          title={isPlaying ? '暂停 (Space)' : isCompleted ? '重新播放 (Space)' : '播放 (Space)'}
          primary
        >
          {isPlaying ? '⏸' : '▶'}
        </ControlButton>

        <ControlButton
          onClick={stepForward}
          disabled={currentStep >= totalSteps - 1 || isPlaying}
          title="下一步 (→)"
        >
          ⏭
        </ControlButton>

        <ControlButton onClick={reset} disabled={!selectedAlgorithm} title="重置 (R)">
          ⟲
        </ControlButton>
      </div>

      {/* Divider */}
      <div className="w-px h-5 bg-ide-border" />

      {/* Speed Control */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-ide-text-muted font-mono">速度</span>
        <div className="flex items-center gap-0.5">
          {SPEED_VALUES.map((v) => (
            <button
              key={v}
              onClick={() => setSpeed(v as SpeedMultiplier)}
              className={`text-[10px] px-2 py-1 rounded font-mono transition-colors
                ${speed === v
                  ? 'bg-ide-accent/30 text-ide-accent'
                  : 'text-ide-text-muted hover:text-ide-text hover:bg-white/5'
                }`}
            >
              {SPEED_LABELS[v]}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="w-px h-5 bg-ide-border" />

      {/* Algorithm Info */}
      <div className="flex items-center gap-2">
        {selectedAlgorithm ? (
          <>
            <span className="text-sm font-medium text-ide-text">
              {selectedAlgorithm.name}
            </span>
            <span className="text-[10px] font-mono text-ide-text-muted bg-ide-bg px-1.5 py-0.5 rounded">
              {selectedAlgorithm.timeComplexity}
            </span>
          </>
        ) : (
          <span className="text-sm text-ide-text-muted">
            请从左侧选择一个算法
          </span>
        )}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Progress */}
      {selectedAlgorithm && totalSteps > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-ide-text-muted">
            步骤 {currentStep + 1}/{totalSteps}
          </span>
          {/* Segmented progress bar with colored dots */}
          <div className="relative w-32 h-2 bg-ide-bg rounded-full overflow-hidden flex items-center">
            {/* Fill bar */}
            <motion.div
              className="absolute left-0 top-0 h-full bg-ide-accent/30 rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.2 }}
            />
            {/* Step dots */}
            <div className="absolute inset-0 flex items-center px-[2px]">
              {steps.slice(0, Math.min(40, totalSteps)).map((s, i) => {
                const leftPct = ((i + 1) / totalSteps) * 100;
                const color = ACTION_DOT_COLORS[s.actionType] ?? '#6c7086';
                const isPast = i <= currentStep;
                return (
                  <div
                    key={i}
                    className="absolute w-[3px] h-[3px] rounded-full transition-all"
                    style={{
                      left: `${leftPct}%`,
                      backgroundColor: isPast ? color : '#45475a',
                      opacity: isPast ? 0.9 : 0.4,
                      transform: i === currentStep ? 'scale(1.8)' : 'scale(1)',
                    }}
                  />
                );
              })}
            </div>
          </div>
          {/* Current action label */}
          {steps[currentStep] && (
            <span
              className="text-[10px] font-mono font-medium shrink-0"
              style={{ color: ACTION_DOT_COLORS[steps[currentStep].actionType] ?? '#6c7086' }}
            >
              {steps[currentStep].actionType}
            </span>
          )}
          {isCompleted && (
            <span className="text-[10px] text-ide-accent2 font-medium">✓</span>
          )}
        </div>
      )}

      {/* Keyboard hint */}
      <div className="text-[10px] text-ide-text-muted/50 hidden lg:block">
        Space 播放 · ← → 步进 · R 重置
      </div>
    </header>
  );
}

function ControlButton({
  children,
  onClick,
  disabled,
  primary,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
  primary?: boolean;
  title: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`w-8 h-8 rounded-md flex items-center justify-center text-sm transition-all
        ${primary
          ? 'bg-ide-accent text-ide-panel hover:bg-ide-accent/80'
          : 'text-ide-text-muted hover:text-ide-text hover:bg-white/10'
        }
        ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {children}
    </button>
  );
}

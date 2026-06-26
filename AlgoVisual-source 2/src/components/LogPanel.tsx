import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAlgoStore } from '@/context/AlgoContext';
import type { ActionType, LogEntry } from '@/types/algo';

const ACTION_LABELS: Record<ActionType, { label: string; color: string }> = {
  compare: { label: '比较', color: 'text-yellow-400' },
  swap: { label: '交换', color: 'text-red-400' },
  move: { label: '移动', color: 'text-blue-400' },
  insert: { label: '插入', color: 'text-green-400' },
  delete: { label: '删除', color: 'text-red-400' },
  highlight: { label: '标记', color: 'text-purple-400' },
  'recurse-in': { label: '递入', color: 'text-cyan-400' },
  'recurse-out': { label: '递出', color: 'text-teal-400' },
  divide: { label: '分割', color: 'text-orange-400' },
  merge: { label: '合并', color: 'text-pink-400' },
  relax: { label: '松弛', color: 'text-amber-400' },
  visit: { label: '访问', color: 'text-sky-400' },
  backtrack: { label: '回溯', color: 'text-gray-400' },
  'fill-cell': { label: '填表', color: 'text-pink-400' },
  traceback: { label: '回溯路径', color: 'text-orange-400' },
  complete: { label: '完成', color: 'text-emerald-400' },
};

function LogEntryRow({ entry, isCurrent }: { entry: LogEntry; isCurrent: boolean }) {
  const action = ACTION_LABELS[entry.actionType];

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.15 }}
      className={`flex items-start gap-2 px-3 py-1 text-[11px] font-mono border-l-2 transition-colors
        ${isCurrent
          ? 'border-l-ide-accent bg-ide-accent/5'
          : 'border-l-transparent hover:bg-white/[0.02]'
        }`}
    >
      <span className="text-ide-text-muted/60 shrink-0 w-6">
        [{entry.step}]
      </span>
      <span className={`shrink-0 w-8 text-[10px] ${action.color}`}>
        {action.label}
      </span>
      <span className={`truncate ${isCurrent ? 'text-ide-text' : 'text-ide-text-muted'}`}>
        {entry.description}
      </span>
    </motion.div>
  );
}

export default function LogPanel() {
  const selectedAlgorithm = useAlgoStore((s) => s.selectedAlgorithm);
  const currentStep = useAlgoStore((s) => s.currentStep);
  const steps = useAlgoStore((s) => s.steps);
  const logs = useAlgoStore((s) => s.logs);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to current log entry
  useEffect(() => {
    if (logContainerRef.current) {
      const currentEl = logContainerRef.current.querySelector(
        `[data-log-index="${currentStep}"]`,
      );
      if (currentEl) {
        currentEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [currentStep]);

  const currentStepData = steps[currentStep];
  const currentAction = currentStepData
    ? ACTION_LABELS[currentStepData.actionType]
    : null;

  if (!selectedAlgorithm) {
    return (
      <div className="flex items-center justify-center text-ide-text-muted text-sm h-full">
        <div className="text-center">
          <div className="text-2xl mb-2">📋</div>
          <p className="text-xs">执行日志将在此显示</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-ide-panel border-t border-ide-border">
      {/* Current Step Detail */}
      <div className="border-b border-ide-border px-3 py-2 min-h-[52px]">
        <div className="text-[10px] text-ide-text-muted mb-1 font-semibold uppercase tracking-wider">
          📍 当前步骤解析
        </div>
        {currentStepData ? (
          <div className="flex items-start gap-2">
            {currentAction && (
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${currentAction.color} bg-white/5 shrink-0 mt-0.5`}>
                {currentAction.label}
              </span>
            )}
            <p className="text-xs text-ide-text leading-relaxed">
              {currentStepData.description}
            </p>
          </div>
        ) : (
          <p className="text-xs text-ide-text-muted">等待开始...</p>
        )}
        {currentStepData && (
          <div className="mt-1.5">
            <span className="text-[10px] font-mono text-ide-text-muted">
              数据快照：[{currentStepData.data.join(', ')}]
            </span>
          </div>
        )}
      </div>

      {/* Stats bar */}
      {logs.length > 0 && (
        <div className="px-3 py-1.5 border-b border-ide-border flex items-center gap-3 flex-wrap">
          <span className="text-[10px] text-ide-text-muted font-semibold">📊</span>
          {(['compare', 'swap', 'move', 'insert', 'delete'] as ActionType[]).map((t) => {
            const count = logs.filter((l) => l.actionType === t).length;
            if (count === 0) return null;
            return (
              <span key={t} className="text-[10px] font-mono" style={{ color: ACTION_LABELS[t].color.replace('text-', '#').replace('-400', '') || '#6c7086' }}>
                <span className="opacity-60">{ACTION_LABELS[t].label}</span>
                <span className="ml-0.5 font-bold">{count}</span>
              </span>
            );
          })}
        </div>
      )}

      {/* Execution History */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-3 py-1.5 border-b border-ide-border bg-ide-panel">
          <span className="text-[10px] text-ide-text-muted font-semibold uppercase tracking-wider">
            📜 执行历史
          </span>
          <span className="text-[10px] text-ide-text-muted/60 ml-2">
            {logs.length} 条记录
          </span>
        </div>
        <div
          ref={logContainerRef}
          className="flex-1 overflow-y-auto py-1"
        >
          <AnimatePresence mode="popLayout">
            {logs.map((entry, idx) => (
              <div key={entry.step} data-log-index={idx}>
                <LogEntryRow entry={entry} isCurrent={idx === currentStep} />
              </div>
            ))}
          </AnimatePresence>
          {logs.length === 0 && (
            <p className="text-[11px] text-ide-text-muted/50 text-center py-4">
              暂无执行记录
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

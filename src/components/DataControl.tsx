import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAlgoStore } from '@/context/AlgoContext';

function getInputHint(algoId: string, category: string): string {
  if (algoId === 'bracket-match') return '输入括号串, 如: ({[]})';
  if (algoId === 'infix-to-postfix') return '输入表达式, 如: 3+2*4-5';
  if (category === 'advanced') {
    if (algoId === 'n-queens') return '输入皇后数, 如: 8';
    if (algoId.includes('maze')) return '使用默认网格';
    if (algoId === 'flood-fill') return '使用默认网格';
    return '输入参数';
  }
  if (category === 'graph') return '输入边: N,from,to,w,... 如 5,0,1,4,0,2,1';
  if (category === 'tree-binary') return '输入节点值, 如: 50,30,70';
  if (category === 'sorting' || category === 'searching' || category === 'linear-list')
    return '输入数据, 如: 20, 30, 40';
  if (category === 'stack-queue') return '输入初始值, 如: 10, 20, 30';
  return '输入数据';
}

function getDataLabel(algoId: string, category: string, data: number[]): string {
  if (algoId === 'bracket-match' || algoId === 'infix-to-postfix') {
    return `"${String.fromCharCode(...data)}"`;
  }
  if (category === 'advanced') {
    if (algoId === 'n-queens') return `${data[0] ?? 4} 皇后`;
    if (algoId.includes('maze')) return `网格 ${data[0] ?? 15}×${data[1] ?? 15}`;
    if (algoId === 'flood-fill') return '10×10 网格';
    return `[${data.join(', ')}]`;
  }
  if (category === 'graph') {
    const n = data[0] || 0;
    const e = Math.floor((data.length - 1) / 3);
    return `${n}节点 ${e}条边`;
  }
  return `[${data.join(', ')}]`;
}

export default function DataControl() {
  const selectedAlgorithm = useAlgoStore((s) => s.selectedAlgorithm);
  const customData = useAlgoStore((s) => s.customData);
  const useCustomData = useAlgoStore((s) => s.useCustomData);
  const generateRandomData = useAlgoStore((s) => s.generateRandomData);
  const setCustomData = useAlgoStore((s) => s.setCustomData);
  const saveTestCase = useAlgoStore((s) => s.saveTestCase);
  const loadTestCase = useAlgoStore((s) => s.loadTestCase);

  const [inputValue, setInputValue] = useState('');
  const [savedCases, setSavedCases] = useState<Array<{ label: string; data: number[] }>>(() => {
    try {
      const raw = localStorage.getItem('algovisual_test_cases');
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Object.entries(parsed).map(([key, data]) => ({
        label: key,
        data: data as number[],
      }));
    } catch {
      return [];
    }
  });

  const algoId = selectedAlgorithm?.id ?? '';
  const algoCat = selectedAlgorithm?.category ?? '';
  const inputHint = useMemo(() => getInputHint(algoId, algoCat), [algoId, algoCat]);
  const isSymbolMode = algoId === 'bracket-match' || algoId === 'infix-to-postfix';
  const isReadonly = !isSymbolMode && (algoId === 'flood-fill' || algoId.includes('maze'));

  const activeData = useCustomData && customData.length > 0
    ? customData
    : (selectedAlgorithm?.defaultData ?? []);

  const dataLabel = useMemo(
    () => getDataLabel(algoId, algoCat, activeData),
    [algoId, algoCat, activeData],
  );

  const handleApplyCustomData = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    // Character input: contains non-digit chars (e.g. "({[]})" or "3+2*4")
    if (isSymbolMode && /[^0-9,\s\-]/.test(trimmed)) {
      setCustomData([...trimmed].map(c => c.charCodeAt(0)));
    } else if (/^\d+$/.test(trimmed)) {
      setCustomData([parseInt(trimmed)]);
    } else {
      const parsed = trimmed.split(/[,，\s]+/).map(s => s.trim()).filter(Boolean).map(Number).filter(n => !isNaN(n));
      if (parsed.length > 0) setCustomData(parsed);
    }
  };

  const handleSave = () => {
    saveTestCase();
    if (selectedAlgorithm) {
      setSavedCases((prev) => {
        const filtered = prev.filter((c) => c.label !== selectedAlgorithm.id);
        return [...filtered, { label: selectedAlgorithm.id, data: activeData }];
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApplyCustomData();
    }
  };

  return (
    <footer className="h-10 min-h-[40px] bg-ide-panel border-t border-ide-border flex items-center px-4 gap-3">
      {/* Current Data Display */}
      <span className="text-[10px] text-ide-text-muted font-mono shrink-0">数据</span>
      <span className="text-[11px] font-mono text-ide-text/70 truncate max-w-[280px]">
        {dataLabel}
      </span>

      <div className="flex-1" />

      {/* Random Generate */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => generateRandomData()}
        disabled={!selectedAlgorithm}
        className="text-[10px] px-2.5 py-1 rounded bg-ide-accent2/15 text-ide-accent2 hover:bg-ide-accent2/25 transition-colors font-medium shrink-0 disabled:opacity-30"
        title={inputHint}
      >
        🎲 {algoCat === 'advanced' ? '随机参数' : '随机生成'}
      </motion.button>

      {/* Custom Input */}
      <div className="flex items-center gap-1.5 shrink-0">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={inputHint}
          disabled={isReadonly}
          className="w-44 text-[11px] font-mono bg-ide-bg border border-ide-border rounded px-2 py-1 text-ide-text
            placeholder:text-ide-text-muted/40 outline-none focus:border-ide-accent/50 transition-colors disabled:opacity-40"
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleApplyCustomData}
          disabled={isReadonly}
          className="text-[10px] px-2 py-1 rounded bg-ide-accent/15 text-ide-accent hover:bg-ide-accent/25 transition-colors font-medium disabled:opacity-30"
        >
          应用
        </motion.button>
      </div>

      {/* Save Test Case */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleSave}
        disabled={!selectedAlgorithm || activeData.length === 0}
        className="text-[10px] px-2.5 py-1 rounded bg-ide-warning/15 text-ide-warning hover:bg-ide-warning/25 transition-colors font-medium shrink-0 disabled:opacity-30"
      >
        💾 保存用例
      </motion.button>

      {/* Saved Cases Dropdown */}
      {savedCases.length > 0 && (
        <select
          onChange={(e) => {
            const selected = savedCases.find((c) => c.label === e.target.value);
            if (selected) loadTestCase(selected.data);
          }}
          className="text-[10px] bg-ide-bg border border-ide-border rounded px-1.5 py-1 text-ide-text-muted outline-none shrink-0 max-w-[120px]"
          defaultValue=""
        >
          <option value="" disabled>已存用例</option>
          {savedCases.map((c) => (
            <option key={c.label} value={c.label}>
              {c.label} [{c.data.join(',')}]
            </option>
          ))}
        </select>
      )}
    </footer>
  );
}

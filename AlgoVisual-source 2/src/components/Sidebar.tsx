import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAlgoStore } from '@/context/AlgoContext';
import { getAllAlgorithms } from '@/algorithms/registry';
import {
  type AlgorithmCategory,
  type AlgorithmMeta,
  CATEGORY_CONFIGS,
  DIFFICULTY_COLORS,
} from '@/types/algo';

function AlgorithmItem({ algo }: { algo: AlgorithmMeta }) {
  const selectedAlgorithm = useAlgoStore((s) => s.selectedAlgorithm);
  const selectAlgorithm = useAlgoStore((s) => s.selectAlgorithm);
  const isSelected = selectedAlgorithm?.id === algo.id;

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={() => selectAlgorithm(algo)}
      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors mb-0.5
        ${isSelected
          ? 'bg-ide-accent/20 text-ide-accent border border-ide-accent/30'
          : 'text-ide-text-muted hover:bg-white/5 border border-transparent'
        }`}
    >
      <div className="flex items-center justify-between">
        <span className="truncate font-medium">{algo.name}</span>
        <span
          className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${DIFFICULTY_COLORS[algo.difficulty]}`}
        >
          {algo.difficulty === 'easy' ? '低' : algo.difficulty === 'medium' ? '中' : '高'}
        </span>
      </div>
      <div className="flex items-center gap-2 mt-0.5 text-[11px] font-mono text-ide-text-muted/70">
        <span>⏱ {algo.timeComplexity}</span>
        <span>📦 {algo.spaceComplexity}</span>
      </div>
    </motion.button>
  );
}

function CategorySection({ category }: { category: AlgorithmCategory }) {
  const allAlgos = getAllAlgorithms();
  const categoryAlgos = useMemo(
    () => allAlgos.filter((a) => a.meta.category === category),
    [allAlgos, category],
  );

  const config = CATEGORY_CONFIGS.find((c) => c.key === category);
  if (!config || categoryAlgos.length === 0) return null;

  return (
    <div className="mb-3">
      <div className="flex items-center gap-2 px-1 mb-1.5">
        <span className="text-sm">{config.icon}</span>
        <span className="text-xs font-semibold text-ide-text/80 uppercase tracking-wider">
          {config.label}
        </span>
        <span className="text-[10px] text-ide-text-muted ml-auto">
          {categoryAlgos.length}
        </span>
      </div>
      <div className="space-y-0.5">
        {categoryAlgos.map((entry) => (
          <AlgorithmItem key={entry.meta.id} algo={entry.meta} />
        ))}
      </div>
    </div>
  );
}

export default function Sidebar() {
  const categoryFilter = useAlgoStore((s) => s.categoryFilter);
  const setCategoryFilter = useAlgoStore((s) => s.setCategoryFilter);

  const categories: AlgorithmCategory[] = [
    'linear-list',
    'stack-queue',
    'tree-binary',
    'graph',
    'sorting',
    'searching',
    'advanced',
  ];

  return (
    <aside className="w-[260px] min-w-[260px] h-full bg-ide-sidebar border-r border-ide-border flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-ide-border">
        <h1 className="text-sm font-bold text-ide-text tracking-wide">
          📐 Algorithm Hub
        </h1>
        <p className="text-[10px] text-ide-text-muted mt-0.5">
          数据结构与算法可视化
        </p>
      </div>

      {/* Category Quick Filter */}
      <div className="px-3 py-2 border-b border-ide-border flex flex-wrap gap-1">
        <button
          onClick={() => setCategoryFilter(null)}
          className={`text-[10px] px-2 py-0.5 rounded-full transition-colors
            ${!categoryFilter
              ? 'bg-ide-accent/30 text-ide-accent'
              : 'text-ide-text-muted hover:text-ide-text'
            }`}
        >
          全部
        </button>
        {CATEGORY_CONFIGS.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setCategoryFilter(cat.key)}
            className={`text-[10px] px-2 py-0.5 rounded-full transition-colors
              ${categoryFilter === cat.key
                ? 'bg-ide-accent/30 text-ide-accent'
                : 'text-ide-text-muted hover:text-ide-text'
              }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Scrollable Algorithm List */}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        <AnimatePresence mode="wait">
          {categories.map((cat) => {
            if (categoryFilter && categoryFilter !== cat) return null;
            return <CategorySection key={cat} category={cat} />;
          })}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-ide-border text-[10px] text-ide-text-muted">
        AlgoVisual v1.0 · M1 Native
      </div>
    </aside>
  );
}

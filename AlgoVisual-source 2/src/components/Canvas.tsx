import { useAlgoStore } from '@/context/AlgoContext';
import ArrayVisualizer from './visualizers/ArrayVisualizer';
import LinkedListVisualizer from './visualizers/LinkedListVisualizer';
import TreeVisualizer from './visualizers/TreeVisualizer';
import GraphVisualizer from './visualizers/GraphVisualizer';
import GridVisualizer from './visualizers/GridVisualizer';

export default function Canvas() {
  const selectedAlgorithm = useAlgoStore((s) => s.selectedAlgorithm);
  const steps = useAlgoStore((s) => s.steps);
  const currentStep = useAlgoStore((s) => s.currentStep);

  const step = steps[currentStep];

  if (!selectedAlgorithm) {
    return (
      <div className="flex-1 flex items-center justify-center bg-canvas-bg">
        <div className="text-center select-none">
          <div className="text-6xl mb-4 opacity-30">🧩</div>
          <h2 className="text-xl font-bold text-ide-text/60 mb-2">AlgoVisual Platform</h2>
          <p className="text-sm text-ide-text-muted/50 max-w-sm">
            从左侧算法中心选择一个算法开始可视化探索
          </p>
          <div className="flex gap-3 justify-center mt-6 text-ide-text-muted/30 text-2xl">
            <span>📋</span><span>🔗</span><span>🌳</span><span>🕸️</span><span>🧠</span>
          </div>
        </div>
      </div>
    );
  }

  if (!step) {
    return (
      <div className="flex-1 flex items-center justify-center bg-canvas-bg">
        <p className="text-sm text-ide-text-muted">正在生成可视化步骤...</p>
      </div>
    );
  }

  const StepOverlay = (
    <div className="absolute top-3 left-3 z-10">
      <div className="bg-ide-panel/90 backdrop-blur-sm border border-ide-border rounded-lg px-3 py-2 text-xs">
        <span className="text-ide-text-muted">步骤 </span>
        <span className="text-ide-accent font-mono font-bold">{currentStep + 1}/{steps.length}</span>
        <span className="text-ide-text-muted mx-2">·</span>
        <span className="text-ide-text">{step.actionType}</span>
      </div>
    </div>
  );

  const renderVisualizer = () => {
    switch (selectedAlgorithm.visualizerType) {
      case 'array':
      case 'array-dual':
      case 'timeline':
        const isSymbolAlgo = selectedAlgorithm.id === 'bracket-match' || selectedAlgorithm.id === 'infix-to-postfix';
        const useHorizontal = selectedAlgorithm.category === 'stack-queue' && selectedAlgorithm.id !== 'infix-to-postfix';
        return (
          <ArrayVisualizer
            step={step}
            horizontal={useHorizontal}
            showChars={isSymbolAlgo}
          />
        );
      case 'linked-list':
        return <LinkedListVisualizer step={step} />;
      case 'tree':
        return <TreeVisualizer step={step} />;
      case 'graph':
        return <GraphVisualizer step={step} />;
      case 'grid':
      case 'grid+table':
        return <GridVisualizer step={step} />;
      default:
        return <ArrayVisualizer step={step} />;
    }
  };

  return (
    <div className="flex-1 relative bg-canvas-bg overflow-hidden">
      {StepOverlay}
      {renderVisualizer()}

      {/* Algorithm info card — shown at step 0 */}
      {currentStep === 0 && selectedAlgorithm && (
        <div className="absolute bottom-3 left-3 max-w-[280px] bg-ide-panel/95 backdrop-blur-sm border border-ide-border rounded-lg p-3 text-xs leading-relaxed z-10">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
              selectedAlgorithm.difficulty === 'easy' ? 'text-green-400 bg-green-400/10' :
              selectedAlgorithm.difficulty === 'medium' ? 'text-yellow-400 bg-yellow-400/10' :
              'text-red-400 bg-red-400/10'
            }`}>
              {selectedAlgorithm.difficulty === 'easy' ? '简单' : selectedAlgorithm.difficulty === 'medium' ? '中等' : '困难'}
            </span>
            <span className="text-[10px] font-mono text-ide-text-muted">⏱ {selectedAlgorithm.timeComplexity}</span>
            <span className="text-[10px] font-mono text-ide-text-muted">📦 {selectedAlgorithm.spaceComplexity}</span>
          </div>
          <p className="text-ide-text-muted">{selectedAlgorithm.description}</p>
        </div>
      )}
    </div>
  );
}

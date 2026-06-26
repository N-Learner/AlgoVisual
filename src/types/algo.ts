// ============================================================
// AlgoVisual — Core Type System v2
// ============================================================

// ---- Category & Difficulty ----

export type AlgorithmCategory =
  | 'linear-list'
  | 'stack-queue'
  | 'tree-binary'
  | 'graph'
  | 'sorting'
  | 'searching'
  | 'advanced';

export type Difficulty = 'easy' | 'medium' | 'hard';

// ---- Visualization ----

export type ActionType =
  // 基本操作
  | 'compare'
  | 'swap'
  | 'move'
  | 'insert'
  | 'delete'
  | 'highlight'
  // 递归/分治
  | 'recurse-in'
  | 'recurse-out'
  | 'divide'
  | 'merge'
  // 图算法
  | 'relax'
  | 'visit'
  | 'backtrack'
  // DP
  | 'fill-cell'
  | 'traceback'
  // 通用
  | 'complete';

export type VisualizerType =
  | 'array'
  | 'array-dual'
  | 'linked-list'
  | 'tree'
  | 'graph'
  | 'grid'
  | 'grid+table'
  | 'timeline';

export type PlayState =
  | 'idle'
  | 'playing'
  | 'paused'
  | 'completed';

export type SpeedMultiplier = 0.25 | 0.5 | 1 | 2 | 4;

// ---- Algorithm Metadata ----

export interface AlgorithmMeta {
  id: string;
  name: string;
  category: AlgorithmCategory;
  difficulty: Difficulty;
  timeComplexity: string;
  spaceComplexity: string;
  description: string;
  templateCode: string;
  visualizerType: VisualizerType;
  defaultData: number[];
}

// ---- Visual Step (the core abstraction) ----

export interface GraphEdgeHighlight {
  from: number;
  to: number;
  active: boolean;
  weight?: number;
}

export interface GridCell {
  row: number;
  col: number;
  state: 'wall' | 'path' | 'start' | 'end' | 'visited' | 'visiting' | 'queen' | 'empty';
}

export interface DPCellUpdate {
  row: number;
  col: number;
  value: number;
  active: boolean;
}

export interface PointerInfo {
  name: string;
  position: number;
  label?: string;
}

export interface VisualStep {
  // === 核心字段（所有算法必填）===
  data: number[];
  activeIndices: number[];
  markedIndices: number[];
  actionType: ActionType;
  description: string;
  highlightLines: number[];

  // === 扩展字段（按可视化类型选用）===
  secondaryData?: number[];
  graphEdges?: GraphEdgeHighlight[];
  gridData?: number[][];
  gridCells?: GridCell[];
  dpCellUpdates?: DPCellUpdate[];
  pointerPositions?: PointerInfo[];
  pointers?: Array<{ from: number; to: number }>;
}

// ---- Logging ----

export interface LogEntry {
  step: number;
  description: string;
  actionType: ActionType;
  dataSnapshot: number[];
  timestamp: number;
}

// ---- Algorithm Registry Entry ----

export interface AlgorithmEntry {
  meta: AlgorithmMeta;
  generateSteps: (data: number[]) => VisualStep[];
}

// ---- Zustand Store Shape ----

export interface AlgorithmState {
  selectedAlgorithm: AlgorithmMeta | null;
  categoryFilter: AlgorithmCategory | null;
  playState: PlayState;
  speed: SpeedMultiplier;
  currentStep: number;
  steps: VisualStep[];
  customData: number[];
  useCustomData: boolean;
  logs: LogEntry[];
}

export interface AlgorithmActions {
  selectAlgorithm: (algo: AlgorithmMeta) => void;
  setCategoryFilter: (cat: AlgorithmCategory | null) => void;
  play: () => void;
  pause: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  reset: () => void;
  setSpeed: (speed: SpeedMultiplier) => void;
  setCustomData: (data: number[]) => void;
  generateRandomData: (size?: number) => void;
  loadAlgorithm: (algo: AlgorithmMeta) => void;
  saveTestCase: () => void;
  loadTestCase: (data: number[]) => void;
}

export type AlgoStore = AlgorithmState & AlgorithmActions;

// ---- Category Display Config ----

export interface CategoryConfig {
  key: AlgorithmCategory;
  label: string;
  icon: string;
}

export const CATEGORY_CONFIGS: CategoryConfig[] = [
  { key: 'linear-list', label: '线性表', icon: '📋' },
  { key: 'stack-queue', label: '栈和队列', icon: '📚' },
  { key: 'tree-binary', label: '树与二叉树', icon: '🌳' },
  { key: 'graph', label: '图结构', icon: '🕸️' },
  { key: 'sorting', label: '排序算法', icon: '🔢' },
  { key: 'searching', label: '查找算法', icon: '🔍' },
  { key: 'advanced', label: '高级专题', icon: '🧠' },
];

export const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  easy: 'text-green-400 bg-green-400/10',
  medium: 'text-yellow-400 bg-yellow-400/10',
  hard: 'text-red-400 bg-red-400/10',
};

export const SPEED_LABELS: Record<SpeedMultiplier, string> = {
  0.25: '0.25x',
  0.5: '0.5x',
  1: '1x',
  2: '2x',
  4: '4x',
};

export const SPEED_VALUES: SpeedMultiplier[] = [0.25, 0.5, 1, 2, 4];

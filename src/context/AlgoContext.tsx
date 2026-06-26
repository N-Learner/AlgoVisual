import { create } from 'zustand';
import type {
  AlgoStore,
  AlgorithmMeta,
  AlgorithmCategory,
  SpeedMultiplier,
  LogEntry,
} from '@/types/algo';
import { getAlgorithmById } from '@/algorithms/registry';

const TEST_CASE_KEY = 'algovisual_test_cases';

function loadSavedTestCases(): Record<string, number[]> {
  try {
    const raw = localStorage.getItem(TEST_CASE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveTestCases(cases: Record<string, number[]>): void {
  localStorage.setItem(TEST_CASE_KEY, JSON.stringify(cases));
}

export const useAlgoStore = create<AlgoStore>((set, get) => ({
  // ---- State ----
  selectedAlgorithm: null,
  categoryFilter: null,
  playState: 'idle',
  speed: 1,
  currentStep: 0,
  steps: [],
  customData: [],
  useCustomData: false,
  logs: [],

  // ---- Actions ----

  selectAlgorithm: (algo: AlgorithmMeta) => {
    set({
      selectedAlgorithm: algo,
      categoryFilter: algo.category,
      playState: 'idle',
      currentStep: 0,
      useCustomData: false,
    });
    get().loadAlgorithm(algo);
  },

  setCategoryFilter: (cat: AlgorithmCategory | null) => {
    set({ categoryFilter: cat });
  },

  play: () => {
    const { playState, currentStep, steps } = get();
    if (playState === 'completed') {
      set({ playState: 'playing', currentStep: 0 });
    } else if (currentStep >= steps.length - 1) {
      set({ playState: 'completed' });
    } else {
      set({ playState: 'playing' });
    }
  },

  pause: () => {
    set({ playState: 'paused' });
  },

  stepForward: () => {
    const { currentStep, steps, playState } = get();
    if (steps.length === 0) return;
    if (currentStep < steps.length - 1) {
      const next = currentStep + 1;
      set({
        currentStep: next,
        playState: next >= steps.length - 1 ? 'completed' : playState,
      });
    } else {
      set({ playState: 'completed' });
    }
  },

  stepBackward: () => {
    const { currentStep } = get();
    if (currentStep > 0) {
      set({ currentStep: currentStep - 1, playState: 'paused' });
    }
  },

  reset: () => {
    const { selectedAlgorithm } = get();
    set({
      currentStep: 0,
      playState: 'idle',
      steps: [],
      logs: [],
    });
    if (selectedAlgorithm) {
      get().loadAlgorithm(selectedAlgorithm);
    }
  },

  setSpeed: (speed: SpeedMultiplier) => {
    set({ speed });
  },

  setCustomData: (data: number[]) => {
    set({ customData: data, useCustomData: true });
    const { selectedAlgorithm } = get();
    if (selectedAlgorithm) {
      get().loadAlgorithm(selectedAlgorithm);
    }
  },

  generateRandomData: (_size?: number) => {
    const algo = get().selectedAlgorithm;
    if (!algo) return;
    const rand = () => Math.floor(Math.random() * 99) + 1;
    const randSmall = (max: number) => Math.floor(Math.random() * max) + 1;
    let data: number[];
    const id = algo.id;

    // --- Sorting: random array ---
    if (algo.category === 'sorting') {
      data = Array.from({ length: 8 }, rand);
    }
    // --- Searching: sorted array + existing target ---
    else if (id === 'binary-search' || id === 'interpolation-search') {
      const sorted = Array.from({ length: 10 }, rand).sort((a, b) => a - b);
      data = [...sorted, sorted[randSmall(sorted.length) - 1]];
    } else if (id === 'seq-search') {
      const arr = Array.from({ length: 8 }, rand);
      data = [...arr, arr[randSmall(arr.length) - 1]];
    } else if (id === 'bst-search') {
      const bst = Array.from({ length: 7 }, rand);
      data = [...bst, bst[randSmall(bst.length) - 1]];
    }
    // --- Linear list: [array, params...] ---
    else if (id === 'seqlist-insert') {
      const arr = Array.from({ length: 5 }, rand);
      data = [...arr, rand(), randSmall(arr.length) - 1];
    } else if (id === 'seqlist-delete') {
      const arr = Array.from({ length: 5 }, rand);
      data = [...arr, randSmall(arr.length) - 1];
    } else if (id === 'linkedlist-delete') {
      const arr = Array.from({ length: 5 }, rand);
      data = [...arr, randSmall(arr.length) - 1];
    }
    // --- Stack / Queue: random values ---
    else if (id === 'bracket-match') {
      const pairs = ['()', '{}', '[]'];
      let s = '';
      for (let i = 0; i < Math.floor(Math.random() * 3) + 2; i++) s += pairs[Math.floor(Math.random() * 3)];
      const arr = [...s];
      for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
      data = arr.map(c => c.charCodeAt(0));
    } else if (id === 'infix-to-postfix') {
      const digits = '0123456789', ops = '+-*/';
      let expr = digits[Math.floor(Math.random() * 10)];
      for (let i = 0; i < Math.floor(Math.random() * 4) + 2; i++) expr += ops[Math.floor(Math.random() * 4)] + digits[Math.floor(Math.random() * 10)];
      data = [...expr].map(c => c.charCodeAt(0));
    } else if (id === 'seq-stack' || id === 'circular-queue') {
      data = Array.from({ length: randSmall(4) + 3 }, rand);
    }
    // --- Tree: balanced BST insert order ---
    else if (id === 'bst-insert') {
      const sorted = Array.from({ length: 7 }, rand).sort((a, b) => a - b);
      const balanced: number[] = [];
      function midOrder(arr: number[]) {
        if (arr.length === 0) return;
        const m = Math.floor(arr.length / 2);
        balanced.push(arr[m]);
        midOrder(arr.slice(0, m));
        midOrder(arr.slice(m + 1));
      }
      midOrder(sorted);
      data = balanced;
    } else if (algo.category === 'tree-binary') {
      data = Array.from({ length: 7 }, rand);
    }
    // --- Graph: generate random edge list ---
    else if (algo.category === 'graph') {
      const n = Math.floor(Math.random() * 4) + 4; // 4-7 nodes
      const edges: number[] = [];
      const used = new Set<string>();
      const maxEdges = Math.floor(n * 1.5);
      for (let e = 0; e < maxEdges; e++) {
        const u = Math.floor(Math.random() * n);
        const v = Math.floor(Math.random() * n);
        if (u !== v && !used.has(`${u},${v}`) && !used.has(`${v},${u}`)) {
          used.add(`${u},${v}`);
          const w = Math.floor(Math.random() * 9) + 1;
          edges.push(u, v, w);
        }
      }
      data = [n, ...edges];
    }
    // --- Advanced ---
    else if (id === 'n-queens') {
      data = [randSmall(5) + 3]; // 4-8
    } else if (id === 'knapsack-01') {
      const ws = Array.from({ length: 4 }, () => randSmall(8));
      const vs = Array.from({ length: 4 }, () => randSmall(10));
      const cap = Math.floor(ws.reduce((a, b) => a + b, 0) * 0.6) + 1;
      data = [...ws, ...vs, cap];
    } else if (id === 'lcs-dp') {
      const xs = Array.from({ length: 5 }, () => randSmall(9));
      const ys = Array.from({ length: 5 }, () => randSmall(9));
      data = [...xs, ...ys];
    } else if (id === 'maze-gen-dfs' || id === 'maze-solve-bfs' || id === 'maze-solve-dfs' || id === 'flood-fill' || id === 'astar-pathfinding' || id === 'activity-selection') {
      data = algo.defaultData;
    }
    // --- Fallback ---
    else {
      data = Array.from({ length: 8 }, rand);
    }

    set({ customData: data, useCustomData: true });
    get().loadAlgorithm(algo);
  },

  loadAlgorithm: (algo: AlgorithmMeta) => {
    const { useCustomData, customData } = get();
    const entry = getAlgorithmById(algo.id);
    if (!entry) return;

    const inputData =
      useCustomData && customData.length > 0
        ? [...customData]
        : [...algo.defaultData];

    const steps = entry.generateSteps(inputData);
    const logs: LogEntry[] = steps.map((s, i) => ({
      step: i + 1,
      description: s.description,
      actionType: s.actionType,
      dataSnapshot: [...s.data],
      timestamp: Date.now() + i,
    }));

    set({
      steps,
      logs,
      currentStep: 0,
      playState: 'idle',
    });
  },

  saveTestCase: () => {
    const { selectedAlgorithm, customData } = get();
    if (!selectedAlgorithm || customData.length === 0) return;
    const cases = loadSavedTestCases();
    cases[selectedAlgorithm.id] = customData;
    saveTestCases(cases);
  },

  loadTestCase: (data: number[]) => {
    set({ customData: data, useCustomData: true });
    const { selectedAlgorithm } = get();
    if (selectedAlgorithm) {
      get().loadAlgorithm(selectedAlgorithm);
    }
  },
}));

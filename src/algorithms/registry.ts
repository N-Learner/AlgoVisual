import type { AlgorithmEntry, VisualStep, AlgorithmMeta, GridCell } from '@/types/algo';

// ============================================================
// Algorithm Registry — extensible step-generator system
// ============================================================

const registry = new Map<string, AlgorithmEntry>();

export function registerAlgorithm(entry: AlgorithmEntry): void {
  registry.set(entry.meta.id, entry);
}

export function getAlgorithmById(id: string): AlgorithmEntry | undefined {
  return registry.get(id);
}

export function getAllAlgorithms(): AlgorithmEntry[] {
  return Array.from(registry.values());
}

export function getAlgorithmsByCategory(category: string): AlgorithmEntry[] {
  return getAllAlgorithms().filter((e) => e.meta.category === category);
}

// ============================================================
// Algorithm: 顺序表插入 (Sequential List Insert)
// ============================================================

const sequentialListInsertMeta: AlgorithmMeta = {
  id: 'seqlist-insert',
  name: '顺序表插入',
  category: 'linear-list',
  difficulty: 'easy',
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(1)',
  description:
    '在顺序表指定位置插入元素。末尾2位=[插入值, 位置]。如输入"10,20,30,40,50,25,2"。',
  templateCode: `function seqListInsert(
  list: number[],
  index: number,
  value: number,
  length: number
): boolean {
  // 检查插入位置是否合法
  if (index < 0 || index > length) {
    return false;
  }
  // 检查是否有剩余空间
  if (length >= list.length) {
    return false;
  }
  // 将 index 及之后的元素后移
  for (let i = length; i > index; i--) {
    list[i] = list[i - 1];
  }
  // 插入新元素
  list[index] = value;
  return true;
}`,
  visualizerType: 'array',
  defaultData: [10, 20, 30, 40, 50, 25, 2],
};

function generateSeqListInsertSteps(data: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const n = data.length;
  const insertValue = data[n - 2] ?? 25;
  const insertIndex = Math.min(data[n - 1] ?? 2, n - 2);
  const originalArr = data.slice(0, n - 2);

  steps.push({
    data: [...originalArr],
    activeIndices: [insertIndex],
    markedIndices: [],
    actionType: 'highlight',
    description: `准备在索引 ${insertIndex} 处插入 ${insertValue}，当前表：[${originalArr.join(', ')}]`,
    highlightLines: [6, 7],
  });

  const working = [...originalArr, 0];
  for (let i = originalArr.length; i > insertIndex; i--) {
    working[i] = working[i - 1];
    steps.push({
      data: [...working],
      activeIndices: [i, i - 1],
      markedIndices: [],
      actionType: 'move',
      description: `arr[${i - 1}]=${originalArr[i - 1]} 后移到 arr[${i}]`,
      highlightLines: [8, 9],
    });
  }

  const result = [...originalArr.slice(0, insertIndex), insertValue, ...originalArr.slice(insertIndex)];
  steps.push({
    data: result,
    activeIndices: [insertIndex],
    markedIndices: [insertIndex],
    actionType: 'insert',
    description: `将 ${insertValue} 放入 arr[${insertIndex}]，插入完成！[${result.join(', ')}]`,
    highlightLines: [10, 11],
  });

  return steps;
}

registerAlgorithm({
  meta: sequentialListInsertMeta,
  generateSteps: generateSeqListInsertSteps,
});

// ============================================================
// Algorithm: 冒泡排序 (Bubble Sort)
// ============================================================

const bubbleSortMeta: AlgorithmMeta = {
  id: 'bubble-sort',
  name: '冒泡排序',
  category: 'sorting',
  difficulty: 'easy',
  timeComplexity: 'O(n²)',
  spaceComplexity: 'O(1)',
  description:
    '重复遍历数组，依次比较相邻元素，如果顺序错误就交换。每轮遍历会将当前未排序部分的最大值"浮"到末尾。',
  templateCode: `function bubbleSort(arr: number[]): void {
  const n = arr.length;
  // 外层循环：控制比较轮数
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    // 内层循环：两两比较相邻元素
    for (let j = 0; j < n - 1 - i; j++) {
      // 比较相邻元素
      if (arr[j] > arr[j + 1]) {
        // 交换
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    // 如果本轮没有交换，说明已有序
    if (!swapped) break;
  }
}`,
  visualizerType: 'array',
  defaultData: [42, 23, 67, 15, 89, 34, 56, 11],
};

function generateBubbleSortSteps(data: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const arr = [...data];
  const n = arr.length;
  const sorted = new Set<number>();

  steps.push({
    data: [...arr],
    activeIndices: [],
    markedIndices: [],
    actionType: 'highlight',
    description: `初始数组：[${arr.join(', ')}]，准备开始冒泡排序`,
    highlightLines: [1, 2],
  });

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;

    for (let j = 0; j < n - 1 - i; j++) {
      // Step: Compare
      steps.push({
        data: [...arr],
        activeIndices: [j, j + 1],
        markedIndices: [...sorted],
        actionType: 'compare',
        description: `第 ${i + 1} 轮：比较 arr[${j}]=${arr[j]} 和 arr[${j + 1}]=${arr[j + 1]}`,
        highlightLines: [7, 8],
      });

      if (arr[j] > arr[j + 1]) {
        // Swap
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;

        steps.push({
          data: [...arr],
          activeIndices: [j, j + 1],
          markedIndices: [...sorted],
          actionType: 'swap',
          description: `交换！arr[${j}] ↔ arr[${j + 1}]，交换后：[${arr.join(', ')}]`,
          highlightLines: [9, 10],
        });
      } else {
        steps.push({
          data: [...arr],
          activeIndices: [j, j + 1],
          markedIndices: [...sorted],
          actionType: 'compare',
          description: `arr[${j}]=${arr[j]} ≤ arr[${j + 1}]=${arr[j + 1]}，无需交换`,
          highlightLines: [7, 8],
        });
      }
    }

    // Mark the last unsorted element as sorted
    sorted.add(n - 1 - i);

    steps.push({
      data: [...arr],
      activeIndices: [],
      markedIndices: [...sorted],
      actionType: 'complete',
      description: `第 ${i + 1} 轮完成，arr[${n - 1 - i}]=${arr[n - 1 - i]} 已归位`,
      highlightLines: [14, 15],
    });

    if (!swapped) {
      // All remaining elements are sorted
      for (let k = 0; k < n - 1 - i; k++) {
        sorted.add(k);
      }
      steps.push({
        data: [...arr],
        activeIndices: [],
        markedIndices: [...sorted],
        actionType: 'complete',
        description: '本轮无交换发生，数组已完全有序，提前结束！',
        highlightLines: [15],
      });
      break;
    }
  }

  // Final step: all sorted
  const allSorted = Array.from({ length: n }, (_, i) => i);
  steps.push({
    data: [...arr],
    activeIndices: [],
    markedIndices: allSorted,
    actionType: 'complete',
    description: `排序完成！最终结果：[${arr.join(', ')}]`,
    highlightLines: [16],
  });

  return steps;
}

registerAlgorithm({
  meta: bubbleSortMeta,
  generateSteps: generateBubbleSortSteps,
});

// ============================================================
// Algorithm: 快速排序 (Quick Sort) — stubbed for extensibility
// ============================================================

const quickSortMeta: AlgorithmMeta = {
  id: 'quick-sort',
  name: '快速排序',
  category: 'sorting',
  difficulty: 'medium',
  timeComplexity: 'O(n log n)',
  spaceComplexity: 'O(log n)',
  description:
    '分治策略：选择一个基准元素，将数组分为小于和大于基准的两部分，递归排序。',
  templateCode: `function quickSort(
  arr: number[],
  low: number,
  high: number
): void {
  if (low < high) {
    const pivot = partition(arr, low, high);
    quickSort(arr, low, pivot - 1);
    quickSort(arr, pivot + 1, high);
  }
}

function partition(
  arr: number[],
  low: number,
  high: number
): number {
  const pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`,
  visualizerType: 'array',
  defaultData: [42, 23, 67, 15, 89, 34, 56, 11],
};

function generateQuickSortSteps(data: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const arr = [...data];

  steps.push({
    data: [...arr],
    activeIndices: [],
    markedIndices: [],
    actionType: 'highlight',
    description: `初始数组：[${arr.join(', ')}]，准备开始快速排序（分治策略）`,
    highlightLines: [1, 2],
  });

  function partition(low: number, high: number, depth: number): number {
    const pivot = arr[high];
    let i = low - 1;

    steps.push({
      data: [...arr],
      activeIndices: [high],
      markedIndices: [],
      actionType: 'highlight',
      description: `选择基准元素 pivot = arr[${high}] = ${pivot}`,
      highlightLines: [14, 15],
    });

    for (let j = low; j < high; j++) {
      steps.push({
        data: [...arr],
        activeIndices: [j, high],
        markedIndices: [],
        actionType: 'compare',
        description: `比较 arr[${j}]=${arr[j]} 与 pivot=${pivot}`,
        highlightLines: [16, 17],
      });

      if (arr[j] <= pivot) {
        i++;
        if (i !== j) {
          [arr[i], arr[j]] = [arr[j], arr[i]];
          steps.push({
            data: [...arr],
            activeIndices: [i, j],
            markedIndices: [],
            actionType: 'swap',
            description: `arr[${j}]=${arr[j]} ≤ pivot，交换 arr[${i}] 和 arr[${j}]`,
            highlightLines: [18, 19],
          });
        }
      }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    steps.push({
      data: [...arr],
      activeIndices: [i + 1],
      markedIndices: [i + 1],
      actionType: 'insert',
      description: `将 pivot=${pivot} 放到正确位置 arr[${i + 1}]`,
      highlightLines: [22, 23],
    });

    return i + 1;
  }

  function qs(low: number, high: number, depth: number) {
    if (low < high) {
      const pi = partition(low, high, depth);
      qs(low, pi - 1, depth + 1);
      qs(pi + 1, high, depth + 1);
    }
  }

  qs(0, arr.length - 1, 0);

  steps.push({
    data: [...arr],
    activeIndices: [],
    markedIndices: Array.from({ length: arr.length }, (_, i) => i),
    actionType: 'complete',
    description: `排序完成！最终结果：[${arr.join(', ')}]`,
    highlightLines: [],
  });

  return steps;
}

registerAlgorithm({
  meta: quickSortMeta,
  generateSteps: generateQuickSortSteps,
});

// ============================================================
// Algorithm: 二分查找 (Binary Search)
// ============================================================

const binarySearchMeta: AlgorithmMeta = {
  id: 'binary-search',
  name: '二分查找',
  category: 'searching',
  difficulty: 'easy',
  timeComplexity: 'O(log n)',
  spaceComplexity: 'O(1)',
  description:
    '在有序数组中查找目标值。每次将查找范围缩小一半，效率远高于顺序查找。',
  templateCode: `function binarySearch(
  arr: number[],
  target: number
): number {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor(
      (left + right) / 2
    );
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}`,
  visualizerType: 'array',
  defaultData: [5, 12, 23, 38, 45, 56, 67, 78, 89, 95, 45],
};

function generateBinarySearchSteps(data: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const target = data[data.length - 1] ?? 45;
  const arr = [...data.slice(0, -1)].sort((a, b) => a - b);

  steps.push({
    data: [...data],
    activeIndices: [],
    markedIndices: [],
    actionType: 'highlight',
    description: `在有序数组中二分查找目标值 ${target}，初始数组：[${data.join(', ')}]`,
    highlightLines: [1, 2, 3],
  });

  let left = 0;
  let right = data.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    steps.push({
      data: [...data],
      activeIndices: [left, right],
      markedIndices: [],
      actionType: 'highlight',
      description: `查找范围：[${left}, ${right}]，计算 mid = ${mid}`,
      highlightLines: [6, 7, 8],
    });

    steps.push({
      data: [...data],
      activeIndices: [mid],
      markedIndices: [],
      actionType: 'compare',
      description: `比较 arr[${mid}]=${data[mid]} 与 target=${target}`,
      highlightLines: [9, 10],
    });

    if (data[mid] === target) {
      steps.push({
        data: [...data],
        activeIndices: [mid],
        markedIndices: [mid],
        actionType: 'complete',
        description: `找到目标值！arr[${mid}]=${target}，返回索引 ${mid}`,
        highlightLines: [10],
      });
      return steps;
    } else if (data[mid] < target) {
      steps.push({
        data: [...data],
        activeIndices: [mid],
        markedIndices: Array.from({ length: mid + 1 }, (_, i) => i),
        actionType: 'move',
        description: `arr[${mid}]=${data[mid]} < target=${target}，舍弃左半部分，left = ${mid + 1}`,
        highlightLines: [11, 12],
      });
      left = mid + 1;
    } else {
      steps.push({
        data: [...data],
        activeIndices: [mid],
        markedIndices: Array.from({ length: data.length - mid }, (_, i) => i + mid),
        actionType: 'move',
        description: `arr[${mid}]=${data[mid]} > target=${target}，舍弃右半部分，right = ${mid - 1}`,
        highlightLines: [13, 14],
      });
      right = mid - 1;
    }
  }

  steps.push({
    data: [...data],
    activeIndices: [],
    markedIndices: [],
    actionType: 'complete',
    description: `未找到目标值 ${target}，返回 -1`,
    highlightLines: [16],
  });

  return steps;
}

registerAlgorithm({
  meta: binarySearchMeta,
  generateSteps: generateBinarySearchSteps,
});

// ============================================================
// Algorithm: 单链表遍历 (Linked List Traversal)
// ============================================================

const linkedListTraversalMeta: AlgorithmMeta = {
  id: 'linkedlist-traverse',
  name: '链表遍历',
  category: 'linear-list',
  difficulty: 'easy',
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(1)',
  description:
    '从头节点开始，依次访问链表的每个节点，直到尾节点（指向 null）。',
  templateCode: `class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val: number) {
    this.val = val;
    this.next = null;
  }
}

function traverse(head: ListNode): void {
  let current = head;
  while (current !== null) {
    console.log(current.val);
    current = current.next;
  }
}`,
  visualizerType: 'linked-list',
  defaultData: [10, 20, 30, 40, 50],
};

function generateLinkedListTraverseSteps(data: number[]): VisualStep[] {
  const steps: VisualStep[] = [];

  steps.push({
    data: [...data],
    activeIndices: [],
    markedIndices: [],
    actionType: 'highlight',
    description: `链表：[${data.join(' → ')} → null]，准备开始遍历`,
    highlightLines: [11, 12],
  });

  for (let i = 0; i < data.length; i++) {
    steps.push({
      data: [...data],
      activeIndices: [i],
      markedIndices: Array.from({ length: i }, (_, k) => k),
      actionType: 'highlight',
      description: `访问节点 ${i}，值为 ${data[i]}，指针移动到下一个节点`,
      highlightLines: [13, 14, 15],
    });
  }

  steps.push({
    data: [...data],
    activeIndices: [],
    markedIndices: Array.from({ length: data.length }, (_, i) => i),
    actionType: 'complete',
    description: `到达链表末尾（null），遍历完成！共访问了 ${data.length} 个节点`,
    highlightLines: [16],
  });

  return steps;
}

registerAlgorithm({
  meta: linkedListTraversalMeta,
  generateSteps: generateLinkedListTraverseSteps,
});

// ============================================================
// Algorithm: Dijkstra 最短路径
// ============================================================

const dijkstraMeta: AlgorithmMeta = {
  id: 'dijkstra',
  name: 'Dijkstra 最短路径',
  category: 'graph',
  difficulty: 'hard',
  timeComplexity: 'O((V+E) log V)',
  spaceComplexity: 'O(V)',
  templateCode: `function dijkstra(
  graph: number[][],
  start: number
): number[] {
  const n = graph.length;
  const dist = new Array(n).fill(Infinity);
  const visited = new Array(n).fill(false);
  dist[start] = 0;

  for (let i = 0; i < n; i++) {
    // 选择未访问的最小距离节点
    let u = -1;
    for (let j = 0; j < n; j++) {
      if (!visited[j] &&
          (u === -1 || dist[j] < dist[u])) {
        u = j;
      }
    }
    visited[u] = true;
    // 松弛相邻边
    for (let v = 0; v < n; v++) {
      if (graph[u][v] > 0 &&
          dist[u] + graph[u][v] < dist[v]) {
        dist[v] = dist[u] + graph[u][v];
      }
    }
  }
  return dist;
}`,
  description: '从起点A出发，贪心选最小距离节点松弛邻边。输入：N,from,to,w,... 如"5,0,1,4,0,2,1,1,2,2,1,3,5,2,3,8,2,4,10,3,4,2"。',
  visualizerType: 'graph',
  defaultData: [5, 0,1,4, 0,2,1, 1,2,2, 1,3,5, 2,3,8, 2,4,10, 3,4,2],
};

function generateDijkstraSteps(data: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const INF = Infinity;
  const n = data[0] || 5;
  const graph: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  const edges: Array<{ from: number; to: number; w: number }> = [];
  for (let i = 1; i + 2 < data.length; i += 3) {
    const u = data[i], v = data[i + 1], w = data[i + 2];
    graph[u][v] = w; graph[v][u] = w;
    edges.push({ from: u, to: v, w });
  }
  const dist = new Array(n).fill(INF);
  const visited = new Array(n).fill(false);
  dist[0] = 0;
  const allGraphEdges = edges.map(e => ({ from: e.from, to: e.to, active: false, weight: e.w }));

  function stepData() { return [n, ...dist.map((d: number) => (d === INF ? -1 : d))]; }

  steps.push({
    data: stepData(), activeIndices: [0], markedIndices: [],
    actionType: 'highlight',
    description: `Dijkstra：${n}节点${edges.length}条边，起点A距离=0`,
    highlightLines: [6, 7, 8],
    graphEdges: [...allGraphEdges],
  });

  for (let i = 0; i < n; i++) {
    // Pick unvisited node with minimum distance
    let u = -1;
    for (let j = 0; j < n; j++) {
      if (!visited[j] && (u === -1 || dist[j] < dist[u])) {
        u = j;
      }
    }

    if (u === -1 || dist[u] === INF) break;

    const prevMarked = visited.reduce<number[]>((acc, v, idx) => (v ? [...acc, idx] : acc), []);

    steps.push({
      data: stepData(), activeIndices: [u], markedIndices: prevMarked,
      actionType: 'highlight',
      description: `选择距离最小的未访问节点 ${u}（dist[${u}]=${dist[u]}），标记为已访问`,
      highlightLines: [10, 11, 12, 13, 14, 15],
      graphEdges: [...allGraphEdges],
    });

    visited[u] = true;
    const newMarked = [...prevMarked, u];

    // Relax edges from u
    for (let v = 0; v < n; v++) {
      if (graph[u][v] > 0 && !visited[v]) {
        const oldDist = dist[v];
        const newDist = dist[u] + graph[u][v];

        steps.push({
          data: stepData(), activeIndices: [u, v], markedIndices: newMarked,
          actionType: 'compare',
          description: `检查边(${u}→${v})：dist[${u}]+w=${dist[u]}+${graph[u][v]}=${newDist}，dist[${v}]=${oldDist === INF ? '∞' : oldDist}`,
          highlightLines: [17, 18],
          graphEdges: allGraphEdges.map(e => ({ ...e, active: e.from === u && e.to === v })),
        });
        if (newDist < dist[v]) {
          dist[v] = newDist;
          steps.push({
            data: stepData(), activeIndices: [u, v], markedIndices: newMarked,
            actionType: 'move',
            description: `松弛成功！更新 dist[${v}]：${oldDist === INF ? '∞' : oldDist} → ${newDist}`,
            highlightLines: [19, 20],
            graphEdges: allGraphEdges.map(e => ({ ...e, active: e.from === u && e.to === v })),
          });
        }
      }
    }
  }

  steps.push({
    data: [n, ...dist], activeIndices: [], markedIndices: Array.from({ length: n }, (_, i) => i),
    actionType: 'complete', description: `Dijkstra完成！最短距离：[${dist.join(', ')}]`, highlightLines: [24],
    graphEdges: [...allGraphEdges],
  });

  return steps;
}

registerAlgorithm({
  meta: dijkstraMeta,
  generateSteps: generateDijkstraSteps,
});

// ============================================================
// Algorithm: 选择排序 (Selection Sort)
// ============================================================

const selectionSortMeta: AlgorithmMeta = {
  id: 'selection-sort',
  name: '选择排序',
  category: 'sorting',
  difficulty: 'easy',
  timeComplexity: 'O(n²)',
  spaceComplexity: 'O(1)',
  description: '每轮从未排序区选出最小值，与未排序区头部交换，逐步扩大已排序区。',
  templateCode: `function selectionSort(arr: number[]): void {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    // 在未排序区找最小值
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    // 将最小值交换到已排序区末尾
    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
  }
}`,
  visualizerType: 'array',
  defaultData: [42, 23, 67, 15, 89, 34],
};

function generateSelectionSortSteps(data: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const arr = [...data];
  const n = arr.length;
  const sorted = new Set<number>();

  steps.push({
    data: [...arr], activeIndices: [], markedIndices: [],
    actionType: 'highlight',
    description: `初始数组：[${arr.join(', ')}]，准备开始选择排序`,
    highlightLines: [1, 2],
  });

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    steps.push({
      data: [...arr], activeIndices: [i], markedIndices: [...sorted],
      actionType: 'highlight',
      description: `第 ${i + 1} 轮：假设 arr[${i}]=${arr[i]} 为最小值`,
      highlightLines: [3, 4],
    });

    for (let j = i + 1; j < n; j++) {
      steps.push({
        data: [...arr], activeIndices: [minIdx, j], markedIndices: [...sorted],
        actionType: 'compare',
        description: `比较 arr[${j}]=${arr[j]} 与当前最小值 arr[${minIdx}]=${arr[minIdx]}`,
        highlightLines: [5, 6, 7],
      });
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        steps.push({
          data: [...arr], activeIndices: [j], markedIndices: [...sorted],
          actionType: 'highlight',
          description: `发现更小值 arr[${j}]=${arr[j]}，更新 minIdx=${j}`,
          highlightLines: [6],
        });
      }
    }

    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      steps.push({
        data: [...arr], activeIndices: [i, minIdx], markedIndices: [...sorted],
        actionType: 'swap',
        description: `交换 arr[${i}] 和 arr[${minIdx}]：${arr[minIdx]} ↔ ${arr[i]}`,
        highlightLines: [10],
      });
    }
    sorted.add(i);
    steps.push({
      data: [...arr], activeIndices: [], markedIndices: [...sorted],
      actionType: 'complete',
      description: `arr[${i}]=${arr[i]} 已归位`,
      highlightLines: [],
    });
  }
  sorted.add(n - 1);

  steps.push({
    data: [...arr], activeIndices: [], markedIndices: [...sorted],
    actionType: 'complete',
    description: `排序完成！[${arr.join(', ')}]`,
    highlightLines: [],
  });
  return steps;
}

registerAlgorithm({ meta: selectionSortMeta, generateSteps: generateSelectionSortSteps });

// ============================================================
// Algorithm: 插入排序 (Insertion Sort)
// ============================================================

const insertionSortMeta: AlgorithmMeta = {
  id: 'insertion-sort',
  name: '插入排序',
  category: 'sorting',
  difficulty: 'easy',
  timeComplexity: 'O(n²)',
  spaceComplexity: 'O(1)',
  description: '像整理扑克牌一样，将每个元素插入到已排序区的正确位置。',
  templateCode: `function insertionSort(arr: number[]): void {
  const n = arr.length;
  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;
    // 将大于 key 的元素后移
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    // 插入 key
    arr[j + 1] = key;
  }
}`,
  visualizerType: 'array',
  defaultData: [42, 23, 67, 15, 89, 34],
};

function generateInsertionSortSteps(data: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const arr = [...data];
  const n = arr.length;
  const sorted = new Set<number>([0]);

  steps.push({
    data: [...arr], activeIndices: [], markedIndices: [0],
    actionType: 'highlight',
    description: `初始数组：[${arr.join(', ')}]，第一个元素默认有序`,
    highlightLines: [1, 2],
  });

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    steps.push({
      data: [...arr], activeIndices: [i], markedIndices: [...sorted],
      actionType: 'highlight',
      description: `取出 key=arr[${i}]=${key}，准备插入已排序区`,
      highlightLines: [3, 4],
    });

    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      steps.push({
        data: [...arr], activeIndices: [j, j + 1], markedIndices: [...sorted],
        actionType: 'move',
        description: `arr[${j}]=${arr[j + 1]} > key=${key}，后移到 arr[${j + 1}]`,
        highlightLines: [6, 7],
      });
      j--;
    }
    arr[j + 1] = key;
    steps.push({
      data: [...arr], activeIndices: [j + 1], markedIndices: [...sorted],
      actionType: 'insert',
      description: `将 key=${key} 插入 arr[${j + 1}]`,
      highlightLines: [9],
    });
    sorted.add(i);
  }

  steps.push({
    data: [...arr], activeIndices: [], markedIndices: [...sorted],
    actionType: 'complete',
    description: `排序完成！[${arr.join(', ')}]`,
    highlightLines: [],
  });
  return steps;
}

registerAlgorithm({ meta: insertionSortMeta, generateSteps: generateInsertionSortSteps });

// ============================================================
// Algorithm: 归并排序 (Merge Sort)
// ============================================================

const mergeSortMeta: AlgorithmMeta = {
  id: 'merge-sort',
  name: '归并排序',
  category: 'sorting',
  difficulty: 'medium',
  timeComplexity: 'O(n log n)',
  spaceComplexity: 'O(n)',
  description: '分治策略：递归将数组对半分割直到单元素，再两两合并有序子数组。',
  templateCode: `function mergeSort(arr: number[], l: number, r: number): void {
  if (l >= r) return;
  const mid = Math.floor((l + r) / 2);
  mergeSort(arr, l, mid);      // 递归左半
  mergeSort(arr, mid + 1, r);  // 递归右半
  merge(arr, l, mid, r);       // 合并左右
}

function merge(arr: number[], l: number, m: number, r: number): void {
  const left = arr.slice(l, m + 1);
  const right = arr.slice(m + 1, r + 1);
  let i = 0, j = 0, k = l;
  while (i < left.length && j < right.length) {
    arr[k++] = left[i] <= right[j] ? left[i++] : right[j++];
  }
  while (i < left.length) arr[k++] = left[i++];
  while (j < right.length) arr[k++] = right[j++];
}`,
  visualizerType: 'array',
  defaultData: [42, 23, 67, 15, 89, 34, 56, 11],
};

function generateMergeSortSteps(data: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const arr = [...data];

  steps.push({
    data: [...arr], activeIndices: [], markedIndices: [],
    actionType: 'highlight',
    description: `初始数组：[${arr.join(', ')}]，准备归并排序（分治）`,
    highlightLines: [1, 2],
  });

  function merge(l: number, m: number, r: number) {
    steps.push({
      data: [...arr], activeIndices: Array.from({ length: r - l + 1 }, (_, i) => l + i),
      markedIndices: [],
      actionType: 'merge',
      description: `合并区间 [${l}, ${m}] 和 [${m + 1}, ${r}]`,
      highlightLines: [8, 9, 10],
    });

    const left = arr.slice(l, m + 1);
    const right = arr.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;

    while (i < left.length && j < right.length) {
      steps.push({
        data: [...arr], activeIndices: [l + i, m + 1 + j], markedIndices: [],
        actionType: 'compare',
        description: `比较 left[${i}]=${left[i]} 和 right[${j}]=${right[j]}`,
        highlightLines: [11, 12],
      });
      if (left[i] <= right[j]) {
        arr[k++] = left[i++];
        steps.push({
          data: [...arr], activeIndices: [k - 1], markedIndices: [],
          actionType: 'move',
          description: `放入 left[${i - 1}]=${left[i - 1]} 到 arr[${k - 1}]`,
          highlightLines: [12],
        });
      } else {
        arr[k++] = right[j++];
        steps.push({
          data: [...arr], activeIndices: [k - 1], markedIndices: [],
          actionType: 'move',
          description: `放入 right[${j - 1}]=${right[j - 1]} 到 arr[${k - 1}]`,
          highlightLines: [12],
        });
      }
    }
    while (i < left.length) {
      arr[k++] = left[i++];
      steps.push({
        data: [...arr], activeIndices: [k - 1], markedIndices: [],
        actionType: 'move',
        description: `剩余左半元素放入 arr[${k - 1}]`,
        highlightLines: [14],
      });
    }
    while (j < right.length) {
      arr[k++] = right[j++];
      steps.push({
        data: [...arr], activeIndices: [k - 1], markedIndices: [],
        actionType: 'move',
        description: `剩余右半元素放入 arr[${k - 1}]`,
        highlightLines: [15],
      });
    }

    steps.push({
      data: [...arr], activeIndices: [], markedIndices: Array.from({ length: r - l + 1 }, (_, i) => l + i),
      actionType: 'complete',
      description: `区间 [${l}, ${r}] 合并完成：[${arr.slice(l, r + 1).join(', ')}]`,
      highlightLines: [],
    });
  }

  function mergeSortRec(l: number, r: number) {
    if (l >= r) return;
    const mid = Math.floor((l + r) / 2);

    steps.push({
      data: [...arr], activeIndices: [l, r], markedIndices: [],
      actionType: 'divide',
      description: `分割区间 [${l}, ${r}] → [${l}, ${mid}] 和 [${mid + 1}, ${r}]`,
      highlightLines: [3, 4, 5],
    });

    mergeSortRec(l, mid);
    mergeSortRec(mid + 1, r);
    merge(l, mid, r);
  }

  mergeSortRec(0, arr.length - 1);

  steps.push({
    data: [...arr], activeIndices: [], markedIndices: Array.from({ length: arr.length }, (_, i) => i),
    actionType: 'complete',
    description: `排序完成！[${arr.join(', ')}]`,
    highlightLines: [],
  });
  return steps;
}

registerAlgorithm({ meta: mergeSortMeta, generateSteps: generateMergeSortSteps });

// ============================================================
// Algorithm: BFS 广度优先搜索 (Graph)
// ============================================================

const graphBFSMeta: AlgorithmMeta = {
  id: 'graph-bfs',
  name: 'BFS 广度优先搜索',
  category: 'graph',
  difficulty: 'medium',
  timeComplexity: 'O(V+E)',
  spaceComplexity: 'O(V)',
  description: '从起点逐层扩散。输入：N,from,to,... 如"5,0,1,0,2,1,2,1,3,2,3,2,4,3,4"。',
  templateCode: `function bfs(graph: number[][], start: number): number[] {
  const n = graph.length;
  const visited = new Array(n).fill(false);
  const queue: number[] = [start];
  const order: number[] = [];
  visited[start] = true;

  while (queue.length > 0) {
    const u = queue.shift()!;
    order.push(u);
    for (let v = 0; v < n; v++) {
      if (graph[u][v] > 0 && !visited[v]) {
        visited[v] = true;
        queue.push(v);
      }
    }
  }
  return order;
}`,
  visualizerType: 'graph',
  defaultData: [5, 0,1, 0,2, 1,2, 1,3, 2,3, 2,4, 3,4],
};

function generateGraphBFSSteps(data: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const n = data[0] || 5;
  const graph: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  const allEdges: import('@/types/algo').GraphEdgeHighlight[] = [];
  for (let i = 1; i + 1 < data.length; i += 2) {
    const u = data[i], v = data[i + 1];
    graph[u][v] = 1; graph[v][u] = 1;
    allEdges.push({ from: u, to: v, active: false, weight: 1 });
  }
  const visited = new Array(n).fill(false);
  const queue: number[] = [0];
  visited[0] = true;
  const distData = new Array(n).fill(-1);
  distData[0] = 0;

  function bfsData() { return [n, ...distData]; }
  steps.push({
    data: bfsData(), activeIndices: [0], markedIndices: [],
    actionType: 'visit', description: `BFS从A出发，${n}节点${allEdges.length}条边`,
    highlightLines: [3, 4, 5], graphEdges: [...allEdges],
  });

  while (queue.length > 0) {
    const u = queue.shift()!;
    steps.push({
      data: bfsData(), activeIndices: [u],
      markedIndices: visited.reduce<number[]>((a, v, i) => (v ? [...a, i] : a), []),
      actionType: 'visit', description: `从队列取出 ${u}，访问邻居`,
      highlightLines: [7, 8], graphEdges: [...allEdges],
    });

    for (let v = 0; v < n; v++) {
      if (graph[u][v] > 0 && !visited[v]) {
        visited[v] = true;
        queue.push(v);
        distData[v] = distData[u] + 1;
        steps.push({
          data: bfsData(), activeIndices: [u, v],
          markedIndices: visited.reduce<number[]>((a, vv, i) => (vv ? [...a, i] : a), []),
          actionType: 'visit', description: `发现邻居 ${v}，层级=${distData[v]}`,
          highlightLines: [9, 10, 11],
          graphEdges: allEdges.map(e => ({ ...e, active: (e.from === u && e.to === v) || (e.from === v && e.to === u) })),
        });
      }
    }
  }

  steps.push({
    data: bfsData(), activeIndices: [], markedIndices: Array.from({length:n},(_,i)=>i),
    actionType: 'complete', description: `BFS完成！层级：[${distData.join(', ')}]`,
    highlightLines: [14], graphEdges: [...allEdges],
  });
  return steps;
}

registerAlgorithm({ meta: graphBFSMeta, generateSteps: generateGraphBFSSteps });

// ============================================================
// Algorithm: DFS 深度优先搜索 (Graph)
// ============================================================

const graphDFSMeta: AlgorithmMeta = {
  id: 'graph-dfs',
  name: 'DFS 深度优先搜索',
  category: 'graph',
  difficulty: 'medium',
  timeComplexity: 'O(V+E)',
  spaceComplexity: 'O(V)',
  description: '从起点一路深入，撞墙后回溯，使用递归栈探索所有可达节点。',
  templateCode: `function dfs(graph: number[][], u: number, visited: boolean[]): void {
  visited[u] = true;
  console.log(u); // 访问节点
  for (let v = 0; v < graph.length; v++) {
    if (graph[u][v] > 0 && !visited[v]) {
      dfs(graph, v, visited); // 递归深入
    }
  }
}`,
  visualizerType: 'graph',
  defaultData: [5, 0,1, 0,2, 1,3, 2,3, 2,4],
};

function generateGraphDFSSteps(data: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const n = data[0] || 5;
  const graph: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  const allEdges: import('@/types/algo').GraphEdgeHighlight[] = [];
  for (let i = 1; i + 1 < data.length; i += 2) {
    const u = data[i], v = data[i + 1];
    graph[u][v] = 1; graph[v][u] = 1;
    allEdges.push({ from: u, to: v, active: false, weight: 1 });
  }
  const visited = new Array(n).fill(false);
  const distData: number[] = new Array(n).fill(-1);
  function dfsData() { return [n, ...distData]; }

  steps.push({
    data: dfsData(), activeIndices: [], markedIndices: [],
    actionType: 'highlight', description: `DFS：${n}节点${allEdges.length}条边`,
    highlightLines: [1], graphEdges: [...allEdges],
  });

  function dfsRec(u: number, depth: number) {
    visited[u] = true;
    distData[u] = depth;
    const mk = () => visited.reduce<number[]>((a, v, i) => (v ? [...a, i] : a), []);
    steps.push({
      data: dfsData(), activeIndices: [u], markedIndices: mk(),
      actionType: 'recurse-in', description: `进入节点${u}（深度${depth}）`,
      highlightLines: [2, 3], graphEdges: [...allEdges],
    });

    for (let v = 0; v < n; v++) {
      if (graph[u][v] > 0) {
        if (!visited[v]) {
          steps.push({
            data: dfsData(), activeIndices: [u, v], markedIndices: mk(),
            actionType: 'visit', description: `发现邻居${v}，深入`,
            highlightLines: [4, 5],
            graphEdges: allEdges.map(e => ({ ...e, active: (e.from===u&&e.to===v)||(e.from===v&&e.to===u) })),
          });
          dfsRec(v, depth + 1);
        } else {
          steps.push({
            data: dfsData(), activeIndices: [u, v], markedIndices: mk(),
            actionType: 'backtrack', description: `邻居${v}已访问，跳过`,
            highlightLines: [4],
            graphEdges: allEdges.map(e => ({ ...e, active: false })),
          });
        }
      }
    }

    steps.push({
      data: dfsData(), activeIndices: [u], markedIndices: mk(),
      actionType: 'recurse-out', description: `${u}探索完毕，回溯`,
      highlightLines: [6],
      graphEdges: [],
    });
  }

  dfsRec(0, 0);

  steps.push({
    data: dfsData(), activeIndices: [], markedIndices: Array.from({length:n},(_,i)=>i),
    actionType: 'complete', description: `DFS完成！深度：[${distData.join(', ')}]`,
    highlightLines: [], graphEdges: [...allEdges],
  });
  return steps;
}

registerAlgorithm({ meta: graphDFSMeta, generateSteps: generateGraphDFSSteps });

// ============================================================
// Algorithm: 顺序栈入栈/出栈
// ============================================================

const seqStackMeta: AlgorithmMeta = {
  id: 'seq-stack',
  name: '顺序栈入栈/出栈',
  category: 'stack-queue',
  difficulty: 'easy',
  timeComplexity: 'O(1)',
  spaceComplexity: 'O(n)',
  description: '模拟顺序栈的 push（入栈）和 pop（出栈）操作，top 指针上下移动。',
  templateCode: `class SeqStack {
  data: number[];
  top: number;
  constructor(capacity: number) {
    this.data = new Array(capacity).fill(0);
    this.top = -1; // 空栈
  }

  push(val: number): boolean {
    if (this.top >= this.data.length - 1) return false;
    this.data[++this.top] = val;
    return true;
  }

  pop(): number | null {
    if (this.top < 0) return null;
    return this.data[this.top--];
  }
}`,
  visualizerType: 'array',
  defaultData: [10, 20, 30, 40],
};

function generateSeqStackSteps(data: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const values = data.length > 0 ? data : [10, 20, 30];
  const capacity = Math.max(values.length + 2, 6);
  const stack = new Array(capacity).fill(0);
  let top = -1;
  // Use user data as push values, interleave with pops
  const ops: Array<{ type: 'push'; val: number } | { type: 'pop' }> = [];
  for (const v of values) ops.push({ type: 'push', val: v });
  ops.push({ type: 'pop' });
  if (values.length > 2) ops.push({ type: 'pop' });

  steps.push({
    data: [...stack], activeIndices: [], markedIndices: [],
    actionType: 'highlight',
    description: `空栈（容量 ${capacity}），top=-1`,
    highlightLines: [5],
    pointerPositions: [{ name: 'top', position: -1, label: 'top=-1' }],
  });

  for (const op of ops) {
    if (op.type === 'push' && op.val !== undefined) {
      if (top >= capacity - 1) continue;
      top++;
      stack[top] = op.val;
      steps.push({
        data: [...stack], activeIndices: [top], markedIndices: Array.from({ length: top }, (_, i) => i),
        actionType: 'insert',
        description: `push(${op.val}) → data[${top}]=${op.val}，top=${top}`,
        highlightLines: [9, 10],
        pointerPositions: [{ name: 'top', position: top }],
      });
    } else if (op.type === 'pop') {
      if (top < 0) continue;
      const val = stack[top];
      stack[top] = 0;
      steps.push({
        data: [...stack], activeIndices: [top], markedIndices: Array.from({ length: top }, (_, i) => i),
        actionType: 'delete',
        description: `pop() → 返回 ${val}，top=${top - 1}`,
        highlightLines: [14, 15],
        pointerPositions: [{ name: 'top', position: top }],
      });
      top--;
    }
  }

  steps.push({
    data: [...stack], activeIndices: [], markedIndices: Array.from({ length: top + 1 }, (_, i) => i),
    actionType: 'complete',
    description: `栈操作演示完成，当前栈：[${stack.slice(0, top + 1).join(', ')}]，top=${top}`,
    highlightLines: [],
  });
  return steps;
}

registerAlgorithm({ meta: seqStackMeta, generateSteps: generateSeqStackSteps });

// ============================================================
// Algorithm: 顺序查找
// ============================================================

const seqSearchMeta: AlgorithmMeta = {
  id: 'seq-search',
  name: '顺序查找',
  category: 'searching',
  difficulty: 'easy',
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(1)',
  description: '从数组头到尾逐个比较，直到找到目标或遍历完整个数组。',
  templateCode: `function sequentialSearch(arr: number[], target: number): number {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i; // 找到
  }
  return -1; // 未找到
}`,
  visualizerType: 'array',
  defaultData: [23, 45, 12, 67, 34, 89, 56, 67],
};

function generateSeqSearchSteps(data: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const target = data[data.length - 1] ?? 67;
  const arr = data.slice(0, -1);

  steps.push({
    data: [...arr], activeIndices: [], markedIndices: [],
    actionType: 'highlight',
    description: `在数组中顺序查找目标值 ${target}，数组：[${arr.join(', ')}]`,
    highlightLines: [1, 2],
  });

  for (let i = 0; i < arr.length; i++) {
    steps.push({
      data: [...arr], activeIndices: [i],
      markedIndices: Array.from({ length: i }, (_, k) => k),
      actionType: 'compare',
      description: `比较 arr[${i}]=${arr[i]} 与 target=${target}`,
      highlightLines: [2, 3],
    });

    if (arr[i] === target) {
      steps.push({
        data: [...arr], activeIndices: [i], markedIndices: [i],
        actionType: 'complete',
        description: `找到！arr[${i}]=${target}，返回索引 ${i}`,
        highlightLines: [3],
      });
      return steps;
    }
  }

  steps.push({
    data: [...arr], activeIndices: [], markedIndices: [],
    actionType: 'complete',
    description: `未找到目标值 ${target}，返回 -1`,
    highlightLines: [4],
  });
  return steps;
}

registerAlgorithm({ meta: seqSearchMeta, generateSteps: generateSeqSearchSteps });

// ============================================================
// Algorithm: DFS 迷宫生成（递归回溯）
// ============================================================

const mazeGenDFSMeta: AlgorithmMeta = {
  id: 'maze-gen-dfs',
  name: 'DFS 迷宫生成',
  category: 'advanced',
  difficulty: 'hard',
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(n)',
  description: '使用递归回溯算法（Randomized DFS）生成完美迷宫——每个单元格都可达，且路径唯一。',
  templateCode: `function generateMaze(rows: number, cols: number): number[][] {
  // 0=墙 1=通路
  const maze = Array.from({length: rows}, () => new Array(cols).fill(0));
  function carve(r: number, c: number) {
    maze[r][c] = 1;
    const dirs = [[-2,0],[2,0],[0,-2],[0,2]];
    shuffle(dirs); // 随机打乱方向
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr>0 && nr<rows-1 && nc>0 && nc<cols-1 && maze[nr][nc]===0) {
        maze[r+dr/2][c+dc/2] = 1; // 打通墙壁
        carve(nr, nc);
      }
    }
  }
  carve(1, 1);
  return maze;
}`,
  visualizerType: 'grid',
  defaultData: [15, 15],
};

function generateMazeGenDFSSteps(data: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const rows = 15, cols = 15;
  const maze = Array.from({ length: rows }, () => new Array(cols).fill(0));

  // Initialize: mark all as wall
  steps.push({
    data: [], activeIndices: [], markedIndices: [],
    actionType: 'highlight',
    description: `初始化 ${rows}×${cols} 网格（全墙），开始 DFS 迷宫生成`,
    highlightLines: [2, 3],
    gridData: maze.map((r) => [...r]),
  });

  const dirs: [number, number][] = [[-2, 0], [2, 0], [0, -2], [0, 2]];

  function shuffle<T>(arr: T[]) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  function carve(r: number, c: number) {
    maze[r][c] = 1;
    steps.push({
      data: [], activeIndices: [], markedIndices: [],
      actionType: 'move',
      description: `挖掘单元格 (${r}, ${c})`,
      highlightLines: [6],
      gridData: maze.map((row) => [...row]),
      gridCells: [{ row: r, col: c, state: 'visiting' }],
    });

    const shuffled = [...dirs];
    shuffle(shuffled);

    for (const [dr, dc] of shuffled) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr > 0 && nr < rows - 1 && nc > 0 && nc < cols - 1 && maze[nr][nc] === 0) {
        // Carve wall between current and next
        maze[r + dr / 2][c + dc / 2] = 1;
        steps.push({
          data: [], activeIndices: [], markedIndices: [],
          actionType: 'delete',
          description: `打通墙壁 (${r + dr / 2}, ${c + dc / 2})，向 (${nr}, ${nc}) 前进`,
          highlightLines: [10],
          gridData: maze.map((row) => [...row]),
          gridCells: [
            { row: r + dr / 2, col: c + dc / 2, state: 'path' },
            { row: nr, col: nc, state: 'visiting' },
          ],
        });
        carve(nr, nc);
      }
    }

    // Mark current cell as done
    steps.push({
      data: [], activeIndices: [], markedIndices: [],
      actionType: 'recurse-out',
      description: `回溯：单元格 (${r}, ${c}) 四个方向均探索完毕`,
      highlightLines: [12],
      gridData: maze.map((row) => [...row]),
      gridCells: [{ row: r, col: c, state: 'visited' }],
    });
  }

  carve(1, 1);

  steps.push({
    data: [], activeIndices: [], markedIndices: [],
    actionType: 'complete',
    description: `迷宫生成完成！所有可达路径已挖通`,
    highlightLines: [],
    gridData: maze.map((row) => [...row]),
  });
  return steps;
}

registerAlgorithm({ meta: mazeGenDFSMeta, generateSteps: generateMazeGenDFSSteps });

// ============================================================
// Algorithm: BFS 迷宫求解
// ============================================================

const mazeSolveBFSMeta: AlgorithmMeta = {
  id: 'maze-solve-bfs',
  name: 'BFS 迷宫求解',
  category: 'advanced',
  difficulty: 'medium',
  timeComplexity: 'O(V+E)',
  spaceComplexity: 'O(V)',
  description: '使用 BFS 在迷宫中找到从起点到终点的最短路径。',
  templateCode: `function solveMazeBFS(maze: number[][], sr: number, sc: number, er: number, ec: number): [number,number][] {
  const rows = maze.length, cols = maze[0].length;
  const visited = Array.from({length: rows}, () => new Array(cols).fill(false));
  const prev: Map<string, [number,number]|null> = new Map();
  const queue: [number,number][] = [[sr, sc]];
  visited[sr][sc] = true;
  const dirs = [[-1,0],[1,0],[0,-1],[0,1]];

  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    if (r === er && c === ec) break; // 到达终点
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr>=0 && nr<rows && nc>=0 && nc<cols && maze[nr][nc]===1 && !visited[nr][nc]) {
        visited[nr][nc] = true;
        prev.set(\`\${nr},\${nc}\`, [r, c]);
        queue.push([nr, nc]);
      }
    }
  }
  // 回溯路径
  const path: [number,number][] = [];
  let cur: [number,number] | null = [er, ec];
  while (cur) { path.unshift(cur); cur = prev.get(\`\${cur[0]},\${cur[1]}\`) ?? null; }
  return path;
}`,
  visualizerType: 'grid',
  defaultData: [15, 15],
};

function generateMazeSolveBFSSteps(data: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  // Pre-built simple maze (0=wall, 1=path, 2=start, 3=end)
  const rows = 9, cols = 9;
  const maze = [
    [2, 1, 0, 0, 1, 1, 1, 0, 0],
    [0, 1, 0, 0, 1, 0, 1, 0, 0],
    [0, 1, 1, 1, 1, 0, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0],
    [1, 1, 1, 1, 1, 1, 0, 1, 1],
    [0, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 1, 1, 1, 0, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 0, 3, 0],
  ];
  const visited = Array.from({ length: rows }, () => new Array(cols).fill(false));
  const prev = new Map<string, [number, number]>();
  const queue: [number, number][] = [[0, 0]];
  visited[0][0] = true;
  const dirs: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  steps.push({
    data: [], activeIndices: [], markedIndices: [],
    actionType: 'highlight',
    description: `迷宫（${rows}×${cols}），绿色=起点，红色=终点。BFS 求解最短路径`,
    highlightLines: [1, 2, 3],
    gridData: maze.map((r) => [...r]),
    gridCells: [{ row: 0, col: 0, state: 'start' }, { row: 8, col: 7, state: 'end' }],
  });

  while (queue.length > 0) {
    const [r, c] = queue.shift()!;

    if (r === 8 && c === 7) {
      steps.push({
        data: [], activeIndices: [], markedIndices: [],
        actionType: 'visit',
        description: `BFS 到达终点 (8, 7)！准备回溯最短路径`,
        highlightLines: [9],
        gridData: visited.map((row, ri) => row.map((v, ci) => (v ? 5 : maze[ri][ci]))),
        gridCells: [{ row: r, col: c, state: 'visiting' }],
      });
      break;
    }

    const visitedCells: GridCell[] = [{ row: r, col: c, state: 'visiting' }];
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && maze[nr][nc] >= 1 && !visited[nr][nc]) {
        visited[nr][nc] = true;
        prev.set(`${nr},${nc}`, [r, c]);
        queue.push([nr, nc]);
        visitedCells.push({ row: nr, col: nc, state: 'visited' });
      }
    }

    steps.push({
      data: [], activeIndices: [], markedIndices: [],
      actionType: 'visit',
      description: `访问 (${r}, ${c})，将 ${visitedCells.length - 1} 个邻居加入队列（队列长度=${queue.length}）`,
      highlightLines: [10, 11, 12, 13],
      gridData: visited.map((row, ri) => row.map((v, ci) => (v ? 5 : maze[ri][ci]))),
      gridCells: [...visitedCells, { row: 0, col: 0, state: 'start' }, { row: 8, col: 7, state: 'end' }],
    });
  }

  // Traceback path
  const pathCells: GridCell[] = [];
  let cur: [number, number] | null = [8, 7];
  while (cur) {
    pathCells.push({ row: cur[0], col: cur[1], state: 'path' });
    cur = prev.get(`${cur[0]},${cur[1]}`) ?? null;
  }

  steps.push({
    data: [], activeIndices: [], markedIndices: [],
    actionType: 'complete',
    description: `最短路径（长度=${pathCells.length}）已找到！绿色路径即为最短路径`,
    highlightLines: [],
    gridData: visited.map((row, ri) => row.map((v, ci) => (v ? 5 : maze[ri][ci]))),
    gridCells: [...pathCells, { row: 0, col: 0, state: 'start' }, { row: 8, col: 7, state: 'end' }],
  });
  return steps;
}

registerAlgorithm({ meta: mazeSolveBFSMeta, generateSteps: generateMazeSolveBFSSteps });

// ============================================================
// Algorithm: Flood Fill 泛洪填充
// ============================================================

const floodFillMeta: AlgorithmMeta = {
  id: 'flood-fill',
  name: 'Flood Fill 泛洪填充',
  category: 'advanced',
  difficulty: 'easy',
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(n)',
  description: '从种子点出发，将连通区域的所有像素替换为新颜色。图像编辑中油漆桶工具的核心算法。',
  templateCode: `function floodFill(image: number[][], sr: number, sc: number, newColor: number): number[][] {
  const rows = image.length, cols = image[0].length;
  const oldColor = image[sr][sc];
  if (oldColor === newColor) return image;

  function fill(r: number, c: number) {
    if (r<0 || r>=rows || c<0 || c>=cols || image[r][c] !== oldColor) return;
    image[r][c] = newColor; // 填充
    fill(r-1, c); fill(r+1, c); // 上下
    fill(r, c-1); fill(r, c+1); // 左右
  }
  fill(sr, sc);
  return image;
}`,
  visualizerType: 'grid',
  defaultData: [10, 10],
};

function generateFloodFillSteps(data: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const rows = 10, cols = 10;

  // Build a grid with a "blob" of 1s to fill
  const grid: number[][] = Array.from({ length: rows }, () => new Array(cols).fill(0));
  // Create an irregular blob
  const blob = [
    [3,3],[3,4],[3,5],[3,6],
    [4,3],[4,4],[4,5],[4,6],[4,7],
    [5,3],[5,4],[5,5],[5,6],[5,7],[5,8],
    [6,3],[6,4],[6,5],[6,6],[6,7],
    [7,3],[7,4],[7,5],[7,6],
    [8,4],[8,5],
  ];
  for (const [r, c] of blob) {
    if (r < rows && c < cols) grid[r][c] = 1;
  }

  const newColor = 2;
  const sr = 5, sc = 5;
  const oldColor = grid[sr][sc];
  const queue: [number, number][] = [[sr, sc]];
  const dirs: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  steps.push({
    data: [], activeIndices: [], markedIndices: [],
    actionType: 'highlight',
    description: `初始网格，种子点 (${sr}, ${sc})，旧颜色=1（蓝色），新颜色=2（绿色）`,
    highlightLines: [1, 2, 3],
    gridData: grid.map((r) => [...r]),
    gridCells: [{ row: sr, col: sc, state: 'start' }],
  });

  grid[sr][sc] = newColor;
  let filledCount = 1;

  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    const fillCells: GridCell[] = [{ row: r, col: c, state: 'visiting' }];

    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === oldColor) {
        grid[nr][nc] = newColor;
        queue.push([nr, nc]);
        filledCount++;
        fillCells.push({ row: nr, col: nc, state: 'path' });
      }
    }

    if (fillCells.length > 1 || filledCount <= 2) {
      steps.push({
        data: [], activeIndices: [], markedIndices: [],
        actionType: 'move',
        description: `BFS 扩散填充 (${r}, ${c})，已填充 ${filledCount} 个单元格`,
        highlightLines: [7, 8, 9],
        gridData: grid.map((row) => [...row]),
        gridCells: fillCells,
      });
    }
  }

  steps.push({
    data: [], activeIndices: [], markedIndices: [],
    actionType: 'complete',
    description: `泛洪填充完成！共填充 ${filledCount} 个像素`,
    highlightLines: [],
    gridData: grid.map((row) => [...row]),
  });
  return steps;
}

registerAlgorithm({ meta: floodFillMeta, generateSteps: generateFloodFillSteps });

// ============================================================
// Algorithm: N 皇后回溯
// ============================================================

const nQueensMeta: AlgorithmMeta = {
  id: 'n-queens',
  name: 'N 皇后回溯',
  category: 'advanced',
  difficulty: 'hard',
  timeComplexity: 'O(n!)',
  spaceComplexity: 'O(n)',
  description: '在 N×N 棋盘上放置 N 个皇后，使它们互不攻击。使用回溯法搜索所有解。',
  templateCode: `function solveNQueens(n: number): number[][] {
  const board = Array.from({length: n}, () => new Array(n).fill(0));
  const solutions: number[][] = [];

  function backtrack(row: number) {
    if (row === n) {
      solutions.push(board.map(r => [...r])); // 找到一个解
      return;
    }
    for (let col = 0; col < n; col++) {
      if (isSafe(board, row, col, n)) {
        board[row][col] = 1; // 放置皇后
        backtrack(row + 1);
        board[row][col] = 0; // 撤回（回溯）
      }
    }
  }
  backtrack(0);
  return solutions;
}`,
  visualizerType: 'grid',
  defaultData: [4],
};

function generateNQueensSteps(data: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const n = data[0] || 4;
  const board = Array.from({ length: n }, () => new Array(n).fill(0));

  steps.push({
    data: [], activeIndices: [], markedIndices: [],
    actionType: 'highlight',
    description: `${n}×${n} 棋盘，准备放置 ${n} 个皇后（互不攻击）`,
    highlightLines: [1, 2],
    gridData: board.map((r) => [...r]),
  });

  function isSafe(row: number, col: number): boolean {
    for (let i = 0; i < row; i++) {
      if (board[i][col] === 1) return false;
      const d = row - i;
      if (col - d >= 0 && board[i][col - d] === 1) return false;
      if (col + d < n && board[i][col + d] === 1) return false;
    }
    return true;
  }

  function backtrack(row: number): boolean {
    if (row === n) {
      steps.push({
        data: [], activeIndices: [], markedIndices: [],
        actionType: 'complete',
        description: '找到一个可行解！所有皇后已放置',
        highlightLines: [8],
        gridData: board.map((r) => [...r]),
        gridCells: board.flatMap((r, ri) =>
          r.map((v, ci) => v === 1 ? { row: ri, col: ci, state: 'queen' as const } : null)
        ).filter(Boolean) as GridCell[],
      });
      return true; // Stop after first solution for visualization
    }

    for (let col = 0; col < n; col++) {
      steps.push({
        data: [], activeIndices: [], markedIndices: [],
        actionType: 'compare',
        description: `尝试在 (${row}, ${col}) 放置皇后`,
        highlightLines: [10, 11],
        gridData: board.map((r) => [...r]),
        gridCells: [{ row, col, state: 'visiting' }],
      });

      if (isSafe(row, col)) {
        board[row][col] = 1;
        steps.push({
          data: [], activeIndices: [], markedIndices: [],
          actionType: 'insert',
          description: `(${row}, ${col}) 安全，放置皇后，进入下一行`,
          highlightLines: [12, 13],
          gridData: board.map((r) => [...r]),
          gridCells: [{ row, col, state: 'queen' }],
        });

        if (backtrack(row + 1)) return true;

        board[row][col] = 0;
        steps.push({
          data: [], activeIndices: [], markedIndices: [],
          actionType: 'backtrack',
          description: `回溯：撤回 (${row}, ${col}) 的皇后，尝试下一列`,
          highlightLines: [14],
          gridData: board.map((r) => [...r]),
          gridCells: [{ row, col, state: 'empty' }],
        });
      } else {
        steps.push({
          data: [], activeIndices: [], markedIndices: [],
          actionType: 'highlight',
          description: `(${row}, ${col}) 不安全（冲突），跳过`,
          highlightLines: [11],
          gridData: board.map((r) => [...r]),
          gridCells: [{ row, col, state: 'wall' }],
        });
      }
    }
    return false;
  }

  backtrack(0);

  // Count total solutions
  const board2 = Array.from({ length: n }, () => new Array(n).fill(0));
  function countSolutions(row: number): number {
    if (row === n) return 1;
    let cnt = 0;
    for (let col = 0; col < n; col++) {
      // Check if safe
      let safe = true;
      for (let i = 0; i < row; i++) {
        if (board2[i][col] === 1) { safe = false; break; }
        const d = row - i;
        if (col - d >= 0 && board2[i][col - d] === 1) { safe = false; break; }
        if (col + d < n && board2[i][col + d] === 1) { safe = false; break; }
      }
      if (safe) { board2[row][col] = 1; cnt += countSolutions(row + 1); board2[row][col] = 0; }
    }
    return cnt;
  }
  const totalSolutions = countSolutions(0);

  steps.push({
    data: [n, totalSolutions], activeIndices: [], markedIndices: [],
    actionType: 'complete',
    description: `N=${n} 皇后求解完成！共找到 ${totalSolutions} 个合法解`,
    highlightLines: [],
    gridData: board.map((r) => [...r]),
  });
  return steps;
}

registerAlgorithm({ meta: nQueensMeta, generateSteps: generateNQueensSteps });

// ============================================================
// Algorithm: 二叉搜索树插入
// ============================================================

const bstInsertMeta: AlgorithmMeta = {
  id: 'bst-insert',
  name: 'BST 插入',
  category: 'tree-binary',
  difficulty: 'medium',
  timeComplexity: 'O(log n)',
  spaceComplexity: 'O(1)',
  description: '从根节点开始，与当前节点比较大小，决定向左子树或右子树递归插入。',
  templateCode: `class BSTNode {
  val: number;
  left: BSTNode | null;
  right: BSTNode | null;
  constructor(val: number) {
    this.val = val; this.left = null; this.right = null;
  }
}

function bstInsert(root: BSTNode | null, val: number): BSTNode {
  if (root === null) return new BSTNode(val);
  if (val < root.val) {
    root.left = bstInsert(root.left, val);
  } else if (val > root.val) {
    root.right = bstInsert(root.right, val);
  }
  return root;
}`,
  visualizerType: 'tree',
  defaultData: [50, 30, 70, 20, 40, 60, 80],
};

function generateBSTInsertSteps(data: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const treeData: number[] = []; // flat array for tree visualizer, level-order
  const values = data.length > 0 ? data : [50, 30, 70, 20, 40, 60, 80, 25];

  steps.push({
    data: [], activeIndices: [], markedIndices: [],
    actionType: 'highlight',
    description: `准备依次插入：${values.join(', ')}`,
    highlightLines: [9],
  });

  // Build BST step by step (level-order, 0 = empty slot)
  const bst: number[] = [];
  for (const val of values) {
    const path: number[] = [];
    let idx = 0;
    // Walk tree: stop at first empty (0) slot — that's where this value belongs
    while (idx < bst.length && bst[idx] !== 0) {
      path.push(idx);
      if (val < bst[idx]) {
        idx = 2 * idx + 1;
      } else {
        idx = 2 * idx + 2;
      }
    }
    // Pad to reach insertion position
    while (bst.length <= idx) bst.push(0);
    bst[idx] = val;

    steps.push({
      data: [...bst], activeIndices: [idx],
      markedIndices: path,
      actionType: 'insert',
      description: `插入 ${val}，比较路径：[${path.map((i) => bst[i]).join(' → ')}]，新节点在索引 ${idx}`,
      highlightLines: [10, 11, 12, 13],
    });
  }

  steps.push({
    data: [...bst], activeIndices: [], markedIndices: Array.from({ length: bst.length }, (_, i) => i),
    actionType: 'complete',
    description: `BST 构建完成！共 ${values.length} 个节点`,
    highlightLines: [],
  });
  return steps;
}

registerAlgorithm({ meta: bstInsertMeta, generateSteps: generateBSTInsertSteps });

// ============================================================
// Algorithm: 堆排序 (Heap Sort)
// ============================================================

const heapSortMeta: AlgorithmMeta = {
  id: 'heap-sort',
  name: '堆排序',
  category: 'sorting',
  difficulty: 'medium',
  timeComplexity: 'O(n log n)',
  spaceComplexity: 'O(1)',
  description: '利用最大堆数据结构：先建堆，再反复将堆顶（最大值）与末尾交换并重建堆。',
  templateCode: `function heapSort(arr: number[]): void {
  const n = arr.length;
  // 建堆：自底向上调整
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }
  // 排序：逐个取出堆顶
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
}

function heapify(arr: number[], size: number, root: number): void {
  let largest = root;
  const left = 2 * root + 1;
  const right = 2 * root + 2;
  if (left < size && arr[left] > arr[largest]) largest = left;
  if (right < size && arr[right] > arr[largest]) largest = right;
  if (largest !== root) {
    [arr[root], arr[largest]] = [arr[largest], arr[root]];
    heapify(arr, size, largest);
  }
}`,
  visualizerType: 'array',
  defaultData: [42, 23, 67, 15, 89, 34, 56, 11],
};

function generateHeapSortSteps(data: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const arr = [...data];
  const n = arr.length;

  steps.push({
    data: [...arr], activeIndices: [], markedIndices: [],
    actionType: 'highlight',
    description: `初始数组：[${arr.join(', ')}]，准备堆排序`,
    highlightLines: [1, 2],
  });

  function heapify(size: number, root: number) {
    let largest = root;
    const left = 2 * root + 1;
    const right = 2 * root + 2;

    if (left < size) {
      steps.push({
        data: [...arr], activeIndices: [largest, left], markedIndices: [],
        actionType: 'compare',
        description: `比较 arr[${largest}]=${arr[largest]} 与左子 arr[${left}]=${arr[left]}`,
        highlightLines: [16, 17],
      });
      if (arr[left] > arr[largest]) largest = left;
    }
    if (right < size) {
      steps.push({
        data: [...arr], activeIndices: [largest, right], markedIndices: [],
        actionType: 'compare',
        description: `比较 arr[${largest}]=${arr[largest]} 与右子 arr[${right}]=${arr[right]}`,
        highlightLines: [17],
      });
      if (arr[right] > arr[largest]) largest = right;
    }

    if (largest !== root) {
      [arr[root], arr[largest]] = [arr[largest], arr[root]];
      steps.push({
        data: [...arr], activeIndices: [root, largest], markedIndices: [],
        actionType: 'swap',
        description: `交换 arr[${root}] 和 arr[${largest}]，继续下沉`,
        highlightLines: [18, 19],
      });
      heapify(size, largest);
    }
  }

  // Build heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    steps.push({
      data: [...arr], activeIndices: [i], markedIndices: [],
      actionType: 'highlight',
      description: `建堆：调整以 arr[${i}]=${arr[i]} 为根的子树`,
      highlightLines: [3, 4],
    });
    heapify(n, i);
  }

  steps.push({
    data: [...arr], activeIndices: [], markedIndices: [],
    actionType: 'complete',
    description: `建堆完成，最大堆：[${arr.join(', ')}]`,
    highlightLines: [],
  });

  // Sort
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    steps.push({
      data: [...arr], activeIndices: [0, i], markedIndices: Array.from({ length: n - i }, (_, k) => n - 1 - k),
      actionType: 'swap',
      description: `将堆顶 arr[0]=${arr[i]} 与 arr[${i}] 交换，arr[${i}] 归位`,
      highlightLines: [6, 7],
    });
    heapify(i, 0);
  }

  steps.push({
    data: [...arr], activeIndices: [], markedIndices: Array.from({ length: n }, (_, i) => i),
    actionType: 'complete',
    description: `堆排序完成！[${arr.join(', ')}]`,
    highlightLines: [],
  });
  return steps;
}

registerAlgorithm({ meta: heapSortMeta, generateSteps: generateHeapSortSteps });

// ============================================================
// Algorithm: 二叉树前序遍历
// ============================================================

const preorderTraversalMeta: AlgorithmMeta = {
  id: 'preorder-traversal',
  name: '前序遍历（递归）',
  category: 'tree-binary',
  difficulty: 'easy',
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(h)',
  description: '根 → 左子树 → 右子树。先访问当前节点，再递归遍历左右子树。',
  templateCode: `function preorder(root: TreeNode | null): void {
  if (root === null) return;
  console.log(root.val);      // 访问根
  preorder(root.left);        // 递归左子树
  preorder(root.right);       // 递归右子树
}`,
  visualizerType: 'tree',
  defaultData: [1, 2, 3, 4, 5, 6, 7],
};

function generatePreorderSteps(data: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const tree = data.length > 0 ? data : [1, 2, 3, 4, 5, 6, 7];
  const visited: number[] = [];

  steps.push({
    data: [...tree], activeIndices: [], markedIndices: [],
    actionType: 'highlight',
    description: `二叉树（层序存储）：[${tree.join(', ')}]，准备前序遍历`,
    highlightLines: [1],
  });

  function preorder(idx: number) {
    if (idx >= tree.length || tree[idx] === 0) return;

    visited.push(idx);
    steps.push({
      data: [...tree], activeIndices: [idx],
      markedIndices: [...visited],
      actionType: 'visit',
      description: `访问节点 arr[${idx}]=${tree[idx]}（根），已访问：[${visited.map((i) => tree[i]).join(', ')}]`,
      highlightLines: [2],
    });

    preorder(2 * idx + 1); // left
    preorder(2 * idx + 2); // right
  }

  preorder(0);

  steps.push({
    data: [...tree], activeIndices: [], markedIndices: visited,
    actionType: 'complete',
    description: `前序遍历完成！访问顺序：[${visited.map((i) => tree[i]).join(', ')}]`,
    highlightLines: [],
  });
  return steps;
}

registerAlgorithm({ meta: preorderTraversalMeta, generateSteps: generatePreorderSteps });

// ============================================================
// Algorithm: 层序遍历 (BFS Tree)
// ============================================================

const levelorderTraversalMeta: AlgorithmMeta = {
  id: 'levelorder-traversal',
  name: '层序遍历（BFS）',
  category: 'tree-binary',
  difficulty: 'medium',
  timeComplexity: 'O(n)',
  spaceComplexity: 'O(n)',
  description: '从上到下、从左到右逐层访问节点。使用队列辅助，是树的 BFS。',
  templateCode: `function levelOrder(root: TreeNode | null): number[] {
  if (root === null) return [];
  const result: number[] = [];
  const queue: TreeNode[] = [root];
  while (queue.length > 0) {
    const node = queue.shift()!;
    result.push(node.val);
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  return result;
}`,
  visualizerType: 'tree',
  defaultData: [1, 2, 3, 4, 5, 6, 7],
};

function generateLevelOrderSteps(data: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const tree = data.length > 0 ? data : [1, 2, 3, 4, 5, 6, 7];
  const queue: number[] = [0];
  const result: number[] = [];

  steps.push({
    data: [...tree], activeIndices: [], markedIndices: [],
    actionType: 'highlight',
    description: `二叉树：[${tree.join(', ')}]，准备层序遍历`,
    highlightLines: [1, 2, 3],
  });

  while (queue.length > 0) {
    const idx = queue.shift()!;
    result.push(idx);

    // Add children to queue
    const children: number[] = [];
    const leftIdx = 2 * idx + 1;
    const rightIdx = 2 * idx + 2;
    if (leftIdx < tree.length && tree[leftIdx] !== 0) {
      queue.push(leftIdx);
      children.push(leftIdx);
    }
    if (rightIdx < tree.length && tree[rightIdx] !== 0) {
      queue.push(rightIdx);
      children.push(rightIdx);
    }

    steps.push({
      data: [...tree], activeIndices: [idx, ...children],
      markedIndices: [...result],
      actionType: 'visit',
      description: `访问 arr[${idx}]=${tree[idx]}，子节点 [${children.map((i) => tree[i]).join(', ')}] 入队（队列=[${queue.map((i) => tree[i]).join(', ')}]）`,
      highlightLines: [7, 8, 9, 10],
    });
  }

  steps.push({
    data: [...tree], activeIndices: [], markedIndices: result,
    actionType: 'complete',
    description: `层序遍历完成！顺序：[${result.map((i) => tree[i]).join(', ')}]`,
    highlightLines: [],
  });
  return steps;
}

registerAlgorithm({ meta: levelorderTraversalMeta, generateSteps: generateLevelOrderSteps });

// ============================================================
// 补齐：中序遍历
// ============================================================
const inorderTraversalMeta: AlgorithmMeta = {
  id: 'inorder-traversal', name: '中序遍历（递归）', category: 'tree-binary',
  difficulty: 'easy', timeComplexity: 'O(n)', spaceComplexity: 'O(h)',
  description: '左子树 → 根 → 右子树。先递归遍历左子树，再访问根节点，最后遍历右子树。',
  templateCode: `function inorder(root: TreeNode | null): void {
  if (root === null) return;
  inorder(root.left);       // 递归左子树
  console.log(root.val);    // 访问根
  inorder(root.right);      // 递归右子树
}`,
  visualizerType: 'tree', defaultData: [4, 2, 6, 1, 3, 5, 7],
};
function generateInorderSteps(data: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const tree = data.length > 0 ? data : [4, 2, 6, 1, 3, 5, 7];
  const visited: number[] = [];
  steps.push({ data: [...tree], activeIndices: [], markedIndices: [], actionType: 'highlight', description: `二叉树：[${tree.join(', ')}]，准备中序遍历（左→根→右）`, highlightLines: [1] });
  function inorder(idx: number) {
    if (idx >= tree.length || tree[idx] === 0) return;
    inorder(2 * idx + 1);
    visited.push(idx);
    steps.push({ data: [...tree], activeIndices: [idx], markedIndices: [...visited], actionType: 'visit', description: `访问 arr[${idx}]=${tree[idx]}（根），已访问：[${visited.map((i) => tree[i]).join(', ')}]`, highlightLines: [3] });
    inorder(2 * idx + 2);
  }
  inorder(0);
  steps.push({ data: [...tree], activeIndices: [], markedIndices: visited, actionType: 'complete', description: `中序遍历完成！[${visited.map((i) => tree[i]).join(', ')}]`, highlightLines: [] });
  return steps;
}
registerAlgorithm({ meta: inorderTraversalMeta, generateSteps: generateInorderSteps });

// ============================================================
// 补齐：后序遍历
// ============================================================
const postorderTraversalMeta: AlgorithmMeta = {
  id: 'postorder-traversal', name: '后序遍历（递归）', category: 'tree-binary',
  difficulty: 'easy', timeComplexity: 'O(n)', spaceComplexity: 'O(h)',
  description: '左子树 → 右子树 → 根。先递归遍历左右子树，最后访问根节点。',
  templateCode: `function postorder(root: TreeNode | null): void {
  if (root === null) return;
  postorder(root.left);     // 递归左子树
  postorder(root.right);    // 递归右子树
  console.log(root.val);    // 访问根
}`,
  visualizerType: 'tree', defaultData: [4, 2, 6, 1, 3, 5, 7],
};
function generatePostorderSteps(data: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const tree = data.length > 0 ? data : [4, 2, 6, 1, 3, 5, 7];
  const visited: number[] = [];
  steps.push({ data: [...tree], activeIndices: [], markedIndices: [], actionType: 'highlight', description: `二叉树：[${tree.join(', ')}]，准备后序遍历（左→右→根）`, highlightLines: [1] });
  function postorder(idx: number) {
    if (idx >= tree.length || tree[idx] === 0) return;
    postorder(2 * idx + 1);
    postorder(2 * idx + 2);
    visited.push(idx);
    steps.push({ data: [...tree], activeIndices: [idx], markedIndices: [...visited], actionType: 'visit', description: `访问 arr[${idx}]=${tree[idx]}（根），已访问：[${visited.map((i) => tree[i]).join(', ')}]`, highlightLines: [4] });
  }
  postorder(0);
  steps.push({ data: [...tree], activeIndices: [], markedIndices: visited, actionType: 'complete', description: `后序遍历完成！[${visited.map((i) => tree[i]).join(', ')}]`, highlightLines: [] });
  return steps;
}
registerAlgorithm({ meta: postorderTraversalMeta, generateSteps: generatePostorderSteps });

// ============================================================
// 补齐：BST 查找
// ============================================================
const bstSearchMeta: AlgorithmMeta = {
  id: 'bst-search', name: 'BST 查找', category: 'tree-binary',
  difficulty: 'easy', timeComplexity: 'O(log n)', spaceComplexity: 'O(1)',
  description: '在BST中查找目标值。末尾位=查找目标（不参与树结构）。如"50,30,70,20,40,60,80,40"表示在7节点BST中找40。',
  templateCode: `function bstSearch(root: BSTNode | null, target: number): BSTNode | null {
  if (root === null || root.val === target) return root;
  if (target < root.val) return bstSearch(root.left, target);
  return bstSearch(root.right, target);
}`,
  visualizerType: 'tree', defaultData: [50, 30, 70, 20, 40, 60, 80, 40],
};
function generateBSTSearchSteps(data: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const target = data[data.length - 1] ?? 40;
  const tree = data.length > 1 ? data.slice(0, -1) : [50, 30, 70, 20, 40, 60, 80];
  steps.push({ data: [...tree], activeIndices: [], markedIndices: [], actionType: 'highlight', description: `BST查找目标=${target}，树：[${tree.filter(v => v !== 0).join(', ')}]`, highlightLines: [1] });
  let idx = 0;
  while (idx < tree.length && tree[idx] !== 0) {
    steps.push({ data: [...tree], activeIndices: [idx], markedIndices: [], actionType: 'compare', description: `比较 arr[${idx}]=${tree[idx]} 与 target=${target}`, highlightLines: [2] });
    if (tree[idx] === target) {
      steps.push({ data: [...tree], activeIndices: [idx], markedIndices: [idx], actionType: 'complete', description: `找到！arr[${idx}]=${target}`, highlightLines: [2] });
      return steps;
    }
    idx = target < tree[idx] ? 2 * idx + 1 : 2 * idx + 2;
  }
  steps.push({ data: [...tree], activeIndices: [], markedIndices: [], actionType: 'complete', description: `未找到 ${target}`, highlightLines: [3] });
  return steps;
}
registerAlgorithm({ meta: bstSearchMeta, generateSteps: generateBSTSearchSteps });

// ============================================================
// 补齐：顺序表删除
// ============================================================
const seqListDeleteMeta: AlgorithmMeta = {
  id: 'seqlist-delete', name: '顺序表删除', category: 'linear-list',
  difficulty: 'easy', timeComplexity: 'O(n)', spaceComplexity: 'O(1)',
  description: '删除指定位置的元素，将后续元素依次前移覆盖。末尾2位=[数组..., 删除位置]。',
  templateCode: `function seqListDelete(list: number[], index: number, length: number): boolean {
  if (index < 0 || index >= length) return false;
  for (let i = index; i < length - 1; i++) list[i] = list[i + 1];
  list[length - 1] = 0;
  return true;
}`,
  visualizerType: 'array', defaultData: [10, 20, 30, 40, 50, 2],
};
function generateSeqListDeleteSteps(data: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const delIndex = data[data.length - 1] ?? 2;
  const arr = data.slice(0, -1);
  steps.push({ data: [...arr], activeIndices: [delIndex], markedIndices: [], actionType: 'highlight', description: `准备删除 arr[${delIndex}]=${arr[delIndex]}`, highlightLines: [1, 2] });
  for (let i = delIndex; i < arr.length - 1; i++) {
    arr[i] = arr[i + 1];
    steps.push({ data: [...arr], activeIndices: [i, i + 1], markedIndices: [], actionType: 'move', description: `arr[${i + 1}]=${arr[i]} 前移到 arr[${i}]`, highlightLines: [3] });
  }
  arr[arr.length - 1] = 0;
  steps.push({ data: [...arr], activeIndices: [arr.length - 1], markedIndices: [], actionType: 'delete', description: `删除完成，表尾置0，新长度=${arr.length - 1}`, highlightLines: [4, 5] });
  return steps;
}
registerAlgorithm({ meta: seqListDeleteMeta, generateSteps: generateSeqListDeleteSteps });

// ============================================================
// 补齐：单链表头插法建立
// ============================================================
const linkedListHeadInsertMeta: AlgorithmMeta = {
  id: 'linkedlist-head-insert', name: '单链表建立（头插法）', category: 'linear-list',
  difficulty: 'medium', timeComplexity: 'O(n)', spaceComplexity: 'O(n)',
  description: '每次新节点插入链表头部，最终链表顺序与插入顺序相反。',
  templateCode: `function headInsert(values: number[]): ListNode {
  const head = new ListNode(0); // 虚拟头节点
  for (const val of values) {
    const node = new ListNode(val);
    node.next = head.next;
    head.next = node;
  }
  return head.next;
}`,
  visualizerType: 'linked-list', defaultData: [10, 20, 30, 40],
};
function generateLinkedListHeadInsertSteps(data: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const result: number[] = [];
  steps.push({ data: [], activeIndices: [], markedIndices: [], actionType: 'highlight', description: `准备头插法建立链表，插入顺序：[${data.join(', ')}]`, highlightLines: [2] });
  for (let i = 0; i < data.length; i++) {
    result.unshift(data[i]);
    steps.push({ data: [...result], activeIndices: [0], markedIndices: Array.from({ length: i }, (_, k) => k + 1), actionType: 'insert', description: `将 ${data[i]} 插入链表头部，当前链表：[${result.join(' → ')}]`, highlightLines: [3, 4, 5] });
  }
  steps.push({ data: [...result], activeIndices: [], markedIndices: Array.from({ length: result.length }, (_, i) => i), actionType: 'complete', description: `头插法完成！逆序：[${result.join(' → ')}]`, highlightLines: [] });
  return steps;
}
registerAlgorithm({ meta: linkedListHeadInsertMeta, generateSteps: generateLinkedListHeadInsertSteps });

// ============================================================
// 补齐：单链表尾插法建立
// ============================================================
const linkedListTailInsertMeta: AlgorithmMeta = {
  id: 'linkedlist-tail-insert', name: '单链表建立（尾插法）', category: 'linear-list',
  difficulty: 'medium', timeComplexity: 'O(n)', spaceComplexity: 'O(n)',
  description: '每次新节点追加到链表尾部，最终链表顺序与插入顺序一致。',
  templateCode: `function tailInsert(values: number[]): ListNode {
  const head = new ListNode(0);
  let tail = head;
  for (const val of values) {
    tail.next = new ListNode(val);
    tail = tail.next;
  }
  return head.next;
}`,
  visualizerType: 'linked-list', defaultData: [10, 20, 30, 40],
};
function generateLinkedListTailInsertSteps(data: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const result: number[] = [];
  steps.push({ data: [], activeIndices: [], markedIndices: [], actionType: 'highlight', description: `准备尾插法建立链表，插入顺序：[${data.join(', ')}]`, highlightLines: [2] });
  for (let i = 0; i < data.length; i++) {
    result.push(data[i]);
    steps.push({ data: [...result], activeIndices: [i], markedIndices: Array.from({ length: i }, (_, k) => k), actionType: 'insert', description: `将 ${data[i]} 追加到链表尾部，当前链表：[${result.join(' → ')}]`, highlightLines: [4, 5] });
  }
  steps.push({ data: [...result], activeIndices: [], markedIndices: Array.from({ length: result.length }, (_, i) => i), actionType: 'complete', description: `尾插法完成！正序：[${result.join(' → ')}]`, highlightLines: [] });
  return steps;
}
registerAlgorithm({ meta: linkedListTailInsertMeta, generateSteps: generateLinkedListTailInsertSteps });

// ============================================================
// 补齐：单链表删除节点
// ============================================================
const linkedListDeleteMeta: AlgorithmMeta = {
  id: 'linkedlist-delete', name: '单链表删除节点', category: 'linear-list',
  difficulty: 'medium', timeComplexity: 'O(n)', spaceComplexity: 'O(1)',
  description: '找到待删除节点的前驱，将前驱的 next 指针绕过待删节点。末尾位=删除位置。',
  templateCode: `function deleteNode(head: ListNode, index: number): ListNode {
  if (index === 0) return head.next;
  let prev = head;
  for (let i = 0; i < index - 1; i++) prev = prev.next;
  prev.next = prev.next.next;
  return head;
}`,
  visualizerType: 'linked-list', defaultData: [10, 20, 30, 40, 50, 2],
};
function generateLinkedListDeleteSteps(data: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const delIndex = data[data.length - 1] ?? 2;
  const arr = data.slice(0, -1);
  steps.push({ data: [...arr], activeIndices: [delIndex], markedIndices: [], actionType: 'highlight', description: `准备删除索引 ${delIndex} 处的节点 ${arr[delIndex]}，链表：[${arr.join(' → ')}]`, highlightLines: [1, 2] });
  const result = [...arr.slice(0, delIndex), ...arr.slice(delIndex + 1)];
  steps.push({ data: result, activeIndices: [Math.min(delIndex, result.length - 1)], markedIndices: [delIndex - 1 >= 0 ? delIndex - 1 : 0], actionType: 'delete', description: `前驱指向后继，绕过节点 ${arr[delIndex]}，链表：[${result.join(' → ')}]`, highlightLines: [3, 4] });
  steps.push({ data: result, activeIndices: [], markedIndices: Array.from({ length: result.length }, (_, i) => i), actionType: 'complete', description: '删除完成', highlightLines: [] });
  return steps;
}
registerAlgorithm({ meta: linkedListDeleteMeta, generateSteps: generateLinkedListDeleteSteps });

// ============================================================
// 补齐：循环队列
// ============================================================
const circularQueueMeta: AlgorithmMeta = {
  id: 'circular-queue', name: '循环队列入队/出队', category: 'stack-queue',
  difficulty: 'medium', timeComplexity: 'O(1)', spaceComplexity: 'O(n)',
  description: '使用循环数组实现队列，front 指向队头，rear 指向队尾下一空位，模运算实现循环。',
  templateCode: `class CircularQueue {
  data: number[]; front: number; rear: number; size: number;
  constructor(cap: number) { this.data = new Array(cap).fill(0); this.front = 0; this.rear = 0; this.size = 0; }
  enqueue(val: number): boolean {
    if (this.size >= this.data.length) return false;
    this.data[this.rear] = val;
    this.rear = (this.rear + 1) % this.data.length;
    this.size++; return true;
  }
  dequeue(): number | null {
    if (this.size === 0) return null;
    const val = this.data[this.front];
    this.front = (this.front + 1) % this.data.length;
    this.size--; return val;
  }
}`,
  visualizerType: 'array', defaultData: [10, 20, 30, 40, 50],
};
function generateCircularQueueSteps(data: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const values = data.length > 0 ? data : [10, 20, 30, 40, 50];
  const cap = Math.max(values.length + 1, 5);
  const q = new Array(cap).fill(0);
  let front = 0, rear = 0, size = 0;
  const ops: Array<{ t: 'enq'; v: number } | { t: 'deq' }> = [];
  for (const v of values) ops.push({ t: 'enq', v });
  ops.push({ t: 'deq' });
  if (values.length > 2) ops.push({ t: 'deq' });
  if (values.length > 0) ops.push({ t: 'enq', v: values[0] + 50 });
  steps.push({ data: [...q], activeIndices: [], markedIndices: [], actionType: 'highlight', description: `循环队列（容量${cap}），front=${front}，rear=${rear}`, highlightLines: [2] });
  for (const op of ops) {
    if (op.t === 'enq' && op.v !== undefined) {
      if (size >= cap) continue;
      q[rear] = op.v;
      steps.push({ data: [...q], activeIndices: [rear], markedIndices: [front], actionType: 'insert', description: `入队 ${op.v} → data[${rear}]，rear=${(rear + 1) % cap}`, highlightLines: [4, 5, 6] });
      rear = (rear + 1) % cap; size++;
    } else if (op.t === 'deq') {
      if (size === 0) continue;
      const val = q[front];
      q[front] = 0;
      steps.push({ data: [...q], activeIndices: [front], markedIndices: [rear], actionType: 'delete', description: `出队 data[${front}]=${val}，front=${(front + 1) % cap}`, highlightLines: [8, 9, 10] });
      front = (front + 1) % cap; size--;
    }
  }
  steps.push({ data: [...q], activeIndices: [], markedIndices: [front, rear], actionType: 'complete', description: `演示完成，队列剩余${size}个元素`, highlightLines: [] });
  return steps;
}
registerAlgorithm({ meta: circularQueueMeta, generateSteps: generateCircularQueueSteps });

// ============================================================
// 补齐：计数排序
// ============================================================
const countingSortMeta: AlgorithmMeta = {
  id: 'counting-sort', name: '计数排序', category: 'sorting',
  difficulty: 'medium', timeComplexity: 'O(n+k)', spaceComplexity: 'O(k)',
  description: '统计各值出现次数，通过累积计数确定每个元素的最终位置。适用于取值范围小的整数。',
  templateCode: `function countingSort(arr: number[]): number[] {
  const max = Math.max(...arr);
  const count = new Array(max + 1).fill(0);
  const output = new Array(arr.length).fill(0);
  for (const v of arr) count[v]++;
  for (let i = 1; i <= max; i++) count[i] += count[i - 1];
  for (let i = arr.length - 1; i >= 0; i--) {
    output[--count[arr[i]]] = arr[i];
  }
  return output;
}`,
  visualizerType: 'array', defaultData: [4, 2, 2, 8, 3, 3, 1],
};
function generateCountingSortSteps(data: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const arr = [...data];
  const max = Math.max(...arr);
  const count = new Array(max + 1).fill(0);
  const output = new Array(arr.length).fill(0);
  steps.push({ data: [...arr], activeIndices: [], markedIndices: [], actionType: 'highlight', description: `初始数组：[${arr.join(', ')}]，最大值=${max}`, highlightLines: [1, 2] });
  for (const v of arr) { count[v]++; steps.push({ data: [...arr], activeIndices: [arr.indexOf(v)], markedIndices: [], actionType: 'compare', description: `计数：count[${v}]++ → ${count[v]}`, highlightLines: [4] }); }
  steps.push({ data: [...count], activeIndices: [], markedIndices: [], actionType: 'highlight', description: `计数数组：[${count.join(', ')}]`, highlightLines: [] });
  for (let i = 1; i <= max; i++) { count[i] += count[i - 1]; steps.push({ data: [...count], activeIndices: [i], markedIndices: Array.from({ length: i }, (_, k) => k), actionType: 'move', description: `累积：count[${i}]=${count[i]}`, highlightLines: [5] }); }
  for (let i = arr.length - 1; i >= 0; i--) {
    const v = arr[i]; const pos = --count[v]; output[pos] = v;
    steps.push({ data: [...output], activeIndices: [pos], markedIndices: Array.from({ length: arr.length - i - 1 }, (_, k) => arr.length - 1 - k), actionType: 'insert', description: `将 arr[${i}]=${v} 放入 output[${pos}]`, highlightLines: [6, 7] });
  }
  steps.push({ data: [...output], activeIndices: [], markedIndices: Array.from({ length: output.length }, (_, i) => i), actionType: 'complete', description: `计数排序完成！[${output.join(', ')}]`, highlightLines: [] });
  return steps;
}
registerAlgorithm({ meta: countingSortMeta, generateSteps: generateCountingSortSteps });

// ============================================================
// 补齐：希尔排序
// ============================================================
const shellSortMeta: AlgorithmMeta = {
  id: 'shell-sort', name: '希尔排序', category: 'sorting',
  difficulty: 'medium', timeComplexity: 'O(n log² n)', spaceComplexity: 'O(1)',
  description: '插入排序的改进版，通过递减增量 gap 分组进行插入排序，最终 gap=1 时完成排序。',
  templateCode: `function shellSort(arr: number[]): void {
  const n = arr.length;
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < n; i++) {
      const temp = arr[i];
      let j = i;
      while (j >= gap && arr[j - gap] > temp) { arr[j] = arr[j - gap]; j -= gap; }
      arr[j] = temp;
    }
  }
}`,
  visualizerType: 'array', defaultData: [42, 23, 67, 15, 89, 34, 56, 11],
};
function generateShellSortSteps(data: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const arr = [...data];
  const n = arr.length;
  steps.push({ data: [...arr], activeIndices: [], markedIndices: [], actionType: 'highlight', description: `初始数组：[${arr.join(', ')}]，希尔排序`, highlightLines: [1, 2] });
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    steps.push({ data: [...arr], activeIndices: [], markedIndices: [], actionType: 'divide', description: `当前增量 gap=${gap}`, highlightLines: [2] });
    for (let i = gap; i < n; i++) {
      const temp = arr[i]; let j = i;
      steps.push({ data: [...arr], activeIndices: [i], markedIndices: [], actionType: 'compare', description: `取出 arr[${i}]=${temp}`, highlightLines: [4] });
      while (j >= gap && arr[j - gap] > temp) {
        arr[j] = arr[j - gap];
        steps.push({ data: [...arr], activeIndices: [j, j - gap], markedIndices: [], actionType: 'move', description: `arr[${j - gap}]=${arr[j]} 后移到 arr[${j}]`, highlightLines: [6] });
        j -= gap;
      }
      arr[j] = temp;
      if (j !== i) steps.push({ data: [...arr], activeIndices: [j], markedIndices: [], actionType: 'insert', description: `将 ${temp} 插入 arr[${j}]`, highlightLines: [7] });
    }
  }
  steps.push({ data: [...arr], activeIndices: [], markedIndices: Array.from({ length: n }, (_, i) => i), actionType: 'complete', description: `希尔排序完成！[${arr.join(', ')}]`, highlightLines: [] });
  return steps;
}
registerAlgorithm({ meta: shellSortMeta, generateSteps: generateShellSortSteps });

// ============================================================
// 补齐：Prim 最小生成树
// ============================================================
const primMeta: AlgorithmMeta = {
  id: 'prim-mst', name: 'Prim 最小生成树', category: 'graph',
  difficulty: 'hard', timeComplexity: 'O(E log V)', spaceComplexity: 'O(V)',
  description: '从任一节点开始，每次选择连接已选集合和未选集合的最小权边，逐步扩展生成树。',
  templateCode: `function prim(graph: number[][]): number[][] {
  const n = graph.length;
  const selected = new Array(n).fill(false);
  const mst: number[][] = [];
  selected[0] = true;
  for (let e = 0; e < n - 1; e++) {
    let minW = Infinity, u = -1, v = -1;
    for (let i = 0; i < n; i++) {
      if (!selected[i]) continue;
      for (let j = 0; j < n; j++) {
        if (!selected[j] && graph[i][j] > 0 && graph[i][j] < minW) {
          minW = graph[i][j]; u = i; v = j;
        }
      }
    }
    selected[v] = true; mst.push([u, v, minW]);
  }
  return mst;
}`,
  visualizerType: 'graph', defaultData: [5, 0,2,1, 3,4,2, 1,2,2, 0,1,4, 1,3,5, 2,3,8, 2,4,10],
};
function generatePrimSteps(data: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const n = data[0] || 5;
  const graph: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  const allEdges: import('@/types/algo').GraphEdgeHighlight[] = [];
  for (let i = 1; i + 2 < data.length; i += 3) {
    const u = data[i], v = data[i + 1], w = data[i + 2];
    graph[u][v] = w; graph[v][u] = w;
    allEdges.push({ from: u, to: v, active: false, weight: w });
  }
  const selected = new Array(n).fill(false);
  const distData = new Array(n).fill(-1);
  function primData() { return [n, ...distData]; }
  selected[0] = true; distData[0] = 0;
  steps.push({ data: primData(), activeIndices: [0], markedIndices: [0], actionType: 'visit', description: `Prim：${n}节点${allEdges.length}条边，从A开始`, highlightLines: [4], graphEdges: [...allEdges] });
  for (let e = 0; e < n - 1; e++) {
    let minW = Infinity, u = -1, v = -1;
    for (let i = 0; i < n; i++) {
      if (!selected[i]) continue;
      for (let j = 0; j < n; j++) {
        if (!selected[j] && graph[i][j] > 0 && graph[i][j] < minW) { minW = graph[i][j]; u = i; v = j; }
      }
    }
    if (u < 0) break;
    selected[v] = true; distData[v] = distData[u] + minW;
    steps.push({ data: primData(), activeIndices: [u, v], markedIndices: selected.reduce<number[]>((a, s, i) => s ? [...a, i] : a, []), actionType: 'relax', description: `选最小边(${u},${v})权=${minW}，${v}加入生成树`, highlightLines: [8,9,10,11], graphEdges: allEdges.map(e => ({ ...e, active: (e.from===u&&e.to===v)||(e.from===v&&e.to===u) })) });
  }
  steps.push({ data: primData(), activeIndices: [], markedIndices: Array.from({length:n},(_,i)=>i), actionType: 'complete', description: 'Prim完成！最小生成树已构建', highlightLines: [], graphEdges: [...allEdges] });
  return steps;
}
registerAlgorithm({ meta: primMeta, generateSteps: generatePrimSteps });

// ============================================================
// 补齐：Floyd-Warshall 全源最短路径
// ============================================================
const floydMeta: AlgorithmMeta = {
  id: 'floyd-warshall', name: 'Floyd 全源最短路径', category: 'graph',
  difficulty: 'hard', timeComplexity: 'O(V³)', spaceComplexity: 'O(V²)',
  description: '三重循环动态规划：对于每对(i,j)，尝试以 k 作为中间节点是否能缩短距离。',
  templateCode: `function floydWarshall(graph: number[][]): number[][] {
  const n = graph.length;
  const dist = graph.map(r => [...r]);
  for (let k = 0; k < n; k++)
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++)
        if (dist[i][k] + dist[k][j] < dist[i][j])
          dist[i][j] = dist[i][k] + dist[k][j];
  return dist;
}`,
  visualizerType: 'array', defaultData: [0, 3, 8, 999, 999, 0, 999, 1, 999, 4, 0, 999, 999, 999, 2, 0],
};
function generateFloydSteps(data: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const INF = 999;
  const n = 4;
  const graph = [[0,3,INF,7],[8,0,2,INF],[5,INF,0,1],[2,INF,INF,0]];
  const dist = graph.map(r => [...r]);
  steps.push({ data: [0,3,INF,7,8,0,2,INF,5,INF,0,1,2,INF,INF,0], activeIndices: [], markedIndices: [], actionType: 'highlight', description: '初始距离矩阵（999=∞），准备 Floyd-Warshall', highlightLines: [1, 2] });
  for (let k = 0; k < n; k++) {
    steps.push({ data: dist.flat(), activeIndices: [k], markedIndices: [], actionType: 'highlight', description: `以节点 ${k} 为中间节点`, highlightLines: [3] });
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          const old = dist[i][j];
          dist[i][j] = dist[i][k] + dist[k][j];
          steps.push({ data: dist.flat(), activeIndices: [i * n + j], markedIndices: [], actionType: 'relax', description: `dist[${i}][${j}]：${old} → ${dist[i][j]}（经节点${k}）`, highlightLines: [5, 6] });
        }
      }
    }
  }
  steps.push({ data: dist.flat(), activeIndices: [], markedIndices: [], actionType: 'complete', description: 'Floyd 完成！全源最短路径已计算', highlightLines: [] });
  return steps;
}
registerAlgorithm({ meta: floydMeta, generateSteps: generateFloydSteps });

// ============================================================
// 补齐：插值查找
// ============================================================
const interpolationSearchMeta: AlgorithmMeta = {
  id: 'interpolation-search', name: '插值查找', category: 'searching',
  difficulty: 'medium', timeComplexity: 'O(log log n)', spaceComplexity: 'O(1)',
  description: '二分查找改进版，根据目标值在数据范围内的比例估算 mid 位置，数据越均匀越快。',
  templateCode: `function interpolationSearch(arr: number[], target: number): number {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi && target >= arr[lo] && target <= arr[hi]) {
    const pos = lo + Math.floor(((target - arr[lo]) * (hi - lo)) / (arr[hi] - arr[lo]));
    if (arr[pos] === target) return pos;
    if (arr[pos] < target) lo = pos + 1;
    else hi = pos - 1;
  }
  return -1;
}`,
  visualizerType: 'array', defaultData: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 70],
};
function generateInterpolationSearchSteps(data: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const target = data[data.length - 1] ?? 70;
  const arr = data.slice(0, -1).sort((a, b) => a - b);
  steps.push({ data: [...arr], activeIndices: [], markedIndices: [], actionType: 'highlight', description: `在有序数组中插值查找 ${target}，数组：[${arr.join(', ')}]`, highlightLines: [1, 2] });
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi && target >= arr[lo] && target <= arr[hi]) {
    const pos = lo + Math.floor(((target - arr[lo]) * (hi - lo)) / (arr[hi] - arr[lo]));
    steps.push({ data: [...arr], activeIndices: [pos], markedIndices: [], actionType: 'compare', description: `估算位置 pos=${pos}, arr[${pos}]=${arr[pos]}`, highlightLines: [3, 4] });
    if (arr[pos] === target) {
      steps.push({ data: [...arr], activeIndices: [pos], markedIndices: [pos], actionType: 'complete', description: `找到！arr[${pos}]=${target}`, highlightLines: [4] });
      return steps;
    }
    if (arr[pos] < target) { lo = pos + 1; steps.push({ data: [...arr], activeIndices: [pos], markedIndices: Array.from({ length: pos + 1 }, (_, i) => i), actionType: 'move', description: `arr[${pos}] < ${target}，lo=${lo}`, highlightLines: [5] }); }
    else { hi = pos - 1; steps.push({ data: [...arr], activeIndices: [pos], markedIndices: Array.from({ length: arr.length - pos }, (_, i) => i + pos), actionType: 'move', description: `arr[${pos}] > ${target}，hi=${hi}`, highlightLines: [6] }); }
  }
  steps.push({ data: [...arr], activeIndices: [], markedIndices: [], actionType: 'complete', description: `未找到 ${target}`, highlightLines: [7] });
  return steps;
}
registerAlgorithm({ meta: interpolationSearchMeta, generateSteps: generateInterpolationSearchSteps });

// ============================================================
// 补齐：DFS 迷宫求解
// ============================================================
const mazeSolveDFSMeta: AlgorithmMeta = {
  id: 'maze-solve-dfs', name: 'DFS 迷宫求解', category: 'advanced',
  difficulty: 'medium', timeComplexity: 'O(V+E)', spaceComplexity: 'O(V)',
  description: '使用 DFS 深度优先搜索在迷宫中寻找从起点到终点的路径（不保证最短）。',
  templateCode: `function solveMazeDFS(maze: number[][], r: number, c: number, visited: boolean[][]): boolean {
  if (r < 0 || r >= maze.length || c < 0 || c >= maze[0].length) return false;
  if (maze[r][c] === 3) return true; // 到达终点
  if (maze[r][c] !== 1 || visited[r][c]) return false;
  visited[r][c] = true;
  const dirs = [[-1,0],[1,0],[0,-1],[0,1]];
  for (const [dr, dc] of dirs) {
    if (solveMazeDFS(maze, r+dr, c+dc, visited)) return true;
  }
  return false; // 死路回溯
}`,
  visualizerType: 'grid', defaultData: [9, 9],
};
function generateMazeSolveDFSSteps(data: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const rows = 9, cols = 9;
  const maze = [[2,1,0,0,1,1,1,0,0],[0,1,0,0,1,0,1,0,0],[0,1,1,1,1,0,1,1,0],[0,0,0,0,0,0,0,1,0],[1,1,1,1,1,1,0,1,1],[0,0,0,0,0,1,0,0,0],[0,1,1,1,0,1,1,1,0],[0,1,0,0,0,0,0,1,0],[0,1,1,1,1,1,0,3,0]];
  const visited = Array.from({ length: rows }, () => new Array(cols).fill(false));
  const dirs: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  steps.push({ data: [], activeIndices: [], markedIndices: [], actionType: 'highlight', description: 'DFS 迷宫求解（深度优先，不保证最短路径）', highlightLines: [1], gridData: maze.map(r => [...r]), gridCells: [{ row: 0, col: 0, state: 'start' }, { row: 8, col: 7, state: 'end' }] });
  function dfs(r: number, c: number): boolean {
    if (r < 0 || r >= rows || c < 0 || c >= cols) return false;
    if (maze[r][c] === 3) {
      steps.push({ data: [], activeIndices: [], markedIndices: [], actionType: 'complete', description: `到达终点 (${r},${c})！`, highlightLines: [3], gridData: visited.map((row, ri) => row.map((v, ci) => v ? 5 : maze[ri][ci])), gridCells: [{ row: r, col: c, state: 'end' }] });
      return true;
    }
    if (maze[r][c] === 0 || visited[r][c]) return false;
    visited[r][c] = true;
    steps.push({ data: [], activeIndices: [], markedIndices: [], actionType: 'recurse-in', description: `探索 (${r},${c})`, highlightLines: [5], gridData: visited.map((row, ri) => row.map((v, ci) => v ? 5 : maze[ri][ci])), gridCells: [{ row: r, col: c, state: 'visiting' }] });
    for (const [dr, dc] of dirs) {
      if (dfs(r + dr, c + dc)) return true;
    }
    visited[r][c] = false;
    steps.push({ data: [], activeIndices: [], markedIndices: [], actionType: 'backtrack', description: `回溯：(${r},${c}) 四个方向均不通`, highlightLines: [8], gridData: visited.map((row, ri) => row.map((v, ci) => v ? 5 : maze[ri][ci])), gridCells: [{ row: r, col: c, state: 'wall' }] });
    return false;
  }
  dfs(0, 0);
  return steps;
}
registerAlgorithm({ meta: mazeSolveDFSMeta, generateSteps: generateMazeSolveDFSSteps });

// ============================================================
// 补齐：0/1 背包 DP
// ============================================================
const knapsack01Meta: AlgorithmMeta = {
  id: 'knapsack-01', name: '0/1 背包（DP）', category: 'advanced',
  difficulty: 'hard', timeComplexity: 'O(nW)', spaceComplexity: 'O(nW)',
  description: '经典DP：每件物品选或不选。输入格式：前一半=重量，后一半=价值，末尾=容量。如"2,3,4,5,3,4,5,6,8"表示4物品，容量8。',
  templateCode: `function knapsack01(weights: number[], values: number[], W: number): number {
  const n = weights.length;
  const dp = Array.from({length: n+1}, () => new Array(W+1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= W; w++) {
      if (weights[i-1] <= w)
        dp[i][w] = Math.max(dp[i-1][w], dp[i-1][w-weights[i-1]] + values[i-1]);
      else dp[i][w] = dp[i-1][w];
    }
  }
  return dp[n][W];
}`,
  visualizerType: 'grid+table', defaultData: [2, 3, 4, 5, 3, 4, 5, 6, 8],
};
function generateKnapsack01Steps(data: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const m = data.length;
  const cap = data[m - 1] ?? 8;
  const half = Math.floor((m - 1) / 2);
  const weights = data.slice(0, half);
  const vals = data.slice(half, m - 1);
  const W = cap, n = weights.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(W + 1).fill(0));
  steps.push({ data: [], activeIndices: [], markedIndices: [], actionType: 'highlight', description: `0/1 背包：重量=[${weights.join(',')}]，价值=[${vals.join(',')}]，容量W=${W}，共${n}件物品`, highlightLines: [1, 2] });
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= W; w++) {
      if (weights[i - 1] <= w) {
        const take = dp[i - 1][w - weights[i - 1]] + vals[i - 1];
        const skip = dp[i - 1][w];
        dp[i][w] = Math.max(skip, take);
        steps.push({ data: [i, w, dp[i][w]], activeIndices: [i, w], markedIndices: [], actionType: 'fill-cell', description: `物品${i}(重${weights[i - 1]}价${vals[i - 1]})，容量${w}：选=${take}，不选=${skip} → dp[${i}][${w}]=${dp[i][w]}`, highlightLines: [4, 5, 6], gridData: dp.map(r => [...r]), gridCells: [{ row: i, col: w, state: 'visiting' }] });
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }
  steps.push({ data: [dp[n][W]], activeIndices: [], markedIndices: [n, W], actionType: 'complete', description: `最大价值 = ${dp[n][W]}`, highlightLines: [] });
  return steps;
}
registerAlgorithm({ meta: knapsack01Meta, generateSteps: generateKnapsack01Steps });

// ============================================================
// 补齐：LCS 最长公共子序列 DP
// ============================================================
const lcsMeta: AlgorithmMeta = {
  id: 'lcs-dp', name: '最长公共子序列（DP）', category: 'advanced',
  difficulty: 'hard', timeComplexity: 'O(mn)', spaceComplexity: 'O(mn)',
  description: '求两个序列的最长公共子序列。输入：前半=X序列，后半=Y序列。如"1,3,5,2,4,1,3,2,4,5"表示X=[1,3,5,2,4]，Y=[1,3,2,4,5]。',
  templateCode: `function lcs(X: number[], Y: number[]): number {
  const m = X.length, n = Y.length;
  const dp = Array.from({length: m+1}, () => new Array(n+1).fill(0));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      if (X[i-1] === Y[j-1]) dp[i][j] = dp[i-1][j-1] + 1;
      else dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
  return dp[m][n];
}`,
  visualizerType: 'array', defaultData: [1, 3, 5, 2, 4, 1, 3, 2, 4, 5],
};
function generateLCSSteps(data: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const half = Math.floor(data.length / 2);
  const X = data.slice(0, half);
  const Y = data.slice(half);
  const m = X.length, n = Y.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  steps.push({ data: [], activeIndices: [], markedIndices: [], actionType: 'highlight', description: `LCS：X=[${X.join(',')}]，Y=[${Y.join(',')}]`, highlightLines: [1, 2] });
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (X[i - 1] === Y[j - 1]) { dp[i][j] = dp[i - 1][j - 1] + 1; steps.push({ data: [i, j, dp[i][j]], activeIndices: [i, j], markedIndices: [], actionType: 'fill-cell', description: `X[${i - 1}]=${X[i - 1]} == Y[${j - 1}]=${Y[j - 1]} → dp[${i}][${j}]=${dp[i][j]}`, highlightLines: [5], gridData: dp.map(r => [...r]), gridCells: [{ row: i, col: j, state: 'visiting' }] }); }
      else { dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]); }
    }
  }
  steps.push({ data: [dp[m][n]], activeIndices: [], markedIndices: [m, n], actionType: 'complete', description: `LCS 长度 = ${dp[m][n]}`, highlightLines: [] });
  return steps;
}
registerAlgorithm({ meta: lcsMeta, generateSteps: generateLCSSteps });

// ============================================================
// 补齐：A* 寻路
// ============================================================
const aStarMeta: AlgorithmMeta = {
  id: 'astar-pathfinding', name: 'A* 寻路算法', category: 'advanced',
  difficulty: 'hard', timeComplexity: 'O(E)', spaceComplexity: 'O(V)',
  description: '启发式搜索，结合 Dijkstra（实际代价 g）和贪心（启发函数 h），f=g+h 优先扩展。',
  templateCode: `function aStar(grid: number[][], start: [number,number], goal: [number,number]): [number,number][] {
  const openSet = new MinHeap(); openSet.push(start, 0);
  const gScore = new Map(); gScore.set(key(start), 0);
  const cameFrom = new Map();
  while (!openSet.isEmpty()) {
    const [r,c] = openSet.pop();
    if (r === goal[0] && c === goal[1]) return reconstructPath(cameFrom, goal);
    for (const [dr,dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
      const nr=r+dr, nc=c+dc;
      if (grid[nr]?.[nc] === 1) {
        const tg = gScore.get(key([r,c])) + 1;
        if (tg < (gScore.get(key([nr,nc])) ?? Infinity)) {
          gScore.set(key([nr,nc]), tg);
          const f = tg + Math.abs(nr-goal[0]) + Math.abs(nc-goal[1]);
          openSet.push([nr,nc], f);
          cameFrom.set(key([nr,nc]), [r,c]);
        }
      }
    }
  }
  return [];
}`,
  visualizerType: 'grid', defaultData: [10, 10],
};
function generateAStarSteps(data: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const rows = 10, cols = 10;
  const grid = Array.from({ length: rows }, () => new Array(cols).fill(1));
  // Add some walls
  for (let i = 1; i <= 7; i++) grid[3][i] = 0;
  for (let i = 3; i <= 8; i++) grid[i][5] = 0;
  grid[7][1] = 0; grid[7][2] = 0; grid[7][3] = 0;
  const sr = 1, sc = 1, er = 8, ec = 8;
  const openSet: [number, number, number][] = [[sr, sc, 0]]; // r, c, f
  const gScore = new Map<string, number>(); gScore.set(`${sr},${sc}`, 0);
  const closedSet = new Set<string>();
  const dirs: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  steps.push({ data: [], activeIndices: [], markedIndices: [], actionType: 'highlight', description: `A* 寻路：起点(1,1)→终点(8,8)。f=g+h，曼哈顿距离启发`, highlightLines: [1, 2], gridData: grid.map(r => [...r]), gridCells: [{ row: sr, col: sc, state: 'start' }, { row: er, col: ec, state: 'end' }] });

  while (openSet.length > 0) {
    openSet.sort((a, b) => a[2] - b[2]);
    const [r, c, f] = openSet.shift()!;
    const key = `${r},${c}`;
    if (closedSet.has(key)) continue;
    closedSet.add(key);

    if (r === er && c === ec) {
      steps.push({ data: [], activeIndices: [], markedIndices: [], actionType: 'complete', description: `A* 到达终点！f=${f}`, highlightLines: [6], gridData: grid.map(row => [...row]), gridCells: [{ row: r, col: c, state: 'end' }] });
      return steps;
    }

    steps.push({ data: [], activeIndices: [], markedIndices: [], actionType: 'visit', description: `扩展 (${r},${c})，f=${f}，g=${gScore.get(key)}，h=${Math.abs(r - er) + Math.abs(c - ec)}`, highlightLines: [5, 6], gridData: closedSet.has(key) ? grid.map(row => [...row]) : grid.map(row => [...row]), gridCells: [{ row: r, col: c, state: 'visiting' }] });

    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 1) {
        const nkey = `${nr},${nc}`;
        if (closedSet.has(nkey)) continue;
        const tg = (gScore.get(key) ?? 0) + 1;
        if (tg < (gScore.get(nkey) ?? Infinity)) {
          gScore.set(nkey, tg);
          const h = Math.abs(nr - er) + Math.abs(nc - ec);
          openSet.push([nr, nc, tg + h]);
          steps.push({ data: [], activeIndices: [], markedIndices: [], actionType: 'compare', description: `邻居 (${nr},${nc})：g=${tg}，h=${h}，f=${tg + h}`, highlightLines: [8, 9, 10], gridData: grid.map(row => [...row]), gridCells: [{ row: nr, col: nc, state: 'visited' }, { row: r, col: c, state: 'visiting' }] });
        }
      }
    }
  }
  steps.push({ data: [], activeIndices: [], markedIndices: [], actionType: 'complete', description: 'A* 未找到路径', highlightLines: [] });
  return steps;
}
registerAlgorithm({ meta: aStarMeta, generateSteps: generateAStarSteps });

// ============================================================
// 补齐：贪心活动选择
// ============================================================
const activitySelectionMeta: AlgorithmMeta = {
  id: 'activity-selection', name: '贪心活动选择', category: 'advanced',
  difficulty: 'medium', timeComplexity: 'O(n log n)', spaceComplexity: 'O(1)',
  description: '按结束时间排序，每次选择最早结束且与已选活动不冲突的活动，最大化活动数量。',
  templateCode: `function activitySelection(start: number[], finish: number[]): number[] {
  const n = start.length;
  const acts = start.map((s,i) => ({s, f: finish[i], i})).sort((a,b) => a.f - b.f);
  const selected: number[] = [acts[0].i];
  let lastFinish = acts[0].f;
  for (let i = 1; i < n; i++) {
    if (acts[i].s >= lastFinish) {
      selected.push(acts[i].i);
      lastFinish = acts[i].f;
    }
  }
  return selected;
}`,
  visualizerType: 'array', defaultData: [1, 3, 0, 5, 3, 5, 6, 8, 8, 2, 12],
};
function generateActivitySelectionSteps(data: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const starts = [1, 3, 0, 5, 3, 5, 6, 8, 8, 2, 12];
  const finishes = [4, 5, 6, 7, 9, 9, 10, 11, 12, 14, 16];
  const n = starts.length;
  const acts = starts.map((s, i) => ({ s, f: finishes[i], idx: i })).sort((a, b) => a.f - b.f);
  const selected: number[] = [];

  steps.push({ data: Array(n).fill(0), activeIndices: [], markedIndices: [], actionType: 'highlight', description: `11 个活动，按结束时间排序`, highlightLines: [1, 2] });

  selected.push(acts[0].idx);
  let lastFinish = acts[0].f;
  const state = Array(n).fill(0); state[0] = 1;
  steps.push({ data: [...state], activeIndices: [0], markedIndices: [0], actionType: 'insert', description: `选择活动${acts[0].idx}（开始${acts[0].s}，结束${acts[0].f}）`, highlightLines: [3, 4] });

  for (let i = 1; i < n; i++) {
    if (acts[i].s >= lastFinish) {
      selected.push(acts[i].idx);
      state[i] = 1;
      steps.push({ data: [...state], activeIndices: [i], markedIndices: selected.map((_, k) => k), actionType: 'insert', description: `活动${acts[i].idx}（${acts[i].s}开始）>= lastFinish=${lastFinish}，选择！`, highlightLines: [6, 7, 8] });
      lastFinish = acts[i].f;
    } else {
      state[i] = -1;
      steps.push({ data: [...state], activeIndices: [i], markedIndices: [], actionType: 'compare', description: `活动${acts[i].idx}（${acts[i].s}开始） < lastFinish=${lastFinish}，冲突跳过`, highlightLines: [6] });
    }
  }

  steps.push({ data: [...state], activeIndices: [], markedIndices: selected.map((_, k) => k), actionType: 'complete', description: `共选择 ${selected.length} 个活动`, highlightLines: [] });
  return steps;
}
registerAlgorithm({ meta: activitySelectionMeta, generateSteps: generateActivitySelectionSteps });

// ============================================================
// 算法：BST 删除
// ============================================================
const bstDeleteMeta: AlgorithmMeta = {
  id: 'bst-delete', name: 'BST 删除', category: 'tree-binary',
  difficulty: 'hard', timeComplexity: 'O(log n)', spaceComplexity: 'O(h)',
  description: '删除BST节点，分三种情况：①叶子直接删 ②单子用子节点替 ③双子找后继替换再删后继。',
  templateCode: `function bstDelete(root: BSTNode | null, key: number): BSTNode | null {
  if (root === null) return null;
  if (key < root.val) root.left = bstDelete(root.left, key);
  else if (key > root.val) root.right = bstDelete(root.right, key);
  else {
    // 情况1&2：单子或无子
    if (root.left === null) return root.right;
    if (root.right === null) return root.left;
    // 情况3：双子 → 找后继
    let succ = root.right;
    while (succ.left) succ = succ.left;
    root.val = succ.val;
    root.right = bstDelete(root.right, succ.val);
  }
  return root;
}`,
  visualizerType: 'tree', defaultData: [50, 30, 70, 20, 40, 60, 80, 30],
};
function generateBSTDeleteSteps(data: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const delVal = data[data.length - 1] ?? 30;
  const tree = data.length > 1 ? data.slice(0, -1) : [50, 30, 70, 20, 40, 60, 80];
  steps.push({ data: [...tree], activeIndices: [], markedIndices: [], actionType: 'highlight', description: `BST删除 ${delVal}，当前树节点：[${tree.filter(v => v !== 0).join(', ')}]`, highlightLines: [1, 2] });

  // Find the node to delete
  let idx = 0;
  const path: number[] = [];
  while (idx < tree.length && tree[idx] !== 0) {
    path.push(idx);
    if (tree[idx] === delVal) break;
    idx = delVal < tree[idx] ? 2 * idx + 1 : 2 * idx + 2;
  }
  const targetIdx = (idx < tree.length && tree[idx] === delVal) ? idx : -1;
  if (targetIdx < 0) {
    steps.push({ data: [...tree], activeIndices: [], markedIndices: [], actionType: 'complete', description: `未找到 ${delVal}`, highlightLines: [] });
    return steps;
  }

  const leftIdx = 2 * targetIdx + 1;
  const rightIdx = 2 * targetIdx + 2;
  const hasLeft = leftIdx < tree.length && tree[leftIdx] !== 0;
  const hasRight = rightIdx < tree.length && tree[rightIdx] !== 0;

  steps.push({ data: [...tree], activeIndices: [targetIdx], markedIndices: path.slice(0, -1), actionType: 'highlight', description: `找到待删节点 arr[${targetIdx}]=${delVal}`, highlightLines: [3, 4] });

  const result = [...tree];

  if (!hasLeft && !hasRight) {
    // Case 1: leaf
    result[targetIdx] = 0;
    steps.push({ data: [...result], activeIndices: [], markedIndices: path.slice(0, -1), actionType: 'delete', description: `情况①：${delVal} 是叶子节点，直接删除`, highlightLines: [6] });
  } else if (hasLeft && !hasRight) {
    // Case 2a: only left child
    result[targetIdx] = result[leftIdx];
    result[leftIdx] = 0;
    steps.push({ data: [...result], activeIndices: [targetIdx, leftIdx], markedIndices: [], actionType: 'move', description: `情况②：${delVal} 只有左子，用 ${result[targetIdx]} 替换`, highlightLines: [6] });
  } else if (!hasLeft && hasRight) {
    // Case 2b: only right child
    result[targetIdx] = result[rightIdx];
    result[rightIdx] = 0;
    steps.push({ data: [...result], activeIndices: [targetIdx, rightIdx], markedIndices: [], actionType: 'move', description: `情况②：${delVal} 只有右子，用 ${result[targetIdx]} 替换`, highlightLines: [6] });
  } else {
    // Case 3: two children → find successor
    let succ = rightIdx;
    while (2 * succ + 1 < result.length && result[2 * succ + 1] !== 0) succ = 2 * succ + 1;
    steps.push({ data: [...result], activeIndices: [targetIdx, succ], markedIndices: [], actionType: 'compare', description: `情况③：双子节点，后继为 arr[${succ}]=${result[succ]}`, highlightLines: [8, 9, 10] });
    result[targetIdx] = result[succ];
    result[succ] = 0;
    steps.push({ data: [...result], activeIndices: [targetIdx], markedIndices: [], actionType: 'swap', description: `用后继 ${result[targetIdx]} 替换 ${delVal}，删除后继原节点`, highlightLines: [10, 11] });
  }

  steps.push({ data: [...result], activeIndices: [], markedIndices: [], actionType: 'complete', description: `删除 ${delVal} 完成`, highlightLines: [] });
  return steps;
}
registerAlgorithm({ meta: bstDeleteMeta, generateSteps: generateBSTDeleteSteps });

// ============================================================
// 算法：Kruskal 最小生成树
// ============================================================
const kruskalMeta: AlgorithmMeta = {
  id: 'kruskal-mst', name: 'Kruskal 最小生成树', category: 'graph',
  difficulty: 'hard', timeComplexity: 'O(E log E)', spaceComplexity: 'O(V)',
  description: '所有边按权重排序，从小到大尝试加入，用并查集判断是否成环，不成环则选中。',
  templateCode: `function kruskal(edges: Edge[], n: number): Edge[] {
  edges.sort((a,b) => a.w - b.w);
  const uf = new UnionFind(n);
  const mst: Edge[] = [];
  for (const e of edges) {
    if (uf.find(e.u) !== uf.find(e.v)) {
      uf.union(e.u, e.v);
      mst.push(e);
    }
  }
  return mst;
}`,
  visualizerType: 'graph', defaultData: [5, 0,2,1, 3,4,2, 1,2,2, 0,1,4, 1,3,5, 2,3,8, 2,4,10],
};
function generateKruskalSteps(data: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const n = data[0] || 5;
  const edges: Array<{ u: number; v: number; w: number }> = [];
  for (let i = 1; i + 2 < data.length; i += 3) {
    edges.push({ u: data[i], v: data[i + 1], w: data[i + 2] });
  }
  edges.sort((a, b) => a.w - b.w);
  const parent = Array.from({ length: n }, (_, i) => i);
  function find(x: number): number { while (parent[x] !== x) x = parent[x]; return x; }
  function union(a: number, b: number) { parent[find(a)] = find(b); }
  const distData = new Array(n).fill(-1);
  function kData() { return [n, ...distData]; }
  const allEdges: import('@/types/algo').GraphEdgeHighlight[] = edges.map(e => ({ from: e.u, to: e.v, active: false, weight: e.w }));
  const mstEdges: typeof edges = [];

  steps.push({ data: kData(), activeIndices: [], markedIndices: [], actionType: 'highlight', description: `Kruskal：${n}节点${edges.length}条边（已按权排序）`, highlightLines: [1, 2], graphEdges: [...allEdges] });

  for (const e of edges) {
    const ru = find(e.u), rv = find(e.v);
    if (ru !== rv) {
      union(e.u, e.v); mstEdges.push(e);
      distData[e.u] = 1; distData[e.v] = 1;
      steps.push({ data: kData(), activeIndices: [e.u, e.v], markedIndices: [...new Set(mstEdges.flatMap(ed => [ed.u, ed.v]))], actionType: 'relax', description: `选边(${e.u},${e.v})权=${e.w}，不构成环`, highlightLines: [5,6,7], graphEdges: mstEdges.map(ed => ({ from: ed.u, to: ed.v, active: true, weight: ed.w })) });
    } else {
      steps.push({ data: kData(), activeIndices: [e.u, e.v], markedIndices: [...new Set(mstEdges.flatMap(ed => [ed.u, ed.v]))], actionType: 'compare', description: `跳过(${e.u},${e.v})权=${e.w}，会成环`, highlightLines: [5], graphEdges: allEdges.map(ed => ({ ...ed, active: ed.from===e.u&&ed.to===e.v })) });
    }
    if (mstEdges.length === n - 1) break;
  }

  steps.push({ data: kData(), activeIndices: [], markedIndices: Array.from({length:n},(_,i)=>i), actionType: 'complete', description: `Kruskal完成！${mstEdges.length}条边，总权=${mstEdges.reduce((s,e)=>s+e.w,0)}`, highlightLines: [], graphEdges: mstEdges.map(ed => ({ from: ed.u, to: ed.v, active: true, weight: ed.w })) });
  return steps;
}
registerAlgorithm({ meta: kruskalMeta, generateSteps: generateKruskalSteps });

// ============================================================
// 算法：基数排序
// ============================================================
const radixSortMeta: AlgorithmMeta = {
  id: 'radix-sort', name: '基数排序', category: 'sorting',
  difficulty: 'medium', timeComplexity: 'O(d·n)', spaceComplexity: 'O(n)',
  description: '从最低位到最高位，每轮按当前位值分桶（0-9）再收集，逐位稳定排序。',
  templateCode: `function radixSort(arr: number[]): void {
  const max = Math.max(...arr);
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    const buckets: number[][] = Array.from({length:10}, () => []);
    for (const v of arr) buckets[Math.floor(v/exp)%10].push(v);
    let i = 0;
    for (const b of buckets) for (const v of b) arr[i++] = v;
  }
}`,
  visualizerType: 'array', defaultData: [170, 45, 75, 90, 802, 24, 2, 66],
};
function generateRadixSortSteps(data: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const arr = [...data];
  const max = Math.max(...arr);
  steps.push({ data: [...arr], activeIndices: [], markedIndices: [], actionType: 'highlight', description: `基数排序：初始数组 [${arr.join(', ')}]，最大值=${max}`, highlightLines: [1, 2] });
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    const digit = Math.floor(Math.log10(exp)) + 1;
    steps.push({ data: [...arr], activeIndices: [], markedIndices: [], actionType: 'divide', description: `第 ${digit} 轮：按${digit === 1 ? '个' : digit === 2 ? '十' : '百'}位分桶`, highlightLines: [2] });
    const buckets: number[][] = Array.from({ length: 10 }, () => []);
    for (const v of arr) buckets[Math.floor(v / exp) % 10].push(v);
    let i = 0;
    for (let b = 0; b < 10; b++) {
      if (buckets[b].length > 0) {
        for (const v of buckets[b]) { arr[i++] = v; }
        steps.push({ data: [...arr], activeIndices: Array.from({ length: buckets[b].length }, (_, k) => i - buckets[b].length + k), markedIndices: Array.from({ length: i }, (_, k) => k), actionType: 'merge', description: `桶${b}收集：[${buckets[b].join(', ')}]，数组=[${arr.join(', ')}]`, highlightLines: [4, 5] });
      }
    }
  }
  steps.push({ data: [...arr], activeIndices: [], markedIndices: Array.from({ length: arr.length }, (_, i) => i), actionType: 'complete', description: `基数排序完成！[${arr.join(', ')}]`, highlightLines: [] });
  return steps;
}
registerAlgorithm({ meta: radixSortMeta, generateSteps: generateRadixSortSteps });

// ============================================================
// 算法：编辑距离 DP
// ============================================================
const editDistanceMeta: AlgorithmMeta = {
  id: 'edit-distance', name: '最短编辑距离（DP）', category: 'advanced',
  difficulty: 'hard', timeComplexity: 'O(mn)', spaceComplexity: 'O(mn)',
  description: '求将字符串A转换为B的最少操作次数（插入/删除/替换各算1次）。经典DP问题。',
  templateCode: `function editDistance(A: string, B: string): number {
  const m = A.length, n = B.length;
  const dp = Array.from({length: m+1}, () => new Array(n+1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      if (A[i-1] === B[j-1]) dp[i][j] = dp[i-1][j-1];
      else dp[i][j] = 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
  return dp[m][n];
}`,
  visualizerType: 'array', defaultData: [3, 4],
};
function generateEditDistanceSteps(data: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const A = 'horse', B = 'ros';
  const m = A.length, n = B.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  steps.push({ data: [], activeIndices: [], markedIndices: [], actionType: 'highlight', description: `编辑距离：A="${A}" → B="${B}"，初始化DP表`, highlightLines: [1, 2, 3, 4] });
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (A[i - 1] === B[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
        steps.push({ data: [i, j, dp[i][j]], activeIndices: [i, j], markedIndices: [], actionType: 'fill-cell', description: `A[${i - 1}]='${A[i - 1]}' == B[${j - 1}]='${B[j - 1]}' → dp[${i}][${j}]=${dp[i][j]}（匹配，无需操作）`, highlightLines: [6], gridData: dp.map(r => [...r]), gridCells: [{ row: i, col: j, state: 'visiting' }] });
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        const ops = [dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + 1];
        steps.push({ data: [i, j, dp[i][j]], activeIndices: [i, j], markedIndices: [], actionType: 'fill-cell', description: `A[${i - 1}]='${A[i - 1]}' ≠ B[${j - 1}]='${B[j - 1]}' → min(删${ops[0]},插${ops[1]},替${ops[2]})=${dp[i][j]}`, highlightLines: [7], gridData: dp.map(r => [...r]), gridCells: [{ row: i, col: j, state: 'visiting' }] });
      }
    }
  }
  steps.push({ data: [dp[m][n]], activeIndices: [], markedIndices: [m, n], actionType: 'complete', description: `编辑距离 = ${dp[m][n]}（"${A}" → "${B}"）`, highlightLines: [] });
  return steps;
}
registerAlgorithm({ meta: editDistanceMeta, generateSteps: generateEditDistanceSteps });

// ============================================================
// 算法：桶排序
// ============================================================
const bucketSortMeta: AlgorithmMeta = {
  id: 'bucket-sort', name: '桶排序', category: 'sorting',
  difficulty: 'medium', timeComplexity: 'O(n+k)', spaceComplexity: 'O(n+k)',
  description: '将元素按值域分到多个桶中，每桶内排序后合并。适合数据均匀分布的场景。',
  templateCode: `function bucketSort(arr: number[], bucketCount: number): void {
  const max = Math.max(...arr), min = Math.min(...arr);
  const range = (max - min) / bucketCount;
  const buckets: number[][] = Array.from({length: bucketCount}, () => []);
  for (const v of arr) buckets[Math.floor((v - min) / range) ?? 0].push(v);
  for (const b of buckets) b.sort((a,b) => a - b);
  let i = 0;
  for (const b of buckets) for (const v of b) arr[i++] = v;
}`,
  visualizerType: 'array', defaultData: [42, 32, 33, 52, 37, 47, 51],
};
function generateBucketSortSteps(data: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const arr = [...data];
  const k = 4;
  const max = Math.max(...arr), min = Math.min(...arr);
  const range = (max - min) / k;
  steps.push({ data: [...arr], activeIndices: [], markedIndices: [], actionType: 'highlight', description: `桶排序：${k}个桶，值域[${min},${max}]`, highlightLines: [1, 2] });
  const buckets: number[][] = Array.from({ length: k }, () => []);
  for (const v of arr) {
    const bi = Math.min(Math.floor((v - min) / (range || 1)), k - 1);
    buckets[bi].push(v);
    steps.push({ data: [...arr], activeIndices: [arr.indexOf(v)], markedIndices: [], actionType: 'move', description: `${v} → 桶${bi}`, highlightLines: [4] });
  }
  for (let b = 0; b < k; b++) {
    buckets[b].sort((a, b) => a - b);
    if (buckets[b].length > 0) steps.push({ data: [...arr], activeIndices: [], markedIndices: [], actionType: 'merge', description: `桶${b}排序：[${buckets[b].join(', ')}]`, highlightLines: [5] });
  }
  let i = 0;
  for (let b = 0; b < k; b++) {
    for (const v of buckets[b]) {
      arr[i++] = v;
      steps.push({ data: [...arr], activeIndices: [i - 1], markedIndices: Array.from({ length: i }, (_, j) => j), actionType: 'insert', description: `合并桶${b}：${v} → arr[${i - 1}]`, highlightLines: [6, 7] });
    }
  }
  steps.push({ data: [...arr], activeIndices: [], markedIndices: Array.from({ length: arr.length }, (_, j) => j), actionType: 'complete', description: `桶排序完成！[${arr.join(', ')}]`, highlightLines: [] });
  return steps;
}
registerAlgorithm({ meta: bucketSortMeta, generateSteps: generateBucketSortSteps });

// ============================================================
// 算法：堆的构建
// ============================================================
const heapBuildMeta: AlgorithmMeta = {
  id: 'heap-build', name: '堆的构建（自底向上）', category: 'tree-binary',
  difficulty: 'medium', timeComplexity: 'O(n)', spaceComplexity: 'O(1)',
  description: '从最后一个非叶节点开始，自底向上逐个下沉调整，将任意数组转化为最大堆。',
  templateCode: `function buildMaxHeap(arr: number[]): void {
  const n = arr.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }
}
function heapify(arr: number[], size: number, root: number): void {
  let largest = root;
  const left = 2 * root + 1, right = 2 * root + 2;
  if (left < size && arr[left] > arr[largest]) largest = left;
  if (right < size && arr[right] > arr[largest]) largest = right;
  if (largest !== root) {
    [arr[root], arr[largest]] = [arr[largest], arr[root]];
    heapify(arr, size, largest);
  }
}`,
  visualizerType: 'tree', defaultData: [4, 10, 3, 5, 1, 8, 6],
};
function generateHeapBuildSteps(data: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const arr = data.length > 0 ? data : [4, 10, 3, 5, 1, 8, 6];
  const n = arr.length;
  steps.push({ data: [...arr], activeIndices: [], markedIndices: [], actionType: 'highlight', description: `初始数组：[${arr.join(', ')}]，准备建堆`, highlightLines: [1, 2] });
  function heapify(size: number, root: number) {
    let largest = root;
    const l = 2 * root + 1, r = 2 * root + 2;
    if (l < size) { steps.push({ data: [...arr], activeIndices: [root, l], markedIndices: [], actionType: 'compare', description: `比较 arr[${root}]=${arr[root]} 与左子 arr[${l}]=${arr[l]}`, highlightLines: [9] }); if (arr[l] > arr[largest]) largest = l; }
    if (r < size) { steps.push({ data: [...arr], activeIndices: [largest, r], markedIndices: [], actionType: 'compare', description: `比较 arr[${largest}]=${arr[largest]} 与右子 arr[${r}]=${arr[r]}`, highlightLines: [9] }); if (arr[r] > arr[largest]) largest = r; }
    if (largest !== root) {
      [arr[root], arr[largest]] = [arr[largest], arr[root]];
      steps.push({ data: [...arr], activeIndices: [root, largest], markedIndices: [], actionType: 'swap', description: `交换 arr[${root}] 和 arr[${largest}]，继续下沉`, highlightLines: [10, 11] });
      heapify(size, largest);
    }
  }
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    steps.push({ data: [...arr], activeIndices: [i], markedIndices: [], actionType: 'highlight', description: `调整以 arr[${i}]=${arr[i]} 为根的子树`, highlightLines: [3] });
    heapify(n, i);
  }
  steps.push({ data: [...arr], activeIndices: [], markedIndices: Array.from({ length: n }, (_, i) => i), actionType: 'complete', description: `最大堆构建完成！[${arr.join(', ')}]`, highlightLines: [] });
  return steps;
}
registerAlgorithm({ meta: heapBuildMeta, generateSteps: generateHeapBuildSteps });

// ============================================================
// 算法：括号匹配
// ============================================================
const bracketMatchMeta: AlgorithmMeta = {
  id: 'bracket-match', name: '括号匹配', category: 'stack-queue',
  difficulty: 'medium', timeComplexity: 'O(n)', spaceComplexity: 'O(n)',
  description: '用栈检查括号是否配对。直接输入括号串，如 ({[]}) 或 (()[]{})。',
  templateCode: `function isValid(s: string): boolean {
  const stack: string[] = [];
  const pairs: Record<string,string> = {')':'(','}':'{',']':'['};
  for (const ch of s) {
    if (ch === '(' || ch === '{' || ch === '[') stack.push(ch);
    else {
      if (stack.length === 0 || stack.pop() !== pairs[ch]) return false;
    }
  }
  return stack.length === 0;
}`,
  visualizerType: 'array', defaultData: [40, 123, 91, 93, 125, 41],
};
function generateBracketMatchSteps(data: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const s = String.fromCharCode(...data);
  const pairOf: Record<string, string> = { ')': '(', '}': '{', ']': '[' };
  function toCode(ch: string): number { return ch.charCodeAt(0); }
  const stack: string[] = [];
  steps.push({ data: data, activeIndices: [], markedIndices: [], actionType: 'highlight', description: `括号序列："${s}"`, highlightLines: [1, 2] });
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    const isLeft = ch === '(' || ch === '{' || ch === '[';
    if (isLeft) {
      stack.push(ch);
      steps.push({ data: stack.map(c => toCode(c)), activeIndices: [i], markedIndices: Array.from({length: i}, (_,k) => k), actionType: 'insert', description: `'${ch}' 入栈，栈=[${stack.join(' ')}]`, highlightLines: [4] });
    } else {
      const top = stack.length > 0 ? stack.pop()! : '?';
      const expected = pairOf[ch];
      const ok = top === expected;
      steps.push({ data: stack.map(c => toCode(c)), activeIndices: [i], markedIndices: Array.from({length: i}, (_,k) => k), actionType: ok ? 'delete' : 'compare', description: ok ? `'${ch}' 匹配栈顶'${top}' ✅` : `'${ch}' 期望'${expected}' 实际栈顶'${top}' ❌`, highlightLines: [5, 6] });
      if (!ok) {
        steps.push({ data: [], activeIndices: [], markedIndices: [], actionType: 'complete', description: `匹配失败！位置${i}的'${ch}'不匹配`, highlightLines: [6] });
        return steps;
      }
    }
  }
  const valid = stack.length === 0;
  steps.push({ data: [], activeIndices: [], markedIndices: [], actionType: 'complete', description: valid ? `"${s}" 括号序列合法 ✅` : `"${s}" 括号不合法，栈非空 ❌`, highlightLines: [8] });
  return steps;
}
registerAlgorithm({ meta: bracketMatchMeta, generateSteps: generateBracketMatchSteps });

// ============================================================
// 算法：哈夫曼树
// ============================================================
const huffmanMeta: AlgorithmMeta = {
  id: 'huffman-tree', name: '哈夫曼树构建', category: 'tree-binary',
  difficulty: 'hard', timeComplexity: 'O(n log n)', spaceComplexity: 'O(n)',
  description: '每次取两个最小权节点合并为新父节点（权=两子之和），子树逐步向上生长直到合成一棵树。',
  templateCode: `function buildHuffman(freq: number[]): HuffmanNode {
  const pq = freq.map((f,i) => new HuffmanNode(f, i)).sort((a,b) => a.f - b.f);
  while (pq.length > 1) {
    const left = pq.shift()!, right = pq.shift()!;
    const parent = new HuffmanNode(left.f + right.f, -1, left, right);
    pq.push(parent); pq.sort((a,b) => a.f - b.f);
  }
  return pq[0];
}`,
  visualizerType: 'tree', defaultData: [5, 9, 12, 13, 16, 45],
};
function generateHuffmanSteps(data: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const freqs = data.length > 0 ? data : [5, 9, 12, 13, 16, 45];

  interface HNode { f: number; id: number; left: number; right: number; parent: number; }
  const nodes: HNode[] = freqs.map((f, i) => ({ f, id: i, left: -1, right: -1, parent: -1 }));
  let nextId = freqs.length;

  // --- Step 0: show all leaves ---
  steps.push({
    data: freqs.map(f => f), activeIndices: [], markedIndices: [],
    actionType: 'highlight',
    description: `初始叶子节点：[${freqs.join(', ')}]，每次合并最小的两个`,
    highlightLines: [1, 2],
  });

  // --- Merge steps: flat array of current roots (always visible, never empty) ---
  while (nodes.filter(n => n.parent === -1).length > 1) {
    const unmerged = nodes.filter(n => n.parent === -1).sort((a, b) => a.f - b.f);
    const a = unmerged[0], b = unmerged[1];

    // Highlight which two are selected
    steps.push({
      data: unmerged.map(n => n.f),
      activeIndices: [0, 1],
      markedIndices: Array.from({ length: unmerged.length - 2 }, (_, i) => i + 2),
      actionType: 'compare',
      description: `选出最小的两个：${a.f} 和 ${b.f}`,
      highlightLines: [3],
    });

    // Merge
    const parent: HNode = { f: a.f + b.f, id: nextId, left: a.id, right: b.id, parent: -1 };
    nodes.push(parent);
    nodes.find(n => n.id === a.id)!.parent = nextId;
    nodes.find(n => n.id === b.id)!.parent = nextId;
    nextId++;

    const remaining = nodes.filter(n => n.parent === -1).sort((a, b) => a.f - b.f);
    const isLast = remaining.length === 1;
    steps.push({
      data: remaining.map(n => n.f),
      activeIndices: [remaining.length - 1],
      markedIndices: Array.from({ length: remaining.length - 1 }, (_, i) => i),
      actionType: 'merge',
      description: isLast
        ? `${a.f} + ${b.f} = ${parent.f} ← 最后一次合并！`
        : `${a.f} + ${b.f} = ${parent.f}，剩余：[${remaining.map(n => n.f).join(', ')}]`,
      highlightLines: [4, 5],
    });
  }

  // --- Final: build full tree ---
  const root = nodes.find(n => n.parent === -1)!;
  function place(id: number, arr: number[], idx: number) {
    while (arr.length <= idx) arr.push(0);
    const n = nodes.find(x => x.id === id); if (!n) return;
    arr[idx] = n.f;
    if (n.left >= 0) place(n.left, arr, 2 * idx + 1);
    if (n.right >= 0) place(n.right, arr, 2 * idx + 2);
  }
  const finalTree: number[] = [];
  place(root.id, finalTree, 0);
  steps.push({
    data: finalTree,
    activeIndices: [],
    markedIndices: Array.from({ length: finalTree.length }, (_, i) => (finalTree[i] !== 0 ? i : -1)).filter(i => i >= 0),
    actionType: 'complete',
    description: `哈夫曼树完成！根=${root.f}，${freqs.length}叶+${nodes.length - freqs.length}内部节点`,
    highlightLines: [],
  });
  return steps;
}
registerAlgorithm({ meta: huffmanMeta, generateSteps: generateHuffmanSteps });

// ============================================================
// 顺序表查找
// ============================================================
const seqListSearchMeta: AlgorithmMeta = {
  id: 'seqlist-search', name: '顺序表查找', category: 'linear-list',
  difficulty: 'easy', timeComplexity: 'O(n)', spaceComplexity: 'O(1)',
  description: '在顺序表中从头到尾逐个比较，查找目标值。末尾位=目标值。',
  templateCode: `function seqListSearch(arr: number[], target: number): number {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}`,
  visualizerType: 'array', defaultData: [12, 45, 23, 67, 34, 89, 56, 67],
};
function generateSeqListSearchSteps(data: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const target = data[data.length - 1] ?? 67;
  const arr = data.slice(0, -1);
  steps.push({ data: [...arr], activeIndices: [], markedIndices: [], actionType: 'highlight', description: `顺序表查找 ${target}，数组：[${arr.join(', ')}]`, highlightLines: [1] });
  for (let i = 0; i < arr.length; i++) {
    steps.push({ data: [...arr], activeIndices: [i], markedIndices: Array.from({ length: i }, (_, k) => k), actionType: 'compare', description: `比较 arr[${i}]=${arr[i]} 与 ${target}`, highlightLines: [2] });
    if (arr[i] === target) {
      steps.push({ data: [...arr], activeIndices: [i], markedIndices: [i], actionType: 'complete', description: `找到！arr[${i}]=${target}`, highlightLines: [2] });
      return steps;
    }
  }
  steps.push({ data: [...arr], activeIndices: [], markedIndices: [], actionType: 'complete', description: `未找到 ${target}`, highlightLines: [3] });
  return steps;
}
registerAlgorithm({ meta: seqListSearchMeta, generateSteps: generateSeqListSearchSteps });

// ============================================================
// 链栈
// ============================================================
const linkedStackMeta: AlgorithmMeta = {
  id: 'linked-stack', name: '链栈操作', category: 'stack-queue',
  difficulty: 'medium', timeComplexity: 'O(1)', spaceComplexity: 'O(n)',
  description: '以链表头作为栈顶：push=头插，pop=删除头节点。输入为要push的值序列。',
  templateCode: `class LinkStack { top: Node | null = null; }
function push(stack: LinkStack, val: number) {
  const node = new Node(val); node.next = stack.top; stack.top = node;
}
function pop(stack: LinkStack): number | null {
  if (!stack.top) return null;
  const val = stack.top.val; stack.top = stack.top.next; return val;
}`,
  visualizerType: 'linked-list', defaultData: [10, 20, 30],
};
function generateLinkedStackSteps(data: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const vals = data.length > 0 ? data : [10, 20, 30];
  const stack: number[] = [];
  steps.push({ data: [], activeIndices: [], markedIndices: [], actionType: 'highlight', description: `链栈初始为空，准备push：[${vals.join(', ')}]`, highlightLines: [1] });
  for (const v of vals) {
    stack.unshift(v);
    steps.push({ data: [...stack], activeIndices: [0], markedIndices: Array.from({ length: stack.length - 1 }, (_, i) => i + 1), actionType: 'insert', description: `push(${v}) → 头插，栈顶=[${stack.join('→')}]`, highlightLines: [2, 3] });
  }
  // Pop a couple
  for (let i = 0; i < Math.min(2, vals.length); i++) {
    const v = stack.shift()!;
    steps.push({ data: [...stack], activeIndices: [0], markedIndices: [], actionType: 'delete', description: `pop() → ${v}，栈顶=[${stack.join('→')}]`, highlightLines: [5, 6] });
  }
  steps.push({ data: stack, activeIndices: [], markedIndices: Array.from({ length: stack.length }, (_, i) => i), actionType: 'complete', description: '链栈操作演示完成', highlightLines: [] });
  return steps;
}
registerAlgorithm({ meta: linkedStackMeta, generateSteps: generateLinkedStackSteps });

// ============================================================
// 链队列
// ============================================================
const linkedQueueMeta: AlgorithmMeta = {
  id: 'linked-queue', name: '链队列操作', category: 'stack-queue',
  difficulty: 'medium', timeComplexity: 'O(1)', spaceComplexity: 'O(n)',
  description: 'front指向队头出队，rear指向队尾入队。输入为要enqueue的值序列。',
  templateCode: `class LinkQueue { front: Node | null = null; rear: Node | null = null; }
function enqueue(q: LinkQueue, val: number) {
  const node = new Node(val);
  if (!q.rear) q.front = q.rear = node;
  else { q.rear.next = node; q.rear = node; }
}
function dequeue(q: LinkQueue): number | null {
  if (!q.front) return null;
  const val = q.front.val; q.front = q.front.next;
  if (!q.front) q.rear = null; return val;
}`,
  visualizerType: 'linked-list', defaultData: [10, 20, 30, 40],
};
function generateLinkedQueueSteps(data: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const vals = data.length > 0 ? data : [10, 20, 30, 40];
  const q: number[] = [];
  steps.push({ data: [], activeIndices: [], markedIndices: [], actionType: 'highlight', description: `链队列初始为空，入队：[${vals.join(', ')}]`, highlightLines: [1] });
  for (const v of vals) {
    q.push(v);
    steps.push({ data: [...q], activeIndices: [q.length - 1], markedIndices: Array.from({ length: q.length - 1 }, (_, i) => i), actionType: 'insert', description: `enqueue(${v}) → 队尾加入，队列=[${q.join('→')}]`, highlightLines: [3, 4] });
  }
  for (let i = 0; i < Math.min(2, vals.length); i++) {
    q.shift();
    steps.push({ data: [...q], activeIndices: [0], markedIndices: [], actionType: 'delete', description: `dequeue() → 队头出队，队列=[${q.join('→')}]`, highlightLines: [7, 8] });
  }
  steps.push({ data: q, activeIndices: [], markedIndices: Array.from({ length: q.length }, (_, i) => i), actionType: 'complete', description: '链队列操作演示完成', highlightLines: [] });
  return steps;
}
registerAlgorithm({ meta: linkedQueueMeta, generateSteps: generateLinkedQueueSteps });

// ============================================================
// 中缀转后缀
// ============================================================
const infixToPostfixMeta: AlgorithmMeta = {
  id: 'infix-to-postfix', name: '中缀转后缀', category: 'stack-queue',
  difficulty: 'hard', timeComplexity: 'O(n)', spaceComplexity: 'O(n)',
  description: '用操作符栈将中缀表达式转为后缀。直接输入表达式，如 3+2*4-5 或 (1+2)*3。',
  templateCode: `function infixToPostfix(expr: string): string {
  const out: string[] = [], stack: string[] = [];
  const prec: Record<string,number> = {'+':1,'-':1,'*':2,'/':2};
  for (const ch of expr) {
    if (/[0-9]/.test(ch)) out.push(ch);
    else if (ch === '(') stack.push(ch);
    else if (ch === ')') { while(stack.length && stack[stack.length-1]!=='(') out.push(stack.pop()!); stack.pop(); }
    else { while(stack.length && prec[stack[stack.length-1]] >= prec[ch]) out.push(stack.pop()!); stack.push(ch); }
  }
  while(stack.length) out.push(stack.pop()!);
  return out.join('');
}`,
  visualizerType: 'array', defaultData: [51, 43, 50, 42, 52, 45, 53],
};
function generateInfixToPostfixSteps(data: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const expr = String.fromCharCode(...data);
  function toCode(ch: string): number { return ch.charCodeAt(0); }
  const out: string[] = [], stack: string[] = [];
  const prec: Record<string, number> = { '+': 1, '-': 1, '*': 2, '/': 2 };
  steps.push({ data: [...data], activeIndices: [], markedIndices: [], actionType: 'highlight', description: `中缀："${expr}" → 转后缀`, highlightLines: [1, 2] });
  for (const ch of expr) {
    if (/[0-9]/.test(ch)) {
      out.push(ch);
      steps.push({ data: out.map(c => toCode(c)), activeIndices: [out.length - 1], markedIndices: [], actionType: 'insert', description: `'${ch}'是数字 → 输出=[${out.join('')}]`, highlightLines: [4] });
    } else if (ch === '(') {
      stack.push(ch);
      steps.push({ data: stack.map(c => toCode(c)), activeIndices: [stack.length - 1], markedIndices: [], actionType: 'insert', description: `'(' 入栈，栈=[${stack.join('')}]`, highlightLines: [5] });
    } else if (ch === ')') {
      while (stack.length && stack[stack.length - 1] !== '(') {
        const op = stack.pop()!; out.push(op);
        steps.push({ data: out.map(c => toCode(c)), activeIndices: [out.length - 1], markedIndices: [], actionType: 'move', description: `遇')'：弹出'${op}' → 输出=[${out.join('')}]`, highlightLines: [6] });
      }
      stack.pop(); // pop '('
    } else {
      while (stack.length && stack[stack.length - 1] !== '(' && (prec[stack[stack.length - 1]] ?? 0) >= (prec[ch] ?? 0)) {
        const op = stack.pop()!; out.push(op);
        steps.push({ data: out.map(c => toCode(c)), activeIndices: [out.length - 1], markedIndices: [], actionType: 'compare', description: `'${ch}'优先级≤栈顶'${op}' → 弹出'${op}'，输出=[${out.join('')}]`, highlightLines: [7] });
      }
      stack.push(ch);
      steps.push({ data: stack.map(c => toCode(c)), activeIndices: [stack.length - 1], markedIndices: [], actionType: 'insert', description: `'${ch}' 入栈，栈=[${stack.join('')}]`, highlightLines: [7] });
    }
  }
  while (stack.length) { const op = stack.pop()!; out.push(op); steps.push({ data: out.map(c => toCode(c)), activeIndices: [out.length - 1], markedIndices: [], actionType: 'move', description: `剩余'${op}'出栈 → 输出=[${out.join('')}]`, highlightLines: [9] }); }
  steps.push({ data: out.map(c => toCode(c)), activeIndices: [], markedIndices: Array.from({ length: out.length }, (_, i) => i), actionType: 'complete', description: `后缀表达式："${out.join('')}"`, highlightLines: [] });
  return steps;
}
registerAlgorithm({ meta: infixToPostfixMeta, generateSteps: generateInfixToPostfixSteps });

// ============================================================
// 斐波那契查找
// ============================================================
const fibonacciSearchMeta: AlgorithmMeta = {
  id: 'fibonacci-search', name: '斐波那契查找', category: 'searching',
  difficulty: 'medium', timeComplexity: 'O(log n)', spaceComplexity: 'O(1)',
  description: '利用斐波那契数列确定分割点。末尾位=目标值，数组需有序。',
  templateCode: `function fibonacciSearch(arr: number[], target: number): number {
  const n = arr.length;
  let fib2 = 0, fib1 = 1, fib = 1;
  while (fib < n) { fib2 = fib1; fib1 = fib; fib = fib1 + fib2; }
  let offset = -1;
  while (fib > 1) {
    const i = Math.min(offset + fib2, n - 1);
    if (arr[i] < target) { fib = fib1; fib1 = fib2; fib2 = fib - fib1; offset = i; }
    else if (arr[i] > target) { fib = fib2; fib1 = fib1 - fib2; fib2 = fib - fib1; }
    else return i;
  }
  if (fib1 && arr[offset + 1] === target) return offset + 1;
  return -1;
}`,
  visualizerType: 'array', defaultData: [10, 22, 35, 40, 45, 50, 68, 72, 85, 90, 72],
};
function generateFibonacciSearchSteps(data: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const target = data[data.length - 1] ?? 72;
  const arr = data.slice(0, -1).sort((a, b) => a - b);
  const n = arr.length;
  let fib2 = 0, fib1 = 1, fib = 1;
  while (fib < n) { fib2 = fib1; fib1 = fib; fib = fib1 + fib2; }
  let offset = -1;
  steps.push({ data: [...arr], activeIndices: [], markedIndices: [], actionType: 'highlight', description: `斐波那契查找 ${target}，数组：[${arr.join(', ')}]`, highlightLines: [1, 2] });
  while (fib > 1) {
    const i = Math.min(offset + fib2, n - 1);
    steps.push({ data: [...arr], activeIndices: [i], markedIndices: [], actionType: 'compare', description: `fib=${fib}，检查 arr[${i}]=${arr[i]}`, highlightLines: [5] });
    if (arr[i] < target) { fib = fib1; fib1 = fib2; fib2 = fib - fib1; offset = i; steps.push({ data: [...arr], activeIndices: [i], markedIndices: Array.from({ length: i + 1 }, (_, k) => k), actionType: 'move', description: `arr[${i}] < ${target}，右移`, highlightLines: [6] }); }
    else if (arr[i] > target) { fib = fib2; fib1 = fib1 - fib2; fib2 = fib - fib1; steps.push({ data: [...arr], activeIndices: [i], markedIndices: Array.from({ length: n - i }, (_, k) => k + i), actionType: 'move', description: `arr[${i}] > ${target}，左移`, highlightLines: [7] }); }
    else { steps.push({ data: [...arr], activeIndices: [i], markedIndices: [i], actionType: 'complete', description: `找到！arr[${i}]=${target}`, highlightLines: [7] }); return steps; }
  }
  steps.push({ data: [...arr], activeIndices: [], markedIndices: [], actionType: 'complete', description: `未找到 ${target}`, highlightLines: [9] });
  return steps;
}
registerAlgorithm({ meta: fibonacciSearchMeta, generateSteps: generateFibonacciSearchSteps });

// ============================================================
// 邻接矩阵存储
// ============================================================
const adjacencyMatrixMeta: AlgorithmMeta = {
  id: 'adjacency-matrix', name: '邻接矩阵存储', category: 'graph',
  difficulty: 'easy', timeComplexity: 'O(1)', spaceComplexity: 'O(V²)',
  description: '用 V×V 矩阵存储图：matrix[i][j]≠0表示边(i,j)存在，值为边权重。',
  templateCode: `// 5节点无向图的邻接矩阵
const graph = [
  [0, 4, 1, 0, 0],
  [4, 0, 2, 5, 0],
  [1, 2, 0, 8, 10],
  [0, 5, 8, 0, 2],
  [0, 0, 10, 2, 0],
];`,
  visualizerType: 'grid', defaultData: [0, 1, 2, 3, 4],
};
function generateAdjacencyMatrixSteps(data: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const n = 5;
  const mat = [0, 4, 1, 0, 0, 4, 0, 2, 5, 0, 1, 2, 0, 8, 10, 0, 5, 8, 0, 2, 0, 0, 10, 2, 0];
  const grid: number[][] = Array.from({ length: n }, (_, i) => mat.slice(i * n, (i + 1) * n));
  const allPathCells: GridCell[] = [];
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++)
      if (mat[i * n + j] > 0) allPathCells.push({ row: i, col: j, state: 'path' });
  steps.push({ data: [], activeIndices: [], markedIndices: [], actionType: 'highlight', description: `5×5邻接矩阵：绿色=有边(格内数字=权重)，深色=无边`, highlightLines: [1], gridData: grid.map(r => [...r]), gridCells: allPathCells });
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++)
      if (mat[i * n + j] > 0)
        steps.push({ data: [], activeIndices: [], markedIndices: [], actionType: 'highlight', description: `边(${i},${j}) 权重=${mat[i * n + j]}`, highlightLines: [1], gridData: grid.map(r => [...r]), gridCells: [...allPathCells, { row: i, col: j, state: 'visiting' }, { row: j, col: i, state: 'visiting' }] });
  steps.push({ data: [], activeIndices: [], markedIndices: [], actionType: 'complete', description: `共7条边，对称矩阵`, highlightLines: [], gridData: grid.map(r => [...r]), gridCells: allPathCells });
  return steps;
}
registerAlgorithm({ meta: adjacencyMatrixMeta, generateSteps: generateAdjacencyMatrixSteps });

// ============================================================
// 邻接表存储
// ============================================================
const adjacencyListMeta: AlgorithmMeta = {
  id: 'adjacency-list', name: '邻接表存储', category: 'graph',
  difficulty: 'easy', timeComplexity: 'O(1)', spaceComplexity: 'O(V+E)',
  description: '每个节点维护一个链表存储其邻居及边权重，稀疏图比邻接矩阵更省空间。',
  templateCode: `// 邻接表: 数组[节点] → [{to, weight}, ...]
const adj = [
  [{to:1,w:4}, {to:2,w:1}],       // 节点0
  [{to:0,w:4}, {to:2,w:2}, {to:3,w:5}], // 节点1
  [{to:0,w:1}, {to:1,w:2}, {to:3,w:8}, {to:4,w:10}],
  [{to:1,w:5}, {to:2,w:8}, {to:4,w:2}],
  [{to:2,w:10}, {to:3,w:2}],
];`,
  visualizerType: 'linked-list', defaultData: [0, 1, 2, 3, 4],
};
function generateAdjacencyListSteps(data: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const lists = [[{ t: 1, w: 4 }, { t: 2, w: 1 }], [{ t: 0, w: 4 }, { t: 2, w: 2 }, { t: 3, w: 5 }], [{ t: 0, w: 1 }, { t: 1, w: 2 }, { t: 3, w: 8 }, { t: 4, w: 10 }], [{ t: 1, w: 5 }, { t: 2, w: 8 }, { t: 4, w: 2 }], [{ t: 2, w: 10 }, { t: 3, w: 2 }]];
  // Concatenate all chains into one flat array, separated by -1 markers
  const allFlat: number[] = [];
  for (const l of lists) { allFlat.push(...l.map(e => e.t), -1); }

  steps.push({ data: [0], activeIndices: [], markedIndices: [], actionType: 'highlight', description: '邻接表：5节点，每条链=该节点的邻居（如节点0→1→2）', highlightLines: [1] });
  for (let i = 0; i < lists.length; i++) {
    const flat: number[] = [];
    for (let j = 0; j <= i; j++) flat.push(...lists[j].map(e => e.t), -1);
    steps.push({ data: flat, activeIndices: [flat.length - lists[i].length - 1], markedIndices: [], actionType: 'highlight', description: `节点${i}邻居：[${lists[i].map(e => `${e.t}(${e.w})`).join(' → ')}]`, highlightLines: [1] });
  }
  steps.push({ data: allFlat, activeIndices: [], markedIndices: [], actionType: 'complete', description: '邻接表：5节点，共7条边。每组以-1分隔', highlightLines: [] });
  return steps;
}
registerAlgorithm({ meta: adjacencyListMeta, generateSteps: generateAdjacencyListSteps });

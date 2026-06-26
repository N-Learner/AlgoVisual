# AlgoVisual — 小组分工方案

> 项目：数据结构与算法可视化教学平台
> 技术栈：Electron + React + TypeScript + Tailwind + Framer Motion + Zustand
> 团队人数：5 人

---

## 成员 A：项目架构 & 核心框架负责人

### 负责模块

Electron 桌面端脚手架、TypeScript 类型系统、Zustand 全局状态机

### 具体工作

1. 搭建 Electron + Vite + React + TS + Tailwind 工程环境，配置 `tsconfig.json` / `tsconfig.node.json` / `vite.config.ts` / `tailwind.config.mjs` / `postcss.config.mjs` / `index.html` 及 `@/` 路径别名
2. 编写 `src/types/algo.ts` 核心类型接口，包含：
   - `AlgorithmCategory`（6 分类联合类型）
   - `Difficulty`（'easy' | 'medium' | 'hard'）
   - `ActionType`（complete / compare / swap / move / insert / delete / highlight / recurse-in / recurse-out / divide / merge / relax / visit / backtrack / rotate-left / rotate-right / fill-cell / traceback）
   - `VisualizerType`（array / linked-list / tree / graph / grid / array-dual / grid+table / array+buckets / timeline）
   - `PlayState`、`SpeedMultiplier`（0.25x / 0.5x / 1x / 2x / 4x）
   - `VisualStep`（含 data / activeIndices / markedIndices / actionType / description / highlightLines / graphEdges / gridData 等扩展字段）
   - `GraphEdgeHighlight`、`LogEntry`、`AlgorithmMeta`、`AlgorithmEntry`、`CategoryConfig`、`PointerInfo`、`DPCellUpdate` 等辅助类型
   - 常量导出：`CATEGORY_CONFIGS`、`DIFFICULTY_COLORS`、`SPEED_LABELS`、`SPEED_VALUES`
3. 设计并实现 `src/context/AlgoContext.tsx` Zustand 状态机，包含：
   - 状态字段：`selectedAlgorithm`、`categoryFilter`、`playState`、`speed`、`currentStep`、`steps`、`customData`、`useCustomData`、`logs`
   - Action：`selectAlgorithm`（切换算法 + 自动加载步骤）、`setCategoryFilter`、`play` / `pause` / `stepForward` / `stepBackward` / `reset`、`setSpeed`、`setCustomData`、`generateRandomData`、`loadAlgorithm`、`saveTestCase` / `loadTestCase`
   - `loadAlgorithm` 自动调用 `getAlgorithmById(id).generateSteps(data)` 并生成 `LogEntry[]`
4. 编写 `electron/main.ts` 主进程：BrowserWindow 创建、M1 macOS 适配（`hiddenInset` 标题栏、`arm64` 架构）、安全策略（`contextIsolation: true`、`sandbox: true`）、外部链接 `shell.openExternal` 处理
5. 配置 `package.json`：scripts（dev / build / preview / electron:dev / electron:build / electron:build:mac）、electron-builder 字段（appId / productName / mac arm64 dmg+zip target / hardenedRuntime / dmg 布局）
6. 编写 `src/main.tsx`、`src/App.tsx` 入口文件，注册算法模块
7. 编写 `src/index.css`：Tailwind 指令 + IDE 暗色主题基础样式 + 代码高亮 token 颜色类 + 滚动条样式 + 动画 reduced-motion 适配

### 完成边界

- 项目脚手架完整可运行（`npm run dev` 启动 Vite 开发服务器）
- TypeScript `tsc --noEmit` 零类型错误
- Vite `npm run build` 生产构建通过
- 所有类型接口文档化（JSDoc 注释）
- 状态机每个 action 逻辑正确，可独立验证

---

## 成员 B：算法引擎负责人

### 负责模块

算法注册表架构、全部 55 个算法的 Step 生成器实现、算法模板代码

### 具体工作

1. 设计并实现 `src/algorithms/registry.ts` 算法注册系统：
   - `registerAlgorithm(entry: AlgorithmEntry): void` — 算法注册函数
   - `getAlgorithmById(id: string): AlgorithmEntry | undefined` — 按 ID 查询
   - `getAllAlgorithms(): AlgorithmEntry[]` — 获取全部算法
   - `getAlgorithmsByCategory(category: string): AlgorithmEntry[]` — 按分类筛选
2. 实现线性表类算法（6 个）的 `generateSteps` 函数：
   - 顺序表插入、顺序表删除、顺序表查找
   - 单链表建立（头插法）、单链表建立（尾插法）、单链表删除节点
3. 实现栈和队列类算法（6 个）的 `generateSteps` 函数：
   - 顺序栈入栈/出栈、链栈操作
   - 循环队列入队/出队、链队列操作
   - 栈在括号匹配中的应用、中缀表达式转后缀
4. 实现树与二叉树类算法（10 个）的 `generateSteps` 函数：
   - 前序/中序/后序遍历（递归）、层序遍历（BFS）
   - 二叉搜索树插入、查找、删除（叶子/单子/双子三种情况）
   - 堆的构建（自底向上）、堆排序、哈夫曼树构建
5. 实现图结构类算法（8 个）的 `generateSteps` 函数：
   - 邻接矩阵存储、邻接表存储
   - BFS 广度优先搜索、DFS 深度优先搜索
   - Dijkstra 最短路径、Floyd-Warshall 全源最短路径
   - Prim 最小生成树、Kruskal 最小生成树
6. 实现排序算法（10 个）的 `generateSteps` 函数：
   - 冒泡排序、选择排序、插入排序、快速排序
   - 归并排序、希尔排序、计数排序、基数排序、桶排序、堆排序
7. 实现查找算法（5 个）的 `generateSteps` 函数：
   - 顺序查找、二分查找、插值查找、斐波那契查找、BST 查找
8. 实现高级算法专题（10 个）的 `generateSteps` 函数：
   - DFS 迷宫生成（递归回溯）、BFS 迷宫求解（最短路径）、DFS 迷宫求解
   - Flood Fill 泛洪填充、A* 寻路算法
   - 动态规划：背包 0/1、最长公共子序列（LCS）、最短编辑距离
   - 贪心：活动选择、回溯：N 皇后
9. 为每个算法编写 `templateCode`（TypeScript 语法的完整实现代码，用于右侧代码面板展示）
10. 为每个算法定义 `AlgorithmMeta`（id / name / category / difficulty / timeComplexity / spaceComplexity / description / visualizerType / defaultData）

### 完成边界

- 每个算法的 `generateSteps` 函数输出完整 `VisualStep[]` 序列
- 每一步必须包含：`data`（当前数据状态）、`activeIndices`（操作中的索引）、`markedIndices`（已确定的索引）、`actionType`（操作类型）、`description`（中文步骤描述）、`highlightLines`（对应代码行号）
- 步骤描述使用中文，准确反映当前操作
- 边界情况处理：空数据、单元素、已有序、全逆序、重复元素

---

## 成员 C：可视化引擎负责人

### 负责模块

Canvas 编排器、全部 Visualizer 组件、Framer Motion 动画系统

### 具体工作

1. 编写 `src/components/Canvas.tsx` 编排器：
   - 根据 `selectedAlgorithm.visualizerType` 动态分发渲染对应 Visualizer 组件
   - 无算法选中时的空状态引导页
   - 步骤信息浮层（当前步数 / 总步数 / actionType）
2. 实现 `ArrayVisualizer.tsx`：
   - 柱状图渲染：固定容器高度（320px），像素级比例计算（`barH = value / maxValue × 280`），最小 6px 可见
   - 颜色状态：默认蓝 → 比较黄(#f9e2af) → 交换红(#f38ba8) → 移动蓝(#89b4fa) → 插入绿(#a6e3a1) → 标记绿(#74c7a8)
   - 按 ActionType 差异化动效：compare 脉冲缩放+发光、swap 跳跃曲线(y: [0,-32,0])+🔄浮动、move 平滑滑动(layout spring)、insert 0→原高生长(spring)、complete 全绿脉冲
   - 动态柱宽计算：根据元素数量自适应 28px–70px
   - 数值标签（柱顶）+ 索引标签（柱底）
3. 实现 `LinkedListVisualizer.tsx`：
   - SVG 绘制节点矩形框 + 箭头连线 + null 终止符
   - head 指针虚线指示
   - active/marked 节点颜色状态切换
   - 节点入场动画（逐个 spring 弹出，延迟 stagger）
4. 实现 `TreeVisualizer.tsx`：
   - 完全二叉树层次布局算法（level = floor(log2(i+1)) 自动计算 x/y 坐标）
   - SVG 连线父子节点（line）
   - 节点圆圈 + 数值 + 索引标签
   - active 节点放大 + 黄色高亮，marked 节点绿色
5. 实现 `GraphVisualizer.tsx`：
   - 五边形节点布局 + 边权重圆角 badge
   - 松弛边高亮动画（变粗 + 发光滤镜 + 颜色切换）
   - 当前节点旋转虚线环指示器
   - 节点显示标签（A/B/C/D/E）+ 距离值（∞/数值）
   - 图例（松弛中/已确定/未访问）+ 步骤描述浮层
6. 实现 `GridVisualizer.tsx`：
   - 二维网格渲染，支持单元格颜色状态（墙/通路/起点/终点/已访问/当前路径）
   - 迷宫生成/求解的墙变幻动画
   - Flood Fill 颜色波纹扩散
   - A* 的 g/h/f 值显示（可选）
7. 实现 `DPTableVisualizer.tsx`：
   - 二维 DP 表格渲染
   - 单元格逐格填充背景色动画（左→右渐变）
   - 回溯路径箭头 SVG 叠加
   - 行列标签（序列字符）
8. 统一动画参数配置（spring stiffness/damping/mass、duration、easing），适配 0.25x–4x 五档播放速度

### 完成边界

- 所有 Visualizer 组件独立可渲染
- Framer Motion 动画无卡顿、无 jank
- 每种 ActionType 有明确差异化视觉反馈
- 各 Visualizer 正确响应 step 数据的 activeIndices / markedIndices

---

## 成员 D：IDE 交互界面 & 教学功能负责人

### 负责模块

三栏 IDE 布局、侧边栏、控制条、代码面板、日志面板、数据控制台

### 具体工作

1. 编写 `src/components/Layout.tsx`：
   - 完整三栏 IDE 布局：260px 侧边栏 + 弹性画布 + 420px 右侧面板（代码面板 + 日志面板上下分割）
   - 顶部 ControlBar（48px）+ 底部 DataControl（40px）
   - Flex 弹性布局 + overflow 控制，确保窗口缩放时无布局错乱
2. 实现 `src/components/Sidebar.tsx`：
   - 6 大分类菜单（📋线性表 / 📚栈和队列 / 🌳树与二叉树 / 🕸️图结构 / 🔢排序算法 / 🔍查找算法）
   - 分类筛选：顶部"全部"按钮 + 6 个分类 toggle，Framer Motion AnimatePresence 切换动画
   - 每个算法条目显示：算法名 + 难度标签（低/中/高，绿/黄/红底）+ 时间复杂度 + 空间复杂度
   - 选中状态：蓝色高亮边框 + 背景色
   - 从 `getAllAlgorithms()` 自动读取算法列表，无需手动维护
3. 实现 `src/components/ControlBar.tsx`：
   - 播放控制按钮组：⏮上一步 / ▶⏸播放暂停 / ⏭下一步 / ⟲重置
   - 速度档位切换（0.5x / 1x / 2x），当前选中蓝色高亮
   - 步骤进度条：motion.div 动画宽度百分比
   - 当前算法信息展示（算法名 + 时间复杂度 badge）
   - 键盘快捷键绑定：Space（播放/暂停）、←（上一步）、→（下一步）、R（重置），输入框焦点时禁用
   - setInterval 自动播放引擎：根据 speed 调节间隔（2000ms / 1000ms / 500ms），到达末尾自动 completed
   - 完成状态显示 "✓ 完成" 绿色标签
4. 实现 `src/components/CodePanel.tsx`：
   - TypeScript 语法高亮词法分析器 `tokenizeLine` 函数：
     - 识别 8 类 token：keyword / function / string / number / comment / operator / variable / type / punctuation
     - 关键字集合（function/const/let/var/return/if/else/for/while/class/new/this/null/undefined/true/false）
     - 支持单引号/双引号/模板字符串、单行注释(//)和块注释(/* */)
   - 行号显示（等宽右对齐）+ token 着色渲染
   - 当前执行行高亮：`highlight-line` 类（蓝色左边框 + 半透明背景）
   - sticky 文件名标签栏（算法 ID + 时间复杂度）
   - 空状态引导提示
5. 实现 `src/components/LogPanel.tsx`：
   - 上半区"当前步骤解析"：actionType 彩色标签 + 中文描述 + 数据快照（`[a, b, c]` 格式）
   - 下半区"执行历史"：可滚动列表，每条记录显示 `[步号]` actionType标签 描述文字
   - 自动滚动到当前步骤（`scrollIntoView({ block: 'nearest', behavior: 'smooth' })`）
   - AnimatePresence 条目滑入动画
   - 当前步骤条目蓝色左边框 + 背景高亮
6. 实现 `src/components/DataControl.tsx`：
   - 🎲 随机生成按钮：`generateRandomData(size=8)`，范围 1–99
   - 📝 自定义输入框：逗号/空格/中文逗号分隔解析，Enter 键确认，"应用"按钮
   - 💾 保存用例：`saveTestCase()` 存入 localStorage
   - 已存用例下拉选择器：按算法 ID 分组，选中即加载
   - 当前数据预览（截断显示）

### 完成边界

- 完整 IDE 交互闭环：左侧选算法 → 画布自动渲染 → 代码面板同步高亮行 → 日志面板同步更新步骤解析+历史 → 底部可自定义/随机/保存数据
- 键盘快捷键全部可用
- 语法高亮覆盖所有算法模板代码
- 无 UI 状态遗漏或死循环

---

## 成员 E：测试、文档 & 工程质量负责人

### 负责模块

需求分析文档、算法正确性验证、测试用例库、Electron 打包与发布

### 具体工作

1. 编写《AlgoVisual 需求分析文档》（`REQUIREMENTS.md`）：
   - 产品定位与目标用户画像
   - 55 个算法全景图（7 大类，每类含详细表格：名称/难度/时间复杂度/可视化类型/VisualStep 要点）
   - Visualizer 类型矩阵（9 种可视化类型）
   - VisualStep 接口升级方案（核心字段 + 9 个扩展字段）
   - ActionType 扩展定义（18 种操作类型）
   - 动画引擎分层时间线设计（Canvas/CodePanel/LogPanel 三路同步）
   - 按 ActionType 的差异化动效表（11 种动效参数）
   - 播放速度系统（5 档，基准延迟映射）
   - 代码面板/日志面板功能清单
   - 数据管理与测试系统升级方案
   - 5 阶段功能路线图（Phase 1–5）
   - 技术架构关键决策（Zustand / Framer Motion / 算法注册模式 / 可视化类型分发）
   - 附录：教学大纲对照表
2. 编写《小组分工方案》（`TEAM_DIVISION.md`）：
   - 5 位成员各自的负责模块、具体工作、完成边界
   - 分工边界对照表（核心文件产出 vs 不涉及模块）
3. 为每个算法编写预设经典测试用例：
   - 正常数据用例：随机数组、升序数组、降序数组
   - 边界数据用例：单元素、两元素、空数组
   - 特殊场景用例：全重复值、部分重复、算法特定最坏情况（冒泡全逆序、二分边界命中、Dijkstra 不连通图）
4. 执行全量算法步骤验证：
   - 逐算法播放并核对每一步的 `data` / `activeIndices` / `markedIndices` / `actionType` 正确性
   - 验证代码高亮行号 `highlightLines` 与 `templateCode` 行号对应
   - 验证播放流程：idle → playing → paused → completed 状态转换正确
5. 执行 Electron 桌面端生产构建：
   - `npm run build`（Vite 生产构建）
   - `tsc -p tsconfig.node.json`（Electron 主进程编译）
   - `electron-builder --mac`（输出 M1 Mac arm64 .dmg + .zip）
6. 整理项目交付文档：
   - 项目目录结构说明
   - 启动方式说明（`npm run dev` / `npm run electron:dev` / `npm run electron:build:mac`）
   - 技术栈版本清单
7. 工程质量门禁：
   - 确认 `tsc --noEmit` 零类型错误
   - 确认 `npm run build` 生产构建通过
   - 确认 Electron 打包后 .app 可正常启动

### 完成边界

- 提交完整的需求分析文档（REQUIREMENTS.md）+ 分工方案文档（TEAM_DIVISION.md）
- 提交测试用例清单（每个算法 ≥ 3 个用例）
- 产出可运行的 M1 Mac .dmg 安装包
- 全项目 TypeScript 零报错，Vite 构建通过

---

## 分工边界对照表

| 成员 | 核心文件产出 | 不涉及的模块 |
|------|-------------|-------------|
| A | `package.json`、`tsconfig.json`、`tsconfig.node.json`、`vite.config.ts`、`tailwind.config.mjs`、`postcss.config.mjs`、`index.html`、`electron/main.ts`、`src/types/algo.ts`、`src/context/AlgoContext.tsx`、`src/main.tsx`、`src/App.tsx`、`src/index.css` | 不写算法逻辑、不写可视化组件、不写 UI 布局组件 |
| B | `src/algorithms/registry.ts`（全部 55 个算法的 `AlgorithmMeta` + `generateSteps` + `templateCode` + `registerAlgorithm` 调用） | 不写界面组件、不写动画、不写状态管理、不写类型定义 |
| C | `src/components/Canvas.tsx`、`src/components/visualizers/ArrayVisualizer.tsx`、`LinkedListVisualizer.tsx`、`TreeVisualizer.tsx`、`GraphVisualizer.tsx`、`GridVisualizer.tsx`、`DPTableVisualizer.tsx` | 不写算法步骤生成逻辑、不写 IDE 布局组件、不写数据管理 |
| D | `src/components/Layout.tsx`、`Sidebar.tsx`、`ControlBar.tsx`、`CodePanel.tsx`、`LogPanel.tsx`、`DataControl.tsx` | 不写算法逻辑、不写可视化渲染组件、不写类型定义 |
| E | `REQUIREMENTS.md`、`TEAM_DIVISION.md`、测试用例集、Electron 打包验证、项目文档 | 不写核心代码（但负责全量验证所有成员产出质量） |

---

## 注意事项

1. **分工方案一经提交不可修改**，系统留存作为课程评分重要依据
2. **分工内容直接关联个人最终成绩**，指导教师将根据分工核查对应成员的完成主体与质量匹配度
3. **所有描述均已详实具体**，明确标注负责模块、工作内容与完成边界，无模糊表述
4. 团队成员应在提交前充分沟通、确认分工细节

# AlgoVisual — 数据结构与算法可视化平台

> 版本: 1.0 | 语言: TypeScript 5.x | 编译器: tsc/Vite | 运行环境: Node 18+

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式（浏览器）
npm run dev
# 打开 http://localhost:5173

# 生产构建
npm run build

# Electron 桌面开发
npm run electron:dev

# 打包 Mac 应用
npm run electron:build:mac

# 打包 Windows 应用
npm run build && npx tsc -p tsconfig.node.json && npx electron-builder --win
```

## 项目结构

```
src/
├── types/algo.ts              # 核心类型：16种ActionType, 8种VisualizerType
├── context/AlgoContext.tsx     # Zustand全局状态机
├── algorithms/registry.ts     # 55个算法的步骤生成器
├── components/
│   ├── Layout.tsx              # 三栏IDE布局
│   ├── Sidebar.tsx             # 算法目录
│   ├── ControlBar.tsx          # 播放控制
│   ├── Canvas.tsx              # 可视化分发器
│   ├── CodePanel.tsx           # 代码语法高亮
│   ├── LogPanel.tsx            # 步骤日志
│   ├── DataControl.tsx         # 数据管理
│   └── visualizers/
│       ├── ArrayVisualizer.tsx
│       ├── LinkedListVisualizer.tsx
│       ├── TreeVisualizer.tsx
│       ├── GraphVisualizer.tsx
│       └── GridVisualizer.tsx
electron/main.ts                # Electron主进程
```

## 技术栈

React 18 · TypeScript 5 · Vite 5 · Tailwind CSS 3 · Zustand 4 · Framer Motion 11 · Electron 30

## 功能

- 55个算法 × 7大分类（线性表/栈队列/树/图/排序/查找/高级）
- 5种可视化（数组柱状图/链表/树/图/网格）
- 播放控制（Space/←/→/R）+ 5档速度
- 自定义数据输入 + 随机生成
- 代码面板语法高亮 + 行高亮同步
- 日志面板步骤解析 + 执行历史
- 图结构用户自定义边输入
- Electron桌面打包（macOS/Windows）

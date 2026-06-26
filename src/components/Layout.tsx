import Sidebar from './Sidebar';
import Canvas from './Canvas';
import CodePanel from './CodePanel';
import LogPanel from './LogPanel';
import ControlBar from './ControlBar';
import DataControl from './DataControl';

/**
 * Full IDE-like layout:
 *
 * ┌──────────────────────────────────────────────────────┐
 * │ ControlBar (top)                                     │
 * ├────────┬──────────────────────┬──────────────────────┤
 * │ Sidebar│     Canvas           │   Right Panel        │
 * │(260px) │     (flex-1)         │   ├─ CodePanel       │
 * │        │                      │   └─ LogPanel        │
 * ├────────┴──────────────────────┴──────────────────────┤
 * │ DataControl (bottom)                                 │
 * └──────────────────────────────────────────────────────┘
 */
export default function Layout() {
  return (
    <div className="h-full w-full flex flex-col overflow-hidden bg-ide-bg">
      {/* Top: Control Bar */}
      <ControlBar />

      {/* Middle: Three-column workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Algorithm Hub Sidebar */}
        <Sidebar />

        {/* Center: Visualization Canvas */}
        <Canvas />

        {/* Right: Code + Log Panel (stacked vertically) */}
        <aside className="w-[420px] min-w-[360px] h-full bg-ide-panel border-l border-ide-border flex flex-col overflow-hidden">
          {/* Code Panel (upper half) */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <CodePanel />
          </div>

          {/* Log Panel (lower half) */}
          <div className="h-[45%] min-h-[200px] overflow-hidden flex flex-col">
            <LogPanel />
          </div>
        </aside>
      </div>

      {/* Bottom: Data Management Control */}
      <DataControl />
    </div>
  );
}

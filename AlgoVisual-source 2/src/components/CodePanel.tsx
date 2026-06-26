import { useMemo } from 'react';
import { useAlgoStore } from '@/context/AlgoContext';

interface Token {
  text: string;
  type: 'keyword' | 'function' | 'string' | 'number' | 'comment' | 'operator' | 'variable' | 'type' | 'punctuation' | 'plain';
}

const KEYWORDS = new Set([
  'function', 'const', 'let', 'var', 'return', 'if', 'else',
  'for', 'while', 'do', 'break', 'continue', 'new', 'class',
  'constructor', 'this', 'true', 'false', 'null', 'undefined',
  'void', 'number', 'string', 'boolean', 'Array',
]);

function tokenizeLine(line: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < line.length) {
    // Whitespace
    if (line[i] === ' ' || line[i] === '\t') {
      let ws = '';
      while (i < line.length && (line[i] === ' ' || line[i] === '\t')) {
        ws += line[i];
        i++;
      }
      tokens.push({ text: ws, type: 'plain' });
      continue;
    }

    // Single-line comment
    if (line[i] === '/' && line[i + 1] === '/') {
      tokens.push({ text: line.slice(i), type: 'comment' });
      break;
    }

    // Block comment start
    if (line[i] === '/' && line[i + 1] === '*') {
      const end = line.indexOf('*/', i + 2);
      if (end !== -1) {
        tokens.push({ text: line.slice(i, end + 2), type: 'comment' });
        i = end + 2;
      } else {
        tokens.push({ text: line.slice(i), type: 'comment' });
        break;
      }
      continue;
    }

    // String (single or double quote)
    if (line[i] === '"' || line[i] === "'" || line[i] === '`') {
      const quote = line[i];
      let str = quote;
      i++;
      while (i < line.length && line[i] !== quote) {
        if (line[i] === '\\') {
          str += line[i];
          i++;
          if (i < line.length) str += line[i];
        } else {
          str += line[i];
        }
        i++;
      }
      if (i < line.length) {
        str += line[i];
        i++;
      }
      tokens.push({ text: str, type: 'string' });
      continue;
    }

    // Numbers
    if (/[0-9]/.test(line[i])) {
      let num = '';
      while (i < line.length && /[0-9.]/.test(line[i])) {
        num += line[i];
        i++;
      }
      tokens.push({ text: num, type: 'number' });
      continue;
    }

    // Operators
    if (/[+\-*/%=<>!&|^~?:]/.test(line[i])) {
      let op = line[i];
      i++;
      // Multi-char operators
      if (i < line.length && /[=>&|]/.test(line[i]) && op !== ':' && op !== '?') {
        op += line[i];
        i++;
      }
      tokens.push({ text: op, type: 'operator' });
      continue;
    }

    // Punctuation
    if (/[{}()\[\];,.]/.test(line[i])) {
      tokens.push({ text: line[i], type: 'punctuation' });
      i++;
      continue;
    }

    // Identifiers / keywords
    if (/[a-zA-Z_$]/.test(line[i])) {
      let ident = '';
      while (i < line.length && /[a-zA-Z0-9_$]/.test(line[i])) {
        ident += line[i];
        i++;
      }
      const type: Token['type'] = KEYWORDS.has(ident)
        ? 'keyword'
        : ident[0] === ident[0].toUpperCase()
          ? 'type'
          : 'variable';
      tokens.push({ text: ident, type });
      continue;
    }

    // Fallback
    tokens.push({ text: line[i], type: 'plain' });
    i++;
  }

  return tokens;
}

const TOKEN_COLORS: Record<Token['type'], string> = {
  keyword: 'text-[#cba6f7]',
  function: 'text-[#89b4fa]',
  string: 'text-[#a6e3a1]',
  number: 'text-[#fab387]',
  comment: 'text-[#6c7086] italic',
  operator: 'text-[#89dceb]',
  variable: 'text-[#cdd6f4]',
  type: 'text-[#f9e2af]',
  punctuation: 'text-[#9399b2]',
  plain: 'text-[#cdd6f4]',
};

function HighlightedLine({
  line,
  lineNumber,
  isHighlighted,
}: {
  line: string;
  lineNumber: number;
  isHighlighted: boolean;
}) {
  const tokens = useMemo(() => tokenizeLine(line), [line]);

  return (
    <div
      className={`flex text-[12px] leading-6 font-mono ${
        isHighlighted ? 'highlight-line' : ''
      }`}
    >
      <span className="w-8 text-right pr-3 text-ide-text-muted/40 select-none shrink-0">
        {lineNumber}
      </span>
      <span className="whitespace-pre">
        {tokens.map((t, i) => (
          <span key={i} className={TOKEN_COLORS[t.type]}>
            {t.text}
          </span>
        ))}
      </span>
    </div>
  );
}

export default function CodePanel() {
  const selectedAlgorithm = useAlgoStore((s) => s.selectedAlgorithm);
  const currentStep = useAlgoStore((s) => s.currentStep);
  const steps = useAlgoStore((s) => s.steps);

  const highlightLines = steps[currentStep]?.highlightLines ?? [];

  if (!selectedAlgorithm) {
    return (
      <div className="flex-1 flex items-center justify-center text-ide-text-muted text-sm p-4">
        <div className="text-center">
          <div className="text-4xl mb-3">📝</div>
          <p>选择算法后查看源码</p>
        </div>
      </div>
    );
  }

  const lines = selectedAlgorithm.templateCode.split('\n');

  return (
    <div className="flex-1 overflow-auto bg-ide-panel">
      <div className="sticky top-0 z-10 bg-ide-panel border-b border-ide-border px-3 py-1.5">
        <span className="text-[10px] font-mono text-ide-text-muted uppercase tracking-wider">
          📄 {selectedAlgorithm.id}.ts
        </span>
        <span className="text-[10px] font-mono text-ide-accent ml-2">
          {selectedAlgorithm.timeComplexity}
        </span>
      </div>
      <div className="py-2">
        {lines.map((line, i) => (
          <HighlightedLine
            key={i}
            line={line}
            lineNumber={i + 1}
            isHighlighted={highlightLines.includes(i + 1)}
          />
        ))}
      </div>
    </div>
  );
}

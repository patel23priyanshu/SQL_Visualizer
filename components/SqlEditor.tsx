"use client";

import Editor from "@monaco-editor/react";
import { format } from "sql-formatter";
import { Copy, Trash2, Wand2, Play } from "lucide-react";
import { motion } from "framer-motion";

interface SqlEditorProps {
  value: string;
  onChange: (value: string) => void;
  onVisualize: () => void;
}

export default function SqlEditor({ value, onChange, onVisualize }: SqlEditorProps) {
  const handleFormat = () => {
    try {
      onChange(format(value, { language: "postgresql", keywordCase: "upper" }));
    } catch {
      // if formatting fails (invalid syntax), leave the text as-is
    }
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(value);
  };

  const handleClear = () => onChange("");

  return (
    <div className="hk-panel overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-base-600">
        <div className="flex items-center gap-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-lime/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-lime/30" />
          <span className="h-2.5 w-2.5 rounded-full bg-lime/15" />
          <span className="ml-3 text-xs text-muted font-mono uppercase tracking-wider">[QUERY.SQL]</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleFormat}
            className="p-2 rounded-sm hover:bg-lime/10 text-muted hover:text-lime transition-colors"
            title="Format query"
          >
            <Wand2 size={15} />
          </button>
          <button
            onClick={handleCopy}
            className="p-2 rounded-sm hover:bg-lime/10 text-muted hover:text-lime transition-colors"
            title="Copy"
          >
            <Copy size={15} />
          </button>
          <button
            onClick={handleClear}
            className="p-2 rounded-sm hover:bg-lime/10 text-muted hover:text-red-400 transition-colors"
            title="Clear"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <Editor
        height="280px"
        defaultLanguage="sql"
        theme="vs-dark"
        value={value}
        onChange={(v) => onChange(v ?? "")}
        options={{
          fontSize: 14,
          fontFamily: "JetBrains Mono, ui-monospace, monospace",
          minimap: { enabled: false },
          padding: { top: 16, bottom: 16 },
          scrollBeyondLastLine: false,
          lineNumbersMinChars: 3,
          renderLineHighlight: "gutter",
          smoothScrolling: true,
          cursorBlinking: "smooth",
        }}
      />

      <div className="flex justify-end px-4 py-3 border-t border-base-600">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onVisualize}
          disabled={!value.trim()}
          className="btn-primary flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Play size={16} />
          Visualize Query
        </motion.button>
      </div>
    </div>
  );
}

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
  const handleEditorWillMount = (monaco: any) => {
    monaco.editor.defineTheme("custom-palette-theme", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword",    foreground: "EF233C", fontStyle: "bold" },
        { token: "string",     foreground: "8D99AE" },
        { token: "number",     foreground: "EDF2F4" },
        { token: "comment",    foreground: "6e7b91", fontStyle: "italic" },
        { token: "operator",   foreground: "cdd6de" },
        { token: "identifier", foreground: "EDF2F4" },
      ],
      colors: {
        "editor.background":              "#00000000",
        "editor.foreground":              "#EDF2F4",
        "editorCursor.foreground":        "#EF233C",
        "editor.lineHighlightBackground": "#2B2D4233",
        "editorLineNumber.foreground":    "#4f5b70aa",
        "editorLineNumber.activeForeground": "#EF233C",
        "editor.selectionBackground":     "#2B2D4288",
      },
    });
  };

  const handleFormat = () => {
    try {
      onChange(format(value, { language: "postgresql", keywordCase: "upper" }));
    } catch {
      // leave text as-is on syntax errors
    }
  };

  const handleCopy = () => { navigator.clipboard?.writeText(value); };
  const handleClear = () => onChange("");

  return (
    <div className="glass-panel overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-brandRed-500 shadow-sm shadow-brandRed-500/50" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-100" />
          <span className="ml-3 text-xs text-slate-300 font-mono">query.sql</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={handleFormat} className="p-2 rounded-lg hover:bg-slate-800/60 text-slate-300 hover:text-palette-white transition-colors" title="Format query">
            <Wand2 size={15} />
          </button>
          <button onClick={handleCopy} className="p-2 rounded-lg hover:bg-slate-800/60 text-slate-300 hover:text-palette-white transition-colors" title="Copy">
            <Copy size={15} />
          </button>
          <button onClick={handleClear} className="p-2 rounded-lg hover:bg-slate-800/60 text-slate-300 hover:text-palette-white transition-colors" title="Clear">
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <Editor
        height="280px"
        defaultLanguage="sql"
        theme="custom-palette-theme"
        beforeMount={handleEditorWillMount}
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

      <div className="flex justify-end px-4 py-3 border-t border-slate-700/50">
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

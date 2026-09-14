"use client";

import { motion } from "framer-motion";
import type { AnalysisResult } from "@/lib/executionOrder";
import { cn } from "@/lib/utils";

const difficultyColor: Record<AnalysisResult["difficulty"], string> = {
  Beginner:     "text-slate-200 border-slate-600/50 bg-slate-800/70 backdrop-blur-md",
  Intermediate: "text-palette-white border-slate-500/60 bg-slate-700/60 backdrop-blur-md",
  Advanced:     "text-brandRed-400 border-brandRed-700/50 bg-brandRed-950/50 backdrop-blur-md",
  Expert:       "text-palette-white border-brandRed-500/60 bg-gradient-to-r from-brandRed-500/30 to-brandRed-600/30 backdrop-blur-md",
};

export default function AnalysisPanel({ analysis }: { analysis: AnalysisResult }) {
  const stats: { label: string; value: number | string }[] = [
    { label: "Joins",        value: analysis.joinCount },
    { label: "Subqueries",   value: analysis.subqueryCount },
    { label: "CTEs",         value: analysis.cteCount },
    { label: "Aggregates",   value: analysis.aggregateCount },
    { label: "Window fns",   value: analysis.windowFunctionCount },
    { label: "Complexity",   value: analysis.estimatedComplexity },
  ];

  return (
    <div className="glass-panel p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-100">Query Analysis</h3>
        <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full border", difficultyColor[analysis.difficulty])}>
          {analysis.difficulty}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="glass-card p-3 text-center">
            <div className="text-lg font-semibold text-palette-white font-mono">{s.value}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div>
        <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-mono">
          <span>Readability</span>
          <span className="text-brandRed-400 font-semibold">{analysis.readabilityScore}/100</span>
        </div>
        <div className="h-2 rounded-full bg-slate-800/80 backdrop-blur-md overflow-hidden border border-slate-700/50">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${analysis.readabilityScore}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-brandRed-600 via-brandRed-500 to-slate-200"
          />
        </div>
      </div>
    </div>
  );
}

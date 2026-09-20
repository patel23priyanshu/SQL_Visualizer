"use client";

import { motion } from "framer-motion";
import type { AnalysisResult } from "@/lib/executionOrder";
import { cn } from "@/lib/utils";

const difficultyColor: Record<AnalysisResult["difficulty"], string> = {
  Beginner: "text-lime border-lime/30 bg-lime/10",
  Intermediate: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
  Advanced: "text-orange-400 border-orange-400/30 bg-orange-400/10",
  Expert: "text-red-400 border-red-400/30 bg-red-400/10",
};

export default function AnalysisPanel({ analysis }: { analysis: AnalysisResult }) {
  const stats: { label: string; value: number | string }[] = [
    { label: "Joins", value: analysis.joinCount },
    { label: "Subqueries", value: analysis.subqueryCount },
    { label: "CTEs", value: analysis.cteCount },
    { label: "Aggregates", value: analysis.aggregateCount },
    { label: "Window fns", value: analysis.windowFunctionCount },
    { label: "Complexity", value: analysis.estimatedComplexity },
  ];

  return (
    <div className="hk-panel p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">// Query Analysis //</h3>
        <span
          className={cn(
            "text-xs font-medium px-2.5 py-1 rounded-sm border font-mono uppercase",
            difficultyColor[analysis.difficulty]
          )}
        >
          {analysis.difficulty}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="hk-card p-3 text-center">
            <div className="text-lg font-semibold text-white font-mono">{s.value}</div>
            <div className="text-[11px] text-muted mt-0.5 font-mono uppercase tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>

      <div>
        <div className="flex justify-between text-xs text-muted font-mono uppercase tracking-wider mb-1.5">
          <span>Readability</span>
          <span>{analysis.readabilityScore}/100</span>
        </div>
        <div className="h-2 rounded-sm bg-base-700 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${analysis.readabilityScore}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="h-full rounded-sm"
            style={{ background: "linear-gradient(to right, #a8d600, #C8FF00)" }}
          />
        </div>
      </div>
    </div>
  );
}

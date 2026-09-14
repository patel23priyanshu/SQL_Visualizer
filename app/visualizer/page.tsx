"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import DataFlowVisualizer from "@/components/DataFlowVisualizer";
import { Table, Sparkles } from "lucide-react";

function VisualizerContent() {
  const searchParams = useSearchParams();
  const sqlParam = searchParams.get("sql") || undefined;
  return <DataFlowVisualizer initialSql={sqlParam} />;
}

export default function VisualizerPage() {
  return (
    <main className="min-h-screen pb-20 max-w-7xl mx-auto px-6 pt-6 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-700/50 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-medium text-palette-white bg-slate-800/80 border border-brandRed-500/40 rounded-full px-3 py-1 mb-2">
            <Sparkles size={12} className="text-brandRed-500" />
            Interactive Row-Level Data Flow Engine
          </div>
          <h1 className="text-3xl font-bold text-slate-50 tracking-tight flex items-center gap-3">
            <div className="p-1 rounded-lg bg-brandRed-500/20 text-brandRed-500">
              <Table size={26} />
            </div>
            Data Flow Visualizer
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Write any SQL query — watch it transform the sample data (10 rows × 5 columns) clause-by-clause with animated row filtering, grouping, and window function rankings.
          </p>
        </div>
      </div>

      <Suspense fallback={<div className="glass-panel p-8 text-center text-slate-300">Loading visualizer...</div>}>
        <VisualizerContent />
      </Suspense>
    </main>
  );
}

"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import DataFlowVisualizer from "@/components/DataFlowVisualizer";
import { Table } from "lucide-react";

function VisualizerContent() {
  const searchParams = useSearchParams();
  const sqlParam = searchParams.get("sql") || undefined;
  return <DataFlowVisualizer initialSql={sqlParam} />;
}

export default function VisualizerPage() {
  return (
    <main className="min-h-screen pb-20 max-w-7xl mx-auto px-6 pt-6 space-y-6">
      <div className="flex items-center justify-between border-b border-base-600 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-lime bg-lime/10 border border-lime/30 rounded-sm px-3 py-1 mb-2 uppercase tracking-widest">
            <span className="text-lime">■</span>
            Interactive Row-Level Data Flow Engine
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3 font-mono uppercase">
            <Table size={24} className="text-lime" />
            // Data Flow Visualizer //
          </h1>
          <p className="text-sm text-muted mt-1 font-mono">
            Watch queries transform predefined sample data (10 rows &times; 5 columns) clause-by-clause with animated row filtering, grouping, and directional flow arrows.
          </p>
        </div>
      </div>

      <Suspense fallback={<div className="hk-panel p-8 text-center text-muted font-mono uppercase tracking-wider">// Loading visualizer... //</div>}>
        <VisualizerContent />
      </Suspense>
    </main>
  );
}

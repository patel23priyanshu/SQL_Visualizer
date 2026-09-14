"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import SqlEditor from "@/components/SqlEditor";
import ExecutionVisualizer from "@/components/ExecutionVisualizer";
import QueryExplainer from "@/components/QueryExplainer";
import AnalysisPanel from "@/components/AnalysisPanel";
import QueryTree from "@/components/QueryTree";
import { parseQuery } from "@/lib/executionOrder";
import { exampleQueries } from "@/lib/examples";

export default function PlaygroundPage() {
  const [sql, setSql] = useState(exampleQueries[1].sql);
  const display = useMemo(() => parseQuery(sql), [sql]);

  return (
    <main className="min-h-screen pb-20">
      <nav className="flex items-center justify-between max-w-7xl mx-auto px-6 py-6">
        <Link href="/" className="flex items-center gap-2 text-sm text-slate-300 hover:text-palette-white transition-colors font-mono">
          <ArrowLeft size={15} className="text-brandRed-500" /> Back
        </Link>
        <span className="font-semibold text-slate-50 tracking-tight">
          SQL<span className="gradient-text">Visualizer</span>
        </span>
        <div className="w-16" />
      </nav>

      <div className="max-w-7xl mx-auto px-6">
        {/* Example query chips */}
        <div className="flex flex-wrap gap-2 mb-5">
          {exampleQueries.map((ex) => (
            <button
              key={ex.title}
              onClick={() => setSql(ex.sql)}
              className="text-xs px-3 py-1.5 rounded-full glass-card text-slate-300 hover:text-palette-white hover:border-brandRed-500/50"
            >
              {ex.title}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-6">
          <div className="space-y-6">
            <SqlEditor value={sql} onChange={setSql} onVisualize={() => {}} />

            {display.error ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-panel p-5 border-brandRed-500/40 text-sm text-slate-200 bg-brandRed-950/40"
              >
                Couldn&apos;t fully parse this query: {display.error}. Showing best-effort clause detection below.
              </motion.div>
            ) : null}

            <ExecutionVisualizer steps={display.steps} />

            <div className="grid md:grid-cols-2 gap-6">
              <QueryExplainer steps={display.steps} />
              <QueryTree steps={display.steps} />
            </div>
          </div>

          <div className="space-y-6">
            <AnalysisPanel analysis={display.analysis} />
          </div>
        </div>
      </div>
    </main>
  );
}

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
        <Link href="/" className="flex items-center gap-2 text-sm text-muted hover:text-lime transition-colors font-mono uppercase tracking-wider">
          <ArrowLeft size={15} /> [BACK]
        </Link>
        <span className="font-mono font-bold text-white tracking-wider uppercase">
          SQL_<span className="text-lime">VIZ</span>
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
              className="text-xs px-3 py-1.5 rounded-sm font-mono uppercase tracking-wider border border-base-600 bg-base-800 text-muted hover:text-lime hover:border-lime/30 transition-colors"
            >
              [{ex.title}]
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
                className="hk-panel p-5 border-red-500/30 text-sm text-red-400 font-mono"
              >
                // ERROR: Couldn&apos;t fully parse this query: {display.error}. Showing best-effort clause detection below. //
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

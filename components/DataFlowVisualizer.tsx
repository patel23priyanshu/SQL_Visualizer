"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, ArrowDown, Check, X, Layers } from "lucide-react";
import { evaluateDataFlow, StepDataResult } from "@/lib/dataExecutionEngine";
import SqlEditor from "./SqlEditor";
import { cn } from "@/lib/utils";

interface DataFlowVisualizerProps {
  initialSql?: string;
}

export default function DataFlowVisualizer({ initialSql }: DataFlowVisualizerProps) {
  const [sql, setSql] = useState(
    initialSql ||
      `SELECT id, name, department, salary,
  RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS dept_rank
FROM employees
WHERE salary > 65000
ORDER BY salary DESC;`
  );

  const [steps, setSteps] = useState<StepDataResult[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const computedSteps = evaluateDataFlow(sql);
    setSteps(computedSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [sql]);

  useEffect(() => {
    if (!isPlaying) return;
    if (currentStepIndex >= steps.length - 1) { setIsPlaying(false); return; }
    const timer = setTimeout(() => setCurrentStepIndex((prev) => prev + 1), 1800);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, steps.length]);

  if (steps.length === 0) return null;

  const activeStep = steps[currentStepIndex];
  const passedRowsCount = activeStep.rows.filter((r) => r.passed).length;
  const filteredRowsCount = activeStep.rows.length - passedRowsCount;

  return (
    <div className="space-y-5">
      {/* SQL Editor */}
      <SqlEditor
        value={sql}
        onChange={setSql}
        onVisualize={() => {
          setSteps(evaluateDataFlow(sql));
          setCurrentStepIndex(0);
        }}
      />

      {/* Execution Pipeline Steps Nav */}
      <div className="glass-panel p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-brandRed-500/20 text-brandRed-500 border border-brandRed-500/30">
              <Layers size={17} />
            </div>
            <h2 className="text-base font-semibold text-slate-50">Data Execution Flow</h2>
          </div>
          <span className="text-xs font-mono text-slate-300 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700/60">
            Step {currentStepIndex + 1} of {steps.length}
          </span>
        </div>

        {/* Step Selector Nodes */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {steps.map((st, idx) => (
            <div key={st.stepKey} className="flex items-center shrink-0">
              <button
                onClick={() => { setIsPlaying(false); setCurrentStepIndex(idx); }}
                className={cn(
                  "relative px-4 py-2.5 rounded-xl border text-xs font-medium font-mono backdrop-blur-md transition-all duration-300",
                  idx === currentStepIndex
                    ? "bg-gradient-to-r from-brandRed-500 to-brandRed-600 border-brandRed-400 text-palette-white shadow-glow-red scale-105"
                    : idx < currentStepIndex
                    ? "bg-slate-800/60 border-slate-600/60 text-slate-200 hover:bg-slate-800/90 hover:text-palette-white"
                    : "bg-slate-900/40 border-slate-700/40 text-slate-400 hover:text-slate-300"
                )}
              >
                {idx === currentStepIndex && (
                  <motion.span
                    layoutId="step-active-glow"
                    className="absolute inset-0 rounded-xl bg-brandRed-400/20 animate-pulseGlow"
                  />
                )}
                <span className="relative">{st.stepLabel}</span>
              </button>
              {idx < steps.length - 1 && (
                <div className="mx-1.5 text-slate-600 flex items-center">
                  <ChevronRight size={16} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-between border-t border-slate-700/50 pt-4">
          <p className="text-xs text-slate-300 font-mono">{activeStep.summaryText}</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setIsPlaying(false); setCurrentStepIndex((i) => Math.max(0, i - 1)); }}
              disabled={currentStepIndex === 0}
              className="p-2 rounded-full glass-card text-slate-300 hover:text-palette-white disabled:opacity-30"
              title="Previous step"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => { setIsPlaying(false); setCurrentStepIndex(0); }}
              className="p-2 rounded-full glass-card text-slate-300 hover:text-palette-white"
              title="Restart"
            >
              <RotateCcw size={16} />
            </button>
            <button
              onClick={() => { if (currentStepIndex >= steps.length - 1) setCurrentStepIndex(0); setIsPlaying((p) => !p); }}
              className="btn-primary p-2.5 rounded-full"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <button
              onClick={() => { setIsPlaying(false); setCurrentStepIndex((i) => Math.min(steps.length - 1, i + 1)); }}
              disabled={currentStepIndex === steps.length - 1}
              className="p-2 rounded-full glass-card text-slate-300 hover:text-palette-white disabled:opacity-30"
              title="Next step"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Row-by-Row Table Visualizer */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep.stepKey}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="glass-panel p-6 space-y-4 overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-50">{activeStep.stepLabel}</h3>
              <p className="text-xs text-slate-300 mt-0.5">{activeStep.description}</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-600/60 text-palette-white">
                <Check size={13} className="text-slate-200" /> Passed ({passedRowsCount})
              </span>
              {filteredRowsCount > 0 && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brandRed-950/50 border border-brandRed-700/50 text-brandRed-400">
                  <X size={13} className="text-brandRed-500" /> Filtered ({filteredRowsCount})
                </span>
              )}
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-700/50 bg-slate-950/40 backdrop-blur-xl">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-slate-700/60 bg-slate-900/70 text-slate-300 uppercase tracking-wider">
                  <th className="py-3 px-4 w-12 text-center">Status</th>
                  {activeStep.columns.map((col) => (
                    <th key={col} className="py-3 px-4">{col}</th>
                  ))}
                  {activeStep.rows.some((r) => r.filterReason) && (
                    <th className="py-3 px-4 text-right">Condition</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {activeStep.rows.map((item, rIdx) => (
                  <motion.tr
                    key={item.row.id || item.row.department || rIdx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: rIdx * 0.03 }}
                    className={cn(
                      "transition-all duration-300",
                      item.passed
                        ? "bg-slate-800/20 text-slate-100 hover:bg-slate-800/40"
                        : "bg-slate-950/50 text-slate-500 line-through opacity-45 hover:opacity-70"
                    )}
                  >
                    <td className="py-3 px-4 text-center">
                      {item.passed ? (
                        <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-700/60 text-palette-white border border-slate-500/50">
                          <Check size={11} />
                        </div>
                      ) : (
                        <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-brandRed-950/60 text-brandRed-500 border border-brandRed-700/50">
                          <X size={11} />
                        </div>
                      )}
                    </td>
                    {activeStep.columns.map((col) => (
                      <td key={col} className="py-3 px-4">
                        {typeof item.row[col] === "number" && col.includes("salary")
                          ? `$${item.row[col].toLocaleString()}`
                          : String(item.row[col] ?? "-")}
                      </td>
                    ))}
                    {activeStep.rows.some((r) => r.filterReason) && (
                      <td className="py-3 px-4 text-right text-[11px]">
                        <span
                          className={cn(
                            "px-2.5 py-0.5 rounded-full border text-[10px]",
                            item.passed
                              ? "bg-slate-800/70 border-slate-600/50 text-palette-white"
                              : "bg-brandRed-950/60 border-brandRed-800/50 text-brandRed-400"
                          )}
                        >
                          {item.filterReason || "—"}
                        </span>
                      </td>
                    )}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Flow Indicator */}
          <div className="flex items-center justify-center gap-2 pt-1 text-slate-400 text-xs font-mono">
            <ArrowDown size={14} className="animate-bounce text-brandRed-500" />
            <span>Data stream transforming to next execution phase</span>
            <ArrowDown size={14} className="animate-bounce text-brandRed-500" />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

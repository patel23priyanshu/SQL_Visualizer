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
    <div className="space-y-6">
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
      <div className="hk-panel p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Layers size={18} className="text-lime" />
            <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">Data Execution Flow</h2>
          </div>
          <span className="text-xs font-mono text-lime bg-lime/10 px-3 py-1 rounded-sm border border-lime/30">
            [{String(currentStepIndex + 1).padStart(2, "0")}] of [{String(steps.length).padStart(2, "0")}]
          </span>
        </div>

        {/* Step Selector Nodes */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {steps.map((st, idx) => (
            <div key={st.stepKey} className="flex items-center shrink-0">
              <button
                onClick={() => { setIsPlaying(false); setCurrentStepIndex(idx); }}
                className={cn(
                  "relative px-4 py-2.5 rounded-sm border text-xs font-medium font-mono uppercase tracking-wider transition-all duration-300",
                  idx === currentStepIndex
                    ? "bg-lime/15 border-lime/70 text-lime shadow-glow-lime-sm"
                    : idx < currentStepIndex
                    ? "bg-base-800 border-base-600 text-muted-light"
                    : "bg-base-900 border-base-700 text-muted-dark"
                )}
              >
                {idx === currentStepIndex && (
                  <motion.span
                    layoutId="step-active-glow"
                    className="absolute inset-0 rounded-sm bg-lime/10 animate-pulseGlow"
                  />
                )}
                <span className="relative">[{String(idx + 1).padStart(2, "0")}] {st.stepLabel}</span>
              </button>
              {idx < steps.length - 1 && (
                <div className="mx-1.5 text-base-600 flex items-center">
                  <ChevronRight size={16} className={idx < currentStepIndex ? "text-lime/50" : ""} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-between border-t border-base-600 pt-4">
          <p className="text-xs text-muted-light font-mono">{activeStep.summaryText}</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setIsPlaying(false); setCurrentStepIndex((i) => Math.max(0, i - 1)); }}
              disabled={currentStepIndex === 0}
              className="p-2 rounded-sm border border-base-600 bg-base-800 text-muted hover:text-lime hover:border-lime/30 disabled:opacity-30 transition-colors"
              title="Previous step"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => { setIsPlaying(false); setCurrentStepIndex(0); }}
              className="p-2 rounded-sm border border-base-600 bg-base-800 text-muted hover:text-lime hover:border-lime/30 transition-colors"
              title="Restart"
            >
              <RotateCcw size={16} />
            </button>
            <button
              onClick={() => { if (currentStepIndex >= steps.length - 1) setCurrentStepIndex(0); setIsPlaying((p) => !p); }}
              className="btn-primary p-2.5 rounded-sm"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <button
              onClick={() => { setIsPlaying(false); setCurrentStepIndex((i) => Math.min(steps.length - 1, i + 1)); }}
              disabled={currentStepIndex === steps.length - 1}
              className="p-2 rounded-sm border border-base-600 bg-base-800 text-muted hover:text-lime hover:border-lime/30 disabled:opacity-30 transition-colors"
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
          className="hk-panel p-6 space-y-4 overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">{activeStep.stepLabel}</h3>
              <p className="text-xs text-muted mt-0.5">{activeStep.description}</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-sm bg-lime/10 border border-lime/30 text-lime">
                <Check size={13} className="text-lime" /> Passed ({passedRowsCount})
              </span>
              {filteredRowsCount > 0 && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-sm bg-red-500/10 border border-red-500/30 text-red-400">
                  <X size={13} className="text-red-400" /> Filtered ({filteredRowsCount})
                </span>
              )}
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto rounded-sm border border-base-600 bg-base-950">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-base-600 bg-base-900 text-lime uppercase tracking-wider">
                  <th className="py-3 px-4 w-12 text-center">STATUS</th>
                  {activeStep.columns.map((col) => (
                    <th key={col} className="py-3 px-4">{col}</th>
                  ))}
                  {activeStep.rows.some((r) => r.filterReason) && (
                    <th className="py-3 px-4 text-right">CONDITION</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-base-700">
                {activeStep.rows.map((item, rIdx) => (
                  <motion.tr
                    key={item.row.id || item.row.department || rIdx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: rIdx * 0.03 }}
                    className={cn(
                      "transition-all duration-300",
                      item.passed
                        ? "bg-base-900/50 text-slate-200 hover:bg-base-800"
                        : "bg-transparent text-muted-dark line-through opacity-40 hover:opacity-60"
                    )}
                  >
                    <td className="py-3 px-4 text-center">
                      {item.passed ? (
                        <div className="inline-flex items-center justify-center w-5 h-5 rounded-sm bg-lime/15 text-lime border border-lime/30">
                          <Check size={11} />
                        </div>
                      ) : (
                        <div className="inline-flex items-center justify-center w-5 h-5 rounded-sm bg-red-500/15 text-red-400 border border-red-500/30">
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
                            "px-2.5 py-0.5 rounded-sm border text-[10px] font-mono",
                            item.passed
                              ? "bg-lime/10 border-lime/30 text-lime"
                              : "bg-base-800 border-base-600 text-muted-dark"
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
          <div className="flex items-center justify-center gap-2 pt-1 text-muted text-xs font-mono uppercase tracking-wider">
            <ArrowDown size={14} className="animate-bounce text-lime" />
            <span>Data stream transforming to next execution phase</span>
            <ArrowDown size={14} className="animate-bounce text-lime" />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

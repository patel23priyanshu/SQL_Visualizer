"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, Lightbulb } from "lucide-react";
import type { ExecutionStep } from "@/lib/executionOrder";
import { cn } from "@/lib/utils";

interface ExecutionVisualizerProps {
  steps: ExecutionStep[];
}

export default function ExecutionVisualizer({ steps }: ExecutionVisualizerProps) {
  const activeSteps = steps.filter((s) => s.present);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => { setIndex(0); setPlaying(false); }, [steps]);

  useEffect(() => {
    if (!playing) return;
    if (index >= activeSteps.length - 1) { setPlaying(false); return; }
    const t = setTimeout(() => setIndex((i) => i + 1), 1400);
    return () => clearTimeout(t);
  }, [playing, index, activeSteps.length]);

  if (activeSteps.length === 0) {
    return (
      <div className="glass-panel p-8 text-center text-slate-400">
        No recognizable clauses yet — write a query and hit Visualize.
      </div>
    );
  }

  const current = activeSteps[index];

  return (
    <div className="glass-panel p-6 space-y-6">
      {/* Flow nodes */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {activeSteps.map((step, i) => (
          <div key={step.key} className="flex items-center shrink-0">
            <button
              onClick={() => { setPlaying(false); setIndex(i); }}
              className={cn(
                "relative px-4 py-2.5 rounded-xl border text-sm font-medium font-mono backdrop-blur-md transition-all duration-300",
                i === index
                  ? "bg-gradient-to-r from-brandRed-500 to-brandRed-600 border-brandRed-400 text-palette-white shadow-glow-red scale-105"
                  : i < index
                  ? "bg-slate-800/60 border-slate-600/60 text-slate-200 hover:text-palette-white"
                  : "bg-slate-900/30 border-slate-700/40 text-slate-400"
              )}
            >
              {i === index && (
                <motion.span
                  layoutId="active-glow"
                  className="absolute inset-0 rounded-xl bg-brandRed-400/20"
                />
              )}
              <span className="relative">{step.label}</span>
            </button>
            {i < activeSteps.length - 1 && (
              <svg width="28" height="16" className="mx-1 shrink-0" viewBox="0 0 28 16">
                <line x1="0" y1="8" x2="22" y2="8"
                  stroke={i < index ? "#EF233C" : "#3d425a"}
                  strokeWidth="2" strokeDasharray="4 4"
                  className={i === index ? "animate-flowDash" : ""}
                />
                <polygon points="22,3 28,8 22,13" fill={i < index ? "#EF233C" : "#3d425a"} />
              </svg>
            )}
          </div>
        ))}
      </div>

      {/* Detail card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.key}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          className="glass-card p-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs uppercase tracking-wider text-brandRed-400 font-mono font-semibold">
              Step {index + 1} of {activeSteps.length}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-slate-50 mb-1">{current.label}</h3>
          <p className="text-slate-200 text-sm mb-3">{current.detail}</p>
          <div className="flex items-start gap-2 bg-slate-800/60 backdrop-blur-md border border-slate-700/50 rounded-lg p-3">
            <Lightbulb size={15} className="text-brandRed-500 mt-0.5 shrink-0" />
            <p className="text-xs text-slate-200 leading-relaxed">{current.tip}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => { setPlaying(false); setIndex((i) => Math.max(0, i - 1)); }}
          disabled={index === 0}
          className="p-2.5 rounded-full glass-card text-slate-300 hover:text-palette-white disabled:opacity-30"
          title="Previous"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() => { setPlaying(false); setIndex(0); }}
          className="p-2.5 rounded-full glass-card text-slate-300 hover:text-palette-white"
          title="Restart"
        >
          <RotateCcw size={16} />
        </button>
        <button
          onClick={() => { if (index >= activeSteps.length - 1) setIndex(0); setPlaying((p) => !p); }}
          className="btn-primary p-3 rounded-full"
          title={playing ? "Pause" : "Play"}
        >
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button
          onClick={() => { setPlaying(false); setIndex((i) => Math.min(activeSteps.length - 1, i + 1)); }}
          disabled={index === activeSteps.length - 1}
          className="p-2.5 rounded-full glass-card text-slate-300 hover:text-palette-white disabled:opacity-30"
          title="Next"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

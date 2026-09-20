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

  useEffect(() => {
    setIndex(0);
    setPlaying(false);
  }, [steps]);

  useEffect(() => {
    if (!playing) return;
    if (index >= activeSteps.length - 1) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => setIndex((i) => i + 1), 1400);
    return () => clearTimeout(t);
  }, [playing, index, activeSteps.length]);

  if (activeSteps.length === 0) {
    return (
      <div className="hk-panel p-8 text-center text-muted font-mono uppercase tracking-wider text-sm">
        // No recognizable clauses — write a query and hit Visualize //
      </div>
    );
  }

  const current = activeSteps[index];

  return (
    <div className="hk-panel p-6 space-y-6">
      {/* Flow nodes */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {activeSteps.map((step, i) => (
          <div key={step.key} className="flex items-center shrink-0">
            <button
              onClick={() => {
                setPlaying(false);
                setIndex(i);
              }}
              className={cn(
                "relative px-4 py-2.5 rounded-sm border text-sm font-medium font-mono uppercase tracking-wider transition-all duration-300",
                i === index
                  ? "bg-lime/15 border-lime/70 text-lime shadow-glow-lime-sm"
                  : i < index
                  ? "bg-base-800 border-base-600 text-muted-light"
                  : "bg-base-900 border-base-700 text-muted-dark"
              )}
            >
              {i === index && (
                <motion.span
                  layoutId="active-glow"
                  className="absolute inset-0 rounded-sm bg-lime/10 animate-pulseGlow"
                />
              )}
              <span className="relative">[{String(i + 1).padStart(2, "0")}] {step.label}</span>
            </button>
            {i < activeSteps.length - 1 && (
              <svg width="28" height="16" className="mx-1 shrink-0" viewBox="0 0 28 16">
                <line
                  x1="0"
                  y1="8"
                  x2="22"
                  y2="8"
                  stroke={i < index ? "#C8FF00" : "#2a2a2a"}
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  className={i === index ? "animate-flowDash" : ""}
                />
                <polygon points="22,3 28,8 22,13" fill={i < index ? "#C8FF00" : "#2a2a2a"} />
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
          className="hk-card p-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs uppercase tracking-widest text-lime font-mono">
              Step [{String(index + 1).padStart(2, "0")}] of [{String(activeSteps.length).padStart(2, "0")}]
            </span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1 font-mono">{current.label}</h3>
          <p className="text-muted-light text-sm mb-3">{current.detail}</p>
          <div className="flex items-start gap-2 bg-yellow-400/[0.06] border border-yellow-400/20 rounded-sm p-3">
            <Lightbulb size={15} className="text-yellow-400 mt-0.5 shrink-0" />
            <p className="text-xs text-yellow-200/80 leading-relaxed">{current.tip}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => {
            setPlaying(false);
            setIndex((i) => Math.max(0, i - 1));
          }}
          disabled={index === 0}
          className="p-2.5 rounded-sm border border-base-600 bg-base-800 text-muted hover:text-lime hover:border-lime/30 disabled:opacity-30 transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() => {
            setPlaying(false);
            setIndex(0);
          }}
          className="p-2.5 rounded-sm border border-base-600 bg-base-800 text-muted hover:text-lime hover:border-lime/30 transition-colors"
          title="Replay"
        >
          <RotateCcw size={16} />
        </button>
        <button
          onClick={() => {
            if (index >= activeSteps.length - 1) setIndex(0);
            setPlaying((p) => !p);
          }}
          className="btn-primary p-3 rounded-sm"
        >
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button
          onClick={() => {
            setPlaying(false);
            setIndex((i) => Math.min(activeSteps.length - 1, i + 1));
          }}
          disabled={index === activeSteps.length - 1}
          className="p-2.5 rounded-sm border border-base-600 bg-base-800 text-muted hover:text-lime hover:border-lime/30 disabled:opacity-30 transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

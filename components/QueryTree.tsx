"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import type { ExecutionStep } from "@/lib/executionOrder";
import { cn } from "@/lib/utils";

function TreeNode({ step, depth = 0 }: { step: ExecutionStep; depth?: number }) {
  const [open, setOpen] = useState(depth < 1);

  return (
    <div style={{ marginLeft: depth * 16 }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 py-1.5 text-sm text-slate-200 hover:text-palette-white transition-colors w-full text-left"
      >
        <ChevronRight
          size={14}
          className={cn("transition-transform text-brandRed-400 shrink-0", open && "rotate-90")}
        />
        <span className="font-mono text-palette-white">{step.label}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="text-xs text-slate-300 pl-6 pb-2 pr-2 leading-relaxed">{step.detail}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function QueryTree({ steps }: { steps: ExecutionStep[] }) {
  const present = steps.filter((s) => s.present);

  return (
    <div className="glass-panel p-5">
      <h3 className="text-sm font-semibold text-slate-100 mb-3">Execution Tree</h3>
      <div className="border-l border-slate-700/60 pl-1">
        {present.map((step) => (
          <TreeNode key={step.key} step={step} />
        ))}
      </div>
    </div>
  );
}

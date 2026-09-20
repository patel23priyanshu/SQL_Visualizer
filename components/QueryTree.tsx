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
        className="flex items-center gap-1.5 py-1.5 text-sm text-muted-light hover:text-white transition-colors w-full text-left"
      >
        <ChevronRight
          size={14}
          className={cn("transition-transform text-muted shrink-0", open && "rotate-90")}
        />
        <span className="font-mono text-lime">{step.label}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="text-xs text-muted pl-6 pb-2 pr-2">{step.detail}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function QueryTree({ steps }: { steps: ExecutionStep[] }) {
  const present = steps.filter((s) => s.present);

  return (
    <div className="hk-panel p-5">
      <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider mb-3">// Execution Tree //</h3>
      <div className="border-l border-base-600 pl-1">
        {present.map((step) => (
          <TreeNode key={step.key} step={step} />
        ))}
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import type { ExecutionStep } from "@/lib/executionOrder";

export default function QueryExplainer({ steps }: { steps: ExecutionStep[] }) {
  const present = steps.filter((s) => s.present);

  return (
    <div className="glass-panel p-5">
      <h3 className="text-sm font-semibold text-slate-100 mb-4">Clause Breakdown</h3>
      <div className="space-y-2.5">
        {present.map((step, i) => (
          <motion.div
            key={step.key}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-3.5 flex gap-3"
          >
            <span className="text-xs font-mono text-brandRed-400 font-semibold shrink-0 w-6 pt-0.5">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <div className="text-sm font-medium text-palette-white font-mono mb-0.5">
                {step.label}
              </div>
              <div className="text-xs text-slate-300 leading-relaxed">{step.detail}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

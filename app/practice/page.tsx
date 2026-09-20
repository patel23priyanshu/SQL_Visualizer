"use client";

import PracticeHub from "@/components/PracticeHub";
import { GraduationCap } from "lucide-react";

export default function PracticePage() {
  return (
    <main className="min-h-screen pb-20 max-w-7xl mx-auto px-6 pt-6 space-y-6">
      <div className="flex items-center justify-between border-b border-base-600 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-lime bg-lime/10 border border-lime/30 rounded-sm px-3 py-1 mb-2 uppercase tracking-widest">
            <span className="text-lime">■</span>
            Interactive SQL Practice Playground
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3 font-mono uppercase">
            <GraduationCap size={24} className="text-lime" />
            // Categorized SQL Practice //
          </h1>
          <p className="text-sm text-muted mt-1 font-mono">
            Master Window Functions, Ranking Window Functions, Aggregate Functions, Joins, and CTEs through hands-on practice problems with instant verification and step-by-step data visualization.
          </p>
        </div>
      </div>

      <PracticeHub />
    </main>
  );
}

"use client";

import PracticeHub from "@/components/PracticeHub";
import { GraduationCap, Sparkles } from "lucide-react";

export default function PracticePage() {
  return (
    <main className="min-h-screen pb-20 max-w-7xl mx-auto px-6 pt-6 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-700/50 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-medium text-palette-white bg-slate-800/80 border border-brandRed-500/40 rounded-full px-3 py-1 mb-2">
            <Sparkles size={12} className="text-brandRed-500" />
            Interactive SQL Practice Playground
          </div>
          <h1 className="text-3xl font-bold text-slate-50 tracking-tight flex items-center gap-3">
            <div className="p-1 rounded-lg bg-brandRed-500/20 text-brandRed-500">
              <GraduationCap size={26} />
            </div>
            Categorized SQL Practice
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Master Window Functions, Ranking, Aggregates, Joins, and CTEs through hands-on practice — write your own SQL, get hints when stuck, and unlock explanations after solving.
          </p>
        </div>
      </div>

      <PracticeHub />
    </main>
  );
}

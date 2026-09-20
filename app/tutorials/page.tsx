"use client";

import Link from "next/link";
import {
  BookOpen,
  ArrowRight,
  Filter,
  GitMerge,
  Sparkles,
  Terminal,
  Layers,
  Clock,
} from "lucide-react";

export default function TutorialsPage() {
  const upcomingCategories = [
    {
      code: "CAT_01",
      title: "SELECT & Filtering",
      badge: "FUNDAMENTALS",
      description:
        "Master SELECT, WHERE, DISTINCT, ORDER BY, and LIMIT query clauses with filtering mechanics.",
      icon: Filter,
    },
    {
      code: "CAT_02",
      title: "Multi-Table JOINs",
      badge: "RELATIONAL",
      description:
        "Understand INNER, LEFT, RIGHT, FULL OUTER, CROSS, and self-joins with Venn-diagram breakdowns.",
      icon: GitMerge,
    },
    {
      code: "CAT_03",
      title: "Window Functions",
      badge: "ANALYTICS",
      description:
        "Deep-dive into OVER(), PARTITION BY, RANK(), DENSE_RANK(), and sliding frame windows.",
      icon: Sparkles,
    },
    {
      code: "CAT_04",
      title: "Subqueries & CTEs",
      badge: "ADVANCED",
      description:
        "Write correlated subqueries, WITH common table expressions, and recursive database queries.",
      icon: Terminal,
    },
    {
      code: "CAT_05",
      title: "Aggregates & GROUP BY",
      badge: "GROUPING",
      description:
        "Aggregate row sets with COUNT, SUM, AVG, MIN, MAX, HAVING conditions, and multidimensional rollups.",
      icon: Layers,
    },
    {
      code: "CAT_06",
      title: "Execution & Indexing",
      badge: "OPTIMIZATION",
      description:
        "Learn database query execution lifecycles, B-Tree indexes, scan operations, and performance tuning.",
      icon: Clock,
    },
  ];

  return (
    <main className="min-h-screen pb-20 max-w-7xl mx-auto px-6 pt-6 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-base-600 pb-6 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-lime bg-lime/10 border border-lime/30 rounded-sm px-3 py-1 mb-2 uppercase tracking-widest">
            <span className="text-lime">■</span>
            SQL Learning Tutorials
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3 font-mono uppercase">
            <BookOpen size={24} className="text-lime" />
            // SQL TUTORIALS //
          </h1>
          <p className="text-sm text-muted mt-1 font-mono">
            A comprehensive written learning section covering core SQL syntax, execution concepts, and real-world database query patterns.
          </p>
        </div>
      </div>

      {/* Central Empty State / Coming Soon */}
      <div className="hk-panel p-6 sm:p-10 text-center max-w-4xl mx-auto space-y-8 relative overflow-hidden">
        {/* Terminal Status Bar */}
        <div className="flex items-center justify-between border-b border-base-600/70 pb-3 text-xs font-mono text-muted uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-lime/80" />
            <span className="ml-2 text-muted-light">// MODULE: TUTORIALS_INDEX</span>
          </div>
          <div className="flex items-center gap-2 text-lime">
            <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
            <span>PHASE 3 // STATUS: IN_PROGRESS</span>
          </div>
        </div>

        {/* Center Empty State Card */}
        <div className="flex flex-col items-center justify-center space-y-4 py-4">
          <div className="p-5 rounded-md bg-lime/10 border border-lime/30 text-lime shadow-glow-lime-sm">
            <BookOpen size={48} className="text-lime" />
          </div>

          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-muted uppercase tracking-widest">
            <span className="text-lime">[SYSTEM_STATUS]</span>
            <span>::</span>
            <span>CURRICULUM_INITIALIZING</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wider font-mono uppercase">
            Tutorials Coming Soon
          </h2>

          <p className="text-xs sm:text-sm text-muted-light max-w-xl font-mono leading-relaxed">
            Written tutorials are currently being prepared. You will soon have access to step-by-step reading modules, clause-by-clause visual diagrams, and hands-on code walkthroughs for all core SQL topics.
          </p>

          <div className="p-3 bg-base-950/80 border border-base-600 rounded-sm text-xs font-mono text-muted max-w-xl">
            <span className="text-lime uppercase font-semibold">// UPCOMING TRACKS: </span>
            Comprehensive modules will be available for <span className="text-white">SELECT</span>, <span className="text-white">JOINs</span>, <span className="text-white">Window Functions</span>, <span className="text-white">Subqueries</span>, <span className="text-white">Aggregates</span>, and more.
          </div>
        </div>

        {/* Upcoming Categories Grid */}
        <div className="border-t border-base-600/70 pt-6 text-left">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-lime uppercase tracking-widest">
              // PREVIEW OF PLANNED CATEGORIES //
            </span>
            <span className="text-[11px] font-mono text-muted uppercase tracking-wider">
              [6 MODULES QUEUED]
            </span>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {upcomingCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.code}
                  className="hk-card p-4 flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="p-1.5 rounded-sm bg-lime/10 text-lime border border-lime/30 w-fit">
                        <Icon size={16} />
                      </div>
                      <span className="text-[10px] font-mono text-muted uppercase tracking-wider">
                        {cat.badge}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-muted font-mono leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-2 border-t border-base-600/50 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-lime">{cat.code}</span>
                    <span className="text-muted uppercase tracking-wider">[QUEUED]</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t border-base-600/70 pt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/practice"
            className="btn-primary inline-flex items-center justify-center gap-2 text-xs w-full sm:w-auto"
          >
            PRACTICE PROBLEMS NOW <ArrowRight size={14} />
          </Link>
          <Link
            href="/visualizer"
            className="btn-ghost inline-flex items-center justify-center gap-2 text-xs w-full sm:w-auto"
          >
            [LAUNCH DATA FLOW] <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </main>
  );
}

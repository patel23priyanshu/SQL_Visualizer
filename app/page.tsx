import Link from "next/link";
import { ArrowRight, Sparkles, Table, GraduationCap, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen pb-20">
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-16 text-center">
        <div className="inline-flex items-center gap-2 text-xs font-medium text-palette-white bg-slate-800/80 border border-brandRed-500/40 rounded-full px-3.5 py-1 mb-6 shadow-glow-red/20">
          <Sparkles size={12} className="text-brandRed-500" />
          Master SQL through Data Flow &amp; Practice
        </div>
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-slate-50 mb-5">
          Visualize Data Streams &amp; <span className="gradient-text">Master SQL</span>
        </h1>
        <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          Interactive row-level data transformations on sample datasets, paired with categorized practice problems covering Window Functions, Aggregates, Ranking, and CTEs.
        </p>

        {/* 2 Main Parts Showcase Cards */}
        <div className="grid md:grid-cols-2 gap-6 text-left max-w-4xl mx-auto mb-16">
          {/* Part 1 Card */}
          <div className="glass-panel p-8 relative overflow-hidden flex flex-col justify-between group hover:border-brandRed-500/50 transition-all duration-300">
            <div>
              <div className="p-3 rounded-2xl bg-brandRed-500/15 border border-brandRed-500/30 text-brandRed-500 w-fit mb-4 group-hover:shadow-glow-red/40 transition-all">
                <Table size={24} />
              </div>
              <span className="text-xs font-mono text-brandRed-400 uppercase tracking-wider font-semibold">
                Part 1: Data Flow Visualizer
              </span>
              <h2 className="text-xl font-bold text-slate-50 mt-1 mb-2">
                Sample Data Row Transformations
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Watch 10 sample data rows transform clause-by-clause. Features animated row filtering, group collapses, window function rankings, and directional flow arrows.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-200 font-mono mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-brandRed-500" /> 10 Rows × 5 Columns Sample Table
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-brandRed-500" /> Row-by-Row WHERE &amp; HAVING Filter
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-brandRed-500" /> RANK() &amp; ROW_NUMBER() Visualizer
                </li>
              </ul>
            </div>
            <Link href="/visualizer" className="btn-primary flex items-center justify-center gap-2 text-xs w-full text-center">
              Explore Data Flow Visualizer <ArrowRight size={14} />
            </Link>
          </div>

          {/* Part 2 Card */}
          <div className="glass-panel p-8 relative overflow-hidden flex flex-col justify-between group hover:border-brandRed-500/50 transition-all duration-300">
            <div>
              <div className="p-3 rounded-2xl bg-brandRed-500/15 border border-brandRed-500/30 text-brandRed-500 w-fit mb-4 group-hover:shadow-glow-red/40 transition-all">
                <GraduationCap size={24} />
              </div>
              <span className="text-xs font-mono text-brandRed-400 uppercase tracking-wider font-semibold">
                Part 2: Practice Playground
              </span>
              <h2 className="text-xl font-bold text-slate-50 mt-1 mb-2">
                Categorized Practice Problems
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Practice topic-based SQL questions with instant verification, hints on failure, and solution explanations only after you solve them.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-200 font-mono mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-brandRed-500" /> Window &amp; Ranking Functions
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-brandRed-500" /> Aggregate Functions &amp; GROUP BY
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-brandRed-500" /> Joins, Subqueries &amp; CTEs
                </li>
              </ul>
            </div>
            <Link href="/practice" className="btn-ghost flex items-center justify-center gap-2 text-xs w-full text-center">
              Start Practice Playground <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800/60 py-8">
        <div className="max-w-5xl mx-auto px-6 text-center text-xs text-slate-400">
          Built for learning SQL execution order, row data flow &amp; query practice.
        </div>
      </footer>
    </main>
  );
}

import Link from "next/link";
import { ArrowRight, Table, GraduationCap, BookOpen, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen pb-20">
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-20 pb-10 sm:pb-16 text-center">
        <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-mono text-lime bg-lime/10 border border-lime/30 rounded-sm px-2.5 sm:px-3.5 py-1 mb-4 sm:mb-6 uppercase tracking-widest">
          <span className="text-lime">■</span>
          Interactive SQL Learning Platform
        </div>

        <h1 className="hk-heading text-2xl sm:text-3xl md:text-5xl text-white mb-3 sm:mb-4 leading-tight">
          SQL_VISUALIZER
        </h1>

        <p className="text-lime font-mono text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-3 sm:mb-4">
          // LEARN. PRACTICE. MASTER. //
        </p>

        <p className="text-muted-light text-sm sm:text-base max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed px-2">
          Interactive row-level data transformations on sample datasets, paired with categorized practice problems covering Window Functions, Aggregates, Ranking, and CTEs.
        </p>

        {/* 3 Main Parts Showcase Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 text-left max-w-6xl mx-auto mb-10 sm:mb-16">
          {/* Part 1 Card */}
          <div className="hk-panel p-5 sm:p-8 relative overflow-hidden flex flex-col justify-between group hover:border-lime/40 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-lime uppercase tracking-widest">[01]</span>
                <span className="text-xs font-mono text-muted uppercase tracking-wider">PHASE 1</span>
              </div>
              <div className="p-3 rounded-sm bg-lime/10 border border-lime/30 text-lime w-fit mb-4 group-hover:shadow-glow-lime-sm transition-all">
                <Table size={24} />
              </div>
              <span className="text-xs font-mono text-lime uppercase tracking-widest">
                // Data Flow Visualizer //
              </span>
              <h2 className="text-lg font-bold text-white mt-1.5 mb-2">
                Sample Data Row Transformations
              </h2>
              <p className="text-xs text-muted-light leading-relaxed mb-4">
                Watch 10 sample data rows transform clause-by-clause. Features animated row filtering, group collapses, window function rankings, and directional flow arrows.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-300 font-mono mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-lime" /> 10 Rows &times; 5 Columns Sample Table
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-lime" /> Row-by-Row WHERE &amp; HAVING Filter
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-lime" /> RANK() &amp; ROW_NUMBER() Visualizer
                </li>
              </ul>
            </div>
            <Link href="/visualizer" className="btn-primary flex items-center justify-center gap-2 text-xs w-full text-center">
              ACCESS DATA FLOW <ArrowRight size={14} />
            </Link>
          </div>

          {/* Part 2 Card */}
          <div className="hk-panel p-5 sm:p-8 relative overflow-hidden flex flex-col justify-between group hover:border-lime/40 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-lime uppercase tracking-widest">[02]</span>
                <span className="text-xs font-mono text-muted uppercase tracking-wider">PHASE 2</span>
              </div>
              <div className="p-3 rounded-sm bg-lime/10 border border-lime/30 text-lime w-fit mb-4 group-hover:shadow-glow-lime-sm transition-all">
                <GraduationCap size={24} />
              </div>
              <span className="text-xs font-mono text-lime uppercase tracking-widest">
                // Practice Playground //
              </span>
              <h2 className="text-lg font-bold text-white mt-1.5 mb-2">
                Categorized Practice Problems
              </h2>
              <p className="text-xs text-muted-light leading-relaxed mb-4">
                Practice topic-based SQL questions with instant verification, hints on failure, and solution explanations only after you solve them.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-300 font-mono mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-lime" /> Window &amp; Ranking Functions
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-lime" /> Aggregate Functions &amp; GROUP BY
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-lime" /> Joins, Subqueries &amp; CTEs
                </li>
              </ul>
            </div>
            <Link href="/practice" className="btn-ghost flex items-center justify-center gap-2 text-xs w-full text-center">
              [START PRACTICE] <ArrowRight size={14} />
            </Link>
          </div>

          {/* Part 3 Card */}
          <div className="hk-panel p-5 sm:p-8 relative overflow-hidden flex flex-col justify-between group hover:border-lime/40 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-lime uppercase tracking-widest">[03]</span>
                <span className="text-xs font-mono text-muted uppercase tracking-wider">PHASE 3</span>
              </div>
              <div className="p-3 rounded-sm bg-lime/10 border border-lime/30 text-lime w-fit mb-4 group-hover:shadow-glow-lime-sm transition-all">
                <BookOpen size={24} />
              </div>
              <span className="text-xs font-mono text-lime uppercase tracking-widest">
                // SQL Tutorials //
              </span>
              <h2 className="text-lg font-bold text-white mt-1.5 mb-2">
                Learn SQL Through Articles
              </h2>
              <p className="text-xs text-muted-light leading-relaxed mb-4">
                Learn SQL concepts through written tutorials with in-depth explanations, visual diagrams, and practical database examples.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-300 font-mono mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-lime" /> SELECT, WHERE &amp; GROUP BY Basics
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-lime" /> Table JOINs &amp; Subquery Mastery
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-lime" /> Window Functions &amp; Analytics
                </li>
              </ul>
            </div>
            <Link href="/tutorials" className="btn-ghost flex items-center justify-center gap-2 text-xs w-full text-center">
              [EXPLORE TUTORIALS] <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-base-600 py-8">
        <div className="max-w-5xl mx-auto px-6 text-center text-xs text-muted font-mono uppercase tracking-wider">
          // Built for learning how SQL really executes //
        </div>
      </footer>
    </main>
  );
}

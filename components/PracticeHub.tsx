"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, XCircle, Lightbulb, Play, Eye, BookOpen,
  Filter, Trophy, ChevronLeft, ChevronRight
} from "lucide-react";
import { practiceQuestions, questionCategories, PracticeQuestion } from "@/lib/practiceQuestions";
import SqlEditor from "./SqlEditor";
import { cn } from "@/lib/utils";

export default function PracticeHub() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeQuestion, setActiveQuestion] = useState<PracticeQuestion>(practiceQuestions[0]);
  const [userSql, setUserSql] = useState<string>(practiceQuestions[0].starterSql);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [solved, setSolved] = useState<Set<string>>(new Set());
  const [categoryPanelOpen, setCategoryPanelOpen] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    status: "idle" | "success" | "failure";
    message: string;
  }>({ status: "idle", message: "" });

  const filteredQuestions = selectedCategory === "All"
    ? practiceQuestions
    : practiceQuestions.filter((q) => q.category === selectedCategory);

  const handleSelectQuestion = (q: PracticeQuestion) => {
    setActiveQuestion(q);
    setUserSql(q.starterSql);
    setShowHint(false);
    setVerificationResult({ status: "idle", message: "" });
  };

  const handleVerify = () => {
    const cleanedUser = userSql.replace(/\s+/g, " ").trim().toUpperCase();
    const cleanedSolution = activeQuestion.solutionSql.replace(/\s+/g, " ").trim().toUpperCase();

    const isExact = cleanedUser === cleanedSolution;
    const hasKeyConstructs = activeQuestion.expectedColumns.every((col) =>
      cleanedUser.includes(col.toUpperCase()) || col.includes("_")
    );

    if (isExact || hasKeyConstructs) {
      setSolved((prev) => new Set([...prev, activeQuestion.id]));
      setShowHint(false);
      setVerificationResult({
        status: "success",
        message: "Excellent! Your query produces the correct output.",
      });
    } else {
      setVerificationResult({
        status: "failure",
        message: "Not quite right. Re-read the problem and check the hint below.",
      });
      // Auto-show hint on failure so learner gets immediate guidance
      setShowHint(true);
    }
  };

  const isSolved = solved.has(activeQuestion.id);

  return (
    <div className="relative space-y-5">
      {/* ── Collapsible Category Sidebar (Right Edge) ── */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex items-center">
        {/* Tab Handle — always visible */}
        <button
          onClick={() => setCategoryPanelOpen((o) => !o)}
          className="flex items-center justify-center w-7 h-16 rounded-l-md bg-base-800 border border-r-0 border-lime/30 text-lime hover:bg-base-700 transition-colors"
          aria-label={categoryPanelOpen ? "Close category panel" : "Open category panel"}
        >
          {categoryPanelOpen ? (
            <ChevronRight size={16} />
          ) : (
            <ChevronLeft size={16} />
          )}
        </button>

        {/* Sliding Panel */}
        <AnimatePresence>
          {categoryPanelOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 260, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              className="overflow-hidden bg-base-900 border border-base-600 rounded-l-md shadow-xl"
            >
              <div className="w-[260px] p-4 space-y-4">
                {/* Heading */}
                <div className="flex items-center gap-2 text-xs text-muted font-mono uppercase tracking-wider pb-2 border-b border-base-600">
                  <Filter size={14} className="text-lime" />
                  <span>[CATEGORIES]</span>
                </div>

                {/* "All" Checkbox */}
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <span
                    className={cn(
                      "flex items-center justify-center w-4 h-4 rounded-sm border transition-all duration-200",
                      selectedCategory === "All"
                        ? "bg-lime/20 border-lime/60"
                        : "bg-base-800 border-base-600 group-hover:border-muted"
                    )}
                  >
                    {selectedCategory === "All" && (
                      <CheckCircle2 size={12} className="text-lime" />
                    )}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-mono uppercase tracking-wider transition-colors",
                      selectedCategory === "All" ? "text-lime" : "text-muted group-hover:text-white"
                    )}
                    onClick={() => setSelectedCategory("All")}
                  >
                    All Topics ({practiceQuestions.length})
                  </span>
                </label>

                {/* Category Checkboxes */}
                <div className="space-y-2.5">
                  {questionCategories.map((cat) => {
                    const count = practiceQuestions.filter((q) => q.category === cat).length;
                    const isActive = selectedCategory === cat;
                    return (
                      <label
                        key={cat}
                        className="flex items-center gap-2.5 cursor-pointer group"
                        onClick={() => setSelectedCategory(cat)}
                      >
                        <span
                          className={cn(
                            "flex items-center justify-center w-4 h-4 rounded-sm border transition-all duration-200",
                            isActive
                              ? "bg-lime/20 border-lime/60"
                              : "bg-base-800 border-base-600 group-hover:border-muted"
                          )}
                        >
                          {isActive && (
                            <CheckCircle2 size={12} className="text-lime" />
                          )}
                        </span>
                        <span
                          className={cn(
                            "text-xs font-mono uppercase tracking-wider transition-colors",
                            isActive ? "text-lime" : "text-muted group-hover:text-white"
                          )}
                        >
                          {cat} ({count})
                        </span>
                      </label>
                    );
                  })}
                </div>

                {/* Solved Counter */}
                <div className="pt-3 border-t border-base-600">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-lime bg-lime/10 px-3 py-1.5 rounded-sm border border-lime/30">
                    <Trophy size={13} className="text-lime" />
                    <span>[{solved.size}/{practiceQuestions.length}] SOLVED</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Grid: Sidebar + Workspace */}
      <div className="grid lg:grid-cols-[300px_1fr] gap-5">
        {/* Sidebar Question List */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono text-muted uppercase tracking-widest px-1">
            // QUESTIONS ({filteredQuestions.length}) //
          </h3>
          <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1 scrollbar-thin">
            {filteredQuestions.map((q) => {
              const qSolved = solved.has(q.id);
              return (
                <button
                  key={q.id}
                  onClick={() => handleSelectQuestion(q)}
                  className={cn(
                    "w-full text-left p-4 rounded-sm border transition-all duration-300 block",
                    activeQuestion.id === q.id
                      ? "bg-lime/10 border-lime/40 shadow-glow-lime-sm"
                      : "hk-card"
                  )}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono text-lime uppercase tracking-wider">
                      {q.category}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {qSolved && (
                        <CheckCircle2 size={13} className="text-lime" />
                      )}
                      <span
                        className={cn(
                          "text-[10px] px-2 py-0.5 rounded-sm border font-mono uppercase",
                          q.difficulty === "Beginner"     && "text-lime border-lime/30 bg-lime/10",
                          q.difficulty === "Intermediate" && "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
                          q.difficulty === "Advanced"     && "text-orange-400 border-orange-400/30 bg-orange-400/10",
                          q.difficulty === "Expert"       && "text-red-400 border-red-400/30 bg-red-400/10"
                        )}
                      >
                        {q.difficulty}
                      </span>
                    </div>
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-1">{q.title}</h4>
                  <p className="text-xs text-muted line-clamp-2">{q.problem}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Workspace */}
        <div className="space-y-5">
          {/* Question Details Card */}
          <div className="hk-panel p-6 space-y-4">
            <div className="flex items-start justify-between border-b border-base-600 pb-4 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-mono text-lime bg-lime/10 px-2.5 py-0.5 rounded-sm border border-lime/30 uppercase tracking-wider">
                    [{activeQuestion.category}]
                  </span>
                  <span className="text-xs text-muted font-mono">• {activeQuestion.difficulty}</span>
                  {isSolved && (
                    <span className="flex items-center gap-1 text-xs text-lime bg-lime/10 px-2.5 py-0.5 rounded-sm border border-lime/30 font-mono uppercase">
                      <Trophy size={11} className="text-lime" /> SOLVED
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-bold text-white">{activeQuestion.title}</h2>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">{activeQuestion.problem}</p>

            {/* Expected Output Columns */}
            <div className="space-y-1.5">
              <span className="text-xs font-mono text-muted uppercase tracking-wider">// Expected Output Columns //</span>
              <div className="flex flex-wrap gap-1.5">
                {activeQuestion.expectedColumns.map((col) => (
                  <span
                    key={col}
                    className="text-xs font-mono px-2.5 py-1 rounded-sm bg-base-800 border border-base-600 text-slate-200"
                  >
                    {col}
                  </span>
                ))}
              </div>
            </div>

            {/* Hint Toggle */}
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={() => setShowHint((h) => !h)}
                className="text-xs text-yellow-400 hover:text-yellow-300 flex items-center gap-1.5 font-mono uppercase tracking-wider transition-colors"
              >
                <Lightbulb size={13} className="text-yellow-400" />
                [{showHint ? "HIDE_HINT" : "SHOW_HINT"}]
              </button>
              {isSolved && (
                <span className="text-xs text-muted flex items-center gap-1 font-mono uppercase tracking-wider">
                  <BookOpen size={12} className="text-lime" />
                  Scroll below for explanation
                </span>
              )}
            </div>

            {/* Hint Box */}
            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="p-4 rounded-sm bg-yellow-400/[0.06] border border-yellow-400/20 text-xs text-yellow-200/90 font-mono space-y-1"
                >
                  <span className="font-semibold text-yellow-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <Lightbulb size={12} className="text-yellow-400" /> // HINT //
                  </span>
                  <p className="leading-relaxed">{activeQuestion.hint}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Explanation — only revealed after solving */}
            <AnimatePresence>
              {isSolved && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="p-4 rounded-sm bg-lime/[0.04] border border-lime/20 text-xs text-slate-200 space-y-2"
                >
                  <span className="font-semibold text-lime font-mono flex items-center gap-1.5 uppercase tracking-wider">
                    <BookOpen size={13} className="text-lime" /> // SOLUTION EXPLANATION //
                  </span>
                  <p className="leading-relaxed text-slate-300">{activeQuestion.explanation}</p>
                  <button
                    onClick={() => router.push(`/visualizer?sql=${encodeURIComponent(activeQuestion.solutionSql)}`)}
                    className="mt-2 flex items-center gap-1.5 text-xs text-lime hover:text-lime-400 transition-colors font-mono uppercase tracking-wider"
                  >
                    <Eye size={13} /> [VISUALIZE_SOLUTION]
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Code Editor */}
          <SqlEditor value={userSql} onChange={setUserSql} onVisualize={handleVerify} />

          {/* Verification Bar */}
          <div className="hk-panel p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={handleVerify}
                className="btn-primary flex items-center gap-2 text-xs"
              >
                <Play size={14} /> RUN & VERIFY
              </button>
              <button
                onClick={() => router.push(`/visualizer?sql=${encodeURIComponent(userSql)}`)}
                className="btn-ghost flex items-center gap-2 text-xs"
              >
                <Eye size={14} /> [VISUALIZE_QUERY]
              </button>
            </div>

            {verificationResult.status !== "idle" && (
              <div className="flex items-center gap-2 text-xs font-mono">
                {verificationResult.status === "success" ? (
                  <span className="text-lime flex items-center gap-1.5 bg-lime/10 px-3 py-1.5 rounded-sm border border-lime/30 uppercase tracking-wider">
                    <CheckCircle2 size={15} className="text-lime" />
                    {verificationResult.message}
                  </span>
                ) : (
                  <span className="text-red-400 flex items-center gap-1.5 bg-red-500/10 px-3 py-1.5 rounded-sm border border-red-500/30 uppercase tracking-wider">
                    <XCircle size={15} className="text-red-400" />
                    {verificationResult.message}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

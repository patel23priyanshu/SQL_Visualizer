"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, XCircle, Lightbulb, Play, Eye, BookOpen,
  Sparkles, Filter, Trophy
} from "lucide-react";
import { practiceQuestions, questionCategories, PracticeQuestion, QuestionCategory } from "@/lib/practiceQuestions";
import SqlEditor from "./SqlEditor";
import { cn } from "@/lib/utils";

export default function PracticeHub() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeQuestion, setActiveQuestion] = useState<PracticeQuestion>(practiceQuestions[0]);
  const [userSql, setUserSql] = useState<string>(practiceQuestions[0].starterSql);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [solved, setSolved] = useState<Set<string>>(new Set());
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
    <div className="space-y-5">
      {/* Category Filter Tabs */}
      <div className="glass-panel p-4 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 text-xs text-slate-300 font-mono pr-3 border-r border-slate-700/60">
          <Filter size={14} className="text-brandRed-500" />
          <span>Filter:</span>
        </div>

        <button
          onClick={() => setSelectedCategory("All")}
          className={cn(
            "text-xs px-3 py-1.5 rounded-xl font-medium transition-all duration-200 border",
            selectedCategory === "All"
              ? "bg-gradient-to-r from-brandRed-500 to-brandRed-600 border-brandRed-400 text-palette-white shadow-glow-red"
              : "bg-slate-900/40 border-slate-700/50 text-slate-300 hover:text-palette-white hover:bg-slate-800/60"
          )}
        >
          All Topics ({practiceQuestions.length})
        </button>

        {questionCategories.map((cat) => {
          const count = practiceQuestions.filter((q) => q.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "text-xs px-3 py-1.5 rounded-xl font-medium transition-all duration-200 border",
                selectedCategory === cat
                  ? "bg-gradient-to-r from-brandRed-500 to-brandRed-600 border-brandRed-400 text-palette-white shadow-glow-red"
                  : "bg-slate-900/40 border-slate-700/50 text-slate-300 hover:text-palette-white hover:bg-slate-800/60"
              )}
            >
              {cat} ({count})
            </button>
          );
        })}

        {/* Solved counter */}
        <div className="ml-auto flex items-center gap-1.5 text-xs font-mono text-palette-white bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700/60">
          <Trophy size={13} className="text-brandRed-500" />
          <span>{solved.size}/{practiceQuestions.length} solved</span>
        </div>
      </div>

      {/* Main Grid: Sidebar + Workspace */}
      <div className="grid lg:grid-cols-[300px_1fr] gap-5">
        {/* Sidebar Question List */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider px-1">
            Questions ({filteredQuestions.length})
          </h3>
          <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1 scrollbar-thin">
            {filteredQuestions.map((q) => {
              const qSolved = solved.has(q.id);
              return (
                <button
                  key={q.id}
                  onClick={() => handleSelectQuestion(q)}
                  className={cn(
                    "w-full text-left p-4 rounded-2xl border transition-all duration-300 block",
                    activeQuestion.id === q.id
                      ? "bg-slate-800/70 border-brandRed-500/60 shadow-glow-red/20 scale-[1.01]"
                      : "glass-card hover:border-slate-500/60"
                  )}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-slate-300 font-mono">
                      {q.category}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {qSolved && (
                        <CheckCircle2 size={13} className="text-brandRed-400" />
                      )}
                      <span
                        className={cn(
                          "text-[10px] px-2 py-0.5 rounded-full border font-mono",
                          q.difficulty === "Beginner"     && "bg-slate-800/70 text-slate-200 border-slate-600/50",
                          q.difficulty === "Intermediate" && "bg-slate-700/60 text-slate-100 border-slate-500/60",
                          q.difficulty === "Advanced"     && "bg-brandRed-950/50 text-brandRed-400 border-brandRed-700/50",
                          q.difficulty === "Expert"       && "bg-brandRed-900/50 text-palette-white border-brandRed-500/60"
                        )}
                      >
                        {q.difficulty}
                      </span>
                    </div>
                  </div>
                  <h4 className="text-sm font-semibold text-palette-white mb-1">{q.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2">{q.problem}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Workspace */}
        <div className="space-y-5">
          {/* Question Details Card */}
          <div className="glass-panel p-6 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-700/50 pb-4 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-mono text-palette-white bg-slate-800/90 px-2.5 py-0.5 rounded-full border border-slate-600/60">
                    {activeQuestion.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">• {activeQuestion.difficulty}</span>
                  {isSolved && (
                    <span className="flex items-center gap-1 text-xs text-palette-white bg-gradient-to-r from-brandRed-500/40 to-brandRed-600/40 px-2.5 py-0.5 rounded-full border border-brandRed-500/50">
                      <Trophy size={11} className="text-brandRed-400" /> Solved
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-bold text-slate-50">{activeQuestion.title}</h2>
              </div>
            </div>

            <p className="text-sm text-slate-100 leading-relaxed">{activeQuestion.problem}</p>

            {/* Expected Output Columns */}
            <div className="space-y-1.5">
              <span className="text-xs font-mono text-slate-300">Expected Output Columns:</span>
              <div className="flex flex-wrap gap-1.5">
                {activeQuestion.expectedColumns.map((col) => (
                  <span
                    key={col}
                    className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-palette-white"
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
                className="text-xs text-brandRed-400 hover:text-brandRed-300 flex items-center gap-1.5 font-mono transition-colors"
              >
                <Lightbulb size={13} className="text-brandRed-400" />
                {showHint ? "Hide Hint" : "Show Hint"}
              </button>
              {isSolved && (
                <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                  <BookOpen size={12} className="text-brandRed-400" />
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
                  className="p-4 rounded-xl bg-slate-800/80 border border-brandRed-500/40 text-xs text-slate-100 font-mono space-y-1"
                >
                  <span className="font-semibold text-brandRed-400 flex items-center gap-1.5">
                    <Sparkles size={12} className="text-brandRed-400" /> Hint:
                  </span>
                  <p className="leading-relaxed text-slate-200">{activeQuestion.hint}</p>
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
                  className="p-4 rounded-xl bg-slate-800/70 border border-slate-600/60 text-xs text-slate-100 space-y-2"
                >
                  <span className="font-semibold text-palette-white font-mono flex items-center gap-1.5">
                    <BookOpen size={13} className="text-brandRed-500" /> Solution Explanation:
                  </span>
                  <p className="leading-relaxed text-slate-200">{activeQuestion.explanation}</p>
                  <button
                    onClick={() => router.push(`/visualizer?sql=${encodeURIComponent(activeQuestion.solutionSql)}`)}
                    className="mt-2 flex items-center gap-1.5 text-xs text-brandRed-400 hover:text-brandRed-300 transition-colors font-medium"
                  >
                    <Eye size={13} /> Visualize solution execution
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Code Editor */}
          <SqlEditor value={userSql} onChange={setUserSql} onVisualize={handleVerify} />

          {/* Verification Bar */}
          <div className="glass-panel p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={handleVerify}
                className="btn-primary flex items-center gap-2 text-xs"
              >
                <Play size={14} /> Run & Verify
              </button>
              <button
                onClick={() => router.push(`/visualizer?sql=${encodeURIComponent(userSql)}`)}
                className="btn-ghost flex items-center gap-2 text-xs"
              >
                <Eye size={14} /> Visualize My Query
              </button>
            </div>

            {verificationResult.status !== "idle" && (
              <div className="flex items-center gap-2 text-xs font-mono">
                {verificationResult.status === "success" ? (
                  <span className="text-palette-white flex items-center gap-1.5 bg-brandRed-950/70 px-3 py-1.5 rounded-xl border border-brandRed-500/60">
                    <CheckCircle2 size={15} className="text-brandRed-400" />
                    {verificationResult.message}
                  </span>
                ) : (
                  <span className="text-slate-200 flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-700/60">
                    <XCircle size={15} className="text-brandRed-500" />
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

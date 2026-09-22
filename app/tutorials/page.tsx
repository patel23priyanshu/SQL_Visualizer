"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Filter,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  FileText,
  Lock,
} from "lucide-react";
import {
  tutorialTopics,
  tutorialCategories,
  TutorialCategory,
} from "@/lib/tutorialTopics";
import { cn } from "@/lib/utils";

export default function TutorialsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [categoryPanelOpen, setCategoryPanelOpen] = useState(false);

  const filteredTopics =
    selectedCategory === "All"
      ? tutorialTopics
      : tutorialTopics.filter((t) => t.category === selectedCategory);

  return (
    <main className="min-h-screen pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="border-b border-base-600 pb-4 sm:pb-6">
        <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-mono text-lime bg-lime/10 border border-lime/30 rounded-sm px-2.5 sm:px-3 py-1 mb-2 uppercase tracking-widest">
          <span className="text-lime">■</span>
          SQL Learning Tutorials
        </div>
        <h1 className="text-lg sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2 sm:gap-3 font-mono uppercase">
          <BookOpen size={20} className="text-lime shrink-0 sm:w-6 sm:h-6" />
          // SQL TUTORIALS //
        </h1>
        <p className="text-xs sm:text-sm text-muted mt-1 font-mono">
          Learn SQL step-by-step through small, focused topics. Read each article to build your foundation from basics to advanced queries.
        </p>
      </div>

      {/* ── Collapsible Category Sidebar (Right Edge) — desktop only ── */}
      <div className="hidden md:flex fixed right-0 top-1/2 -translate-y-1/2 z-50 items-center">
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
                <label
                  className="flex items-center gap-2.5 cursor-pointer group"
                  onClick={() => setSelectedCategory("All")}
                >
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
                      selectedCategory === "All"
                        ? "text-lime"
                        : "text-muted group-hover:text-white"
                    )}
                  >
                    All Topics ({tutorialTopics.length})
                  </span>
                </label>

                {/* Category Checkboxes */}
                <div className="space-y-2.5">
                  {tutorialCategories.map((cat) => {
                    const count = tutorialTopics.filter(
                      (t) => t.category === cat
                    ).length;
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
                            isActive
                              ? "text-lime"
                              : "text-muted group-hover:text-white"
                          )}
                        >
                          {cat} ({count})
                        </span>
                      </label>
                    );
                  })}
                </div>

                {/* Topic counter */}
                <div className="pt-3 border-t border-base-600">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-lime bg-lime/10 px-3 py-1.5 rounded-sm border border-lime/30">
                    <FileText size={13} className="text-lime" />
                    <span>[{tutorialTopics.length}] TOPICS TOTAL</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Mobile Category Filter (inline) ── */}
      <div className="md:hidden">
        <div className="hk-panel p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs text-muted font-mono uppercase tracking-wider">
              <Filter size={13} className="text-lime" />
              <span>[FILTER]</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-lime bg-lime/10 px-2 py-0.5 rounded-sm border border-lime/30">
              <FileText size={11} className="text-lime" />
              <span>[{tutorialTopics.length}] TOPICS</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedCategory("All")}
              className={cn(
                "text-[10px] px-2 py-1 rounded-sm font-mono uppercase tracking-wider transition-all duration-200 border",
                selectedCategory === "All"
                  ? "bg-lime/15 border-lime/50 text-lime"
                  : "bg-base-800 border-base-600 text-muted"
              )}
            >
              All ({tutorialTopics.length})
            </button>
            {tutorialCategories.map((cat) => {
              const count = tutorialTopics.filter(
                (t) => t.category === cat
              ).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "text-[10px] px-2 py-1 rounded-sm font-mono uppercase tracking-wider transition-all duration-200 border",
                    selectedCategory === cat
                      ? "bg-lime/15 border-lime/50 text-lime"
                      : "bg-base-800 border-base-600 text-muted"
                  )}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Topics Header ── */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-mono text-muted uppercase tracking-widest px-1">
          // {selectedCategory === "All" ? "ALL TOPICS" : selectedCategory.toUpperCase()} ({filteredTopics.length}) //
        </h3>
      </div>

      {/* ── Topics Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {filteredTopics.map((topic, index) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03, duration: 0.2 }}
            className="hk-card p-4 sm:p-5 flex flex-col justify-between group cursor-pointer"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-xs font-mono text-lime uppercase tracking-wider">
                  [{topic.category}]
                </span>
                <Lock size={12} className="text-muted/50" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white font-mono">
                {topic.title}
              </h3>
              <p className="text-[10px] sm:text-xs text-muted font-mono leading-relaxed">
                {topic.description}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-base-600/50 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono text-muted uppercase tracking-wider">
                <FileText size={11} className="text-muted/60" />
                <span>COMING SOON</span>
              </div>
              <span className="text-[10px] font-mono text-lime/40 uppercase tracking-wider">
                [{topic.id.replace("sql-", "").replace(/-/g, "_")}]
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty state when filter returns 0 */}
      {filteredTopics.length === 0 && (
        <div className="hk-panel p-8 sm:p-12 text-center">
          <BookOpen size={36} className="text-muted/30 mx-auto mb-3" />
          <p className="text-sm text-muted font-mono uppercase tracking-wider">
            No topics found in this category
          </p>
        </div>
      )}
    </main>
  );
}

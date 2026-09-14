// Core engine: parses a SQL query and derives the *logical execution order*
// of its clauses (as the SQL engine evaluates them), independent of the
// order they were written in.

import { Parser } from "node-sql-parser";

export type ClauseKey =
  | "FROM"
  | "JOIN"
  | "WHERE"
  | "GROUP BY"
  | "HAVING"
  | "SELECT"
  | "DISTINCT"
  | "ORDER BY"
  | "LIMIT";

export interface ExecutionStep {
  key: ClauseKey;
  label: string;
  present: boolean;
  detail: string; // human-readable summary of what this clause does here
  tip: string; // learning-mode explanation
}

export interface AnalysisResult {
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  joinCount: number;
  subqueryCount: number;
  cteCount: number;
  aggregateCount: number;
  windowFunctionCount: number;
  readabilityScore: number; // 0-100
  estimatedComplexity: "Low" | "Moderate" | "High" | "Very High";
}

export interface ParsedQuery {
  steps: ExecutionStep[];
  analysis: AnalysisResult;
  ast: unknown;
  error?: string;
}

const AGG_FNS = ["SUM", "AVG", "COUNT", "MIN", "MAX"];
const WINDOW_HINTS = ["OVER", "ROW_NUMBER", "RANK", "DENSE_RANK", "LAG", "LEAD", "NTILE"];

function countOccurrences(sql: string, needle: string): number {
  const re = new RegExp(`\\b${needle}\\b`, "gi");
  return (sql.match(re) || []).length;
}

export function analyzeQuery(sql: string): AnalysisResult {
  const upper = sql.toUpperCase();

  const joinCount = countOccurrences(sql, "JOIN");
  const cteCount = /\bWITH\b/i.test(sql) ? (upper.match(/\bAS\s*\(/g) || []).length : 0;
  const subqueryCount = Math.max(
    (sql.match(/\(\s*SELECT/gi) || []).length - cteCount,
    0
  );
  const aggregateCount = AGG_FNS.reduce(
    (acc, fn) => acc + countOccurrences(sql, `${fn}\\s*\\(`.replace("\\s*\\(", "")),
    0
  );
  const windowFunctionCount = WINDOW_HINTS.reduce(
    (acc, kw) => acc + countOccurrences(sql, kw),
    0
  );

  const complexityScore =
    joinCount * 2 +
    subqueryCount * 3 +
    cteCount * 2 +
    aggregateCount * 1 +
    windowFunctionCount * 3;

  let difficulty: AnalysisResult["difficulty"] = "Beginner";
  if (complexityScore > 15) difficulty = "Expert";
  else if (complexityScore > 8) difficulty = "Advanced";
  else if (complexityScore > 3) difficulty = "Intermediate";

  let estimatedComplexity: AnalysisResult["estimatedComplexity"] = "Low";
  if (complexityScore > 15) estimatedComplexity = "Very High";
  else if (complexityScore > 8) estimatedComplexity = "High";
  else if (complexityScore > 3) estimatedComplexity = "Moderate";

  // crude readability heuristic: shorter lines, consistent casing, fewer nested parens = higher score
  const lines = sql.split("\n").filter(Boolean);
  const avgLineLen = lines.length
    ? lines.reduce((a, l) => a + l.length, 0) / lines.length
    : sql.length;
  const nestingDepth = Math.max(...Array.from(sql).reduce(
    (acc: number[], ch, i, arr) => {
      let depth = acc.length ? acc[acc.length - 1] : 0;
      if (ch === "(") depth++;
      if (ch === ")") depth--;
      acc.push(depth);
      return acc;
    },
    [] as number[]
  ), 0);

  let readabilityScore = 100 - Math.min(avgLineLen / 2, 30) - nestingDepth * 8 - subqueryCount * 5;
  readabilityScore = Math.max(5, Math.min(100, Math.round(readabilityScore)));

  return {
    difficulty,
    joinCount,
    subqueryCount,
    cteCount,
    aggregateCount,
    windowFunctionCount,
    readabilityScore,
    estimatedComplexity,
  };
}

export function parseQuery(sql: string): ParsedQuery {
  const trimmed = sql.trim();
  const analysis = analyzeQuery(trimmed);

  let ast: unknown = null;
  let error: string | undefined;

  if (trimmed) {
    try {
      const parser = new Parser();
      ast = parser.astify(trimmed, { database: "postgresql" });
    } catch (e) {
      try {
        // fall back to generic dialect if postgres-specific syntax fails
        const parser = new Parser();
        ast = parser.astify(trimmed, { database: "mysql" });
      } catch (e2) {
        error = e instanceof Error ? e.message : "Could not parse this query.";
      }
    }
  }

  const upper = trimmed.toUpperCase();
  const has = (kw: string) => new RegExp(`\\b${kw}\\b`, "i").test(trimmed);

  const steps: ExecutionStep[] = [
    {
      key: "FROM",
      label: "FROM",
      present: has("FROM"),
      detail: "Identify the base table(s) the query reads from.",
      tip: "FROM runs first — the engine needs a working set of rows before it can filter, join, or select anything.",
    },
    {
      key: "JOIN",
      label: "JOIN",
      present: has("JOIN"),
      detail: `Combine rows across tables${
        analysis.joinCount ? ` (${analysis.joinCount} join${analysis.joinCount > 1 ? "s" : ""} detected)` : ""
      }.`,
      tip: "Joins happen right after FROM, building a single combined row set before any filtering occurs.",
    },
    {
      key: "WHERE",
      label: "WHERE",
      present: has("WHERE"),
      detail: "Filter individual rows before any grouping happens.",
      tip: "WHERE vs HAVING: WHERE filters raw rows before grouping; it cannot reference aggregate results like COUNT(*) or SUM(x).",
    },
    {
      key: "GROUP BY",
      label: "GROUP BY",
      present: has("GROUP\\s+BY"),
      detail: "Collapse rows into groups based on shared column values.",
      tip: "GROUP BY runs after WHERE — it groups only the rows that survived filtering.",
    },
    {
      key: "HAVING",
      label: "HAVING",
      present: has("HAVING"),
      detail: "Filter entire groups, typically using aggregate conditions.",
      tip: "HAVING vs WHERE: HAVING filters after grouping, so it CAN reference aggregates like COUNT(*) > 5.",
    },
    {
      key: "SELECT",
      label: "SELECT",
      present: true,
      detail: "Compute the final output columns and expressions.",
      tip: "Even though SELECT is written first, it's evaluated late — after rows are filtered and grouped, but before final sorting.",
    },
    {
      key: "DISTINCT",
      label: "DISTINCT",
      present: has("DISTINCT"),
      detail: "Remove duplicate rows from the SELECT output.",
      tip: "DISTINCT operates on the already-computed SELECT output, so it comes right after SELECT.",
    },
    {
      key: "ORDER BY",
      label: "ORDER BY",
      present: has("ORDER\\s+BY"),
      detail: "Sort the final result set.",
      tip: "ORDER BY can reference SELECT aliases because it runs after SELECT has computed the output columns.",
    },
    {
      key: "LIMIT",
      label: "LIMIT",
      present: has("LIMIT") || has("OFFSET") || has("FETCH"),
      detail: "Trim the sorted result down to the requested number of rows.",
      tip: "LIMIT executes last — it can only truncate a result set that's already been filtered, grouped, and sorted.",
    },
  ];

  return { steps, analysis, ast, error };
}

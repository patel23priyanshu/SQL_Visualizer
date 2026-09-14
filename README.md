# SQL Query Visualizer

An educational web app that turns any SQL query into an animated, explained breakdown
of how it actually executes.

## What's included (MVP scaffold)

- **Landing page** (`app/page.tsx`) — hero, feature cards, example queries, CTA
- **Playground** (`app/playground/page.tsx`) — Monaco SQL editor + live visualization
- **Execution engine** (`lib/executionOrder.ts`) — parses SQL (via `node-sql-parser`)
  and derives the logical execution order: FROM → JOIN → WHERE → GROUP BY → HAVING →
  SELECT → DISTINCT → ORDER BY → LIMIT
- **ExecutionVisualizer** — animated step-through with play/pause/replay/next/prev
- **QueryExplainer** — plain-English clause breakdown cards
- **QueryTree** — collapsible execution tree
- **AnalysisPanel** — join/subquery/CTE/aggregate/window-function counts, difficulty,
  readability score, estimated complexity
- Dark-mode glassmorphism design system in `app/globals.css` / `tailwind.config.ts`

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## What's stubbed / next steps

This is a working foundation, not the full "Expected Result" from the spec. Things
intentionally left for the next pass:

1. **Deeper AST-driven explanations** — right now clause detection uses the parsed AST
   plus regex fallbacks for detail text. Wiring the explainer strings directly off the
   `node-sql-parser` AST (per clause, per table/column) will make explanations accurate
   for edge cases (nested subqueries, multiple CTEs, complex CASE expressions).
2. **Interactive table simulation** — the spec's "animated tables and cards" showing
   actual row filtering/grouping/joining isn't built yet. Needs sample data + a
   step-synced table component.
3. **UNION / INTERSECT / EXCEPT / window function nodes** in the execution flow —
   currently these are detected in analysis but not yet given their own animated step.
4. **shadcn/ui components** — the spec calls for shadcn/ui; this scaffold uses
   hand-rolled Tailwind components with the same visual language so it works with zero
   extra setup. Swapping in shadcn primitives (Button, Card, Tooltip, Collapsible) is a
   drop-in upgrade.
5. **Recursive CTE handling** in the execution engine — detected in analysis, not yet
   broken into its own visual sub-flow.
6. **Tests** — none yet; `lib/executionOrder.ts` is the highest-value target for unit
   tests since everything else depends on it.

## Tech stack

Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS · Framer Motion ·
Monaco Editor · node-sql-parser · sql-formatter · lucide-react

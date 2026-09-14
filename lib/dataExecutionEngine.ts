import { sampleEmployees, SampleRow } from "./sampleData";

export interface EvaluatedRow {
  row: Record<string, any>;
  passed: boolean;
  filterReason?: string;
  groupKey?: string;
  partitionKey?: string;
}

export interface StepDataResult {
  stepKey: string;
  stepLabel: string;
  description: string;
  columns: string[];
  rows: EvaluatedRow[];
  summaryText: string;
}

// ─── SQL Condition Parser ──────────────────────────────────────────────────────
// Parses the WHERE clause from SQL and returns a filter function
function parseWhereConditions(sql: string): ((r: SampleRow) => { passed: boolean; reason: string }) {
  const whereMatch = sql.match(/WHERE\s+([\s\S]+?)(?:\s+GROUP\s+BY|\s+HAVING|\s+ORDER\s+BY|\s+LIMIT|$)/i);
  if (!whereMatch) return () => ({ passed: true, reason: "No filter" });

  const clause = whereMatch[1].trim();

  // Parse individual condition tokens
  const conditions = parseConditionClause(clause);

  return (r: SampleRow) => {
    const results = conditions.map((cond) => evaluateCondition(cond, r));
    const allPassed = results.every((res) => res.passed);
    const reasons = results.map((res) => res.reason).join(" AND ");
    return { passed: allPassed, reason: reasons };
  };
}

interface Condition {
  field: string;
  op: string;
  value: string | number;
  logic?: "AND" | "OR";
}

function parseConditionClause(clause: string): Condition[] {
  const conditions: Condition[] = [];
  // Match: field op value (handles AND/OR splitting)
  const parts = clause.split(/\b(AND|OR)\b/i);

  parts.forEach((part, i) => {
    const trimmed = part.trim();
    if (trimmed === "AND" || trimmed === "OR") return;

    // Match: column operator value
    const match = trimmed.match(
      /(\w+)\s*(>=|<=|!=|<>|>|<|=|LIKE|IN)\s*(?:'([^']*)'|(\d+(?:\.\d+)?))/i
    );
    if (match) {
      const [, field, op, strVal, numVal] = match;
      const value = numVal !== undefined ? parseFloat(numVal) : strVal;
      const logic = i > 0 && parts[i - 1]?.trim().toUpperCase() === "OR" ? "OR" : "AND";
      conditions.push({ field: field.toLowerCase(), op: op.toUpperCase(), value, logic });
    }
  });

  return conditions;
}

function evaluateCondition(cond: Condition, row: SampleRow): { passed: boolean; reason: string } {
  const fieldMap: Record<string, keyof SampleRow> = {
    salary: "salary",
    rating: "rating",
    department: "department",
    name: "name",
    id: "id",
  };

  const key = fieldMap[cond.field];
  if (!key) return { passed: true, reason: `unknown field ${cond.field}` };

  const rowVal = row[key];
  const condVal = cond.value;
  let passed = false;

  switch (cond.op) {
    case ">":  passed = (rowVal as number) > (condVal as number); break;
    case ">=": passed = (rowVal as number) >= (condVal as number); break;
    case "<":  passed = (rowVal as number) < (condVal as number); break;
    case "<=": passed = (rowVal as number) <= (condVal as number); break;
    case "=":  passed = String(rowVal).toLowerCase() === String(condVal).toLowerCase(); break;
    case "!=":
    case "<>": passed = String(rowVal).toLowerCase() !== String(condVal).toLowerCase(); break;
    case "LIKE": {
      const pattern = String(condVal).replace(/%/g, ".*").replace(/_/g, ".");
      passed = new RegExp(`^${pattern}$`, "i").test(String(rowVal));
      break;
    }
    default: passed = true;
  }

  const valDisplay = typeof condVal === "number" && cond.field === "salary"
    ? `$${Number(condVal).toLocaleString()}`
    : condVal;

  return {
    passed,
    reason: `${cond.field} ${cond.op} ${valDisplay}: ${passed ? "✓" : "✗"}`,
  };
}

// ─── Having Condition Parser ───────────────────────────────────────────────────
function parseHavingCondition(sql: string): (row: Record<string, any>) => { passed: boolean; reason: string } {
  const havingMatch = sql.match(/HAVING\s+([\s\S]+?)(?:\s+ORDER\s+BY|\s+LIMIT|$)/i);
  if (!havingMatch) return () => ({ passed: true, reason: "" });

  const clause = havingMatch[1].trim();

  // Match COUNT(*) > N style
  const countMatch = clause.match(/COUNT\s*\([^)]*\)\s*(>=|<=|!=|>|<|=)\s*(\d+)/i);
  if (countMatch) {
    const [, op, val] = countMatch;
    const threshold = parseInt(val);
    return (row) => {
      const count = row.employee_count ?? 0;
      const passed = evalNumOp(count, op, threshold);
      return { passed, reason: `COUNT(*) ${op} ${threshold}: ${passed ? "✓" : "✗"}` };
    };
  }

  // Match AVG(salary) > N style
  const avgMatch = clause.match(/AVG\s*\(\s*\w+\s*\)\s*(>=|<=|!=|>|<|=)\s*(\d+)/i);
  if (avgMatch) {
    const [, op, val] = avgMatch;
    const threshold = parseInt(val);
    return (row) => {
      const avg = row.avg_salary ?? 0;
      const passed = evalNumOp(avg, op, threshold);
      return { passed, reason: `AVG(salary) ${op} ${threshold}: ${passed ? "✓" : "✗"}` };
    };
  }

  return () => ({ passed: true, reason: "HAVING condition evaluated" });
}

function evalNumOp(a: number, op: string, b: number): boolean {
  switch (op) {
    case ">":  return a > b;
    case ">=": return a >= b;
    case "<":  return a < b;
    case "<=": return a <= b;
    case "=":  return a === b;
    case "!=": return a !== b;
    default:   return true;
  }
}

// ─── Window Function Parser ────────────────────────────────────────────────────
function detectWindowFunctions(sql: string): { type: string; partitionBy?: string; orderBy?: string; direction: "ASC" | "DESC" } {
  const upper = sql.toUpperCase();
  let type = "ROW_NUMBER";
  if (upper.includes("RANK()") || upper.includes("RANK(")) type = "RANK";
  if (upper.includes("DENSE_RANK")) type = "DENSE_RANK";
  if (upper.includes("ROW_NUMBER")) type = "ROW_NUMBER";

  const partitionMatch = sql.match(/PARTITION\s+BY\s+(\w+)/i);
  const orderMatch = sql.match(/OVER\s*\([^)]*ORDER\s+BY\s+(\w+)(?:\s+(ASC|DESC))?/i);

  return {
    type,
    partitionBy: partitionMatch?.[1]?.toLowerCase(),
    orderBy: orderMatch?.[1]?.toLowerCase(),
    direction: (orderMatch?.[2]?.toUpperCase() ?? "DESC") as "ASC" | "DESC",
  };
}

// ─── GROUP BY Column Parser ────────────────────────────────────────────────────
function detectGroupByColumn(sql: string): string {
  const match = sql.match(/GROUP\s+BY\s+(\w+(?:\.\w+)?)/i);
  return match?.[1]?.toLowerCase().replace(/^\w+\./, "") ?? "department";
}

// ─── ORDER BY Parser ───────────────────────────────────────────────────────────
function detectOrderBy(sql: string): { column: string; direction: "ASC" | "DESC" } | null {
  const match = sql.match(/ORDER\s+BY\s+(\w+(?:\.\w+)?(?:\s*\(\s*[^)]*\s*\))?)\s*(ASC|DESC)?/i);
  if (!match) return null;
  return {
    column: match[1].trim().toLowerCase().replace(/^\w+\./, ""),
    direction: (match[2]?.toUpperCase() ?? "DESC") as "ASC" | "DESC",
  };
}

// ─── Main Evaluator ────────────────────────────────────────────────────────────
export function evaluateDataFlow(sql: string): StepDataResult[] {
  const upper = sql.toUpperCase();
  const steps: StepDataResult[] = [];
  const stepNum = { n: 1 };

  // STEP 1: FROM
  let currentRows: EvaluatedRow[] = sampleEmployees.map((emp) => ({
    row: { ...emp },
    passed: true,
  }));

  steps.push({
    stepKey: "FROM",
    stepLabel: `${stepNum.n++}. FROM employees`,
    description: "Loads all 10 rows from the sample employees table.",
    columns: ["id", "name", "department", "salary", "rating"],
    rows: currentRows,
    summaryText: "10 rows loaded — ready for execution pipeline.",
  });

  // STEP 2: WHERE
  const hasWhere = /\bWHERE\b/i.test(sql);
  if (hasWhere) {
    const filterFn = parseWhereConditions(sql);
    const wherePassed = currentRows.map((item) => {
      const result = filterFn(item.row as SampleRow);
      return { ...item, passed: result.passed, filterReason: result.reason };
    });

    const passedCount = wherePassed.filter((r) => r.passed).length;
    steps.push({
      stepKey: "WHERE",
      stepLabel: `${stepNum.n++}. WHERE Filter`,
      description: "Evaluates your WHERE condition row-by-row. Passing rows highlighted, filtered rows dimmed.",
      columns: ["id", "name", "department", "salary", "rating"],
      rows: wherePassed,
      summaryText: `${passedCount} of ${currentRows.length} rows passed the WHERE condition. ${currentRows.length - passedCount} filtered out.`,
    });
    currentRows = wherePassed;
  }

  let workingSet = currentRows.filter((r) => r.passed);

  // STEP 3: GROUP BY
  const hasGroupBy = /\bGROUP\s+BY\b/i.test(sql);
  let groupedRows: EvaluatedRow[] = [];
  const groupByCol = detectGroupByColumn(sql);

  if (hasGroupBy) {
    const groups: Record<string, Record<string, any>[]> = {};
    workingSet.forEach((item) => {
      const key = String(item.row[groupByCol] ?? "unknown");
      if (!groups[key]) groups[key] = [];
      groups[key].push(item.row);
    });

    groupedRows = Object.entries(groups).map(([grpKey, members]) => {
      const count = members.length;
      const salaries = members.map((m) => m.salary ?? 0);
      const ratings = members.map((m) => m.rating ?? 0);
      return {
        row: {
          [groupByCol]: grpKey,
          employee_count: count,
          avg_salary: Math.round(salaries.reduce((a, b) => a + b, 0) / count),
          total_salary: salaries.reduce((a, b) => a + b, 0),
          max_rating: Math.max(...ratings),
          min_salary: Math.min(...salaries),
          max_salary: Math.max(...salaries),
        },
        passed: true,
        groupKey: grpKey,
      };
    });

    steps.push({
      stepKey: "GROUP_BY",
      stepLabel: `${stepNum.n++}. GROUP BY ${groupByCol}`,
      description: `Collapses individual rows into groups by "${groupByCol}", computing COUNT, AVG, SUM, MAX per group.`,
      columns: [groupByCol, "employee_count", "avg_salary", "max_rating"],
      rows: groupedRows,
      summaryText: `${workingSet.length} rows collapsed into ${groupedRows.length} groups by ${groupByCol}.`,
    });
  }

  // STEP 4: HAVING
  const hasHaving = /\bHAVING\b/i.test(sql);
  if (hasGroupBy && hasHaving) {
    const havingFn = parseHavingCondition(sql);
    const havingRows = groupedRows.map((g) => {
      const result = havingFn(g.row);
      return { ...g, passed: result.passed, filterReason: result.reason };
    });

    const passed = havingRows.filter((r) => r.passed).length;
    steps.push({
      stepKey: "HAVING",
      stepLabel: `${stepNum.n++}. HAVING Filter`,
      description: "Filters aggregate groups based on your HAVING condition (evaluated after GROUP BY).",
      columns: [groupByCol, "employee_count", "avg_salary", "max_rating"],
      rows: havingRows,
      summaryText: `${passed} of ${groupedRows.length} groups passed the HAVING condition.`,
    });
    groupedRows = havingRows;
  }

  // STEP 5: SELECT / Window Functions
  const hasWindow = /\bOVER\s*\(/i.test(sql);
  let selectRows = hasGroupBy ? groupedRows.filter((r) => r.passed) : workingSet;

  if (hasWindow) {
    const wf = detectWindowFunctions(sql);
    const partKey = wf.partitionBy ?? "department";
    const sortKey = wf.orderBy ?? "salary";

    // Sort within each partition
    const partitions: Record<string, EvaluatedRow[]> = {};
    selectRows.forEach((item) => {
      const pk = String(item.row[partKey] ?? "all");
      if (!partitions[pk]) partitions[pk] = [];
      partitions[pk].push(item);
    });

    const winRows: EvaluatedRow[] = [];
    let globalRowNum = 1;

    Object.entries(partitions).forEach(([pk, members]) => {
      const sorted = [...members].sort((a, b) => {
        const aVal = a.row[sortKey] ?? 0;
        const bVal = b.row[sortKey] ?? 0;
        return wf.direction === "DESC" ? (bVal - aVal) : (aVal - bVal);
      });

      let rank = 1;
      let denseRank = 1;
      let prevVal: any = undefined;

      sorted.forEach((item, idx) => {
        const currVal = item.row[sortKey];
        if (idx > 0 && currVal !== prevVal) {
          denseRank++;
          rank = idx + 1;
        }
        prevVal = currVal;

        const wfValue = wf.type === "DENSE_RANK" ? denseRank : wf.type === "RANK" ? rank : idx + 1;
        const wfLabel = wf.type === "ROW_NUMBER" ? "row_num" : wf.type === "RANK" ? "rank_in_dept" : "dense_rank";

        winRows.push({
          ...item,
          row: { ...item.row, [wfLabel]: wfValue, row_num: globalRowNum },
          partitionKey: pk,
        });
        globalRowNum++;
      });
    });

    const wfLabel = wf.type === "ROW_NUMBER" ? "row_num" : wf.type === "RANK" ? "rank_in_dept" : "dense_rank";
    const baseCols = hasGroupBy
      ? [groupByCol, "employee_count", "avg_salary", wfLabel]
      : ["id", "name", "department", "salary", wfLabel, "row_num"];

    steps.push({
      stepKey: "SELECT_WINDOW",
      stepLabel: `${stepNum.n++}. SELECT + ${wf.type}() OVER (PARTITION BY ${partKey})`,
      description: `Calculates ${wf.type}() window function within each "${partKey}" partition, ordered by ${sortKey} ${wf.direction}.`,
      columns: baseCols,
      rows: winRows,
      summaryText: `Window function computed across ${Object.keys(partitions).length} partition(s).`,
    });
    selectRows = winRows;
  } else if (!hasGroupBy) {
    const selCols = ["id", "name", "department", "salary", "rating"];
    steps.push({
      stepKey: "SELECT",
      stepLabel: `${stepNum.n++}. SELECT`,
      description: "Projects final output columns from the active row set.",
      columns: selCols,
      rows: selectRows,
      summaryText: `${selectRows.length} rows projected for output.`,
    });
  }

  // STEP 6: ORDER BY & LIMIT
  const orderBy = detectOrderBy(sql);
  const hasLimit = /\bLIMIT\b/i.test(sql);

  if (orderBy || hasLimit) {
    const prevStep = steps[steps.length - 1];
    let finalRows = prevStep.rows.filter((r) => r.passed);

    if (orderBy) {
      finalRows = [...finalRows].sort((a, b) => {
        const aVal = a.row[orderBy.column] ?? a.row["salary"] ?? 0;
        const bVal = b.row[orderBy.column] ?? b.row["salary"] ?? 0;
        if (typeof aVal === "number") {
          return orderBy.direction === "DESC" ? bVal - aVal : aVal - bVal;
        }
        return orderBy.direction === "DESC"
          ? String(bVal).localeCompare(String(aVal))
          : String(aVal).localeCompare(String(bVal));
      });
    }

    if (hasLimit) {
      const limitMatch = sql.match(/LIMIT\s+(\d+)/i);
      const limitVal = limitMatch ? parseInt(limitMatch[1]) : 5;
      finalRows = finalRows.slice(0, limitVal);
    }

    const label = [orderBy && `ORDER BY ${orderBy.column} ${orderBy.direction}`, hasLimit && "LIMIT"].filter(Boolean).join(" + ");
    steps.push({
      stepKey: "ORDER_LIMIT",
      stepLabel: `${stepNum.n++}. ${label}`,
      description: `Sorts rows${hasLimit ? " and truncates to LIMIT" : ""}.`,
      columns: prevStep.columns,
      rows: finalRows,
      summaryText: `Final result: ${finalRows.length} row(s)${hasLimit ? " (after LIMIT)" : ""}.`,
    });
  }

  return steps;
}

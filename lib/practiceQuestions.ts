export type QuestionCategory =
  | "Window Functions"
  | "Ranking Window Functions"
  | "Aggregate Functions"
  | "Joins & Filtering"
  | "Subqueries & CTEs";

export interface PracticeQuestion {
  id: string;
  title: string;
  category: QuestionCategory;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  problem: string;
  starterSql: string;
  solutionSql: string;
  hint: string;
  explanation: string;
  expectedColumns: string[];
  expectedRows: Record<string, any>[];
}

export const questionCategories: QuestionCategory[] = [
  "Window Functions",
  "Ranking Window Functions",
  "Aggregate Functions",
  "Joins & Filtering",
  "Subqueries & CTEs",
];

export const practiceQuestions: PracticeQuestion[] = [
  {
    id: "rank-1",
    title: "Department Salary Ranking",
    category: "Ranking Window Functions",
    difficulty: "Intermediate",
    problem:
      "Write a query to calculate the salary rank of each employee within their department using a ranking window function. Sort results by department and rank.",
    starterSql: `-- Write your query here
SELECT
  id,
  name,
  department,
  salary,
  -- Add your window function here
FROM employees
ORDER BY department, /* your rank column */;`,
    solutionSql: `SELECT
  id,
  name,
  department,
  salary,
  RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS dept_salary_rank
FROM employees
ORDER BY department, dept_salary_rank;`,
    hint: "Use RANK() with OVER (PARTITION BY department ORDER BY salary DESC) to rank employees within each department group.",
    explanation:
      "The PARTITION BY clause divides employees into department groups, and ORDER BY salary DESC orders them from highest to lowest within each department.",
    expectedColumns: ["id", "name", "department", "salary", "dept_salary_rank"],
    expectedRows: [
      { id: 107, name: "Grace Hopper", department: "Engineering", salary: 125000, dept_salary_rank: 1 },
      { id: 103, name: "Carol Danvers", department: "Engineering", salary: 110000, dept_salary_rank: 2 },
    ],
  },
  {
    id: "rank-2",
    title: "Top Earner per Department (DENSE_RANK)",
    category: "Ranking Window Functions",
    difficulty: "Advanced",
    problem:
      "Assign a unique row number and dense rank to all employees ordered by salary descending across the entire company. What's the difference between ROW_NUMBER and DENSE_RANK?",
    starterSql: `-- Write your query here
SELECT
  name,
  department,
  salary,
  -- Assign ROW_NUMBER ordered by salary DESC
  -- Assign DENSE_RANK ordered by salary DESC
FROM employees;`,
    solutionSql: `SELECT
  name,
  department,
  salary,
  ROW_NUMBER() OVER (ORDER BY salary DESC) AS row_num,
  DENSE_RANK() OVER (ORDER BY salary DESC) AS dense_rnk
FROM employees;`,
    hint: "Use both ROW_NUMBER() OVER (ORDER BY salary DESC) and DENSE_RANK() OVER (ORDER BY salary DESC) in the same SELECT. Remember: DENSE_RANK skips no numbers on ties.",
    explanation:
      "ROW_NUMBER() assigns 1, 2, 3... while DENSE_RANK() guarantees consecutive rank values without gaps after ties.",
    expectedColumns: ["name", "department", "salary", "row_num", "dense_rnk"],
    expectedRows: [
      { name: "Grace Hopper", department: "Engineering", salary: 125000, row_num: 1, dense_rnk: 1 },
      { name: "Carol Danvers", department: "Engineering", salary: 110000, row_num: 2, dense_rnk: 2 },
    ],
  },
  {
    id: "win-1",
    title: "Running Department Average",
    category: "Window Functions",
    difficulty: "Intermediate",
    problem:
      "Calculate each employee's salary alongside the average salary of their department without collapsing rows. Every row should still appear individually.",
    starterSql: `-- Write your query here
SELECT
  name,
  department,
  salary,
  -- Calculate department average salary as a window function
FROM employees;`,
    solutionSql: `SELECT
  name,
  department,
  salary,
  AVG(salary) OVER (PARTITION BY department) AS dept_avg_salary
FROM employees;`,
    hint: "Use AVG(salary) OVER (PARTITION BY department) — this computes a department-level average without removing individual rows (unlike GROUP BY).",
    explanation:
      "Unlike GROUP BY, Window Functions preserve individual rows while appending aggregated calculations alongside each row.",
    expectedColumns: ["name", "department", "salary", "dept_avg_salary"],
    expectedRows: [
      { name: "Alice Vance", department: "Engineering", salary: 95000, dept_avg_salary: 104500 },
    ],
  },
  {
    id: "agg-1",
    title: "Department Salary Metrics (GROUP BY)",
    category: "Aggregate Functions",
    difficulty: "Beginner",
    problem:
      "Find the total employee count, average salary, and maximum rating for each department. Only include departments with at least 3 employees.",
    starterSql: `-- Write your query here
SELECT
  department,
  -- Count employees
  -- Calculate average salary
  -- Find max rating
FROM employees
GROUP BY department
-- Filter groups with 3+ employees;`,
    solutionSql: `SELECT
  department,
  COUNT(*) AS employee_count,
  ROUND(AVG(salary), 2) AS avg_salary,
  MAX(rating) AS max_rating
FROM employees
GROUP BY department
HAVING COUNT(*) >= 3;`,
    hint: "Use GROUP BY department with COUNT(*), AVG(salary), MAX(rating) aggregates. Add HAVING COUNT(*) >= 3 to filter departments after grouping.",
    explanation:
      "WHERE filters raw rows before grouping, whereas HAVING filters aggregate groups after GROUP BY is applied.",
    expectedColumns: ["department", "employee_count", "avg_salary", "max_rating"],
    expectedRows: [
      { department: "Engineering", employee_count: 4, avg_salary: 104500, max_rating: 5.0 },
    ],
  },
  {
    id: "join-1",
    title: "High Value Employee Filtering",
    category: "Joins & Filtering",
    difficulty: "Beginner",
    problem:
      "Select employees with a salary over $70,000 AND a rating of at least 4.2. Return their id, name, department, salary, and rating — sorted by salary descending.",
    starterSql: `-- Write your query here
SELECT id, name, department, salary, rating
FROM employees
WHERE /* salary > ??? */ AND /* rating >= ??? */
ORDER BY salary DESC;`,
    solutionSql: `SELECT id, name, department, salary, rating
FROM employees
WHERE salary > 70000 AND rating >= 4.2
ORDER BY salary DESC;`,
    hint: "Combine two WHERE conditions with AND: salary > 70000 AND rating >= 4.2. Both must be true for a row to appear.",
    explanation:
      "WHERE evaluates conditions on each individual row before any sorting or projection. Both conditions must be satisfied simultaneously.",
    expectedColumns: ["id", "name", "department", "salary", "rating"],
    expectedRows: [
      { id: 107, name: "Grace Hopper", department: "Engineering", salary: 125000, rating: 5.0 },
    ],
  },
  {
    id: "cte-1",
    title: "CTE Above Average Earners",
    category: "Subqueries & CTEs",
    difficulty: "Advanced",
    problem:
      "Use a Common Table Expression (CTE) to first compute the company-wide average salary, then select all employees whose salary exceeds that average. Sort by salary descending.",
    starterSql: `-- Write your CTE here
WITH CompanyAvg AS (
  SELECT -- compute average salary here
  FROM employees
)
SELECT e.name, e.department, e.salary
FROM employees e, CompanyAvg c
WHERE -- filter using the CTE value
ORDER BY e.salary DESC;`,
    solutionSql: `WITH CompanyAvg AS (
  SELECT AVG(salary) AS avg_sal FROM employees
)
SELECT e.name, e.department, e.salary
FROM employees e, CompanyAvg c
WHERE e.salary > c.avg_sal
ORDER BY e.salary DESC;`,
    hint: "In the CTE, write SELECT AVG(salary) AS avg_sal FROM employees. Then in the main query, join with it and add WHERE e.salary > c.avg_sal.",
    explanation:
      "CTEs improve query readability and allow reusing intermediate computed sets across the main query. The WITH clause is evaluated first, then referenced like a table.",
    expectedColumns: ["name", "department", "salary"],
    expectedRows: [
      { name: "Grace Hopper", department: "Engineering", salary: 125000 },
      { name: "Carol Danvers", department: "Engineering", salary: 110000 },
    ],
  },
];

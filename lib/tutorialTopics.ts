export type TutorialCategory =
  | "Basics"
  | "Querying Data"
  | "Filtering & Sorting"
  | "Modifying Data"
  | "Aggregate Functions"
  | "Joins"
  | "Advanced Queries"
  | "Constraints & Keys";

export interface TutorialTopic {
  id: string;
  title: string;
  category: TutorialCategory;
  description: string;
  // content will be added later
}

export const tutorialCategories: TutorialCategory[] = [
  "Basics",
  "Querying Data",
  "Filtering & Sorting",
  "Modifying Data",
  "Aggregate Functions",
  "Joins",
  "Advanced Queries",
  "Constraints & Keys",
];

export const tutorialTopics: TutorialTopic[] = [
  // ─── Basics ───
  {
    id: "sql-intro",
    title: "SQL Intro",
    category: "Basics",
    description: "What is SQL, why it matters, and where it is used in real-world applications.",
  },
  {
    id: "sql-syntax",
    title: "SQL Syntax",
    category: "Basics",
    description: "Core SQL syntax rules, statement structure, keywords, and formatting conventions.",
  },
  {
    id: "sql-data-types",
    title: "SQL Data Types",
    category: "Basics",
    description: "Common data types like INT, VARCHAR, DATE, BOOLEAN and when to use each one.",
  },

  // ─── Querying Data ───
  {
    id: "sql-select",
    title: "SQL Select",
    category: "Querying Data",
    description: "Retrieve data from tables using the SELECT statement and column projection.",
  },
  {
    id: "sql-select-distinct",
    title: "SQL Select Distinct",
    category: "Querying Data",
    description: "Remove duplicate rows from results using SELECT DISTINCT.",
  },
  {
    id: "sql-select-top",
    title: "SQL Select Top",
    category: "Querying Data",
    description: "Limit the number of rows returned using TOP, LIMIT, or FETCH FIRST.",
  },
  {
    id: "sql-aliases",
    title: "SQL Aliases",
    category: "Querying Data",
    description: "Use AS to give temporary names to columns and tables for readability.",
  },

  // ─── Filtering & Sorting ───
  {
    id: "sql-where",
    title: "SQL Where",
    category: "Filtering & Sorting",
    description: "Filter rows based on conditions using the WHERE clause.",
  },
  {
    id: "sql-and",
    title: "SQL And",
    category: "Filtering & Sorting",
    description: "Combine multiple conditions where all must be true using AND.",
  },
  {
    id: "sql-or",
    title: "SQL Or",
    category: "Filtering & Sorting",
    description: "Combine conditions where at least one must be true using OR.",
  },
  {
    id: "sql-not",
    title: "SQL Not",
    category: "Filtering & Sorting",
    description: "Negate a condition to return rows that do not match using NOT.",
  },
  {
    id: "sql-order-by",
    title: "SQL Order By",
    category: "Filtering & Sorting",
    description: "Sort query results in ascending or descending order using ORDER BY.",
  },
  {
    id: "sql-like",
    title: "SQL Like",
    category: "Filtering & Sorting",
    description: "Pattern matching in WHERE clauses using LIKE with % and _ wildcards.",
  },
  {
    id: "sql-wildcards",
    title: "SQL Wildcards",
    category: "Filtering & Sorting",
    description: "Use wildcard characters for flexible pattern matching in queries.",
  },
  {
    id: "sql-in",
    title: "SQL In",
    category: "Filtering & Sorting",
    description: "Match a value against a list of values using the IN operator.",
  },
  {
    id: "sql-between",
    title: "SQL Between",
    category: "Filtering & Sorting",
    description: "Filter rows within a range of values using BETWEEN.",
  },

  // ─── Modifying Data ───
  {
    id: "sql-insert-into",
    title: "SQL Insert Into",
    category: "Modifying Data",
    description: "Add new rows to a table using INSERT INTO with column values.",
  },
  {
    id: "sql-update",
    title: "SQL Update",
    category: "Modifying Data",
    description: "Modify existing rows in a table using UPDATE with SET and WHERE.",
  },
  {
    id: "sql-delete",
    title: "SQL Delete",
    category: "Modifying Data",
    description: "Remove rows from a table using the DELETE statement with conditions.",
  },
  {
    id: "sql-null-values",
    title: "SQL Null Values",
    category: "Modifying Data",
    description: "Handle NULL values using IS NULL, IS NOT NULL, and COALESCE.",
  },

  // ─── Aggregate Functions ───
  {
    id: "sql-aggregate-functions",
    title: "SQL Aggregate Functions",
    category: "Aggregate Functions",
    description: "Overview of aggregate functions that compute a single result from a set of rows.",
  },
  {
    id: "sql-count",
    title: "SQL Count()",
    category: "Aggregate Functions",
    description: "Count the number of rows or non-null values using COUNT().",
  },
  {
    id: "sql-sum",
    title: "SQL Sum()",
    category: "Aggregate Functions",
    description: "Calculate the total sum of a numeric column using SUM().",
  },
  {
    id: "sql-avg",
    title: "SQL Avg()",
    category: "Aggregate Functions",
    description: "Calculate the average value of a numeric column using AVG().",
  },
  {
    id: "sql-min",
    title: "SQL Min()",
    category: "Aggregate Functions",
    description: "Find the minimum value in a column using MIN().",
  },
  {
    id: "sql-max",
    title: "SQL Max()",
    category: "Aggregate Functions",
    description: "Find the maximum value in a column using MAX().",
  },
  {
    id: "sql-group-by",
    title: "SQL Group By",
    category: "Aggregate Functions",
    description: "Group rows sharing a value and apply aggregate functions using GROUP BY.",
  },
  {
    id: "sql-having",
    title: "SQL Having",
    category: "Aggregate Functions",
    description: "Filter grouped results using HAVING (like WHERE but for aggregates).",
  },

  // ─── Joins ───
  {
    id: "sql-inner-join",
    title: "SQL Inner Join",
    category: "Joins",
    description: "Return rows that have matching values in both tables using INNER JOIN.",
  },
  {
    id: "sql-left-join",
    title: "SQL Left Join",
    category: "Joins",
    description: "Return all rows from the left table and matched rows from the right using LEFT JOIN.",
  },
  {
    id: "sql-right-join",
    title: "SQL Right Join",
    category: "Joins",
    description: "Return all rows from the right table and matched rows from the left using RIGHT JOIN.",
  },
  {
    id: "sql-full-join",
    title: "SQL Full Join",
    category: "Joins",
    description: "Return all rows when there is a match in either left or right table.",
  },
  {
    id: "sql-self-join",
    title: "SQL Self Join",
    category: "Joins",
    description: "Join a table with itself to compare rows within the same table.",
  },
  {
    id: "sql-cross-join",
    title: "SQL Cross Join",
    category: "Joins",
    description: "Return the Cartesian product of two tables using CROSS JOIN.",
  },

  // ─── Advanced Queries ───
  {
    id: "sql-subqueries",
    title: "SQL Subqueries",
    category: "Advanced Queries",
    description: "Nest a query inside another query for complex filtering and computation.",
  },
  {
    id: "sql-exists",
    title: "SQL Exists",
    category: "Advanced Queries",
    description: "Test for the existence of rows in a subquery using EXISTS.",
  },
  {
    id: "sql-case",
    title: "SQL Case",
    category: "Advanced Queries",
    description: "Add conditional logic to queries using CASE WHEN ... THEN ... ELSE ... END.",
  },
  {
    id: "sql-union",
    title: "SQL Union",
    category: "Advanced Queries",
    description: "Combine results from multiple SELECT statements using UNION and UNION ALL.",
  },
  {
    id: "sql-cte",
    title: "SQL CTE (WITH)",
    category: "Advanced Queries",
    description: "Write cleaner queries using Common Table Expressions with the WITH clause.",
  },
  {
    id: "sql-window-functions",
    title: "SQL Window Functions",
    category: "Advanced Queries",
    description: "Perform calculations across a set of rows related to the current row using OVER().",
  },

  // ─── Constraints & Keys ───
  {
    id: "sql-primary-key",
    title: "SQL Primary Key",
    category: "Constraints & Keys",
    description: "Uniquely identify each row in a table using PRIMARY KEY constraint.",
  },
  {
    id: "sql-foreign-key",
    title: "SQL Foreign Key",
    category: "Constraints & Keys",
    description: "Link two tables together using FOREIGN KEY to enforce referential integrity.",
  },
  {
    id: "sql-unique",
    title: "SQL Unique",
    category: "Constraints & Keys",
    description: "Ensure all values in a column are distinct using the UNIQUE constraint.",
  },
  {
    id: "sql-not-null",
    title: "SQL Not Null",
    category: "Constraints & Keys",
    description: "Prevent NULL values in a column using the NOT NULL constraint.",
  },
  {
    id: "sql-create-table",
    title: "SQL Create Table",
    category: "Constraints & Keys",
    description: "Define a new table with columns, data types, and constraints using CREATE TABLE.",
  },
];

export interface ExampleQuery {
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  sql: string;
}

export const exampleQueries: ExampleQuery[] = [
  {
    title: "Simple filter",
    level: "Beginner",
    sql: `SELECT name, email
FROM users
WHERE active = true
ORDER BY name
LIMIT 10;`,
  },
  {
    title: "Join + aggregate",
    level: "Intermediate",
    sql: `SELECT c.name, COUNT(o.id) AS order_count
FROM customers c
JOIN orders o ON o.customer_id = c.id
WHERE o.status = 'completed'
GROUP BY c.name
HAVING COUNT(o.id) > 3
ORDER BY order_count DESC;`,
  },
  {
    title: "Subquery + CASE",
    level: "Advanced",
    sql: `SELECT
  p.title,
  CASE
    WHEN p.price > 100 THEN 'premium'
    ELSE 'standard'
  END AS tier,
  (SELECT AVG(rating) FROM reviews r WHERE r.product_id = p.id) AS avg_rating
FROM products p
WHERE p.category = 'electronics';`,
  },
  {
    title: "Recursive CTE + window function",
    level: "Expert",
    sql: `WITH RECURSIVE org_chart AS (
  SELECT id, name, manager_id, 1 AS depth
  FROM employees
  WHERE manager_id IS NULL
  UNION ALL
  SELECT e.id, e.name, e.manager_id, oc.depth + 1
  FROM employees e
  JOIN org_chart oc ON e.manager_id = oc.id
)
SELECT
  name,
  depth,
  RANK() OVER (PARTITION BY depth ORDER BY name) AS rank_in_level
FROM org_chart
ORDER BY depth, rank_in_level;`,
  },
];

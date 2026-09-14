export interface SampleRow {
  id: number;
  name: string;
  department: string;
  salary: number;
  rating: number;
}

export const sampleEmployees: SampleRow[] = [
  { id: 101, name: "Alice Vance", department: "Engineering", salary: 95000, rating: 4.8 },
  { id: 102, name: "Bob Smith", department: "Marketing", salary: 62000, rating: 4.1 },
  { id: 103, name: "Carol Danvers", department: "Engineering", salary: 110000, rating: 4.9 },
  { id: 104, name: "David Miller", department: "Sales", salary: 58000, rating: 3.8 },
  { id: 105, name: "Elena Rostova", department: "Engineering", salary: 88000, rating: 4.5 },
  { id: 106, name: "Frank Wright", department: "Sales", salary: 74000, rating: 4.2 },
  { id: 107, name: "Grace Hopper", department: "Engineering", salary: 125000, rating: 5.0 },
  { id: 108, name: "Hank Pym", department: "Marketing", salary: 69000, rating: 4.0 },
  { id: 109, name: "Iris West", department: "Sales", salary: 81000, rating: 4.6 },
  { id: 110, name: "Jack Reacher", department: "Marketing", salary: 54000, rating: 3.5 },
];

export const sampleTableColumns = ["id", "name", "department", "salary", "rating"];

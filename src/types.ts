export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  completedDate?: string | null;
  createdAt: string;
}
export type FilterType = "all" | "active" | "completed";

"use client";
import { useState, useEffect } from "react";
import Archive from "@/components/Archive";
import type { Todo } from "@/types";

export default function ArchivePage() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("todos");
    if (saved) setTodos(JSON.parse(saved));
  }, []);

  return (
    <div className="container">
      <h1 className="page-title">Архив</h1>
      <Archive
        todos={todos}
        onClearDate={(date) => {
          setTodos((prev) =>
            prev.filter((todo) => todo.completedDate !== date),
          );
        }}
      />
    </div>
  );
}

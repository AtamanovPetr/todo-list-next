"use client";
import { useState, useEffect } from "react";
import Dashboard from "@/components/Dashboard";
import type { Todo } from "@/types";

export default function DashboardPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  useEffect(() => {
    const saved = localStorage.getItem("todos");
    if (saved) setTodos(JSON.parse(saved));
  }, []);
  return (
    <div className="container">
      <h1 className="page-title">Дашборд</h1>
      <Dashboard todos={todos} />
    </div>
  );
}

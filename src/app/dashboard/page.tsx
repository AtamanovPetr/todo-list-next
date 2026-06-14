"use client";
import { useState, useEffect } from "react";
import Dashboard from "@/components/Dashboard";
import type { Todo } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { loadTodos } from "@/firebase";
export default function DashboardPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const { userId } = useAuth();
  useEffect(() => {
    const load = async () => {
      if (userId) {
        const state = await loadTodos(userId);
        setTodos(state);
      } else {
        const saved = localStorage.getItem("todos");
        if (saved) setTodos(JSON.parse(saved));
      }
    };
    load();
  }, [userId]);
  return (
    <div className="container">
      <h1 className="page-title">Дашборд</h1>
      <Dashboard todos={todos} />
    </div>
  );
}

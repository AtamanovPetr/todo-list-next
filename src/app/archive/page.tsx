"use client";
import { useState, useEffect } from "react";
import Archive from "@/components/Archive";
import type { Todo } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { loadTodos } from "@/firebase";
import {
  loginWithGoogle,
  saveTodos,
  deleteTodoFromCloud,
  logout,
} from "@/firebase";
export default function ArchivePage() {
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
  async function handleClearDate(date: string) {
    setTodos(todos.filter((todo) => todo.completedDate !== date));
    if (userId) {
      let Massiv = todos.filter((todo) => todo.completedDate === date);
      await Promise.all(
        Massiv.map((item) => {
          return deleteTodoFromCloud(userId, item.id);
        }),
      );
    }
  }
  return (
    <div className="container">
      <h1 className="page-title">Архив</h1>
      <Archive todos={todos} onClearDate={handleClearDate} />
    </div>
  );
}

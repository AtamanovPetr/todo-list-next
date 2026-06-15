"use client";
import { useContext, createContext, useState, useEffect } from "react";
import type { Todo } from "@/types";

interface AuthContextType {
  userId: string | null;
  archiveTodos: Todo[];
  addToArchive: (todo: Todo) => void;
  removeFromArchive: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function AuthProvider({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId: string | null;
}) {
  const [archiveTodos, setArchiveTodos] = useState<Todo[]>([]);
  function addToArchive(todo: Todo) {
    setArchiveTodos((prev) => {
      if (prev.some((item) => item.id === todo.id)) {
        return prev;
      } else {
        return [...prev, todo];
      }
    });
  }
  function removeFromArchive(id: string) {
    setArchiveTodos((prev) => prev.filter((item) => item.id != id));
  }
  useEffect(() => {
    const saved = localStorage.getItem("archiveTodos");
    if (saved) {
      const state = JSON.parse(saved);
      setArchiveTodos(state);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("archiveTodos", JSON.stringify(archiveTodos));
  }, [archiveTodos]);
  return (
    <AuthContext.Provider
      value={{ userId, archiveTodos, addToArchive, removeFromArchive }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

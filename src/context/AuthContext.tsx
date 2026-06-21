"use client";
import { useContext, createContext, useState, useEffect } from "react";
import type { Todo } from "@/types";
import {
  deleteArchiveTodo,
  loadArchiveTodos,
  saveArchiveTodo,
} from "@/firebase";

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
    if (userId) {
      saveArchiveTodo(userId, todo);
    }
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
    if (userId) {
      deleteArchiveTodo(userId, id);
    }
  }
  useEffect(() => {
    if (userId) {
      loadArchiveTodos(userId).then(setArchiveTodos);
    }
  }, [userId]);
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

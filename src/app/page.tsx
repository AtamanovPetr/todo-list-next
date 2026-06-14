"use client";
import Image from "next/image";
import type { Todo, FilterType } from "../types";
import { useState, useEffect, useMemo } from "react";
import AddTodoForm from "../components/AddTodoForm";
import Archive from "../components/Archive";
import Dashboard from "../components/Dashboard";
import FilterButtons from "../components/FilterButtons";
import TodoItem from "../components/TodoItem";
import TodoList from "../components/TodoList";
import {
  loginWithGoogle,
  loadTodos,
  saveTodos,
  deleteTodoFromCloud,
  logout,
} from "@/firebase";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const { userId } = useAuth();
  useEffect(() => {
    const load = async () => {
      if (userId) {
        const state = await loadTodos(userId);
        setTodos(
          state.filter(
            (item: Todo) =>
              item.completedDate != null ||
              (!item.completed &&
                item.createdAt === new Date().toLocaleDateString("ru-RU")),
          ),
        );
      } else {
        const saved = localStorage.getItem("todos");
        if (saved) {
          const state = JSON.parse(saved);
          setTodos(
            state.filter(
              (item: Todo) =>
                item.completedDate != null ||
                (!item.completed &&
                  item.createdAt === new Date().toLocaleDateString("ru-RU")),
            ),
          );
        }
      }
    };
    load();
  }, [userId]);
  useEffect(() => {
    if (userId) {
      saveTodos(userId, todos);
    } else {
      if (todos.length > 0) {
        localStorage.setItem("todos", JSON.stringify(todos));
      }
    }
  }, [todos, userId]);
  function handleAddTodo(text: string) {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: text,
      completed: false,
      completedDate: null,
      createdAt: new Date().toLocaleDateString("ru-RU"),
    };
    setTodos((prev) => [...prev, newTodo]);
  }
  function handleToggle(id: string) {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              completed: !todo.completed,
              completedDate: todo.completed
                ? null
                : new Date().toLocaleDateString("ru-RU"),
            }
          : todo,
      ),
    );
  }
  async function handleDelete(id: string) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
    if (userId) {
      await deleteTodoFromCloud(userId, id);
    }
  }
  const filteredTodos = useMemo(() => {
    const filtered = todos.filter((todo) => {
      if (filter === "active") {
        return !todo.completed;
      } else if (filter === "completed") {
        return todo.completed;
      }
      return true;
    });
    return filtered;
  }, [todos, filter]);
  async function handleClearAll() {
    setTodos([]);
    if (userId) {
      await Promise.all(
        todos.map((item) => {
          return deleteTodoFromCloud(userId, item.id);
        }),
      );
    }
  }

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
  async function handleLogin() {
    const uid = await loginWithGoogle();
    if (uid) {
      window.location.reload();
    }
  }
  return (
    <div className="container">
      <header className="app-header">
        <h1 className="app-logo">ToDo List</h1>
        <div className="auth-area">
          {userId ? (
            <>
              <span className="auth-user">Вы вошли</span>
              <button
                className="auth-btn"
                onClick={async () => {
                  if (userId) {
                    await saveTodos(userId, todos); // дожидаемся сохранения перед выходом
                  }
                  await logout();
                  window.location.reload();
                }}
              >
                Выйти
              </button>
            </>
          ) : (
            <button className="auth-btn" onClick={handleLogin}>
              Войти через Google
            </button>
          )}
        </div>
      </header>
      <AddTodoForm onAdd={handleAddTodo} />
      <FilterButtons
        onClear={handleClearAll}
        filter={filter}
        onFilterChange={setFilter}
      />
      <div className="main-content">
        <TodoList
          todos={filteredTodos}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
        <Dashboard todos={todos} />
      </div>
      <Archive onClearDate={handleClearDate} todos={todos} />
    </div>
  );
}

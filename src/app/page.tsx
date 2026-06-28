"use client";
import Image from "next/image";
import type { Todo, FilterType } from "../types";
import { useState, useEffect, useMemo, useReducer } from "react";
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
import todosReducer from "@/reducers/todosReducer";
import { log } from "console";
export default function Home() {
  const [todos, dispatch] = useReducer(todosReducer, []);
  const [filter, setFilter] = useState<FilterType>("all");
  const { userId, archiveTodos, addToArchive } = useAuth();
  console.log("Мой userId:", userId);
  useEffect(() => {
    const load = async () => {
      if (userId) {
        const response = await fetch(`/api/todos?userId=${userId}`);
        if (!response.ok) throw new Error("Failed to fetch");
        const state = await response.json();
        dispatch({
          type: "SET_TODOS",
          payload: state.filter(
            (item: Todo) =>
              item.completedDate != null ||
              (!item.completed &&
                item.createdAt === new Date().toLocaleDateString("ru-RU")),
          ),
        });
      } else {
        const saved = localStorage.getItem("todos");
        if (saved) {
          const state = JSON.parse(saved);
          dispatch({
            type: "SET_TODOS",
            payload: state.filter(
              (item: Todo) =>
                item.completedDate != null ||
                (!item.completed &&
                  item.createdAt === new Date().toLocaleDateString("ru-RU")),
            ),
          });
        }
      }
    };
    load();
  }, [userId]);
  async function handleAddTodo(text: string) {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: text,
      completed: false,
      completedDate: null,
      createdAt: new Date().toLocaleDateString("ru-RU"),
    };
    dispatch({ type: "ADD_TODO", payload: newTodo });
    const response = await fetch(`/api/todos?userId=${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: crypto.randomUUID(),
        text: text,
        completed: false,
        completedDate: null,
        createdAt: new Date().toLocaleDateString("ru-RU"),
      }),
    });
  }
  function handleToggle(id: string) {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    if (todo && !todo.completed) {
      const updatedTodo = {
        ...todo,
        completed: true,
        completedDate: new Date().toLocaleDateString("ru-RU"),
      };
      addToArchive(updatedTodo);
    }
    dispatch({ type: "TOGGLE_TODO", payload: { id } });
    if (userId) {
      fetch(`/api/todos`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          completed: !todo.completed,
          completedDate: todo.completed
            ? null
            : new Date().toLocaleDateString("ru-RU"),
          id,
        }),
      });
    }
  }
  async function handleDelete(id: string) {
    dispatch({ type: "DELETE_TODO", payload: { id } });
    if (userId) {
      try {
        await fetch(`/api/todos`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
      } catch {
        console.log("Ты никита у тебя ошибка");
      }
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
    dispatch({ type: "SET_TODOS", payload: [] });
    if (userId) {
      await Promise.all(
        todos.map((item) => {
          fetch(`/api/todos`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: item.id }),
          });
        }),
      );
    }
  }

  async function handleClearDate(date: string) {
    dispatch({
      type: "SET_TODOS",
      payload: todos.filter((todo) => todo.completedDate !== date),
    });
    if (userId) {
      let Massiv = todos.filter((todo) => todo.completedDate === date);
      await Promise.all(
        Massiv.map((item) => {
          fetch(`/api/todos`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: item.id }),
          });
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
    </div>
  );
}

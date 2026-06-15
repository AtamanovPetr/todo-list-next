"use client";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import Link from "next/link";
import { AuthProvider } from "@/context/AuthContext";
import type { Todo } from "@/types";
export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [userId, setUserId] = useState<string | null>(null);
  const [archiveTodos, setArchiveTodos] = useState<Todo[]>([]);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user != null) {
        setUserId(user.uid);
        localStorage.removeItem("todos");
      } else {
        setUserId(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <div className="container">
        <div className="nav-links">
          <Link href="/" className="nav-link">
            На главную
          </Link>
          <Link href="/dashboard" className="nav-link">
            Дашборд
          </Link>
          <Link href="/archive" className="nav-link">
            Архив
          </Link>
        </div>
      </div>
      <AuthProvider userId={userId}>{children}</AuthProvider>
    </>
  );
}

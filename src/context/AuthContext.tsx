"use client";
import { useContext, createContext } from "react";
const AuthContext = createContext<string | null>(null);
export function AuthProvider({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId: string | null;
}) {
  return <AuthContext.Provider value={userId}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const userId = useContext(AuthContext);
  if (userId === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return { userId };
}

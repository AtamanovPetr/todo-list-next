import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import type { Todo } from "./types";
// Твоя конфигурация из Firebase Console
import { signOut } from "firebase/auth";
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);

// Экспорт базы данных Firestore
export const db = getFirestore(app);

// Настройка Google-авторизации
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Функция входа через Google
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user.uid;
  } catch (error) {}
};

export const deleteTodoFromCloud = async (userId: string, todoId: string) => {
  const docRef = doc(db, "users", userId, "todos", todoId);
  await deleteDoc(docRef);
};

export const loadTodos = async (userId: string): Promise<Todo[]> => {
  const todosRef = collection(db, "users", userId, "todos");
  const snapshot = await getDocs(todosRef);
  const todos: Todo[] = [];
  snapshot.forEach((doc) => {
    todos.push({ id: doc.id, ...doc.data() } as Todo);
  });
  return todos;
};

export const saveTodos = async (userId: string, todos: Todo[]) => {
  await Promise.all(
    todos.map((todo) => {
      const todosRef = doc(db, "users", userId, "todos", todo.id);
      const { id, ...data } = todo;
      return setDoc(todosRef, data);
    }),
  );
};

export const logout = async () => {
  await signOut(auth);
};

export const loadArchiveTodos = async (userId: string): Promise<Todo[]> => {
  const archiveRef = collection(db, "users", userId, "archive");
  const snapshot = await getDocs(archiveRef);
  const todos: Todo[] = [];
  snapshot.forEach((doc) => {
    todos.push({ id: doc.id, ...doc.data() } as Todo);
  });
  return todos;
};

export const saveArchiveTodo = async (userId: string, todo: Todo) => {
  const docRef = doc(db, "users", userId, "archive", todo.id);
  const { id, ...data } = todo;
  await setDoc(docRef, data);
};

export const deleteArchiveTodo = async (userId: string, todoId: string) => {
  const docRef = doc(db, "users", userId, "archive", todoId);
  await deleteDoc(docRef);
};

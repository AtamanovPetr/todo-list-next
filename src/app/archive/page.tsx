"use client";
import { useAuth } from "@/context/AuthContext";
import { deleteTodoFromCloud } from "@/firebase";
import Archive from "@/components/Archive";

export default function ArchivePage() {
  const { userId, archiveTodos, removeFromArchive } = useAuth();

  async function handleClearDate(date: string) {
    const tasksToDelete = archiveTodos.filter(
      (todo) => todo.completedDate === date,
    );

    // Удаляем из локального архива
    tasksToDelete.forEach((todo) => removeFromArchive(todo.id));

    // Удаляем из облака, если авторизованы
    if (userId) {
      await Promise.all(
        tasksToDelete.map((todo) => deleteTodoFromCloud(userId, todo.id)),
      );
    }
  }

  return (
    <div className="container">
      {" "}
      <h1 className="page-title">Архив</h1>{" "}
      <Archive todos={archiveTodos} onClearDate={handleClearDate} />{" "}
    </div>
  );
}

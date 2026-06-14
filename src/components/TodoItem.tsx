import { useState } from "react";
import type { Todo } from "../types";
const audioCheck =
  typeof window !== "undefined" ? new Audio("/sounds/water.flac") : null;
function TodoItem({
  todo,
  onToggle,
  onDelete,
}: {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [isRemoving, setIsRemoving] = useState(false);
  return (
    <div
      className={
        isRemoving === true ? "todo-item todo-item--removing" : "todo-item"
      }
    >
      <input
        className="todo-item__checkbox"
        type="checkbox"
        checked={todo.completed}
        onChange={() => {
          onToggle(todo.id);
          if (audioCheck) audioCheck.play();
        }}
      ></input>
      <span
        className={`todo-item__text ${todo.completed ? "todo-item__text--completed" : ""}`}
      >
        {todo.text}
      </span>
      <button
        className="todo-item__delete"
        onClick={() => {
          setIsRemoving(true);
          setTimeout(() => {
            onDelete(todo.id);
            setIsRemoving(false);
          }, 300);
        }}
      >
        ✕
      </button>
    </div>
  );
}
export default TodoItem;

import React, { useState } from "react";
const audio =
  typeof window !== "undefined" ? new Audio("/sounds/click.mp3") : null;
function AddTodoForm({ onAdd }: { onAdd: (text: string) => void }) {
  const [text, setText] = useState<string>("");
  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setText(e.target.value);
  }
  function sendText(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (text.length > 0) {
      if (audio) {
        audio.play();
      }
      onAdd(text);
    }
    setText("");
  }
  return (
    <section className="main">
      <h1 className="todo-title">Список задач: </h1>
      <form action="#" onSubmit={sendText} className="todo-form">
        <input
          type="text"
          value={text}
          onChange={handleInput}
          className="todo-input"
        />
        <button className="todo-btn" type="submit">
          Сохранить
        </button>
      </form>
    </section>
  );
}

export default AddTodoForm;

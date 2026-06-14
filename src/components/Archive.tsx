import { useState } from "react";
import type { Todo } from "../types";
function Archive({
  todos,
  onClearDate,
}: {
  todos: Todo[];
  onClearDate: (date: string) => void;
}) {
  const completedTodos = todos.filter((todo) => todo.completedDate != null);
  const grouped = completedTodos.reduce(
    (acc, todo) => {
      const date = todo.completedDate!;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(todo);
      return acc;
    },
    {} as Record<string, Todo[]>,
  );
  const DataList = Object.entries(grouped);
  const [expandedDate, setExpandedDate] = useState<string | null>(null);
  DataList.sort((a, b) => {
    const newDate = a[0].split(".");
    const numberData = newDate[2] + newDate[1] + newDate[0];
    const newDateB = b[0].split(".");
    const numberDataB = newDateB[2] + newDateB[1] + newDateB[0];
    if (numberDataB > numberData) {
      return 1;
    }
    if (numberDataB < numberData) {
      return -1;
    } else {
      return 0;
    }
  });
  return (
    <div className="archive">
      <h2>История</h2>

      {DataList.map(([date, tasks]: [string, Todo[]]) => (
        <div
          key={date}
          className="archive-item"
          onClick={() => setExpandedDate(expandedDate === date ? null : date)}
        >
          <span className="archive-item__date">{date}</span>
          <span className="archive-item__count">{tasks.length} шт</span>
          <button
            className="archive-item__clear"
            onClick={(e) => {
              e.stopPropagation();
              onClearDate(date);
              setExpandedDate(null);
            }}
          >
            Очистить историю
          </button>
          <div
            className={`archive-tasks ${expandedDate === date ? "archive-tasks--expanded" : ""}`}
          >
            {tasks.map((task) => (
              <div className="archive-tasks__item" key={task.id}>
                {task.text}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
export default Archive;

import type { Todo } from "@/types";
function todosReducer(state: Todo[], action: { type: string; payload?: any }) {
  switch (action.type) {
    case "ADD_TODO":
      return [...state, action.payload];
    case "DELETE_TODO":
      return state.filter((item) => item.id != action.payload.id);
    case "TOGGLE_TODO":
      return state.map((item) => {
        if (item.id === action.payload.id) {
          return {
            ...item,
            completed: !item.completed,
            completedDate: !item.completed
              ? new Date().toLocaleDateString("ru-RU")
              : null,
          };
        } else {
          return item;
        }
      });
    case "SET_TODOS":
      return action.payload;
    default:
      return state;
  }
}

export default todosReducer;

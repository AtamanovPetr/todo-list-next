import type { FilterType } from "../types";
function FilterButtons({
  filter,
  onFilterChange,
  onClear,
}: {
  filter: FilterType;
  onFilterChange: (value: FilterType) => void;
  onClear: () => void;
}) {
  const buttons: { label: string; value: FilterType }[] = [
    { label: "Все", value: "all" },
    { label: "Активные", value: "active" },
    { label: "Выполненные", value: "completed" },
  ];
  return (
    <div className="filter-buttons">
      {buttons.map((btn) => (
        <button
          onClick={() => onFilterChange(btn.value)}
          key={btn.value}
          className={
            filter === btn.value
              ? "filter-btn filter-btn--active"
              : "filter-btn"
          }
        >
          {btn.label}
        </button>
      ))}
      <button className="filter-btn" onClick={onClear}>
        Очистить все задачи
      </button>
    </div>
  );
}
export default FilterButtons;

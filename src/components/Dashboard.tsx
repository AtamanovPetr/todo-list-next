import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { Todo } from "../types";
function Dashboard({ todos }: { todos: Todo[] }) {
  const today = new Date().toLocaleDateString("ru-RU");
  const totalToday = todos.filter((t) => t.createdAt === today).length;
  const completedToday = todos.filter(
    (t) => t.completedDate != null && t.createdAt === today,
  ).length;
  const percent =
    totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;
  const chartData = [
    {
      name: "Выполнено",
      value: completedToday,
    },
    {
      name: "Осталось",
      value: totalToday - completedToday,
    },
  ];
  const COLORS = ["#5cf65c", "rgba(255,255,255,0.2)"];
  return (
    <div className="dashboard-card">
      <h3 className="dashboard-title">Прогресс за сегодня</h3>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "rgba(30, 30, 47, 0.95)",
                border: "1px solid var(--accent)",
                borderRadius: "12px",
                color: "#fff",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Текст с процентом поверх центра диаграммы */}
        <div className="chart-center-text">{percent}%</div>
      </div>
      <p className="dashboard-stats">
        {completedToday} из {totalToday} задач выполнено
      </p>
    </div>
  );
}

export default Dashboard;

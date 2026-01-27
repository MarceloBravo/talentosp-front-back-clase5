import { useTasksBoard } from './useTasksBoard';
import styles from './TasksBoard.module.css';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const TasksBoard = ({ tasks = [] }) => {
    const { chartData, totalTasks } = useTasksBoard({ tasks });

    if (totalTasks === 0) {
        return (
            <div className={styles.container}>
                <h2 className={styles.title}>Tareas</h2>
                <div className={styles.emptyState}>
                    <p>No hay tareas disponibles para mostrar en el gráfico.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Resumen de Tareas ({totalTasks})</h2>
            <div className={styles.chartContainer}>
                <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={150}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ cx, cy, midAngle, innerRadius, outerRadius, value, index }) => {
                                const RADIAN = Math.PI / 180;
                                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                const percent = ((value / totalTasks) * 100).toFixed(0);

                                return (
                                    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                                        {`${percent}%`}
                                    </text>
                                );
                            }}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} tareas`, 'Cantidad']} />
                        <Legend iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

import { useMemo } from 'react';
import styles from './TasksBoard.module.css';

export const useTasksBoard = ({ tasks = [] }) => {
    
    const isOverdue = (dueDate, status) => {
        if (!dueDate || status === 'completed') return false;
        return new Date(dueDate) < new Date();
    };

    const taskStatusCounts = useMemo(() => {
        let completed = 0;
        let overdue = 0;
        let pending = 0;

        tasks.forEach(task => {
            if (task.status === 'completed') {
                completed++;
            } else if (isOverdue(task.due_date, task.status)) {
                overdue++;
            } else {
                pending++;
            }
        });

        return { completed, overdue, pending };
    }, [tasks]);

    const chartData = [
        { name: 'Pendientes', value: taskStatusCounts.pending, fill: '#3498db' },
        { name: 'Atrasadas', value: taskStatusCounts.overdue, fill: '#e74c3c' },
        { name: 'Completadas', value: taskStatusCounts.completed, fill: '#2ecc71' }
    ].filter(item => item.value > 0);

    const totalTasks = tasks.length;

    const formatDate = (dateString) => {
        if (!dateString) return 'Sin fecha';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const translateStatus = (status) => {
        const statusMap = {
            'todo': 'Por hacer',
            'in-progress': 'En progreso',
            'completed': 'Completada',
            'cancelled': 'Cancelada',
            'pending': 'Pendiente'
        };
        return statusMap[status] || status;
    };

    const translatePriority = (priority) => {
        const priorityMap = {
            'high': 'Alta',
            'medium': 'Media',
            'low': 'Baja'
        };
        return priorityMap[priority] || priority;
    };

    const getPriorityClass = (priority) => {
        const priorityClasses = {
            'high': styles.priorityHigh,
            'medium': styles.priorityMedium,
            'low': styles.priorityLow
        };
        return priorityClasses[priority] || '';
    };

    const getStatusClass = (status) => {
        const statusClasses = {
            'todo': styles.statusTodo,
            'in-progress': styles.statusInProgress,
            'completed': styles.statusCompleted,
            'cancelled': styles.statusCancelled
        };
        return statusClasses[status] || '';
    };

    return {
        chartData,
        totalTasks,
        formatDate,
        translateStatus,
        translatePriority,
        getPriorityClass,
        getStatusClass,
        isOverdue
    };
}

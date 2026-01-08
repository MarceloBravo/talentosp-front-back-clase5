import styles from './TasksBoard.module.css';

export const useTasksBoard = ({tasks = [], filters, onUpdateFilters}) => {
    
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
            'in_progress': 'En progreso',
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
            'in_progress': styles.statusInProgress,
            'completed': styles.statusCompleted,
            'cancelled': styles.statusCancelled
        };
        return statusClasses[status] || '';
    };

    const isOverdue = (dueDate) => {
        if (!dueDate) return false;
        return new Date(dueDate) < new Date();
    };

    if (!tasks || tasks.length === 0) {
        return (
            <div className={styles.container}>
                <h2 className={styles.title}>Tareas</h2>
                <div className={styles.emptyState}>
                    <p>No hay tareas disponibles</p>
                </div>
            </div>
        );
    }

    return {
        formatDate,
        translateStatus,
        translatePriority,
        getPriorityClass,
        getStatusClass,
        isOverdue
    };
}
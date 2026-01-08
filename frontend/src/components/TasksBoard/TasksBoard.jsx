import { useTasksBoard } from './useTasksBoard';
import styles from './TasksBoard.module.css';

export const TasksBoard = ({tasks = [], filters, onUpdateFilters}) => {
    const {
        formatDate,
        translateStatus,
        translatePriority,
        getPriorityClass,
        getStatusClass,
        isOverdue
    } = useTasksBoard({tasks, filters, onUpdateFilters});
    

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Tareas ({tasks.length})</h2>
            <div className={styles.tasksList}>
                {tasks.map((task) => (
                    <div 
                        key={task.id} 
                        className={`${styles.taskItem} ${isOverdue(task.due_date) && task.status !== 'completed' ? styles.overdue : ''}`}
                    >
                        <div className={styles.taskContent}>
                            <div className={styles.taskMain}>
                                <div className={styles.taskHeader}>
                                    <h3 className={styles.taskTitle}>{task.title}</h3>
                                    <div className={styles.taskBadges}>
                                        <span className={`${styles.statusBadge} ${getStatusClass(task.status)}`}>
                                            {translateStatus(task.status)}
                                        </span>
                                        <span className={`${styles.priorityBadge} ${getPriorityClass(task.priority)}`}>
                                            {translatePriority(task.priority)}
                                        </span>
                                        <span className={styles.taskId}>#{task.id}</span>
                                    </div>
                                </div>
                                <p className={styles.taskDescription}>
                                    {task.description || 'Sin descripción'}
                                </p>
                            </div>
                            <div className={styles.taskMeta}>
                                <span className={styles.metaItem}>
                                    <span className={styles.metaIcon}>📅</span>
                                    {formatDate(task.due_date)}
                                </span>
                                <span className={styles.metaItem}>
                                    <span className={styles.metaIcon}>👤</span>
                                    Asignado: {task.assignee_id || 'Sin asignar'}
                                </span>
                                <span className={styles.metaItem}>
                                    <span className={styles.metaIcon}>📁</span>
                                    Proyecto: {task.project_id}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
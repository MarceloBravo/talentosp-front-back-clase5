import styles from './DashboardHeader.module.css'

export const DashboardHeader = ({stats}) => {

    return (
        <div className={styles.headerContainer}>
            <div>Total tareas: { stats.totalTasks }</div>
            <div>Total proyectos: { stats.totalProjects }</div>
            <div>Tareas completadas: { stats.completedTasks }</div>
            <div>Tareas atrasadas: { stats.overdueTasks }</div>
        </div>
    )
}
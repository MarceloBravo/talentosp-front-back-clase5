import { useProjectsList } from './useProjectsList';
import styles from './ProjectsList.module.css';

export const ProjectsList = ({projects = [], onSelectProject}) => {
    const {
        formatDate
    } = useProjectsList({onSelectProject});

    if (!projects || projects.length === 0) {
        return (
            <div className={styles.container}>
                <h2 className={styles.title}>Proyectos</h2>
                <div className={styles.emptyState}>
                    <p>No hay proyectos disponibles</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Proyectos ({projects.length})</h2>
            <div className={styles.projectsList}>
                {projects.map((project) => (
                    <div 
                        key={project.id} 
                        className={styles.projectItem}
                        onClick={() => onSelectProject && onSelectProject(project)}
                    >
                        <div className={styles.projectContent}>
                            <div className={styles.projectMain}>
                                <div className={styles.projectHeader}>
                                    <h3 className={styles.projectName}>{project.name}</h3>
                                    <span className={styles.projectId}>#{project.id}</span>
                                </div>
                                <p className={styles.projectDescription}>
                                    {project.description || 'Sin descripción'}
                                </p>
                            </div>
                            <div className={styles.projectMeta}>
                                <span className={styles.metaItem}>
                                    <span className={styles.metaIcon}>📅</span>
                                    {formatDate(project.created_at)}
                                </span>
                                <span className={styles.metaItem}>
                                    <span className={styles.metaIcon}>👤</span>
                                    propietario: {project.username}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
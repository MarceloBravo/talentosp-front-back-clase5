import { Link } from "react-router"
import styles from './PageTitle.module.css'

export const PageTitle = ({title, breadCrumbs = [], project = ''}) => {
  return (
    <div className={styles.pageTitleContainer}>
        <div className={styles.title}>
            <h2>{title}</h2> {project && <h5>- {project}</h5>}
        </div>
        {breadCrumbs.length > 0 && (
            <>
                {breadCrumbs.map((crumb, index) => (
                    <span key={index}>
                        <Link to={crumb.path} className={styles.link} state={{name: project}}>{crumb.label}</Link>
                        {index < breadCrumbs.length - 1 && ' / '}
                    </span>
                ))}
            </>
        )}
        
    </div>
  )
}
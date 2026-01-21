import { Link } from "react-router"
import styles from './PageTitle.module.css'

export const PageTitle = ({title, breadCrumbs = []}) => {
  return (
    <div className={styles.pageTitleContainer}>
        <h2>{title}</h2>
        {breadCrumbs.length > 0 && (
            <>
                {breadCrumbs.map((crumb, index) => (
                    <span key={index}>
                        <Link to={crumb.path} className={styles.link}>{crumb.label}</Link>
                        {index < breadCrumbs.length - 1 && ' / '}
                    </span>
                ))}
            </>
        )}
    </div>
  )
}
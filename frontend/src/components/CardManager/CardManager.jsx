import useCardManager from './useCardManager';
import { formatDate } from '../../utils/dates';

const CardManager = ({user}) => {
    const { 
        styles,
        avatar,
        translateRole,
        getRoleClass,
        getStatusClass,
    } = useCardManager(user);

  return (
    <div className={styles.userCard}>
        <div className={styles.cardHeader}>
            <img
                src={avatar}
                alt={`Avatar de ${user.nombre}`}
                className={styles.avatar}
            />
            <div className={styles.userInfo}>
                <h3 className={styles.userName}>{user.nombre}</h3>
                <p className={styles.userEmail}>{user.email}</p>
            </div>
        </div>
        <div className={styles.cardBody}>
            <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Rol:</span>
                <span className={`${styles.roleBadge} ${getRoleClass()}`}>
                    {translateRole()}
                </span>
            </div>
            <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Estado:</span>
                <span className={`${styles.statusBadge} ${getStatusClass()}`}>
                    {user.activo ? 'Activo' : 'Inactivo'}
                </span>
            </div>
        </div>
        <div className={styles.cardFooter}>
            Miembro desde: {formatDate(user.created_at)}
        </div>
    </div>
  )
}

export default CardManager
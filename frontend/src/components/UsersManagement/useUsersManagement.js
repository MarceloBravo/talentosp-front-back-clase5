import styles from './UsersManagement.module.css';

export const useUsersManagement = () => {

    const formatDate = (dateString) => {
        if (!dateString) return 'Fecha no disponible';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const translateRole = (role) => {
        const roleMap = {
            'admin': 'Administrador',
            'user': 'Usuario',
        };
        return roleMap[role] || role;
    };

    const getRoleClass = (role) => {
        const roleClasses = {
            'admin': styles.roleAdmin,
            'user': styles.roleUser,
        };
        return roleClasses[role] || '';
    };

    const getStatusClass = (isActive) => {
        return isActive ? styles.statusActive : styles.statusInactive;
    };

    const UserCard = ({ user }) => (
        <div className={styles.userCard}>
            <div className={styles.cardHeader}>
                <img
                    src={user.file_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.nombre)}&background=random&color=fff`}
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
                    <span className={`${styles.roleBadge} ${getRoleClass(user.role)}`}>
                        {translateRole(user.role)}
                    </span>
                </div>
                <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Estado:</span>
                    <span className={`${styles.statusBadge} ${getStatusClass(user.activo)}`}>
                        {user.activo ? 'Activo' : 'Inactivo'}
                    </span>
                </div>
            </div>
            <div className={styles.cardFooter}>
                Miembro desde: {formatDate(user.created_at)}
            </div>
        </div>
    );

    return {
        UserCard
    };
}
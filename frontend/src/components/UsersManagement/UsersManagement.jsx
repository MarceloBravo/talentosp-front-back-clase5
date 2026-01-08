import { useUsersManagement } from './useUsersManagement';
import styles from './UsersManagement.module.css';

export const UsersManagement = ({ users = [] }) => {
    const {
        UserCard
    } = useUsersManagement();


    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Gestión de Usuarios ({users.length})</h2>
            <div className={styles.usersItems}>
                {users.length > 0 ? (
                    <div className={styles.usersGrid}>
                        {users.map((user) => (
                            <UserCard key={user.id} user={user} />
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <p>No hay usuarios disponibles</p>
                    </div>
                )}
            </div>
        </div>
    );
}
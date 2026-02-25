import styles from './UsersManagement.module.css';
import CardManager from '../CardManager/CardManager';

export const UsersManagement = ({ users = [] }) => {

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Gestión de Usuarios ({users.length})</h2>
            <div className={styles.usersItems}>
                {users.length > 0 ? (
                    <div className={styles.usersGrid}>
                        {users.map((user) => (
                            <CardManager key={user.id} user={user} />
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
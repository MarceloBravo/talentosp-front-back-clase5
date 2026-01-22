import { NavLink } from "react-router";
import { useAuth } from "../../context/Auth/useAuth";
import styles from './HeaderComponet.module.css';

export const HeaderComponent = () => {
    const { userSession, logout } = useAuth();
    const logo = '';

    const handleLogout = () => {
        logout();
    };

  return (
    <header className={styles.appHeader}>
      {/*<img src={logo} className="App-logo" alt="logo" />*/}
      <div className={styles.appTitle}>TaskFlow App</div>
      {userSession.isLoggedIn ? (
            <button onClick={handleLogout} className={`btn ${styles.logoutButton}`}>
                Cerrar sessión
            </button>
        ) : (
            <NavLink to="/login" className={`btn ${isActive => isActive ? `${styles.loginButton} ${styles.active}` : styles.loginButton}`}>
                Iniciar sessión
            </NavLink>
        )}
    </header>
  )
}
import { NavLink, useLocation } from "react-router";
import { useAuth } from "../../context/Auth/useAuth";
import styles from './HeaderComponet.module.css';

export const HeaderComponent = () => {
    const { userSession, logout } = useAuth();
    const location = useLocation();
    const rutasDeshabilitadas = ["/login"];
    const isDisabled = rutasDeshabilitadas.includes(location.pathname)

    const handleLogout = () => {
        logout();
    };

  return (
    <header className={styles.appHeader}>
      {/*<img src={logo} className="App-logo" alt="logo" />*/}
      <div className={styles.appTitle}>TaskFlow App</div>
      {userSession.isLoggedIn ? (
            <button onClick={handleLogout} className={`btn ${styles.logoutButton}`} disabled={isDisabled}>
                Cerrar sessión
            </button>
        ) : (
            <NavLink to="/login" className={`btn ${isDisabled ? styles.disabledButton : styles.loginButton}`} disabled={isDisabled}>
                Iniciar sessión
            </NavLink>
        )}
    </header>
  )
}
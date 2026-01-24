import { NavLink, useLocation } from "react-router";
import { useAuth } from "../../context/Auth/useAuth";
import styles from './HeaderComponet.module.css';
import { useEffect } from "react";
import { useState } from "react";
import { segundosAHMS } from "../../utils/dates";

export const HeaderComponent = () => {
    const { userSession, logout } = useAuth();
    const location = useLocation();
    const rutasDeshabilitadas = ["/login"];
    const isDisabled = rutasDeshabilitadas.includes(location.pathname)
    const [ restTime, setRestTime ] = useState(0);


    useEffect(()=>{
        const countDownSession = setInterval(() => {
            if(userSession.isLoggedIn){
                const tockenDecoded = JSON.parse(atob(userSession.accessToken.split('.')[1]));
                const sessionDuration = tockenDecoded.exp - Math.floor(Date.now() / 1000);
                if(sessionDuration <= 0){
                    logout();
                }else{
                    setRestTime(sessionDuration);
                }
            }            
        }, 1000);
        return () => clearTimeout(countDownSession);
        // eslint-disable-next-line
    },[userSession])


    const handleLogout = () => {
        logout();
    };

  return (
    <header className={styles.appHeader}>
      <div className={styles.appTitle}>TaskFlow App</div>
      {userSession.isLoggedIn && !userSession.remember && restTime > 0 && <span className={styles.restTime + ' ' + (restTime < 60 ? styles.parpadeo: '')}>{segundosAHMS(restTime)}</span>}
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
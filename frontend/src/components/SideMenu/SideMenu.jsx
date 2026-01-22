import { NavLink } from 'react-router';
import { useAuth } from '../../context/Auth/useAuth';
import { useEffect, useState } from 'react';

import styles from './SideMenu.module.css';

export const SideMenu = () => {
    const { userSession } = useAuth();
    const [ isAdmin, setIsAdmin ] = useState(false);

    useEffect(()=>{
        setIsAdmin(userSession?.user?.role === 'admin');
    },[userSession])
    /*
    const handleLogout = () => {
        logout();
    };
    */
    return (
        <nav className={styles.sideMenu}>
            <ul>
                <li>
                    <NavLink to="/" end className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
                        Dashboard
                    </NavLink>
                </li>
                {isAdmin && (
                    <li>
                        <NavLink to="/users" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
                            Usuarios
                        </NavLink>
                    </li>
                )}
                {isAdmin && (
                <li>
                    <NavLink to="/projects" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
                        Proyectos
                    </NavLink>
                </li>
                )}
                {/*
                <li>
                    {userSession.isLoggedIn ? (
                        <button onClick={handleLogout} className={`${styles.link} ${styles.logoutButton}`}>
                            Logout
                        </button>
                    ) : (
                        <NavLink to="/login" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
                            Login
                        </NavLink>
                    )}
                </li>
                */}
            </ul>
        </nav>
    );
};

import { Routes, Route, Navigate } from 'react-router'
import { ProtectedRoutes } from './ProtectedRoutes'
import { LoginPage } from '../pages/Login/LoginPage'
import { Dashboard } from '../pages/Dashboard/Dashboard'
import { RegisterPage } from '../pages/Register/RegisterPage'
import { UserListPage } from '../pages/users/UserListPage/UserListPage'
import { UserFormPage } from '../pages/users/UserFormPage/UserFormPage'
import ProjectListsPage from '../pages/Projects/ProjectLists/ProjectListsPage'
import ProjectFormPage from '../pages/Projects/ProjectForm/ProjectFormPage'
import TasksListsPage from '../pages/Projects/TasksLists/TasksListsPage'
import TasksFormPage from '../pages/Projects/TasksForm/TasksFormPage'
import styles from './Navigation.module.css';

export const Navigation = () => {

    return (
        <div className={styles.navigationContainer}>
        <Routes>
            <Route path="/" element={<Dashboard/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/register" element={<RegisterPage/>}/>
            <Route path="/users" element={<ProtectedRoutes requiredRol="admin"><UserListPage/></ProtectedRoutes>}/> 
            <Route path="/users/new" element={<ProtectedRoutes requiredRol="admin"><UserFormPage/></ProtectedRoutes>}/> 
            <Route path="/users/:id" element={<ProtectedRoutes requiredRol="admin"><UserFormPage/></ProtectedRoutes>}/> 
            <Route path="/projects" element={<ProtectedRoutes requiredRol="admin"><ProjectListsPage/></ProtectedRoutes>}/> 
            <Route path="/projects/new" element={<ProtectedRoutes requiredRol="admin"><ProjectFormPage/></ProtectedRoutes>}/> 
            <Route path="/projects/:id" element={<ProtectedRoutes requiredRol="admin"><ProjectFormPage/></ProtectedRoutes>}/> 
            <Route path="/projects/:id/tasks" element={<ProtectedRoutes requiredRol="admin"><TasksListsPage/></ProtectedRoutes>}/>
            <Route path="/projects/:projectId/tasks/new" element={<ProtectedRoutes requiredRol="admin"><TasksFormPage/></ProtectedRoutes>}/>
            <Route path="/projects/:projectId/tasks/:id" element={<ProtectedRoutes requiredRol="admin"><TasksFormPage/></ProtectedRoutes>}/>
            <Route path="*" element={<Navigate to="/" replace/>}/>
        </Routes>
        </div>
    )
}
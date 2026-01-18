import { Routes, Route } from 'react-router'
import { HomePage } from '../pages/home/HomePage'
import { ProtectedRoutes } from './ProtectedRoutes'
import { LoginPage } from '../pages/Login/LoginPage'
import { Dashboard } from '../pages/Dashboard/Dashboard'
import { RegisterPage } from '../pages/Register/RegisterPage'
import { UserListPage } from '../pages/users/UserListPage/UserListPage'
import { UserFormPage } from '../pages/users/UserFormPage/UserFormPage'
import ProjectListsPage from '../pages/Projects/ProjectLists/ProjectListsPage'
import ProjectFormPage from '../pages/Projects/ProjectForm/ProjectFormPage'
import TasksListsPage from '../pages/Projects/TasksLists/TasksListsPage'

export const Navigation = () => {

    return (
        <Routes>
            <Route path="/" element={<Dashboard/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/register" element={<RegisterPage/>}/>
            <Route path="/home" element={<ProtectedRoutes requiredRol="admin"><HomePage/></ProtectedRoutes>}/> 
            <Route path="/users" element={<ProtectedRoutes requiredRol="admin"><UserListPage/></ProtectedRoutes>}/> 
            <Route path="/users/new" element={<ProtectedRoutes requiredRol="admin"><UserFormPage/></ProtectedRoutes>}/> 
            <Route path="/users/:id" element={<ProtectedRoutes requiredRol="admin"><UserFormPage/></ProtectedRoutes>}/> 
            <Route path="/projects" element={<ProtectedRoutes requiredRol="admin"><ProjectListsPage/></ProtectedRoutes>}/> 
            <Route path="/projects/new" element={<ProtectedRoutes requiredRol="admin"><ProjectFormPage/></ProtectedRoutes>}/> 
            <Route path="/projects/:id" element={<ProtectedRoutes requiredRol="admin"><ProjectFormPage/></ProtectedRoutes>}/> 
            <Route path="/tasks/lists/:id" element={<ProtectedRoutes requiredRol="admin"><TasksListsPage/></ProtectedRoutes>}/>
        </Routes>
    )
}
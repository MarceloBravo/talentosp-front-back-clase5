import { Routes, Route } from 'react-router'
import { HomePage } from '../pages/home/HomePage'
import { ProtectedRoutes } from './ProtectedRoutes'
import { LoginPage } from '../pages/Login/LoginPage'
import { Dashboard } from '../pages/Dashboard/Dashboard'
import { RegisterPage } from '../pages/Register/RegisterPage'

export const Navigation = () => {

    return (
        <Routes>
            <Route path="/" element={<Dashboard/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/register" element={<RegisterPage/>}/>
            <Route path="/home" element={<ProtectedRoutes requiredRol="admin"><HomePage/></ProtectedRoutes>}/> 
        </Routes>
    )
}
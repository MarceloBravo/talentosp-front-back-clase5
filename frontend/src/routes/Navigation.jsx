import { Routes, Route } from 'react-router'
import { HomePage } from '../pages/home/HomePage'
import { ProtectedRoutes } from './ProtectedRoutes'
import { LoginPage } from '../pages/login/LoginPage'
import { Dashboard } from '../pages/Dashboard/Dashboard'

export const Navigation = () => {

    return (
        <Routes>
            <Route path="/" element={<Dashboard/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/home" element={<ProtectedRoutes requiredRol="admin"><HomePage/></ProtectedRoutes>}/> 
        </Routes>
    )
}
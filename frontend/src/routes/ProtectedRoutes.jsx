import { useContext } from "react"
import AuthContext from "../context/Auth/AuthContext"
import { Navigate, useLocation } from "react-router";

export const ProtectedRoutes = ({ children, requiredRol}) => {
    const { isLoading, error, userSession } = useContext(AuthContext);
    const location = useLocation();

    if(isLoading){
        return <div>Cargando...</div>
    }


    if(!userSession?.user || error){
        return <Navigate to="/login" state={{from: location }} replace/>
    }

    if(requiredRol && userSession.user?.rol !== requiredRol){
        return <Navigate to="/login" state={{from: location }} replace/>
    }

    return children;
}
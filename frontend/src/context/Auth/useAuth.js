import { useContext } from "react";
import { AuthProvider } from "./AuthProvider";

export const useAuth = () => {
    return useContext(AuthProvider);    // { userSession, setUserSession, login, logout, isLoading, error}
}
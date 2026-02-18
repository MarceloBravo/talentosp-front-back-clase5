import axios from "axios";
import { saveRefreshToken, getRefreshTokenFromCookie } from "../utils/refreshToken";

const API_URL = process.env.REACT_APP_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Variable para almacenar la función de actualización del store/context
let store;

export const injectStore = (_store) => {
  store = _store;
};


axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.userSession.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Si el access token expiró (401) y no es un reintento
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = getRefreshTokenFromCookie();
        
        // Si no hay refresh token disponible, cerrar sesión
        if (!refreshToken) {
          console.warn("No hay refresh token disponible. Cerrando sesión...");
          if (store && store.logout) {
            await store.logout();
          }
          window.location.href = "/login";
          return Promise.reject(error);
        }

        console.log("Access token expirado. Intentando refrescar con refresh token...");
        
        // Pedir nuevo access token usando refresh token
        const { data } = await axiosInstance.post('/api/refreshToken', {
          refreshToken: refreshToken
        });

        // Validar que la respuesta tenga los tokens necesarios
        if (data?.data?.access_token && data?.data?.refresh_token) {
          saveRefreshToken(data.data.refresh_token);
          
          if (store && store.setUserSession) {
            console.log("Sesión refrescada exitosamente. Actualizando token en memoria...");
            store.setUserSession({
              ...store.userSession,
              accessToken: data.data.access_token,
              isLoggedIn: true,
            });
          }

          // Reintentar la request original con el nuevo token
          originalRequest.headers.Authorization = `Bearer ${data.data.access_token}`;
          return axiosInstance(originalRequest);
        } else {
          console.error("Respuesta de refresh inválida:", data);
          if (store && store.logout) {
            await store.logout();
          }
          window.location.href = "/login";
          return Promise.reject(error);
        }
      } catch (err) {
        console.error("Error al refrescar el token:", err.message);
        if (store && store.logout) {
          await store.logout();
        }
        // Si falla el refresh → redirigir a login
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
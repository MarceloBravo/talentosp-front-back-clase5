import axios from "axios";
import { saveRefreshToken, getRefreshTokenFromCookie } from "../utils/refreshToken";

const API_URL = process.env.REACT_APP_API_URL;

const instance = axios.create({
  baseURL: API_URL,
});

// Variable para almacenar la función de actualización del store/context
let store;

export const injectStore = (_store) => {
  store = _store;
};


instance.interceptors.request.use(
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

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
     const originalRequest = error.config;

    // Si el access token expiró
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = getRefreshTokenFromCookie();
        // Pedir nuevo access token usando refresh token (cookie segura)
        const { data } = await instance.post(`/auth/refresh`,
          {
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
          }
        );
        saveRefreshToken(data.refresh_token);
        if (store && store.setUserSession) {
          console.log("Actualizando sesión en memoria con nuevo token...");
          store.setUserSession(prev => ({
            ...prev,
            accessToken: data.access_token,
          }));
        }

        // Reintentar la request original con el nuevo token
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        return instance(originalRequest);
      } catch (err) {
        await store.logout();
        // Si falla el refresh → redirigir a login
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
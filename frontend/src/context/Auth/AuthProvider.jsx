import { useReducer, useEffect } from 'react';
import instance, { injectStore } from '../../axios/axiosInstance';
import { getRefreshTokenFromCookie, saveRefreshToken } from '../../utils/refreshToken';
import { jwtDecode } from 'jwt-decode';
import AuthContext from './AuthContext';
import { AuthReducer, initialState, AUTH_ACTIONS } from './AuthReducer';

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, initialState);
    const { isLoading, error, userSession } = state;



    const login = async (credentials) => {
        dispatch({ type: AUTH_ACTIONS.LOGIN_START });
        
        try{
            const response = await instance.post('/api/login', credentials);
            if(response?.data?.data?.access_token){
                const payload = jwtDecode(response.data.data.access_token);

                dispatch({
                    type: AUTH_ACTIONS.LOGIN_SUCCESS,
                    payload: {
                        user: payload.user,
                        accessToken: response.data.data.access_token,
                    }
                });

                if(credentials.rememberMe){
                  saveRefreshToken(response.data.data.refresh_token); // Guarda el refresh-token en cookie
                }

            }else{
                dispatch({
                    type: AUTH_ACTIONS.LOGIN_ERROR,
                    payload: 'Usuario y o contraseña no válidos.'
                });
            }
        }catch(error){
            dispatch({
                type: AUTH_ACTIONS.LOGIN_ERROR,
                payload: error.response?.data?.message || 'Error al autenticar al usuario'
            });
        }
    };

    const logout = async () => {
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
        const refreshToken = getRefreshTokenFromCookie();
        if(!refreshToken){
            return;
        }
        await instance.post('/api/logout', {refreshToken});
    };

  // Función para actualizar userSession (necesaria para el interceptor de Axios)
  const setUserSession = (newSession) => {
    if (newSession.isLoggedIn) {
      dispatch({
        type: AUTH_ACTIONS.REFRESH_TOKEN_SUCCESS,
        payload: {
          user: newSession.user,
          accessToken: newSession.accessToken,
        }
      });
    } else {
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  useEffect(() => {
    // Inyectamos las funciones que el interceptor de Axios necesita
    injectStore({
      setUserSession,
      logout, // Pasamos también el logout por si el refresh token falla
      userSession
    });
  }, [userSession]);

  useEffect(() => {
    // Auto-login si hay refresh_token
    const refreshToken = getRefreshTokenFromCookie();
    if (refreshToken && !userSession.isLoggedIn) {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      instance.post('/api/refreshToken', { refreshToken })
        .then(response => {
          const payload = jwtDecode(response.data.data.access_token);
          dispatch({
            type: AUTH_ACTIONS.REFRESH_TOKEN_SUCCESS,
            payload: {
              user: payload.user,
              accessToken: response.data.data.access_token,
            }
          });
          saveRefreshToken(response.data.data.refresh_token);
        })
        .catch(() => {
          // Si falla, no hacer nada, el usuario irá a login
        })
        .finally(() => {
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        });
    }
    // eslint-disable-next-line
  }, []);

  return (
    <AuthContext.Provider value={{ userSession, setUserSession, login, logout, isLoading, error}}>
      {children}
    </AuthContext.Provider>
  );
};

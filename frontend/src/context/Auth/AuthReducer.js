// Estado inicial del contexto de autenticación
export const initialState = {
    isLoading: false,
    error: null,
    userSession: {
        isLoggedIn: false,
        user: null,
        accessToken: null,
        remember: false,
    }
};

// Tipos de acciones para el reducer
export const AUTH_ACTIONS = {
    LOGIN_START: 'LOGIN_START',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_ERROR: 'LOGIN_ERROR',
    LOGOUT: 'LOGOUT',
    REFRESH_TOKEN_SUCCESS: 'REFRESH_TOKEN_SUCCESS',
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
};

// Reducer para manejar las acciones de autenticación
export const AuthReducer = (state, action) => {
    switch (action.type) {
        case AUTH_ACTIONS.LOGIN_START:
            return {
                ...state,
                isLoading: true,
                error: null,
            };

        case AUTH_ACTIONS.LOGIN_SUCCESS:
            return {
                ...state,
                isLoading: false,
                error: null,
                userSession: {
                    isLoggedIn: true,
                    user: action.payload.user,
                    accessToken: action.payload.accessToken,
                    remember: action.payload.remember,
                },
            };

        case AUTH_ACTIONS.LOGIN_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };

        case AUTH_ACTIONS.LOGOUT:
            return {
                ...state,
                userSession: {
                    isLoggedIn: false,
                    user: null,
                    accessToken: null,
                    remember: false,
                },
            };

        case AUTH_ACTIONS.REFRESH_TOKEN_SUCCESS:
            return {
                ...state,
                isLoading: false,
                error: null,
                userSession: {
                    isLoggedIn: true,
                    user: action.payload.user,
                    accessToken: action.payload.accessToken,
                    remember: action.payload.remember,
                },
            };

        case AUTH_ACTIONS.SET_LOADING:
            return {
                ...state,
                isLoading: action.payload,
            };

        case AUTH_ACTIONS.SET_ERROR:
            return {
                ...state,
                error: action.payload,
            };

        default:
            return state;
    }
};
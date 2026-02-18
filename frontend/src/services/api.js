import axiosInstance from '../axios/axiosInstance';

const END_POINT = process.env.REACT_APP_API_URL || 'https://taskflow-backend.onrender.com';
const GET_PROJECTS = END_POINT + '/api/projects';
const GET_TASKS = END_POINT + '/api/tasks';
const GET_USERS = END_POINT + '/api/users';

// Función auxiliar para ejecutar peticiones
const execute = async (endpoint) => {
    try {
        const result = await axiosInstance(endpoint);
        return result.data;
    } catch (error) {
        throw error;
    }
};

// Objeto con métodos que se exporta como default
const api = {
    getProjects: async () => {
        const data = await execute(GET_PROJECTS);
        return data;
    },

    getTasks: async () => {
        const data = await execute(GET_TASKS);
        return data;
    },

    getUsers: async () => {
        const data = await execute(GET_USERS);
        return data;
    }
};

export default api;
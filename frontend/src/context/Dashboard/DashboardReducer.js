export const initialState = {
    projects: [],
    currentProject: null,
    tasks: [],
    users: [],
    loading: false,
    error: null,
    filters: {
      status: 'all',
      assignee: 'all',
      priority: 'all'
    },
    stats: {
      totalProjects: 0,
      totalTasks: 0,
      completedTasks: 0,
      overdueTasks: 0
    }
  };

  export const DASHBOARD_ACTIONS = {
    SET_LOADING: 'SET_LOADING',
    SET_PROJECTS: 'SET_PROJECTS',
    SELECT_PROJECT: 'SELECT_PROJECT',
    SET_TASKS: 'SET_TASKS',
    SET_USERS: 'SET_USERS',
    SET_ERROR: 'SET_ERROR',
    SET_FILTER: 'SET_FILTER'
  }
  
  export function dashboardReducer(state, action) {
    switch (action.type) {
      case 'SET_LOADING':
        return { ...state, loading: action.payload };
  
      case 'SET_PROJECTS':
        return {
          ...state,
          projects: action.payload,
          stats: {
            ...state.stats,
            totalProjects: action.payload.length
          }
        };
  
      case 'SELECT_PROJECT':
        return { ...state, currentProject: action.payload };
  
      case 'SET_TASKS':
        const completed = action.payload.filter(t => t.status === 'completed').length;
        return {
          ...state,
          tasks: action.payload,
          stats: {
            ...state.stats,
            totalTasks: action.payload.length,
            completedTasks: completed,
            overdueTasks: action.payload.filter(t =>
              t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed'
            ).length
          }
        };
  
      case 'SET_USERS':
        return {
          ...state,
          users: action.payload
        };

      case 'SET_ERROR':
        return {
          ...state,
          error: action.payload,
          loading: false
        };

      case 'SET_FILTER':
        return {
          ...state,
          filters: { ...state.filters, ...action.payload }
        };
  
      default:
        return state;
    }
  }
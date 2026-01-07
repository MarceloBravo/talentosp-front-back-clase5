const initialState = {
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
  
  function dashboardReducer(state, action) {
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
  
      case 'SET_FILTER':
        return {
          ...state,
          filters: { ...state.filters, ...action.payload }
        };
  
      default:
        return state;
    }
  }
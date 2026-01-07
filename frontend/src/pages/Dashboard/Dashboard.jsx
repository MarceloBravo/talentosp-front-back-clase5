export const Dashboard = () => {
    const { state, dispatch } = useDashboard();
    const { user } = useAuth();
  
    // Cargar datos iniciales
    useEffect(() => {
      loadDashboardData();
    }, []);
  
    const loadDashboardData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const [projects, tasks, users] = await Promise.all([
          api.getProjects(),
          api.getTasks(),
          api.getUsers()
        ]);
  
        dispatch({ type: 'SET_PROJECTS', payload: projects });
        dispatch({ type: 'SET_TASKS', payload: tasks });
        dispatch({ type: 'SET_USERS', payload: users });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
  
    if (state.loading) {
      return <DashboardSkeleton />;
    }
  
    return (
      <div className="dashboard">
        <DashboardHeader stats={state.stats} />
  
        <div className="dashboard-grid">
          <ProjectsList
            projects={state.projects}
            onSelectProject={(project) =>
              dispatch({ type: 'SELECT_PROJECT', payload: project })
            }
          />
  
          <TasksBoard
            tasks={state.tasks}
            filters={state.filters}
            onUpdateFilters={(filters) =>
              dispatch({ type: 'SET_FILTER', payload: filters })
            }
          />
  
          {user.role === 'admin' && (
            <UsersManagement users={state.users} />
          )}
        </div>
      </div>
    );
  }
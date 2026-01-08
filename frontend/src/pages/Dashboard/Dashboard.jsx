import { useEffect } from "react";
import { DASHBOARD_ACTIONS } from "../../context/Dashboard/DashboardReducer";
import { useDashboard } from "../../context/Dashboard/useDashboard";
import { useAuth } from "../../context/Auth/useAuth";
import api from "../../services/api";
import { DashboardSkeleton } from "../../components/DashboardSkeleton/DashboardSkeleton";
import { DashboardHeader } from "../../components/DashboardHeader/DashboardHeader";
import { TasksBoard } from "../../components/TasksBoard/TasksBoard";
import { UsersManagement } from "../../components/UsersManagement/UsersManagement";
import { ProjectsList } from "../../components/ProjectsList/ProjectsList";
import styles from './Dashboard.module.css';

export const Dashboard = () => {
    const { state, dispatch } = useDashboard();
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';
  
    // Cargar datos iniciales
    useEffect(() => {
      loadDashboardData();
      // eslint-disable-next-line
    }, []);

    useEffect(() => {
      console.log('state', state);
    },[state])
  
    const loadDashboardData = async () => {
      dispatch({ type: DASHBOARD_ACTIONS.SET_LOADING, payload: true });
      try {
        const [projects, tasks, users] = await Promise.all([
          api.getProjects(),
          api.getTasks(),
          api.getUsers()
        ]);
        dispatch({ type: DASHBOARD_ACTIONS.SET_PROJECTS, payload: projects.data });
        dispatch({ type: DASHBOARD_ACTIONS.SET_TASKS, payload: tasks.data });
        dispatch({ type: DASHBOARD_ACTIONS.SET_USERS, payload: users.data });
      } catch (error) {
        dispatch({ type: DASHBOARD_ACTIONS.SET_ERROR, payload: error.message });
      } finally {
        dispatch({ type: DASHBOARD_ACTIONS.SET_LOADING, payload: false });
      }
    };
  
    if (state.loading) {
      return <DashboardSkeleton />;
    }
  
    return (
      <div className="dashboard">
        <DashboardHeader stats={state.stats} />
  
        <div className={`${styles.dashboardGrid} ${isAdmin ? styles.adminView : ''}`}>
          <div className={styles.divProjectTasks}>
            <ProjectsList
              projects={state.projects}
              onSelectProject={(project) =>
                dispatch({ type: DASHBOARD_ACTIONS.SELECT_PROJECT, payload: project })
              }
            />
    
            <TasksBoard
              tasks={state.tasks}
              filters={state.filters}
              onUpdateFilters={(filters) =>
                dispatch({ type: DASHBOARD_ACTIONS.SET_FILTER, payload: filters })
              }
            />
          </div>
          {isAdmin && ( 
            <UsersManagement users={state.users} />
          )}
        </div>
      </div>
    );
  }
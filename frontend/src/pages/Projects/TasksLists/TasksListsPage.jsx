import { SpinnerComponent } from '../../../components/spinner/SpinnerComponent'
import { Link, useNavigate } from 'react-router'
import { formatDateDMY } from '../../../utils/dates'
import useTasksLists from './useTasksLists'

import styles from './TasksListsPage.module.css'
import { PageTitle } from '../../../components/PageTitle/PageTitle'

const TasksListsPage = () => {
    const navigate = useNavigate();
    const {
    id,
    isLoading,
    error,
    data,
    searchValue,
    breadCrumbs,
    setSearchValue,
    handleBtnDeleteClick,
    handleInputSearchKeyDown,
    handleBtnSearchClick
  } = useTasksLists();


  return (
    <>
        {isLoading && <SpinnerComponent/>}
        {error && <div className="alert alert-danger" role="alert">
            {error}
        </div>}
        <PageTitle title="Lista de Proyectos" breadCrumbs={breadCrumbs}/>
        <div className="row">
            <div className={styles.TopButtonContainer +" col"}>
                <Link to={`/projects/${id}/tasks/new`} className="btn btn-primary" type="button">Nueva Tarea</Link>
                <button to="/projects/new" className="btn btn-primary" type="button" onClick={() => navigate('/projects/' + id)}>Volver</button>
            </div>
            <div className={styles.searchContainer + " col"}>
                <input 
                    type="text" 
                    placeholder="Buscar" 
                    className={styles.searchInput} 
                    value={searchValue} 
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={(e) => handleInputSearchKeyDown(e)}
                />
                <button className={styles.noBorderButton} type="button" onClick={handleBtnSearchClick}>🔍</button>
            </div>
        </div>
        <table className="table table-striped">
            <thead>
                <tr>
                    <th scope="col">Título</th>
                    <th scope="col">Descripción</th>
                    <th scope="col">Asignado a</th>
                    <th scope="col">Estado</th>
                    <th scope="col">Fecha de Vencimiento</th>
                    <th scope="col">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {data && Array.isArray(data?.data) && data.data.length > 0 ? (
                    data.data.map((task, index) => 
                        <tr key={index}>
                            <td>{task.title}</td>
                            <td>{task.description}</td>
                            <td>{task.username}</td>
                            <td>
                                <span className={`${styles.statusBadge} ${styles[`status-${task.status}`]} ${styles[task.due_date < new Date().toISOString().split('T')[0] && task.status !== 'completed' ? 'overdue' : '' ]}`}>
                                    {task.status === 'todo' && 'Pendiente'}
                                    {task.status === 'in-progress' && 'En Progreso'}
                                    {task.status === 'completed' && 'Completada'}
                                    {task.status === 'cancelled' && 'Cancelada'}
                                </span>
                            </td>
                            <td>{formatDateDMY(task.due_date)}</td>
                            <td>
                                <Link to={`/projects/${task.project_id}/tasks/${task.id}`} className={styles.noBorderButton +" btn"}>🖊️</Link>
                                <button className={styles.noBorderButton + " btn"} onClick={() => handleBtnDeleteClick(task.id)}>✖️</button>
                            </td>
                        </tr>
                    )
                ) : (
                    <tr>
                        <td colSpan="6" className="text-center">No hay tareas disponibles</td>
                    </tr>
                )}
            </tbody>
        </table>
    </>
  )
}

export default TasksListsPage;
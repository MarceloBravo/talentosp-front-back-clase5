import { SpinnerComponent } from '../../../components/spinner/SpinnerComponent'
import { Link, useNavigate } from 'react-router'
import { formatDateDMY } from '../../../utils/dates'
import useTasksLists from './useTasksLists'

import styles from './TasksListsPage.module.css'

const TasksListsPage = () => {
    const navigate = useNavigate();
    const {
    id,
    isLoading,
    error,
    data,
    searchValue,
    setSearchValue,
    searchParams,
    handleBtnDeleteClick,
    handleInputSearchKeyDown,
    handleBtnSearchClick
  } = useTasksLists();

  console.log('proyecto en page', searchParams.get("proyecto"));

  return (
    <>
        {isLoading && <SpinnerComponent/>}
        {error && <div className="alert alert-danger" role="alert">
            {error}
        </div>}
        <h1>Tareas {searchParams.get("proyecto")}</h1>
        <div className="row">
            <div className={styles.TopButtonContainer +" col"}>
                <Link to={`/tasks/new/${id}`} className="btn btn-primary" type="button">Nueva Tarea</Link>
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
                    <th scope="col">Fecha de creación</th>
                    <th scope="col">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {data && data?.data?.map((task, index) => 
                    <tr key={index}>
                        <td>{task.title}</td>
                        <td>{task.description}</td>
                        <td>{task.username}</td>
                        <td>{formatDateDMY(task.created_at)}</td>
                        <td>
                            <Link to={`/tasks/${task.project_id}/${task.id}`} className={styles.noBorderButton +" btn"}>🖊️</Link>
                            <button className={styles.noBorderButton + " btn"} onClick={() => handleBtnDeleteClick(task.id)}>✖️</button>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    </>
  )
}

export default TasksListsPage;
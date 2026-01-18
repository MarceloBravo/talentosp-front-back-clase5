import { SpinnerComponent } from '../../../components/spinner/SpinnerComponent'
import { Link, useNavigate } from 'react-router'
import { formatDateDMY } from '../../../utils/dates'
import useTasksLists from './useTasksLists'

import styles from './TasksListsPage.module.css'

const TasksListsPage = () => {
    const navigate = useNavigate();
    const {
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
                <Link to="/projects/new" className="btn btn-primary" type="button">Nuevo</Link>
                <button to="/projects/new" className="btn btn-primary" type="button" onClick={() => navigate(-1)}>Volver</button>
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
                    <th scope="col">Nombre</th>
                    <th scope="col">Descripción</th>
                    <th scope="col">Usuario</th>
                    <th scope="col">Fecha de creación</th>
                    <th scope="col">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {data && data?.data?.map((project, index) => 
                    <tr key={index}>
                        <td>{project.title}</td>
                        <td>{project.description}</td>
                        <td>{project.username}</td>
                        <td>{formatDateDMY(project.created_at)}</td>
                        <td>
                            <Link to={`/projects/${project.id}`} className={styles.noBorderButton +" btn"}>🖊️</Link>
                            <button className={styles.noBorderButton + " btn"} onClick={() => handleBtnDeleteClick(project.id)}>✖️</button>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    </>
  )
}

export default TasksListsPage;
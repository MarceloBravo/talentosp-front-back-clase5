import { SpinnerComponent } from '../../../components/spinner/SpinnerComponent'
import { Link } from 'react-router'
import { formatDateDMY } from '../../../utils/dates'
import useProjectLists from './useProjectLists'

import styles from './ProjectListsPage.module.css'

const ProjectListsPage = () => {
    const {
    isLoading,
    error,
    data,
    searchValue,
    setSearchValue,
    handleBtnDeleteClick,
    handleInputSearchKeyDown,
    handleBtnSearchClick
  } = useProjectLists();


  return (
    <>
        {isLoading && <SpinnerComponent/>}
        {error && <div className="alert alert-danger" role="alert">
            {error}
        </div>}
        <h1>Lista de Proyectos</h1>
        <div className="row">
            <div className="col">
                <Link to="/projects/new" className="btn btn-primary" type="button">Nuevo</Link>
            </div>
            <div className="col">
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
                {data && data.data?.map((project, index) => 
                    <tr key={index}>
                        <td>{project.name}</td>
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

export default ProjectListsPage
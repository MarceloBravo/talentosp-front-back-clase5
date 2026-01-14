import { useEffect, useState } from 'react'
import { SpinnerComponent } from '../../../components/spinner/SpinnerComponent'
import { Link } from 'react-router'
import { useHttp } from '../../../hooks/useHttp'
import { formatDateDMY } from '../../../utils/dates'

import styles from './ProjectListsPage.module.css'

const ENDPOINT = process.env.REACT_APP_API_URL

const ProjectListsPage = () => {
    const { isLoading, error, data, sendRequest } = useHttp();
    const [searchValue, setSearchValue] = useState('');
    

    useEffect(()=> {
      sendRequest(ENDPOINT + '/api/projects', 'GET', null, true);
    },[])


    useEffect(() => {
      console.log(data);
    }, [data]);


    const handleBtnDeleteClick = (projectId) => {
      sendRequest(ENDPOINT + `/projects/${projectId}`, 'DELETE', null, true);
    }

    const handleInputSearchKeyDown = (e) => {
      if (e.key === 'Enter') {
        handleBtnSearchClick();
      }
    }

    const handleBtnSearchClick = () => {
      const queryParam = searchValue ? `?search=${encodeURIComponent(searchValue)}` : '';
      sendRequest(ENDPOINT + `/projects${queryParam}`, 'GET', null, true);
    }


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
                                <Link to={`/projects/${project.id}`} className={styles.noBorderButton +" btn btn-primary"}>🖊️</Link>
                                <button className={styles.noBorderButton + " btn btn-danger"} onClick={() => handleBtnDeleteClick(project.id)}>✖️</button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
  )
}

export default ProjectListsPage
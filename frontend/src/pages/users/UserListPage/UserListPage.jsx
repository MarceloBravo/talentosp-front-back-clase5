import { formatDateDMY } from "../../../utils/dates";
import { SpinnerComponent } from "../../../components/spinner/SpinnerComponent";
import { Link } from "react-router";
import { useUserListPage } from "./useUsersListPage";

import styles from './UserListPage.module.css';

export const UserListPage = () => {
    const {
        isLoading,
        error,
        users,
        searchValue,
        setSearchValue,
        handleInputSearchKeyDown,
        handleBtnSearchClick,
        handleBtnDeleteClick
    } = useUserListPage();


    return (
        <>
            {isLoading && <SpinnerComponent/>}
            {error && <div class="alert alert-danger" role="alert">
                {error}
            </div>}
            <h1>Lista de Usuarios</h1>
            <div className="row">
                <div className="col">
                    <Link to="/users/new" className="btn btn-primary" type="button">Nuevo</Link>
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
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Nombre</th>
                        <th scope="col">Email</th>
                        <th scope="col">Rol</th>
                        <th scope="col">Estado</th>
                        <th scope="col">Fecha de creación</th>
                        <th scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users?.data && users.data.map((user, index) => 
                        <tr key={index}>
                            <td>{user.nombre}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>{user.status}</td>
                            <td>{formatDateDMY(user.created_at)}</td>
                            <td>
                                <Link to={`/users/${user.id}`} className={styles.noBorderButton +" btn btn-primary"}>🖊️</Link>
                                <button className={styles.noBorderButton + " btn btn-danger"} onClick={() => handleBtnDeleteClick(user.id)}>✖️</button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    )
}
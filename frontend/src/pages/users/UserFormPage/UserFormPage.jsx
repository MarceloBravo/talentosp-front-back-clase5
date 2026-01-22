import { Link } from 'react-router-dom'
import { useUserFormPage } from './useUserFormPage';

import styles from './UserFormPage.module.css'
import { PageTitle } from '../../../components/PageTitle/PageTitle';

const DEF_AVATAR = process.env.REACT_APP_DEFAULT_AVATAR;

export const UserFormPage = () => {
    const {
        formData,
        formDataErros,
        breadCrumbs,
        ref,
        handleFieldChange,
        handleLoadAvatarClick,
        handleFileChange,
        handleBtnSaveClick,
        handleBtnDeleteClick,
    } = useUserFormPage();
    

    return (
        <div className="page-container">
            <PageTitle title="Listado de usuarios" breadCrumbs={breadCrumbs}/>
            <div className="row">
                <div className={styles.leftDiv + " col-md-3"}>
                    <img src={formData.file_url || DEF_AVATAR} alt='Avatar' className={styles.imgAvatar}/>
                    <input 
                        type="file" 
                        ref={ref} 
                        style={{display: 'none'}} 
                        onChange={handleFileChange} 
                        accept="image/png, image/jpeg"
                    />
                    <button 
                        type="button" 
                        onClick={handleLoadAvatarClick} 
                        className={styles.btnUploadAvatar + " btn btn-primary"}
                    >Cargar avatar
                    </button>
                    {formDataErros.file_url && <div className="text-danger">{formDataErros.file_url}</div>}

                </div>
                <div className="rigthDiv col-md-9">
                    <div className="mb-3 row">
                        <label htmlFor="inputName" className="col-sm-2 col-form-label">Nombre</label>
                        <div className="col-sm-10">
                            <input 
                                type="text" 
                                className="form-control" 
                                id="inputName" 
                                name="nombre" 
                                placeholder="Ingresa el nombre completo"
                                value={formData.nombre}
                                onChange={(e) => handleFieldChange(e) }
                            />
                            {formDataErros.nombre && <div className="text-danger">{formDataErros.nombre}</div>}

                        </div>
                    </div>
                    <div className="mb-3 row">
                        <label htmlFor="inputEmail" className="col-sm-2 col-form-label">Email</label>
                        <div className="col-sm-10">
                            <input 
                                type="email" 
                                className="form-control" 
                                id="inputEmail" 
                                name="email" 
                                placeholder="Ej.: juan_perez@ejemplo.cl"
                                value={formData.email}
                                onChange={(e) => handleFieldChange(e) }
                            />
                            {formDataErros.email && <div className="text-danger">{formDataErros.email}</div>}

                        </div>
                    </div>
                    <div className="mb-3 row">
                        <label htmlFor="selectRol" className="col-sm-2 col-form-label">Rol</label>
                        <div 
                            className="col-sm-10"
                        >
                            <select 
                                className="form-control" 
                                id="selectRol" 
                                name="role"
                                value={formData.role}
                                onChange={(e) => handleFieldChange(e) }
                            >
                                <option value="" disabled>Selecciona</option>
                                <option value="admin">Administrador</option>
                                <option value="user">Usuario</option>
                            </select>
                            {formDataErros.role && <div className="text-danger">{formDataErros.role}</div>}

                        </div>
                    </div>
                    <div className="mb-3 row">
                        <label htmlFor="inputPassword" className="col-sm-2 col-form-label">Contraseña</label>
                        <div className="col-sm-10">
                            <input 
                                type="password" 
                                className="form-control" 
                                id="inputPassword" 
                                name="password" 
                                placeholder="Debe tener entre 6 y 20 carácteres"
                                value={formData.password}
                                onChange={(e) => handleFieldChange(e) }
                            />
                            {formDataErros.password && <div className="text-danger">{formDataErros.password}</div>}

                        </div>
                    </div>
                    <div className="mb-3 row">
                        <label htmlFor="inputConfirmPassword" className="col-sm-2 col-form-label">Confirmar contraseña</label>
                        <div className="col-sm-10">
                            <input 
                                type="password" 
                                className="form-control" 
                                id="inputConfirmPassword" 
                                name="inputConfirmPassword" 
                                placeholder="Repite la contraseña"
                                value={formData.inputConfirmPassword}
                                onChange={(e) => handleFieldChange(e)}
                            />
                            {formDataErros.inputConfirmPassword && <div className="text-danger">{formDataErros.inputConfirmPassword}</div>}

                        </div>
                    </div>
                    <div className="mb-3 row">
                        <label htmlFor="selectEstado" className="col-sm-2 col-form-label">Estado</label>
                        <div 
                            className="col-sm-10"
                        >
                            <select 
                                className="form-control" 
                                id="selectEstado" 
                                name="activo"
                                value={formData.activo}
                                onChange={(e) => handleFieldChange(e) }
                            >
                                <option value="" disabled>Selecciona</option>
                                <option value="true">Activo</option>
                                <option value="false">Inactivo</option>
                            </select>
                            {formDataErros.activo && <div className="text-danger">{formDataErros.activo}</div>}

                        </div>
                    </div>
                    <div className={styles.buttonContainer}>
                        <button type="button" className="btn btn-success" onClick={handleBtnSaveClick}>Grabar</button>
                        <button type="button" className="btn btn-danger" onClick={handleBtnDeleteClick}>Eliminar</button>
                        <Link type="button" className="btn btn-primary" to="/users">Cancelar</Link>
                    </div>
                </div>
            </div>
            
        </div>
    )
}
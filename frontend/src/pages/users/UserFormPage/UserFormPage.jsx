import { Link, useParams } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react';
import { useHttp } from '../../../hooks/useHttp';
import imageCompression from 'browser-image-compression'

import styles from './UserFormPage.module.css'

const END_POINT = process.env.REACT_APP_API_URL;
const GET_USERS = END_POINT + '/api/users';


export const UserFormPage = () => {
    const param = useParams();
    const id = param.id;
    const { isLoading, error, data, sendRequest: http} = useHttp();
    const [ formData, setFormData ] = useState({
        nombre: '',
        email: '',
        password: '',
        inputConfirmPassword: '',
        role: '',
        activo: '',
        file_url: null,
        file: null
    });
    const [ formDataErros, setFormDataErros ] = useState({
        nombre: '',
        email: '',
        password: '',
        inputConfirmPassword: '',
        role: '',
        activo: ''
    });
    const ref = useRef(null);


    useEffect(()=> {
        if(id){
            http(GET_USERS + '/' + id, 'GET', null, true)
            .then(res => {
                setFormData({
                    nombre: res.data.nombre,
                    email: res.data.email,
                    role: res.data.role,
                    activo: res.data.status
                })
            })
        }
    },[]);


    const validaDatos = (name, value) => {
        const errMessages = {
            nombre: (value) => value.length < 3 && value.length > 100 ? 'El nombre ha de tener entre 3 y 100 carácteres' : '', 
            email: (value) => !value.includes('@') && !value.includes('.') ? 'El email no es válido' : '', 
            role: (value) => value === '' ? 'Selecciona un rol' : '', 
            activo: (value) => value === '' ? 'Selecciona un estado' : '',
            password: (value) => value.length < 8 && value.length > 20 ?  'La contraseña ha de tener entre 8 y 20 carácteres' : '', 
            inputConfirmPassword: (value) => value !== formData.password ? 'Las contraseñas no coinciden' : '',
            file: (value) => !validaImagen(value) ? 'La imagen no es válida' : ''
        }
        setFormDataErros({...formDataErros,[name]: errMessages[name](value)});
    }

    const validaImagen = (file) => {
        if (!file) {
            return false;
        }

        if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
            alert('Solo se permiten imágenes PNG o JPG');
            return false;
        }

        // La compresión se encargará del tamaño, esto es solo una comprobación previa.
        const maxSizeMB = 2;
        if (file.size > maxSizeMB * 1024 * 1024) {
            alert(`La imagen es demasiado grande. El tamaño máximo es de ${maxSizeMB}MB.`);
            return false;
        }

        return true;
    }


    const handleFieldChange = (e) => {
        validaDatos(e.target.name, e.target.value);
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })  
    }

    const handleLoadAvatarClick = () => {
        ref.current.click();
    }


    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!validaImagen(file)) {
            return;
        }

        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
        }

        try {
            const compressedFile = await imageCompression(file, options);
            
            const reader = new FileReader();
            reader.onload = () => {
                setFormData(prevFormData => ({
                    ...prevFormData,
                    file_url: reader.result,
                    file: compressedFile
                }));
            }
            reader.readAsDataURL(compressedFile);

        } catch (error) {
            alert('Ocurrió un error al procesar la imagen.');
            console.error(error);
        }
    }
    


    return (
        <>
            <h1>Formulario de Usuarios</h1>
            <div className="row">
                <div className={styles.leftDiv + " col-md-3"}>
                    <img src={formData.file_url || 'https://www.w3schools.com/howto/img_avatar.png'} alt='Avatar' className={styles.imgAvatar}/>
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
                    >Cargar avatar</button>
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
                                placeholder="Debe tener entre 8 y 20 carácteres"
                                value={formData.password}
                                onChange={(e) => handleFieldChange(e) }
                            />
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
                        </div>
                    </div>
                    <div className={styles.buttonContainer}>
                        <button type="button" className="btn btn-success">Grabar</button>
                        <button type="button" className="btn btn-danger">Eliminar</button>
                        <Link type="button" className="btn btn-primary" to="/users">Cancelar</Link>
                    </div>
                </div>
            </div>
            
        </>
    )
}
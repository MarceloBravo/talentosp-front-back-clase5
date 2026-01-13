import { Link, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react';
import { useHttp } from '../../../hooks/useHttp';
import imageCompression from 'browser-image-compression'
import useModalStore from '../../../store/useModalStore';

import styles from './UserFormPage.module.css'
import useToastStore from '../../../store/useToastStore';
import { cargarImagen } from '../../../utils/images';

const SERVER = process.env.REACT_APP_API_URL;
const END_POINT = SERVER  + '/api/users';
const DEF_AVATAR = process.env.REACT_APP_DEFAULT_AVATAR;


export const UserFormPage = () => {
    const param = useParams();
    const id = param.id;
    const navigate = useNavigate();
    const { isLoading, data, sendRequest: http} = useHttp();
    const openModal = useModalStore((state) => state.openModal);
    const response = useModalStore((state) => state.response);
    const showToast = useToastStore((state) => state.showToast);
    const [ action, setAction ] = useState('');
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
    const ACTIONS = {Crear: 'Crear', Actualizar: 'Actualizar', Eliminar: 'Eliminar'};
    const errMessages = {
            nombre: (value) => {
                if (!value) return 'El nombre es un campo requerido.';
                if (value.length < 3 || value.length > 100) return 'El nombre ha de tener entre 3 y 100 carácteres';
                return '';
            },
            email: (value) => {
                if (!value) return 'El email es un campo requerido.';
                const emailRegex = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
                if (!emailRegex.test(value)) return 'El formato del email no es válido';
                return '';
            },
            role: (value) => value === '' ? 'Selecciona un rol' : '', 
            activo: (value) => value === '' ? 'Selecciona un estado' : '',
            password: (value) => (value && (value.length < 6 || value.length > 20)) ?  'La contraseña ha de tener entre 6 y 20 carácteres' : '', 
            inputConfirmPassword: (value) => value !== formData.password ? 'Las contraseñas no coinciden' : '',
            file: (value) => !validaImagen(value) ? 'La imagen no es válida' : ''
        }

    useEffect(()=> {
        if(id && id !== 'new'){
            http(END_POINT + '/' + id, 'GET', null, true)
            .then(async res => {
                const imagen = await cargarImagen(res.data.file_url);
                setFormData({
                    nombre: res.data.nombre,
                    email: res.data.email,
                    role: res.data.role,
                    activo: res.data.status ? 'true' : 'false',
                    file_url: imagen,
                    file: null
                })
            })
        }
    },[]);



    useEffect(()=> {
        if(response){
            const sendHttp = async () => {
                if(ACTIONS.Crear === action){
                    createUser();
                }
                if(ACTIONS.Actualizar === action && id){
                    updateUser();
                }
                if(ACTIONS.Eliminar === action && id){
                    deleteUser();
                }   
            }
            sendHttp();
        }
    },[response]);

    useEffect(()=> {
        if(data?.mensaje){
            showToast(data.mensaje, data.code === 200 ? 'success': 'danger');
            if(data.code === 200){
                navigate('/users');
            }
        }
    },[data])


    const createUser = async () => {
        try{
            const data = new FormData();
            data.append('nombre', formData.nombre);
            data.append('email', formData.email);
            data.append('password', formData.password);
            data.append('role', formData.role);
            data.append('activo', formData.activo);
            if (formData.file) {
                data.append('file_url', formData.file);
            }

            await http(END_POINT, 'POST', data);
        }catch(err){
            showToast('Error al crear el registro', 'danger');
            console.log(err);
        }
    }

    const updateUser = async () => {   
        try {
            const data = new FormData();
            data.append('nombre', formData.nombre);
            data.append('email', formData.email);
            if (formData.password) {
                data.append('password', formData.password);
            }
            data.append('role', formData.role);
            data.append('activo', formData.activo);
            if (formData.file) {
                data.append('file_url', formData.file);
            }

            await http(END_POINT + '/' + id, 'PUT', data);
        } catch(err) {
            showToast('Error al actualizar el registro', 'danger');
            console.log(err);
        }
    }

    const deleteUser = async () => {
        try{
            await http(END_POINT + '/' + id, 'DELETE', null, true);
        }catch(err){
            showToast('Error al eliminar el registro', 'danger');
            console.log(err);
        }
    }
    


    const validaDatos = (name, value) => {
        if(name === 'file_url') return true;
        const message = errMessages[name](value);
        setFormDataErros({...formDataErros,[name]: message});
        return message === '';
    }


    const validaImagen = (file) => {
        if (!file && formData.file_url === null) {
            return false;
        }
        if(!file){
            return true;
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
    

    const handleBtnSaveClick = async () => {
        const newErrors = {};
        let hasError = false;

        for (const key of Object.keys(formData)) {
            if (errMessages[key]) {
                const message = errMessages[key](formData[key]);
                if (message) {
                    hasError = true;
                    newErrors[key] = message;
                }
            }
        }

        setFormDataErros(newErrors);

        if (hasError) {
            return;
        }

        setAction(id ? ACTIONS.Actualizar : ACTIONS.Crear);
        openModal('Guardar usuario', id ? '¿Deseas guardar los cambios?' : '¿Deseas grabar el registro?', null, id ? 'Actualizar registro' : 'Crear registro');
    }


    const handleBtnDeleteClick = () => {
        setAction(ACTIONS.Eliminar);
        openModal('Eliminar usuario', '¿Deseas eliminar el registro?', null, 'Eliminar registro');
    }

    

    return (
        <>
            <h1>Formulario de Usuarios</h1>
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
            
        </>
    )
}
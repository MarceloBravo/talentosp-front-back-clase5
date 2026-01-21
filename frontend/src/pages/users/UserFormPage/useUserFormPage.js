import useToastStore from '../../../store/useToastStore';
import { cargarImagen } from '../../../utils/images';
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react';
import { useHttp } from '../../../hooks/useHttp';
import imageCompression from 'browser-image-compression'
import useModalStore from '../../../store/useModalStore';

const SERVER = process.env.REACT_APP_API_URL;
const END_POINT = SERVER  + '/api/users';

export const useUserFormPage = () => {
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
    const breadCrumbs = [
        { label: 'Home', path: '/' },
        { label: 'Lista de Usuarios', path: '/users' },
        { label: formData.id ? 'Editar Usuario' : 'Nuevo Usuario', path: '#' }
    ];
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
        // eslint-disable-next-line
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
        // eslint-disable-next-line
    },[response]);

    useEffect(()=> {
        if(data?.mensaje){
            showToast(data.mensaje, data.code === 200 ? 'success': 'danger');
            if(data.code === 200){
                navigate('/users');
            }
        }
        // eslint-disable-next-line
    },[data, navigate])


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

    return {
        isLoading,
        formData,
        formDataErros,
        breadCrumbs,
        ref,
        handleFieldChange,
        handleLoadAvatarClick,
        handleFileChange,
        handleBtnSaveClick,
        handleBtnDeleteClick
    }
}
import { useHttp } from '../../hooks/useHttp';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { RegisterSchema } from './RegisterSchema';

import styles from './RegisterPage.module.css';

export const useRegisterPage = () => {
    const { loading, sendRequest } = useHttp();
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'admin',
        activo: true
    });
    const [ formErrors, setFormErrors ] = useState({});
    const [passwordStrength, setPasswordStrength] = useState(0);
    const navigate = useNavigate();


    const calculatePasswordStrength = (password) => {
        let score = 0;
        if (!password) return 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^a-zA-Z0-9]/.test(password)) score++;
        return score;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedFormData = { ...formData, [name]: value };
        setFormData(updatedFormData);

        if (name === 'password') {
            setPasswordStrength(calculatePasswordStrength(value));
        }

        const result = RegisterSchema.safeParse(updatedFormData);

        if (!result.success) {
            validaDatos(result);
        } else {
            setFormErrors({});
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const result = RegisterSchema.safeParse(formData);

        if (!result.success) {
            validaDatos(result);
            return;
        }
        // Implementación de UI optimista: la constante con datos del formulario es reseteada antes de enviar los datos
        const data = {...formData};
        setFormData({
                nombre: '',
                email: '',
                password: '',
                confirmPassword: '',
                role: 'admin'
            });

        try{
            const response = await sendRequest("/api/register", "POST", data);        
            
            alert(response.mensaje);
            setTimeout(() => {
                navigate('/login');
            }, 5000);
        }catch(error){
            alert(error.message);    
        }
    };

    const validaDatos = (result) => {
        const errors = result.error.issues.reduce((acc, error) => {
            const key = Array.isArray(error.path) && error.path.length > 0 ? error.path[0] : '_form';
            acc[key] = error.message;
            return acc;
        }, {});
        setFormErrors(errors);
    }

    const setStyleField = (errorValue, fieldValue) => {
        return errorValue ? styles.isError : (fieldValue ? styles.isOk : '')
    }

    return {
        loading,
        formData,
        formErrors,
        passwordStrength,
        handleChange,
        handleSubmit,
        setStyleField
    }
}
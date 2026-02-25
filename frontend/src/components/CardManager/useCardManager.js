import { useEffect, useState } from 'react'
import styles from './CardManager.module.css';
import { cargarImagen } from '../../utils/images';

const DEF_AVATAR = process.env.REACT_APP_DEFAULT_AVATAR;

const useCardManager = (user) => {
    const [ avatar, setAvatar ] = useState(null);

    useEffect(()=> {

    }, [])

    const translateRole = () => {
        const roleMap = {
            'admin': 'Administrador',
            'user': 'Usuario',
        };
        return roleMap[user.role] || user.role;
    };

    const getRoleClass = () => {
        const roleClasses = {
            'admin': styles.roleAdmin,
            'user': styles.roleUser,
        };
        return roleClasses[user.role] || '';
    };

    const getStatusClass = () => {
        return user.isActive ? styles.statusActive : styles.statusInactive;
    };

    useEffect(() => {
        const validateAndSetAvatar = async () => {
            //const isValidImage = await validateImageUrl(imageUrl);
            const imagen = await cargarImagen(user.file_url);

            if (imagen) {
                setAvatar(imagen);
            } else {
                setAvatar(DEF_AVATAR);
            }
        };

        validateAndSetAvatar();
    }, [user.file_url]);

  return {
    styles,
    avatar,
    translateRole,
    getRoleClass,
    getStatusClass,
  }
}

export default useCardManager
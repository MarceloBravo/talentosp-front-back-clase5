import { useEffect, useState } from "react";
import { useHttp } from "../../../hooks/useHttp"
import useUserStore from "../../../store/useUserStore";
import useModalStore from "../../../store/useModalStore";
import useToastStore from "../../../store/useToastStore";

const END_POINT = process.env.REACT_APP_API_URL;
const GET_USERS = END_POINT + '/api/users';
const DELETE_USERS = END_POINT + '/api/users';

export const useUserListPage = () => {
    const users = useUserStore((state) => state.users);
    const getUsers = useUserStore((state) => state.getUsers);
    const { isLoading, error, data, sendRequest } = useHttp();
    const [ searchValue, setSearchValue ] = useState('');
    const [ deleteId, setDeleteId ] = useState(null);
    const openModal = useModalStore((state) => state.openModal);
    const response = useModalStore((state) => state.response);  //Recibe la respuesta seleccionada por el usuario en el cuadro de dialogo Modal
    const showToast = useToastStore((state) => state.showToast);



    useEffect(() => {
        sendRequest(GET_USERS, 'GET', null, true);
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (data) {
            getUsers(data);
        }
    }, [data, getUsers])


    /**
     * Elimina usuario
     * Evalúa la respuesta seleccionada en el cuadro modal y de ser true elimina el registro
     */
    useEffect(() => {
        if (response === true && deleteId) {
            const eliminarUsuario = async () => {
                try{
                    await sendRequest(DELETE_USERS + '/' + deleteId, 'DELETE');
                    sendRequest(GET_USERS, 'GET', null, true);
                    showToast('Usuario eliminado correctamente', 'success');
                } catch (error) {
                    showToast(error.message, 'error');
                }
            }
            eliminarUsuario();
        }
        // eslint-disable-next-line
    }, [response])


    const handleInputSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleBtnSearchClick();
        }
    }

    const handleBtnSearchClick = () => {
        sendRequest(GET_USERS + '?search=' + searchValue, 'GET', null, true);
    }

    const handleBtnDeleteClick = (id) => {
        setDeleteId(id);
        openModal('Eliminar usuario', '¿Estás seguro de que quieres eliminar este usuario?', null, 'Eliminar');
    }


    return {
        isLoading,
        error,
        users,
        searchValue,
        setSearchValue,
        handleInputSearchKeyDown,
        handleBtnSearchClick,
        handleBtnDeleteClick
    }
}
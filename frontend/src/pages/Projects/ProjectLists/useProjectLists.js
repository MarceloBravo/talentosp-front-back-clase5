import { useEffect, useState } from 'react'
import { useHttp } from '../../../hooks/useHttp'
import useModalStore from '../../../store/useModalStore';
import useToastStore from '../../../store/useToastStore';

const ENDPOINT = process.env.REACT_APP_API_URL;

const useProjectLists = () => {
    const { isLoading, error, data, sendRequest } = useHttp();
    const [searchValue, setSearchValue] = useState('');
    const openModal = useModalStore((state) => state.openModal);
    const response = useModalStore((state) => state.response);  //Recibe la respuesta seleccionada por el usuario en el cuadro de dialogo Modal
    const showToast = useToastStore((state) => state.showToast);
    const [deleteId, setDeleteId] = useState(null);
    const breadCrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Lista de Proyectos', path: '#' }
  ];
    

    useEffect(()=> {
      sendRequest(ENDPOINT + '/api/projects', 'GET', null, true);
      // eslint-disable-next-line
    },[])

    useEffect(()=> {
        if(response === true && deleteId){
            const deleteProject = async () => {
                try{
                    await sendRequest(ENDPOINT + `/api/projects/${deleteId}`, 'DELETE');
                    sendRequest(ENDPOINT + '/api/projects', 'GET', null, true);
                    showToast('Proyecto eliminado correctamente', 'success');
                } catch (error) {
                    showToast(error.message, 'error');
                }
            }
            deleteProject();
        }
        // eslint-disable-next-line
    },[response])

    const handleBtnDeleteClick = (projectId) => {
        setDeleteId(projectId);
        openModal('Eliminar usuario', '¿Estás seguro de que quieres eliminar este usuario?', null, 'Eliminar');
    }

    const handleInputSearchKeyDown = (e) => {
      if (e.key === 'Enter') {
        handleBtnSearchClick();
      }
    }

    const handleBtnSearchClick = () => {
      const queryParam = searchValue ? `?search=${encodeURIComponent(searchValue)}` : '';
      sendRequest(ENDPOINT + `/api/projects${queryParam}`, 'GET', null, true);
    }

  return {
    isLoading,
    error,
    data,
    searchValue,
    breadCrumbs,
    setSearchValue,
    handleBtnDeleteClick,
    handleInputSearchKeyDown,
    handleBtnSearchClick
  }
}

export default useProjectLists;
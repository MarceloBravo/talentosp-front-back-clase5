import { useEffect, useState } from 'react'
import { useHttp } from '../../../hooks/useHttp'
import useModalStore from '../../../store/useModalStore';
import useToastStore from '../../../store/useToastStore';
import { useParams, useSearchParams } from 'react-router';

const ENDPOINT = process.env.REACT_APP_API_URL;

const useTasksLists = () => {
    const { isLoading, error, data, sendRequest } = useHttp();
    const [searchValue, setSearchValue] = useState('');
    const openModal = useModalStore((state) => state.openModal);
    const response = useModalStore((state) => state.response);  //Recibe la respuesta seleccionada por el usuario en el cuadro de dialogo Modal
    const showToast = useToastStore((state) => state.showToast);
    const [deleteId, setDeleteId] = useState(null);
    const id = useParams().id;
    const [searchParams] = useSearchParams();
   

    useEffect(()=> {
      sendRequest(ENDPOINT + '/api/tasks/project/' + id, 'GET', null, true);
      // eslint-disable-next-line
    },[id])

    useEffect(()=> {
        if(response === true && deleteId){
            const deleteTask = async () => {
                try{
                    await sendRequest(ENDPOINT + `/api/tasks/${deleteId}`, 'DELETE');
                    sendRequest(ENDPOINT + '/api/tasks/project/' + id, 'GET', null, true);
                    showToast('Tarea eliminada correctamente', 'success');
                } catch (error) {
                    showToast(error.message, 'error');
                }
            }
            deleteTask();
        }
        // eslint-disable-next-line
    },[response])

    useEffect(()=>{
      console.log('proyecto en page', data);
    },[data])

    const handleBtnDeleteClick = (taskId) => {
        setDeleteId(taskId);
        openModal('Eliminar tarea', '¿Estás seguro de que quieres eliminar esta tarea?', null, 'Eliminar');
    }

    const handleInputSearchKeyDown = (e) => {
      if (e.key === 'Enter') {
        handleBtnSearchClick();
      }
    }

    const handleBtnSearchClick = () => {
      const queryParam = searchValue ? `?search=${encodeURIComponent(searchValue)}` : '';
      sendRequest(ENDPOINT + `/api/tasks/project/${id}${queryParam}`, 'GET', null, true);
      console.log(ENDPOINT + `/api/tasks/project/${id}${queryParam}`);
    }

  return {
    id,
    isLoading,
    error,
    data,
    searchValue,
    setSearchValue,
    searchParams,
    handleBtnDeleteClick,
    handleInputSearchKeyDown,
    handleBtnSearchClick
  }
}

export default useTasksLists;
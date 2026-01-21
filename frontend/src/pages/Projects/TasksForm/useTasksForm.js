import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router';
import useModalStore from '../../../store/useModalStore';
import useToastStore from '../../../store/useToastStore';
import { useHttp } from '../../../hooks/useHttp';
import imageCompression from 'browser-image-compression'

const SERVER = process.env.REACT_APP_API_URL;
const END_POINT_USERS = SERVER  + '/api/users';
const END_POINT_TASKS = SERVER  + '/api/tasks';

const useTasksForm = () => {
    const id = useParams().id;
    const projectId = useParams().projectId;
    const openModal = useModalStore((state) => state.openModal);
    const response = useModalStore((state) => state.response);  //Recibe la respuesta seleccionada por el usuario en el cuadro de dialogo Modal
    const showToast = useToastStore((state) => state.showToast);
    const { isLoading: isLoadingUsers, error: errorUsers, data: dataUsers, sendRequest: httpUsers } = useHttp();
    const { isLoading: isLoadingTasks, error: errorTasks, sendRequest: httpTask } = useHttp();
    const [ formData, setFormData ] = useState({
      title: '',
      description: '',
      status: 'todo',
      priority: 'low',
      assignee_id: '',
      due_date: '',
      project_id: projectId || '',
      created_at: '',
      files_url: [],
      files: [],
      attachments: []  
    });
    const [ formDataErrors, setFormDataErrors ] = useState({
      title: null, 
      description: null, 
      status: null, 
      priority: null, 
      assignee_id: null, 
      due_date: null, 
      project_id: null
    });
    const [ action, setAction ] = useState('');
    const ACTIONS = {Crear: 'Crear', Actualizar: 'Actualizar', Eliminar: 'Eliminar'};
    const navigate = useNavigate();
    const ref = useRef(null);

    const breadCrumbs = [
        { label: 'Home', path: '/' },
        { label: 'Lista de Proyectos', path: '/projects' },
        { label: 'Editar Proyecto', path: `/projects/${formData.project_id}` },
        { label: 'Tareas del Proyecto', path: `/projects/${formData.project_id}/tasks` },
        { label: id ? 'Editar Tarea' : 'Nueva Tarea', path: '#' }
      ];

    useEffect(()=> {
      const loadUsers = () => {
        httpUsers(END_POINT_USERS, 'GET', null, true);
      }
      loadUsers();
      // eslint-disable-next-line
    },[]);
    

    useEffect(()=> {
      if(id && id !== 'new'){
        const loadTask = async () => {
          const resp = await httpTask(END_POINT_TASKS + '/' + id, 'GET', null, true);
            setFormData({
            title: resp.data.title,
            description: resp.data.description,  
            status: resp.data.status,
            priority: resp.data.priority,
            assignee_id: resp.data.assignee_id,
            due_date: resp.data.due_date ? resp.data.due_date.split('T')[0] : '', 
            project_id: resp.data.project_id || projectId,
            created_at: resp.data.created_at,
            attachments: resp.data.attachments || [],
            files_url: [],
            files: []
          });
        }
        loadTask();
      }
      // eslint-disable-next-line
    },[id, projectId]);

    useEffect(()=> {
        if(response){
            const sendHttp = async () => {
                if(ACTIONS.Crear === action){
                    createTask();
                }
                if(ACTIONS.Actualizar === action && id){
                    updateTask();
                }
                if(ACTIONS.Eliminar === action && id){
                    deleteTask();
                }   
            }
            sendHttp();
        }
        // eslint-disable-next-line
    },[response, action]);

    useEffect(()=> {
      if(errorUsers){
        showToast('Error al cargar los usuarios', 'danger');
      }
      if(errorTasks){
        showToast('Error al cargar el registro', 'danger');
      }
      // eslint-disable-next-line
    },[errorUsers, errorTasks]);


    const createTask = async () => {
        try{
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('status', formData.status);
            data.append('priority', formData.priority);
            data.append('assignee_id', formData.assignee_id);
            data.append('due_date', formData.due_date);
            data.append('project_id', formData.project_id);
            
            // Agregar cada archivo al FormData
            if (formData.files && formData.files.length > 0) {
                formData.files.forEach(file => {
                    data.append('attachments', file);
                });
            }

            const resp = await httpTask(END_POINT_TASKS + '/' + projectId, 'POST', data);
            showToast(resp.message, resp.code === 201 ? 'success' : 'warning');
            navigate(`/tasks/lists/${formData.project_id}`);
        }catch(err){
            showToast('Error al crear el registro', 'danger');
            console.log(err);
        }
    }

    const updateTask = async () => {   
        try {
            const data = new FormData();
            data.append('project_id', projectId);
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('status', formData.status);
            data.append('priority', formData.priority);
            data.append('assignee_id', formData.assignee_id);
            data.append('due_date', formData.due_date);
            
            // Agregar cada archivo al FormData
            if (formData.files && formData.files.length > 0) {
                formData.files.forEach(file => {
                    data.append('attachments', file);
                });
            }

            const resp = await httpTask(END_POINT_TASKS + '/' + id, 'PUT', data);
            showToast(resp.message, resp.code === 200 ? 'success' : 'warning');
            navigate(`/tasks/lists/${formData.project_id}`);
        } catch(err) {
            showToast('Error al actualizar el registro', 'danger');
            console.log(err);
        }
    }

    const deleteTask = async () => {
        try{
            const resp = await httpTask(END_POINT_TASKS + '/' + id, 'DELETE', null, true);
            showToast(resp.message, resp.code === 200 ? 'success' : 'warning');
            navigate(`/tasks/lists/${formData.project_id}`);
        }catch(err){
            showToast('Error al eliminar el registro', 'danger');
            console.log(err);
        }
    }


  const handleFieldChange = (e) => {
    validaDatos(e.target.name, e.target.value);
    setFormData({
        ...formData,
        [e.target.name]: e.target.value
    })  
  }

  const handleBtnSaveClick = async () => {
    try{
      let errors = false;
      Object.keys(formData).forEach((field) => {
        const errResult = validaDatos(field, formData[field]);
        if(errResult) errors = true; //NUll si no se ha recibido un mensaje de error de lo contrario Se recibió el mensaje de error
      });

      if (errors) {
        showToast('Por favor, corrige los errores en el formulario.', 'error');
        return;
      }
      setAction(id ? ACTIONS.Actualizar : ACTIONS.Crear);
      openModal('Guardar tarea', `¿Deseas ${id ? 'actualizar' : 'grabar'} el registro?`,null, id ? 'Actualizar registro' : 'Grabar registro');
    }catch(error){
      showToast(error.message, 'error');
    }
  }

  const validaDatos = (field, value) => {
    const conditions = {
      title: (value) => {
        if(!value || value.trim() === '') return 'Este campo es requerido.'
        if(value.length < 3 || value.length > 100) return 'Debe tener entre 3 y 100 caracteres.'
        return null;
      },
      description: (value) => !value || value.trim() === '' ? 'Este campo es requerido.' : null,
      status: (value) => !value ? 'Este campo es requerido.' : null,
      priority: (value) => !value ? 'Este campo es requerido.' : null,
      assignee_id: (value) => {
        if(!value || isNaN(Number(value))) return 'Este campo es requerido.'
        if(dataUsers && !dataUsers.data.find(user => user.id === Number(value))) return 'El usuario seleccionado no es válido.'
        return null;
      },
      due_date: (value) => !value ? 'Este campo es requerido.' : null,
      project_id: (value) => !value ? 'El proyecto es requerido.' : null
    }
      const mensaje = conditions[field] ? conditions[field](value) : null;
      setFormDataErrors(prev => ({...prev, [field]: mensaje  }));
      return typeof mensaje === 'string';
  }

  const handleBtnDeleteClick = () => {
    setAction(ACTIONS.Eliminar);
    openModal('Eliminar tarea', '¿Deseas eliminar el registro?', null, 'Eliminar registro');
  }

  const handleFileChange = async (e) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
      };

      try {
          // Procesar todos los archivos en paralelo
          const filePromises = Array.from(files).map(async (file) => {
              if (!validaImagen(file)) {
                  return null;
              }

              try {
                  const originalFileName = file.name;  // Guardar nombre original
                  const compressedFile = await imageCompression(file, options);
                  
                  // Crear un nuevo File con el nombre original
                  const fileWithOriginalName = new File(
                      [compressedFile],
                      originalFileName,
                      { type: compressedFile.type }
                  );
                  
                  return new Promise((resolve) => {
                      const reader = new FileReader();
                      reader.onload = () => {
                          resolve({
                              url: reader.result,
                              file: fileWithOriginalName
                          });
                      };
                      reader.readAsDataURL(compressedFile);
                  });
              } catch (error) {
                  console.error('Error al procesar la imagen:', error);
                  return null;
              }
          });

          const processedFiles = await Promise.all(filePromises);
          const validFiles = processedFiles.filter(f => f !== null);

          if (validFiles.length > 0) {
              setFormData(prevFormData => ({
                  ...prevFormData,
                  files_url: [...(prevFormData.files_url ?? []), ...validFiles.map(f => f.url)],
                  files: [...(prevFormData.files ?? []), ...validFiles.map(f => f.file)]
              }));
          }
      } catch (error) {
          alert('Ocurrió un error al procesar las imágenes.');
          console.error(error);
      }
  }

  const validaImagen = (file) => {
        if (!file) {
            return false;
        }

        // Tipos MIME permitidos: imágenes y documentos
        const allowedMimeTypes = [
            'image/png',
            'image/jpeg',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/csv',
            'text/plain',
            'application/zip',
            'application/x-rar-compressed',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        ];

        // Validar por extensión como fallback
        const ext = file.name.split('.').pop().toLowerCase();
        const allowedExtensions = ['png', 'jpg', 'jpeg', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'txt', 'zip', 'rar', 'ppt', 'pptx'];
        
        if (!allowedMimeTypes.includes(file.type) && !allowedExtensions.includes(ext)) {
            alert('Tipo de archivo no permitido. Solo se permiten: imágenes (PNG, JPG), documentos (PDF, DOC, DOCX, XLS, XLSX, CSV, TXT, PPT, PPTX) y comprimidos (ZIP, RAR)');
            return false;
        }

        // La compresión se encargará del tamaño de imágenes, esto es solo una comprobación previa.
        const maxSizeMB = 2;
        if (file.size > maxSizeMB * 1024 * 1024) {
            alert(`El archivo es demasiado grande. El tamaño máximo es de ${maxSizeMB}MB.`);
            return false;
        }

        return true;
    }

  const isImage = (fileName) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
    const ext = fileName.split('.').pop().toLowerCase();
    return imageExtensions.includes(ext);
  }

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    const iconMap = {
      pdf: '📄',
      doc: '📝',
      docx: '📝',
      xls: '📊',
      xlsx: '📊',
      csv: '📊',
      txt: '📋',
      zip: '📦',
      rar: '📦',
      ppt: '🎯',
      pptx: '🎯',
      default: '📎'
    };
    return iconMap[ext] || iconMap.default;
  }

  const handleDownloadAttachment = async (attachment) => {
    try {
      const fileUrl = SERVER + attachment.file_url;
      window.open(fileUrl, '_blank');
    } catch (error) {
      console.error('Error al abrir el archivo:', error);
      showToast('Error al abrir el archivo', 'danger');
    }
  }

  const removeAttachment = (index) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      files_url: prevFormData.files_url.filter((_, i) => i !== index),
      files: prevFormData.files.filter((_, i) => i !== index)
    }));
  }


  return {
    id,
    formData,
    formDataErrors,
    isLoadingUsers,
    dataUsers,
    breadCrumbs,
    isLoadingTasks,
    ref,
    handleFieldChange,
    handleBtnSaveClick,
    handleBtnDeleteClick,
    handleFileChange,
    isImage,
    getFileIcon,
    handleDownloadAttachment,
    removeAttachment

  }
}

export default useTasksForm;
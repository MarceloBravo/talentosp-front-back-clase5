import { Link } from 'react-router';
import { SpinnerComponent } from '../../../components/spinner/SpinnerComponent';

import styles from './TasksFormPage.module.css'
import useTasksForm from './useTasksForm';

const SERVER = process.env.REACT_APP_API_URL;

const TasksFormPage = () => {
    const {
      id,
    formData,
    formDataErrors,
    isLoadingUsers,
    dataUsers,
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
  } = useTasksForm();


  return (
    <>
    {(isLoadingUsers || isLoadingTasks) && <SpinnerComponent/>}
      <h1>Formulario de Tarea</h1>
      <div className="row">
          <div className="rigthDiv col-md-9">
              <div className="mb-3 row">
                  <label htmlFor="title" className="col-sm-2 col-form-label">Título</label>
                  <div className="col-sm-10">
                      <input 
                          type="text" 
                          className="form-control" 
                          id="inputTitle" 
                          name="title" 
                          placeholder="Ingresa el título de la tarea"
                          maxLength="100"
                          value={formData.title}
                          onChange={(e) => handleFieldChange(e) }
                      />
                      {formDataErrors.title && <div className="text-danger">{formDataErrors.title}</div>}

                  </div>
              </div>
              <div className="mb-3 row">
                  <label htmlFor="description" className="col-sm-2 col-form-label">Descripción</label>
                  <div className="col-sm-10">
                      <input 
                          type="text" 
                          className="form-control" 
                          id="description" 
                          name="description" 
                          placeholder="Ingresa una descripción de la tarea"
                          value={formData.description}
                          onChange={(e) => handleFieldChange(e) }
                      />
                      {formDataErrors.description && <div className="text-danger">{formDataErrors.description}</div>}

                  </div>
              </div>
              <div className="mb-3 row">
                  <label htmlFor="status" className="col-sm-2 col-form-label">Estado</label>
                  <div className="col-sm-10">
                      <select 
                          className="form-control" 
                          id="status" 
                          name="status"
                          value={formData.status}
                          onChange={(e) => handleFieldChange(e) }
                      >
                          <option value="todo">Pendiente</option>
                          <option value="in-progress">En Progreso</option>
                          <option value="completed">Completada</option>
                          <option value="cancelled">Cancelado</option>
                      </select>
                      {formDataErrors.status && <div className="text-danger">{formDataErrors.status}</div>}
                  </div>
              </div>
              <div className="mb-3 row">
                  <label htmlFor="priority" className="col-sm-2 col-form-label">Prioridad</label>
                  <div className="col-sm-10">
                      <select 
                          className="form-control" 
                          id="priority" 
                          name="priority"
                          value={formData.priority}
                          onChange={(e) => handleFieldChange(e) }
                      >
                          <option value="low">Baja</option>
                          <option value="medium">Media</option>
                          <option value="high">Alta</option>
                      </select>
                      {formDataErrors.priority && <div className="text-danger">{formDataErrors.priority}</div>}
                  </div>
              </div>
              <div className="mb-3 row">
                  <label htmlFor="assigneeId" className="col-sm-2 col-form-label">Asignado a</label>
                  <div className="col-sm-10">
                      <select 
                          className="form-control" 
                          id="assigneeId" 
                          name="assignee_id"
                          value={formData.assignee_id}
                          onChange={(e) => handleFieldChange(e) }
                      >
                          <option value="" disabled>Selecciona</option>
                          {dataUsers && dataUsers.data?.map((user, index) => 
                            <option key={index} value={user.id}>{user.nombre}</option>
                          )}
                      </select>
                      {formDataErrors.assignee_id && <div className="text-danger">{formDataErrors.assignee_id}</div>}
                  </div>
              </div>
              <div className="mb-3 row">
                  <label htmlFor="dueDate" className="col-sm-2 col-form-label">Fecha Vencimiento</label>
                  <div className="col-sm-10">
                      <input 
                          type="date" 
                          className="form-control" 
                          id="dueDate" 
                          name="due_date" 
                          value={formData.due_date}
                          onChange={(e) => handleFieldChange(e) }
                      />
                      {formDataErrors.due_date && <div className="text-danger">{formDataErrors.due_date}</div>}
                  </div>
              </div>


              <div className="mb-3">
                <label htmlFor="formFileMultiple" className="form-label">Adjuntar archivos a la tarea</label>
                <input 
                  className="form-control" 
                  type="file" 
                  id="formFileMultiple" 
                  multiple 
                  ref={ref}
                  onChange={handleFileChange}
                />
              </div>

              <div className={styles.attachmentsContainer}>
                {formData.attachments && formData.attachments.length > 0 && (
                  <div className={styles.attachmentsGrid}>
                    {formData.attachments.map((attachment, index) => (
                      <div key={attachment.id} className={styles.attachmentItem}>
                        {isImage(attachment.file_name) ? (
                          <img 
                            src={SERVER + attachment.file_url} 
                            alt={attachment.file_name}
                            className={styles.attachmentImage}
                            onClick={() => handleDownloadAttachment(attachment)}
                          />
                        ) : (
                          <div 
                            className={styles.attachmentIcon}
                            onClick={() => handleDownloadAttachment(attachment)}
                          >
                            <span className={styles.icon}>{getFileIcon(attachment.file_name)}</span>
                          </div>
                        )}
                        <p className={styles.attachmentName}>{attachment.file_name}</p>
                        <small className={styles.attachmentDate}>
                          {new Date(attachment.uploaded_at).toLocaleDateString()}
                        </small>
                      </div>
                    ))}
                  </div>
                )}
                {formData.files_url && formData.files_url.length > 0 && (
                  <div className={styles.attachmentsGrid}>
                    {formData.files_url.map((fileUrl, index) => (
                      <div key={`new-file-${index}`} className={styles.attachmentItem}>
                        {isImage(formData.files[index]?.name || '') ? (
                          <img 
                            src={fileUrl} 
                            alt={formData.files[index]?.name}
                            className={styles.attachmentImage}
                          />
                        ) : (
                          <div className={styles.attachmentIcon}>
                            <span className={styles.icon}>{getFileIcon(formData.files[index]?.name || '')}</span>
                          </div>
                        )}
                        <p className={styles.attachmentName}>{formData.files[index]?.name}</p>
                        <button 
                          type="button"
                          className={styles.removeBtn}
                          onClick={() => removeAttachment(index)}
                          title="Eliminar"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className={styles.CrudButtons}>
                <button type="button" className="btn btn-success" onClick={handleBtnSaveClick}>Grabar</button>
                <button type="button" className="btn btn-danger" onClick={handleBtnDeleteClick}>Eliminar</button>
                <Link type="button" className="btn btn-primary" to={formData.project_id ? `/tasks/lists/${formData.project_id}` : "/projects"}>Cancelar</Link>
              </div>
          </div>
      </div>
      
  </>
  )
}

export default TasksFormPage
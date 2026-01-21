import { Link } from 'react-router';
import { SpinnerComponent } from '../../../components/spinner/SpinnerComponent';

import styles from './ProjectFormPage.module.css'
import useProjectForm from './useProjectForm';
import { PageTitle } from '../../../components/PageTitle/PageTitle';

const SERVER = process.env.REACT_APP_API_URL;

const ProjectFormPage = () => {
    const {
      id,
      formData,
      formDataErrors,
      isLoadingUsers,
      dataUsers,
      isLoadingProjects,
      ref,
      breadCrumbs,
      handleFieldChange,
      handleBtnSaveClick,
      handleBtnDeleteClick,
      handleFileChange,
      isImage,
      getFileIcon,
      handleDownloadAttachment,
      removeAttachment
  } = useProjectForm();
  

  return (
    <>
    {(isLoadingUsers || isLoadingProjects) && <SpinnerComponent/>}
      <PageTitle title="Lista de Proyectos" breadCrumbs={breadCrumbs}/>
      <div className="row">
          <div className="rigthDiv col-md-9">
              <div className="mb-3 row">
                  <label htmlFor="name" className="col-sm-2 col-form-label">Nombre</label>
                  <div className="col-sm-10">
                      <input 
                          type="text" 
                          className="form-control" 
                          id="inputName" 
                          name="name" 
                          placeholder="Ingresa el nombre del proyecto"
                          maxLength="100"
                          value={formData.name}
                          onChange={(e) => handleFieldChange(e) }
                      />
                      {formDataErrors.name && <div className="text-danger">{formDataErrors.name}</div>}

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
                          placeholder="Ingresa una descripción del proyecto"
                          value={formData.description}
                          onChange={(e) => handleFieldChange(e) }
                      />
                      {formDataErrors.description && <div className="text-danger">{formDataErrors.description}</div>}

                  </div>
              </div>
              <div className="mb-3 row">
                  <label htmlFor="ownerId" className="col-sm-2 col-form-label">Asignado a</label>
                  <div 
                      className="col-sm-10"
                  >
                      <select 
                          className="form-control" 
                          id="ownerId" 
                          name="owner_id"
                          value={formData.owner_id}
                          onChange={(e) => handleFieldChange(e) }
                      >
                          <option value="" disabled>Selecciona</option>
                          {dataUsers && dataUsers.data?.map((user, index) => 
                            <option key={index} value={user.id}>{user.nombre}</option>
                          )}
                      </select>
                      {formDataErrors.owner_id && <div className="text-danger">{formDataErrors.owner_id}</div>}

                  </div>
              </div>
              <div className="mb-3">
                <label htmlFor="formFileMultiple" className="form-label">Adjuntar archivos al proyecto</label>
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
              
              <div className={styles.buttonContainer}>
                  {id && <Link type="button" className="btn btn-primary" to={`/projects/${id}/tasks?proyecto=${formData.name}`}>Ver tareas</Link>}
                  <div className={styles.CrudButtons}>
                    <button type="button" className="btn btn-success" onClick={handleBtnSaveClick}>Grabar</button>
                    <button type="button" className="btn btn-danger" onClick={handleBtnDeleteClick}>Eliminar</button>
                    <Link type="button" className="btn btn-primary" to="/projects">Cancelar</Link>
                  </div>
              </div>
          </div>
      </div>
      
  </>
  )
}

export default ProjectFormPage
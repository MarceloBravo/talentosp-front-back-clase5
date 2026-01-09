import useModalStore from "../../store/useModalStore"
import styles from './Modal.module.css';

export const Modal = () => {
    const { title, message, isOpen, handleBtnCancel, handleBtnOk } = useModalStore();

    return (
        <>
            {isOpen && (
                <div className={"modal fade " + styles.customModal} id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">{title}</h1>
                            </div>
                            <div className="modal-body">
                                {message}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleBtnCancel}>Cancelar</button>
                                <button type="button" className="btn btn-primary" onClick={handleBtnOk}>Aceptar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
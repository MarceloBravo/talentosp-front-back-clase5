import { useEffect } from "react";
import useToastStore from "../../store/useToastStore";
import styles from './Toast.module.css';

const ToastItem = ({ toast }) => {
    const { closeToast } = useToastStore();
    const { id, message, type } = toast;

    useEffect(() => {
        const timer = setTimeout(() => {
            closeToast(id);
        }, 5000);
        return () => clearTimeout(timer);
    }, [id, closeToast]);

    const toastType = type || "primary";

    return (
        <div className={`${styles.toast} toast show align-items-center text-bg-${toastType} border-0`} role="alert" aria-live="assertive" aria-atomic="true">
            <div className="d-flex w-100">
                <div className="toast-body">
                    {message}
                </div>
                <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close" onClick={() => closeToast(id)}></button>
            </div>
        </div>
    );
};

const Toast = () => {
    const { toasts } = useToastStore();
    const reversedToasts = [...toasts].reverse();

    return (
        <div className={styles.toastContainer}>
            {reversedToasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} />
            ))}
        </div>
    );
};

export default Toast;
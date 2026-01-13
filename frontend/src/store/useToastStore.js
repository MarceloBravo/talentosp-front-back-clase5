import { create } from 'zustand';

const useToastStore = create((set) => ({
    toasts: [],
    showToast: (message, type) => {
        const id = Date.now();
        set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    },
    closeToast: (id) => set((state) => ({
        toasts: state.toasts.filter((toast) => toast.id !== id)
    })),
}));

export default useToastStore;
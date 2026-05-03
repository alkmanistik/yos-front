import { useState, useCallback } from 'react';
import Toast, { type ToastType } from "../ui/components/Toast.tsx";

interface ToastMessage {
    id: number;
    message: string;
    type: ToastType;
}

export const useToast = () => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
    }, []);

    const removeToast = useCallback((id: number) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const ToastContainer = useCallback(() => (
        <>
            {toasts.map(toast => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </>
    ), [toasts, removeToast]);

    return { showToast, ToastContainer };
};
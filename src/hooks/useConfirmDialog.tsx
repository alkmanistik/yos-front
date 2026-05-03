import { useState, useCallback } from 'react';
import ConfirmDialog from "../ui/components/ConfirmDialog.tsx";

interface ConfirmOptions {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info' | 'success';
}

export const useConfirmDialog = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState<ConfirmOptions>({
        title: '',
        message: '',
        type: 'danger'
    });
    const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null);

    const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
        setOptions(options);
        setIsOpen(true);

        return new Promise((resolve) => {
            setResolvePromise(() => resolve);
        });
    }, []);

    const handleConfirm = useCallback(() => {
        setIsOpen(false);
        if (resolvePromise) {
            resolvePromise(true);
            setResolvePromise(null);
        }
    }, [resolvePromise]);

    const handleCancel = useCallback(() => {
        setIsOpen(false);
        if (resolvePromise) {
            resolvePromise(false);
            setResolvePromise(null);
        }
    }, [resolvePromise]);

    const ConfirmDialogContainer = useCallback(() => (
        <ConfirmDialog
            isOpen={isOpen}
            title={options.title}
            message={options.message}
            confirmText={options.confirmText}
            cancelText={options.cancelText}
            type={options.type}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
        />
    ), [isOpen, options, handleConfirm, handleCancel]);

    return { confirm, ConfirmDialogContainer };
};
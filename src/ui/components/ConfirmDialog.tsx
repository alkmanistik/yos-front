import React from 'react';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    type?: 'danger' | 'warning' | 'info' | 'success';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
                                                         isOpen,
                                                         title,
                                                         message,
                                                         confirmText = 'Подтвердить',
                                                         cancelText = 'Отмена',
                                                         onConfirm,
                                                         onCancel,
                                                         type = 'danger'
                                                     }) => {
    if (!isOpen) return null;

    const getConfirmButtonStyles = () => {
        switch (type) {
            case 'danger':
                return 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
            case 'warning':
                return 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500';
            case 'success':
                return 'bg-green-600 hover:bg-green-700 focus:ring-green-500';
            default:
                return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'danger':
                return (
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                        <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                );
            case 'warning':
                return (
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100">
                        <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                );
            case 'success':
                return (
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                        <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                );
            default:
                return (
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                        <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                );
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onCancel}
            />
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full transform transition-all">
                    <div className="p-6">
                        <div className="mb-4">
                            {getIcon()}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                            {title}
                        </h3>
                        <p className="text-sm text-gray-500 text-center">
                            {message}
                        </p>
                    </div>
                    <div className="flex gap-3 p-6 pt-0">
                        <button
                            onClick={onCancel}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${getConfirmButtonStyles()}`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
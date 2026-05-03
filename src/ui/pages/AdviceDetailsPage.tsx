import { useState, useEffect } from 'react';
import AdviceComponent from '../components/AdviceComponent';
import {useAuth} from "../../contexts/AuthContext.tsx";
import {useNavigate, useParams} from "react-router";
import type {AdviceResponse} from "../../types/advice.ts";
import {adviceApi} from "../../api/adviceApi.ts";
import {useToast} from "../../hooks/useToast.tsx";
import {useConfirmDialog} from "../../hooks/useConfirmDialog.tsx";

const AdviceDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const [advice, setAdvice] = useState<AdviceResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { showToast, ToastContainer } = useToast();
    const { confirm, ConfirmDialogContainer } = useConfirmDialog();

    useEffect(() => {
        if (id) {
            loadAdvice(id);
        }
    }, [id]);

    const loadAdvice = async (adviceId: string) => {
        try {
            setLoading(true);
            setError(null);
            const adviceData = await adviceApi.getAdviceById(adviceId);
            setAdvice(adviceData);
        } catch (err) {
            console.error('Error loading advice:', err);
            setError('Не удалось загрузить совет');
            showToast('Не удалось загрузить совет', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (advice: AdviceResponse) => {
        navigate(`/advice/create?edit=${advice.id}`);
    };

    const handleDelete = async (adviceId: string) => {
        const confirmed = await confirm({
            title: 'Удаление совета',
            message: 'Вы уверены, что хотите удалить этот совет? Это действие нельзя отменить.',
            confirmText: 'Удалить',
            cancelText: 'Отмена',
            type: 'danger'
        });

        if (confirmed) {
            try {
                await adviceApi.deleteAdvice(adviceId);
                showToast('Совет успешно удалён! 🗑️', 'success');
                navigate('/advice');
            } catch (err) {
                console.error('Error deleting advice:', err);
                showToast('Не удалось удалить совет', 'error');
            }
        }
    };

    const handleBack = () => {
        navigate('/advice');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !advice) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">❌</span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        {error || 'Совет не найден'}
                    </h2>
                    <button
                        onClick={() => navigate('/advice')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                        Вернуться к советам
                    </button>
                </div>
            </div>
        );
    }

    const isOwnAdvice = currentUser?.id === advice.userId;

    return (
        <>
            <ToastContainer />
            <ConfirmDialogContainer />
            <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
                <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8">
                    <button
                        onClick={handleBack}
                        className="mb-4 sm:mb-6 flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Назад к советам
                    </button>

                    <AdviceComponent
                        advice={advice}
                        onBack={handleBack}
                        onEdit={isOwnAdvice ? handleEdit : undefined}
                        onDelete={isOwnAdvice ? handleDelete : undefined}
                        onWishCreated={() => {
                            showToast('Желание успешно создано! ✨', 'success');
                        }}
                    />
                </div>
            </div>
        </>
    );
};

export default AdviceDetailPage;
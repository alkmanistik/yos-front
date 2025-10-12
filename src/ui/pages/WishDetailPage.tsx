import {useNavigate, useParams} from "react-router";
import {useAuth} from "../../contexts/AuthContext.tsx";
import {useEffect, useState} from "react";
import type {WishResponse} from "../../types/wish.ts";
import {wishApi} from "../../api/wishApi.ts";
import WishComponent from "../components/WishComponent.tsx";

const WishDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const [wish, setWish] = useState<WishResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            loadWish(id);
        }
    }, [id]);

    const loadWish = async (wishId: string) => {
        try {
            setLoading(true);
            setError(null);
            const wishData = await wishApi.getWishById(wishId);
            setWish(wishData);
        } catch (err) {
            console.error('Error loading wish:', err);
            setError('Не удалось загрузить желание');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (wish: WishResponse) => {
        navigate(`/wish/create?edit=${wish.id}`);
    };

    const handleDelete = async (wishId: string) => {
        if (window.confirm('Вы уверены, что хотите удалить это желание?')) {
            try {
                await wishApi.deleteWish(wishId);
                navigate('/wish');
            } catch (err) {
                console.error('Error deleting wish:', err);
                setError('Не удалось удалить желание');
            }
        }
    };

    const handleMarkFulfilled = async (wishId: string) => {
        try {
            await wishApi.markAsFulfilled(wishId);
            loadWish(wishId); // Перезагружаем данные
        } catch (err) {
            console.error('Error marking wish as fulfilled:', err);
            setError('Не удалось отметить желание как исполненное');
        }
    };

    const handleBack = () => {
        navigate('/wish');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    if (error || !wish) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">❌</span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        {error || 'Желание не найдено'}
                    </h2>
                    <button
                        onClick={() => navigate('/wish')}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                        Вернуться к желаниям
                    </button>
                </div>
            </div>
        );
    }

    const isOwnWish = currentUser?.id === wish.userId;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={handleBack}
                    className="mb-6 flex items-center text-purple-600 hover:text-purple-800 text-sm font-medium"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Назад к желаниям
                </button>

                <WishComponent
                    wish={wish}
                    onBack={handleBack}
                    onEdit={isOwnWish ? handleEdit : undefined}
                    onDelete={isOwnWish ? handleDelete : undefined}
                    onMarkFulfilled={isOwnWish ? handleMarkFulfilled : undefined}
                    isOwn={isOwnWish}
                />
            </div>
        </div>
    );
};

export default WishDetailPage;
import { useState, useEffect } from 'react';
import { userApi } from '../../api/userApi';
import type { UserShortResponse } from '../../types/user';
import UserCard from './UserCard';
import {useNavigate} from "react-router";

interface SubscriptionsModalProps {
    userId: string;
    onClose: () => void;
}

const SubscriptionsModal: React.FC<SubscriptionsModalProps> = ({ userId, onClose }) => {
    const [subscriptions, setSubscriptions] = useState<UserShortResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadSubscriptions = async () => {
            try {
                setLoading(true);
                const data = await userApi.getSubs(userId);
                setSubscriptions(data);
            } catch (err) {
                setError('Не удалось загрузить подписки');
                console.error('Error loading subscriptions:', err);
            } finally {
                setLoading(false);
            }
        };

        loadSubscriptions();
    }, [userId]);

    const handleUserClick = (userId: string) => {
        navigate(`/user/${userId}`);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-md max-h-[80vh] overflow-hidden">
                {/* Заголовок */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Подписки</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl"
                    >
                        ×
                    </button>
                </div>

                {/* Содержимое */}
                <div className="max-h-[60vh] overflow-y-auto">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : error ? (
                        <div className="p-6 text-center text-red-600">{error}</div>
                    ) : subscriptions.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">Нет подписок</div>
                    ) : (
                        subscriptions.map(user => (
                            <UserCard
                                key={user.id}
                                user={user}
                                onClick={handleUserClick}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default SubscriptionsModal;
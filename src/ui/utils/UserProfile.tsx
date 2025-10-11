import { useState, useEffect } from 'react';
import type { UserResponse } from '../../types/user';
import { userApi } from '../../api/userApi';
import { useAuth } from '../../contexts/AuthContext';
import { imageApi } from '../../api/imageApi';
import { useUserImages } from '../../hooks/useUserImages';

interface UserProfileProps {
    user: UserResponse;
    isOwnProfile: boolean;
    counts: {
        subscriptions: number;
        followers: number;
        wishes: number;
        advices: number;
    };
    loadingCounts: boolean;
    onShowSubscriptions: () => void;
    onShowFollowers: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({
                                                     user,
                                                     isOwnProfile,
                                                     counts,
                                                     loadingCounts,
                                                     onShowSubscriptions,
                                                     onShowFollowers
                                                 }) => {
    const { user: currentUser } = useAuth();
    const { loading: loadingImages, getAvatarUrl } = useUserImages(user.id);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [loadingSubscription, setLoadingSubscription] = useState(false);

    const avatarUrl = getAvatarUrl();

    useEffect(() => {
        const checkSubscription = async () => {
            if (!currentUser || isOwnProfile) return;

            try {
            } catch (error) {
                console.error('Error checking subscription:', error);
            }
        };

        checkSubscription();
    }, [currentUser, user.id, isOwnProfile]);

    const handleSubscription = async () => {
        if (!currentUser || isOwnProfile) return;

        setLoadingSubscription(true);
        try {
            if (isSubscribed) {
                await userApi.removeSub(user.id);
                setIsSubscribed(false);
            } else {
                await userApi.addSub(user.id);
                setIsSubscribed(true);
            }
        } catch (error) {
            console.error('Error updating subscription:', error);
        } finally {
            setLoadingSubscription(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start space-x-6">
                {/* Аватар */}
                <div className="flex-shrink-0">
                    {loadingImages ? (
                        <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse"></div>
                    ) : avatarUrl ? (
                        <img
                            src={imageApi.getImageUrl(avatarUrl.split('/').pop() || '')}
                            alt={`${user.username}'s avatar`}
                            className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                        />
                    ) : (
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>

                {/* Информация */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {user.name || user.username}
                            </h1>
                            <p className="text-gray-500">@{user.username}</p>
                            {user.informationForWish && (
                                <p className="text-gray-600 mt-2">{user.informationForWish}</p>
                            )}
                        </div>

                        {/* Кнопка подписки */}
                        {!isOwnProfile && currentUser && (
                            <button
                                onClick={handleSubscription}
                                disabled={loadingSubscription}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    isSubscribed
                                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {loadingSubscription ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                                ) : isSubscribed ? (
                                    'Отписаться'
                                ) : (
                                    'Подписаться'
                                )}
                            </button>
                        )}
                    </div>

                    {/* Статистика */}
                    <div className="flex space-x-6 mt-4">
                        <button
                            onClick={onShowSubscriptions}
                            className="text-center hover:text-blue-600 transition-colors cursor-pointer"
                        >
                            <div className="text-lg font-semibold text-gray-900">
                                {loadingCounts ? '...' : counts.subscriptions}
                            </div>
                            <div className="text-sm text-gray-500">Подписки</div>
                        </button>

                        <button
                            onClick={onShowFollowers}
                            className="text-center hover:text-blue-600 transition-colors cursor-pointer"
                        >
                            <div className="text-lg font-semibold text-gray-900">
                                {loadingCounts ? '...' : counts.followers}
                            </div>
                            <div className="text-sm text-gray-500">Подписчики</div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
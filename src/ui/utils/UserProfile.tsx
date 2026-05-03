import {useState, useEffect} from 'react';
import type {UserResponse} from '../../types/user';
import {userApi} from '../../api/userApi';
import {useAuth} from '../../contexts/AuthContext';
import {imageApi} from '../../api/imageApi';
import {useUserImages} from '../../hooks/useUserImages';
import SubscribeButton from "../components/SubscribeButton.tsx";
import {useNavigate} from "react-router";

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
    onUpdateCounts?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({
                                                     user,
                                                     isOwnProfile,
                                                     counts,
                                                     loadingCounts,
                                                     onShowSubscriptions,
                                                     onShowFollowers,
                                                     onUpdateCounts,
                                                 }) => {
    const {user: currentUser} = useAuth();
    const {loading: loadingImages, getAvatarUrl} = useUserImages(user.id);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isFriend, setIsFriend] = useState(false);
    const [loadingSubscription, setLoadingSubscription] = useState(true);
    const navigate = useNavigate();

    const avatarUrl = getAvatarUrl();

    useEffect(() => {
        const checkSubscription = async () => {
            if (!currentUser || isOwnProfile) {
                setIsFriend(false);
                setIsSubscribed(false);
                setLoadingSubscription(false);
                return;
            }

            setLoadingSubscription(true);
            try {
                const subStatus = await userApi.getSubStatus(user.id);
                if (subStatus.status === "FRIEND") {
                    setIsFriend(true);
                    setIsSubscribed(true);
                } else if (subStatus.status === "SUB") {
                    setIsFriend(false);
                    setIsSubscribed(true);
                } else {
                    setIsFriend(false);
                    setIsSubscribed(false);
                }
            } catch (error) {
                console.error('Error checking subscription:', error);
            } finally {
                setLoadingSubscription(false);
            }
        };

        checkSubscription();
    }, [currentUser, user.id, isOwnProfile]);

    const handleEditProfile = () => {
        navigate('/user/update');
    };

    const getSubscribeVariant = () => {
        if (isSubscribed) return 'secondary';
        return 'primary';
    };

    // Плавное отображение скелетона для счётчиков
    const CountDisplay = ({ value, label }: { value: number | string; label: string }) => (
        <div className="text-center sm:text-left">
            <div className="text-lg font-bold text-gray-900">
                {loadingCounts ? (
                    <span className="inline-block w-8 h-5 bg-gray-200 animate-pulse rounded"></span>
                ) : (
                    value
                )}
            </div>
            <div className="text-xs text-gray-500">{label}</div>
        </div>
    );

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Шапка профиля с фоном */}
            <div className="h-24 sm:h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20"></div>

            <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                {/* Аватар - наезжает на шапку */}
                <div className="relative -mt-12 sm:-mt-16 mb-3 sm:mb-4">
                    {loadingImages ? (
                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-full animate-pulse border-4 border-white shadow-md"></div>
                    ) : avatarUrl ? (
                        <img
                            src={imageApi.getImageUrl(avatarUrl.split('/').pop() || '')}
                            alt={`${user.username}'s avatar`}
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white shadow-md"
                        />
                    ) : (
                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl font-bold border-4 border-white shadow-md">
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>

                {/* Имя и кнопка */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                            {user.username}
                        </h1>
                        {user.name && (
                            <p className="text-sm text-gray-500 mt-0.5">{user.name}</p>
                        )}
                    </div>

                    {/* Кнопка действия */}
                    <div className="flex justify-end">
                        {loadingSubscription ? (
                            <div className="w-24 h-9 bg-gray-200 rounded-lg animate-pulse"></div>
                        ) : isOwnProfile ? (
                            <button
                                onClick={handleEditProfile}
                                className="flex items-center gap-1.5 px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                <span>Редактировать</span>
                            </button>
                        ) : currentUser ? (
                            <SubscribeButton
                                targetUserId={user.id}
                                size="md"
                                variant={getSubscribeVariant()}
                                showFriendStatus={true}
                                onSubscriptionChange={() => {
                                    onUpdateCounts?.();
                                }}
                            />
                        ) : null}
                    </div>
                </div>

                {/* Информация для желаний */}
                {user.informationForWish && (
                    <p className="text-sm text-gray-600 mt-3 break-words bg-gray-50 rounded-lg p-2 sm:p-3">
                        {user.informationForWish}
                    </p>
                )}

                {/* Статистика */}
                <div className="flex flex-wrap gap-4 sm:gap-6 mt-4 pt-3 sm:pt-4 border-t border-gray-100">
                    <button
                        onClick={onShowSubscriptions}
                        className="hover:opacity-70 transition-opacity text-center sm:text-left cursor-pointer"
                    >
                        <CountDisplay value={counts.subscriptions} label="Подписок" />
                    </button>
                    <button
                        onClick={onShowFollowers}
                        className="hover:opacity-70 transition-opacity text-center sm:text-left cursor-pointer"
                    >
                        <CountDisplay value={counts.followers} label="Подписчиков" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
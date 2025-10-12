import {Navigate, useLocation, useNavigate, useParams} from "react-router";
import {useEffect, useState} from "react";
import {useAuth} from "../../contexts/AuthContext.tsx";
import UserProfile from "../utils/UserProfile.tsx";
import type {UserResponse} from "../../types/user.ts";
import {userApi} from "../../api/userApi.ts";
import ErrorPage from "./ErrorPage.tsx";
import AdviceList from "../components/AdviceList.tsx";
import SubscriptionsModal from "../components/SubscriptionsModal.tsx";
import FollowersModal from "../components/FollowersModal.tsx";
import {subscriptionEvents} from '../../events/subscriptionEvents';
import WishList from "../components/WishList.tsx";
import {wishApi} from "../../api/wishApi.ts";

type TabType = 'advices' | 'wishes' | 'fulfilledWishes';

const UserPage = () => {
    const {id} = useParams();
    const location = useLocation();
    const {user: currentUser} = useAuth();
    const [activeTab, setActiveTab] = useState<TabType>('advices');
    const [isOwnProfile, setIsOwnProfile] = useState(true);
    const [userNotFound, setUserNotFound] = useState(false);
    const [counts, setCounts] = useState({
        wishes: 0,
        advices: 0,
        subscriptions: 0,
        followers: 0,
        wishFulfilled: 0,
    });
    const [loadingCounts, setLoadingCounts] = useState(false);
    const [showSubscriptionsModal, setShowSubscriptionsModal] = useState(false);
    const [showFollowersModal, setShowFollowersModal] = useState(false);

    const [profileUser, setProfileUser] = useState<UserResponse | null>(null);

    const displayUser = isOwnProfile ? currentUser : profileUser;

    const navigate = useNavigate();

    useEffect(() => {
        const handleSubscriptionsUpdate = () => {
            loadCounts();
        };

        subscriptionEvents.addEventListener('subscriptionsUpdated', handleSubscriptionsUpdate);

        return () => {
            subscriptionEvents.removeEventListener('subscriptionsUpdated', handleSubscriptionsUpdate);
        };
    }, []);

    useEffect(() => {
        const loadUserData = async () => {
            try {
                setUserNotFound(false);
                if (id) {
                    if (currentUser != null && currentUser.id == id) {
                        setIsOwnProfile(true);
                        setProfileUser(currentUser);
                    } else {
                        setIsOwnProfile(false);
                        const userData = await userApi.getUser(id);
                        setProfileUser(userData);
                    }
                } else {
                    if (currentUser) navigate(`/user/${currentUser.id}`, {replace: true});
                }
            } catch (error) {
                console.error('Error loading user data:', error);
                setUserNotFound(true);
            }
        };

        loadUserData();
    }, [id, currentUser, navigate]);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const tab = searchParams.get('tab') as TabType;
        if (tab && ['advices', 'wishes'].includes(tab)) {
            setActiveTab(tab);
        }
    }, [location.search]);

    const loadCounts = async () => {
        if (!displayUser?.id) return;

        try {
            setLoadingCounts(true);
            const [wishCount, adviceCount, subscriptionsCount, followersCount, wishFulfilledCount] = await Promise.all([
                wishApi.getWishCount(displayUser.id),
                userApi.getAdviceCount(displayUser.id),
                userApi.getSubCount(displayUser.id),
                userApi.getFolCount(displayUser.id),
                wishApi.getFulfilledWishCount(displayUser.id)
            ]);

            setCounts({
                wishes: wishCount,
                advices: adviceCount,
                subscriptions: subscriptionsCount,
                followers: followersCount,
                wishFulfilled: wishFulfilledCount,
            });
        } catch (error) {
            console.error('Error loading counts:', error);
        } finally {
            setLoadingCounts(false);
        }
    };

    useEffect(() => {
        loadCounts();
    }, [displayUser?.id]);

    if (!currentUser && !id) {
        return <Navigate to="/" replace/>;
    }

    if (userNotFound) {
        return (
            <ErrorPage
                code={404}
                title="Пользователь не найден"
                description={id ? `Пользователь с ID ${id} не существует` : 'Не удалось загрузить данные пользователя'}
                showHomeButton={true}
                showLoginButton={!id}
            />
        );
    }

    if (!displayUser) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Профиль пользователя */}
            <UserProfile
                user={displayUser}
                isOwnProfile={isOwnProfile}
                counts={counts}
                loadingCounts={loadingCounts}
                onShowSubscriptions={() => setShowSubscriptionsModal(true)}
                onShowFollowers={() => setShowFollowersModal(true)}
                onUpdateCounts={loadCounts}
            />

            {/* Вкладки */}
            <div className="mt-8">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('advices')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'advices'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            📝 Советы
                            <span className="ml-2 bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
            {loadingCounts ? '...' : counts.advices}
        </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('wishes')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'wishes'
                                    ? 'border-purple-500 text-purple-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            🎁 Желания
                            <span className="ml-2 bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-full">
            {loadingCounts ? '...' : counts.wishes}
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('fulfilledWishes')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'fulfilledWishes'
                                    ? 'border-green-500 text-green-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            ✅ Исполненные
                            <span className="ml-2 bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
            {loadingCounts ? '...' : counts.wishFulfilled || 0}
                            </span>
                        </button>
                    </nav>
                </div>

                {/* Контент вкладок */}
                <div className="py-6">
                    {activeTab === 'advices' && (
                        <AdviceList
                            userId={displayUser.id}
                            showActions={isOwnProfile}
                            pageSize={10}
                        />
                    )}
                    {activeTab === 'wishes' && (
                        <WishList
                            userId={displayUser.id}
                            showActions={isOwnProfile}
                            pageSize={10}
                        />
                    )}
                    {activeTab === 'fulfilledWishes' && (
                        <WishList
                            userId={displayUser.id}
                            showActions={false}
                            pageSize={10}
                            showFulfilled={true}
                        />
                    )}
                </div>
            </div>

            {/* Модальные окна */}
            {showSubscriptionsModal && (
                <SubscriptionsModal
                    userId={displayUser.id}
                    onClose={() => setShowSubscriptionsModal(false)}
                />
            )}

            {showFollowersModal && (
                <FollowersModal
                    userId={displayUser.id}
                    onClose={() => setShowFollowersModal(false)}
                />
            )}
        </div>
    );
};

export default UserPage;
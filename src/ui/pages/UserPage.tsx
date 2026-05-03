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
import {adviceApi} from "../../api/adviceApi.ts";

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
    }, [displayUser?.id]); // Добавил зависимость

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
        if (tab && ['advices', 'wishes', 'fulfilledWishes'].includes(tab)) {
            setActiveTab(tab);
        }
    }, [location.search]);

    const loadCounts = async () => {
        if (!displayUser?.id) return;

        try {
            setLoadingCounts(true);
            const [wishCount, adviceCount, subscriptionsCount, followersCount, wishFulfilledCount] = await Promise.all([
                wishApi.getWishCount(displayUser.id),
                adviceApi.getAdviceCount(displayUser.id),
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

    const tabs = [
        { id: 'advices' as TabType, label: '📝 Советы', color: 'blue' },
        { id: 'wishes' as TabType, label: '🎁 Желания', color: 'purple' },
        { id: 'fulfilledWishes' as TabType, label: '✅ Исполненные', color: 'green' },
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
            {/* Профиль пользователя */}
            <UserProfile
                user={displayUser}
                isOwnProfile={isOwnProfile}
                counts={counts}
                loadingCounts={loadingCounts}
                onShowSubscriptions={() => setShowSubscriptionsModal(true)}
                onShowFollowers={() => setShowFollowersModal(true)}
                onUpdateCounts={() => loadCounts()}
            />

            {/* Адаптивные вкладки */}
            <div className="mt-6 sm:mt-8">
                {/* Десктопные табы */}
                <div className="hidden sm:block border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                    activeTab === tab.id
                                        ? `border-${tab.color}-500 text-${tab.color}-600`
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                {tab.label}
                                <span className={`ml-2 bg-${tab.color}-100 text-${tab.color}-600 text-xs px-2 py-1 rounded-full`}>
                                    {loadingCounts ? '...' : (tab.id === 'advices' ? counts.advices : tab.id === 'wishes' ? counts.wishes : counts.wishFulfilled || 0)}
                                </span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Мобильные табы - селект */}
                <div className="sm:hidden">
                    <select
                        value={activeTab}
                        onChange={(e) => setActiveTab(e.target.value as TabType)}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-base font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        {tabs.map((tab) => (
                            <option key={tab.id} value={tab.id}>
                                {tab.label} ({tab.id === 'advices' ? counts.advices : tab.id === 'wishes' ? counts.wishes : counts.wishFulfilled || 0})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Контент вкладок */}
                <div className="py-4 sm:py-6">
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
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { userApi } from '../../api/userApi';
import UserGuide from "../components/UserGuide.tsx";
import AdminGuide from "../components/AdminGuide.tsx";
import ModeratorInstructions from "../components/ModeratorInstructions.tsx";

const HelpPage = () => {
    const { user } = useAuth();
    const [userStatus, setUserStatus] = useState<string>('');
    const [loadingStatus, setLoadingStatus] = useState(true);
    const [activeTab, setActiveTab] = useState<'user' | 'admin' | 'moderator'>('user');
    const tabsContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadUserStatus = async () => {
            if (user?.id) {
                try {
                    setLoadingStatus(true);
                    const status = await userApi.getUserStatus(user.id);
                    setUserStatus(status.status);
                } catch (error) {
                    console.error('Error loading user status:', error);
                } finally {
                    setLoadingStatus(false);
                }
            } else {
                setLoadingStatus(false);
            }
        };

        loadUserStatus();
    }, [user?.id]);

    const isSupport = userStatus === 'SUPPORT' && !loadingStatus;
    const showAdminTabs = isSupport;

    const tabs = [
        { id: 'user' as const, label: '📖 Руководство пользователя' },
        { id: 'admin' as const, label: '⚙️ Руководство администратора' },
        { id: 'moderator' as const, label: '📋 Должностные инструкции' },
    ];

    // Если пользователь не SUPPORT, показываем только руководство пользователя
    if (!showAdminTabs) {
        return <UserGuide />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
                {/* Заголовок */}
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Документация</h1>
                    <p className="text-sm sm:text-base text-gray-500 mt-2">
                        Руководства и инструкции для работы с сервисом
                    </p>
                </div>

                {/* Адаптивные табы - скролл на мобильных */}
                <div className="border-b border-gray-200 mb-6 sm:mb-8">
                    <div
                        ref={tabsContainerRef}
                        className="flex sm:space-x-8 overflow-x-auto scrollbar-hide -mb-px"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-shrink-0 py-3 sm:py-4 px-3 sm:px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                                    activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Контент по активному табу */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 sm:p-6">
                        {activeTab === 'user' && <UserGuide />}
                        {activeTab === 'admin' && <AdminGuide />}
                        {activeTab === 'moderator' && <ModeratorInstructions />}
                    </div>
                </div>
            </div>

            {/* Скрываем скроллбар для Webkit браузеров */}
            <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
};

export default HelpPage;
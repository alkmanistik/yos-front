import { useState, useEffect } from 'react';
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

    // Если пользователь не SUPPORT, показываем только руководство пользователя
    if (!showAdminTabs) {
        return <UserGuide />;
    }

    // Для SUPPORT показываем табы с тремя документами
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Заголовок */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Документация</h1>
                    <p className="text-gray-500 mt-2">
                        Руководства и инструкции для работы с сервисом
                    </p>
                </div>

                {/* Табы */}
                <div className="border-b border-gray-200 mb-8">
                    <nav className="flex space-x-8">
                        <button
                            onClick={() => setActiveTab('user')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === 'user'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            📖 Руководство пользователя
                        </button>
                        <button
                            onClick={() => setActiveTab('admin')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === 'admin'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            ⚙️ Руководство администратора
                        </button>
                        <button
                            onClick={() => setActiveTab('moderator')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === 'moderator'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            📋 Должностные инструкции
                        </button>
                    </nav>
                </div>

                {/* Контент по активному табу */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {activeTab === 'user' && <UserGuide />}
                    {activeTab === 'admin' && <AdminGuide />}
                    {activeTab === 'moderator' && <ModeratorInstructions />}
                </div>
            </div>
        </div>
    );
};

export default HelpPage;
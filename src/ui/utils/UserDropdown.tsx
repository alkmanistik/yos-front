import {useEffect, useRef, useState} from "react";
import {useAuth} from "../../contexts/AuthContext.tsx";
import {useNavigate} from "react-router";
import {useUserImages} from "../../hooks/useUserImages.ts";
import {userApi} from "../../api/userApi.ts";

const avatarUpdateEvent = new EventTarget();

// eslint-disable-next-line react-refresh/only-export-components
export const notifyAvatarUpdate = () => {
    avatarUpdateEvent.dispatchEvent(new Event('avatarUpdated'));
};

const UserDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [userStatus, setUserStatus] = useState<string>('');
    const [loadingStatus, setLoadingStatus] = useState(true);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { loading: loadingImages, getAvatarUrl, refreshImages } = useUserImages(user?.id);

    const avatarUrl = getAvatarUrl();

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
            }
        };

        loadUserStatus();
    }, [user?.id]);

    useEffect(() => {
        const handleAvatarUpdate = () => {
            refreshImages();
        };

        avatarUpdateEvent.addEventListener('avatarUpdated', handleAvatarUpdate);

        return () => {
            avatarUpdateEvent.removeEventListener('avatarUpdated', handleAvatarUpdate);
        };
    }, [refreshImages]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleItemClick = (path: string) => {
        navigate(path);
        setIsOpen(false);
    };

    const menuItems = [
        {
            icon: '👤',
            label: 'Мой профиль',
            path: '/user/',
            description: 'Просмотр и редактирование профиля'
        },
        {
            icon: '👥',
            label: 'Найти друзей',
            path: '/user/search',
            description: 'Поиск и приглашение друзей'
        },
        {
            icon: '❓',
            label: 'Помощь',
            path: '/help',
            description: 'Центр помощи и поддержки'
        },
    ];

    if (userStatus === 'SUPPORT' && !loadingStatus) {
        menuItems.push({
            icon: '⚙️',
            label: 'Админ панель',
            path: '/admin',
            description: 'Управление системой'
        });
    }

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Кнопка пользователя */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-3 bg-gray-50 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors border border-gray-200"
            >
                {loadingImages ? (
                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                ) : avatarUrl ? (
                    <img
                        src={"http://localhost:8080" + avatarUrl}
                        alt={`${user?.username}'s avatar`}
                        className="w-8 h-8 rounded-full object-cover shadow-sm"
                        key={avatarUrl}
                    />
                ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm">
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                )}
                <svg
                    className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Выпадающее меню */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    {/* Заголовок */}
                    <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-900">
                                    {user?.name || user?.username}
                                </p>
                                <p className="text-sm text-gray-500 truncate">
                                    {user?.email}
                                </p>
                            </div>
                            {userStatus === 'SUPPORT' && (
                                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                                    SUPPORT
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Список пунктов меню */}
                    <div className="max-h-96 overflow-y-auto">
                        {menuItems.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => handleItemClick(item.path)}
                                className="w-full px-4 py-3 flex items-start space-x-3 hover:bg-gray-50 transition-colors text-left"
                            >
                                <span className="text-lg flex-shrink-0">{item.icon}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900">
                                        {item.label}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {item.description}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Разделитель */}
                    <div className="border-t border-gray-100 my-1"></div>

                    {/* Выход */}
                    <button
                        onClick={() => {
                            logout();
                            setIsOpen(false);
                        }}
                        className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-red-50 transition-colors text-left group"
                    >
                        <span className="text-lg flex-shrink-0 group-hover:text-red-600">🚪</span>
                        <div>
                            <p className="text-sm font-medium text-gray-900 group-hover:text-red-600">
                                Выйти
                            </p>
                            <p className="text-xs text-gray-500 group-hover:text-red-500">
                                Завершить текущую сессию
                            </p>
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserDropdown;
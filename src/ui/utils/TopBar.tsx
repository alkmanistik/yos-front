import {Link, useLocation} from "react-router";
import {useState, useEffect} from "react";
import {useAuth} from "../../contexts/AuthContext.tsx";
import UserDropdown from "./UserDropdown.tsx";
import {userApi} from "../../api/userApi.ts";

const TopBar = () => {
    const location = useLocation();
    const {user, logout} = useAuth(); // ← logout получаем здесь
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [userStatus, setUserStatus] = useState<string>('');
    const [loadingStatus, setLoadingStatus] = useState(true);

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

    const navigation = [
        {name: 'Идеи', href: '/advice', icon: '💡'},
        {name: 'Желания', href: '/wish', icon: '🎁'},
        {name: 'Органайзер', href: '/tool', icon: '📋'},
    ];

    // Пункты для мобильного меню (из UserDropdown)
    const mobileMenuItems = [
        {icon: '👤', label: 'Мой профиль', path: '/user/'},
        {icon: '👥', label: 'Найти друзей', path: '/user/search'},
        {icon: '❓', label: 'Помощь', path: '/help'},
    ];

    if (userStatus === 'SUPPORT' && !loadingStatus) {
        mobileMenuItems.push({
            icon: '⚙️',
            label: 'Админ панель',
            path: '/admin',
        });
    }

    const isActive = (path: string) => location.pathname === path;
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    const handleLogout = () => {
        logout();
        closeMobileMenu();
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/advice" className="text-xl font-bold text-blue-600">
                            Yos
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-8">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                    isActive(item.href)
                                        ? 'text-blue-600 bg-blue-50'
                                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop User menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <button
                                    className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                                    aria-label="Уведомления"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                        3
                                    </span>
                                </button>
                                <UserDropdown />
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link
                                    to="/auth/login"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Войти
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center space-x-3 md:hidden">
                        {user && (
                            <button
                                className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                                aria-label="Уведомления"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                    3
                                </span>
                            </button>
                        )}

                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none transition-colors"
                            aria-label="Открыть меню"
                        >
                            {isMobileMenuOpen ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile menu panel */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-200 py-4 animate-slideDown">
                        {/* Основная навигация */}
                        <div className="mb-4">
                            <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                Навигация
                            </p>
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    onClick={closeMobileMenu}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                                        isActive(item.href)
                                            ? 'text-blue-600 bg-blue-50'
                                            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <span className="text-xl">{item.icon}</span>
                                    <span>{item.name}</span>
                                </Link>
                            ))}
                        </div>

                        {/* Пользовательское меню (для авторизованных) */}
                        {user && (
                            <div className="mb-4">
                                <div className="px-4 py-2 bg-gray-50 rounded-lg mx-4 mb-2">
                                    <p className="text-sm font-medium text-gray-900">
                                        {user?.name || user?.username}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {user?.email}
                                    </p>
                                    {userStatus === 'SUPPORT' && (
                                        <span className="inline-block mt-1 bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full font-medium">
                                            SUPPORT
                                        </span>
                                    )}
                                </div>

                                {mobileMenuItems.map((item, index) => (
                                    <Link
                                        key={index}
                                        to={item.path}
                                        onClick={closeMobileMenu}
                                        className="flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                                    >
                                        <span className="text-xl">{item.icon}</span>
                                        <span>{item.label}</span>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* Разделитель и выход (для авторизованных) */}
                        {user && (
                            <>
                                <div className="border-t border-gray-100 my-2"></div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <span className="text-xl">🚪</span>
                                    <span>Выйти</span>
                                </button>
                            </>
                        )}

                        {/* Кнопка входа для неавторизованных */}
                        {!user && (
                            <div className="pt-4 mt-2 border-t border-gray-100">
                                <Link
                                    to="/auth/login"
                                    onClick={closeMobileMenu}
                                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-base font-medium transition-colors"
                                >
                                    Войти
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
};

export default TopBar;
import {Link, useLocation} from "react-router";
import {useAuth} from "../../contexts/AuthContext.tsx";
import UserDropdown from "./UserDropdown.tsx";

const TopBar = () => {
    const location = useLocation();

    const {user} = useAuth();

    const navigation = [
        {name: 'Главная', href: '/'},
        {name: 'Идеи', href: '/advice'},
        {name: 'Желания', href: '/wish'},
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-xl font-bold text-blue-600">
                            Yos
                        </Link>
                    </div>

                    {/* Navigation */}
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

                    {/* User menu */}
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                {/* Уведомления */}
                                <button
                                    className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                                    🔔
                                    <span
                                        className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                        3
                                    </span>
                                </button>
                                {/* Выпадающее меню пользователя */}
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
                </div>
            </div>
        </header>
    );
};

export default TopBar;
import { useState, useEffect } from 'react';
import {useAuth} from "../../contexts/AuthContext.tsx";
import {useNavigate} from "react-router";
import type {UserAdminResponse} from "../../types/user.ts";
import type {PaginationParams} from "../../types/pagination.ts";
import type {AdviceAdminResponse} from "../../types/advice.ts";
import type {WishAdminResponse} from "../../types/wish.ts";
import {adminApi} from "../../api/adminApi.ts";
import {userApi} from "../../api/userApi.ts";

type AdminTab = 'users' | 'advices' | 'wishes';

const AdminPage = () => {
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState<AdminTab>('users');
    const [, setUserStatus] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAdminAccess = async () => {
            if (!currentUser?.id) {
                navigate('/advice');
                return;
            }

            try {
                const status = await userApi.getUserStatus(currentUser.id);
                setUserStatus(status.status);

                if (status.status !== 'SUPPORT') {
                    navigate('/advice');
                }
            } catch (error) {
                console.error('Error checking admin access:', error);
                navigate('/advice');
            } finally {
                setLoading(false);
            }
        };

        checkAdminAccess();
    }, [currentUser, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Заголовок */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Админ панель</h1>
                    <p className="text-gray-600 mt-2">Управление пользователями, советами и желаниями</p>
                </div>

                {/* Вкладки */}
                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'users'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            👥 Пользователи
                        </button>
                        <button
                            onClick={() => setActiveTab('advices')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'advices'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            💡 Советы
                        </button>
                        <button
                            onClick={() => setActiveTab('wishes')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'wishes'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            🎁 Желания
                        </button>
                    </nav>
                </div>

                {/* Контент вкладок */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    {activeTab === 'users' && <UsersTab />}
                    {activeTab === 'advices' && <AdvicesTab />}
                    {activeTab === 'wishes' && <WishesTab />}
                </div>
            </div>
        </div>
    );
};

const UsersTab = () => {
    const [users, setUsers] = useState<UserAdminResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [pagination, setPagination] = useState({
        page: 0,
        size: 10,
        hasMore: false
    });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async (page: number = 0, append: boolean = false) => {
        try {
            setLoading(true);
            const params: PaginationParams = {
                page,
                size: pagination.size,
                sort: 'DESC'
            };

            const response = await adminApi.getAllUsers(searchQuery, params);

            if (append) {
                setUsers(prev => [...prev, ...response]);
            } else {
                setUsers(response);
            }

            setPagination(prev => ({
                ...prev,
                page,
                hasMore: response.length >= pagination.size
            }));
        } catch (error) {
            console.error('Error loading users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        loadUsers(0, false);
    };

    const handleDeleteUser = async (userId: string) => {
        if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
            try {
                await adminApi.deleteUser(userId);
                console.log('Delete user:', userId);
                setUsers(prev => prev.filter(user => user.id !== userId));
            } catch (error) {
                console.error('Error deleting user:', error);
                alert('Не удалось удалить пользователя');
            }
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <form onSubmit={handleSearch} className="flex gap-4">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Поиск пользователей..."
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                        Найти
                    </button>
                </form>
            </div>

            {loading ? (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Пользователь
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Роль
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Статус
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Дата создания
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Действия
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">
                                            {user.username}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {user.email}
                                        </div>
                                        {user.name && (
                                            <div className="text-sm text-gray-500">
                                                {user.name}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            user.role === 'SUPPORT'
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-green-100 text-green-800'
                                        }`}>
                                            {user.role}
                                        </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            user.deleted
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-green-100 text-green-800'
                                        }`}>
                                            {user.deleted ? 'Удален' : 'Активен'}
                                        </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => handleDeleteUser(user.id)}
                                        className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded text-sm transition-colors"
                                    >
                                        Удалить
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {users.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500">
                    Пользователи не найдены
                </div>
            )}
        </div>
    );
};

const AdvicesTab = () => {
    const [advices, setAdvices] = useState<AdviceAdminResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadAdvices();
    }, []);

    const loadAdvices = async () => {
        try {
            setLoading(true);
            const response = await adminApi.getAllAdvices(searchQuery);
            setAdvices(response);
        } catch (error) {
            console.error('Error loading advices:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        loadAdvices();
    };

    const handleDeleteAdvice = async (adviceId: string) => {
        if (window.confirm('Вы уверены, что хотите удалить этот совет?')) {
            try {
                await adminApi.deleteAdvice(adviceId);
                setAdvices(prev => prev.filter(advice => advice.id !== adviceId));
            } catch (error) {
                console.error('Error deleting advice:', error);
                alert('Не удалось удалить совет');
            }
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <form onSubmit={handleSearch} className="flex gap-4">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Поиск советов..."
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                        Найти
                    </button>
                </form>
            </div>

            {loading ? (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Заголовок
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Пользователь
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Категория
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Тип
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Дата создания
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Действия
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {advices.map((advice) => (
                            <tr key={advice.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="max-w-xs">
                                        <div className="text-sm font-medium text-gray-900 truncate">
                                            {advice.title}
                                        </div>
                                        {advice.description && (
                                            <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                                                {advice.description}
                                            </div>
                                        )}
                                        {advice.link && (
                                            <a
                                                href={advice.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 text-xs truncate block mt-1"
                                            >
                                                {advice.link}
                                            </a>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {advice.userId}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {advice.category ? (
                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {advice.category}
                                            </span>
                                    ) : (
                                        <span className="text-gray-400 text-xs">—</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            advice.adAdvice
                                                ? 'bg-orange-100 text-orange-800'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {advice.adAdvice ? 'Рекламный' : 'Обычный'}
                                        </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(advice.createdAt).toLocaleDateString('ru-RU')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => handleDeleteAdvice(advice.id)}
                                        className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded text-sm transition-colors"
                                    >
                                        Удалить
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {advices.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500">
                    Советы не найдены
                </div>
            )}
        </div>
    );
};

const WishesTab = () => {
    const [wishes, setWishes] = useState<WishAdminResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadWishes();
    }, []);

    const loadWishes = async () => {
        try {
            setLoading(true);
            const response = await adminApi.getAllWishes(searchQuery);
            setWishes(response);
        } catch (error) {
            console.error('Error loading wishes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        loadWishes();
    };

    const handleDeleteWish = async (wishId: string) => {
        if (window.confirm('Вы уверены, что хотите удалить это желание?')) {
            try {
                await adminApi.deleteWish(wishId);
                setWishes(prev => prev.filter(wish => wish.id !== wishId));
            } catch (error) {
                console.error('Error deleting wish:', error);
                alert('Не удалось удалить желание');
            }
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <form onSubmit={handleSearch} className="flex gap-4">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Поиск желаний..."
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                        Найти
                    </button>
                </form>
            </div>

            {loading ? (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Желание
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Пользователь
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Цена
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Статус
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Исполнитель
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Дата создания
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Действия
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {wishes.map((wish) => (
                            <tr key={wish.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="max-w-xs">
                                        <div className="text-sm font-medium text-gray-900 truncate">
                                            {wish.title}
                                        </div>
                                        {wish.description && (
                                            <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                                                {wish.description}
                                            </div>
                                        )}
                                        {wish.link && (
                                            <a
                                                href={wish.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 text-xs truncate block mt-1"
                                            >
                                                {wish.link}
                                            </a>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {wish.userId}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {wish.price || (
                                        <span className="text-gray-400 text-xs">—</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            wish.fulfilled
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {wish.fulfilled ? 'Исполнено' : 'Активно'}
                                        </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {wish.giverUser || (
                                        <span className="text-gray-400 text-xs">—</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(wish.createdAt).toLocaleDateString('ru-RU')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => handleDeleteWish(wish.id)}
                                        className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded text-sm transition-colors"
                                    >
                                        Удалить
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {wishes.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500">
                    Желания не найдены
                </div>
            )}
        </div>
    );
};

export default AdminPage;
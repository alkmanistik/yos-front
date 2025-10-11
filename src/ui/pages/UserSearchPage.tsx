import { useState, useEffect, useCallback } from 'react';
import { userApi } from '../../api/userApi';
import { useUserImages } from '../../hooks/useUserImages';
import type { UserShortResponse } from '../../types/user';
import type { PaginationParams } from '../../types/pagination';
import {useNavigate} from "react-router";

const UserSearchPage = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState<UserShortResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        currentPage: 0,
        totalPages: 0,
        totalElements: 0,
        size: 10
    });

    const [debouncedQuery, setDebouncedQuery] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const searchUsers = useCallback(async (query: string, page: number = 0) => {
        if (!query.trim()) {
            setUsers([]);
            setPagination(prev => ({ ...prev, currentPage: 0, totalPages: 0, totalElements: 0 }));
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const params: PaginationParams = {
                page,
                size: pagination.size,
                sort: 'ASC'
            };

            const response = await userApi.searchUsers(query, params);
            setUsers(response);

            const hasMore = response.length === pagination.size;
            setPagination(prev => ({
                ...prev,
                currentPage: page,
                totalPages: hasMore ? page + 2 : page + 1,
                totalElements: (page * pagination.size) + response.length + (hasMore ? 1 : 0)
            }));
        } catch (err: any) {
            console.error('Error searching users:', err);
            setError('Не удалось выполнить поиск');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, [pagination.size]);

    useEffect(() => {
        if (debouncedQuery.trim()) {
            searchUsers(debouncedQuery, 0);
        } else {
            setUsers([]);
        }
    }, [debouncedQuery, searchUsers]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            searchUsers(searchQuery, 0);
        }
    };

    const handleLoadMore = () => {
        if (pagination.currentPage < pagination.totalPages - 1) {
            searchUsers(debouncedQuery, pagination.currentPage + 1);
        }
    };

    const handleUserClick = (userId: string) => {
        navigate(`/user/${userId}`);
    };

    const hasMore = pagination.currentPage < pagination.totalPages - 1;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Заголовок */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Поиск пользователей</h1>
                    <p className="text-gray-600">Найдите друзей и других пользователей по имени пользователя</p>
                </div>

                {/* Поисковая строка */}
                <form onSubmit={handleSearch} className="mb-8">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Введите имя пользователя..."
                            className="w-full p-4 pl-12 pr-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </form>

                {/* Результаты поиска */}
                <div className="space-y-4">
                    {/* Состояние загрузки */}
                    {loading && (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    )}

                    {/* Сообщение об ошибке */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-700">{error}</p>
                        </div>
                    )}

                    {/* Сообщение "не найдено" */}
                    {!loading && debouncedQuery && users.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-6xl mb-4">🔍</div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Пользователи не найдены</h3>
                            <p className="text-gray-500">Попробуйте изменить запрос поиска</p>
                        </div>
                    )}

                    {/* Список пользователей */}
                    {users.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Найдено пользователей: {pagination.totalElements}
                                </h2>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {users.map((user) => (
                                    <UserSearchResult
                                        key={user.id}
                                        user={user}
                                        onClick={handleUserClick}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Кнопка "Загрузить еще" */}
                    {hasMore && users.length > 0 && (
                        <div className="flex justify-center pt-4">
                            <button
                                onClick={handleLoadMore}
                                disabled={loading}
                                className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Загрузка...' : 'Загрузить еще'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

interface UserSearchResultProps {
    user: UserShortResponse;
    onClick: (userId: string) => void;
}

const UserSearchResult = ({ user, onClick }: UserSearchResultProps) => {
    const { loading, getAvatarUrl } = useUserImages(user.id);
    const avatarUrl = getAvatarUrl();

    return (
        <div
            onClick={() => onClick(user.id)}
            className="flex items-center space-x-4 p-6 hover:bg-gray-50 cursor-pointer transition-colors"
        >
            {/* Аватар */}
            <div className="flex-shrink-0">
                {loading ? (
                    <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                ) : avatarUrl ? (
                    <img
                        src={`http://localhost:8080${avatarUrl}`}
                        alt={`${user.username}'s avatar`}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                    />
                ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                )}
            </div>

            {/* Информация о пользователе */}
            <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium text-gray-900 truncate">
                    {user.username}
                </h3>
                <p className="text-gray-500 text-sm">
                    @{user.username}
                </p>
            </div>

            {/* Стрелка */}
            <div className="flex-shrink-0 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </div>
    );
};

export default UserSearchPage;
import * as React from "react";
import {useEffect, useState} from "react";
import type {WishResponse, WishShortResponse} from "../../types/wish.ts";
import type {PaginationParams} from "../../types/pagination.ts";
import {wishApi} from "../../api/wishApi.ts";
import WishComponent from "./WishComponent.tsx";
import WishShortComponent from "./WishShortComponent.tsx";
import {useNavigate} from "react-router";

interface WishListProps {
    userId?: string;
    query?: string;
    showActions?: boolean;
    showCreateButton?: boolean;
    showFulfilled?: boolean;
    initialPage?: number;
    pageSize?: number;
    onWishClick?: (wishId: string) => void;
}

const WishList: React.FC<WishListProps> = ({
                                               userId,
                                               query,
                                               showActions = true,
                                               showCreateButton = true,
                                               showFulfilled = false,
                                               initialPage = 0,
                                               pageSize = 10,
                                               onWishClick,
                                           }) => {
    const [wishes, setWishes] = useState<WishShortResponse[]>([]);
    const [selectedWishId, setSelectedWishId] = useState<string | null>(null);
    const [selectedWish, setSelectedWish] = useState<WishResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [, setLoadingDetails] = useState(false);
    const [pagination, setPagination] = useState({
        page: initialPage,
        size: pageSize,
        hasMore: false,
        total: 0
    });
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleEdit = (wish: WishResponse) => {
        navigate("/wish/create?edit=" + wish.id)
    };

    const handleAddNew = () => {
        navigate("/wish/create")
    };

    const loadWishes = async (page: number = 0, append: boolean = false) => {
        try {
            setLoading(true);
            setError(null);

            const params: PaginationParams = {
                page,
                size: pagination.size,
                sort: 'DESC'
            };

            let response: WishShortResponse[];

            if (userId) {
                if (showFulfilled) {
                    response = await wishApi.getUserFulfilledWishes(userId, params);
                } else {
                    response = await wishApi.getUserWishes(userId, params);
                }
            } else if (query) {
                response = await wishApi.searchWishes(query, params);
            } else {
                response = await wishApi.searchWishes(undefined, params);
            }

            if (append) {
                setWishes(prev => [...prev, ...response]);
            } else {
                setWishes(response);
            }

            setPagination(prev => ({
                ...prev,
                page,
                hasMore: response.length >= pagination.size,
                total: append ? prev.total + response.length : response.length
            }));

        } catch (err) {
            console.error('Error loading wishes:', err);
            setError('Не удалось загрузить желания');
            setWishes([]);
        } finally {
            setLoading(false);
        }
    };

    const loadWishDetails = async (wishId: string) => {
        try {
            setLoadingDetails(true);
            const wish = await wishApi.getWishById(wishId);
            setSelectedWish(wish);
        } catch (err) {
            console.error('Error loading wish details:', err);
            setError('Не удалось загрузить детальную информацию');
        } finally {
            setLoadingDetails(false);
        }
    };

    useEffect(() => {
        loadWishes(initialPage, false);
    }, [userId, query, initialPage]);

    const handleLoadMore = () => {
        if (!loading && pagination.hasMore) {
            loadWishes(pagination.page + 1, true);
        }
    };

    const handleRefresh = () => {
        loadWishes(0, false);
    };

    const handleWishClick = async (wishId: string) => {
        setSelectedWishId(wishId);
        await loadWishDetails(wishId);
        onWishClick?.(wishId);
    };

    const handleBackToList = () => {
        setSelectedWishId(null);
        setSelectedWish(null);
    };

    const handleDelete = async (wishId: string) => {
        if (window.confirm('Вы уверены, что хотите удалить это желание?')) {
            try {
                await wishApi.deleteWish(wishId);
                setWishes(prev => prev.filter(wish => wish.id !== wishId));
                if (selectedWishId === wishId) {
                    handleBackToList();
                }
            } catch (err) {
                console.error('Error deleting wish:', err);
                setError('Не удалось удалить желание');
            }
        }
    };

    const handleMarkFulfilled = async (wishId: string) => {
        if (window.confirm('Отметить желание как исполненное?')) {
            try {
                await wishApi.markAsFulfilled(wishId);
                if (selectedWishId === wishId) {
                    const updatedWish = await wishApi.getWishById(wishId);
                    setSelectedWish(updatedWish);
                }
                loadWishes(pagination.page, false);
            } catch (err) {
                console.error('Error marking wish as fulfilled:', err);
                setError('Не удалось отметить желание как исполненное');
            }
        }
    };

    if (selectedWishId && selectedWish) {
        return (
            <div>
                <button
                    onClick={handleBackToList}
                    className="mb-4 flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                    ← Назад к списку
                </button>
                <WishComponent
                    wish={selectedWish}
                    onBack={handleBackToList}
                    onEdit={showActions ? handleEdit : undefined}
                    onDelete={showActions ? handleDelete : undefined}
                    onMarkFulfilled={showActions ? handleMarkFulfilled : undefined}
                    isOwn={showActions}
                />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        Желания {pagination.total > 0 && `(${pagination.total})`}
                    </h3>
                    {query && (
                        <p className="text-sm text-gray-500 mt-1">
                            Поиск: "{query}"
                        </p>
                    )}
                </div>

                <div className="flex items-center space-x-3">
                    <button
                        onClick={handleRefresh}
                        disabled={loading}
                        className="text-blue-600 hover:text-blue-800 disabled:text-gray-400 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                        title="Обновить список"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>

                    {showCreateButton && showActions && (
                        <button
                            onClick={handleAddNew}
                            className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-200 hover:shadow-lg flex items-center space-x-2 group"
                        >
                            <span className="text-lg font-bold group-hover:scale-110 transition-transform">+</span>
                            <span>Новое желание</span>
                        </button>
                    )}
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-700">{error}</p>
                    <button
                        onClick={handleRefresh}
                        className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                        Попробовать снова
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                {wishes.map(wish => (
                    <WishShortComponent
                        key={wish.id}
                        wish={wish}
                        showUser={!userId}
                        onClick={handleWishClick}
                        onEdit={showActions ? handleEdit : undefined}
                        onDelete={showActions ? handleDelete : undefined}
                        isOwn={showActions}
                    />
                ))}
            </div>

            {loading && (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            )}

            {!loading && pagination.hasMore && (
                <div className="flex justify-center pt-4">
                    <button
                        onClick={handleLoadMore}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg transition-colors font-medium"
                    >
                        {loading ? 'Загрузка...' : 'Загрузить еще'}
                    </button>
                </div>
            )}

            {!loading && wishes.length === 0 && !error && (
                <div className="bg-gray-50 rounded-xl p-8 text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🎁</span>
                    </div>
                    <p className="text-gray-500 text-lg mb-2">
                        {query
                            ? 'По вашему запросу желаний не найдено'
                            : userId
                                ? 'У пользователя пока нет желаний'
                                : 'Желаний пока нет'
                        }
                    </p>
                    {!userId && showCreateButton && (
                        <button
                            onClick={handleAddNew}
                            className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
                        >
                            <span>+</span>
                            <span>Создать первое желание</span>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default WishList;
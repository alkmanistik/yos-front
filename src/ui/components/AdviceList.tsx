import * as React from "react";
import {useEffect, useState} from "react";
import type {AdviceResponse, AdviceShortResponse} from "../../types/advice.ts";
import type {PaginationParams} from "../../types/pagination.ts";
import {adviceApi} from "../../api/adviceApi.ts";
import AdviceComponent from "./AdviceComponent.tsx";
import AdviceShortComponent from "./AdviceShortComponent.tsx";
import {useNavigate} from "react-router";

interface AdviceListProps {
    userId?: string;
    query?: string;
    showActions?: boolean;
    showCreateButton?: boolean;
    initialPage?: number;
    pageSize?: number;
    onAdviceClick?: (adviceId: string) => void;
}

const AdviceList: React.FC<AdviceListProps> = ({
                                                   userId,
                                                   query,
                                                   showActions = true,
                                                   showCreateButton = true,
                                                   initialPage = 0,
                                                   pageSize = 10,
                                                   onAdviceClick
                                               }) => {
    const [advices, setAdvices] = useState<AdviceShortResponse[]>([]);
    const [selectedAdviceId, setSelectedAdviceId] = useState<string | null>(null);
    const [selectedAdvice, setSelectedAdvice] = useState<AdviceResponse | null>(null);
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

    const handleEdit = (advice: AdviceShortResponse) => {
        navigate("/advice/create?edit=" + advice.id);
    };

    const loadAdvices = async (page: number = 0, append: boolean = false) => {
        try {
            setLoading(true);
            setError(null);

            const params: PaginationParams = {
                page,
                size: pagination.size,
                sort: 'DESC'
            };

            let response: AdviceShortResponse[];

            if (userId) {
                response = await adviceApi.getAdvice(userId, params);
            } else if (query) {
                response = await adviceApi.searchAdvices(query, params);
            } else {
                response = await adviceApi.searchAdvices(undefined, params);
            }

            if (append) {
                setAdvices(prev => [...prev, ...response]);
            } else {
                setAdvices(response);
            }

            setPagination(prev => ({
                ...prev,
                page,
                hasMore: response.length >= pagination.size,
                total: append ? prev.total + response.length : response.length
            }));

        } catch (err) {
            console.error('Error loading advices:', err);
            setError('Не удалось загрузить советы');
            setAdvices([]);
        } finally {
            setLoading(false);
        }
    };

    const loadAdviceDetails = async (adviceId: string) => {
        try {
            setLoadingDetails(true);
            const advice = await adviceApi.getAdviceById(adviceId);
            setSelectedAdvice(advice);
        } catch (err) {
            console.error('Error loading advice details:', err);
            setError('Не удалось загрузить детальную информацию');
        } finally {
            setLoadingDetails(false);
        }
    };

    const handleAddNew = () => {
        navigate("/advice/create")
    };

    useEffect(() => {
        loadAdvices(initialPage, false);
    }, [userId, query, initialPage]);

    const handleLoadMore = () => {
        if (!loading && pagination.hasMore) {
            loadAdvices(pagination.page + 1, true);
        }
    };

    const handleRefresh = () => {
        loadAdvices(0, false);
    };

    const handleAdviceClick = async (adviceId: string) => {
        setSelectedAdviceId(adviceId);
        await loadAdviceDetails(adviceId);
        onAdviceClick?.(adviceId);
    };

    const handleBackToList = () => {
        setSelectedAdviceId(null);
        setSelectedAdvice(null);
    };

    const handleDelete = async (adviceId: string) => {
        if (window.confirm('Вы уверены, что хотите удалить этот совет?')) {
            try {
                await adviceApi.deleteAdvice(adviceId);
                setAdvices(prev => prev.filter(advice => advice.id !== adviceId));
                if (selectedAdviceId === adviceId) {
                    handleBackToList();
                }
            } catch (err) {
                console.error('Error deleting advice:', err);
                setError('Не удалось удалить совет');
            }
        }
    };

    if (selectedAdviceId && selectedAdvice) {
        return (
            <div>
                <button
                    onClick={handleBackToList}
                    className="mb-4 flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                    ← Назад к списку
                </button>
                <AdviceComponent
                    advice={selectedAdvice}
                    onBack={handleBackToList}
                    onEdit={showActions ? handleEdit : undefined}
                    onDelete={showActions ? handleDelete : undefined}
                />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Хедер с кнопкой добавления */}
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        Советы {pagination.total > 0 && `(${pagination.total})`}
                    </h3>
                    {query && (
                        <p className="text-sm text-gray-500 mt-1">
                            Поиск: "{query}"
                        </p>
                    )}
                </div>

                <div className="flex items-center space-x-3">
                    {/* Кнопка обновления */}
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

                    {/* Кнопка добавления нового совета */}
                    {showCreateButton && showActions && (
                        <button
                            onClick={handleAddNew}
                            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-200 hover:shadow-lg flex items-center space-x-2 group"
                        >
                            <span className="text-lg font-bold group-hover:scale-110 transition-transform">+</span>
                            <span>Новый совет</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Сообщение об ошибке */}
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

            {/* Список советов */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                {advices.map(advice => (
                    <AdviceShortComponent
                        key={advice.id}
                        advice={advice}
                        showUser={!userId}
                        onClick={handleAdviceClick}
                        onEdit={showActions ? handleEdit : undefined}
                        onDelete={showActions ? handleDelete : undefined}
                        isOwn={showActions}
                    />
                ))}
            </div>

            {/* Индикатор загрузки */}
            {loading && (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            )}

            {/* Кнопка "Загрузить еще" */}
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

            {/* Сообщение если нет советов */}
            {!loading && advices.length === 0 && !error && (
                <div className="bg-gray-50 rounded-xl p-8 text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">💡</span>
                    </div>
                    <p className="text-gray-500 text-lg mb-2">
                        {query
                            ? 'По вашему запросу советов не найдено'
                            : userId
                                ? 'У пользователя пока нет советов'
                                : 'Советов пока нет'
                        }
                    </p>
                    {!userId && showCreateButton && (
                        <button
                            onClick={handleAddNew}
                            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
                        >
                            <span>+</span>
                            <span>Создать первый совет</span>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdviceList;
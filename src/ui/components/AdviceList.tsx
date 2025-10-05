import * as React from "react";
import {useEffect, useState} from "react";
import type {AdviceResponse, AdviceShortResponse} from "../../types/advice.ts";
import type {PaginationParams} from "../../types/pagination.ts";
import {adviceApi} from "../../api/adviceApi.ts";
import AdviceComponent from "./AdviceComponent.tsx";
import AdviceShortComponent from "./AdviceShortComponent.tsx";

interface AdviceListProps {
    userId?: string;
    query?: string;
    showActions?: boolean;
    initialPage?: number;
    pageSize?: number;
    onAdviceClick?: (adviceId: string) => void;
}

const AdviceList: React.FC<AdviceListProps> = ({
                                                   userId,
                                                   query,
                                                   showActions = true,
                                                   initialPage = 0,
                                                   pageSize = 10,
                                                   onAdviceClick
                                               }) => {
    const [advices, setAdvices] = useState<AdviceShortResponse[]>([]);
    const [selectedAdviceId, setSelectedAdviceId] = useState<string | null>(null);
    const [selectedAdvice, setSelectedAdvice] = useState<AdviceResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [pagination, setPagination] = useState({
        page: initialPage,
        size: pageSize,
        hasMore: false,
        total: 0
    });
    const [error, setError] = useState<string | null>(null);

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
                response = await adviceApi.getMyAdvices(params);
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

    const handleEdit = (advice: AdviceShortResponse) => {
        console.log('Edit advice:', advice);
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

    if (selectedAdviceId && loadingDetails) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Загрузка...</span>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Заголовок и кнопка обновления */}
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                    Советы {pagination.total > 0 && `(${pagination.total})`}
                </h3>
                <button
                    onClick={handleRefresh}
                    disabled={loading}
                    className="text-blue-600 hover:text-blue-800 disabled:text-gray-400 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                    title="Обновить"
                >
                    🔄
                </button>
            </div>

            {/* Сообщение об ошибке */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-700">{error}</p>
                    <button
                        onClick={handleRefresh}
                        className="mt-2 text-red-600 hover:text-red-800 text-sm"
                    >
                        Попробовать снова
                    </button>
                </div>
            )}

            {/* Список советов */}
            <div className="grid gap-4">
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
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <p className="text-gray-500 text-lg mb-2">
                        {query
                            ? 'По вашему запросу советов не найдено'
                            : userId
                                ? 'У пользователя пока нет советов'
                                : 'Советов пока нет'
                        }
                    </p>
                    {!userId && (
                        <p className="text-gray-400 text-sm">
                            Будьте первым, кто поделится советом!
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdviceList;
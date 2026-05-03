import type {WishResponse} from "../../types/wish.ts";
import * as React from "react";
import {Link} from "react-router";
import {useEffect, useState} from "react";
import {imageApi} from "../../api/imageApi.ts";
import type {ImageShortResponse} from "../../types/image.ts";
import {wishApi} from "../../api/wishApi.ts";
import {useAuth} from "../../contexts/AuthContext.tsx";

interface WishComponentProps {
    wish: WishResponse;
    onBack?: () => void;
    onEdit?: (wish: WishResponse) => void;
    onDelete?: (wishId: string) => void;
    onMarkFulfilled?: (wishId: string) => void;
    isOwn?: boolean;
    onReserveStatusChange?: () => void;
}

const WishComponent: React.FC<WishComponentProps> = ({
                                                         wish: initialWish,
                                                         onEdit,
                                                         onDelete,
                                                         onMarkFulfilled,
                                                         isOwn = false,
                                                         onReserveStatusChange
                                                     }) => {
    const { user } = useAuth();
    const [images, setImages] = useState<ImageShortResponse[]>([]);
    const [, setLoadingImages] = useState(true);
    const [wish, setWish] = useState<WishResponse>(initialWish);
    const [isReservedByMe, setIsReservedByMe] = useState(false);
    const [isLoadingReserve, setIsLoadingReserve] = useState(false);
    const [showReserveModal, setShowReserveModal] = useState(false);
    const [reserveMessage, setReserveMessage] = useState("");
    const [reserveInfo, setReserveInfo] = useState<{
        giverName?: string;
        giverComment?: string;
        reservedAt?: string;
    } | null>(null);

    // Функция для обновления статуса желания
    const updateWishStatus = async () => {
        try {
            // Получаем актуальный статус желания
            const status = await wishApi.getWishStatus(wish.id);

            // Обновляем статус fulfilled
            if (status.status === "FULFILLED" && !wish.fulfilled) {
                setWish(prev => ({ ...prev, fulfilled: true, fulfilledAt: new Date().toISOString() }));
            } else if (status.status !== "FULFILLED" && wish.fulfilled) {
                setWish(prev => ({ ...prev, fulfilled: false, fulfilledAt: undefined }));
            }

            // Проверяем статус бронирования
            if (user && !isOwn && status.status !== "FULFILLED") {
                try {
                    const reserveStatus = await wishApi.getReserveStatus(wish.id);
                    const isMyReserve = reserveStatus.status === "MY";
                    setIsReservedByMe(isMyReserve);

                    // Если есть информация о бронировании, получаем детали
                    if (reserveStatus.status === "MY" || reserveStatus.status === "OTHER") {
                        // Здесь нужно получить детали бронирования, если есть API
                        // const details = await wishApi.getReserveDetails(wish.id);
                        // setReserveInfo(details);
                    } else {
                        setReserveInfo(null);
                    }
                } catch (error) {
                    console.error('Error checking reserve status:', error);
                    setIsReservedByMe(false);
                    setReserveInfo(null);
                }
            } else {
                setIsReservedByMe(false);
                setReserveInfo(null);
            }
        } catch (error) {
            console.error('Error checking status:', error);
        }
    };

    useEffect(() => {
        const loadImages = async () => {
            try {
                setLoadingImages(true);
                const wishImages = await imageApi.getWishImages(wish.id);
                setImages(wishImages);
            } catch (error) {
                console.error('Error loading wish images:', error);
            } finally {
                setLoadingImages(false);
            }
        };

        loadImages();
        updateWishStatus();
    }, [wish.id, user, isOwn]);

    const handleEdit = () => {
        onEdit?.(wish);
    };

    const handleDelete = () => {
        if (confirm('Вы уверены, что хотите удалить это желание?')) {
            onDelete?.(wish.id);
        }
    };

    const handleMarkFulfilled = async () => {
        if (confirm('Отметить желание как исполненное?')) {
            onMarkFulfilled?.(wish.id);
            // Обновляем статус после отметки
            await updateWishStatus();
        }
    };

    const handleReserve = async () => {
        if (!user) {
            alert('Необходимо авторизоваться для бронирования');
            return;
        }

        setIsLoadingReserve(true);
        try {
            await wishApi.reserveWish(wish.id, { message: reserveMessage || null });

            // Обновляем статусы после успешного бронирования
            await updateWishStatus();

            setShowReserveModal(false);
            setReserveMessage("");
            onReserveStatusChange?.();
        } catch (error) {
            console.error('Error reserving wish:', error);
            alert('Не удалось забронировать желание. Возможно, оно уже зарезервировано.');
        } finally {
            setIsLoadingReserve(false);
        }
    };

    const handleCancelReserve = async () => {
        if (!user) return;

        if (!confirm('Вы уверены, что хотите отменить бронирование?')) return;

        setIsLoadingReserve(true);
        try {
            await wishApi.cancelReserve(wish.id);

            // Обновляем статусы после отмены бронирования
            await updateWishStatus();

            onReserveStatusChange?.();
        } catch (error) {
            console.error('Error cancelling reserve:', error);
            alert('Не удалось отменить бронирование.');
        } finally {
            setIsLoadingReserve(false);
        }
    };

    const formatPrice = (price?: string | null) => {
        if (!price) return null;
        if (price.includes('Руб') || price.includes('руб') || price.includes('₽') || price.includes('$') || price.includes('€')) {
            return price;
        }
        return `${price} ₽`;
    };

    const displayPrice = formatPrice(wish.price);
    const isFulfilled = wish.fulfilled;
    const canReserve = !!user && !isOwn && !isFulfilled && !isReservedByMe;

    return (
        <>
            <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-2xl mx-auto">
                {/* Изображение */}
                {images.length > 0 && (
                    <div className="mb-6">
                        <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-square max-w-md mx-auto">
                            <img
                                src={imageApi.getImageUrl(images[0].id)}
                                alt={wish.title}
                                className="w-full h-full object-cover"
                            />
                            {/* Замок для забронированных желаний */}
                            {!isOwn && isReservedByMe === false && reserveInfo && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <div className="bg-black/70 backdrop-blur-md rounded-full p-3">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-900 mb-3">{wish.title}</h2>

                        {wish.description && (
                            <p className="text-gray-700 mb-4 leading-relaxed whitespace-pre-line">
                                {wish.description}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                    {displayPrice && (
                        <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full font-medium">
                            💰 {displayPrice}
                        </span>
                    )}

                    {isFulfilled && (
                        <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium">
                            ✅ Исполнено
                        </span>
                    )}

                    {isReservedByMe && (
                        <span className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full font-medium">
                            🔑 Вы забронировали
                        </span>
                    )}

                    {!isOwn && !isReservedByMe && reserveInfo && (
                        <span className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full font-medium">
                            🔒 Забронировано
                        </span>
                    )}
                </div>

                {/* Информация о бронировании */}
                {reserveInfo && reserveInfo.giverName && (
                    <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                        <p className="text-sm text-purple-800">
                            <span className="font-medium">Забронировано пользователем:</span> {reserveInfo.giverName}
                        </p>
                        {reserveInfo.giverComment && (
                            <p className="text-sm text-purple-700 mt-1">
                                <span className="font-medium">Комментарий:</span> {reserveInfo.giverComment}
                            </p>
                        )}
                        {reserveInfo.reservedAt && (
                            <p className="text-xs text-purple-600 mt-1">
                                Дата брони: {new Date(reserveInfo.reservedAt).toLocaleDateString('ru-RU')}
                            </p>
                        )}
                    </div>
                )}

                {wish.link && (
                    <div className="mb-4">
                        <a
                            href={wish.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 break-words inline-flex items-center text-sm font-medium"
                        >
                            🔗 Перейти к ссылке
                        </a>
                    </div>
                )}

                {/* Кнопки действий */}
                <div className="flex justify-end space-x-2 mb-4 pt-4 border-t border-gray-100">
                    {/* Кнопка бронирования для чужих желаний */}
                    {canReserve && (
                        <button
                            onClick={() => setShowReserveModal(true)}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors flex items-center space-x-1"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <span>Забронировать</span>
                        </button>
                    )}

                    {/* Кнопка отмены бронирования */}
                    {isReservedByMe && (
                        <button
                            onClick={handleCancelReserve}
                            disabled={isLoadingReserve}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors flex items-center space-x-1 disabled:opacity-50"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span>{isLoadingReserve ? '...' : 'Отменить бронь'}</span>
                        </button>
                    )}

                    {/* Кнопка отметки исполнения для своих желаний */}
                    {isOwn && !isFulfilled && onMarkFulfilled && (
                        <button
                            onClick={handleMarkFulfilled}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors flex items-center space-x-1"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Исполнено</span>
                        </button>
                    )}

                    {/* Кнопка редактирования */}
                    {onEdit && (isOwn || !isReservedByMe) && (
                        <button
                            onClick={handleEdit}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors flex items-center space-x-1"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>Изменить</span>
                        </button>
                    )}

                    {/* Кнопка удаления */}
                    {onDelete && isOwn && (
                        <button
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors flex items-center space-x-1"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>Удалить</span>
                        </button>
                    )}
                </div>

                <div className="flex justify-between items-center text-sm text-gray-500 border-t border-gray-100 pt-4">
                    <Link
                        to={`/user/${wish.userId}`}
                        className="hover:text-purple-600 flex items-center font-medium"
                    >
                        👤 Профиль автора
                    </Link>

                    <div className="text-right">
                        <div>Создан: {new Date(wish.createdAt).toLocaleDateString('ru-RU')}</div>
                        {wish.fulfilledAt && (
                            <div>Исполнено: {new Date(wish.fulfilledAt).toLocaleDateString('ru-RU')}</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Модальное окно для комментария */}
            {showReserveModal && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    onClick={() => setShowReserveModal(false)}
                >
                    <div
                        className="bg-white rounded-2xl p-6 max-w-md w-full mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            Бронирование желания
                        </h3>

                        <p className="text-gray-600 mb-4">
                            Вы собираетесь забронировать желание: <br/>
                            <span className="font-medium text-gray-900">"{wish.title}"</span>
                        </p>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Сообщение (опционально)
                            </label>
                            <textarea
                                value={reserveMessage}
                                onChange={(e) => setReserveMessage(e.target.value)}
                                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                rows={4}
                                placeholder="Напишите сообщение для автора желания..."
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleReserve}
                                disabled={isLoadingReserve}
                                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-xl transition-colors disabled:opacity-50"
                            >
                                {isLoadingReserve ? 'Бронирование...' : 'Подтвердить'}
                            </button>
                            <button
                                onClick={() => {
                                    setShowReserveModal(false);
                                    setReserveMessage("");
                                }}
                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 rounded-xl transition-colors"
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default WishComponent;
import type {WishResponse, WishShortResponse} from "../../types/wish.ts";
import * as React from "react";
import {useEffect, useState} from "react";
import {imageApi} from "../../api/imageApi.ts";
import type {ImageShortResponse} from "../../types/image.ts";
import {wishApi} from "../../api/wishApi.ts";
import {useAuth} from "../../contexts/AuthContext.tsx";

interface WishShortComponentProps {
    wish: WishShortResponse;
    onClick?: (wishId: string) => void;
    onEdit?: (wish: WishResponse) => void;
    onDelete?: (wishId: string) => void;
    onReserveStatusChange?: () => void;
}

const WishShortComponent: React.FC<WishShortComponentProps> = ({
                                                                   wish,
                                                                   onClick,
                                                                   onEdit,
                                                                   onDelete,
                                                                   onReserveStatusChange
                                                               }) => {
    const { user } = useAuth();
    const [images, setImages] = useState<ImageShortResponse[]>([]);
    const [, setLoadingImages] = useState(true);
    const [isReservedByMe, setIsReservedByMe] = useState(false);
    const [isLoadingReserve, setIsLoadingReserve] = useState(false);
    const [showReserveModal, setShowReserveModal] = useState(false);
    const [reserveMessage, setReserveMessage] = useState("");
    const [wishStatus, setWishStatus] = useState<string>("");

    // Определяем, является ли желание своим
    const isOwn = user?.id === wish.userId;

    // Функция для обновления статуса желания
    const updateWishStatus = async () => {
        try {
            const status = await wishApi.getWishStatus(wish.id);
            setWishStatus(status.status);

            // Обновляем статус бронирования пользователя
            if (user && !isOwn && status.status !== "FULFILLED") {
                try {
                    const reserveStatus = await wishApi.getReserveStatus(wish.id);
                    setIsReservedByMe(reserveStatus.status === "MY");
                } catch (error) {
                    console.error('Error checking reserve status:', error);
                    setIsReservedByMe(false);
                }
            } else {
                setIsReservedByMe(false);
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

    const handleClick = () => {
        onClick?.(wish.id);
    };

    const handleEdit = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const loadWish = await wishApi.getWishById(wish.id);
        onEdit?.(loadWish);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Вы уверены, что хотите удалить это желание?')) {
            onDelete?.(wish.id);
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
    const isFulfilled = wishStatus === "FULFILLED";
    const isReserved = wishStatus === "RESERVED";
    // Можно бронировать только если: пользователь авторизован, желание не своё, не исполнено, и не забронировано тобой
    const canReserve = !!user && !isOwn && !isFulfilled && !isReservedByMe && !isReserved;

    // Флаг для отображения затемнения на изображении (бронь чужого желания)
    const showReservedOverlay = isReserved && !isOwn;

    return (
        <>
            <div
                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200 cursor-pointer group h-full flex flex-col relative"
                onClick={handleClick}
            >
                {/* Затемнение и замок ТОЛЬКО на изображении */}
                {images.length > 0 && (
                    <div className="mb-3 relative bg-gray-100 rounded-lg overflow-hidden aspect-square">
                        <img
                            src={imageApi.getImageUrl(images[0].id)}
                            alt={wish.title}
                            className={`w-full h-full object-cover transition-all duration-200 ${
                                showReservedOverlay ? 'brightness-50' : ''
                            }`}
                        />

                        {/* Замок поверх затемненного изображения */}
                        {showReservedOverlay && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-black/70 backdrop-blur-md rounded-full p-3">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                            </div>
                        )}

                        {images.length > 1 && (
                            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                                +{images.length - 1}
                            </div>
                        )}
                    </div>
                )}

                <div className="flex-1 flex flex-col min-h-0">
                    <div className="flex-1 min-h-0">
                        <h3 className="font-semibold text-gray-900 text-base mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors leading-tight break-words">
                            {wish.title}
                        </h3>

                        <div className="flex flex-wrap items-center gap-1.5 mb-2">
                            {displayPrice && (
                                <span className="inline-flex items-center bg-green-50 text-green-700 text-xs px-2 py-1 rounded font-medium">
                                    <span className="mr-1">💰</span>
                                    {displayPrice}
                                </span>
                            )}

                            {isFulfilled && (
                                <span className="inline-flex items-center bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded font-medium">
                                    <span className="mr-1">✅</span>
                                    Исполнено
                                </span>
                            )}

                            {/* Тег "Забронировано" для статуса RESERVED */}
                            {isReserved && !isOwn && !isReservedByMe && (
                                <span className="inline-flex items-center bg-yellow-50 text-yellow-700 text-xs px-2 py-1 rounded font-medium">
                                    <span className="mr-1">🔒</span>
                                    Забронировано
                                </span>
                            )}

                            {/* Тег "Вы забронировали" для своих броней */}
                            {isReservedByMe && (
                                <span className="inline-flex items-center bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded font-medium">
                                    <span className="mr-1">🔑</span>
                                    Вы забронировали
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Кнопки по центру */}
                    <div className="flex justify-center pt-2 border-gray-100 mt-auto">
                        {/* Кнопка бронирования */}
                        {canReserve && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowReserveModal(true);
                                }}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors"
                            >
                                Забронировать
                            </button>
                        )}

                        {/* Кнопка отмены бронирования (только если пользователь забронировал сам) */}
                        {isReservedByMe && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleCancelReserve();
                                }}
                                disabled={isLoadingReserve}
                                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors disabled:opacity-50"
                            >
                                {isLoadingReserve ? '...' : 'Отменить бронь'}
                            </button>
                        )}

                        {/* Кнопки редактирования/удаления для своих желаний */}
                        {(onEdit || onDelete) && isOwn && (
                            <div className="flex gap-2">
                                {onEdit && (
                                    <button
                                        onClick={handleEdit}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors"
                                    >
                                        Редактировать
                                    </button>
                                )}
                                {onDelete && (
                                    <button
                                        onClick={handleDelete}
                                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors"
                                    >
                                        Удалить
                                    </button>
                                )}
                            </div>
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

export default WishShortComponent;
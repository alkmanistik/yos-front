import type {WishResponse, WishShortResponse} from "../../types/wish.ts";
import * as React from "react";
import {useEffect, useState} from "react";
import {imageApi} from "../../api/imageApi.ts";
import type {ImageShortResponse} from "../../types/image.ts";
import {wishApi} from "../../api/wishApi.ts";
import {useAuth} from "../../contexts/AuthContext.tsx";
import {useToast} from "../../hooks/useToast.tsx";
import {useConfirmDialog} from "../../hooks/useConfirmDialog.tsx";

interface WishShortComponentProps {
    wish: WishShortResponse;
    showUser?: boolean;
    onClick?: (wishId: string) => void;
    onEdit?: (wish: WishResponse) => void;
    onDelete?: (wishId: string) => void;
    onReserveStatusChange?: () => void;
    isOwn?: boolean;
}

const WishShortComponent: React.FC<WishShortComponentProps> = ({
                                                                   wish,
                                                                   onClick,
                                                                   onEdit,
                                                                   onDelete,
                                                                   onReserveStatusChange,
                                                                   isOwn: propIsOwn
                                                               }) => {
    const { user } = useAuth();
    const { showToast, ToastContainer } = useToast();
    const { confirm, ConfirmDialogContainer } = useConfirmDialog();
    const [images, setImages] = useState<ImageShortResponse[]>([]);
    const [, setLoadingImages] = useState(true);
    const [isReservedByMe, setIsReservedByMe] = useState(false);
    const [isLoadingReserve, setIsLoadingReserve] = useState(false);
    const [showReserveModal, setShowReserveModal] = useState(false);
    const [reserveMessage, setReserveMessage] = useState("");
    const [wishStatus, setWishStatus] = useState<string>("");

    const isOwn = propIsOwn || user?.id === wish.userId;

    const updateWishStatus = async () => {
        try {
            const status = await wishApi.getWishStatus(wish.id);
            setWishStatus(status.status);

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

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const confirmed = await confirm({
            title: 'Удаление желания',
            message: 'Вы уверены, что хотите удалить это желание? Это действие нельзя отменить.',
            confirmText: 'Удалить',
            cancelText: 'Отмена',
            type: 'danger'
        });

        if (confirmed) {
            onDelete?.(wish.id);
            showToast('Желание успешно удалено! 🗑️', 'success');
        }
    };

    const handleReserve = async () => {
        if (!user) {
            showToast('Необходимо авторизоваться для бронирования', 'warning');
            return;
        }

        setIsLoadingReserve(true);
        try {
            await wishApi.reserveWish(wish.id, { message: reserveMessage || null });
            await updateWishStatus();
            setShowReserveModal(false);
            setReserveMessage("");
            onReserveStatusChange?.();
            showToast('Желание успешно забронировано! 🎉', 'success');
        } catch (error) {
            console.error('Error reserving wish:', error);
            showToast('Не удалось забронировать желание. Возможно, оно уже зарезервировано.', 'error');
        } finally {
            setIsLoadingReserve(false);
        }
    };

    const handleCancelReserve = async () => {
        const confirmed = await confirm({
            title: 'Отмена бронирования',
            message: 'Вы уверены, что хотите отменить бронирование?',
            confirmText: 'Отменить',
            cancelText: 'Назад',
            type: 'warning'
        });

        if (!confirmed) return;

        setIsLoadingReserve(true);
        try {
            await wishApi.cancelReserve(wish.id);
            await updateWishStatus();
            onReserveStatusChange?.();
            showToast('Бронирование отменено', 'info');
        } catch (error) {
            console.error('Error cancelling reserve:', error);
            showToast('Не удалось отменить бронирование', 'error');
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
    const canReserve = !!user && !isOwn && !isFulfilled && !isReservedByMe && !isReserved;
    const showReservedOverlay = isReserved && !isOwn;

    return (
        <>
            <ToastContainer />
            <ConfirmDialogContainer />
            <div
                className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 hover:shadow-lg transition-all duration-200 cursor-pointer group h-full flex flex-col"
                onClick={handleClick}
            >
                {/* Изображение */}
                {images.length > 0 && (
                    <div className="mb-3 relative bg-gray-100 rounded-lg overflow-hidden aspect-square">
                        <img
                            src={imageApi.getImageUrl(images[0].id)}
                            alt={wish.title}
                            className={`w-full h-full object-cover transition-all duration-200 ${
                                showReservedOverlay ? 'brightness-50' : ''
                            }`}
                        />

                        {showReservedOverlay && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-black/70 backdrop-blur-md rounded-full p-2 sm:p-3">
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                            </div>
                        )}

                        {images.length > 1 && (
                            <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-black/50 text-white text-xs px-1 py-0.5 sm:px-1.5 sm:py-0.5 rounded">
                                +{images.length - 1}
                            </div>
                        )}
                    </div>
                )}

                {/* Контент */}
                <div className="flex-1 flex flex-col min-h-0">
                    <div className="flex-1 min-h-0">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors leading-tight break-words">
                            {wish.title}
                        </h3>

                        <div className="flex flex-wrap items-center gap-1.5 mb-2">
                            {displayPrice && (
                                <span className="inline-flex items-center bg-green-50 text-green-700 text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded font-medium">
                                    <span className="mr-0.5 sm:mr-1">💰</span>
                                    {displayPrice}
                                </span>
                            )}

                            {isFulfilled && (
                                <span className="inline-flex items-center bg-blue-50 text-blue-700 text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded font-medium">
                                    <span className="mr-0.5 sm:mr-1">✅</span>
                                    Исполнено
                                </span>
                            )}

                            {isReserved && !isOwn && !isReservedByMe && (
                                <span className="inline-flex items-center bg-yellow-50 text-yellow-700 text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded font-medium">
                                    <span className="mr-0.5 sm:mr-1">🔒</span>
                                    Забронировано
                                </span>
                            )}

                            {isReservedByMe && (
                                <span className="inline-flex items-center bg-purple-50 text-purple-700 text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded font-medium">
                                    <span className="mr-0.5 sm:mr-1">🔑</span>
                                    Вы забронировали
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Кнопки */}
                    <div className="flex flex-col sm:flex-row justify-center gap-2 pt-3 border-t border-gray-100 mt-2">
                        {canReserve && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowReserveModal(true);
                                }}
                                className="group relative bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 transform hover:scale-105 w-full sm:w-auto flex items-center justify-center gap-1.5 shadow-md"
                            >
                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <span>Забронировать</span>
                            </button>
                        )}

                        {isReservedByMe && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleCancelReserve();
                                }}
                                disabled={isLoadingReserve}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors disabled:opacity-50 w-full sm:w-auto flex items-center justify-center gap-1.5"
                            >
                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <span>{isLoadingReserve ? '...' : 'Отменить'}</span>
                            </button>
                        )}

                        {(onEdit || onDelete) && isOwn && (
                            <div className="flex gap-2 w-full sm:w-auto">
                                {onEdit && (
                                    <button
                                        onClick={handleEdit}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors flex-1 sm:flex-none flex items-center justify-center gap-1"
                                    >
                                        ✏️
                                        <span className="hidden sm:inline">Изменить</span>
                                    </button>
                                )}
                                {onDelete && (
                                    <button
                                        onClick={handleDelete}
                                        className="bg-red-500 hover:bg-red-600 text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors flex-1 sm:flex-none flex items-center justify-center gap-1"
                                    >
                                        🗑️
                                        <span className="hidden sm:inline">Удалить</span>
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
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={() => setShowReserveModal(false)}
                >
                    <div
                        className="bg-white rounded-2xl p-5 sm:p-6 max-w-md w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                            Бронирование желания
                        </h3>

                        <p className="text-sm sm:text-base text-gray-600 mb-4">
                            Вы собираетесь забронировать желание:<br/>
                            <span className="font-medium text-gray-900">"{wish.title}"</span>
                        </p>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Сообщение (опционально)
                            </label>
                            <textarea
                                value={reserveMessage}
                                onChange={(e) => setReserveMessage(e.target.value)}
                                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                rows={4}
                                placeholder="Напишите сообщение для автора желания..."
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={handleReserve}
                                disabled={isLoadingReserve}
                                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium py-2.5 sm:py-2 rounded-xl transition-colors disabled:opacity-50"
                            >
                                {isLoadingReserve ? 'Бронирование...' : 'Подтвердить'}
                            </button>
                            <button
                                onClick={() => {
                                    setShowReserveModal(false);
                                    setReserveMessage("");
                                }}
                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2.5 sm:py-2 rounded-xl transition-colors"
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
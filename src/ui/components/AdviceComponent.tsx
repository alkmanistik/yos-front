import type {AdviceResponse, AdviceToWishRequest} from "../../types/advice.ts";
import * as React from "react";
import {Link} from "react-router";
import {useEffect, useState} from "react";
import {imageApi} from "../../api/imageApi.ts";
import type {ImageShortResponse} from "../../types/image.ts";
import {adviceApi} from "../../api/adviceApi.ts";

interface AdviceComponentProps {
    advice: AdviceResponse;
    onBack?: () => void;
    onEdit?: (advice: AdviceResponse) => void;
    onDelete?: (adviceId: string) => void;
    onWishCreated?: () => void; // Колбэк после успешного создания желания
}

const AdviceComponent: React.FC<AdviceComponentProps> = ({
                                                             advice,
                                                             onEdit,
                                                             onDelete,
                                                             onWishCreated
                                                         }) => {
    const [images, setImages] = useState<ImageShortResponse[]>([]);
    const [, setLoadingImages] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isCreatingWish, setIsCreatingWish] = useState(false);
    const [wishError, setWishError] = useState<string | null>(null);
    const [showHiddenOption, setShowHiddenOption] = useState(false);
    const [isHidden, setIsHidden] = useState(false);

    useEffect(() => {
        const loadImages = async () => {
            try {
                setLoadingImages(true);
                const adviceImages = await imageApi.getAdviceImages(advice.id);
                setImages(adviceImages);
            } catch (error) {
                console.error('Error loading advice images:', error);
            } finally {
                setLoadingImages(false);
            }
        };

        loadImages();
    }, [advice.id]);

    const handleEdit = () => {
        onEdit?.(advice);
    };

    const handleDelete = () => {
        onDelete?.(advice.id);
    };

    const handleCreateWish = async () => {
        setIsCreatingWish(true);
        setWishError(null);

        try {
            const wishRequest: AdviceToWishRequest = {
                hidden: isHidden || null // Если hidden true, отправляем true, иначе null
            };

            await adviceApi.adviceToWish(advice.id, wishRequest);

            onWishCreated?.();

            setShowHiddenOption(false);
            setIsHidden(false);

            alert('Желание успешно создано из совета!');
        } catch (error) {
            console.error('Error creating wish from advice:', error);
            setWishError('Не удалось создать желание. Попробуйте позже.');
        } finally {
            setIsCreatingWish(false);
        }
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const formatPrice = (price?: string | null) => {
        if (!price) return null;
        // Если цена уже с символом валюты, возвращаем как есть
        if (price.includes('Руб') || price.includes('руб') || price.includes('₽') || price.includes('$') || price.includes('€')) {
            return price;
        }
        return `${price} ₽`;
    };

    const displayPrice = formatPrice(advice.price);

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-2xl mx-auto">
            {/* Карусель изображений */}
            {images.length > 0 && (
                <div className="mb-6 relative">
                    <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                        <img
                            src={imageApi.getImageUrl(images[currentImageIndex].id)}
                            alt={`Advice image ${currentImageIndex + 1}`}
                            className="w-full h-full object-cover"
                        />

                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </>
                        )}
                    </div>

                    {images.length > 1 && (
                        <div className="flex justify-center mt-3 space-x-2">
                            {images.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`w-2 h-2 rounded-full transition-colors ${
                                        index === currentImageIndex ? 'bg-blue-600' : 'bg-gray-300'
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 mb-3">{advice.title}</h2>

                    {advice.description && (
                        <p className="text-gray-700 mb-4 leading-relaxed whitespace-pre-line">
                            {advice.description}
                        </p>
                    )}
                </div>

                {(onEdit || onDelete) && (
                    <div className="flex space-x-2 ml-4">
                        {onEdit && (
                            <button
                                onClick={handleEdit}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors"
                            >
                                Изменить
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={handleDelete}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors"
                            >
                                Удалить
                            </button>
                        )}
                    </div>
                )}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                {advice.category && (
                    <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded font-medium">
                        📁 {advice.category}
                    </span>
                )}

                {displayPrice && (
                    <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded font-medium">
                        💰 {displayPrice}
                    </span>
                )}

                {advice.adAdvice && (
                    <span className="bg-orange-100 text-orange-800 text-sm px-2 py-1 rounded font-medium">
                        💼 Рекламный
                    </span>
                )}
            </div>

            {advice.link && (
                <div className="mb-4">
                    <a
                        href={advice.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 break-words inline-flex items-center text-sm font-medium"
                    >
                        🔗 Перейти к источнику
                    </a>
                </div>
            )}

            {/* Кнопка создания желания с опциями */}
            <div className="mb-4 space-y-3">
                {!showHiddenOption ? (
                    <button
                        onClick={() => setShowHiddenOption(true)}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                        <span>✨</span>
                        <span>Создать желание из совета</span>
                    </button>
                ) : (
                    <div className="space-y-3">
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <input
                                type="checkbox"
                                id="hiddenWish"
                                checked={isHidden}
                                onChange={(e) => setIsHidden(e.target.checked)}
                                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                            />
                            <label htmlFor="hiddenWish" className="text-sm text-gray-700">
                                Создать скрытое желание (будет видно только вам)
                            </label>
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={handleCreateWish}
                                disabled={isCreatingWish}
                                className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                            >
                                {isCreatingWish ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Создание...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>✅</span>
                                        <span>Подтвердить</span>
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => {
                                    setShowHiddenOption(false);
                                    setIsHidden(false);
                                }}
                                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                )}

                {wishError && (
                    <p className="text-red-600 text-sm mt-2">{wishError}</p>
                )}
            </div>

            <div className="flex justify-between items-center text-sm text-gray-500 border-t border-gray-100 pt-4">
                <Link
                    to={`/user/${advice.userId}`}
                    className="hover:text-blue-600 flex items-center font-medium"
                >
                    👤 Профиль автора
                </Link>

                <div className="text-right">
                    <div>Создан: {new Date(advice.createdAt).toLocaleDateString('ru-RU')}</div>
                    {advice.updatedAt !== advice.createdAt && (
                        <div>Обновлен: {new Date(advice.updatedAt).toLocaleDateString('ru-RU')}</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdviceComponent;
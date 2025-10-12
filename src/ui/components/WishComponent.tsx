import type {WishResponse} from "../../types/wish.ts";
import * as React from "react";
import {Link} from "react-router";
import {useEffect, useState} from "react";
import {imageApi} from "../../api/imageApi.ts";
import type {ImageShortResponse} from "../../types/image.ts";

interface WishComponentProps {
    wish: WishResponse;
    onBack?: () => void;
    onEdit?: (wish: WishResponse) => void;
    onDelete?: (wishId: string) => void;
    onMarkFulfilled?: (wishId: string) => void;
    isOwn?: boolean;
}

const WishComponent: React.FC<WishComponentProps> = ({
                                                         wish,
                                                         onEdit,
                                                         onDelete,
                                                         onMarkFulfilled,
                                                         isOwn = false
                                                     }) => {
    const [images, setImages] = useState<ImageShortResponse[]>([]);
    const [, setLoadingImages] = useState(true);

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
    }, [wish.id]);

    const handleEdit = () => {
        onEdit?.(wish);
    };

    const handleDelete = () => {
        onDelete?.(wish.id);
    };

    const handleMarkFulfilled = () => {
        onMarkFulfilled?.(wish.id);
    };

    return (
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
                {wish.price && (
                    <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full font-medium">
                        💰 {wish.price}
                    </span>
                )}

                {wish.fulfilled && (
                    <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium">
                        ✅ Исполнено
                    </span>
                )}

                {wish.giverUser && (
                    <span className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full font-medium">
                        🎁 Исполнитель
                    </span>
                )}
            </div>

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

            {/* Кнопки действий внизу */}
            {(onEdit || onDelete || onMarkFulfilled) && (
                <div className="flex justify-end space-x-2 mb-4 pt-4 border-t border-gray-100">
                    {isOwn && !wish.fulfilled && onMarkFulfilled && (
                        <button
                            onClick={handleMarkFulfilled}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors flex items-center space-x-1"
                            title="Отметить исполненным"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Исполнено</span>
                        </button>
                    )}
                    {onEdit && (
                        <button
                            onClick={handleEdit}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors flex items-center space-x-1"
                            title="Редактировать"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>Изменить</span>
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors flex items-center space-x-1"
                            title="Удалить"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>Удалить</span>
                        </button>
                    )}
                </div>
            )}

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
    );
};

export default WishComponent;
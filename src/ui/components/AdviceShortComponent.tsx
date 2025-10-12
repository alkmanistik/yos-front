import type {AdviceShortResponse} from "../../types/advice.ts";
import * as React from "react";
import {useEffect, useState} from "react";
import {imageApi} from "../../api/imageApi.ts";
import type {ImageShortResponse} from "../../types/image.ts";

interface AdviceShortComponentProps {
    advice: AdviceShortResponse;
    showUser?: boolean;
    onClick?: (adviceId: string) => void;
    onEdit?: (advice: AdviceShortResponse) => void;
    onDelete?: (adviceId: string) => void;
    isOwn?: boolean;
}

const AdviceShortComponent: React.FC<AdviceShortComponentProps> = ({
                                                                       advice,
                                                                       showUser = false,
                                                                       onClick,
                                                                       onEdit,
                                                                       onDelete,
                                                                       isOwn = false
                                                                   }) => {
    const [images, setImages] = useState<ImageShortResponse[]>([]);
    const [, setLoadingImages] = useState(true);

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

    const handleClick = () => {
        onClick?.(advice.id);
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit?.(advice);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete?.(advice.id);
    };

    return (
        <div
            className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200 cursor-pointer group h-full flex flex-col"
            onClick={handleClick}
        >
            {/* Изображение с фиксированной высотой и центрированием */}
            {images.length > 0 && (
                <div className="mb-3 relative  rounded-lg overflow-hidden h-64 flex items-center justify-center">
                    <img
                        src={imageApi.getImageUrl(images[0].id)}
                        alt={advice.title}
                        className="max-w-full max-h-full object-contain"
                    />
                    {images.length > 1 && (
                        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                            +{images.length - 1}
                        </div>
                    )}
                </div>
            )}

            {/* Основной контент */}
            <div className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 min-h-0">
                    {/* Заголовок */}
                    <h3 className="font-semibold text-gray-900 text-base mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight break-words">
                        {advice.title}
                    </h3>

                    {/* Мета-информация */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-2">
                        {advice.category && (
                            <span className="inline-flex items-center bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded font-medium flex-shrink-0">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1"></span>
                                {advice.category}
                            </span>
                        )}

                        {advice.adAdvice && (
                            <span className="inline-flex items-center bg-orange-50 text-orange-700 text-xs px-2 py-1 rounded font-medium flex-shrink-0">
                                <span className="mr-1">💼</span>
                                Рекламный
                            </span>
                        )}
                    </div>
                </div>

                {/* Футер */}
                <div className="flex justify-between items-center pt-2  border-gray-100 mt-auto">
                    <div className="flex items-center space-x-1 text-xs text-gray-500 flex-shrink-0">
                        {showUser && (
                            <span className="truncate max-w-[80px]">ID: {advice.userId.slice(0, 6)}...</span>
                        )}
                    </div>

                    <div className="flex items-center space-x-1 flex-shrink-0">
                        {(onEdit || onDelete) && (
                            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                {onEdit && (
                                    <button
                                        onClick={handleEdit}
                                        className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors flex-shrink-0"
                                        title="Редактировать"
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                )}
                                {onDelete && (
                                    <button
                                        onClick={handleDelete}
                                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                                        title="Удалить"
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        )}
                        {isOwn && (
                            <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded whitespace-nowrap">
                                Ваш
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdviceShortComponent;
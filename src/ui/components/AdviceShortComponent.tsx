import type {AdviceShortResponse} from "../../types/advice.ts";
import * as React from "react";

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
            className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-200 cursor-pointer group"
            onClick={handleClick}
        >
            <div className="flex justify-between items-start gap-4">
                {/* Основной контент */}
                <div className="flex-1 min-w-0">
                    {/* Заголовок */}
                    <h3 className="font-semibold text-gray-900 text-lg mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {advice.title}
                    </h3>

                    {/* Мета-информация */}
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Категория */}
                        {advice.category && (
                            <span className="inline-flex items-center bg-blue-50 text-blue-700 text-xs px-3 py-1.5 rounded-full font-medium">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5"></span>
                                {advice.category}
              </span>
                        )}

                        {/* Рекламный маркер */}
                        {advice.adAdvice && (
                            <span className="inline-flex items-center bg-orange-50 text-orange-700 text-xs px-3 py-1.5 rounded-full font-medium">
                <span className="mr-1.5">💼</span>
                Рекламный
              </span>
                        )}

                        {/* ID пользователя (если нужно показать) */}
                        {showUser && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                ID: {advice.userId}
              </span>
                        )}
                    </div>
                </div>

                {/* Кнопки действий (только для владельца) */}
                {isOwn && (onEdit || onDelete) && (
                    <div
                        className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {onEdit && (
                            <button
                                onClick={handleEdit}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Редактировать"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={handleDelete}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Удалить"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Дополнительная информация в футере */}
            <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>ID: {advice.id.slice(0, 8)}...</span>
                </div>

                {/* Индикатор владения */}
                {isOwn && (
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
            Ваш совет
          </span>
                )}
            </div>
        </div>
    );
};

export default AdviceShortComponent;
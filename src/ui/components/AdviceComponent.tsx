import type {AdviceResponse} from "../../types/advice.ts";
import * as React from "react";
import {Link} from "react-router";

interface AdviceComponentProps {
    advice: AdviceResponse;
    onBack?: () => void;
    onEdit?: (advice: AdviceResponse) => void;
    onDelete?: (adviceId: string) => void;
}

const AdviceComponent: React.FC<AdviceComponentProps> = ({
                                                             advice,
                                                             onBack,
                                                             onEdit,
                                                             onDelete
                                                         }) => {
    const handleEdit = () => {
        onEdit?.(advice);
    };

    const handleDelete = () => {
        onDelete?.(advice.id);
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
            {/* Кнопка назад */}
            {onBack && (
                <button
                    onClick={onBack}
                    className="mb-4 flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                    ← Назад к списку
                </button>
            )}

            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">{advice.title}</h2>

                    {advice.description && (
                        <p className="text-gray-700 mb-4 leading-relaxed whitespace-pre-line">
                            {advice.description}
                        </p>
                    )}
                </div>

                {/* Кнопки действий */}
                {(onEdit || onDelete) && (
                    <div className="flex space-x-2 ml-4">
                        {onEdit && (
                            <button
                                onClick={handleEdit}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                            >
                                Редактировать
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={handleDelete}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                            >
                                Удалить
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Мета-информация */}
            <div className="flex flex-wrap gap-2 mb-4">
                {advice.category && (
                    <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium">
            📁 {advice.category}
          </span>
                )}

                {advice.adAdvice && (
                    <span className="bg-orange-100 text-orange-800 text-sm px-3 py-1 rounded-full font-medium">
            💼 Рекламный совет
          </span>
                )}
            </div>

            {/* Ссылка */}
            {advice.link && (
                <div className="mb-4">
                    <a
                        href={advice.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 break-words inline-flex items-center font-medium"
                    >
                        🔗 Перейти к источнику
                    </a>
                </div>
            )}

            {/* Футер с датами и автором */}
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
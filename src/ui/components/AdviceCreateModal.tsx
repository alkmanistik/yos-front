import type {AdviceCreateRequest, AdviceResponse} from "../../types/advice.ts";
import {useState} from "react";
import {adviceApi} from "../../api/adviceApi.ts";

interface AdviceCreateModalProps {
    onSuccess: (advice: AdviceResponse) => void;
    onCancel: () => void;
}

const AdviceCreateModal: React.FC<AdviceCreateModalProps> = ({
                                                                 onSuccess,
                                                                 onCancel
                                                             }) => {
    const [formData, setFormData] = useState<AdviceCreateRequest>({
        title: '',
        description: '',
        link: '',
        category: '',
        public: true
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            setError('Заголовок обязателен');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const newAdvice = await adviceApi.createAdvice({
                ...formData,
                title: formData.title.trim(),
                description: formData.description?.trim() || '',
                link: formData.link?.trim() || '',
                category: formData.category?.trim() || ''
            });
            onSuccess(newAdvice);
        } catch (err) {
            console.error('Error creating advice:', err);
            setError('Не удалось создать совет. Попробуйте еще раз.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: keyof AdviceCreateRequest, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (error) setError(null);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Создать новый совет</h2>
                    <button
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-600 text-2xl"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Заголовок *
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            placeholder="Введите заголовок совета"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Описание
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            placeholder="Опишите ваш совет подробнее..."
                            rows={4}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ссылка
                        </label>
                        <input
                            type="url"
                            value={formData.link || ''}
                            onChange={(e) => handleChange('link', e.target.value)}
                            placeholder="https://example.com"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Категория
                        </label>
                        <input
                            type="text"
                            value={formData.category || ''}
                            onChange={(e) => handleChange('category', e.target.value)}
                            placeholder="Например: Кулинария, Техника, Здоровье..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="public"
                            checked={formData.public}
                            onChange={(e) => handleChange('public', e.target.checked)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="public" className="ml-2 text-sm text-gray-700">
                            Сделать совет публичным
                        </label>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={loading}
                            className="px-6 py-2.5 text-gray-600 hover:text-gray-800 font-medium disabled:opacity-50"
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !formData.title.trim()}
                            className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Создание...</span>
                                </>
                            ) : (
                                <span>Создать совет</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdviceCreateModal;
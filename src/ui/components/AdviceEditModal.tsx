import type {AdviceUpdateRequest, AdviceResponse} from "../../types/advice.ts";
import {useState, useEffect} from "react";
import {adviceApi} from "../../api/adviceApi.ts";
import {imageApi} from "../../api/imageApi.ts";

interface AdviceEditModalProps {
    advice: AdviceResponse;
    onSuccess: (advice: AdviceResponse) => void;
    onCancel: () => void;
}

const AdviceEditModal: React.FC<AdviceEditModalProps> = ({
                                                             advice,
                                                             onSuccess,
                                                             onCancel
                                                         }) => {
    const [formData, setFormData] = useState<AdviceUpdateRequest>({
        title: advice.title,
        description: advice.description || '',
        link: advice.link || '',
        category: advice.category || '',
        public: true
    });
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [, setExistingImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadExistingImages = async () => {
            try {
                const images = await imageApi.getAdviceImages(advice.id);
                setExistingImages(images.map(img => img.id));
            } catch (error) {
                console.error('Error loading existing images:', error);
            }
        };

        loadExistingImages();
    }, [advice.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title?.trim()) {
            setError('Заголовок обязателен');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const updatedAdvice = await adviceApi.updateAdvice(
                advice.id,
                {
                    ...formData,
                    title: formData.title?.trim(),
                    description: formData.description?.trim() || '',
                    link: formData.link?.trim() || '',
                    category: formData.category?.trim() || ''
                }
            );

            for (const imageFile of imageFiles) {
                await imageApi.uploadAdviceImage(advice.id, imageFile);
            }

            onSuccess(updatedAdvice);
        } catch (err) {
            console.error('Error updating advice:', err);
            setError('Не удалось обновить совет. Попробуйте еще раз.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: keyof AdviceUpdateRequest, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (error) setError(null);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            const newFiles = [...imageFiles, ...files];
            setImageFiles(newFiles);

            files.forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setImagePreviews(prev => [...prev, e.target?.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeImage = (index: number) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Редактировать совет</h2>
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
                            Добавить изображения
                        </label>
                        {imagePreviews.length > 0 && (
                            <div className="grid grid-cols-3 gap-2 mb-3">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={preview}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-20 object-cover rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 w-5 h-5 flex items-center justify-center"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                            <div className="flex flex-col items-center justify-center">
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-xs text-gray-500 mt-1">Добавить изображения</p>
                            </div>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                            />
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Заголовок *
                        </label>
                        <input
                            type="text"
                            value={formData.title || ''}
                            onChange={(e) => handleChange('title', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Описание
                        </label>
                        <textarea
                            value={formData.description || ''}
                            onChange={(e) => handleChange('description', e.target.value)}
                            rows={3}
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
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
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
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium disabled:opacity-50 text-sm"
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !formData.title?.trim()}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed flex items-center space-x-2 text-sm"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Сохранение...</span>
                                </>
                            ) : (
                                <span>Сохранить</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdviceEditModal;
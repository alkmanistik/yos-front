import type {WishCreateRequest, WishResponse} from "../../types/wish.ts";
import {useState} from "react";
import {wishApi} from "../../api/wishApi.ts";
import {imageApi} from "../../api/imageApi.ts";

interface WishCreateModalProps {
    onSuccess: (wish: WishResponse) => void;
    onCancel: () => void;
}

const WishCreateModal: React.FC<WishCreateModalProps> = ({
                                                             onSuccess,
                                                             onCancel
                                                         }) => {
    const [formData, setFormData] = useState<WishCreateRequest>({
        title: '',
        description: '',
        price: '',
        link: '',
        hidden: false
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
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
            const newWish = await wishApi.createWish({
                ...formData,
                title: formData.title.trim(),
                description: formData.description?.trim() || '',
                price: formData.price?.trim() || '',
                link: formData.link?.trim() || ''
            });

            if (imageFile) {
                await imageApi.uploadWishImage(newWish.id, imageFile);
            }

            onSuccess(newWish);
        } catch (err) {
            console.error('Error creating wish:', err);
            setError('Не удалось создать желание. Попробуйте еще раз.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: keyof WishCreateRequest, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (error) setError(null);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Создать новое желание</h2>
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
                            Изображение
                        </label>
                        {imagePreview ? (
                            <div className="relative">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full aspect-square object-cover rounded-lg"
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-sm text-gray-500 mt-2">Нажмите для загрузки изображения</p>
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </label>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Заголовок *
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            placeholder="Введите заголовок желания"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Описание
                        </label>
                        <textarea
                            value={formData.description? formData.description : ""}
                            onChange={(e) => handleChange('description', e.target.value)}
                            placeholder="Опишите ваше желание подробнее..."
                            rows={4}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Цена
                        </label>
                        <input
                            type="text"
                            value={formData.price || ''}
                            onChange={(e) => handleChange('price', e.target.value)}
                            placeholder="Например: 1000 руб, бесплатно..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
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
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="hidden"
                            checked={formData.hidden}
                            onChange={(e) => handleChange('hidden', e.target.checked)}
                            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <label htmlFor="hidden" className="ml-2 text-sm text-gray-700">
                            Скрыть желание
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
                            className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Создание...</span>
                                </>
                            ) : (
                                <span>Создать желание</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default WishCreateModal;
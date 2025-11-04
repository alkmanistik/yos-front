import { useState, useEffect } from 'react';
import {useNavigate, useSearchParams} from "react-router";
import {useAuth} from "../../contexts/AuthContext.tsx";
import type {AdviceCreateRequest, AdviceUpdateRequest} from "../../types/advice.ts";
import {adviceApi} from "../../api/adviceApi.ts";
import {imageApi} from "../../api/imageApi.ts";


const AdviceCreatePage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user: currentUser } = useAuth();
    const editId = searchParams.get('edit');

    const [formData, setFormData] = useState<AdviceCreateRequest>({
        title: '',
        description: '',
        link: '',
        category: '',
        public: true
    });
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [deletedImages, setDeletedImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (editId) {
            loadAdviceForEdit(editId);
        }
    }, [editId]);

    const loadAdviceForEdit = async (adviceId: string) => {
        try {
            setLoading(true);
            const advice = await adviceApi.getAdviceById(adviceId);

            if (currentUser?.id !== advice.userId) {
                navigate('/advice');
                return;
            }

            setFormData({
                title: advice.title,
                description: advice.description || '',
                link: advice.link || '',
                category: advice.category || '',
                public: true
            });

            const images = await imageApi.getAdviceImages(adviceId);
            setExistingImages(images.map(img => img.id));
            setIsEditing(true);
        } catch (err) {
            console.error('Error loading advice for edit:', err);
            setError('Не удалось загрузить совет для редактирования');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            setError('Заголовок обязателен');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            if (isEditing && editId) {
                const updateData: AdviceUpdateRequest = {
                    title: formData.title.trim(),
                    description: formData.description?.trim() || '',
                    link: formData.link?.trim() || '',
                    category: formData.category?.trim() || '',
                    public: formData.public
                };

                const updatedAdvice = await adviceApi.updateAdvice(editId, updateData);

                for (const id of deletedImages) {
                    await imageApi.deleteImage(id);
                }

                if (imageFiles.length > 0) {
                    for (const imageFile of imageFiles) {
                        await imageApi.uploadAdviceImage(updatedAdvice.id, imageFile);
                    }
                }

                navigate(`/advice/${updatedAdvice.id}`);
            } else {
                const newAdvice = await adviceApi.createAdvice({
                    ...formData,
                    title: formData.title.trim(),
                    description: formData.description?.trim() || '',
                    link: formData.link?.trim() || '',
                    category: formData.category?.trim() || ''
                });

                for (const imageFile of imageFiles) {
                    await imageApi.uploadAdviceImage(newAdvice.id, imageFile);
                }

                navigate(`/advice/${newAdvice.id}`);
            }
        } catch (err) {
            console.error('Error saving advice:', err);
            setError(isEditing ? 'Не удалось обновить совет' : 'Не удалось создать совет');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: keyof AdviceCreateRequest, value: string | boolean) => {
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

    const handleCancel = () => {
        if (isEditing && editId) {
            navigate(`/advice/${editId}`);
        } else {
            navigate('/advice');
        }
    };

    if (loading && isEditing) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {isEditing ? 'Редактировать совет' : 'Создать новый совет'}
                        </h1>
                        <button
                            onClick={handleCancel}
                            className="text-gray-400 hover:text-gray-600 text-2xl"
                        >
                            ×
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Изображения */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Изображения
                            </label>
                            {/* Существующие изображения при редактировании */}
                            {isEditing && existingImages.length > 0 && (
                                <div className="grid grid-cols-3 gap-3 mb-4">
                                    {existingImages.map((imageId, index) => (
                                        <div key={imageId} className="relative">
                                            <img
                                                src={imageApi.getImageUrl(imageId)}
                                                alt={`Existing ${index + 1}`}
                                                className="w-full h-24 object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setExistingImages(prev => prev.filter(id => id !== imageId));
                                                    setDeletedImages(prev => [...prev, imageId]);
                                                }}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 w-6 h-6 flex items-center justify-center"
                                            >
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {imagePreviews.length > 0 && (
                                <div className="grid grid-cols-3 gap-3 mb-4">
                                    {imagePreviews.map((preview, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={preview}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-24 object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 w-6 h-6 flex items-center justify-center"
                                            >
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-sm text-gray-500 mt-2">Нажмите для загрузки изображений</p>
                                    <p className="text-xs text-gray-400">Можно выбрать несколько файлов</p>
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

                        {/* Заголовок */}
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

                        {/* Описание */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Описание
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                placeholder="Опишите ваш совет подробнее..."
                                rows={6}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                            />
                        </div>

                        {/* Ссылка */}
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

                        {/* Категория */}
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

                        {/* Публичность */}
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
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        )}

                        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={loading}
                                className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium disabled:opacity-50 border border-gray-300 rounded-lg transition-colors"
                            >
                                Отмена
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !formData.title.trim()}
                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:cursor-not-allowed flex items-center space-x-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        <span>{isEditing ? 'Сохранение...' : 'Создание...'}</span>
                                    </>
                                ) : (
                                    <span>{isEditing ? 'Сохранить изменения' : 'Создать совет'}</span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdviceCreatePage;
import {useState, useRef, useEffect} from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { userApi } from '../../api/userApi';
import type { UserUpdateRequest } from '../../types/user';
import {useNavigate} from "react-router";
import type {ImageShortResponse} from "../../types/image.ts";
import {AxiosError} from "axios";
import {imageApi} from "../../api/imageApi.ts";

interface UserUpdateFormData extends UserUpdateRequest {
    confirmPassword?: string;
}

const UserUpdateModal = () => {
    const navigate = useNavigate();
    const { user, checkAuth } = useAuth();
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [userImages, setUserImages] = useState<ImageShortResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingImages, setLoadingImages] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [avatarAction, setAvatarAction] = useState<'keep' | 'update' | 'delete'>('keep');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<UserUpdateFormData>({
        defaultValues: {
            username: user?.username || '',
            name: user?.name || '',
            email: user?.email || '',
            phone: user?.phone || '',
            informationForWish: user?.informationForWish || '',
            password: '',
            confirmPassword: ''
        }
    });

    useEffect(() => {
        const loadUserImages = async () => {
            if (!user?.id) return;

            try {
                setLoadingImages(true);
                const images = await imageApi.getUserImages(user.id);
                setUserImages(images);

                const mainImage = images.at(0);
                if (mainImage) {
                    setAvatarPreview(imageApi.getImageUrl(mainImage.id));
                }
            } catch (err) {
                console.error('Error loading user images:', err);
            } finally {
                setLoadingImages(false);
            }
        };

        loadUserImages();
    }, [user?.id]);

    const watchPassword = watch('password');

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError('Пожалуйста, выберите изображение');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                setError('Размер изображения не должен превышать 5MB');
                return;
            }

            setAvatarFile(file);
            setAvatarAction('update');
            setError(null);

            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveAvatar = () => {
        setAvatarFile(null);
        setAvatarAction('delete');
        setAvatarPreview(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleCancelAvatarChange = () => {
        setAvatarFile(null);
        setAvatarAction('keep');

        const mainImage = userImages.at(0);
        if (mainImage) {
            setAvatarPreview(imageApi.getImageUrl(mainImage.id));
        } else {
            setAvatarPreview(null);
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const getAvatarDisplay = () => {
        if (loadingImages) {
            return 'loading';
        }
        if (avatarPreview) {
            return 'hasImage';
        }
        return 'placeholder';
    };

    const handleAvatarOperations = async () => {
        if (!user) return;

        try {
            if (avatarAction === 'delete') {
                const mainImage = userImages.find(img => img.main) || userImages[0];
                if (mainImage) {
                    await imageApi.deleteImage(mainImage.id);
                }
            }

            if (avatarAction === 'update' && avatarFile) {
                await imageApi.uploadUserAvatar(user.id, avatarFile);
            }
        } catch (err) {
            console.error('Error managing avatar:', err);
            throw err;
        }
    };

    const onSubmit = async (data: UserUpdateFormData) => {
        if (!user) return;

        setLoading(true);
        setError(null);

        try {
            const updateData: UserUpdateRequest = {};

            if (data.username && data.username !== user.username) updateData.username = data.username;
            if (data.name && data.name !== user.name) updateData.name = data.name;
            if (data.email && data.email !== user.email) updateData.email = data.email;
            if (data.phone !== user.phone) updateData.phone = data.phone;
            if (data.informationForWish !== user.informationForWish) updateData.informationForWish = data.informationForWish;
            if (data.password) updateData.password = data.password;

            const hasDataChanges = Object.keys(updateData).length > 0;
            const hasAvatarChanges = avatarAction !== 'keep';

            if (!hasDataChanges && !hasAvatarChanges) {
                navigate(-1);
                return;
            }

            if (hasDataChanges) {
                await userApi.updateUser(updateData);
            }

            if (hasAvatarChanges) {
                await handleAvatarOperations();
            }

            await checkAuth();

            // Уведомляем об обновлении аватара
            if (avatarAction !== 'keep') {
                const { notifyAvatarUpdate } = await import('../utils/UserDropdown.tsx');
                notifyAvatarUpdate();
            }

            navigate(-1);
        } catch (err: unknown) {
            console.error('Error updating user:', err);
            if (err instanceof AxiosError) {
                setError(err.response?.data?.message || 'Не удалось обновить профиль');
            } else {
                setError("Что-то пошло не так")
            }
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        navigate(-1);
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const avatarDisplay = getAvatarDisplay();

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                {/* Заголовок */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Редактирование профиля</h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Аватар */}
                    <div className="text-center">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Аватар
                        </label>

                        <div className="flex flex-col items-center space-y-3">
                            {/* Превью аватара */}
                            <div className="relative">
                                {avatarDisplay === 'loading' ? (
                                    <div className="w-24 h-24 bg-gray-200 rounded-full animate-pulse flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                    </div>
                                ) : avatarDisplay === 'hasImage' && avatarPreview != null ? (
                                    <img
                                        src={avatarPreview}
                                        alt="Avatar preview"
                                        className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                                    />
                                ) : (
                                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>
                                )}

                                {/* Кнопки управления аватаром */}
                                {avatarDisplay !== 'loading' && (avatarAction !== 'keep' || avatarDisplay === 'hasImage') && (
                                    <div className="absolute -top-2 -right-2 flex space-x-1">
                                        {avatarAction !== 'keep' && (
                                            <button
                                                type="button"
                                                onClick={handleCancelAvatarChange}
                                                className="bg-gray-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-gray-600 transition-colors"
                                                title="Отменить изменение"
                                            >
                                                ↶
                                            </button>
                                        )}
                                        {(avatarDisplay === 'hasImage' || avatarAction === 'delete') && (
                                            <button
                                                type="button"
                                                onClick={handleRemoveAvatar}
                                                className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                                                title="Удалить аватар"
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Статус аватара */}
                            {avatarAction !== 'keep' && (
                                <div className="text-xs font-medium px-3 py-1 rounded-full bg-blue-50 text-blue-700">
                                    {avatarAction === 'delete' && 'Аватар будет удален'}
                                    {avatarAction === 'update' && 'Будет загружен новый аватар'}
                                </div>
                            )}

                            {/* Кнопка загрузки */}
                            <label className="cursor-pointer">
                                <span className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-block">
                                    {avatarDisplay === 'hasImage' ? 'Изменить фото' : 'Выбрать фото'}
                                </span>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                />
                            </label>

                            <p className="text-xs text-gray-500">
                                PNG, JPG до 5MB
                            </p>
                        </div>
                    </div>

                    {/* Имя пользователя */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Имя пользователя *
                        </label>
                        <input
                            type="text"
                            {...register('username', {
                                required: 'Имя пользователя обязательно',
                                minLength: {
                                    value: 3,
                                    message: 'Минимум 3 символа'
                                },
                                maxLength: {
                                    value: 30,
                                    message: 'Максимум 30 символов'
                                },
                                pattern: {
                                    value: /^[a-zA-Z0-9_]+$/,
                                    message: 'Только буквы, цифры и подчеркивания'
                                }
                            })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="username"
                        />
                        {errors.username && (
                            <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                        )}
                    </div>

                    {/* Имя */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Полное имя
                        </label>
                        <input
                            type="text"
                            {...register('name', {
                                maxLength: {
                                    value: 50,
                                    message: 'Максимум 50 символов'
                                }
                            })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="Ваше настоящее имя"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            {...register('email', {
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: 'Введите корректный email'
                                }
                            })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="email@example.com"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Телефон */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Телефон
                        </label>
                        <input
                            type="tel"
                            {...register('phone', {
                                pattern: {
                                    value: /^[0-9]{9,15}$/,
                                    message: 'Введите корректный номер телефона'
                                }
                            })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="+7 (999) 999-99-99"
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                        )}
                    </div>

                    {/* Информация для желаний */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Информация для желаний
                        </label>
                        <textarea
                            {...register('informationForWish', {
                                maxLength: {
                                    value: 500,
                                    message: 'Максимум 500 символов'
                                }
                            })}
                            rows={4}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                            placeholder="Расскажите о своих предпочтениях для подарков..."
                        />
                        {errors.informationForWish && (
                            <p className="text-red-500 text-sm mt-1">{errors.informationForWish.message}</p>
                        )}
                    </div>

                    {/* Пароль */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Новый пароль
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                {...register('password', {
                                    minLength: {
                                        value: 6,
                                        message: 'Минимум 6 символов'
                                    }
                                })}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-10"
                                placeholder="Оставьте пустым, если не хотите менять"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Подтверждение пароля */}
                    {watchPassword && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Подтверждение пароля
                            </label>
                            <input
                                type="password"
                                {...register('confirmPassword', {
                                    validate: value =>
                                        value === watchPassword || 'Пароли не совпадают'
                                })}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Повторите пароль"
                            />
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                            )}
                        </div>
                    )}

                    {/* Сообщение об ошибке */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Кнопки */}
                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={loading}
                            className="px-6 py-2.5 text-gray-600 hover:text-gray-800 font-medium disabled:opacity-50 transition-colors"
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:cursor-not-allowed flex items-center space-x-2"
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

export default UserUpdateModal;
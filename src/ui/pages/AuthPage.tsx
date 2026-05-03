import {useLocation, useNavigate} from "react-router";
import {useForm} from "react-hook-form";
import type {AuthFormData} from "../../types/auth.ts";
import {useState} from "react";
import axios from "axios";
import {useAuth} from "../../contexts/AuthContext.tsx";

const AuthPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { login, registration } = useAuth();
    const isRegister = location.pathname === '/auth/register';
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {register, handleSubmit, formState: {errors}} = useForm<AuthFormData>({
        defaultValues: {
            username: '',
            email: '',
            password: '',
        }
    });

    const onSubmit = async (data: AuthFormData) => {
        setIsLoading(true);
        setError(null);

        try {
            if (isRegister) {
                const registerData = {
                    username: data.username,
                    email: data.email,
                    password: data.password
                };
                await registration(registerData);
            } else {
                const loginData = {
                    email: data.email,
                    password: data.password
                };
                await login(loginData);
            }
            navigate('/advice');
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
                setError(errorMessage);
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const toggleForm = () => {
        navigate(isRegister ? '/auth/login' : '/auth/register');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 p-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 hover:shadow-xl">
                {/* Декоративный верхний элемент */}
                <div className="h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl"></div>

                <div className="p-6 sm:p-8">
                    {/* Логотип */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
                            <span className="text-3xl font-bold text-white">Y</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                            {isRegister ? 'Создать аккаунт' : 'Добро пожаловать'}
                        </h2>
                        <p className="text-gray-500 text-sm">
                            {isRegister
                                ? 'Зарегистрируйтесь, чтобы начать пользоваться сервисом'
                                : 'Войдите в свой аккаунт, чтобы продолжить'}
                        </p>
                    </div>

                    {/* Ошибка */}
                    {error && (
                        <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg animate-shake">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-sm">{error}</span>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Никнейм (только для регистрации) */}
                        {isRegister && (
                            <div className="transform transition-all duration-200">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Никнейм
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        {...register('username', {required: 'Никнейм обязателен'})}
                                        autoComplete="username"
                                        placeholder="Введите никнейм"
                                        className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                                            errors.username
                                                ? 'border-red-500 focus:ring-red-500'
                                                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                        }`}
                                    />
                                </div>
                                {errors.username && (
                                    <p className="text-red-500 text-xs mt-1 flex items-center">
                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {errors.username.message}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Электронная почта
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <input
                                    type="email"
                                    {...register('email', {
                                        required: 'Email обязателен',
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: 'Введите корректный email',
                                        },
                                    })}
                                    autoComplete="email"
                                    placeholder="example@mail.com"
                                    className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                                        errors.email
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                    }`}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1 flex items-center">
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Пароль */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Пароль
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input
                                    type="password"
                                    {...register('password', {
                                        required: 'Пароль обязателен',
                                        minLength: {
                                            value: 6,
                                            message: 'Пароль должен содержать минимум 6 символов',
                                        },
                                    })}
                                    autoComplete={isRegister ? "new-password" : "current-password"}
                                    placeholder={isRegister ? "Придумайте пароль" : "Введите пароль"}
                                    className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                                        errors.password
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                    }`}
                                />
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1 flex items-center">
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Кнопка отправки */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin h-5 w-5 mr-2 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Загрузка...
                                </div>
                            ) : (
                                isRegister ? 'Зарегистрироваться' : 'Войти'
                            )}
                        </button>
                    </form>

                    {/* Переключение между формами */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            {isRegister ? 'Уже есть аккаунт?' : 'Ещё нет аккаунта?'}
                            <button
                                onClick={toggleForm}
                                disabled={isLoading}
                                className="ml-2 text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors"
                            >
                                {isRegister ? 'Войти' : 'Зарегистрироваться'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
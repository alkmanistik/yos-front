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
            navigate('/');
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-500">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">
                    {isRegister ? 'Register' : 'Login'}
                </h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {isRegister && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Username</label>
                            <input
                                type="text"
                                {...register('username', {required: 'Username is required'})}
                                autoComplete="username"
                                className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.username && (
                                <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                            )}
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: 'Invalid email address',
                                },
                            })}
                            autoComplete="email"
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            {...register('password', {
                                required: 'Password is required',
                                minLength: {
                                    value: 6,
                                    message: 'Password must be at least 6 characters',
                                },
                            })}
                            autoComplete={isRegister ? "new-password" : "current-password"}
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
                    >
                        {isRegister ? 'Register' : 'Login'}
                    </button>
                </form>
                <p className="mt-4 text-center text-sm">
                    {isRegister ? 'Already have an account?' : "Don't have an account?"}
                    <button
                        onClick={toggleForm}
                        disabled={isLoading}
                        className="ml-1 text-blue-600 hover:underline"
                    >
                        {isRegister ? 'Login' : 'Register'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthPage;
import {Link} from "react-router";
import * as React from "react";

interface ErrorPageProps {
    code?: number | string;
    title: string;
    description: string;
    showHomeButton?: boolean;
    showLoginButton?: boolean;
    customActions?: React.ReactNode;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
    code = 404,
    title,
    description,
    showHomeButton = true,
    showLoginButton = false,
    customActions
}) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="text-6xl font-bold text-gray-300 mb-4">{code}</div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    {description}
                </p>

                {customActions || (
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        {showHomeButton && (
                            <Link
                                to="/"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                                Вернуться на главную
                            </Link>
                        )}
                        {showLoginButton && (
                            <Link
                                to="/auth/login"
                                className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                                Войти в аккаунт
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ErrorPage;
import type {UserAdminResponse} from "../types/user.ts";
import type {AuthResponse, UserLoginRequest, UserRegisterRequest} from "../types/auth.ts";
import {createContext, useContext, useEffect, useState} from "react";
import {authApi} from "../api/authApi.ts";
import {userApi} from "../api/userApi.ts";
import * as React from "react";

interface AuthContextType {
    user: UserAdminResponse | null;
    isLoading: boolean;
    login: (credentials: UserLoginRequest) => Promise<void>;
    registration: (userData: UserRegisterRequest) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserAdminResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsLoading(false);
            return;
        }

        try {
            const userData = await userApi.getCurrentUser()
            setUser(userData)
            setIsLoading(false);
        } catch (error) {
            console.error('Auth check failed:', error);
            localStorage.removeItem('token');
            setUser(null);
            setIsLoading(false);
        }
    };

    const login = async (credentials: UserLoginRequest) => {
        const response: AuthResponse = await authApi.login(credentials);
        localStorage.setItem('token', response.token);
        await checkAuth();
    };

    const registration = async (userData: UserRegisterRequest) => {
        const response: AuthResponse = await authApi.register(userData);
        localStorage.setItem('token', response.token);
        await checkAuth();
    };

    const logout = () => {
        authApi.logout();
        setUser(null);
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const value = {
        user,
        isLoading,
        login,
        registration,
        logout,
        checkAuth,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
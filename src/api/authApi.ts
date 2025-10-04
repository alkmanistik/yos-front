import type {AuthResponse, UserLoginRequest, UserRegisterRequest} from "../types/auth.ts";
import api from "./indexApi.ts";

export const authApi = {
    async login(credentials: UserLoginRequest): Promise<AuthResponse> {
        const {data} = await api.post<AuthResponse>('/auth/login', credentials);
        return data;
    },

    async register(userData: UserRegisterRequest): Promise<AuthResponse> {
        const {data} = await api.post<AuthResponse>('/auth/registration', userData);
        return data;
    },

    async logout(): Promise<void> {
        localStorage.removeItem('token');
    }
}
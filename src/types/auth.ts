export interface UserLoginRequest {
    email: string;
    password: string;
}

export interface UserRegisterRequest {
    username: string;
    password: string;
    email: string;
}

export type AuthFormData = UserRegisterRequest & UserLoginRequest;

export interface AuthResponse {
    token: string;
}
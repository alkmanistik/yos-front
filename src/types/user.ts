export interface UserAdminResponse {
    id: string;
    username: string;
    email: string;
    name: string | null;
    phone: string | null;
    role: string;
    informationForWish: string | null;
    deleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface UserResponse {
    id: string;
    username: string;
    name: string | null;
    informationForWish: string | null;
    createdAt: string;
}

export interface UserShortResponse {
    id: string;
    username: string;
}

export interface UserRecoverRequest {
    email: string;
}

export interface UserLoginRequest {
    email: string;
    password: string;
}

export interface UserRegisterRequest {
    username: string;
    password: string;
    email: string;
}

export interface UserUpdateRequest {
    username?: string | null;
    password?: string | null;
    name?: string | null;
}
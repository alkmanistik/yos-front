export interface WishCreateRequest {
    title: string;
    description?: string | null;
    price?: string | null;
    link?: string | null;
    hidden?: boolean;
}

export interface WishUpdateRequest {
    title?: string | null;
    description?: string | null;
    price?: string | null;
    link?: string | null;
    hidden?: boolean | null;
}

export interface WishReserveRequest {
    message?: string | null;
    reserveEndDate?: number;
}

export interface WishAdminResponse {
    id: string;
    userId: string;
    title: string;
    description?: string | null;
    price?: string | null;
    link?: string | null;
    fulfilled: boolean;
    giverUser?: string | null;
    createdAt: string;
    updatedAt: string;
    fulfilledAt?: string | null;
}

export interface WishResponse {
    id: string;
    userId: string;
    title: string;
    description?: string | null;
    price?: string | null;
    link?: string | null;
    fulfilled: boolean;
    giverUser?: string | null;
    createdAt: string;
    fulfilledAt?: string | null;
}

export interface WishShortResponse {
    id: string;
    userId: string;
    title: string;
    price?: string | null;
    fulfilled: boolean;
}
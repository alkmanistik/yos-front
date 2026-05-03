export interface AdviceAdminResponse {
    id: string;
    userId: string;
    title: string;
    description: string;
    link?: string | null;
    category?: string | null;
    price?: string | null;
    adAdvice: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface AdviceResponse {
    id: string;
    userId: string;
    title: string;
    description: string;
    link?: string | null;
    category?: string | null;
    price?: string | null;
    adAdvice: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface AdviceShortResponse {
    id: string;
    userId: string;
    title: string;
    category?: string | null;
    price?: string | null;
    adAdvice: boolean;
}

export interface AdviceCreateRequest {
    title: string;
    description: string;
    link?: string | null;
    category?: string | null;
    price?: string | null;
    public?: boolean;
}

export interface AdviceToWishRequest {
    hidden?: boolean | null;
}

export interface AdviceUpdateRequest {
    title?: string | null;
    description?: string | null;
    link?: string | null;
    category?: string | null;
    price?: string | null;
    public?: boolean | null;
}
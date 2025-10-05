export interface PaginationParams {
    page?: number;
    size?: number;
    sort?: 'ASC' | 'DESC';
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    hasMore: boolean;
    page: number;
    size: number;
}
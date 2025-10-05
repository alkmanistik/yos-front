export interface ImageAdminResponse {
    id: string;
    userId: string;
    fileName: string;
    entityType: string;
    entityId: string;
    main: boolean;
    createdAt: string;
}

export interface ImageShortResponse {
    id: string;
    fileName: string;
    main: boolean;
    createdAt: string;
}

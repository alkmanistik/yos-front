export interface ComplaintRequest {
    reason: string;
    description?: string | null;
}

export interface ComplaintAdminResponse {
    id: string;
    reporterId: string;
    entityType: string;
    entityId: string;
    reason: string;
    status: string;
    description?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface ComplaintResponse {
    id: string;
    reporterId: string;
    entityType: string;
    entityId: string;
    reason: string;
    status: string;
    description?: string | null;
    createdAt: string;
    updatedAt: string;
}
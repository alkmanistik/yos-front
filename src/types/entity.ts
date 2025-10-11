export type EntityType = 'ADVICE' | 'COMMENT' | 'WISH' | 'RECEIPT' | 'IMAGE' | 'USER';

export interface EntityRequest {
    entityId: string;
    entityType: EntityType;
}
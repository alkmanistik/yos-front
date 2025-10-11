import type {ImageAdminResponse, ImageRequest, ImageShortResponse} from "../types/image.ts";
import api from "./indexApi.ts";
import type {EntityRequest} from "../types/entity.ts";

export const imageApi = {
    async uploadImage(
        imageRequest: ImageRequest,
        imageFile: File
    ): Promise<ImageAdminResponse> {
        const formData = new FormData();

        formData.append('imageRequest', JSON.stringify(imageRequest));
        formData.append('image', imageFile);

        const { data } = await api.post<ImageAdminResponse>('/image/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data;
    },

    async getImage(id: string): Promise<Blob> {
        const response = await api.get(`/image/${id}`, {
            responseType: 'blob'
        });
        return response.data;
    },

    getImageUrl(id: string): string {
        return `${api.defaults.baseURL}/image/${id}`;
    },

    async getImagesByEntity(entityRequest: EntityRequest): Promise<ImageShortResponse[]> {
        const { data } = await api.get<ImageShortResponse[]>('/image/', {
            params: entityRequest
        });
        return data;
    },

    async getUserImages(userId: string): Promise<ImageShortResponse[]> {
        return this.getImagesByEntity({
            entityId: userId,
            entityType: 'USER'
        });
    },

    async getAdviceImages(adviceId: string): Promise<ImageShortResponse[]> {
        return this.getImagesByEntity({
            entityId: adviceId,
            entityType: 'ADVICE'
        });
    },

    async getWishImages(wishId: string): Promise<ImageShortResponse[]> {
        return this.getImagesByEntity({
            entityId: wishId,
            entityType: 'WISH'
        });
    },

    async getReceiptImages(receiptId: string): Promise<ImageShortResponse[]> {
        return this.getImagesByEntity({
            entityId: receiptId,
            entityType: 'RECEIPT'
        });
    },

    async deleteImage(id: string): Promise<void> {
        await api.delete(`/image/${id}`);
    },

    async uploadUserAvatar(userId: string, imageFile: File): Promise<ImageAdminResponse> {
        return this.uploadImage(
            {
                entityId: userId,
                entityType: 'USER',
                private: false
            },
            imageFile
        );
    },

    async uploadAdviceImage(adviceId: string, imageFile: File): Promise<ImageAdminResponse> {
        return this.uploadImage(
            {
                entityId: adviceId,
                entityType: 'ADVICE',
                private: false
            },
            imageFile
        );
    },

    async uploadWishImage(wishId: string, imageFile: File): Promise<ImageAdminResponse> {
        return this.uploadImage(
            {
                entityId: wishId,
                entityType: 'WISH',
                private: false
            },
            imageFile
        );
    },

    async uploadReceiptImage(receiptId: string, imageFile: File): Promise<ImageAdminResponse> {
        return this.uploadImage(
            {
                entityId: receiptId,
                entityType: 'RECEIPT',
                private: true
            },
            imageFile
        );
    },

    async uploadCommentImage(commentId: string, imageFile: File): Promise<ImageAdminResponse> {
        return this.uploadImage(
            {
                entityId: commentId,
                entityType: 'COMMENT',
                private: false
            },
            imageFile
        );
    }
};
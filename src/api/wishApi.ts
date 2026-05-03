import type {
    WishCreateRequest,
    WishReserveRequest,
    WishResponse,
    WishShortResponse,
    WishUpdateRequest
} from "../types/wish.ts";
import api from "./indexApi.ts";
import type {Status} from "../types/status.ts";
import type {PaginationParams} from "../types/pagination.ts";

export const wishApi = {
    async getWishById(id: string): Promise<WishResponse> {
        const { data } = await api.get<WishResponse>(`/wish/${id}`);
        return data;
    },

    async getWishStatus(id: string): Promise<Status> {
        const { data } = await api.get<Status>(`/wish/${id}/status`);
        return data;
    },

    async getUserWishes(
        userId: string,
        params: PaginationParams = { page: 0, size: 10, sort: 'ASC' }
    ): Promise<WishShortResponse[]> {
        const { data } = await api.get<WishShortResponse[]>(`/wish/user/${userId}/`, {
            params
        });
        return data;
    },

    async getUserFulfilledWishes(
        userId: string,
        params: PaginationParams = { page: 0, size: 10, sort: 'ASC' }
    ): Promise<WishShortResponse[]> {
        const { data } = await api.get<WishShortResponse[]>(`/wish/user/${userId}/fulfilled`, {
            params
        });
        return data;
    },

    async getWishCount(userId: string): Promise<number> {
        const { data } = await api.get<number>(`/wish/user/${userId}/count`);
        return data;
    },

    async getFulfilledWishCount(userId: string): Promise<number> {
        const { data } = await api.get<number>(`/wish/user/${userId}/fulfilled/count`);
        return data;
    },

    async searchWishes(
        query?: string,
        params: PaginationParams = { page: 0, size: 10, sort: 'ASC' }
    ): Promise<WishShortResponse[]> {
        const { data } = await api.get<WishShortResponse[]>('/wish/search', {
            params: { q: query, ...params }
        });
        return data;
    },

    async createWish(wishData: WishCreateRequest): Promise<WishResponse> {
        const { data } = await api.post<WishResponse>('/wish/', wishData);
        return data;
    },

    async updateWish(
        id: string,
        updateData: WishUpdateRequest
    ): Promise<WishResponse> {
        const { data } = await api.patch<WishResponse>(`/wish/${id}`, updateData);
        return data;
    },

    async markAsFulfilled(id: string): Promise<WishResponse> {
        const { data } = await api.patch<WishResponse>(`/wish/${id}/fulfilled`);
        return data;
    },

    async deleteWish(id: string): Promise<void> {
        await api.delete(`/wish/${id}`);
    },

    async reserveWish(id: string, reserveData: WishReserveRequest): Promise<void> {
        await api.post(`/wish/${id}/reserve`, reserveData);
    },

    async cancelReserve(id: string): Promise<void> {
        await api.delete(`/wish/${id}/reserve`);
    },

    async getReserveStatus(id: string): Promise<Status> {
        const { data } = await api.get<Status>(`/wish/${id}/isReservedByMe`);
        return data;
    }
};
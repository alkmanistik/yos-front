import type {UserAdminResponse, UserResponse, UserShortResponse, UserUpdateRequest} from "../types/user.ts";
import api from "./indexApi.ts";
import type {Status} from "../types/status.ts";
import type {PaginationParams} from "../types/pagination.ts";
import type {WishShortResponse} from "../types/wish.ts";
import type {AdviceShortResponse} from "../types/advice.ts";

export const userApi = {
    async getUser(id: string): Promise<UserResponse> {
        const { data } = await api.get(`/user/${id}`);
        return data;
    },

    async getCurrentUser(): Promise<UserAdminResponse> {
        const { data } = await api.get('/user/');
        return data;
    },
    async updateUser(updateData: UserUpdateRequest): Promise<UserResponse> {
        const { data } = await api.patch<UserResponse>('/user/', updateData);
        return data;
    },

    async deleteUser(): Promise<void> {
        await api.delete('/user/');
        localStorage.removeItem('token');
    },

    async getUserStatus(id: string): Promise<Status> {
        const { data } = await api.get(`/user/${id}/status`);
        return data;
    },

    async getAdProfileStatus(id: string): Promise<Status> {
        const { data } = await api.get(`/user/${id}/adProfile/status`);
        return data;
    },

    async getSubs(id: string, params: PaginationParams = { page: 0, size: 10, sort: 'ASC' }): Promise<UserShortResponse[]> {
        const { data } = await api.get(`/user/${id}/sub`, { params });
        return data;
    },

    async getSubCount(id: string): Promise<number> {
        const { data } = await api.get(`/user/${id}/sub/count`);
        return data;
    },

    async getFollowers(id: string, params: PaginationParams = { page: 0, size: 10, sort: 'ASC' }): Promise<UserShortResponse[]> {
        const { data } = await api.get(`/user/${id}/fol`, { params });
        return data;
    },

    async getFolCount(id: string): Promise<number> {
        const { data } = await api.get(`/user/${id}/fol/count`);
        return data;
    },

    async getWish(id: string, params: PaginationParams = { page: 0, size: 10, sort: 'ASC' }): Promise<WishShortResponse[]> {
        const { data } = await api.get(`/user/${id}/wish`, { params });
        return data;
    },

    async getWishCount(id: string): Promise<number> {
        const { data } = await api.get(`/user/${id}/wish/count`);
        return data;
    },

    async getFulfilledWishlist(id: string, params: PaginationParams = { page: 0, size: 10, sort: 'ASC' }): Promise<WishShortResponse[]> {
        const { data } = await api.get(`/user/${id}/wish/fulfilled`, { params });
        return data;
    },

    async getAdvice(id: string, params: PaginationParams = { page: 0, size: 10, sort: 'ASC' }): Promise<AdviceShortResponse[]> {
        const { data } = await api.get(`/user/${id}/advice`, { params });
        return data;
    },

    async getAdviceCount(id: string): Promise<number> {
        const { data } = await api.get(`/user/${id}/advice/count`);
        return data;
    },

    async searchUsers(query: string, params: PaginationParams = { page: 0, size: 10, sort: 'ASC' }): Promise<UserShortResponse[]> {
        const { data } = await api.get(`/user/search`, { params: { query, ...params } });
        return data;
    },

    async addSub(targetId: string): Promise<void> {
        await api.post(`/user/${targetId}/sub/add`);
    },

    async removeSub(targetId: string): Promise<void> {
        await api.post(`/user/${targetId}/sub/remove`);
    },

    async getSubStatus(targetId: string): Promise<Status> {
        const { data } = await api.get(`/user/${targetId}/sub/status`);
        return data;
    }
};
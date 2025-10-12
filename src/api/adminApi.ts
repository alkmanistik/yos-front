import type {PaginationParams} from "../types/pagination.ts";
import type {UserAdminResponse} from "../types/user.ts";
import api from "./indexApi.ts";
import type {WishAdminResponse} from "../types/wish.ts";
import type {AdviceAdminResponse} from "../types/advice.ts";

export const adminApi = {
    async getAllUsers(query = '', params: PaginationParams = { page: 0, size: 10, sort: 'ASC' }): Promise<UserAdminResponse[]> {
        const { data } = await api.get('/admin/users/', { params: { query, ...params } });
        return data;
    },
    async getAllWishes(
        query?: string,
        params: PaginationParams = { page: 0, size: 10, sort: 'ASC' }
    ): Promise<WishAdminResponse[]> {
        const { data } = await api.get<WishAdminResponse[]>('/admin/wish/', {
            params: { q: query, ...params }
        });
        return data;
    },
    async getAllAdvices(
        query?: string,
        params: PaginationParams = { page: 0, size: 10, sort: 'ASC' }
    ): Promise<AdviceAdminResponse[]> {
        const { data } = await api.get<AdviceAdminResponse[]>('/admin/advice/', {
            params: { q: query, ...params }
        });
        return data;
    },
    async deleteUser(id: string): Promise<void> {
        await api.delete(`/admin/user/${id}`);
    },
    async deleteAdvice(id: string): Promise<void> {
        await api.delete(`/admin/advice/${id}`);
    },
    async deleteWish(id: string): Promise<void> {
        await api.delete(`/admin/wish/${id}`);
    },
}
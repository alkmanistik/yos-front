import type {AdviceCreateRequest, AdviceResponse, AdviceShortResponse, AdviceUpdateRequest} from "../types/advice.ts";
import api from "./indexApi.ts";
import type {Status} from "../types/status.ts";
import type {UserShortResponse} from "../types/user.ts";
import type {PaginationParams} from "../types/pagination.ts";

export const adviceApi = {
    async getAdviceById(id: string): Promise<AdviceResponse> {
        const { data } = await api.get<AdviceResponse>(`/advice/${id}`);
        return data;
    },

    async getAdviceStatus(id: string): Promise<Status> {
        const { data } = await api.get<Status>(`/advice/${id}/status`);
        return data;
    },

    async getAdviceAuthor(id: string): Promise<UserShortResponse> {
        const { data } = await api.get<UserShortResponse>(`/advice/${id}/user`);
        return data;
    },

    async searchAdvices(
        query?: string,
        params: PaginationParams = { page: 0, size: 10, sort: 'ASC' }
    ): Promise<AdviceShortResponse[]> {
        const { data } = await api.get<AdviceShortResponse[]>('/advice/search', {
            params: { q: query, ...params }
        });
        return data;
    },
    async createAdvice(adviceData: AdviceCreateRequest): Promise<AdviceResponse> {
        const { data } = await api.post<AdviceResponse>('/advice/', adviceData);
        return data;
    },

    async updateAdvice(
        id: string,
        updateData: AdviceUpdateRequest,
        imageFile?: File
    ): Promise<AdviceResponse> {
        const formData = new FormData();

        if (updateData) {
            formData.append('adviceUpdateRequest', JSON.stringify(updateData));
        }

        if (imageFile) {
            formData.append('wishImage', imageFile);
        }

        const { data } = await api.patch<AdviceResponse>(`/advice/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data;
    },

    async deleteAdvice(id: string): Promise<void> {
        await api.delete(`/advice/${id}`);
    },

    async getAllAdvices(
        query?: string,
        params: PaginationParams = { page: 0, size: 10, sort: 'ASC' }
    ): Promise<AdviceShortResponse[]> {
        const { data } = await api.get<AdviceShortResponse[]>('/admin/advice/', {
            params: { q: query, ...params }
        });
        return data;
    }
};
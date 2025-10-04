import type {UserAdminResponse, UserResponse, UserShortResponse, UserUpdateRequest} from "../types/user.ts";
import api from "./indexApi.ts";
import type {Status} from "../types/status.ts";
import type {PaginationParams} from "../types/pagination.ts";
import type {WishShortResponse} from "../types/wish.ts";
import type {AdviceShortResponse} from "../types/advice.ts";

export const getUser = async (id: string): Promise<UserResponse> => {
    const { data } = await api.get(`/user/${id}`);
    return data;
};

export const getUserStatus = async (id: string): Promise<Status> => {
    const { data } = await api.get(`/user/${id}/status`);
    return data;
};

export const getSubs = async (
    id: string,
    params: PaginationParams = { page: 0, size: 10, sort: 'ASC' }
): Promise<UserShortResponse[]> => {
    const { data } = await api.get(`/user/${id}/sub`, { params });
    return data;
};

export const getSubCount = async (id: string): Promise<number> => {
    const { data } = await api.get(`/user/${id}/sub/count`);
    return data;
};

export const getFollowers = async (
    id: string,
    params: PaginationParams = { page: 0, size: 10, sort: 'ASC' }
): Promise<UserShortResponse[]> => {
    const { data } = await api.get(`/user/${id}/fol`, { params });
    return data;
};

export const getFolCount = async (id: string): Promise<number> => {
    const { data } = await api.get(`/user/${id}/fol/count`);
    return data;
};

export const getWishlist = async (
    id: string,
    params: PaginationParams = { page: 0, size: 10, sort: 'ASC' }
): Promise<WishShortResponse[]> => {
    const { data } = await api.get(`/user/${id}/wishlist`, { params });
    return data;
};

export const getFulfilledWishlist = async (
    id: string,
    params: PaginationParams = { page: 0, size: 10, sort: 'ASC' }
): Promise<WishShortResponse[]> => {
    const { data } = await api.get(`/user/${id}/wishlist/fulfilled`, { params });
    return data;
};

export const getAdvice = async (
    id: string,
    params: PaginationParams = { page: 0, size: 10, sort: 'ASC' }
): Promise<AdviceShortResponse[]> => {
    const { data } = await api.get(`/user/${id}/advice`, { params });
    return data;
};

export const getAdProfileStatus = async (id: string): Promise<Status> => {
    const { data } = await api.get(`/user/${id}/adProfile/status`);
    return data;
};

/*export const getAdProfile = async (id: string): Promise<AdProfileResponse> => {
    const { data } = await api.get(`/user/${id}/adProfile`);
    return data;
};*/

export const searchUsers = async (
    query: string,
    params: PaginationParams = { page: 0, size: 10, sort: 'ASC' }
): Promise<UserShortResponse[]> => {
    const { data } = await api.get(`/user/search`, { params: { query, ...params } });
    return data;
};

export const getCurrentUser = async (): Promise<UserResponse> => {
    const { data } = await api.get('/user/');
    return data;
};

export const updateUser = async (
    updateData: UserUpdateRequest,
    avatarFile: File | null = null
): Promise<UserResponse> => {
    const formData = new FormData();
    if (updateData) formData.append('userUpdateRequest', JSON.stringify(updateData));
    if (avatarFile) formData.append('avatar', avatarFile);
    const { data } = await api.patch('/user/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
};

export const deleteUser = async (): Promise<void> => {
    await api.delete('/user/');
    localStorage.removeItem('token');
};

export const addSub = async (targetId: string): Promise<void> => {
    await api.post(`/user/${targetId}/sub/add`);
};

export const removeSub = async (targetId: string): Promise<void> => {
    await api.post(`/user/${targetId}/sub/remove`);
};

export const getSubStatus = async (targetId: string): Promise<Status> => {
    const { data } = await api.get(`/user/${targetId}/sub/status`);
    return data;
};

/*export const addComplaint = async (
    targetId: string,
    complaintData: ComplaintRequest
): Promise<unknown> => {
    const { data } = await api.post(`/user/${targetId}/complaints/add`, complaintData);
    return data;
};

export const getCheckedNotifications = async (): Promise<NotificationResponse[]> => {
    const { data } = await api.get('/user/notification/check');
    return data;
};

export const getUncheckedNotifications = async (): Promise<NotificationResponse[]> => {
    const { data } = await api.get('/user/notification/uncheck');
    return data;
};*/

export const getAllUsers = async (
    query = '',
    params: PaginationParams = { page: 0, size: 10, sort: 'ASC' }
): Promise<UserAdminResponse[]> => {
    const { data } = await api.get('/admin/users', { params: { query, ...params } });
    return data;
};
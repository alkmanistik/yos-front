import {useEffect, useState} from "react";
import type {ImageShortResponse} from "../types/image.ts";
import {userApi} from "../api/userApi.ts";

export const useUserImages = (userId: string | undefined) => {
    const [images, setImages] = useState<ImageShortResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadImages = async () => {
            if (!userId) return;

            try {
                setLoading(true);
                setError(null);
                const userImages = await userApi.getUserImages(userId);
                setImages(userImages);
            } catch (err) {
                console.error('Error loading user images:', err);
                setError('Не удалось загрузить изображения');
            } finally {
                setLoading(false);
            }
        };

        loadImages();
    }, [userId]);

    const getAvatarUrl = (): string | null => {
        const mainImage = images.at(0)
        return mainImage ? `/image/${mainImage.id}` : null;
    };

    return {
        images,
        loading,
        error,
        getAvatarUrl
    };
};
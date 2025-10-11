import {useCallback, useEffect, useState} from "react";
import type {ImageShortResponse} from "../types/image.ts";
import {imageApi} from "../api/imageApi.ts";

export const useUserImages = (userId?: string) => {
    const [images, setImages] = useState<ImageShortResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<number>(Date.now());

    const loadImages = useCallback(async () => {
        if (!userId) return;

        try {
            setLoading(true);
            const userImages = await imageApi.getUserImages(userId);
            setImages(userImages);
        } catch (error) {
            console.error('Error loading user images:', error);
            setImages([]);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    const refreshImages = useCallback(() => {
        setLastUpdate(Date.now());
    }, []);

    useEffect(() => {
        loadImages();
    }, [loadImages, lastUpdate]);

    const getAvatarUrl = useCallback((): string | null => {
        const mainImage = images.find(img => img.main) || images[0];
        return mainImage ? `/image/${mainImage.id}` : null;
    }, [images]);

    return {
        images,
        loading,
        getAvatarUrl,
        refreshImages
    };
};
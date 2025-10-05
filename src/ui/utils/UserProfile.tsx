import type {UserResponse} from "../../types/user.ts";
import {Link} from "react-router";
import {userApi} from "../../api/userApi.ts";
import {useEffect, useState} from "react";
import * as React from "react";
import {useUserImages} from "../../hooks/useUserImages.ts";

interface UserProfileProps {
    user: UserResponse;
    isOwnProfile: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, isOwnProfile }) => {
    const [stats, setStats] = useState({
        subCount: 0,
        folCount: 0,
    });
    const [loading, setLoading] = useState(true);
    const {loading: loadingImages, getAvatarUrl } = useUserImages(user.id);
    const avatarUrl = getAvatarUrl();

    useEffect(() => {
        const loadUserStats = async () => {
            try {
                setLoading(true);
                const [subCount, folCount] = await Promise.all([
                    userApi.getSubCount(user.id),
                    userApi.getFolCount(user.id),
                ]);

                setStats({
                    subCount,
                    folCount,
                });
            } catch (error) {
                console.error('Error loading user stats:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user?.id) {
            loadUserStats();
        }
    }, [user?.id]);

    if (loading) {
        return (
            <div className="flex space-x-6 mt-6 pt-6 border-t border-gray-200">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="text-center">
                        <div className="animate-pulse bg-gray-200 h-8 w-12 rounded mx-auto"></div>
                        <div className="animate-pulse bg-gray-200 h-4 w-16 rounded mt-2 mx-auto"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                    {/* Аватар */}
                    {loadingImages ? (
                        <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse"></div>
                    ) : avatarUrl ? (
                        <img
                            src={"http://localhost:8080" + avatarUrl}
                            alt={`${user.username}'s avatar`}
                            className="w-20 h-20 rounded-full object-cover shadow-lg"
                        />
                    ) : (
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                    )}

                    {/* Информация */}
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {user.name || user.username}
                        </h1>
                        <p className="text-gray-600">@{user.username}</p>
                        {user.informationForWish && (
                            <p className="text-gray-700 mt-2 max-w-md">
                                {user.informationForWish}
                            </p>
                        )}
                        <p className="text-sm text-gray-500 mt-1">
                            Участник с {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                        </p>
                    </div>
                </div>

                {/* Действия */}
                <div className="flex space-x-3">
                    {isOwnProfile ? (
                        <>
                            <Link
                                to="/user/update"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                                Редактировать
                            </Link>
                        </>
                    ) : (
                        <>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                📨 Написать
                            </button>
                            <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                👥 Добавить в друзья
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Статистика */}
            <div className="flex space-x-6 mt-6 pt-6 border-t border-gray-200">
                <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                        {stats.folCount}
                    </div>
                    <div className="text-sm text-gray-500">Подписчиков</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                        {stats.subCount}
                    </div>
                    <div className="text-sm text-gray-500">Подписок</div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
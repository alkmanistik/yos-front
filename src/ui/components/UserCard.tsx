import {useUserImages} from '../../hooks/useUserImages';
import type {UserShortResponse} from '../../types/user';
import {imageApi} from '../../api/imageApi';

interface UserCardProps {
    user: UserShortResponse;
    onClick: (userId: string) => void;
    showActionButton?: boolean;
    actionButtonText?: string;
    actionButton?: React.ReactNode;
    onActionClick?: (userId: string) => void;
    actionLoading?: boolean;
}

const UserCard: React.FC<UserCardProps> = ({
                                               user,
                                               onClick,
                                               showActionButton = false,
                                               actionButtonText = 'Действие',
                                               actionButton,
                                               onActionClick,
                                               actionLoading = false
                                           }) => {
    const {loading, getAvatarUrl} = useUserImages(user.id);
    const avatarUrl = getAvatarUrl();

    const handleActionClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onActionClick?.(user.id);
    };

    const handleCardClick = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('button')) {

            return;
        }
        onClick(user.id);
    };

    return (
        <div
            onClick={handleCardClick}
            className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100"
        >
            <div className="flex items-center space-x-4 flex-1 min-w-0">
                {/* Аватар */}
                <div className="flex-shrink-0">
                    {loading ? (
                        <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                    ) : avatarUrl ? (
                        <img
                            src={imageApi.getImageUrl(avatarUrl.split('/').pop() || '')}
                            alt={`${user.username}'s avatar`}
                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                        />
                    ) : (
                        <div
                            className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>

                {/* Информация о пользователе */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                        {user.username}
                    </h3>
                    <p className="text-gray-500 text-sm">
                        @{user.username}
                    </p>
                </div>
            </div>

            {/* Кнопка действия или стрелка */}
            {showActionButton ? (
                <div onClick={e => e.stopPropagation()}>
                    {actionButton || (
                        <button
                            onClick={handleActionClick}
                            disabled={actionLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 ml-4"
                        >
                            {actionLoading ? '...' : actionButtonText}
                        </button>
                    )}
                </div>
            ) : (
                <div className="flex-shrink-0 text-gray-400 ml-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            )}
        </div>
    );
};

export default UserCard;
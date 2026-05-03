import { useState, useEffect, useCallback, useRef } from 'react';
import {useAuth} from "../../contexts/AuthContext.tsx";
import {userApi} from "../../api/userApi.ts";
import {notifySubscriptionsUpdate} from "../../events/subscriptionEvents.ts";

interface SubscribeButtonProps {
    targetUserId: string;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'primary' | 'secondary';
    showFriendStatus?: boolean;
    onSubscriptionChange?: (isSubscribed: boolean, isFriend: boolean) => void;
}

const SubscribeButton: React.FC<SubscribeButtonProps> = ({
                                                             targetUserId,
                                                             size = 'md',
                                                             variant = 'primary',
                                                             showFriendStatus = true,
                                                             onSubscriptionChange
                                                         }) => {
    const { user: currentUser } = useAuth();
    const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null);
    const [isFriend, setIsFriend] = useState(false);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const isMounted = useRef(true);

    // Стабилизируем onSubscriptionChange через useRef
    const onSubscriptionChangeRef = useRef(onSubscriptionChange);
    useEffect(() => {
        onSubscriptionChangeRef.current = onSubscriptionChange;
    }, [onSubscriptionChange]);

    const checkSubscription = useCallback(async () => {
        if (!currentUser || currentUser.id === targetUserId) {
            if (isMounted.current) {
                setIsSubscribed(null);
                setIsFriend(false);
                setLoading(false);
            }
            return;
        }

        try {
            const subStatus = await userApi.getSubStatus(targetUserId);

            if (!isMounted.current) return;

            let subscribed = false;
            let friend = false;

            if (subStatus.status === "FRIEND") {
                friend = true;
                subscribed = true;
            } else if (subStatus.status === "SUB") {
                subscribed = true;
                friend = false;
            } else {
                subscribed = false;
                friend = false;
            }

            setIsSubscribed(subscribed);
            setIsFriend(friend);
        } catch (error) {
            console.error('Error checking subscription:', error);
            if (isMounted.current) {
                setIsSubscribed(false);
            }
        } finally {
            if (isMounted.current) {
                setLoading(false);
            }
        }
    }, [currentUser, targetUserId]);

    useEffect(() => {
        isMounted.current = true;
        checkSubscription();

        return () => {
            isMounted.current = false;
        };
    }, [checkSubscription]);

    const handleSubscription = async () => {
        if (!currentUser || currentUser.id === targetUserId) return;
        if (isSubscribed === null) return;
        if (actionLoading) return;

        setActionLoading(true);
        try {
            if (isSubscribed) {
                await userApi.removeSub(targetUserId);
                if (isMounted.current) {
                    setIsSubscribed(false);
                    setIsFriend(false);
                }
            } else {
                await userApi.addSub(targetUserId);
                if (isMounted.current) {
                    setIsSubscribed(true);
                }
            }
            notifySubscriptionsUpdate();
            onSubscriptionChangeRef.current?.(!isSubscribed, false);
        } catch (error) {
            console.error('Error updating subscription:', error);
        } finally {
            if (isMounted.current) {
                setActionLoading(false);
            }
        }
    };

    // Не показываем кнопку для своего профиля
    if (!currentUser || currentUser.id === targetUserId) {
        return null;
    }

    // Показываем скелетон во время загрузки
    if (loading || isSubscribed === null) {
        const skeletonSizes = {
            sm: 'h-8 w-24',
            md: 'h-9 w-28',
            lg: 'h-10 w-32'
        };

        return (
            <div className={`${skeletonSizes[size]} bg-gray-200 rounded-lg animate-pulse`}></div>
        );
    }

    const sizeClasses = {
        sm: 'px-3 py-1 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base'
    };

    const variantClasses = {
        primary: {
            subscribed: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
            unsubscribed: 'bg-blue-600 text-white hover:bg-blue-700'
        },
        secondary: {
            subscribed: 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200',
            unsubscribed: 'bg-white text-blue-600 hover:bg-blue-50 border border-blue-600'
        }
    };

    const getButtonText = () => {
        if (actionLoading) return '';
        if (isSubscribed) {
            return showFriendStatus && isFriend ? 'Вы друзья' : 'Отписаться';
        }
        return 'Подписаться';
    };

    const isLoading = actionLoading;

    return (
        <button
            onClick={handleSubscription}
            disabled={isLoading}
            className={`
                rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap
                ${sizeClasses[size]}
                ${isSubscribed
                ? variantClasses[variant].subscribed
                : variantClasses[variant].unsubscribed
            }
            `}
        >
            {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mx-auto"></div>
            ) : (
                getButtonText()
            )}
        </button>
    );
};

export default SubscribeButton;
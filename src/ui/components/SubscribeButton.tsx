import { useState, useEffect } from 'react';
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
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isFriend, setIsFriend] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkSubscription = async () => {
            if (!currentUser || currentUser.id === targetUserId) {
                setIsSubscribed(false);
                setIsFriend(false);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const subStatus = await userApi.getSubStatus(targetUserId);

                if (subStatus.status === "FRIEND") {
                    setIsFriend(true);
                    setIsSubscribed(true);
                } else if (subStatus.status === "SUB") {
                    setIsSubscribed(true);
                    setIsFriend(false);
                } else {
                    setIsSubscribed(false);
                    setIsFriend(false);
                }

                notifySubscriptionsUpdate();
                onSubscriptionChange?.(isSubscribed, isFriend);
            } catch (error) {
                console.error('Error checking subscription:', error);
            } finally {
                setLoading(false);
            }
        };

        checkSubscription();
    }, [currentUser, targetUserId]);

    const handleSubscription = async () => {
        if (!currentUser || currentUser.id === targetUserId) return;

        setLoading(true);
        try {
            if (isSubscribed) {
                await userApi.removeSub(targetUserId);
                setIsSubscribed(false);
                setIsFriend(false);
            } else {
                await userApi.addSub(targetUserId);
                setIsSubscribed(true);
            }
            notifySubscriptionsUpdate();
            onSubscriptionChange?.(isSubscribed, isFriend);
        } catch (error) {
            console.error('Error updating subscription:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!currentUser || currentUser.id === targetUserId) {
        return null;
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
        if (loading) {
            return '';
        }
        if (isSubscribed) {
            return showFriendStatus && isFriend ? 'Вы друзья' : 'Отписаться';
        }
        return 'Подписаться';
    };

    return (
        <button
            onClick={handleSubscription}
            disabled={loading}
            className={`
                rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                ${sizeClasses[size]}
                ${isSubscribed
                ? variantClasses[variant].subscribed
                : variantClasses[variant].unsubscribed
            }
            `}
        >
            {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mx-auto"></div>
            ) : (
                getButtonText()
            )}
        </button>
    );
};

export default SubscribeButton;
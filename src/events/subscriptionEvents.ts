class SubscriptionEventTarget extends EventTarget {
    notifySubscriptionsUpdate() {
        this.dispatchEvent(new Event('subscriptionsUpdated'));
    }
}

export const subscriptionEvents = new SubscriptionEventTarget();

export const notifySubscriptionsUpdate = () => {
    subscriptionEvents.notifySubscriptionsUpdate();
};
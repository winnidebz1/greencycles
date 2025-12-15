import { create } from 'zustand';
import type { Notification } from '@/types';

interface NotificationStore {
    notifications: Notification[];
    unreadCount: number;
    addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    removeNotification: (id: string) => void;
    clearAll: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
    notifications: [],
    unreadCount: 0,

    addNotification: (notification) => {
        const newNotification: Notification = {
            ...notification,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
        };

        set((state) => ({
            notifications: [newNotification, ...state.notifications],
            unreadCount: state.unreadCount + 1,
        }));
    },

    markAsRead: (id) => {
        set((state) => ({
            notifications: state.notifications.map((n) =>
                n.id === id ? { ...n, isRead: true } : n
            ),
            unreadCount: Math.max(0, state.unreadCount - 1),
        }));
    },

    markAllAsRead: () => {
        set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
            unreadCount: 0,
        }));
    },

    removeNotification: (id) => {
        set((state) => {
            const notification = state.notifications.find((n) => n.id === id);
            const wasUnread = notification && !notification.isRead;

            return {
                notifications: state.notifications.filter((n) => n.id !== id),
                unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
            };
        });
    },

    clearAll: () => {
        set({ notifications: [], unreadCount: 0 });
    },
}));

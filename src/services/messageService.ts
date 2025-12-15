import { mockStore } from './mockAdapter';
import type { Message, FilterOptions } from '@/types';

export const messageService = {
    getAll: (filters?: FilterOptions) => mockStore.getAll<Message>('messages', filters),
    getById: (id: string) => mockStore.getById<Message>('messages', id),
    send: (data: Partial<Message>) => mockStore.create<Message>('messages', { ...data, isRead: false }),
    markAsRead: (id: string) => mockStore.update<Message>('messages', id, { isRead: true }),
    delete: (id: string) => mockStore.delete('messages', id),
    getUnreadCount: async () => {
        const result = await mockStore.getAll<Message>('messages');
        if (!result.success || !result.data) return 0;
        return result.data.data.filter(m => !m.isRead).length;
    }
};

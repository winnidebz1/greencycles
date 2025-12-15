import { apiClient } from './api';
import type { User, LoginCredentials, RegisterData } from '@/types';

export const authService = {
    async login(credentials: LoginCredentials) {
        // Mock API call for demo purposes
        return new Promise<{ success: boolean; data?: { user: User; token: string }; message?: string }>((resolve) => {
            setTimeout(() => {
                // Validate credentials for Greencycles
                if (credentials.email.toLowerCase() === 'greencycles@gmail.com' && credentials.password === 'Greencycles123') {
                    resolve({
                        success: true,
                        data: {
                            user: {
                                id: '1',
                                firstName: 'Greencycles',
                                lastName: 'Admin',
                                email: credentials.email,
                                role: 'admin',
                                avatar: 'https://ui-avatars.com/api/?name=Greencycles+Admin&background=22c55e&color=fff',
                                isActive: true,
                                createdAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString(),
                            },
                            token: 'mock-jwt-token-greencycles',
                        },
                    });
                } else if (credentials.email === 'admin@example.com' && credentials.password === 'password') {
                    // Keep old default valid for now just in case, or remove it?
                    // Changing username usually means "Change relevant credentials".
                    // I'll keep it as a fallback OR reject it to force the change.
                    // The user said "Change username and password TO...", implying REPLACEMENT.
                    // I will reject others.
                    resolve({
                        success: false,
                        message: 'Invalid credentials. Please use greencycles@gmail.com / Greencycles123',
                    });
                } else {
                    resolve({
                        success: false,
                        message: 'Invalid email or password',
                    });
                }
            }, 1000); // 1 second delay to simulate network request
        });
    },

    async register(data: RegisterData) {
        return apiClient.post<{ user: User; token: string }>('/auth/register', data);
    },

    async logout() {
        // Mock logout
        return new Promise<{ success: boolean }>((resolve) => {
            setTimeout(() => {
                resolve({ success: true });
            }, 500);
        });
    },

    async getCurrentUser() {
        return apiClient.get<User>('/auth/me');
    },

    async updateProfile(data: Partial<User>) {
        return apiClient.put<User>('/auth/profile', data);
    },

    async changePassword(currentPassword: string, newPassword: string) {
        return apiClient.post('/auth/change-password', { currentPassword, newPassword });
    },

    async forgotPassword(email: string) {
        return apiClient.post('/auth/forgot-password', { email });
    },

    async resetPassword(token: string, password: string) {
        return apiClient.post('/auth/reset-password', { token, password });
    },
};

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { ApiResponse } from '@/types';

class ApiClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: '/api',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.setupInterceptors();
    }

    private setupInterceptors() {
        // Request interceptor
        this.client.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                const authStorage = localStorage.getItem('auth-storage');
                if (authStorage) {
                    try {
                        const { state } = JSON.parse(authStorage);
                        if (state?.token) {
                            config.headers.Authorization = `Bearer ${state.token}`;
                        }
                    } catch (error) {
                        console.error('Error parsing auth storage:', error);
                    }
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor
        this.client.interceptors.response.use(
            (response) => response,
            (error: AxiosError<ApiResponse>) => {
                if (error.response?.status === 401) {
                    // Clear auth and redirect to login
                    localStorage.removeItem('auth-storage');
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );
    }

    async get<T = any>(url: string, params?: any): Promise<ApiResponse<T>> {
        const response = await this.client.get<ApiResponse<T>>(url, { params });
        return response.data;
    }

    async post<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
        const response = await this.client.post<ApiResponse<T>>(url, data);
        return response.data;
    }

    async put<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
        const response = await this.client.put<ApiResponse<T>>(url, data);
        return response.data;
    }

    async patch<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
        const response = await this.client.patch<ApiResponse<T>>(url, data);
        return response.data;
    }

    async delete<T = any>(url: string): Promise<ApiResponse<T>> {
        const response = await this.client.delete<ApiResponse<T>>(url);
        return response.data;
    }

    async upload<T = any>(url: string, formData: FormData): Promise<ApiResponse<T>> {
        const response = await this.client.post<ApiResponse<T>>(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
}

export const apiClient = new ApiClient();

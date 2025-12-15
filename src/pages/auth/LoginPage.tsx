import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LogIn } from 'lucide-react';
import { Button, Input, Alert } from '@/components/ui';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';
import { useSettings } from '@/contexts/SettingsContext';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuthStore();
    const { settings } = useSettings();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: 'greencycles@gmail.com',
            password: 'Greencycles123'
        }
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            setIsLoading(true);
            setError('');

            const response = await authService.login(data);

            if (response.success && response.data) {
                login(response.data.user, response.data.token);
                navigate('/dashboard');
            } else {
                setError(response.message || 'Login failed');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'An error occurred during login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8 flex flex-col items-center">
                    {settings.logoUrl && <img src={settings.logoUrl} alt="Logo" className="h-16 mb-4 rounded" />}
                    <h1 className="text-4xl font-bold text-gradient mb-2">{settings.orgName}</h1>
                    <p className="text-gray-600">Sign in to your account</p>
                </div>

                <div className="card">
                    <div className="card-body">
                        {error && (
                            <Alert type="error" message={error} onClose={() => setError('')} className="mb-6" />
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <Input
                                id="email"
                                label="Email Address"
                                type="email"
                                placeholder="you@example.com"
                                error={errors.email?.message}
                                {...register('email')}
                            />

                            <Input
                                id="password"
                                label="Password"
                                type="password"
                                placeholder="••••••••"
                                error={errors.password?.message}
                                {...register('password')}
                            />

                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" className="rounded border-gray-300" />
                                    <span className="text-sm text-gray-600">Remember me</span>
                                </label>
                                <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700">
                                    Forgot password?
                                </Link>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full"
                                isLoading={isLoading}
                                icon={<LogIn className="w-5 h-5" />}
                            >
                                Sign In
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Don't have an account?{' '}
                                <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                <p className="text-center text-sm text-gray-500 mt-8">
                    © {new Date().getFullYear()} {settings.orgName}. All rights reserved.
                </p>
            </div>
        </div>
    );
};

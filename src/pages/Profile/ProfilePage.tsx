import React from 'react';
import { useAuthStore } from '@/store/authStore';
import { useForm } from 'react-hook-form';
import { Card, CardBody, Button, Input, Alert } from '@/components/ui';
import { User } from 'lucide-react';

export const ProfilePage: React.FC = () => {
    const { user } = useAuthStore();
    const { register, handleSubmit } = useForm({
        defaultValues: {
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            email: user?.email || '',
        }
    });

    const onSubmit = (data: any) => {
        alert('Profile updated (Mock Only)');
        // In a real app, update store/backend
    };

    if (!user) return null;

    return (
        <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>

            <Card>
                <CardBody>
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                            <span className="text-3xl font-bold text-primary-700">{user.firstName[0]}{user.lastName[0]}</span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">{user.firstName} {user.lastName}</h2>
                        <p className="text-gray-500 capitalize">{user.role.replace('_', ' ')}</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="First Name" {...register('firstName')} />
                            <Input label="Last Name" {...register('lastName')} />
                        </div>
                        <Input label="Email" {...register('email')} disabled />

                        <div className="pt-4 border-t border-gray-100 flex justify-end">
                            <Button variant="primary" type="submit">Save Changes</Button>
                        </div>
                    </form>
                </CardBody>
            </Card>
        </div>
    );
};

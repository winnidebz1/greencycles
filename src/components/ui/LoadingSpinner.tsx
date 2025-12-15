import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', className = '' }) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    };

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <Loader2 className={`${sizeClasses[size]} animate-spin text-primary-600`} />
        </div>
    );
};

interface LoadingOverlayProps {
    message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message = 'Loading...' }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl p-8 shadow-strong flex flex-col items-center gap-4">
                <LoadingSpinner size="lg" />
                <p className="text-gray-700 font-medium">{message}</p>
            </div>
        </div>
    );
};

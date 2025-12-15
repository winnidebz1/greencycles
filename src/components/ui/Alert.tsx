import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';
import type { NotificationType } from '@/types';

interface AlertProps {
    type?: NotificationType;
    title?: string;
    message: string;
    onClose?: () => void;
    className?: string;
}

export const Alert: React.FC<AlertProps> = ({
    type = 'info',
    title,
    message,
    onClose,
    className = '',
}) => {
    const config = {
        info: {
            icon: Info,
            bgColor: 'bg-primary-50',
            borderColor: 'border-primary-200',
            iconColor: 'text-primary-600',
            textColor: 'text-primary-900',
        },
        success: {
            icon: CheckCircle,
            bgColor: 'bg-success-50',
            borderColor: 'border-success-200',
            iconColor: 'text-success-600',
            textColor: 'text-success-900',
        },
        warning: {
            icon: AlertCircle,
            bgColor: 'bg-warning-50',
            borderColor: 'border-warning-200',
            iconColor: 'text-warning-600',
            textColor: 'text-warning-900',
        },
        error: {
            icon: XCircle,
            bgColor: 'bg-danger-50',
            borderColor: 'border-danger-200',
            iconColor: 'text-danger-600',
            textColor: 'text-danger-900',
        },
    };

    const { icon: Icon, bgColor, borderColor, iconColor, textColor } = config[type];

    return (
        <div
            className={`${bgColor} ${borderColor} border rounded-lg p-4 flex items-start gap-3 ${className}`}
        >
            <Icon className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />
            <div className="flex-1">
                {title && <h4 className={`font-semibold ${textColor} mb-1`}>{title}</h4>}
                <p className={`text-sm ${textColor}`}>{message}</p>
            </div>
            {onClose && (
                <button
                    onClick={onClose}
                    className={`${iconColor} hover:opacity-70 transition-opacity flex-shrink-0`}
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
};

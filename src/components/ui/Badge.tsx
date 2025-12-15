import React from 'react';


interface BadgeProps {
    children: React.ReactNode;
    variant?: 'primary' | 'success' | 'warning' | 'danger' | 'gray';
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'gray', className = '' }) => {
    const variantClasses = {
        primary: 'badge-primary',
        success: 'badge-success',
        warning: 'badge-warning',
        danger: 'badge-danger',
        gray: 'badge-gray',
    };

    return <span className={`badge ${variantClasses[variant]} ${className}`}>{children}</span>;
};

// Status Badge Component
interface StatusBadgeProps {
    status: string;
    className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
    const getVariant = (status: string): 'primary' | 'success' | 'warning' | 'danger' | 'gray' => {
        const statusLower = status.toLowerCase();

        if (['active', 'completed', 'paid', 'approved', 'signed', 'present'].includes(statusLower)) {
            return 'success';
        }
        if (['pending', 'in_progress', 'sent', 'awaiting_client'].includes(statusLower)) {
            return 'warning';
        }
        if (['rejected', 'overdue', 'cancelled', 'expired', 'absent'].includes(statusLower)) {
            return 'danger';
        }
        if (['draft', 'new'].includes(statusLower)) {
            return 'primary';
        }
        return 'gray';
    };

    return (
        <Badge variant={getVariant(status)} className={className}>
            {status.replace(/_/g, ' ')}
        </Badge>
    );
};

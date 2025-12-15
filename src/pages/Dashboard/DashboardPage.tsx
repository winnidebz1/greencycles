import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Users,
    UserPlus,
    FolderKanban,
    Receipt,
    DollarSign,
    TrendingUp,
    Calendar,
    ArrowUp,
    ArrowDown,
} from 'lucide-react';
import { Card, CardHeader, CardBody, LoadingSpinner } from '@/components/ui';
import { useAuthStore } from '@/store/authStore';
import { useSettings } from '@/contexts/SettingsContext';
import type { DashboardStats } from '@/types';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, color }) => {
    return (
        <Card className="hover:shadow-medium transition-shadow duration-200">
            <CardBody>
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
                        {trend && (
                            <div className="flex items-center gap-1 mt-2">
                                {trend.isPositive ? (
                                    <ArrowUp className="w-4 h-4 text-success-600" />
                                ) : (
                                    <ArrowDown className="w-4 h-4 text-danger-600" />
                                )}
                                <span
                                    className={`text-sm font-medium ${trend.isPositive ? 'text-success-600' : 'text-danger-600'
                                        }`}
                                >
                                    {trend.value}%
                                </span>
                                <span className="text-sm text-gray-500">vs last month</span>
                            </div>
                        )}
                    </div>
                    <div className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center`}>
                        {icon}
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};

export const DashboardPage: React.FC = () => {
    const { user } = useAuthStore();
    const { settings } = useSettings();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const getCurrencySymbol = (code: string) => {
        if (code === 'GHS') return '₵';
        if (code === 'EUR') return '€';
        if (code === 'GBP') return '£';
        if (code === 'NGN') return '₦';
        return '$';
    };

    const currencySymbol = getCurrencySymbol(settings.currency);

    useEffect(() => {
        // Simulate API call - Replace with actual API call
        setTimeout(() => {
            setStats({
                totalClients: 156,
                activeProjects: 23,
                pendingInvoices: 12,
                newLeads: 34,
                totalRevenue: 245000,
                monthlyRevenue: 45000,
                employeeCount: 42,
                attendanceRate: 94.5,
            });
            setIsLoading(false);
        }, 1000);
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl p-8 text-white">
                <h1 className="text-3xl font-bold mb-2">
                    Welcome back, {user?.firstName}! 👋
                </h1>
                <p className="text-primary-100">
                    Here's what's happening with your business today.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Clients"
                    value={stats?.totalClients || 0}
                    icon={<Users className="w-7 h-7 text-primary-600" />}
                    trend={{ value: 12, isPositive: true }}
                    color="bg-primary-100"
                />
                <StatCard
                    title="Active Projects"
                    value={stats?.activeProjects || 0}
                    icon={<FolderKanban className="w-7 h-7 text-secondary-600" />}
                    trend={{ value: 8, isPositive: true }}
                    color="bg-secondary-100"
                />
                <StatCard
                    title="Pending Invoices"
                    value={stats?.pendingInvoices || 0}
                    icon={<Receipt className="w-7 h-7 text-warning-600" />}
                    trend={{ value: 5, isPositive: false }}
                    color="bg-warning-100"
                />
                <StatCard
                    title="New Leads"
                    value={stats?.newLeads || 0}
                    icon={<UserPlus className="w-7 h-7 text-success-600" />}
                    trend={{ value: 15, isPositive: true }}
                    color="bg-success-100"
                />
            </div>

            {/* Revenue & HR Stats */}
            {user?.role !== 'client' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Revenue"
                        value={`${currencySymbol}${(stats?.totalRevenue || 0).toLocaleString()}`}
                        icon={<DollarSign className="w-7 h-7 text-success-600" />}
                        trend={{ value: 18, isPositive: true }}
                        color="bg-success-100"
                    />
                    <StatCard
                        title="Monthly Revenue"
                        value={`${currencySymbol}${(stats?.monthlyRevenue || 0).toLocaleString()}`}
                        icon={<TrendingUp className="w-7 h-7 text-primary-600" />}
                        trend={{ value: 22, isPositive: true }}
                        color="bg-primary-100"
                    />
                    {(user?.role === 'super_admin' || user?.role === 'admin') && (
                        <>
                            <StatCard
                                title="Total Employees"
                                value={stats?.employeeCount || 0}
                                icon={<Users className="w-7 h-7 text-secondary-600" />}
                                color="bg-secondary-100"
                            />
                            <StatCard
                                title="Attendance Rate"
                                value={`${stats?.attendanceRate || 0}%`}
                                icon={<Calendar className="w-7 h-7 text-success-600" />}
                                trend={{ value: 2, isPositive: true }}
                                color="bg-success-100"
                            />
                        </>
                    )}
                </div>
            )}

            {/* Recent Activity & Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <h3 className="text-lg font-semibold">Recent Activity</h3>
                    </CardHeader>
                    <CardBody>
                        <div className="space-y-4">
                            {[
                                { action: 'New client added', time: '2 hours ago', type: 'success' },
                                { action: 'Invoice #1234 paid', time: '4 hours ago', type: 'success' },
                                { action: 'Project milestone completed', time: '1 day ago', type: 'info' },
                                { action: 'New lead from website', time: '2 days ago', type: 'warning' },
                            ].map((activity, index) => (
                                <div key={index} className="flex items-center gap-3 pb-3 border-b border-gray-100 last:border-0">
                                    <div className={`w-2 h-2 rounded-full ${activity.type === 'success' ? 'bg-success-500' :
                                        activity.type === 'warning' ? 'bg-warning-500' :
                                            'bg-primary-500'
                                        }`}></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                                        <p className="text-xs text-gray-500">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader>
                        <h3 className="text-lg font-semibold">Quick Actions</h3>
                    </CardHeader>
                    <CardBody>
                        <div className="grid grid-cols-2 gap-4">
                            <Link to="/crm/clients" className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 text-left">
                                <Users className="w-6 h-6 text-primary-600 mb-2" />
                                <p className="font-medium text-gray-900">Add Client</p>
                            </Link>
                            <Link to="/crm/invoices" className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 text-left">
                                <Receipt className="w-6 h-6 text-primary-600 mb-2" />
                                <p className="font-medium text-gray-900">Create Invoice</p>
                            </Link>
                            <Link to="/projects" className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 text-left">
                                <FolderKanban className="w-6 h-6 text-primary-600 mb-2" />
                                <p className="font-medium text-gray-900">New Project</p>
                            </Link>
                            <Link to="/crm/leads" className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 text-left">
                                <UserPlus className="w-6 h-6 text-primary-600 mb-2" />
                                <p className="font-medium text-gray-900">Add Lead</p>
                            </Link>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

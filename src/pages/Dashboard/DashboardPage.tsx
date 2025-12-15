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
            <CardBody className="p-3 sm:p-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-gray-600 mb-0.5 sm:mb-1 truncate">{title}</p>
                        <h3 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">{value}</h3>
                        {trend && (
                            <div className="flex items-center gap-1 mt-1 sm:mt-2">
                                {trend.isPositive ? (
                                    <ArrowUp className="w-3 h-3 text-success-600" />
                                ) : (
                                    <ArrowDown className="w-3 h-3 text-danger-600" />
                                )}
                                <span
                                    className={`text-[10px] sm:text-xs font-medium ${trend.isPositive ? 'text-success-600' : 'text-danger-600'
                                        }`}
                                >
                                    {trend.value}%
                                </span>
                                <span className="text-[10px] sm:text-xs text-gray-500 hidden sm:inline">vs last month</span>
                            </div>
                        )}
                    </div>
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${color} flex items-center justify-center shrink-0 ml-2 sm:ml-4`}>
                        {React.cloneElement(icon as React.ReactElement, { className: 'w-4 h-4 sm:w-5 sm:h-5' })}
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
        if (code === 'GHS') return 'GHS ';
        if (code === 'EUR') return 'EUR ';
        if (code === 'GBP') return 'GBP ';
        if (code === 'NGN') return 'NGN ';
        return 'GHS '; // Default to GHS as requested
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
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl p-4 sm:p-8 text-white">
                <h1 className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2">
                    Welcome back, {user?.firstName}! 👋
                </h1>
                <p className="text-sm sm:text-base text-primary-100">
                    Here's what's happening with your business today.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                <StatCard
                    title="Total Clients"
                    value={stats?.totalClients || 0}
                    icon={<Users />}
                    trend={{ value: 12, isPositive: true }}
                    color="bg-primary-100 text-primary-600"
                />
                <StatCard
                    title="Active Projects"
                    value={stats?.activeProjects || 0}
                    icon={<FolderKanban />}
                    trend={{ value: 8, isPositive: true }}
                    color="bg-secondary-100 text-secondary-600"
                />
                <StatCard
                    title="Pending Invoices"
                    value={stats?.pendingInvoices || 0}
                    icon={<Receipt />}
                    trend={{ value: 5, isPositive: false }}
                    color="bg-warning-100 text-warning-600"
                />
                <StatCard
                    title="New Leads"
                    value={stats?.newLeads || 0}
                    icon={<UserPlus />}
                    trend={{ value: 15, isPositive: true }}
                    color="bg-success-100 text-success-600"
                />
            </div>

            {/* Revenue & HR Stats */}
            {user?.role !== 'client' && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                    <StatCard
                        title="Total Revenue"
                        value={`${currencySymbol}${(stats?.totalRevenue || 0).toLocaleString()}`}
                        icon={<DollarSign />}
                        trend={{ value: 18, isPositive: true }}
                        color="bg-success-100 text-success-600"
                    />
                    <StatCard
                        title="Monthly Revenue"
                        value={`${currencySymbol}${(stats?.monthlyRevenue || 0).toLocaleString()}`}
                        icon={<TrendingUp />}
                        trend={{ value: 22, isPositive: true }}
                        color="bg-primary-100 text-primary-600"
                    />
                    {(user?.role === 'super_admin' || user?.role === 'admin') && (
                        <>
                            <StatCard
                                title="Total Employees"
                                value={stats?.employeeCount || 0}
                                icon={<Users />}
                                color="bg-secondary-100 text-secondary-600"
                            />
                            <StatCard
                                title="Attendance Rate"
                                value={`${stats?.attendanceRate || 0}%`}
                                icon={<Calendar />}
                                trend={{ value: 2, isPositive: true }}
                                color="bg-success-100 text-success-600"
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
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            <Link to="/crm/clients" className="p-3 sm:p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 text-left group">
                                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600 mb-1 sm:mb-2 group-hover:scale-110 transition-transform" />
                                <p className="font-medium text-gray-900 text-xs sm:text-base">Add Client</p>
                            </Link>
                            <Link to="/crm/invoices" className="p-3 sm:p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 text-left group">
                                <Receipt className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600 mb-1 sm:mb-2 group-hover:scale-110 transition-transform" />
                                <p className="font-medium text-gray-900 text-xs sm:text-base">Create Invoice</p>
                            </Link>
                            <Link to="/projects" className="p-3 sm:p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 text-left group">
                                <FolderKanban className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600 mb-1 sm:mb-2 group-hover:scale-110 transition-transform" />
                                <p className="font-medium text-gray-900 text-xs sm:text-base">New Project</p>
                            </Link>
                            <Link to="/crm/leads" className="p-3 sm:p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 text-left group">
                                <UserPlus className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600 mb-1 sm:mb-2 group-hover:scale-110 transition-transform" />
                                <p className="font-medium text-gray-900 text-xs sm:text-base">Add Lead</p>
                            </Link>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Users,
    UserPlus,
    FolderKanban,
    Receipt,
import {
        Users,
        UserPlus,
        FolderKanban,
        Receipt,
        Banknote,
        TrendingUp,
        Calendar,
        ArrowUp,
        ArrowDown,
    } from 'lucide-react';

// ... (StatCard component definition)

                        <p className="text-xs sm:text-sm font-medium text-gray-600 mb-0.5 sm:mb-1 truncate">{title}</p>
                        <h3 className="text-lg sm:text-2xl font-bold text-gray-900 break-words">{value}</h3>
{
    trend && (
        // ... (rest of StatCard)

        // ... (DashboardPage definition)

        {/* Revenue & HR Stats */ }
            {
        user?.role !== 'client' && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                <StatCard
                    title="Total Revenue"
                    value={`${currencySymbol}${(stats?.totalRevenue || 0).toLocaleString()}`}
                    icon={<Banknote />}
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
        )
    }

    {/* Recent Activity & Charts */ }
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
        </div >
    );
};

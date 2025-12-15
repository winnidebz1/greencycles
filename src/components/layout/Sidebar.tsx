import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    UserPlus,
    FileText,
    Receipt,
    CreditCard,
    FileSignature,
    Ticket,
    Briefcase,
    UserCircle,
    Calendar,
    DollarSign,
    TrendingUp,
    CalendarDays,
    FolderKanban,
    MessageSquare,
    FileUp,
    ChevronLeft,
    ChevronRight,
    LogOut,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useSettings } from '@/contexts/SettingsContext';

interface MenuItem {
    title: string;
    icon: React.ReactNode;
    path: string;
    roles?: string[];
    children?: MenuItem[];
}

const menuItems: MenuItem[] = [
    {
        title: 'Dashboard',
        icon: <LayoutDashboard className="w-5 h-5" />,
        path: '/dashboard',
    },
    {
        title: 'CRM',
        icon: <Users className="w-5 h-5" />,
        path: '/crm',
        children: [
            { title: 'Clients', icon: <Users className="w-4 h-4" />, path: '/crm/clients' },
            { title: 'Leads', icon: <UserPlus className="w-4 h-4" />, path: '/crm/leads' },
            { title: 'Proposals', icon: <FileText className="w-4 h-4" />, path: '/crm/proposals' },
            { title: 'Invoices', icon: <Receipt className="w-4 h-4" />, path: '/crm/invoices' },
            { title: 'Payments', icon: <CreditCard className="w-4 h-4" />, path: '/crm/payments' },
            { title: 'Contracts', icon: <FileSignature className="w-4 h-4" />, path: '/crm/contracts' },
            { title: 'Tickets', icon: <Ticket className="w-4 h-4" />, path: '/crm/tickets' },
        ],
    },
    {
        title: 'HRM',
        icon: <Briefcase className="w-5 h-5" />,
        path: '/hrm',
        children: [
            { title: 'Employees', icon: <UserCircle className="w-4 h-4" />, path: '/hrm/employees' },
            { title: 'Attendance', icon: <Calendar className="w-4 h-4" />, path: '/hrm/attendance' },
            { title: 'Leave Requests', icon: <CalendarDays className="w-4 h-4" />, path: '/hrm/leaves' },
            { title: 'Payroll', icon: <DollarSign className="w-4 h-4" />, path: '/hrm/payroll' },
            { title: 'Performance', icon: <TrendingUp className="w-4 h-4" />, path: '/hrm/performance' },
            { title: 'Holidays', icon: <CalendarDays className="w-4 h-4" />, path: '/hrm/holidays' },
        ],
    },
    {
        title: 'Projects',
        icon: <FolderKanban className="w-5 h-5" />,
        path: '/projects',
    },
    {
        title: 'Messages',
        icon: <MessageSquare className="w-5 h-5" />,
        path: '/messages',
    },
    {
        title: 'Files',
        icon: <FileUp className="w-5 h-5" />,
        path: '/files',
    },
];

interface SidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
    const location = useLocation();
    const { user, logout } = useAuthStore();
    const { settings } = useSettings();
    const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

    const handleLogout = () => {
        logout();
        window.location.href = '/login';
    };

    const toggleMenu = (path: string) => {
        setExpandedMenus((prev) =>
            prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
        );
    };

    const hasAccess = (item: MenuItem) => {
        if (!item.roles) return true;
        return user && item.roles.includes(user.role);
    };

    const isActive = (path: string) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    return (
        <aside
            className={`sidebar ${isCollapsed ? 'sidebar-collapsed' : ''} bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col h-screen fixed left-0 top-0 z-30`}
        >
            <div className="h-full flex flex-col">
                {/* Logo */}
                <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
                    {!isCollapsed && (
                        <div className="flex items-center gap-2">
                            {settings.logoUrl && <img src={settings.logoUrl} alt="Logo" className="w-8 h-8 rounded" />}
                            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent truncate max-w-[180px]" title={settings.orgName}>
                                {settings.orgName}
                            </h1>
                        </div>
                    )}
                    <button
                        onClick={onToggle}
                        className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 lg:block hidden"
                    >
                        {isCollapsed ? (
                            <ChevronRight className="w-5 h-5" />
                        ) : (
                            <ChevronLeft className="w-5 h-5" />
                        )}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4 scrollbar-hide">
                    <ul className="space-y-1 px-3">
                        {menuItems.map((item) => {
                            if (!hasAccess(item)) return null;

                            const hasChildren = item.children && item.children.length > 0;
                            const isExpanded = expandedMenus.includes(item.path);
                            const active = isActive(item.path);

                            return (
                                <li key={item.path}>
                                    {hasChildren ? (
                                        <>
                                            <button
                                                onClick={() => toggleMenu(item.path)}
                                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${active
                                                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/50'
                                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                                    }`}
                                            >
                                                <span className={`${active ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>{item.icon}</span>
                                                {!isCollapsed && (
                                                    <>
                                                        <span className="flex-1 text-left font-medium">{item.title}</span>
                                                        <ChevronRight
                                                            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''
                                                                }`}
                                                        />
                                                    </>
                                                )}
                                            </button>
                                            {!isCollapsed && isExpanded && (
                                                <ul className="mt-1 ml-4 space-y-1 border-l border-slate-700 pl-2">
                                                    {item.children?.map((child) => (
                                                        <li key={child.path}>
                                                            <Link
                                                                to={child.path}
                                                                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${isActive(child.path)
                                                                    ? 'text-white bg-slate-800 font-semibold'
                                                                    : 'text-slate-500 hover:text-white hover:bg-slate-800/50'
                                                                    }`}
                                                            >
                                                                {/* {child.icon} */}
                                                                <span className="text-sm font-medium">{child.title}</span>
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </>
                                    ) : (
                                        <Link
                                            to={item.path}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${active
                                                ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/50'
                                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                                }`}
                                        >
                                            <span className={`${active ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>{item.icon}</span>
                                            {!isCollapsed && <span className="font-medium">{item.title}</span>}
                                        </Link>
                                    )}
                                </li>
                            );
                        })}
                        <li className="mt-auto pt-4 border-t border-slate-800">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group text-slate-400 hover:text-red-400 hover:bg-slate-800"
                            >
                                <LogOut className="w-5 h-5 group-hover:text-red-400" />
                                {!isCollapsed && <span className="font-medium">Logout</span>}
                            </button>
                        </li>
                    </ul>
                </nav>

                {/* User Info */}
                {!isCollapsed && user && (
                    <div className="px-6 py-4 border-t border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center border-2 border-slate-600">
                                <span className="text-white font-semibold">
                                    {user.firstName[0]}
                                    {user.lastName[0]}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-white truncate">
                                    {user.firstName} {user.lastName}
                                </p>
                                <p className="text-sm text-slate-500 truncate capitalize">{user.role.replace('_', ' ')}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
};

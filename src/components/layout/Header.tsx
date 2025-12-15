import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, Menu, LogOut, Settings, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import { format } from 'date-fns';

interface HeaderProps {
    onMenuToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
    const { user, logout } = useAuthStore();
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        window.location.href = '/login';
    };

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
            <div className="px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                    {/* Left Section */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onMenuToggle}
                            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        {/* Search Bar */}
                        <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2 w-96">
                            <Search className="w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="bg-transparent border-none outline-none flex-1 text-gray-700 placeholder-gray-400"
                            />
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-4">
                        {/* Notifications */}
                        <div className="relative" ref={notificationRef}>
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <Bell className="w-6 h-6 text-gray-700" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1 right-1 w-5 h-5 bg-danger-500 text-white text-xs rounded-full flex items-center justify-center">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* Notifications Dropdown */}
                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-strong border border-gray-200 overflow-hidden animate-scale-in">
                                    <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                                        {unreadCount > 0 && (
                                            <button
                                                onClick={markAllAsRead}
                                                className="text-sm text-primary-600 hover:text-primary-700"
                                            >
                                                Mark all as read
                                            </button>
                                        )}
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {notifications.length === 0 ? (
                                            <div className="px-4 py-8 text-center text-gray-500">
                                                No notifications
                                            </div>
                                        ) : (
                                            notifications.slice(0, 10).map((notification) => (
                                                <div
                                                    key={notification.id}
                                                    onClick={() => {
                                                        markAsRead(notification.id);
                                                        if (notification.link) {
                                                            window.location.href = notification.link;
                                                        }
                                                    }}
                                                    className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.isRead ? 'bg-primary-50' : ''
                                                        }`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="flex-1">
                                                            <p className="font-medium text-gray-900 text-sm">
                                                                {notification.title}
                                                            </p>
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                {notification.message}
                                                            </p>
                                                            <p className="text-xs text-gray-400 mt-1">
                                                                {format(new Date(notification.createdAt), 'MMM d, h:mm a')}
                                                            </p>
                                                        </div>
                                                        {!notification.isRead && (
                                                            <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    {notifications.length > 10 && (
                                        <div className="px-4 py-3 border-t border-gray-200 text-center">
                                            <Link
                                                to="/notifications"
                                                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                                            >
                                                View all notifications
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* User Menu */}
                        <div className="relative" ref={userMenuRef}>
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                                    <span className="text-primary-700 font-semibold text-sm">
                                        {user?.firstName[0]}
                                        {user?.lastName[0]}
                                    </span>
                                </div>
                                <div className="hidden sm:block text-left">
                                    <p className="text-sm font-medium text-gray-900">
                                        {user?.firstName} {user?.lastName}
                                    </p>
                                    <p className="text-xs text-gray-500 capitalize">
                                        {user?.role.replace('_', ' ')}
                                    </p>
                                </div>
                            </button>

                            {/* User Dropdown */}
                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-strong border border-gray-200 overflow-hidden animate-scale-in">
                                    <div className="px-4 py-3 border-b border-gray-200">
                                        <p className="font-medium text-gray-900">
                                            {user?.firstName} {user?.lastName}
                                        </p>
                                        <p className="text-sm text-gray-500">{user?.email}</p>
                                    </div>
                                    <div className="py-2">
                                        <Link
                                            to="/profile"
                                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                                        >
                                            <User className="w-4 h-4 text-gray-500" />
                                            <span className="text-sm text-gray-700">Profile</span>
                                        </Link>
                                        <Link
                                            to="/settings"
                                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                                        >
                                            <Settings className="w-4 h-4 text-gray-500" />
                                            <span className="text-sm text-gray-700">Settings</span>
                                        </Link>
                                    </div>
                                    <div className="border-t border-gray-200 py-2">
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors w-full text-left"
                                        >
                                            <LogOut className="w-4 h-4 text-gray-500" />
                                            <span className="text-sm text-gray-700">Logout</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

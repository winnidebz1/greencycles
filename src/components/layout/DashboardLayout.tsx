import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const DashboardLayout: React.FC = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    const toggleMobileSidebar = () => {
        setIsMobileSidebarOpen(!isMobileSidebarOpen);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Sidebar Overlay */}
            {isMobileSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={(e) => {
                        // Only close if clicking the overlay itself, not its children
                        if (e.target === e.currentTarget) {
                            toggleMobileSidebar();
                        }
                    }}
                />
            )}

            {/* Sidebar */}
            <div
                className={`${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300`}
                onClick={(e) => e.stopPropagation()}
            >
                <Sidebar
                    isCollapsed={isSidebarCollapsed}
                    onToggle={toggleSidebar}
                    onMobileClose={() => setIsMobileSidebarOpen(false)}
                />
            </div>

            {/* Main Content */}
            <div
                className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
                    }`}
            >
                <Header onMenuToggle={toggleMobileSidebar} />
                <main className="p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

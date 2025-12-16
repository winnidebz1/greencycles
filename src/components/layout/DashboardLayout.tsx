import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const DashboardLayout: React.FC = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const location = useLocation();

    // Close mobile sidebar when route changes
    useEffect(() => {
        console.log('DashboardLayout: Route changed, closing mobile sidebar');
        setIsMobileSidebarOpen(false);
    }, [location.pathname]);

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    const toggleMobileSidebar = () => {
        setIsMobileSidebarOpen(!isMobileSidebarOpen);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div
                className={`fixed left-0 top-0 h-full ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 z-50`}
            >
                <Sidebar
                    isCollapsed={isSidebarCollapsed}
                    onToggle={toggleSidebar}
                    onClose={toggleMobileSidebar}
                />
            </div>

            {/* Mobile Sidebar Overlay - only covers the main content area, not the sidebar */}
            {isMobileSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={toggleMobileSidebar}
                    style={{ left: '256px' }} // Don't cover the sidebar (256px = w-64)
                />
            )}

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

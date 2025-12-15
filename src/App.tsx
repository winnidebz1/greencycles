import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout';
import { LoginPage } from '@/pages/auth/LoginPage';
import { DashboardPage } from '@/pages/Dashboard/DashboardPage';
import { ClientsPage } from '@/pages/CRM/ClientsPage';
import { LeadsPage } from '@/pages/CRM/LeadsPage';
import { InvoicesPage } from '@/pages/CRM/InvoicesPage';
import { ProposalsPage } from '@/pages/CRM/ProposalsPage';
import { PaymentsPage } from '@/pages/CRM/PaymentsPage';
import { ContractsPage } from '@/pages/CRM/ContractsPage';
import { TicketsPage } from '@/pages/CRM/TicketsPage';
import { EmployeesPage } from '@/pages/HRM/EmployeesPage';
import { AttendancePage } from '@/pages/HRM/AttendancePage';
import { LeavesPage } from '@/pages/HRM/LeavesPage';
import { PayrollPage } from '@/pages/HRM/PayrollPage';
import { PerformancePage } from '@/pages/HRM/PerformancePage';
import { HolidaysPage } from '@/pages/HRM/HolidaysPage';
import { ProjectsPage } from '@/pages/Projects/ProjectsPage';
import { MessagesPage } from '@/pages/Messages/MessagesPage';
import { FilesPage } from '@/pages/Files/FilesPage';
import { ProfilePage } from '@/pages/Profile/ProfilePage';
import { SettingsPage } from '@/pages/Settings/SettingsPage';
import { useAuthStore } from '@/store/authStore';

// Protected Route Component
interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated } = useAuthStore();

    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return <>{children}</>;
};

// Public Route Component
interface PublicRouteProps {
    children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
    const { isAuthenticated } = useAuthStore();

    if (isAuthenticated) return <Navigate to="/dashboard" replace />;
    return <>{children}</>;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />

                <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<DashboardPage />} />

                    <Route path="crm/clients" element={<ClientsPage />} />
                    <Route path="crm/leads" element={<LeadsPage />} />
                    <Route path="crm/proposals" element={<ProposalsPage />} />
                    <Route path="crm/invoices" element={<InvoicesPage />} />
                    <Route path="crm/payments" element={<PaymentsPage />} />
                    <Route path="crm/contracts" element={<ContractsPage />} />
                    <Route path="crm/tickets" element={<TicketsPage />} />

                    <Route path="hrm/employees" element={<EmployeesPage />} />
                    <Route path="hrm/attendance" element={<AttendancePage />} />
                    <Route path="hrm/leaves" element={<LeavesPage />} />
                    <Route path="hrm/payroll" element={<PayrollPage />} />
                    <Route path="hrm/performance" element={<PerformancePage />} />
                    <Route path="hrm/holidays" element={<HolidaysPage />} />

                    <Route path="projects" element={<ProjectsPage />} />
                    <Route path="messages" element={<MessagesPage />} />
                    <Route path="files" element={<FilesPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="settings" element={<SettingsPage />} />
                </Route>

                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

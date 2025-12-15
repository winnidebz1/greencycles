// User & Authentication Types
export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    avatar?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export type UserRole = 'super_admin' | 'admin' | 'staff' | 'client';

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: UserRole;
}

// Client Types
export interface Client {
    id: string;
    companyName?: string;
    contactPerson: string;
    email: string;
    phone: string;
    location: string;
    notes?: string;
    status: 'active' | 'inactive' | 'archived' | 'prospective';
    createdAt: string;
    updatedAt: string;
}

// Lead Types
export interface Lead {
    id: string;
    name: string;
    email: string;
    phone: string;
    company?: string;
    source: LeadSource;
    status: LeadStatus;
    assignedTo?: string;
    value?: number;
    currency?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export type LeadSource = 'website' | 'whatsapp' | 'email' | 'referral' | 'social_media' | 'other';
export type LeadStatus = 'new' | 'contacted' | 'proposal_sent' | 'negotiation' | 'converted' | 'lost';

// Proposal Types
export interface Proposal {
    id: string;
    clientId: string;
    title: string;
    description: string;
    items: ProposalItem[];
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    status: ProposalStatus;
    currency: string;
    validUntil: string;
    createdAt: string;
    updatedAt: string;
}

export interface ProposalItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

export type ProposalStatus = 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected';

// Invoice Types
export interface Invoice {
    id: string;
    invoiceNumber: string;
    clientId: string;
    items: InvoiceItem[];
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    status: InvoiceStatus;
    dueDate: string;
    paidDate?: string;
    currency: string;
    createdAt: string;
    updatedAt: string;
}

export interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

// Payment Types
export interface Payment {
    id: string;
    invoiceId: string;
    amount: number;
    currency: string;
    method: PaymentMethod;
    reference?: string;
    notes?: string;
    paidAt: string;
    createdAt: string;
}

export type PaymentMethod = 'cash' | 'bank_transfer' | 'card' | 'mobile_money' | 'other';

// Contract Types
export interface Contract {
    id: string;
    clientId: string;
    title: string;
    description?: string;
    fileUrl: string;
    status: ContractStatus;
    signedDate?: string;
    expiryDate?: string;
    createdAt: string;
    updatedAt: string;
}

export type ContractStatus = 'draft' | 'sent' | 'signed' | 'expired';

// Ticket Types
export interface Ticket {
    id: string;
    clientId: string;
    subject: string;
    category: TicketCategory;
    priority: TicketPriority;
    status: TicketStatus;
    assignedTo?: string;
    createdAt: string;
    updatedAt: string;
}

export interface TicketResponse {
    id: string;
    ticketId: string;
    userId: string;
    message: string;
    isInternal: boolean;
    createdAt: string;
}

export type TicketCategory = 'billing' | 'technical' | 'general' | 'support';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketStatus = 'open' | 'in_progress' | 'awaiting_client' | 'closed';

// Employee Types
export interface Employee {
    id: string;
    userId: string;
    employeeId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    department: string;
    position: string;
    salary: number;
    currency: string;
    employmentStatus: EmploymentStatus;
    hireDate: string;
    createdAt: string;
    updatedAt: string;
}

export type EmploymentStatus = 'active' | 'on_leave' | 'suspended' | 'terminated' | 'inactive';

// Attendance Types
export interface Attendance {
    id: string;
    employeeId: string;
    date: string;
    timeIn?: string;
    timeOut?: string;
    status: AttendanceStatus;
    notes?: string;
    createdAt: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'half_day' | 'on_leave';

// Leave Types
export interface LeaveRequest {
    id: string;
    employeeId: string;
    leaveType: LeaveType;
    startDate: string;
    endDate: string;
    days: number;
    reason: string;
    status: LeaveStatus;
    approvedBy?: string;
    approvedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export type LeaveType = 'annual' | 'sick' | 'emergency' | 'unpaid' | 'maternity' | 'paternity';
export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface LeaveBalance {
    id: string;
    employeeId: string;
    leaveType: LeaveType;
    total: number;
    used: number;
    remaining: number;
    year: number;
}

// Payroll Types
export interface Payroll {
    id: string;
    employeeId: string;
    month: string;
    year: number;
    basicSalary: number;
    allowances: number;
    deductions: number;
    netSalary: number;
    currency: string;
    status: PayrollStatus;
    paidDate?: string;
    createdAt: string;
    updatedAt: string;
}

export type PayrollStatus = 'pending' | 'approved' | 'paid';

export interface Payslip {
    id: string;
    payrollId: string;
    fileUrl: string;
    createdAt: string;
}

// Performance Types
export interface PerformanceReview {
    id: string;
    employeeId: string;
    reviewerId: string;
    period: string;
    rating: number;
    strengths: string;
    improvements: string;
    goals: string;
    comments?: string;
    createdAt: string;
    updatedAt: string;
}

export interface KPI {
    id: string;
    employeeId: string;
    title: string;
    description: string;
    target: number;
    current: number;
    unit: string;
    period: string;
    createdAt: string;
    updatedAt: string;
}

// Holiday Types
export interface Holiday {
    id: string;
    title: string;
    date: string;
    description?: string;
    isRecurring: boolean;
    createdAt: string;
}

// Project Types
export interface Project {
    id: string;
    clientId: string;
    name: string;
    description: string;
    status: ProjectStatus;
    startDate: string;
    endDate?: string;
    budget: number;
    currency: string;
    progress: number;
    createdAt: string;
    updatedAt: string;
}

export type ProjectStatus = 'planning' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';

export interface ProjectMember {
    id: string;
    projectId: string;
    userId: string;
    role: string;
    addedAt: string;
}

export interface Task {
    id: string;
    projectId: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    assignedTo?: string;
    dueDate?: string;
    createdAt: string;
    updatedAt: string;
}

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

// Message Types
export interface Message {
    id: string;
    senderId: string;
    subject: string;
    body: string;
    isRead: boolean;
    createdAt: string;
}

export interface MessageParticipant {
    id: string;
    messageId: string;
    userId: string;
    isRead: boolean;
    readAt?: string;
}

// File Types
export interface File {
    id: string;
    name: string;
    type: string;
    size: number;
    url: string;
    uploadedBy: string;
    relatedTo?: {
        type: 'client' | 'project' | 'ticket' | 'employee';
        id: string;
    };
    createdAt: string;
}

// Notification Types
export interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
    isRead: boolean;
    link?: string;
    createdAt: string;
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

// Activity Log Types
export interface ActivityLog {
    id: string;
    userId: string;
    action: string;
    entity: string;
    entityId: string;
    changes?: Record<string, any>;
    ipAddress?: string;
    createdAt: string;
}

// Dashboard Types
export interface DashboardStats {
    totalClients: number;
    activeProjects: number;
    pendingInvoices: number;
    newLeads: number;
    totalRevenue: number;
    monthlyRevenue: number;
    employeeCount: number;
    attendanceRate: number;
}

export interface ChartData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor?: string | string[];
        borderColor?: string | string[];
    }[];
}

// API Response Types
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T = any> {
    success: boolean;
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// Filter & Sort Types
export interface FilterOptions {
    search?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    [key: string]: any;
}

export interface SortOptions {
    field: string;
    order: 'asc' | 'desc';
}

export interface PaginationOptions {
    page: number;
    limit: number;
}

export interface OrganizationSettings {
    id: string;
    orgName: string;
    logoUrl?: string;
    primaryColor: string;
    currency: string;
}

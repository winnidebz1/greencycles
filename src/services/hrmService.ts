import { mockStore } from './mockAdapter';
import type {
    Employee,
    Attendance,
    LeaveRequest,
    Payroll,
    Payslip,
    PerformanceReview,
    KPI,
    Holiday,
    FilterOptions
} from '@/types';

export const hrmService = {
    // Employees
    employees: {
        getAll: (filters?: FilterOptions) => mockStore.getAll<Employee>('employees', filters),
        getById: (id: string) => mockStore.getById<Employee>('employees', id),
        create: (data: Partial<Employee>) => mockStore.create<Employee>('employees', data),
        update: (id: string, data: Partial<Employee>) => mockStore.update<Employee>('employees', id, data),
        delete: (id: string) => mockStore.delete('employees', id),
        activate: (id: string) => mockStore.update<Employee>('employees', id, { isActive: true }),
        deactivate: (id: string) => mockStore.update<Employee>('employees', id, { isActive: false }),
    },

    // Attendance
    attendance: {
        getAll: (filters?: FilterOptions) => mockStore.getAll<Attendance>('attendance', filters),
        getById: (id: string) => mockStore.getById<Attendance>('attendance', id),
        create: (data: Partial<Attendance>) => mockStore.create<Attendance>('attendance', data),
        update: (id: string, data: Partial<Attendance>) => mockStore.update<Attendance>('attendance', id, data),
        delete: (id: string) => mockStore.delete('attendance', id),
        getByEmployee: (_employeeId: string, _filters?: FilterOptions) => Promise.resolve({ success: true, data: [] }),
        getReport: (_filters?: FilterOptions) => Promise.resolve({ success: true, data: [] }),
        mark: (data: any) => Promise.resolve({ success: true, data }),
    },

    // Leave Management
    leaves: {
        getAll: (filters?: FilterOptions) => mockStore.getAll<LeaveRequest>('leaves', filters),
        getById: (id: string) => mockStore.getById<LeaveRequest>('leaves', id),
        create: (data: Partial<LeaveRequest>) => mockStore.create<LeaveRequest>('leaves', data),
        update: (id: string, data: Partial<LeaveRequest>) => mockStore.update<LeaveRequest>('leaves', id, data),
        delete: (id: string) => mockStore.delete('leaves', id),
        approve: (id: string) => mockStore.update<LeaveRequest>('leaves', id, { status: 'approved' }),
        reject: (id: string, reason?: string) => mockStore.update<LeaveRequest>('leaves', id, { status: 'rejected', rejectionReason: reason }),
        cancel: (id: string) => mockStore.update<LeaveRequest>('leaves', id, { status: 'cancelled' }),
        request: (data: Partial<LeaveRequest>) => mockStore.create<LeaveRequest>('leaves', data),
        getBalance: (_employeeId: string) => Promise.resolve({ success: true, data: [] }),
    },

    // Payroll
    payroll: {
        getAll: (filters?: FilterOptions) => mockStore.getAll<Payroll>('payroll', filters),
        getById: (id: string) => mockStore.getById<Payroll>('payroll', id),
        create: (data: Partial<Payroll>) => mockStore.create<Payroll>('payroll', data),
        update: (id: string, data: Partial<Payroll>) => mockStore.update<Payroll>('payroll', id, data),
        delete: (id: string) => mockStore.delete('payroll', id),
        approve: (id: string) => mockStore.update<Payroll>('payroll', id, { status: 'approved' }),
        generate: (_data: any) => Promise.resolve({ success: true, data: {} }), // Stub for generate
        markAsPaid: (id: string) => mockStore.update<Payroll>('payroll', id, { status: 'paid', paidDate: new Date().toISOString() }),
        generatePayslip: (_id: string) => Promise.resolve({ success: true, data: {} as Payslip }),
        downloadPayslip: (_id: string) => Promise.resolve({ success: true, data: 'payslip_url' }),
    },

    // Performance
    performance: {
        getAll: (filters?: FilterOptions) => mockStore.getAll<PerformanceReview>('performance', filters),
        getById: (id: string) => mockStore.getById<PerformanceReview>('performance', id),
        create: (data: Partial<PerformanceReview>) => mockStore.create<PerformanceReview>('performance', data),
        update: (id: string, data: Partial<PerformanceReview>) => mockStore.update<PerformanceReview>('performance', id, data),
        delete: (id: string) => mockStore.delete('performance', id),
        getReviews: (filters?: FilterOptions) => mockStore.getAll<PerformanceReview>('performance', filters),
        addReview: (data: Partial<PerformanceReview>) => mockStore.create<PerformanceReview>('performance', data),
        getByEmployee: (_employeeId: string) => Promise.resolve({ success: true, data: [] }),
    },

    // KPIs
    kpis: {
        getAll: (filters?: FilterOptions) => mockStore.getAll<KPI>('kpis', filters),
        getById: (id: string) => mockStore.getById<KPI>('kpis', id),
        create: (data: Partial<KPI>) => mockStore.create<KPI>('kpis', data),
        update: (id: string, data: Partial<KPI>) => mockStore.update<KPI>('kpis', id, data),
        delete: (id: string) => mockStore.delete('kpis', id),
        getByEmployee: (_employeeId: string) => Promise.resolve({ success: true, data: [] }),
    },

    // Holidays
    holidays: {
        getAll: (filters?: FilterOptions) => mockStore.getAll<Holiday>('holidays', filters),
        getById: (id: string) => mockStore.getById<Holiday>('holidays', id),
        create: (data: Partial<Holiday>) => mockStore.create<Holiday>('holidays', data),
        update: (id: string, data: Partial<Holiday>) => mockStore.update<Holiday>('holidays', id, data),
        delete: (id: string) => mockStore.delete('holidays', id),
    },
};

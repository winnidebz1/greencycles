import React, { useEffect, useState } from 'react';
import { Plus, Search, Filter, Trash2, Edit, UserCheck, UserX } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Card,
    CardHeader,
    CardBody,
    Button,
    Input,
    Select,
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
    StatusBadge,
    LoadingSpinner,
    Modal,
    Alert
} from '@/components/ui';
import { hrmService } from '@/services/hrmService';
import type { Employee } from '@/types';

// Simplified currency map
const CURRENCIES = [
    { value: 'USD', label: 'USD ($)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'GBP', label: 'GBP (£)' },
    { value: 'GHS', label: 'GHS (₵)' },
    { value: 'NGN', label: 'NGN (₦)' },
];

const employeeSchema = z.object({
    firstName: z.string().min(2, 'First Name is required'),
    lastName: z.string().min(2, 'Last Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number is required'),
    department: z.string().min(2, 'Department is required'),
    position: z.string().min(2, 'Position is required'),
    salary: z.string().transform((val) => Number(val)).refine((val) => val > 0, 'Salary must be positive'),
    currency: z.string().min(1, 'Currency is required'),
    startDate: z.string().min(1, 'Start Date is required'),
    status: z.enum(['active', 'inactive', 'on_leave', 'terminated']),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

export const EmployeesPage: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<EmployeeFormData>({
        resolver: zodResolver(employeeSchema),
        defaultValues: {
            status: 'active',
            currency: 'USD',
        }
    });

    useEffect(() => {
        fetchEmployees();
    }, []);

    useEffect(() => {
        if (selectedEmployee) {
            setValue('firstName', selectedEmployee.firstName);
            setValue('lastName', selectedEmployee.lastName);
            setValue('email', selectedEmployee.email);
            setValue('phone', selectedEmployee.phone);
            setValue('department', selectedEmployee.department);
            setValue('position', selectedEmployee.position);
            setValue('salary', selectedEmployee.salary as any);
            setValue('currency', selectedEmployee.currency || 'USD');
            setValue('startDate', selectedEmployee.hireDate.split('T')[0]);
            setValue('status', selectedEmployee.employmentStatus as any);
            setShowModal(true);
        } else {
            reset({ status: 'active', currency: 'USD' });
        }
    }, [selectedEmployee, setValue, reset]);

    const fetchEmployees = async () => {
        try {
            setIsLoading(true);
            const response = await hrmService.employees.getAll();
            if (response.success && response.data) {
                setEmployees(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (data: EmployeeFormData) => {
        try {
            const payload = {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone,
                department: data.department,
                position: data.position,
                salary: Number(data.salary),
                currency: data.currency,
                hireDate: data.startDate,
                employmentStatus: data.status,
            };

            if (selectedEmployee) {
                await hrmService.employees.update(selectedEmployee.id, payload);
                setNotification({ type: 'success', message: 'Employee updated successfully' });
            } else {
                await hrmService.employees.create(payload as any);
                setNotification({ type: 'success', message: 'Employee created successfully' });
            }
            setShowModal(false);
            fetchEmployees();
            setSelectedEmployee(null);
        } catch (error) {
            setNotification({ type: 'error', message: 'Operation failed' });
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this employee?')) {
            try {
                await hrmService.employees.delete(id);
                setNotification({ type: 'success', message: 'Employee deleted successfully' });
                fetchEmployees();
            } catch (error) {
                setNotification({ type: 'error', message: 'Failed to delete employee' });
            }
        }
    };

    const toggleStatus = async (employee: Employee) => {
        try {
            const isActive = employee.employmentStatus === 'active';
            if (isActive) {
                await hrmService.employees.update(employee.id, { employmentStatus: 'inactive' } as any);
                setNotification({ type: 'success', message: 'Employee deactivated' });
            } else {
                await hrmService.employees.update(employee.id, { employmentStatus: 'active' });
                setNotification({ type: 'success', message: 'Employee activated' });
            }
            fetchEmployees();
        } catch (error) {
            setNotification({ type: 'error', message: 'Operation failed' });
        }
    };

    const handleEdit = (employee: Employee) => {
        setSelectedEmployee(employee);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedEmployee(null);
        reset();
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
                    <p className="text-gray-600 mt-1">Manage staff and departments</p>
                </div>
                <Button
                    variant="primary"
                    icon={<Plus className="w-5 h-5" />}
                    onClick={() => setShowModal(true)}
                >
                    Add Employee
                </Button>
            </div>

            {notification && (
                <Alert
                    type={notification.type}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                />
            )}

            <Card>
                <CardHeader className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search employees..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                    <Button variant="outline" icon={<Filter className="w-4 h-4" />}>
                        Filter
                    </Button>
                </CardHeader>
                <CardBody className="p-0 overflow-x-auto">
                    {isLoading ? (
                        <div className="p-8 flex justify-center">
                            <LoadingSpinner size="lg" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead>Position</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {employees.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                            No employees found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    employees.map((employee) => (
                                        <TableRow key={employee.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-xs">
                                                        {employee.firstName[0]}{employee.lastName[0]}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">{employee.firstName} {employee.lastName}</div>
                                                        <div className="text-xs text-gray-500">{employee.email}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{employee.department}</TableCell>
                                            <TableCell>{employee.position}</TableCell>
                                            <TableCell>
                                                <StatusBadge status={employee.employmentStatus === 'active' ? 'active' : 'inactive'} />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => toggleStatus(employee)}
                                                        className={`p-1 rounded ${employee.employmentStatus === 'active' ? 'text-warning-600 hover:bg-warning-50' : 'text-success-600 hover:bg-success-50'}`}
                                                        title={employee.employmentStatus === 'active' ? "Deactivate" : "Activate"}
                                                    >
                                                        {employee.employmentStatus === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                                                    </button>
                                                    <button
                                                        onClick={() => handleEdit(employee)}
                                                        className="p-1 text-primary-600 hover:bg-primary-50 rounded"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(employee.id)}
                                                        className="p-1 text-danger-600 hover:bg-danger-50 rounded"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardBody>
            </Card>

            <Modal
                isOpen={showModal}
                onClose={handleCloseModal}
                title={selectedEmployee ? 'Edit Employee' : 'Add Employee'}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="First Name"
                            error={errors.firstName?.message}
                            {...register('firstName')}
                        />
                        <Input
                            label="Last Name"
                            error={errors.lastName?.message}
                            {...register('lastName')}
                        />
                    </div>
                    <Input
                        label="Email"
                        type="email"
                        error={errors.email?.message}
                        {...register('email')}
                    />
                    <Input
                        label="Phone"
                        error={errors.phone?.message}
                        {...register('phone')}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Department"
                            error={errors.department?.message}
                            {...register('department')}
                        />
                        <Input
                            label="Position"
                            error={errors.position?.message}
                            {...register('position')}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Salary Currency"
                            error={errors.currency?.message}
                            {...register('currency')}
                            options={CURRENCIES}
                        />
                        <Input
                            label="Salary"
                            type="number"
                            error={errors.salary?.message}
                            {...register('salary')}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Start Date"
                            type="date"
                            error={errors.startDate?.message}
                            {...register('startDate')}
                        />
                        <Select
                            label="Status"
                            error={errors.status?.message}
                            {...register('status')}
                            options={[
                                { value: 'active', label: 'Active' },
                                { value: 'inactive', label: 'Inactive' },
                                { value: 'on_leave', label: 'On Leave' },
                                { value: 'terminated', label: 'Terminated' },
                            ]}
                        />
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <Button type="button" variant="ghost" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" isLoading={isSubmitting}>
                            {selectedEmployee ? 'Update Employee' : 'Create Employee'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

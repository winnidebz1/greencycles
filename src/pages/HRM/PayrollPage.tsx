import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Card, CardBody, Button, Input, Select, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, StatusBadge, LoadingSpinner, Modal, Alert
} from '@/components/ui';
import { hrmService } from '@/services/hrmService';
import type { Payroll } from '@/types';
import { format } from 'date-fns';

// Simplified currency map
const CURRENCIES = [
    { value: 'USD', label: 'USD ($)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'GBP', label: 'GBP (£)' },
    { value: 'GHS', label: 'GHS (₵)' },
    { value: 'NGN', label: 'NGN (₦)' },
];

const getCurrencySymbol = (code: string) => {
    switch (code) {
        case 'EUR': return '€';
        case 'GBP': return '£';
        case 'GHS': return '₵';
        case 'NGN': return '₦';
        default: return '$';
    }
};

const payrollSchema = z.object({
    employeeId: z.string().min(1, 'Employee ID is required'),
    month: z.string().min(1, 'Month is required'),
    year: z.string().transform(v => Number(v)),
    basicSalary: z.string().transform(v => Number(v)),
    currency: z.string().min(1, 'Currency is required'),
    allowances: z.string().transform(v => Number(v)),
    deductions: z.string().transform(v => Number(v)),
});

export const PayrollPage: React.FC = () => {
    const [payrolls, setPayrolls] = useState<Payroll[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(payrollSchema),
        defaultValues: {
            year: new Date().getFullYear(),
            month: format(new Date(), 'MMMM'),
            allowances: 0,
            deductions: 0,
            currency: 'USD'
        }
    });

    useEffect(() => { fetchPayroll(); }, []);

    const fetchPayroll = async () => {
        try {
            setIsLoading(true);
            const response = await hrmService.payroll.getAll();
            if (response.success && response.data) setPayrolls(response.data.data);
        } catch (error) { console.error(error); } finally { setIsLoading(false); }
    };

    const onSubmit = async (data: any) => {
        try {
            const payload = {
                ...data,
                netSalary: data.basicSalary + data.allowances - data.deductions // Simple calc
            };
            await hrmService.payroll.generate(payload);
            setNotification({ type: 'success', message: 'Payroll generated' });
            setShowModal(false);
            fetchPayroll();
            reset({
                year: new Date().getFullYear(),
                month: format(new Date(), 'MMMM'),
                allowances: 0,
                deductions: 0,
                currency: 'USD'
            });
        } catch (error) { setNotification({ type: 'error', message: 'Failed' }); }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {notification && <Alert type={notification.type} message={notification.message} onClose={() => setNotification(null)} />}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Payroll</h1>
                <Button variant="primary" icon={<Plus className="w-5 h-5" />} onClick={() => setShowModal(true)}>Generate Payroll</Button>
            </div>
            <Card>
                <CardBody className="p-0 overflow-x-auto">
                    {isLoading ? <div className="p-8 flex justify-center"><LoadingSpinner /></div> : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Employee</TableHead>
                                    <TableHead>Period</TableHead>
                                    <TableHead>Basic</TableHead>
                                    <TableHead>Net Salary</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payrolls.length === 0 ? <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-500">No records</TableCell></TableRow> :
                                    payrolls.map(item => (
                                        <TableRow key={item.id}>
                                            <TableCell>{item.employeeId}</TableCell>
                                            <TableCell>{item.month} {item.year}</TableCell>
                                            <TableCell>{getCurrencySymbol(item.currency || 'USD')}{item.basicSalary}</TableCell>
                                            <TableCell className="font-bold">{getCurrencySymbol(item.currency || 'USD')}{item.netSalary}</TableCell>
                                            <TableCell><StatusBadge status={item.status} /></TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    )}
                </CardBody>
            </Card>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Generate Payroll">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input label="Employee ID" error={errors.employeeId?.message as string} {...register('employeeId')} />
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Month" error={errors.month?.message as string} {...register('month')} />
                        <Input label="Year" type="number" error={errors.year?.message as string} {...register('year')} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Currency"
                            error={errors.currency?.message as string}
                            {...register('currency')}
                            options={CURRENCIES}
                        />
                        <Input label="Basic Salary" type="number" error={errors.basicSalary?.message as string} {...register('basicSalary')} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Allowances" type="number" {...register('allowances')} />
                        <Input label="Deductions" type="number" {...register('deductions')} />
                    </div>
                    <div className="flex justify-end gap-3 pt-4"><Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button><Button variant="primary" type="submit" isLoading={isSubmitting}>Generate</Button></div>
                </form>
            </Modal>
        </div>
    );
};

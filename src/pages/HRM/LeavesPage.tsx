import React, { useEffect, useState } from 'react';
import { Plus, Check, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Card,
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
import type { LeaveRequest } from '@/types';
import { format } from 'date-fns';

const leaveSchema = z.object({
    employeeId: z.string().min(1, 'Employee ID is required'),
    leaveType: z.enum(['annual', 'sick', 'emergency', 'unpaid', 'maternity', 'paternity']),
    startDate: z.string().min(1, 'Start Date is required'),
    endDate: z.string().min(1, 'End Date is required'),
    reason: z.string().min(5, 'Reason is required'),
});

type LeaveFormData = z.infer<typeof leaveSchema>;

export const LeavesPage: React.FC = () => {
    const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<LeaveFormData>({
        resolver: zodResolver(leaveSchema),
        defaultValues: { leaveType: 'annual' }
    });

    useEffect(() => { fetchLeaves(); }, []);

    const fetchLeaves = async () => {
        try {
            setIsLoading(true);
            const response = await hrmService.leaves.getAll();
            if (response.success && response.data) setLeaves(response.data.data);
        } catch (error) { console.error(error); } finally { setIsLoading(false); }
    };

    const onSubmit = async (data: LeaveFormData) => {
        try {
            await hrmService.leaves.request(data);
            setNotification({ type: 'success', message: 'Leave request submitted' });
            setShowModal(false);
            fetchLeaves();
            reset();
        } catch (error) { setNotification({ type: 'error', message: 'Failed' }); }
    };

    const handleAction = async (id: string, status: 'approved' | 'rejected') => {
        try {
            if (status === 'approved') await hrmService.leaves.approve(id);
            else await hrmService.leaves.reject(id);
            fetchLeaves();
            setNotification({ type: 'success', message: `Leave ${status}` });
        } catch (error) { setNotification({ type: 'error', message: 'Action failed' }); }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {notification && <Alert type={notification.type} message={notification.message} onClose={() => setNotification(null)} />}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Leave Requests</h1>
                <Button variant="primary" icon={<Plus className="w-5 h-5" />} onClick={() => setShowModal(true)}>Request Leave</Button>
            </div>
            <Card>
                <CardBody className="p-0 overflow-x-auto">
                    {isLoading ? <div className="p-8 flex justify-center"><LoadingSpinner /></div> : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Employee</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Dates</TableHead>
                                    <TableHead>Days</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {leaves.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500">No requests</TableCell></TableRow> :
                                    leaves.map(item => (
                                        <TableRow key={item.id}>
                                            <TableCell>{item.employeeId}</TableCell>
                                            <TableCell className="capitalize">{item.leaveType}</TableCell>
                                            <TableCell>{format(new Date(item.startDate), 'MMM d')} - {format(new Date(item.endDate), 'MMM d, yyyy')}</TableCell>
                                            <TableCell>{item.days}</TableCell>
                                            <TableCell><StatusBadge status={item.status} /></TableCell>
                                            <TableCell>
                                                {item.status === 'pending' && (
                                                    <div className="flex gap-2">
                                                        <button onClick={() => handleAction(item.id, 'approved')} className="p-1 text-success-600 hover:bg-success-50 rounded"><Check className="w-4 h-4" /></button>
                                                        <button onClick={() => handleAction(item.id, 'rejected')} className="p-1 text-danger-600 hover:bg-danger-50 rounded"><X className="w-4 h-4" /></button>
                                                    </div>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    )}
                </CardBody>
            </Card>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Request Leave">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input label="Employee ID" error={errors.employeeId?.message} {...register('employeeId')} />
                    <Select label="Type" {...register('leaveType')} options={['annual', 'sick', 'emergency', 'maternity', 'paternity', 'unpaid'].map(v => ({ value: v, label: v.replace(/^\w/, c => c.toUpperCase()) }))} />
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Start Date" type="date" error={errors.startDate?.message} {...register('startDate')} />
                        <Input label="End Date" type="date" error={errors.endDate?.message} {...register('endDate')} />
                    </div>
                    <Input label="Reason" error={errors.reason?.message} {...register('reason')} />
                    <div className="flex justify-end gap-3 pt-4"><Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button><Button variant="primary" type="submit" isLoading={isSubmitting}>Submit</Button></div>
                </form>
            </Modal>
        </div>
    );
};

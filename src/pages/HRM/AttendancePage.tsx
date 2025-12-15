import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
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
import type { Attendance } from '@/types';
import { format } from 'date-fns';

const attendanceSchema = z.object({
    employeeId: z.string().min(1, 'Employee ID is required'),
    date: z.string().min(1, 'Date is required'),
    status: z.enum(['present', 'absent', 'late', 'half_day', 'on_leave']),
    timeIn: z.string().optional(),
    timeOut: z.string().optional(),
});

type AttendanceFormData = z.infer<typeof attendanceSchema>;

export const AttendancePage: React.FC = () => {
    const [attendanceList, setAttendanceList] = useState<Attendance[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<AttendanceFormData>({
        resolver: zodResolver(attendanceSchema),
        defaultValues: { status: 'present' }
    });

    useEffect(() => { fetchAttendance(); }, []);

    const fetchAttendance = async () => {
        try {
            setIsLoading(true);
            const response = await hrmService.attendance.getAll();
            if (response.success && response.data) setAttendanceList(response.data.data);
        } catch (error) { console.error(error); } finally { setIsLoading(false); }
    };

    const onSubmit = async (data: AttendanceFormData) => {
        try {
            await hrmService.attendance.mark(data);
            setNotification({ type: 'success', message: 'Attendance marked' });
            setShowModal(false);
            fetchAttendance();
            reset();
        } catch (error) { setNotification({ type: 'error', message: 'Failed' }); }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {notification && <Alert type={notification.type} message={notification.message} onClose={() => setNotification(null)} />}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
                <Button variant="primary" icon={<Plus className="w-5 h-5" />} onClick={() => setShowModal(true)}>Mark Attendance</Button>
            </div>
            <Card>
                <CardBody className="p-0 overflow-x-auto">
                    {isLoading ? <div className="p-8 flex justify-center"><LoadingSpinner /></div> : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Employee ID</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>In</TableHead>
                                    <TableHead>Out</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {attendanceList.length === 0 ? <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-500">No records</TableCell></TableRow> :
                                    attendanceList.map(item => (
                                        <TableRow key={item.id}>
                                            <TableCell>{item.employeeId}</TableCell>
                                            <TableCell>{format(new Date(item.date), 'MMM d, yyyy')}</TableCell>
                                            <TableCell><StatusBadge status={item.status} /></TableCell>
                                            <TableCell>{item.timeIn || '-'}</TableCell>
                                            <TableCell>{item.timeOut || '-'}</TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    )}
                </CardBody>
            </Card>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Mark Attendance">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input label="Employee ID" error={errors.employeeId?.message} {...register('employeeId')} />
                    <Input label="Date" type="date" error={errors.date?.message} {...register('date')} />
                    <Select label="Status" {...register('status')} options={['present', 'absent', 'late', 'half_day', 'on_leave'].map(v => ({ value: v, label: v.replace('_', ' ') }))} />
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Time In" type="time" {...register('timeIn')} />
                        <Input label="Time Out" type="time" {...register('timeOut')} />
                    </div>
                    <div className="flex justify-end gap-3 pt-4"><Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button><Button variant="primary" type="submit" isLoading={isSubmitting}>Save</Button></div>
                </form>
            </Modal>
        </div>
    );
};

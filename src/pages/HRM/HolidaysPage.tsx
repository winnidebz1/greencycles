import React, { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Card, CardBody, Button, Input, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, LoadingSpinner, Modal, Alert
} from '@/components/ui';
import { hrmService } from '@/services/hrmService';
import type { Holiday } from '@/types';
import { format } from 'date-fns';

const holidaySchema = z.object({
    title: z.string().min(2, 'Title is required'),
    date: z.string().min(1, 'Date is required'),
    isRecurring: z.boolean(),
});

export const HolidaysPage: React.FC = () => {
    const [holidays, setHolidays] = useState<Holiday[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(holidaySchema),
        defaultValues: { isRecurring: true }
    });

    useEffect(() => { fetchHolidays(); }, []);

    const fetchHolidays = async () => {
        try {
            setIsLoading(true);
            const response = await hrmService.holidays.getAll();
            if (response.success && response.data) setHolidays(response.data.data);
        } catch (error) { console.error(error); } finally { setIsLoading(false); }
    };

    const onSubmit = async (data: any) => {
        try {
            await hrmService.holidays.create(data);
            setNotification({ type: 'success', message: 'Holiday added' });
            setShowModal(false);
            fetchHolidays();
            reset();
        } catch (error) { setNotification({ type: 'error', message: 'Failed' }); }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Delete?')) {
            await hrmService.holidays.delete(id);
            fetchHolidays();
        }
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {notification && <Alert type={notification.type} message={notification.message} onClose={() => setNotification(null)} />}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Holidays</h1>
                <Button variant="primary" icon={<Plus className="w-5 h-5" />} onClick={() => setShowModal(true)}>Add Holiday</Button>
            </div>
            <Card>
                <CardBody className="p-0 overflow-x-auto">
                    {isLoading ? <div className="p-8 flex justify-center"><LoadingSpinner /></div> : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Recurring</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {holidays.length === 0 ? <TableRow><TableCell colSpan={4} className="text-center py-8 text-gray-500">No holidays</TableCell></TableRow> :
                                    holidays.map(item => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">{item.title}</TableCell>
                                            <TableCell>{format(new Date(item.date), 'MMMM d, yyyy')}</TableCell>
                                            <TableCell>{item.isRecurring ? 'Yes' : 'No'}</TableCell>
                                            <TableCell className="text-right">
                                                <button onClick={() => handleDelete(item.id)} className="p-1 text-danger-600 hover:bg-danger-50 rounded"><Trash2 className="w-4 h-4" /></button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    )}
                </CardBody>
            </Card>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Holiday">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input label="Holiday Title" error={errors.title?.message as string} {...register('title')} />
                    <Input label="Date" type="date" error={errors.date?.message as string} {...register('date')} />
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="rec" {...register('isRecurring')} className="w-4 h-4 text-primary-600 rounded" />
                        <label htmlFor="rec" className="text-sm font-medium text-gray-700">Recurring Yearly</label>
                    </div>
                    <div className="flex justify-end gap-3 pt-4"><Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button><Button variant="primary" type="submit" isLoading={isSubmitting}>Save</Button></div>
                </form>
            </Modal>
        </div>
    );
};

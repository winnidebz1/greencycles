import React, { useEffect, useState } from 'react';
import { Plus, Star } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Card, CardBody, Button, Input, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, LoadingSpinner, Modal, Alert
} from '@/components/ui';
import { hrmService } from '@/services/hrmService';
import type { PerformanceReview } from '@/types';

const reviewSchema = z.object({
    employeeId: z.string().min(1, 'Employee ID is required'),
    reviewerId: z.string().min(1, 'Reviewer ID is required'),
    period: z.string().min(1, 'Period is required'),
    rating: z.string().transform(v => Number(v)).refine(v => v >= 1 && v <= 5, 'Rating 1-5'),
    strengths: z.string().min(1, 'Required'),
    improvements: z.string().min(1, 'Required'),
    goals: z.string().min(1, 'Required'),
});

export const PerformancePage: React.FC = () => {
    const [reviews, setReviews] = useState<PerformanceReview[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    type ReviewFormValues = z.infer<typeof reviewSchema>;
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ReviewFormValues>({
        resolver: zodResolver(reviewSchema),
        defaultValues: { rating: 3 }
    });

    useEffect(() => { fetchReviews(); }, []);

    const fetchReviews = async () => {
        try {
            setIsLoading(true);
            const response = await hrmService.performance.getReviews();
            if (response.success && response.data) setReviews(response.data.data);
        } catch (error) { console.error(error); } finally { setIsLoading(false); }
    };

    const onSubmit = async (data: any) => {
        try {
            await hrmService.performance.addReview(data);
            setNotification({ type: 'success', message: 'Review added' });
            setShowModal(false);
            fetchReviews();
            reset();
        } catch (error) { setNotification({ type: 'error', message: 'Failed' }); }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {notification && <Alert type={notification.type} message={notification.message} onClose={() => setNotification(null)} />}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Performance Reviews</h1>
                <Button variant="primary" icon={<Plus className="w-5 h-5" />} onClick={() => setShowModal(true)}>Add Review</Button>
            </div>
            <Card>
                <CardBody className="p-0 overflow-x-auto">
                    {isLoading ? <div className="p-8 flex justify-center"><LoadingSpinner /></div> : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Employee</TableHead>
                                    <TableHead>Period</TableHead>
                                    <TableHead>Rating</TableHead>
                                    <TableHead>Goals</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reviews.length === 0 ? <TableRow><TableCell colSpan={4} className="text-center py-8 text-gray-500">No reviews</TableCell></TableRow> :
                                    reviews.map(item => (
                                        <TableRow key={item.id}>
                                            <TableCell>{item.employeeId}</TableCell>
                                            <TableCell>{item.period}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1 text-yellow-500">
                                                    <span className="font-bold text-gray-900">{item.rating}</span>
                                                    <Star className="w-4 h-4 fill-current" />
                                                </div>
                                            </TableCell>
                                            <TableCell className="max-w-xs truncate">{item.goals}</TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    )}
                </CardBody>
            </Card>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Review">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Employee ID" error={errors.employeeId?.message as string} {...register('employeeId')} />
                        <Input label="Reviewer ID" error={errors.reviewerId?.message as string} {...register('reviewerId')} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Period (e.g. Q1 2024)" error={errors.period?.message as string} {...register('period')} />
                        <Input label="Rating (1-5)" type="number" min="1" max="5" error={errors.rating?.message as string} {...register('rating')} />
                    </div>
                    <Input label="Strengths" error={errors.strengths?.message as string} {...register('strengths')} />
                    <Input label="Improvements" error={errors.improvements?.message as string} {...register('improvements')} />
                    <Input label="Goals" error={errors.goals?.message as string} {...register('goals')} />
                    <div className="flex justify-end gap-3 pt-4"><Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button><Button variant="primary" type="submit" isLoading={isSubmitting}>Save</Button></div>
                </form>
            </Modal>
        </div>
    );
};

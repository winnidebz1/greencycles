import React, { useEffect, useState } from 'react';
import { Plus, Search, Filter, Trash2, Edit } from 'lucide-react';
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
    LoadingSpinner,
    Modal,
    Alert
} from '@/components/ui';
import { crmService } from '@/services/crmService';
import type { Payment } from '@/types';
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

const paymentSchema = z.object({
    invoiceId: z.string().min(1, 'Invoice ID is required'),
    amount: z.string().transform(val => Number(val)).refine(val => val > 0, 'Amount must be positive'),
    currency: z.string().min(1, 'Currency is required'),
    method: z.enum(['cash', 'bank_transfer', 'card', 'mobile_money', 'other']),
    reference: z.string().optional(),
    paidAt: z.string().min(1, 'Payment Date is required'),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

export const PaymentsPage: React.FC = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<PaymentFormData>({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
            method: 'bank_transfer',
            currency: 'USD',
        }
    });

    useEffect(() => {
        fetchPayments();
    }, []);

    useEffect(() => {
        if (selectedPayment) {
            setValue('invoiceId', selectedPayment.invoiceId);
            setValue('amount', String(selectedPayment.amount) as any);
            setValue('currency', selectedPayment.currency || 'USD');
            setValue('method', selectedPayment.method);
            setValue('reference', selectedPayment.reference);
            setValue('paidAt', selectedPayment.paidAt.split('T')[0]);
            setShowModal(true);
        } else {
            reset({ method: 'bank_transfer', currency: 'USD' });
        }
    }, [selectedPayment, setValue, reset]);

    const fetchPayments = async () => {
        try {
            setIsLoading(true);
            const response = await crmService.payments.getAll();
            if (response.success && response.data) {
                setPayments(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching payments:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (data: PaymentFormData) => {
        try {
            const payload = { ...data };
            await crmService.payments.create(payload);
            setNotification({ type: 'success', message: 'Payment recorded successfully' });
            setShowModal(false);
            fetchPayments();
            setSelectedPayment(null);
        } catch (error) {
            setNotification({ type: 'error', message: 'Operation failed' });
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {notification && (
                <Alert
                    type={notification.type}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                />
            )}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
                    <p className="text-gray-600 mt-1">Track incoming payments</p>
                </div>
                <Button variant="primary" icon={<Plus className="w-5 h-5" />} onClick={() => setShowModal(true)}>
                    Record Payment
                </Button>
            </div>

            <Card>
                <CardBody className="p-0 overflow-x-auto">
                    {isLoading ? (
                        <div className="p-8 flex justify-center"><LoadingSpinner size="lg" /></div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Invoice ID</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Method</TableHead>
                                    <TableHead>Reference</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payments.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">No payments found</TableCell>
                                    </TableRow>
                                ) : (
                                    payments.map((payment) => (
                                        <TableRow key={payment.id}>
                                            <TableCell>{payment.invoiceId}</TableCell>
                                            <TableCell>{getCurrencySymbol(payment.currency || 'USD')}{payment.amount.toFixed(2)}</TableCell>
                                            <TableCell className="capitalize">{payment.method.replace('_', ' ')}</TableCell>
                                            <TableCell>{payment.reference || '-'}</TableCell>
                                            <TableCell>{format(new Date(payment.paidAt), 'MMM d, yyyy')}</TableCell>
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
                onClose={() => { setShowModal(false); setSelectedPayment(null); reset(); }}
                title="Record Payment"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input label="Invoice ID" error={errors.invoiceId?.message} {...register('invoiceId')} />
                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Currency"
                            error={errors.currency?.message}
                            {...register('currency')}
                            options={CURRENCIES}
                        />
                        <Input label="Amount" type="number" step="0.01" error={errors.amount?.message} {...register('amount')} />
                    </div>
                    <Select
                        label="Payment Method"
                        error={errors.method?.message}
                        {...register('method')}
                        options={[
                            { value: 'bank_transfer', label: 'Bank Transfer' },
                            { value: 'cash', label: 'Cash' },
                            { value: 'card', label: 'Card' },
                            { value: 'mobile_money', label: 'Mobile Money' },
                            { value: 'other', label: 'Other' },
                        ]}
                    />
                    <Input label="Reference / Note" {...register('reference')} />
                    <Input label="Date" type="date" error={errors.paidAt?.message} {...register('paidAt')} />

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="primary" type="submit" isLoading={isSubmitting}>Record Payment</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

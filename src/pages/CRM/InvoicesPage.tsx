import React, { useEffect, useState } from 'react';
import { Plus, Search, Filter, MoreVertical, CheckCircle, Trash2, Edit, Send, Download } from 'lucide-react';
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
import { crmService } from '@/services/crmService';
import type { Invoice } from '@/types';

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

const invoiceSchema = z.object({
    invoiceNumber: z.string().min(1, 'Invoice Number is required'),
    clientName: z.string().min(1, 'Client Name is required'),
    currency: z.string().min(1, 'Currency is required'),
    total: z.string().transform((val) => Number(val)).refine((val) => val > 0, 'Total must be positive'),
    dueDate: z.string().min(1, 'Due Date is required'),
    status: z.enum(['draft', 'sent', 'paid', 'overdue', 'cancelled']),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

export const InvoicesPage: React.FC = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<InvoiceFormData>({
        resolver: zodResolver(invoiceSchema),
        defaultValues: {
            status: 'draft',
            currency: 'USD',
        }
    });

    useEffect(() => {
        fetchInvoices();
    }, []);

    useEffect(() => {
        if (selectedInvoice) {
            setValue('invoiceNumber', selectedInvoice.invoiceNumber);
            setValue('clientName', 'Client ID ' + selectedInvoice.clientId);
            setValue('currency', selectedInvoice.currency || 'USD');
            setValue('total', String(selectedInvoice.total));
            setValue('dueDate', selectedInvoice.dueDate);
            setValue('status', selectedInvoice.status);
            setShowModal(true);
        } else {
            reset({ status: 'draft', currency: 'USD' });
        }
    }, [selectedInvoice, setValue, reset]);

    const fetchInvoices = async () => {
        try {
            setIsLoading(true);
            const response = await crmService.invoices.getAll();
            if (response.success && response.data) {
                setInvoices(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching invoices:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (data: InvoiceFormData) => {
        try {
            const payload = {
                invoiceNumber: data.invoiceNumber,
                total: Number(data.total),
                currency: data.currency,
                dueDate: data.dueDate,
                status: data.status,
                clientId: '1', // Mock client ID
                subtotal: Number(data.total), // Simplified
                items: [] // Simplified
            };

            if (selectedInvoice) {
                await crmService.invoices.update(selectedInvoice.id, payload);
                setNotification({ type: 'success', message: 'Invoice updated successfully' });
            } else {
                await crmService.invoices.create(payload);
                setNotification({ type: 'success', message: 'Invoice created successfully' });
            }
            setShowModal(false);
            fetchInvoices();
            setSelectedInvoice(null);
        } catch (error) {
            setNotification({ type: 'error', message: 'Operation failed' });
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this invoice?')) {
            try {
                await crmService.invoices.delete(id);
                setNotification({ type: 'success', message: 'Invoice deleted successfully' });
                fetchInvoices();
            } catch (error) {
                setNotification({ type: 'error', message: 'Failed to delete invoice' });
            }
        }
    };

    const handleMarkAsPaid = async (id: string) => {
        try {
            await crmService.invoices.markAsPaid(id);
            setNotification({ type: 'success', message: 'Invoice marked as paid' });
            fetchInvoices();
        } catch (error) {
            setNotification({ type: 'error', message: 'Operation failed' });
        }
    };

    const handleSend = async (id: string) => {
        try {
            await crmService.invoices.send(id);
            setNotification({ type: 'success', message: 'Invoice sent to client' });
            fetchInvoices();
        } catch (error) {
            setNotification({ type: 'error', message: 'Operation failed' });
        }
    };

    const handleEdit = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedInvoice(null);
        reset();
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
                    <p className="text-gray-600 mt-1">Manage invoices and payments</p>
                </div>
                <Button
                    variant="primary"
                    icon={<Plus className="w-5 h-5" />}
                    onClick={() => setShowModal(true)}
                >
                    Create Invoice
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
                            placeholder="Search invoices..."
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
                                    <TableHead>Invoice #</TableHead>
                                    <TableHead>Client</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Due Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoices.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                            No invoices found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    invoices.map((invoice) => (
                                        <TableRow key={invoice.id}>
                                            <TableCell className="font-medium text-gray-900">
                                                {invoice.invoiceNumber}
                                            </TableCell>
                                            <TableCell>Client ID: {invoice.clientId}</TableCell>
                                            <TableCell>{getCurrencySymbol(invoice.currency || 'USD')}{invoice.total.toFixed(2)}</TableCell>
                                            <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <StatusBadge status={invoice.status} />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleMarkAsPaid(invoice.id)}
                                                        className="p-1 text-success-600 hover:bg-success-50 rounded"
                                                        title="Mark as Paid"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleSend(invoice.id)}
                                                        className="p-1 text-primary-600 hover:bg-primary-50 rounded"
                                                        title="Send to Client"
                                                    >
                                                        <Send className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                                                        title="Download PDF"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEdit(invoice)}
                                                        className="p-1 text-primary-600 hover:bg-primary-50 rounded"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(invoice.id)}
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
                title={selectedInvoice ? 'Edit Invoice' : 'Create Invoice'}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Invoice Number"
                        error={errors.invoiceNumber?.message}
                        {...register('invoiceNumber')}
                    />
                    <Input
                        label="Client Name"
                        placeholder="For demo, type any name"
                        error={errors.clientName?.message}
                        {...register('clientName')}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Currency"
                            error={errors.currency?.message}
                            {...register('currency')}
                            options={CURRENCIES}
                        />
                        <Input
                            label="Total Amount"
                            type="number"
                            step="0.01"
                            error={errors.total?.message}
                            {...register('total')}
                        />
                    </div>
                    <Input
                        label="Due Date"
                        type="date"
                        error={errors.dueDate?.message}
                        {...register('dueDate')}
                    />
                    <Select
                        label="Status"
                        error={errors.status?.message}
                        {...register('status')}
                        options={[
                            { value: 'draft', label: 'Draft' },
                            { value: 'sent', label: 'Sent' },
                            { value: 'paid', label: 'Paid' },
                            { value: 'overdue', label: 'Overdue' },
                            { value: 'cancelled', label: 'Cancelled' },
                        ]}
                    />
                    <div className="flex justify-end gap-3 mt-6">
                        <Button type="button" variant="ghost" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" isLoading={isSubmitting}>
                            {selectedInvoice ? 'Update Invoice' : 'Create Invoice'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

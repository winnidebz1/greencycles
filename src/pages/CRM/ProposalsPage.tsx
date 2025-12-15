import React, { useEffect, useState } from 'react';
import { Plus, Search, Filter, Trash2, Edit, FileText } from 'lucide-react';
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
import type { Proposal } from '@/types';

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

const proposalSchema = z.object({
    title: z.string().min(2, 'Title is required'),
    description: z.string().optional(),
    clientId: z.string().min(1, 'Client is required'),
    currency: z.string().min(1, 'Currency is required'),
    total: z.string().transform((val) => Number(val)).refine((val) => val > 0, 'Total must be positive'),
    validUntil: z.string().min(1, 'Valid Until Date is required'),
    status: z.enum(['draft', 'sent', 'accepted', 'rejected', 'viewed']),
});

type ProposalFormData = z.infer<typeof proposalSchema>;

export const ProposalsPage: React.FC = () => {
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<ProposalFormData>({
        resolver: zodResolver(proposalSchema),
        defaultValues: {
            status: 'draft',
            currency: 'USD',
        }
    });

    useEffect(() => {
        fetchProposals();
    }, []);

    useEffect(() => {
        if (selectedProposal) {
            setValue('title', selectedProposal.title);
            setValue('description', selectedProposal.description);
            setValue('clientId', selectedProposal.clientId);
            setValue('currency', selectedProposal.currency || 'USD');
            setValue('total', selectedProposal.total as any);
            setValue('validUntil', selectedProposal.validUntil.split('T')[0]);
            setValue('status', selectedProposal.status);
            setShowModal(true);
        } else {
            reset({ status: 'draft', currency: 'USD' });
        }
    }, [selectedProposal, setValue, reset]);

    const fetchProposals = async () => {
        try {
            setIsLoading(true);
            const response = await crmService.proposals.getAll();
            if (response.success && response.data) {
                setProposals(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching proposals:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (data: ProposalFormData) => {
        try {
            const payload = {
                ...data,
                total: Number(data.total),
                description: data.description || '',
                items: [], // Simplified
                subtotal: Number(data.total),
                tax: 0,
                discount: 0,
            };

            if (selectedProposal) {
                await crmService.proposals.update(selectedProposal.id, payload);
                setNotification({ type: 'success', message: 'Proposal updated successfully' });
            } else {
                await crmService.proposals.create(payload);
                setNotification({ type: 'success', message: 'Proposal created successfully' });
            }
            setShowModal(false);
            fetchProposals();
            setSelectedProposal(null);
        } catch (error) {
            setNotification({ type: 'error', message: 'Operation failed' });
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this proposal?')) {
            try {
                await crmService.proposals.delete(id);
                setNotification({ type: 'success', message: 'Proposal deleted successfully' });
                fetchProposals();
            } catch (error) {
                setNotification({ type: 'error', message: 'Failed to delete proposal' });
            }
        }
    };

    const handleSendPdf = async (id: string) => {
        try {
            await crmService.proposals.downloadPdf(id);
            setNotification({ type: 'success', message: 'PDF sent to client email successfully' });
        } catch (error) {
            setNotification({ type: 'error', message: 'Failed to send PDF' });
        }
    };

    const handleEdit = (proposal: Proposal) => {
        setSelectedProposal(proposal);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedProposal(null);
        reset();
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Proposals</h1>
                    <p className="text-gray-600 mt-1">Manage client proposals and estimates</p>
                </div>
                <Button
                    variant="primary"
                    icon={<Plus className="w-5 h-5" />}
                    onClick={() => setShowModal(true)}
                >
                    Create Proposal
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
                            placeholder="Search proposals..."
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
                                    <TableHead>Title</TableHead>
                                    <TableHead>Client ID</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Valid Until</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {proposals.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                            No proposals found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    proposals.map((proposal) => (
                                        <TableRow key={proposal.id}>
                                            <TableCell className="font-medium text-gray-900">
                                                <div>
                                                    <div className="font-medium">{proposal.title}</div>
                                                    <div className="text-xs text-gray-500 truncate max-w-[200px]">{proposal.description}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{proposal.clientId}</TableCell>
                                            <TableCell>{getCurrencySymbol(proposal.currency || 'USD')}{proposal.total.toFixed(2)}</TableCell>
                                            <TableCell>{new Date(proposal.validUntil).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <StatusBadge status={proposal.status} />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleSendPdf(proposal.id)}
                                                        className="p-1 text-primary-600 hover:bg-primary-50 rounded"
                                                        title="Send as PDF"
                                                    >
                                                        <FileText className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEdit(proposal)}
                                                        className="p-1 text-primary-600 hover:bg-primary-50 rounded"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(proposal.id)}
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
                title={selectedProposal ? 'Edit Proposal' : 'Create Proposal'}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Title"
                        error={errors.title?.message}
                        {...register('title')}
                    />
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Description / Notes</label>
                        <textarea
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none resize-y min-h-[80px]"
                            {...register('description')}
                        ></textarea>
                    </div>
                    <Input
                        label="Client ID"
                        placeholder="Mock Client ID"
                        error={errors.clientId?.message}
                        {...register('clientId')}
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
                        label="Valid Until"
                        type="date"
                        error={errors.validUntil?.message}
                        {...register('validUntil')}
                    />
                    <Select
                        label="Status"
                        error={errors.status?.message}
                        {...register('status')}
                        options={[
                            { value: 'draft', label: 'Draft' },
                            { value: 'sent', label: 'Sent' },
                            { value: 'accepted', label: 'Accepted' },
                            { value: 'rejected', label: 'Rejected' },
                        ]}
                    />
                    <div className="flex justify-end gap-3 mt-6">
                        <Button type="button" variant="ghost" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" isLoading={isSubmitting}>
                            {selectedProposal ? 'Update Proposal' : 'Create Proposal'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

import React, { useEffect, useState } from 'react';
import { Plus, Search, Filter, MoreVertical, CheckCircle, Trash2, Edit } from 'lucide-react';
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
    Textarea,
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
import type { Lead } from '@/types';
import { useSettings } from '@/contexts/SettingsContext';

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

const leadSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number is required'),
    company: z.string().min(2, 'Company name is required'),
    source: z.enum(['website', 'whatsapp', 'email', 'referral', 'social_media', 'other']),
    status: z.enum(['new', 'contacted', 'proposal_sent', 'negotiation', 'converted', 'lost']),
    value: z.string().transform(v => Number(v)).optional(),
    currency: z.string().optional(),
    notes: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadSchema>;

export const LeadsPage: React.FC = () => {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const { settings } = useSettings();

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<LeadFormData>({
        resolver: zodResolver(leadSchema),
        defaultValues: {
            status: 'new',
            source: 'website',
            currency: 'USD',
        }
    });

    useEffect(() => {
        fetchLeads();
    }, []);

    useEffect(() => {
        if (!selectedLead && settings.currency) {
            setValue('currency', settings.currency);
        }
    }, [settings.currency, selectedLead, setValue]);

    useEffect(() => {
        if (selectedLead) {
            setValue('name', selectedLead.name);
            setValue('email', selectedLead.email);
            setValue('phone', selectedLead.phone);
            setValue('company', selectedLead.company);
            setValue('source', selectedLead.source);
            setValue('status', selectedLead.status);
            setValue('value', String(selectedLead.value || 0) as any);
            setValue('currency', selectedLead.currency || 'USD');
            setValue('notes', selectedLead.notes || '');
            setShowModal(true);
        } else {
            reset({ status: 'new', source: 'website', currency: settings.currency || 'USD' });
        }
    }, [selectedLead, setValue, reset, settings.currency]);

    const fetchLeads = async () => {
        try {
            setIsLoading(true);
            const response = await crmService.leads.getAll();
            if (response.success && response.data) {
                setLeads(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching leads:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (data: LeadFormData) => {
        try {
            if (selectedLead) {
                await crmService.leads.update(selectedLead.id, data);
                setNotification({ type: 'success', message: 'Lead updated successfully' });
            } else {
                await crmService.leads.create(data);
                setNotification({ type: 'success', message: 'Lead created successfully' });
            }
            setShowModal(false);
            fetchLeads();
            setSelectedLead(null);
        } catch (error) {
            setNotification({ type: 'error', message: 'Operation failed' });
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this lead?')) {
            try {
                await crmService.leads.delete(id);
                setNotification({ type: 'success', message: 'Lead deleted successfully' });
                fetchLeads();
            } catch (error) {
                setNotification({ type: 'error', message: 'Failed to delete lead' });
            }
        }
    };

    const handleConvert = async (id: string) => {
        if (confirm('Convert this lead to a client?')) {
            try {
                await crmService.leads.convert(id);
                setNotification({ type: 'success', message: 'Lead converted to client successfully' });
                fetchLeads();
            } catch (error) {
                setNotification({ type: 'error', message: 'Conversion failed' });
            }
        }
    };

    const handleEdit = (lead: Lead) => {
        setSelectedLead(lead);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedLead(null);
        reset();
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
                    <p className="text-gray-600 mt-1">Manage and track your potential clients</p>
                </div>
                <Button
                    variant="primary"
                    icon={<Plus className="w-5 h-5" />}
                    onClick={() => setShowModal(true)}
                >
                    Add New Lead
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
                            placeholder="Search leads..."
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
                                    <TableHead>Company</TableHead>
                                    <TableHead>Source</TableHead>
                                    <TableHead>Est. Value</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {leads.map((lead) => (
                                    <TableRow key={lead.id}>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium text-gray-900">{lead.name}</div>
                                                <div className="text-sm text-gray-500">{lead.email}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{lead.company}</TableCell>
                                        <TableCell className="capitalize">{lead.source.replace('_', ' ')}</TableCell>
                                        <TableCell>{lead.value ? `${getCurrencySymbol(lead.currency || 'USD')}${lead.value.toFixed(2)}` : '-'}</TableCell>
                                        <TableCell>
                                            <StatusBadge status={lead.status} />
                                        </TableCell>
                                        <TableCell>
                                            {new Date(lead.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleConvert(lead.id)}
                                                    className="p-1 text-success-600 hover:bg-success-50 rounded"
                                                    title="Convert to Client"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(lead)}
                                                    className="p-1 text-primary-600 hover:bg-primary-50 rounded"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(lead.id)}
                                                    className="p-1 text-danger-600 hover:bg-danger-50 rounded"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardBody>
            </Card>

            <Modal
                isOpen={showModal}
                onClose={handleCloseModal}
                title={selectedLead ? 'Edit Lead' : 'Add New Lead'}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Full Name"
                        error={errors.name?.message}
                        {...register('name')}
                    />
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
                    <Input
                        label="Company"
                        error={errors.company?.message}
                        {...register('company')}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Currency"
                            error={errors.currency?.message}
                            {...register('currency')}
                            options={CURRENCIES}
                        />
                        <Input
                            label="Estimated Value"
                            type="number"
                            error={errors.value?.message}
                            {...register('value')}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Source"
                            error={errors.source?.message}
                            {...register('source')}
                            options={[
                                { value: 'website', label: 'Website' },
                                { value: 'whatsapp', label: 'WhatsApp' },
                                { value: 'email', label: 'Email' },
                                { value: 'referral', label: 'Referral' },
                                { value: 'social_media', label: 'Social Media' },
                                { value: 'other', label: 'Other' },
                            ]}
                        />
                        <Select
                            label="Status"
                            error={errors.status?.message}
                            {...register('status')}
                            options={[
                                { value: 'new', label: 'New' },
                                { value: 'contacted', label: 'Contacted' },
                                { value: 'proposal_sent', label: 'Proposal Sent' },
                                { value: 'negotiation', label: 'Negotiation' },
                                { value: 'converted', label: 'Converted' },
                                { value: 'lost', label: 'Lost' },
                            ]}
                        />
                    </div>
                    <Textarea
                        label="Notes"
                        error={errors.notes?.message}
                        {...register('notes')}
                    />
                    <div className="flex justify-end gap-3 mt-6">
                        <Button type="button" variant="ghost" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" isLoading={isSubmitting}>
                            {selectedLead ? 'Update Lead' : 'Create Lead'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

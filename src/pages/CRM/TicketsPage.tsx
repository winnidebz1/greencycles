import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
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
import { crmService } from '@/services/crmService';
import type { Ticket } from '@/types';
import { format } from 'date-fns';

const ticketSchema = z.object({
    subject: z.string().min(2, 'Subject is required'),
    clientId: z.string().min(1, 'Client is required'),
    status: z.enum(['open', 'in_progress', 'awaiting_client', 'closed']),
    priority: z.enum(['low', 'medium', 'high', 'urgent']),
    category: z.enum(['billing', 'technical', 'general', 'support']),
});

type TicketFormData = z.infer<typeof ticketSchema>;

export const TicketsPage: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<TicketFormData>({
        resolver: zodResolver(ticketSchema),
        defaultValues: {
            status: 'open',
            priority: 'medium',
            category: 'general',
        }
    });

    useEffect(() => {
        fetchTickets();
    }, []);

    useEffect(() => {
        if (selectedTicket) {
            setValue('subject', selectedTicket.subject);
            setValue('clientId', selectedTicket.clientId);
            setValue('status', selectedTicket.status);
            setValue('priority', selectedTicket.priority);
            setValue('category', selectedTicket.category);
            setShowModal(true);
        } else {
            reset({ status: 'open', priority: 'medium', category: 'general' });
        }
    }, [selectedTicket, setValue, reset]);

    const fetchTickets = async () => {
        try {
            setIsLoading(true);
            const response = await crmService.tickets.getAll();
            if (response.success && response.data) {
                setTickets(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching tickets:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (data: TicketFormData) => {
        try {
            if (selectedTicket) {
                await crmService.tickets.update(selectedTicket.id, data);
                setNotification({ type: 'success', message: 'Ticket updated successfully' });
            } else {
                await crmService.tickets.create(data);
                setNotification({ type: 'success', message: 'Ticket created successfully' });
            }
            setShowModal(false);
            fetchTickets();
            setSelectedTicket(null);
        } catch (error) {
            setNotification({ type: 'error', message: 'Operation failed' });
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Delete this ticket?')) {
            await crmService.tickets.delete(id);
            fetchTickets();
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
                    <h1 className="text-3xl font-bold text-gray-900">Tickets</h1>
                    <p className="text-gray-600 mt-1">Manage support tickets</p>
                </div>
                <Button variant="primary" icon={<Plus className="w-5 h-5" />} onClick={() => setShowModal(true)}>
                    New Ticket
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
                                    <TableHead>Subject</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Priority</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tickets.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">No tickets found</TableCell>
                                    </TableRow>
                                ) : (
                                    tickets.map((ticket) => (
                                        <TableRow key={ticket.id}>
                                            <TableCell className="font-medium">{ticket.subject}</TableCell>
                                            <TableCell className="capitalize">{ticket.category}</TableCell>
                                            <TableCell className="capitalize">{ticket.priority}</TableCell>
                                            <TableCell><StatusBadge status={ticket.status} /></TableCell>
                                            <TableCell>{format(new Date(ticket.createdAt), 'MMM d, yyyy')}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => setSelectedTicket(ticket)} className="p-1 hover:bg-gray-100 rounded"><Edit className="w-4 h-4 text-gray-600" /></button>
                                                    <button onClick={() => handleDelete(ticket.id)} className="p-1 hover:bg-gray-100 rounded"><Trash2 className="w-4 h-4 text-danger-600" /></button>
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
                onClose={() => { setShowModal(false); setSelectedTicket(null); reset(); }}
                title={selectedTicket ? "Edit Ticket" : "New Ticket"}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input label="Subject" error={errors.subject?.message} {...register('subject')} />
                    <Input label="Client ID" error={errors.clientId?.message} {...register('clientId')} />
                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Category"
                            {...register('category')}
                            options={[
                                { value: 'technical', label: 'Technical' },
                                { value: 'billing', label: 'Billing' },
                                { value: 'general', label: 'General' },
                                { value: 'support', label: 'Support' },
                            ]}
                        />
                        <Select
                            label="Priority"
                            {...register('priority')}
                            options={[
                                { value: 'low', label: 'Low' },
                                { value: 'medium', label: 'Medium' },
                                { value: 'high', label: 'High' },
                                { value: 'urgent', label: 'Urgent' },
                            ]}
                        />
                    </div>
                    <Select
                        label="Status"
                        {...register('status')}
                        options={[
                            { value: 'open', label: 'Open' },
                            { value: 'in_progress', label: 'In Progress' },
                            { value: 'awaiting_client', label: 'Awaiting Client' },
                            { value: 'closed', label: 'Closed' },
                        ]}
                    />
                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant="primary" type="submit" isLoading={isSubmitting}>Save</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

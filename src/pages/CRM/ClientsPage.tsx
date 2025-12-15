import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, Filter } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Card,
    CardBody,
    Button,
    Input,
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
import type { Client } from '@/types';
import { format } from 'date-fns';

const clientSchema = z.object({
    companyName: z.string().optional(),
    contactPerson: z.string().min(2, 'Contact person is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number is required'),
    location: z.string().min(2, 'Location is required'),
    status: z.enum(['active', 'inactive', 'prospective', 'archived']),
});

type ClientFormData = z.infer<typeof clientSchema>;

export const ClientsPage: React.FC = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<ClientFormData>({
        resolver: zodResolver(clientSchema),
        defaultValues: {
            status: 'active',
        }
    });

    useEffect(() => {
        fetchClients();
    }, []);

    useEffect(() => {
        if (selectedClient) {
            setValue('companyName', selectedClient.companyName);
            setValue('contactPerson', selectedClient.contactPerson);
            setValue('email', selectedClient.email);
            setValue('phone', selectedClient.phone);
            setValue('location', selectedClient.location);
            setValue('status', selectedClient.status);
            setShowModal(true);
        } else {
            reset({ status: 'active' });
        }
    }, [selectedClient, setValue, reset]);

    const fetchClients = async () => {
        try {
            setIsLoading(true);
            const response = await crmService.clients.getAll();
            if (response.success && response.data) {
                setClients(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching clients:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (data: ClientFormData) => {
        try {
            if (selectedClient) {
                await crmService.clients.update(selectedClient.id, data);
                setNotification({ type: 'success', message: 'Client updated successfully' });
            } else {
                await crmService.clients.create(data);
                setNotification({ type: 'success', message: 'Client created successfully' });
            }
            setShowModal(false);
            fetchClients();
            setSelectedClient(null);
        } catch (error) {
            setNotification({ type: 'error', message: 'Operation failed' });
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this client?')) {
            try {
                await crmService.clients.delete(id);
                setNotification({ type: 'success', message: 'Client deleted successfully' });
                fetchClients();
            } catch (error) {
                setNotification({ type: 'error', message: 'Failed to delete client' });
            }
        }
    };

    const filteredClients = clients.filter((client) => {
        const query = searchQuery.toLowerCase();
        return (
            client.contactPerson.toLowerCase().includes(query) ||
            client.email.toLowerCase().includes(query) ||
            client.companyName?.toLowerCase().includes(query) ||
            client.phone.includes(query)
        );
    });

    const handleEdit = (client: Client) => {
        setSelectedClient(client);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedClient(null);
        reset();
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

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
                    <p className="text-gray-600 mt-1">Manage your client relationships</p>
                </div>
                <Button
                    variant="primary"
                    icon={<Plus className="w-5 h-5" />}
                    onClick={() => setShowModal(true)}
                >
                    Add Client
                </Button>
            </div>

            {/* Filters */}
            <Card>
                <CardBody>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search clients..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                />
                            </div>
                        </div>
                        <Button variant="outline" icon={<Filter className="w-5 h-5" />}>
                            Filters
                        </Button>
                    </div>
                </CardBody>
            </Card>

            {/* Clients Table */}
            <Card>
                <CardBody className="p-0">
                    {isLoading ? (
                        <div className="py-12 flex justify-center">
                            <LoadingSpinner size="lg" />
                        </div>
                    ) : filteredClients.length === 0 ? (
                        <div className="text-center py-12">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No clients found</h3>
                            <p className="text-gray-600 mb-4">
                                {searchQuery ? 'Try adjusting your search' : 'Get started by adding your first client'}
                            </p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Client</TableHead>
                                    <TableHead>Contact Person</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredClients.map((client) => (
                                    <TableRow key={client.id}>
                                        <TableCell>
                                            <div className="font-medium text-gray-900">
                                                {client.companyName || 'Individual'}
                                            </div>
                                        </TableCell>
                                        <TableCell>{client.contactPerson}</TableCell>
                                        <TableCell>
                                            <a
                                                href={`mailto:${client.email}`}
                                                className="text-primary-600 hover:text-primary-700"
                                            >
                                                {client.email}
                                            </a>
                                        </TableCell>
                                        <TableCell>{client.phone}</TableCell>
                                        <TableCell>{client.location}</TableCell>
                                        <TableCell>
                                            <StatusBadge status={client.status} />
                                        </TableCell>
                                        <TableCell>
                                            {format(new Date(client.createdAt), 'MMM d, yyyy')}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(client)}
                                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4 text-gray-600" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(client.id)}
                                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4 text-danger-600" />
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

            {/* Add/Edit Client Modal */}
            <Modal
                isOpen={showModal}
                onClose={handleCloseModal}
                title={selectedClient ? "Edit Client" : "Add New Client"}
                size="lg"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Company Name"
                            placeholder="Acme Corporation"
                            error={errors.companyName?.message}
                            {...register('companyName')}
                        />
                        <Input
                            label="Contact Person"
                            placeholder="John Doe"
                            error={errors.contactPerson?.message}
                            {...register('contactPerson')}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Email"
                            type="email"
                            placeholder="john@acme.com"
                            error={errors.email?.message}
                            {...register('email')}
                        />
                        <Input
                            label="Phone"
                            type="tel"
                            placeholder="+1 234 567 8900"
                            error={errors.phone?.message}
                            {...register('phone')}
                        />
                    </div>
                    <Input
                        label="Location"
                        placeholder="New York, USA"
                        error={errors.location?.message}
                        {...register('location')}
                    />
                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" isLoading={isSubmitting}>
                            {selectedClient ? "Update Client" : "Add Client"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

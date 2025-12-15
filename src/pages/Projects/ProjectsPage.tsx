import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
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
import { projectService } from '@/services/projectService';
import type { Project } from '@/types';
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

const projectSchema = z.object({
    name: z.string().min(2, 'Project Name is required'),
    clientId: z.string().min(1, 'Client ID is required'),
    description: z.string().optional(),
    status: z.enum(['planning', 'in_progress', 'on_hold', 'completed', 'cancelled']),
    startDate: z.string().min(1, 'Start Date is required'),
    endDate: z.string().optional(),
    budget: z.string().transform(val => Number(val)).refine(val => val >= 0, 'Budget must be positive'),
    currency: z.string().min(1, 'Currency is required'),
    progress: z.string().transform(val => Number(val)).refine(val => val >= 0 && val <= 100, 'Progress must be 0-100'),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export const ProjectsPage: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<ProjectFormData>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            status: 'planning',
            progress: '0' as any,
            budget: '0' as any,
            currency: 'USD',
        }
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        if (selectedProject) {
            setValue('name', selectedProject.name);
            setValue('clientId', selectedProject.clientId);
            setValue('description', selectedProject.description);
            setValue('status', selectedProject.status);
            setValue('startDate', selectedProject.startDate.split('T')[0]);
            setValue('endDate', selectedProject.endDate?.split('T')[0] || '');
            setValue('budget', String(selectedProject.budget) as any);
            setValue('currency', selectedProject.currency || 'USD');
            setValue('progress', String(selectedProject.progress) as any);
            setShowModal(true);
        } else {
            reset({ status: 'planning', progress: '0' as any, budget: '0' as any, currency: 'USD' });
        }
    }, [selectedProject, setValue, reset]);

    const fetchProjects = async () => {
        try {
            setIsLoading(true);
            const response = await projectService.projects.getAll();
            if (response.success && response.data) {
                setProjects(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (data: ProjectFormData) => {
        try {
            const payload = {
                ...data,
                description: data.description || '',
            };

            if (selectedProject) {
                await projectService.projects.update(selectedProject.id, payload);
                setNotification({ type: 'success', message: 'Project updated successfully' });
            } else {
                await projectService.projects.create(payload);
                setNotification({ type: 'success', message: 'Project created successfully' });
            }
            setShowModal(false);
            fetchProjects();
            setSelectedProject(null);
        } catch (error) {
            setNotification({ type: 'error', message: 'Operation failed' });
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this project?')) {
            try {
                await projectService.projects.delete(id);
                setNotification({ type: 'success', message: 'Project deleted successfully' });
                fetchProjects();
            } catch (error) {
                setNotification({ type: 'error', message: 'Failed to delete project' });
            }
        }
    };

    const handleEdit = (project: Project) => {
        setSelectedProject(project);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedProject(null);
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

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
                    <p className="text-gray-600 mt-1">Track project progress and timelines</p>
                </div>
                <Button
                    variant="primary"
                    icon={<Plus className="w-5 h-5" />}
                    onClick={() => setShowModal(true)}
                >
                    Create Project
                </Button>
            </div>

            <Card>
                <CardBody className="p-0 overflow-x-auto">
                    {isLoading ? (
                        <div className="p-8 flex justify-center">
                            <LoadingSpinner size="lg" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Project Name</TableHead>
                                    <TableHead>Client ID</TableHead>
                                    <TableHead>Budget</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Timeline</TableHead>
                                    <TableHead>Progress</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {projects.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                            No projects found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    projects.map((project) => (
                                        <TableRow key={project.id}>
                                            <TableCell className="font-medium text-gray-900">
                                                {project.name}
                                            </TableCell>
                                            <TableCell>{project.clientId}</TableCell>
                                            <TableCell>{getCurrencySymbol(project.currency || 'USD')}{project.budget?.toFixed(2) || '0.00'}</TableCell>
                                            <TableCell>
                                                <StatusBadge status={project.status} />
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    <div>Start: {format(new Date(project.startDate), 'MMM d, yyyy')}</div>
                                                    {project.endDate && (
                                                        <div className="text-gray-500">End: {format(new Date(project.endDate), 'MMM d, yyyy')}</div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-24 bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-primary-600 h-2 rounded-full"
                                                            style={{ width: `${project.progress}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm text-gray-600">{project.progress}%</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleEdit(project)}
                                                        className="p-1 text-primary-600 hover:bg-primary-50 rounded"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(project.id)}
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
                title={selectedProject ? "Edit Project" : "Create Project"}
                size="lg"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Project Name"
                        error={errors.name?.message}
                        {...register('name')}
                    />
                    <Input
                        label="Client ID (Mock)"
                        error={errors.clientId?.message}
                        {...register('clientId')}
                    />
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            className="form-textarea w-full"
                            rows={3}
                            {...register('description')}
                        ></textarea>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Currency"
                            error={errors.currency?.message}
                            {...register('currency')}
                            options={CURRENCIES}
                        />
                        <Input
                            label="Budget"
                            type="number"
                            min="0"
                            error={errors.budget?.message}
                            {...register('budget')}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Start Date"
                            type="date"
                            error={errors.startDate?.message}
                            {...register('startDate')}
                        />
                        <Input
                            label="End Date"
                            type="date"
                            error={errors.endDate?.message}
                            {...register('endDate')}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Status"
                            error={errors.status?.message}
                            {...register('status')}
                            options={[
                                { value: 'planning', label: 'Planning' },
                                { value: 'in_progress', label: 'In Progress' },
                                { value: 'on_hold', label: 'On Hold' },
                                { value: 'completed', label: 'Completed' },
                                { value: 'cancelled', label: 'Cancelled' },
                            ]}
                        />
                        <Input
                            label="Progress (%)"
                            type="number"
                            min="0"
                            max="100"
                            error={errors.progress?.message}
                            {...register('progress')}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" isLoading={isSubmitting}>
                            {selectedProject ? "Update Project" : "Create Project"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

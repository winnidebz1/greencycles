import React, { useEffect, useState } from 'react';
import { Plus, Search, Trash2, Mail, MailOpen } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Card, CardBody, Button, Input, LoadingSpinner, Modal, Alert
} from '@/components/ui';
import { messageService } from '@/services/messageService';
import type { Message } from '@/types';
import { format } from 'date-fns';

const messageSchema = z.object({
    recipient: z.string().min(1, 'Recipient is required'), // Simplified
    subject: z.string().min(1, 'Subject is required'),
    body: z.string().min(1, 'Message is required'),
});

export const MessagesPage: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(messageSchema)
    });

    useEffect(() => { fetchMessages(); }, []);

    const fetchMessages = async () => {
        try {
            setIsLoading(true);
            const response = await messageService.getAll();
            if (response.success && response.data) setMessages(response.data.data);
        } catch (error) { console.error(error); } finally { setIsLoading(false); }
    };

    const onSubmit = async (data: any) => {
        try {
            await messageService.send({ ...data, senderId: 'me' });
            setNotification({ type: 'success', message: 'Message sent' });
            setShowModal(false);
            fetchMessages();
            reset();
        } catch (error) { setNotification({ type: 'error', message: 'Failed' }); }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Delete message?')) {
            await messageService.delete(id);
            fetchMessages();
        }
    }

    const toggleRead = async (id: string, isRead: boolean) => {
        if (!isRead) {
            await messageService.markAsRead(id);
            fetchMessages();
        }
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {notification && <Alert type={notification.type} message={notification.message} onClose={() => setNotification(null)} />}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
                <Button variant="primary" icon={<Plus className="w-5 h-5" />} onClick={() => setShowModal(true)}>Compose</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Sidebar mock */}
                <Card className="h-fit">
                    <CardBody>
                        <ul className="space-y-2">
                            <li className="flex items-center justify-between p-2 bg-primary-50 text-primary-700 rounded-lg cursor-pointer">
                                <span className="font-medium">Inbox</span>
                                <span className="bg-primary-200 text-xs px-2 py-0.5 rounded-full">{messages.length}</span>
                            </li>
                            <li className="flex items-center justify-between p-2 hover:bg-gray-50 text-gray-600 rounded-lg cursor-pointer">
                                <span>Sent</span>
                            </li>
                            <li className="flex items-center justify-between p-2 hover:bg-gray-50 text-gray-600 rounded-lg cursor-pointer">
                                <span>Drafts</span>
                            </li>
                            <li className="flex items-center justify-between p-2 hover:bg-gray-50 text-gray-600 rounded-lg cursor-pointer">
                                <span>Trash</span>
                            </li>
                        </ul>
                    </CardBody>
                </Card>

                {/* Message List */}
                <div className="md:col-span-2 space-y-4">
                    {isLoading ? <LoadingSpinner /> : messages.length === 0 ?
                        <div className="text-center text-gray-500 py-12">No messages</div> :
                        messages.map(msg => (
                            <div
                                key={msg.id}
                                onClick={() => toggleRead(msg.id, msg.isRead)}
                                className={`bg-white p-4 rounded-xl border transition-all cursor-pointer ${msg.isRead ? 'border-gray-200 opacity-75' : 'border-primary-200 shadow-sm border-l-4 border-l-primary-500'}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        {msg.isRead ? <MailOpen className="w-5 h-5 text-gray-400" /> : <Mail className="w-5 h-5 text-primary-500" />}
                                        <span className={`font-semibold ${msg.isRead ? 'text-gray-700' : 'text-gray-900'}`}>{msg.subject}</span>
                                    </div>
                                    <span className="text-xs text-gray-500">{format(new Date(msg.createdAt), 'MMM d, h:mm a')}</span>
                                </div>
                                <p className="text-gray-600 text-sm line-clamp-2">{msg.body}</p>
                                <div className="mt-3 flex justify-end">
                                    <button onClick={(e) => handleDelete(msg.id, e)} className="text-red-500 hover:text-red-700 p-1"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="New Message">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input label="To" placeholder="Recipient..." error={errors.recipient?.message as string} {...register('recipient')} />
                    <Input label="Subject" placeholder="Subject..." error={errors.subject?.message as string} {...register('subject')} />
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Message</label>
                        <textarea className="form-textarea w-full" rows={6} {...register('body')}></textarea>
                        {errors.body && <span className="text-sm text-red-500">{errors.body.message as string}</span>}
                    </div>
                    <div className="flex justify-end gap-3 pt-4"><Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button><Button variant="primary" type="submit" isLoading={isSubmitting}>Send</Button></div>
                </form>
            </Modal>
        </div>
    );
};

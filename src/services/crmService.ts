import { apiClient } from './api';
import { mockStore } from './mockAdapter';
import type { Client, Lead, Proposal, Invoice, Payment, Contract, Ticket, TicketResponse, PaginatedResponse, FilterOptions } from '@/types';

export const crmService = {
    // Clients
    // Methods using mockStore
    clients: {
        getAll: (filters?: FilterOptions) => mockStore.getAll<Client>('clients', filters),
        getById: (id: string) => mockStore.getById<Client>('clients', id),
        create: (data: Partial<Client>) => mockStore.create<Client>('clients', data),
        update: (id: string, data: Partial<Client>) => mockStore.update<Client>('clients', id, data),
        delete: (id: string) => mockStore.delete('clients', id),
        archive: (id: string) => mockStore.update<Client>('clients', id, { status: 'archived' }),
    },

    leads: {
        getAll: (filters?: FilterOptions) => mockStore.getAll<Lead>('leads', filters),
        getById: (id: string) => mockStore.getById<Lead>('leads', id),
        create: (data: Partial<Lead>) => mockStore.create<Lead>('leads', data),
        update: (id: string, data: Partial<Lead>) => mockStore.update<Lead>('leads', id, data),
        delete: (id: string) => mockStore.delete('leads', id),
        convert: async (id: string) => {
            const lead = await mockStore.getById<Lead>('leads', id);
            await mockStore.update('leads', id, { status: 'converted' });
            if (!lead.data) throw new Error('Lead not found');
            return mockStore.create<Client>('clients', {
                companyName: lead.data.company,
                contactPerson: lead.data.name,
                email: lead.data.email,
                phone: lead.data.phone,
                status: 'active'
            });
        },
    },

    proposals: {
        getAll: (filters?: FilterOptions) => mockStore.getAll<Proposal>('proposals', filters),
        getById: (id: string) => mockStore.getById<Proposal>('proposals', id),
        create: (data: Partial<Proposal>) => mockStore.create<Proposal>('proposals', data),
        update: (id: string, data: Partial<Proposal>) => mockStore.update<Proposal>('proposals', id, data),
        delete: (id: string) => mockStore.delete('proposals', id),
        send: (id: string) => mockStore.update('proposals', id, { status: 'sent' }),
        downloadPdf: (id: string) => Promise.resolve({ success: true, data: 'pdf_url' }),
    },

    invoices: {
        getAll: (filters?: FilterOptions) => mockStore.getAll<Invoice>('invoices', filters),
        getById: (id: string) => mockStore.getById<Invoice>('invoices', id),
        create: (data: Partial<Invoice>) => mockStore.create<Invoice>('invoices', data),
        update: (id: string, data: Partial<Invoice>) => mockStore.update<Invoice>('invoices', id, data),
        delete: (id: string) => mockStore.delete('invoices', id),
        send: (id: string) => mockStore.update('invoices', id, { status: 'sent' }),
        downloadPdf: (id: string) => Promise.resolve({ success: true, data: 'pdf_url' }),
        markAsPaid: (id: string) => mockStore.update<Invoice>('invoices', id, { status: 'paid', paidDate: new Date().toISOString() }),
    },

    payments: {
        getAll: (filters?: FilterOptions) => mockStore.getAll<Payment>('payments', filters),
        getById: (id: string) => mockStore.getById<Payment>('payments', id),
        create: (data: Partial<Payment>) => mockStore.create<Payment>('payments', data),
        getByInvoice: (invoiceId: string) => Promise.resolve({ success: true, data: [] }),
    },

    contracts: {
        getAll: (filters?: FilterOptions) => mockStore.getAll<Contract>('contracts', filters),
        getById: (id: string) => mockStore.getById<Contract>('contracts', id),
        create: (data: Partial<Contract>) => mockStore.create<Contract>('contracts', data),
        update: (id: string, data: Partial<Contract>) => mockStore.update<Contract>('contracts', id, data),
        delete: (id: string) => mockStore.delete('contracts', id),
        markAsSigned: (id: string) => mockStore.update<Contract>('contracts', id, { status: 'signed', signedDate: new Date().toISOString() }),
    },

    tickets: {
        getAll: (filters?: FilterOptions) => mockStore.getAll<Ticket>('tickets', filters),
        getById: (id: string) => mockStore.getById<Ticket>('tickets', id),
        create: (data: Partial<Ticket>) => mockStore.create<Ticket>('tickets', data),
        update: (id: string, data: Partial<Ticket>) => mockStore.update<Ticket>('tickets', id, data),
        delete: (id: string) => mockStore.delete('tickets', id),
        close: (id: string) => mockStore.update<Ticket>('tickets', id, { status: 'closed' }),
        getResponses: (id: string) => Promise.resolve({ success: true, data: [] }),
        addResponse: (id: string, data: Partial<TicketResponse>) => Promise.resolve({ success: true, data: {} as TicketResponse }),
    },
};

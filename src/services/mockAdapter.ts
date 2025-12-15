import { ApiResponse, PaginatedResponse } from '@/types';

// Generic Mock Data Store with LocalStorage Persistence
class MockDataStore {
    private store: Record<string, any[]> = {};
    private STORAGE_KEY = 'crm_mock_db_v3';

    constructor() {
        this.initializeStore();
    }

    private initializeStore() {
        // Try to load from local storage
        const savedData = localStorage.getItem(this.STORAGE_KEY);
        if (savedData) {
            try {
                this.store = JSON.parse(savedData);
                // Ensure all standard keys exist even if loaded data is partial
                this.ensureKeys();
                return;
            } catch (e) {
                console.error("Failed to load persistence layer, resetting DB", e);
            }
        }

        // Initial Data if no storage found
        this.seedData();
    }

    private ensureKeys() {
        const keys = ['leads', 'clients', 'invoices', 'proposals', 'contracts', 'tickets', 'payments', 'employees', 'projects', 'messages', 'files', 'payroll', 'settings'];
        keys.forEach(key => {
            if (!this.store[key]) this.store[key] = [];
        });
    }

    private seedData() {
        this.store = {
            leads: [
                {
                    id: '1',
                    name: 'John Smith',
                    email: 'john.smith@example.com',
                    phone: '+1 (555) 123-4567',
                    company: 'Acme Corp',
                    source: 'website',
                    status: 'new',
                    assignedTo: '1',
                    notes: 'Interested in enterprise plan',
                    value: 5000,
                    currency: 'GHS',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
                {
                    id: '2',
                    name: 'Sarah Johnson',
                    email: 'sarah.j@techstart.io',
                    phone: '+1 (555) 987-6543',
                    company: 'TechStart',
                    source: 'linkedin',
                    status: 'contacted',
                    assignedTo: '1',
                    notes: 'Follow up next week',
                    value: 1200,
                    currency: 'EUR',
                    createdAt: new Date(Date.now() - 86400000).toISOString(),
                    updatedAt: new Date().toISOString(),
                }
            ],
            clients: [
                {
                    id: '1',
                    companyName: 'Tech Solutions Inc',
                    contactPerson: 'David Miller',
                    email: 'david@techsolutions.com',
                    phone: '+1 555-0123',
                    location: 'New York, USA',
                    status: 'active',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                }
            ],
            invoices: [],
            proposals: [],
            contracts: [],
            tickets: [],
            payments: [],
            employees: [],
            projects: [],
            messages: [],
            files: [],
            payroll: [],
            settings: [
                {
                    id: 'global_settings',
                    orgName: 'Greencycles',
                    logoUrl: '', // Default empty, uses text
                    primaryColor: '#22c55e', // green-500
                    currency: 'GHS'
                }
            ]
        };
        this.saveToStorage();
    }

    private saveToStorage() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.store));
        } catch (e) {
            console.error("Failed to save to persistence layer", e);
        }
    }

    // Generic Methods
    async getAll<T>(resource: string, filters?: any): Promise<ApiResponse<PaginatedResponse<T>>> {
        await this.delay(300); // Intentionally faster for "local" feel
        const data = this.store[resource] || [];
        return {
            success: true,
            data: {
                success: true,
                data: data as T[],
                pagination: {
                    page: 1,
                    limit: 100,
                    total: data.length,
                    totalPages: 1
                }
            },
        };
    }

    async getById<T>(resource: string, id: string): Promise<ApiResponse<T>> {
        await this.delay(200);
        const item = this.store[resource]?.find((i) => i.id === id);
        if (!item) throw new Error('Item not found');
        return { success: true, data: item as T };
    }

    async create<T>(resource: string, data: any): Promise<ApiResponse<T>> {
        await this.delay(300);
        const newItem = {
            id: crypto.randomUUID(),
            ...data,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        if (!this.store[resource]) this.store[resource] = [];
        this.store[resource].unshift(newItem);
        this.saveToStorage();
        return { success: true, data: newItem as T };
    }

    async update<T>(resource: string, id: string, data: any): Promise<ApiResponse<T>> {
        await this.delay(300);
        const index = this.store[resource]?.findIndex((i) => i.id === id);
        if (index === -1) throw new Error('Item not found');

        const updatedItem = {
            ...this.store[resource][index],
            ...data,
            updatedAt: new Date().toISOString(),
        };
        this.store[resource][index] = updatedItem;
        this.saveToStorage();
        return { success: true, data: updatedItem as T };
    }

    async delete(resource: string, id: string): Promise<ApiResponse<void>> {
        await this.delay(200);
        const index = this.store[resource]?.findIndex((i) => i.id === id);
        if (index === -1) throw new Error('Item not found');
        this.store[resource].splice(index, 1);
        this.saveToStorage();
        return { success: true };
    }

    // New specific helper for settings
    getSettings() {
        if (!this.store['settings'] || this.store['settings'].length === 0) {
            this.seedData();
        }
        return this.store['settings'][0];
    }

    updateSettings(newSettings: any) {
        if (!this.store['settings']) this.store['settings'] = [];
        const current = this.store['settings'][0] || { id: 'global_settings' };
        this.store['settings'][0] = { ...current, ...newSettings };
        this.saveToStorage();
        return this.store['settings'][0];
    }

    private delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}

export const mockStore = new MockDataStore();

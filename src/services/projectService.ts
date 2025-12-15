import { mockStore } from './mockAdapter';
import type { Project, Task, FilterOptions } from '@/types';

export const projectService = {
    // Projects
    projects: {
        getAll: (filters?: FilterOptions) => mockStore.getAll<Project>('projects', filters),
        getById: (id: string) => mockStore.getById<Project>('projects', id),
        create: (data: Partial<Project>) => mockStore.create<Project>('projects', data),
        update: (id: string, data: Partial<Project>) => mockStore.update<Project>('projects', id, data),
        delete: (id: string) => mockStore.delete('projects', id),
        updateProgress: (id: string, progress: number) => mockStore.update<Project>('projects', id, { progress }),
    },

    // Tasks
    tasks: {
        getAll: (filters?: FilterOptions) => mockStore.getAll<Task>('tasks', filters),
        getById: (id: string) => mockStore.getById<Task>('tasks', id),
        create: (data: Partial<Task>) => mockStore.create<Task>('tasks', data),
        update: (id: string, data: Partial<Task>) => mockStore.update<Task>('tasks', id, data),
        delete: (id: string) => mockStore.delete('tasks', id),
        getByProject: (_projectId: string) => Promise.resolve({ success: true, data: [] }), // Mock implementation
    }
};

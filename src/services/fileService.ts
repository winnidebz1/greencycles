import { mockStore } from './mockAdapter';
import type { File as FileType, FilterOptions } from '@/types';

export const fileService = {
    getAll: (filters?: FilterOptions) => mockStore.getAll<FileType>('files', filters),
    getById: (id: string) => mockStore.getById<FileType>('files', id),
    upload: (file: File) => {
        // Simulate upload by creating a File record
        const mockFile: Partial<FileType> = {
            name: file.name,
            type: file.type,
            size: file.size,
            url: URL.createObjectURL(file), // create a local URL for the session
            uploadedBy: 'current-user-id', // Mock logic
        };
        return mockStore.create<FileType>('files', mockFile);
    },
    delete: (id: string) => mockStore.delete('files', id),
};

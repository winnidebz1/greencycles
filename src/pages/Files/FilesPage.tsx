import React, { useEffect, useState } from 'react';
import { Plus, Trash2, File as FileIcon, Download } from 'lucide-react';
import {
    Card, CardBody, LoadingSpinner, Alert
} from '@/components/ui';
import { fileService } from '@/services/fileService';
import type { File as FileType } from '@/types';
import { format } from 'date-fns';

export const FilesPage: React.FC = () => {
    const [files, setFiles] = useState<FileType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    useEffect(() => { fetchFiles(); }, []);

    const fetchFiles = async () => {
        try {
            setIsLoading(true);
            const response = await fileService.getAll();
            if (response.success && response.data) setFiles(response.data.data);
        } catch (error) { console.error(error); } finally { setIsLoading(false); }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            try {
                await fileService.upload(e.target.files[0]);
                setNotification({ type: 'success', message: 'File uploaded' });
                fetchFiles();
            } catch (error) { setNotification({ type: 'error', message: 'Upload failed' }); }
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Delete file?')) {
            await fileService.delete(id);
            fetchFiles();
        }
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {notification && <Alert type={notification.type} message={notification.message} onClose={() => setNotification(null)} />}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Files</h1>
                <div className="relative">
                    <input type="file" id="upload" className="hidden" onChange={handleUpload} />
                    <label htmlFor="upload" className="bg-primary-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-primary-700 flex items-center gap-2 transition-colors">
                        <Plus className="w-5 h-5" /> Upload File
                    </label>
                </div>
            </div>

            {isLoading ? <LoadingSpinner /> : files.length === 0 ?
                <div className="text-center text-gray-500 py-12 border-2 border-dashed border-gray-300 rounded-xl">No files uploaded</div> :
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {files.map(file => (
                        <Card key={file.id} className="cursor-pointer hover:shadow-md transition-shadow group">
                            <CardBody className="flex flex-col items-center text-center p-6">
                                <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center mb-4">
                                    <FileIcon className="w-8 h-8" />
                                </div>
                                <h3 className="font-medium text-gray-900 truncate w-full" title={file.name}>{file.name}</h3>
                                <p className="text-xs text-gray-500 mt-1">{format(new Date(file.createdAt), 'MMM d, yyyy')}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{(file.size / 1024).toFixed(1)} KB</p>

                                <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg"><Download className="w-4 h-4" /></button>
                                    <button onClick={() => handleDelete(file.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            }
        </div>
    );
};

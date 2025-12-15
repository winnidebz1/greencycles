import React, { useState, useEffect } from 'react';
import { Card, CardBody, Button, Input, Alert } from '@/components/ui';
import { Bell, Shield, Globe, Moon, Building, DollarSign } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

export const SettingsPage: React.FC = () => {
    const { settings, updateSettings } = useSettings();
    const [activeTab, setActiveTab] = useState('general');
    const [formData, setFormData] = useState({
        orgName: '',
        logoUrl: '',
        currency: 'USD',
        primaryColor: '#3b82f6'
    });
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    useEffect(() => {
        if (settings) {
            setFormData({
                orgName: settings.orgName,
                logoUrl: settings.logoUrl || '',
                currency: settings.currency || 'USD',
                primaryColor: settings.primaryColor || '#3b82f6'
            });
        }
    }, [settings]);

    const handleSave = () => {
        try {
            updateSettings(formData);
            setNotification({ type: 'success', message: 'Settings saved successfully' });
            setTimeout(() => setNotification(null), 3000); // Clear after 3s
        } catch (error) {
            setNotification({ type: 'error', message: 'Failed to save settings' });
        }
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            {notification && <Alert type={notification.type} message={notification.message} onClose={() => setNotification(null)} />}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Sidebar */}
                <div className="space-y-2">
                    <button
                        onClick={() => setActiveTab('general')}
                        className={`w-full text-left px-4 py-3 border rounded-lg font-medium flex items-center gap-3 transition-colors ${activeTab === 'general' ? 'bg-white border-gray-200 text-primary-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50 border-transparent'}`}
                    >
                        <Building className="w-5 h-5" /> Organization
                    </button>
                    <button
                        onClick={() => setActiveTab('branding')}
                        className={`w-full text-left px-4 py-3 border rounded-lg font-medium flex items-center gap-3 transition-colors ${activeTab === 'branding' ? 'bg-white border-gray-200 text-primary-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50 border-transparent'}`}
                    >
                        <Globe className="w-5 h-5" /> Branding
                    </button>
                    <button className="w-full text-left px-4 py-3 text-gray-400 cursor-not-allowed rounded-lg flex items-center gap-3">
                        <Bell className="w-5 h-5" /> Notifications (Coming Soon)
                    </button>
                    <button className="w-full text-left px-4 py-3 text-gray-400 cursor-not-allowed rounded-lg flex items-center gap-3">
                        <Shield className="w-5 h-5" /> Security (Coming Soon)
                    </button>
                </div>

                {/* Content */}
                <div className="md:col-span-2 space-y-6">
                    {activeTab === 'general' && (
                        <Card>
                            <CardBody>
                                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Organization Details</h3>
                                <div className="space-y-4">
                                    <Input
                                        label="Organization/Company Name"
                                        value={formData.orgName}
                                        onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                                    />
                                    <Input
                                        label="Default Currency (Global)"
                                        value={formData.currency}
                                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                    />
                                </div>
                            </CardBody>
                        </Card>
                    )}

                    {activeTab === 'branding' && (
                        <Card>
                            <CardBody>
                                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Branding & White-labeling</h3>
                                <div className="space-y-4">
                                    <Input
                                        label="Logo URL (Image Link)"
                                        placeholder="https://example.com/logo.png"
                                        value={formData.logoUrl}
                                        onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                                    />
                                    <div className="flex gap-4 items-center">
                                        {formData.logoUrl && <img src={formData.logoUrl} alt="Preview" className="h-12 border p-1 rounded" />}
                                        <span className="text-sm text-gray-500">Logo Preview</span>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Primary Theme Color</label>
                                        <div className="flex gap-2 items-center">
                                            <input
                                                type="color"
                                                value={formData.primaryColor}
                                                onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                                                className="h-10 w-10 p-1 rounded border overflow-hidden cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={formData.primaryColor}
                                                onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                                                className="border border-gray-300 rounded-lg px-3 py-2 w-32"
                                            />
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 italic mt-2">
                                        These settings will update the login page, sidebar, and accent colors across the application.
                                    </p>
                                </div>
                            </CardBody>
                        </Card>
                    )}

                    <div className="flex justify-end pt-4">
                        <Button variant="primary" onClick={handleSave}>Save Config</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

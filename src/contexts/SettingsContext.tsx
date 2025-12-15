import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockStore } from '@/services/mockAdapter';
import type { OrganizationSettings } from '@/types';

interface SettingsContextType {
    settings: OrganizationSettings;
    updateSettings: (newSettings: Partial<OrganizationSettings>) => void;
    isLoading: boolean;
}

const defaultSettings: OrganizationSettings = {
    id: 'default',
    orgName: 'Greencycles',
    logoUrl: '',
    primaryColor: '#22c55e',
    currency: 'GHS'
};

const SettingsContext = createContext<SettingsContextType>({
    settings: defaultSettings,
    updateSettings: () => { },
    isLoading: true,
});

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<OrganizationSettings>(defaultSettings);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = () => {
        try {
            const data = mockStore.getSettings();
            if (data) {
                setSettings(data);
                // Apply theme color (simple implementation)
                document.documentElement.style.setProperty('--primary-color', data.primaryColor || '#3b82f6');
            }
        } catch (error) {
            console.error("Failed to load settings", error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateSettings = (newSettings: Partial<OrganizationSettings>) => {
        const updated = mockStore.updateSettings(newSettings);
        setSettings(updated);
        if (updated.primaryColor) {
            document.documentElement.style.setProperty('--primary-color', updated.primaryColor);
        }
    };

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen bg-slate-900"><div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>;
    }

    return (
        <SettingsContext.Provider value={{ settings, updateSettings, isLoading }}>
            {children}
        </SettingsContext.Provider>
    );
};

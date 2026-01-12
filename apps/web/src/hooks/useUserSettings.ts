import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface UserSettings {
  theme: 'light' | 'dark';
}

const defaultSettings: UserSettings = {
  theme: 'light',
};

export function useUserSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from API
  const loadSettings = useCallback(async () => {
    if (!user) {
      setSettings(defaultSettings);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/settings?userId=${user.id}`);
      const data = await response.json();

      if (data.success) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Save settings to API
  const saveSettings = useCallback(async (newSettings: Partial<UserSettings>) => {
    if (!user) return;

    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);

    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, settings: updatedSettings }),
      });
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }, [user, settings]);

  // Update theme
  const updateTheme = useCallback((theme: 'light' | 'dark') => {
    saveSettings({ theme });
  }, [saveSettings]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return {
    settings,
    isLoading,
    updateTheme,
    saveSettings,
  };
}

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Container } from '@/infrastructure/di/Container';

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

  // Load settings using Use Case
  const loadSettings = useCallback(async () => {
    if (!user) {
      setSettings(defaultSettings);
      setIsLoading(false);
      return;
    }

    try {
      const getUserSettingsUseCase = Container.getUserSettingsUseCase();
      const result = await getUserSettingsUseCase.execute({ userId: user.id });

      if (result.isSuccess()) {
        setSettings(result.value);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Save settings using Use Case
  const saveSettings = useCallback(async (newSettings: Partial<UserSettings>) => {
    if (!user) return;

    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);

    try {
      const updateUserSettingsUseCase = Container.updateUserSettingsUseCase();
      const result = await updateUserSettingsUseCase.execute({
        userId: user.id,
        theme: updatedSettings.theme,
      });

      if (result.isSuccess()) {
        setSettings(result.value);
      }
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

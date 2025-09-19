import { createEffect, createSignal } from 'solid-js';
import type { AppSettings } from '../types/keyboard';

const defaultSettings: AppSettings = {
  theme: 'auto',
  soundEnabled: true,
  hapticEnabled: true,
  historySize: 10,
  showKeyCode: true,
  showVkCode: false,
  colorCoding: true,
  showStatistics: true,
  keyClickSound: 'default'
};

export const useSettings = () => {
  const getInitialSettings = (): AppSettings => {
    const saved = localStorage.getItem('kb-settings');
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  };

  const [settings, setSettings] = createSignal<AppSettings>(getInitialSettings());

  // Сохранение настроек в localStorage
  createEffect(() => {
    localStorage.setItem('kb-settings', JSON.stringify(settings()));
  });

  // Определение текущей темы
  const [currentTheme, setCurrentTheme] = createSignal<'light' | 'dark'>('dark');

  createEffect(() => {
    const theme = settings().theme;
    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setCurrentTheme(mediaQuery.matches ? 'dark' : 'light');

      const handler = (e: MediaQueryListEvent) => {
        setCurrentTheme(e.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      setCurrentTheme(theme);
    }
  });

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return {
    settings,
    currentTheme,
    updateSetting,
    resetSettings
  };
};
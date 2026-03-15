import { useState, useEffect } from 'react';
import { STORAGE_KEYS, saveToStorage, getFromStorage } from '../utils/storage';

export const useTheme = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = getFromStorage<boolean | null>(STORAGE_KEYS.THEME_DARK, null);
    if (saved !== null) return saved;
    return !window.matchMedia('(prefers-color-scheme: light)').matches;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.remove('light-mode');
    } else {
      root.classList.add('light-mode');
    }
    saveToStorage(STORAGE_KEYS.THEME_DARK, isDark);
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return { isDark, toggleTheme };
};

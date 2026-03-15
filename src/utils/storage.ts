export const STORAGE_KEYS = {
  TABS: 'jsonviz_tabs',
  ACTIVE_TAB: 'jsonviz_active',
  THEME_DARK: 'jsonviz_theme_dark',
  LANGUAGE: 'jsonviz_lang',
};

export const saveToStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

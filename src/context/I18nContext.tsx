import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS, saveToStorage, getFromStorage } from '../utils/storage';

export type Language = 'en' | 'pt-BR';

interface I18nContextType {
  lang: Language;
  toggleLang: () => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const translations = {
  en: {
    appName: 'JSON Visualizer',
    newTab: 'New Tab',
    createNewTab: 'Create New Tab',
    loadJson: 'Load JSON',
    orPaste: 'OR PASTE',
    cancel: 'Cancel',
    error: 'Error',
    json: 'JSON',
    copy: 'Copy',
    copied: 'Copied!',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',
    fitView: 'Fit View',
    downloadPng: 'Download PNG',
    closeConfirm: 'Close tab "{name}"? All content will be lost.',
    dropHint: 'Drop a JSON file here',
    browse: 'or click to browse',
    invalidFile: 'Please upload a valid .json file',
    readError: 'Error reading file',
    pasteHint: 'Paste your JSON here...',
    visualize: 'Visualize',
    rearrange: 'Rearrange',
    edit: 'Edit',
    save: 'Save',
  },
  'pt-BR': {
    appName: 'Visualizador de JSON',
    newTab: 'Nova Aba',
    createNewTab: 'Criar Nova Aba',
    loadJson: 'Carregar JSON',
    orPaste: 'OU COLE',
    cancel: 'Cancelar',
    error: 'Erro',
    json: 'JSON',
    copy: 'Copiar',
    copied: 'Copiado!',
    zoomIn: 'Aumentar Zoom',
    zoomOut: 'Diminuir Zoom',
    fitView: 'Ajustar Vista',
    downloadPng: 'Baixar PNG',
    closeConfirm: 'Fechar aba "{name}"? Todo o conteúdo será perdido.',
    dropHint: 'Arraste um arquivo JSON aqui',
    browse: 'ou clique para procurar',
    invalidFile: 'Por favor, envie um arquivo .json válido',
    readError: 'Erro ao ler o arquivo',
    pasteHint: 'Cole seu JSON aqui...',
    visualize: 'Visualizar',
    rearrange: 'Reorganizar',
    edit: 'Editar',
    save: 'Salvar',
  },
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>(() => {
    const saved = getFromStorage<Language | null>(STORAGE_KEYS.LANGUAGE, null);
    if (saved) return saved;
    const browserLang = navigator.language;
    return browserLang.startsWith('pt') ? 'pt-BR' : 'en';
  });

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.LANGUAGE, lang);
  }, [lang]);

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === 'en' ? 'pt-BR' : 'en'));
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string>) => {
      const langTranslations = translations[lang] || translations['en'];
      let text = (langTranslations as any)[key] || (translations['en'] as any)[key] || key;
      
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          text = text.replace(`{${k}}`, v);
        });
      }
      return text;
    },
    [lang]
  );

  return (
    <I18nContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { STORAGE_KEYS, saveToStorage, getFromStorage } from '../utils/storage';

export interface Tab {
  id: string;
  name: string;
  raw: string;
  formatted: string;
  data: any;
  createdAt: number;
  collapsedNodes: string[];
}

export const useTabs = () => {
  const [tabs, setTabs] = useState<Tab[]>(() => getFromStorage<Tab[]>(STORAGE_KEYS.TABS, []));
  const [activeTabId, setActiveTabId] = useState<string | null>(() => getFromStorage<string | null>(STORAGE_KEYS.ACTIVE_TAB, null));

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.TABS, tabs);
  }, [tabs]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.ACTIVE_TAB, activeTabId);
  }, [activeTabId]);

  const createTab = useCallback(() => {
    const newTab: Tab = {
      id: uuidv4(),
      name: `JSON ${tabs.length + 1}`,
      raw: '',
      formatted: '',
      data: null,
      createdAt: Date.now(),
      collapsedNodes: [],
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
    return newTab;
  }, [tabs.length]);

  const toggleCollapse = useCallback((tabId: string, nodeId: string) => {
    setTabs(prev => prev.map(t => {
      if (t.id !== tabId) return t;
      const isCollapsed = t.collapsedNodes.includes(nodeId);
      return {
        ...t,
        collapsedNodes: isCollapsed 
          ? t.collapsedNodes.filter(id => id !== nodeId)
          : [...t.collapsedNodes, nodeId]
      };
    }));
  }, []);

  const closeTab = useCallback((id: string) => {
    setTabs(prev => {
      const filtered = prev.filter(t => t.id !== id);
      if (activeTabId === id) {
        setActiveTabId(filtered.length > 0 ? filtered[filtered.length - 1].id : null);
      }
      return filtered;
    });
  }, [activeTabId]);

  const updateTab = useCallback((id: string, updates: Partial<Tab>) => {
    setTabs(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  const activeTab = tabs.find(t => t.id === activeTabId) || null;

  return {
    tabs,
    activeTab,
    activeTabId,
    setActiveTabId,
    createTab,
    closeTab,
    updateTab,
    toggleCollapse,
  };
};

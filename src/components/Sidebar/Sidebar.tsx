import React, { useState } from 'react';
import type { Tab } from '../../hooks/useTabs';
import { useTheme } from '../../hooks/useTheme';
import { useI18n } from '../../hooks/useI18n';

interface SidebarProps {
  tabs: Tab[];
  activeTabId: string | null;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  onCreateTab: () => void;
  onUpdateTab: (id: string, updates: Partial<Tab>) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onCreateTab,
  onUpdateTab,
  isCollapsed,
  onToggleCollapse,
}) => {
  const { isDark, toggleTheme } = useTheme();
  const { t, lang, toggleLang } = useI18n();

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div>
          <button className="collapse-sidebar-btn" onClick={onToggleCollapse} title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}>
            {isCollapsed ? '➔' : '⬅'}
          </button>
          {!isCollapsed && <h1>{t('appName')}</h1>}
        </div>
        {!isCollapsed && (
          <div>
            <button className="lang-toggle-btn" onClick={toggleLang} title="Toggle Language">
              {lang === 'en' ? '🇺🇸' : '🇧🇷'}
            </button>
            <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle Theme">
              {isDark ? '🌙' : '☀️'}
            </button>
            <button className="new-tab-btn" onClick={onCreateTab} title={t('newTab')}>
              +
            </button>
          </div>
        )}
      </div>
      {!isCollapsed && (
        <div className="tabs-list">
        {tabs.map((tab) => (
          <TabItem
            key={tab.id}
            tab={tab}
            isActive={tab.id === activeTabId}
            onSelect={() => onSelectTab(tab.id)}
            onClose={(e) => {
              e.stopPropagation();
              if (tab.raw && !confirm(t('closeConfirm', { name: tab.name }))) {
                return;
              }
              onCloseTab(tab.id);
            }}
            onRename={(newName) => onUpdateTab(tab.id, { name: newName })}
          />
        ))}
      </div>
      )}
    </aside>
  );
};

interface TabItemProps {
  tab: Tab;
  isActive: boolean;
  onSelect: () => void;
  onClose: (e: React.MouseEvent) => void;
  onRename: (newName: string) => void;
}

const TabItem: React.FC<TabItemProps> = ({ tab, isActive, onSelect, onClose, onRename }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(tab.name);

  const handleSubmit = () => {
    setIsEditing(false);
    if (editValue.trim() && editValue !== tab.name) {
      onRename(editValue);
    } else {
      setEditValue(tab.name);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(tab.name);
    }
  };

  return (
    <div 
      className={`tab-item ${isActive ? 'active' : ''}`} 
      onClick={onSelect}
      onDoubleClick={() => setIsEditing(true)}
    >
      {isEditing ? (
        <input
          autoFocus
          className="tab-name-input"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={handleKeyDown}
          onClick={(e) => e.stopPropagation()}
          onDoubleClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span className="tab-name">
          {tab.name}
        </span>
      )}
      <button className="close-tab-btn" onClick={onClose}>
        ×
      </button>
    </div>
  );
};

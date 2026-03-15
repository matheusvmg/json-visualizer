import { useState } from 'react';
import { Sidebar } from './components/Sidebar/Sidebar';
import { InputPanel } from './components/InputPanel/InputPanel';
import { JsonEditor } from './components/Editor/JsonEditor';
import { DiagramPanel } from './components/Diagram/DiagramPanel';
import { useTabs } from './hooks/useTabs';
import { useJsonParser } from './hooks/useJsonParser';
import { useI18n } from './hooks/useI18n';
import './styles/global.css';
import './styles/components.css';

function App() {
  const { t } = useI18n();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const {
    tabs,
    activeTab,
    activeTabId,
    setActiveTabId,
    createTab,
    closeTab,
    updateTab,
    toggleCollapse
  } = useTabs();

  const { parseJson } = useJsonParser();

  // Create initial tab if none exists
  if (tabs.length === 0) {
    createTab();
  }

  return (
    <div className={`app-container ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar
        tabs={tabs}
        activeTabId={activeTabId}
        onSelectTab={setActiveTabId}
        onCloseTab={closeTab}
        onCreateTab={createTab}
        onUpdateTab={updateTab}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main className="main-content">
        {!activeTab ? (
          <div className="input-overlay">
            <button className="visualize-btn" onClick={createTab}>
              {t('createNewTab')}
            </button>
          </div>
        ) : !activeTab.raw ? (
          <InputPanel 
            onSuccess={(data) => updateTab(activeTab.id, data)} 
            onCancel={() => {
              if (tabs.length > 1) {
                closeTab(activeTab.id);
              }
            }}
            showCancel={tabs.length > 1}
          />
        ) : (
          <div className="split-view">
            <JsonEditor 
              content={activeTab.raw || activeTab.formatted} 
              onChange={(newRaw: string) => {
                const result = parseJson(newRaw);
                if (!result.error) {
                  updateTab(activeTab.id, { 
                    raw: newRaw, 
                    data: result.data, 
                    formatted: result.formatted,
                    collapsedNodes: activeTab.collapsedNodes // keep existing collapses if possible
                  });
                } else {
                  updateTab(activeTab.id, { raw: newRaw });
                }
              }}
            />
            <DiagramPanel 
              data={activeTab.data} 
              tabName={activeTab.name} 
              collapsedNodes={activeTab.collapsedNodes}
              onToggleCollapse={(nodeId) => toggleCollapse(activeTab.id, nodeId)}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

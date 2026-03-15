import React, { useState } from 'react';
import { useReactFlow } from 'reactflow';
import { downloadDiagram } from '../../utils/exportDiagram';
import { useI18n } from '../../hooks/useI18n';
import { getLayoutedElements } from '../Diagram/diagramUtils';

interface DiagramToolbarProps {
  tabName: string;
}

export const DiagramToolbar: React.FC<DiagramToolbarProps> = ({ tabName }) => {
  const { zoomIn, zoomOut, fitView, getNodes, getEdges, setNodes, setEdges } = useReactFlow();
  const [isExporting, setIsExporting] = useState(false);
  const { t } = useI18n();

  const handleRearrange = () => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      getNodes(),
      getEdges()
    );
    setNodes([...layoutedNodes]);
    setEdges([...layoutedEdges]);
    setTimeout(() => fitView({ duration: 800 }), 50);
  };

  const handleExport = async () => {
    setIsExporting(true);

    try {
      // 1. Rearrange automatically
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        getNodes(),
        getEdges()
      );
      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);

      // 2. Wait for React to commit state and render
      await new Promise(resolve => setTimeout(resolve, 100));

      // 3. Force an immediate fit view (no duration) to be ready for capture
      fitView({ padding: 0.1 });

      // 4. Final wait to ensure browser has painted the fitted view
      await new Promise(resolve => setTimeout(resolve, 200));

      // 5. Trigger download
      await downloadDiagram(tabName);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="diagram-toolbar">
      <button className="toolbar-btn" onClick={() => zoomIn()} title={t('zoomIn')}>
        +
      </button>
      <button className="toolbar-btn" onClick={() => zoomOut()} title={t('zoomOut')}>
        -
      </button>
      <button className="toolbar-btn" onClick={() => fitView()} title={t('fitView')}>
        ⊡
      </button>
      <button className="toolbar-btn" onClick={handleRearrange} title={t('rearrange')}>
        🪄
      </button>
      <div style={{ width: '1px', background: 'var(--border)', margin: '4px 2px' }} />
      <button 
        className="toolbar-btn" 
        onClick={handleExport} 
        disabled={isExporting}
        title={t('downloadPng')}
      >
        {isExporting ? '...' : '📷'}
      </button>
    </div>
  );
};

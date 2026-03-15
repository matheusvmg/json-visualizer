import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';

export const JsonNode: React.FC<NodeProps> = memo(({ id, data }) => {
  const { label, properties, isArray, isCollapsed, hasChildren, onToggleCollapse } = data;

  const renderValue = (val: any) => {
    if (val === null) return <span className="prop-val-null">null</span>;
    if (typeof val === 'string') return <span className="prop-val-string">"{val}"</span>;
    if (typeof val === 'number') return <span className="prop-val-number">{val}</span>;
    if (typeof val === 'boolean') return <span className="prop-val-boolean">{val ? 'true' : 'false'}</span>;
    return <span className="prop-val-default">{String(val)}</span>;
  };

  return (
    <div className={`json-node ${isCollapsed ? 'collapsed' : ''}`}>
      <Handle type="target" position={Position.Left} style={{ visibility: 'hidden' }} />
      <div className="node-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{label}</span>
        {hasChildren && (
          <button 
            className="collapse-toggle" 
            onClick={(e) => {
              e.stopPropagation();
              onToggleCollapse?.(id);
            }}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--purple)',
              cursor: 'pointer',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease'
            }}
          >
            ▼
          </button>
        )}
      </div>
      {!isCollapsed && (
        <div className="node-content">
          {properties.length === 0 && !isArray && (
            <span style={{ color: 'var(--comment)', fontStyle: 'italic', fontSize: '0.75rem' }}>
              Empty object
            </span>
          )}
          {properties.map((prop: any, idx: number) => (
            <div key={idx} className="node-property">
              <span className="prop-key">{prop.key}:</span>
              <span className="prop-val">{renderValue(prop.value)}</span>
            </div>
          ))}
        </div>
      )}
      <Handle type="source" position={Position.Right} style={{ visibility: 'hidden' }} />
    </div>
  );
});

JsonNode.displayName = 'JsonNode';

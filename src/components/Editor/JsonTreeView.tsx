import React, { useState } from 'react';

interface JsonTreeViewProps {
  data: any;
  isLast?: boolean;
}

const getLabel = (data: any) => {
  if (Array.isArray(data)) return `Array [${data.length}]`;
  if (data === null) return 'null';
  if (typeof data === 'object') return 'Object';
  return typeof data;
};

const renderValue = (val: any, isLast: boolean) => {
  let className = 'json-tree-value-default';
  let displayVal = String(val);

  if (val === null) {
    className = 'json-tree-value-null';
  } else if (typeof val === 'string') {
    className = 'json-tree-value-string';
    displayVal = `"${val}"`;
  } else if (typeof val === 'number') {
    className = 'json-tree-value-number';
  } else if (typeof val === 'boolean') {
    className = 'json-tree-value-boolean';
  }

  return (
    <span className={className}>
      {displayVal}
      {!isLast && <span style={{ color: 'var(--fg)' }}>,</span>}
    </span>
  );
};

export const JsonTreeView: React.FC<JsonTreeViewProps> = ({ data, isLast = true }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isObject = data !== null && typeof data === 'object';

  if (!isObject) {
    return renderValue(data, isLast);
  }

  const isArray = Array.isArray(data);
  const entries = Object.entries(data);
  const isEmpty = entries.length === 0;

  return (
    <div className="json-tree-node">
      <div className="json-tree-header" onClick={() => !isEmpty && setIsCollapsed(!isCollapsed)}>
        {!isEmpty && (
          <span className={`json-tree-arrow ${isCollapsed ? 'collapsed' : ''}`}>▼</span>
        )}
        <span className="json-tree-brace">{isArray ? '[' : '{'}</span>
        {isCollapsed && (
          <span className="json-tree-summary" style={{ color: 'var(--comment)', fontSize: '0.8rem', margin: '0 4px' }}>
            {getLabel(data)}
          </span>
        )}
        {isCollapsed && <span className="json-tree-brace">{isArray ? ']' : '}'}</span>}
        {!isLast && isCollapsed && <span style={{ color: 'var(--fg)' }}>,</span>}
      </div>

      {!isCollapsed && (
        <div className="json-tree-content" style={{ paddingLeft: '1.5rem', borderLeft: '1px solid var(--border)', marginLeft: '0.4rem' }}>
          {entries.map(([key, value], idx) => (
            <div key={key} className="json-tree-row">
              {!isArray && (
                <>
                  <span className="json-tree-key">"{key}"</span>
                  <span style={{ color: 'var(--fg)', margin: '0 4px' }}>:</span>
                </>
              )}
              <JsonTreeView data={value} isLast={idx === entries.length - 1} />
            </div>
          ))}
        </div>
      )}

      {!isCollapsed && (
        <div className="json-tree-footer">
          <span className="json-tree-brace">{isArray ? ']' : '}'}</span>
          {!isLast && <span style={{ color: 'var(--fg)' }}>,</span>}
        </div>
      )}
    </div>
  );
};

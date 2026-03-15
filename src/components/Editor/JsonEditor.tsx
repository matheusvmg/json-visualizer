import React, { useEffect, useState } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { JsonTreeView } from './JsonTreeView';
import { useJsonParser } from '../../hooks/useJsonParser';

interface JsonEditorProps {
  content: string; // This is the RAW JSON or formatted string
  onChange?: (value: string) => void;
}

export const JsonEditor: React.FC<JsonEditorProps> = ({ content, onChange }) => {
  const [localContent, setLocalContent] = useState(content);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const { t } = useI18n();
  const { parseJson } = useJsonParser();

  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  const handleCopy = () => {
    navigator.clipboard.writeText(localContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = e.target.value;
    setLocalContent(newVal);
  };

  const handleSave = () => {
    onChange?.(localContent);
    setIsEditing(false);
  };

  const jsonResult = parseJson(localContent);
  const jsonObj = jsonResult.data;

  return (
    <div className="editor-panel">
      <div className="editor-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--comment)' }}>
            {t('json')}
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--comment)', opacity: 0.6 }}>
            {isEditing ? `(${t('edit')})` : ''}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {isEditing ? (
            <button className="save-btn" onClick={handleSave}>
              {t('save')}
            </button>
          ) : (
            <button className="copy-btn" onClick={() => setIsEditing(true)}>
              {t('edit')}
            </button>
          )}
          <button className="copy-btn" onClick={handleCopy}>
            {copied ? t('copied') : t('copy')}
          </button>
        </div>
      </div>
      <div className="editor-content" style={{ padding: isEditing ? '0' : '20px' }}>
        {isEditing ? (
          <textarea
            className="json-textarea"
            value={localContent}
            onChange={handleChange}
            spellCheck={false}
            autoComplete="off"
            autoFocus
          />
        ) : (
          <div style={{ padding: '4px', overflow: 'visible' }}>
            {jsonObj ? (
              <JsonTreeView data={jsonObj} />
            ) : (
              <div style={{ color: 'var(--red)', fontFamily: 'var(--mono)' }}>
                {t('error')}: Invalid JSON
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

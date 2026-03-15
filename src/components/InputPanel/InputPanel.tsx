import React, { useState } from 'react';
import { DropZone } from './DropZone';
import { PasteArea } from './PasteArea';
import { useJsonParser } from '../../hooks/useJsonParser';
import { useI18n } from '../../hooks/useI18n';

interface InputPanelProps {
  onSuccess: (data: { raw: string; formatted: string; data: any }) => void;
  onCancel?: () => void;
  showCancel?: boolean;
}

export const InputPanel: React.FC<InputPanelProps> = ({ onSuccess, onCancel, showCancel }) => {
  const { parseJson } = useJsonParser();
  const { t } = useI18n();
  const [error, setError] = useState<string | null>(null);

  const handleContent = (raw: string) => {
    const result = parseJson(raw);
    if (result.error) {
      setError(result.error);
    } else {
      onSuccess({
        raw,
        formatted: result.formatted,
        data: result.data
      });
    }
  };

  return (
    <div className="input-overlay">
      <div className="input-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h2 style={{ margin: 0 }}>{t('loadJson')}</h2>
          {showCancel && (
            <button className="cancel-btn" onClick={onCancel}>
              {t('cancel')}
            </button>
          )}
        </div>
        <DropZone onFileLoaded={handleContent} onError={setError} />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', margin: '10px 0' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }}></div>
          <span style={{ color: 'var(--comment)', fontSize: '0.8rem' }}>{t('orPaste')}</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }}></div>
        </div>

        <PasteArea onPaste={handleContent} />
        
        {error && (
          <div className="error-msg">
            {t('error')}: {error}
          </div>
        )}
      </div>
    </div>
  );
};

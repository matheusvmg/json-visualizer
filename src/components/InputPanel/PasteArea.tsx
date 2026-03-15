import React, { useState } from 'react';
import { useI18n } from '../../hooks/useI18n';

interface PasteAreaProps {
  onPaste: (content: string) => void;
}

export const PasteArea: React.FC<PasteAreaProps> = ({ onPaste }) => {
  const [content, setContent] = useState('');
  const { t } = useI18n();

  return (
    <div className="paste-area">
      <textarea
        placeholder={t('pasteHint')}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        className="visualize-btn"
        onClick={() => onPaste(content)}
        disabled={!content.trim()}
      >
        {t('visualize')}
      </button>
    </div>
  );
};

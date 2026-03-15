import React, { useState } from 'react';
import { useI18n } from '../../hooks/useI18n';

interface DropZoneProps {
  onFileLoaded: (content: string) => void;
  onError: (msg: string) => void;
}

export const DropZone: React.FC<DropZoneProps> = ({ onFileLoaded, onError }) => {
  const [isDragging, setIsDragging] = useState(false);
  const { t } = useI18n();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      onError(t('invalidFile'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onFileLoaded(content);
    };
    reader.onerror = () => {
      onError(t('readError'));
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div
      className={`drop-zone ${isDragging ? 'dragging' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById('fileInput')?.click()}
    >
      <input
        id="fileInput"
        type="file"
        accept=".json,application/json"
        style={{ display: 'none' }}
        onChange={handleFileInput}
      />
      <span style={{ fontSize: '2rem' }}>📁</span>
      <p>{t('dropHint')}</p>
      <span style={{ color: 'var(--comment)', fontSize: '0.8rem' }}>{t('browse')}</span>
    </div>
  );
};

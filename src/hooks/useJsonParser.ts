import { useCallback } from 'react';

export interface ParseResult {
  formatted: string;
  error: string | null;
  data: any;
}

export const useJsonParser = () => {
  const parseJson = useCallback((raw: string): ParseResult => {
    if (!raw || !raw.trim()) {
      return { formatted: '', error: null, data: null };
    }

    try {
      const data = JSON.parse(raw);
      const formatted = JSON.stringify(data, null, 2);
      return { formatted, error: null, data };
    } catch (e: any) {
      return {
        formatted: '',
        error: e.message || 'Invalid JSON format',
        data: null,
      };
    }
  }, []);

  return { parseJson };
};

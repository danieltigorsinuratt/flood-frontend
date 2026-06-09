'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const KEY = 'iot-api-base-url';

const IotApiHostContext = createContext({
  baseUrl: '',
  ingestUrl: '',
  saveIotApiBase: () => ({ ok: false, error: 'Not mounted' }),
  clearBaseUrl: () => {},
});

export function IotApiHostProvider({ children }) {
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(localStorage.getItem(KEY) || '');
    }
  }, []);

  const saveIotApiBase = useCallback((value) => {
    const trimmed = (value || '').trim();
    if (!trimmed) {
      return { ok: false, error: 'URL tidak boleh kosong.' };
    }
    try {
      const url = new URL(trimmed);
      const origin = url.origin;
      localStorage.setItem(KEY, origin);
      setBaseUrl(origin);
      return { ok: true };
    } catch {
      return { ok: false, error: 'URL tidak valid. Contoh: http://127.0.0.1:8000' };
    }
  }, []);

  const clearBaseUrl = useCallback(() => {
    localStorage.removeItem(KEY);
    setBaseUrl('');
  }, []);

  const ingestUrl = baseUrl ? `${baseUrl}/api/sensor-data` : '/api/sensor-data';

  return (
    <IotApiHostContext.Provider value={{ baseUrl, ingestUrl, saveIotApiBase, clearBaseUrl }}>
      {children}
    </IotApiHostContext.Provider>
  );
}

export function useIotApiHost() {
  return useContext(IotApiHostContext);
}

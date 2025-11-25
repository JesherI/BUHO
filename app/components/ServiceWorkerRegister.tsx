'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      const url = '/sw.js';
      navigator.serviceWorker.register(url).catch(() => {});
    }
  }, []);
  return null;
}

'use client';

import { useEffect } from 'react';

// Registers the app-shell precache service worker (Constraint 5: fully usable
// offline after first visit). No-op during SSR / static export build.
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
    const onLoad = () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        /* offline support is progressive enhancement — ignore failures */
      });
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);
  return null;
}

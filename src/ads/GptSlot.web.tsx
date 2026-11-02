/**
 * Slot quảng cáo Google Publisher Tag (GPT) cho bản web.
 * Nếu GPT không tải được / không có quảng cáo trong WEB_AD_TIMEOUT_MS thì
 * hiển thị `fallback` (khung giả lập).
 */

import React, { useEffect, useRef, useState } from 'react';
import { WEB_AD_TIMEOUT_MS, WEB_GPT_SRC } from './adConfig';

let gptPromise: Promise<any> | null = null;
let slotCounter = 0;

const loadGpt = (): Promise<any> => {
  if (!gptPromise) {
    gptPromise = new Promise((resolve, reject) => {
      const w = window as any;
      w.googletag = w.googletag || { cmd: [] };
      const script = document.createElement('script');
      script.async = true;
      script.src = WEB_GPT_SRC;
      script.onerror = () => reject(new Error('GPT load failed'));
      document.head.appendChild(script);
      w.googletag.cmd.push(() => resolve(w.googletag));
    });
  }
  return gptPromise;
};

interface GptSlotProps {
  unitPath: string;
  sizes: [number, number][];
  fallback: React.ReactNode;
  testID?: string;
}

export const GptSlot: React.FC<GptSlotProps> = ({ unitPath, sizes, fallback, testID }) => {
  const idRef = useRef(`gpt-slot-${++slotCounter}`);
  const [status, setStatus] = useState<'loading' | 'filled' | 'failed'>('loading');

  useEffect(() => {
    let slot: any = null;
    let cancelled = false;
    const timer = setTimeout(() => {
      setStatus(s => (s === 'filled' ? s : 'failed'));
    }, WEB_AD_TIMEOUT_MS);

    loadGpt()
      .then(googletag => {
        if (cancelled) return;
        slot = googletag.defineSlot(unitPath, sizes, idRef.current);
        if (!slot) {
          setStatus('failed');
          return;
        }
        slot.addService(googletag.pubads());
        googletag.pubads().addEventListener('slotRenderEnded', (e: any) => {
          if (e.slot !== slot || cancelled) return;
          setStatus(e.isEmpty ? 'failed' : 'filled');
        });
        googletag.enableServices();
        googletag.display(idRef.current);
      })
      .catch(() => setStatus('failed'));

    return () => {
      cancelled = true;
      clearTimeout(timer);
      const googletag = (window as any).googletag;
      if (slot && googletag?.destroySlots) googletag.destroySlots([slot]);
    };
  }, [unitPath]);

  return (
    <div
      data-testid={testID}
      data-ad-status={status}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      {/* GPT chèn quảng cáo vào div này, ẩn đi khi dùng fallback */}
      <div id={idRef.current} style={{ display: status === 'failed' ? 'none' : 'block' }} />
      {status === 'failed' ? fallback : null}
    </div>
  );
};

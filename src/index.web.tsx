/// <reference lib="dom" />
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Alert } from 'react-native';

// Polyfill Alert.alert for Web because react-native-web has empty alert()
if (typeof window !== 'undefined') {
  (Alert as any).alert = (title?: string, message?: string, buttons?: any[]) => {
    const text = [title, message].filter(Boolean).join('\n\n');
    if (!buttons || buttons.length === 0) {
      window.alert(text);
      return;
    }
    if (buttons.length === 1) {
      window.alert(text);
      buttons[0]?.onPress?.();
      return;
    }
    const cancelBtn = buttons.find((b: any) => b.style === 'cancel');
    const actionBtn = buttons.find((b: any) => b.style !== 'cancel') || buttons[buttons.length - 1];
    const ok = window.confirm(text);
    if (ok) {
      actionBtn?.onPress?.();
    } else {
      cancelBtn?.onPress?.();
    }
  };
}

window.addEventListener('error', (event) => {
  console.error('CRITICAL WINDOW ERROR:', event.error || event.message);
  const container = document.getElementById('root');
  if (container) {
    container.innerHTML = `
      <div style="padding: 24px; color: #DC2626; font-family: sans-serif; background: #FEF2F2; height: 100%; overflow: auto;">
        <h3 style="margin-top: 0; font-size: 18px;">⚠️ Phát hiện lỗi hiển thị (Runtime Error):</h3>
        <p style="font-size: 13px; font-weight: 700; color: #991B1B;">${event.message || 'Unknown error'}</p>
        <pre style="white-space: pre-wrap; font-size: 11px; color: #7F1D1D; background: #FEE2E2; padding: 12px; border-radius: 8px;">${event.error?.stack || event.error || event.message}</pre>
      </div>
    `;
  }
});

async function bootstrap() {
  try {
    const { default: App } = await import('../App');
    const container = document.getElementById('root');
    if (container) {
      const root = createRoot(container);
      root.render(<App />);
    }
  } catch (err: any) {
    console.error('BOOTSTRAP ERROR:', err);
    const container = document.getElementById('root');
    if (container) {
      container.innerHTML = `
        <div style="padding: 24px; color: #DC2626; font-family: sans-serif; background: #FEF2F2; height: 100%; overflow: auto;">
          <h3 style="margin-top: 0; font-size: 18px;">⚠️ Lỗi nạp ứng dụng (Import Error):</h3>
          <p style="font-size: 14px; font-weight: 700; color: #991B1B;">${err?.message || err}</p>
          <pre style="white-space: pre-wrap; font-size: 11px; color: #7F1D1D; background: #FEE2E2; padding: 12px; border-radius: 8px;">${err?.stack || err}</pre>
        </div>
      `;
    }
  }
}

bootstrap();

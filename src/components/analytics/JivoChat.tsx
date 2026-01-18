'use client';

/**
 * JivoChat Live Chat Widget
 * 
 * Widget ID: sDLka2A5da
 */

import Script from 'next/script';

const JIVO_WIDGET_ID = process.env.NEXT_PUBLIC_JIVO_WIDGET_ID || 'sDLka2A5da';

export function JivoChat() {
  if (!JIVO_WIDGET_ID) return null;

  return (
    <Script
      id="jivo-chat"
      src={`//code.jivosite.com/widget/${JIVO_WIDGET_ID}`}
      strategy="lazyOnload"
      async
    />
  );
}

// ============================================
// JIVO API FONKSİYONLARI
// ============================================

declare global {
  interface Window {
    jivo_api?: {
      open: () => void;
      close: () => void;
      setContactInfo: (info: {
        name?: string;
        email?: string;
        phone?: string;
        description?: string;
      }) => void;
      setCustomData: (data: Array<{ title: string; content: string }>) => void;
    };
  }
}

/**
 * Chat penceresini aç
 */
export function openJivoChat() {
  if (typeof window !== 'undefined' && window.jivo_api) {
    window.jivo_api.open();
  }
}

/**
 * Chat penceresini kapat
 */
export function closeJivoChat() {
  if (typeof window !== 'undefined' && window.jivo_api) {
    window.jivo_api.close();
  }
}

/**
 * Kullanıcı bilgilerini JivoChat'e gönder
 */
export function setJivoContactInfo(info: {
  name?: string;
  email?: string;
  phone?: string;
  description?: string;
}) {
  if (typeof window !== 'undefined' && window.jivo_api) {
    window.jivo_api.setContactInfo(info);
  }
}

/**
 * Özel veri gönder (plan bilgisi, kredi bakiyesi vb.)
 */
export function setJivoCustomData(data: Array<{ title: string; content: string }>) {
  if (typeof window !== 'undefined' && window.jivo_api) {
    window.jivo_api.setCustomData(data);
  }
}

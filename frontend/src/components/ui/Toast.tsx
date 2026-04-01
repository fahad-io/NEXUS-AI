'use client';
import { useState, useEffect, useCallback } from 'react';

interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

let _addToast: ((msg: string, type?: ToastItem['type']) => void) | null = null;

export function toast(message: string, type: ToastItem['type'] = 'info') {
  if (_addToast) _addToast(message, type);
}

const COLORS: Record<ToastItem['type'], { bg: string; color: string; border: string }> = {
  success: { bg: '#DCFCE7', color: '#166534', border: '#86EFAC' },
  error: { bg: '#FEE2E2', color: '#991B1B', border: '#FCA5A5' },
  info: { bg: 'var(--white)', color: 'var(--text)', border: 'var(--border2)' },
};

export default function ToastProvider() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((message: string, type: ToastItem['type'] = 'info') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  useEffect(() => {
    _addToast = addToast;
    return () => { _addToast = null; };
  }, [addToast]);

  if (!toasts.length) return null;

  return (
    <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {toasts.map(t => {
        const c = COLORS[t.type];
        return (
          <div key={t.id} style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}`, borderRadius: 'var(--radius)', padding: '0.75rem 1.25rem', fontSize: '0.85rem', fontWeight: 500, boxShadow: 'var(--shadow-md)', animation: 'fadeUp 0.2s ease', maxWidth: 320 }}>
            {t.message}
          </div>
        );
      })}
    </div>
  );
}

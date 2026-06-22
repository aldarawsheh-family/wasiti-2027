// ══════════════════════════════════════════════════
// WASITI 2027 — Frontend — useI18n
// ══════════════════════════════════════════════════

'use client';
import { useState } from 'react';
import ar from '../i18n/ar.json';
import en from '../i18n/en.json';

const messages: any = { ar, en };

export function useI18n() {
  const [locale, setLocale] = useState('ar');
  const t = (key: string) => {
    const keys = key.split('.');
    let value = messages[locale];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };
  return { locale, setLocale, t };
}
// ══════════════════════════════════════════════════
// WASITI 2027 — Frontend — useAuth
// ══════════════════════════════════════════════════

'use client';
import { useState } from 'react';

export function useAuth() {
  const [user, setUser] = useState(null);
  return { user, login: (u: any) => setUser(u), logout: () => setUser(null) };
}
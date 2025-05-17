'use client';

import { useEffect } from 'react';
import { logTokenAccess } from '@/lib/logAccess';

export function TokenTracker({ token }: { token: string }) {
  useEffect(() => {
    logTokenAccess(token);
  }, [token]);

  return null;
}

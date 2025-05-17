export async function logTokenAccess(token: string) {
  try {
    await fetch('/api/track-access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
  } catch (err) {
    console.error('Failed to log access', err);
  }
}

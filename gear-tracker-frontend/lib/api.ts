const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

export async function fetchIEMs() {
  const res = await fetch(`${API_BASE}/iems`);
  if (!res.ok) throw new Error('Failed to fetch IEMs');
  return res.json();
}

export async function linkGear(iemId: number, cableId: number) {
  const res = await fetch(`${API_BASE}/link-hardware`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ iemId, cableId }),
  });
  if (!res.ok) throw new Error('Failed to link hardware');
  return res.json();
}
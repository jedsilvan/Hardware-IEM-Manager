const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function fetchIEMs() {
  const res = await fetch(`${API_BASE}/iems`);
  if (!res.ok) throw new Error('Failed to fetch IEMs');
  return res.json();
}

export async function fetchCables() {
  const res = await fetch(`${API_BASE}/cables`);
  if (!res.ok) throw new Error('Failed to fetch cables');
  return res.json();
}

export async function createIEM(data: { brand: string; model: string; connector: string }) {
  const res = await fetch(`${API_BASE}/iems`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create IEM');
  return res.json();
}

export async function createCable(data: { name: string; connector: string; material?: string }) {
  const res = await fetch(`${API_BASE}/cables`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create cable');
  return res.json();
}

export async function linkCableToIEM(iemId: number, cableId: number) {
  const res = await fetch(`${API_BASE}/iems/${iemId}/cables/${cableId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Failed to link cable');
  return res.json();
}
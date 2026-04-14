const browserApiBase = 'http://localhost:3001';
const serverApiBase = process.env.API_INTERNAL_URL || browserApiBase;
const apiBase = typeof window === 'undefined' ? serverApiBase : browserApiBase;

export async function fetchIEMs() {
  const res = await fetch(`${apiBase}/iems`);
  if (!res.ok) throw new Error('Failed to fetch IEMs');
  return res.json();
}

export async function fetchCables() {
  const res = await fetch(`${apiBase}/cables`);
  if (!res.ok) throw new Error('Failed to fetch cables');
  return res.json();
}

export async function createIEM(data: { brand: string; model: string; connector: string }) {
  const res = await fetch(`${apiBase}/iems`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create IEM');
  return res.json();
}

export async function createCable(data: { name: string; connector: string; material?: string }) {
  const res = await fetch(`${apiBase}/cables`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create cable');
  return res.json();
}

export async function linkCableToIEM(iemId: number, cableId: number) {
  const res = await fetch(`${apiBase}/iems/${iemId}/cables/${cableId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Failed to link cable');
  return res.json();
}
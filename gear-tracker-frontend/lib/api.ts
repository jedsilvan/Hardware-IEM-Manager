const browserApiBase = 'http://localhost:3001';
const serverApiBase = process.env.API_INTERNAL_URL || browserApiBase;
const apiBase = typeof window === 'undefined' ? serverApiBase : browserApiBase;

export type ConnectorType = '0.78mm' | 'MMCX' | 'QDC';

export type Cable = {
  id: number;
  name: string;
  connector: ConnectorType;
  material?: string | null;
  image?: string | null;
};

export type IEM = {
  id: number;
  brand: string;
  model: string;
  connector: ConnectorType;
  image?: string | null;
  compatibleCables: Cable[];
};

async function getApiErrorMessage(res: Response, fallbackMessage: string) {
  try {
    const body = (await res.json()) as { error?: string };
    return body.error || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
}

export async function fetchIEMs(): Promise<IEM[]> {
  try {
    const res = await fetch(`${apiBase}/iems`);
    if (!res.ok) return [];
    return res.json() as Promise<IEM[]>;
  } catch {
    return [];
  }
}

export async function fetchIEMById(iemId: number) {
  const res = await fetch(`${apiBase}/iems/${iemId}`);

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) throw new Error('Failed to fetch IEM');
  return res.json() as Promise<IEM>;
}

export async function fetchCables(): Promise<Cable[]> {
  try {
    const res = await fetch(`${apiBase}/cables`);
    if (!res.ok) return [];
    return res.json() as Promise<Cable[]>;
  } catch {
    return [];
  }
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

export async function updateIEM(iemId: number, data: { brand: string; model: string; connector: string }) {
  const res = await fetch(`${apiBase}/iems/${iemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(await getApiErrorMessage(res, 'Failed to update IEM'));
  }

  return res.json() as Promise<IEM>;
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

  if (!res.ok) {
    throw new Error(await getApiErrorMessage(res, 'Failed to link cable'));
  }

  return res.json();
}
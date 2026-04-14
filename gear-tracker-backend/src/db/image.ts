function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.trim().replace('#', '')

  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
    return `rgba(248, 250, 252, ${alpha})`
  }

  const r = parseInt(normalized.slice(0, 2), 16)
  const g = parseInt(normalized.slice(2, 4), 16)
  const b = parseInt(normalized.slice(4, 6), 16)

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function createImageDataUrl(title: string, accent: string) {
  const safeTitle = escapeXml(title)
  const titleColor = hexToRgba(accent, 1)

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
      <rect width="1200" height="800" fill="#0f172a" />
      <rect x="70" y="70" width="1060" height="660" rx="36" fill="#111827" />
      <text x="600" y="420" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="70" font-weight="700" fill="${titleColor}">${safeTitle}</text>
    </svg>
  `

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

export function getConnectorAccent(connector: '0.78mm' | 'MMCX' | 'QDC') {
  if (connector === '0.78mm') {
    return '#38bdf8'
  }

  if (connector === 'MMCX') {
    return '#f97316'
  }

  return '#f59e0b'
}

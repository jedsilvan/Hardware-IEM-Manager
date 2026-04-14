import type { ConnectorType } from '@/lib/api'

type CableAccent = {
  frame: string
  compatiblePill: string
  checkbox: string
}

const accentByConnector: Record<ConnectorType, CableAccent> = {
  '0.78mm': {
    frame: 'border-cyan-200/80 dark:border-cyan-900/70',
    compatiblePill:
      'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/80 dark:text-cyan-300',
    checkbox: 'accent-cyan-500',
  },
  MMCX: {
    frame: 'border-amber-200/80 dark:border-amber-900/70',
    compatiblePill:
      'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300',
    checkbox: 'accent-amber-500',
  },
  QDC: {
    frame: 'border-fuchsia-200/80 dark:border-fuchsia-900/70',
    compatiblePill:
      'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-950/80 dark:text-fuchsia-300',
    checkbox: 'accent-fuchsia-500',
  },
}

export function getCableAccent(connector: ConnectorType): CableAccent {
  return accentByConnector[connector]
}

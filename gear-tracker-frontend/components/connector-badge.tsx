import { Circle, Radio, Triangle } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { ConnectorType } from '@/lib/api'

const connectorConfig: Record<ConnectorType, { icon: typeof Circle; className: string }> = {
  '0.78mm': {
    icon: Circle,
    className:
      'border-cyan-200 bg-cyan-100/70 text-cyan-800 dark:border-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300',
  },
  MMCX: {
    icon: Radio,
    className:
      'border-amber-200 bg-amber-100/70 text-amber-800 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
  },
  QDC: {
    icon: Triangle,
    className:
      'border-fuchsia-200 bg-fuchsia-100/70 text-fuchsia-800 dark:border-fuchsia-800 dark:bg-fuchsia-950/60 dark:text-fuchsia-300',
  },
}

type ConnectorBadgeProps = {
  connector: ConnectorType
  className?: string
}

export function ConnectorBadge({ connector, className }: ConnectorBadgeProps) {
  const { icon: Icon, className: connectorClassName } = connectorConfig[connector]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide',
        connectorClassName,
        className
      )}
    >
      <Icon className="size-3.5" />
      {connector}
    </span>
  )
}
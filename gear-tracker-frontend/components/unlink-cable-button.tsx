'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { unlinkCableFromIEM } from '@/lib/api'

type UnlinkCableButtonProps = {
  iemId: number
  cableId: number
}

export function UnlinkCableButton({ iemId, cableId }: UnlinkCableButtonProps) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)

  async function handleUnlink() {
    const confirmed = globalThis.confirm('Remove this cable relationship from the IEM?')

    if (!confirmed) {
      return
    }

    setSubmitting(true)

    try {
      await unlinkCableFromIEM(iemId, cableId)
      router.refresh()
    } catch (error) {
      globalThis.alert(error instanceof Error ? error.message : 'Failed to remove relationship')
      setSubmitting(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleUnlink}
      disabled={submitting}
      className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-800"
    >
      {submitting ? 'Removing...' : 'Remove Link'}
    </button>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { deleteCable } from '@/lib/api'

type DeleteCableButtonProps = {
  cableId: number
}

export function DeleteCableButton({ cableId }: DeleteCableButtonProps) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)

  async function handleDelete() {
    const confirmed = globalThis.confirm(
      'Delete this cable? This will also remove all rows from the relationship table for this cable.'
    )

    if (!confirmed) {
      return
    }

    setSubmitting(true)

    try {
      await deleteCable(cableId)
      router.refresh()
    } catch (error) {
      globalThis.alert(error instanceof Error ? error.message : 'Failed to delete cable')
      setSubmitting(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={submitting}
      className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60 dark:border-red-900 dark:bg-red-950/60 dark:text-red-300 dark:hover:bg-red-900/60"
    >
      {submitting ? 'Deleting...' : 'Delete'}
    </button>
  )
}

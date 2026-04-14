'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { deleteIEM } from '@/lib/api'

type DeleteIemButtonProps = {
  iemId: number
}

export function DeleteIemButton({ iemId }: DeleteIemButtonProps) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)

  async function handleDelete() {
    const confirmed = globalThis.confirm(
      'Delete this IEM? This will also remove all rows from the relationship table for this IEM.'
    )

    if (!confirmed) {
      return
    }

    setSubmitting(true)

    try {
      await deleteIEM(iemId)
      router.push('/')
    } catch (error) {
      globalThis.alert(error instanceof Error ? error.message : 'Failed to delete IEM')
      setSubmitting(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={submitting}
      className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-60 dark:border-red-900 dark:bg-red-950/60 dark:text-red-300 dark:hover:bg-red-900/60"
    >
      {submitting ? 'Deleting...' : 'Delete IEM'}
    </button>
  )
}

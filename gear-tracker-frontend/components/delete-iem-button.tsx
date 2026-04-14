'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { deleteIEM } from '@/lib/api'

type DeleteIemButtonProps = {
  iemId: number
}

export function DeleteIemButton({ iemId }: DeleteIemButtonProps) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)

  async function handleDelete() {
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
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          disabled={submitting}
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-60 dark:border-red-900 dark:bg-red-950/60 dark:text-red-300 dark:hover:bg-red-900/60"
        >
          {submitting ? 'Deleting...' : 'Delete IEM'}
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this IEM?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The IEM will be deleted and all related rows in the
            relationship table will be removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={submitting}>
            {submitting ? 'Deleting...' : 'Delete IEM'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

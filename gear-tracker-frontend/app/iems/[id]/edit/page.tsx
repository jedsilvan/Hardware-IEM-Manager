'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

import { fetchIEMById, type ConnectorType, updateIEM } from '@/lib/api'

const CONNECTORS: ConnectorType[] = ['0.78mm', 'MMCX', 'QDC']

export default function EditIEMPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const iemId = Number(params.id)

  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [connector, setConnector] = useState<ConnectorType>('0.78mm')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (Number.isNaN(iemId)) {
      setNotFound(true)
      setLoading(false)
      return
    }

    fetchIEMById(iemId)
      .then((iem) => {
        if (!iem) {
          setNotFound(true)
          return
        }

        setBrand(iem.brand)
        setModel(iem.model)
        setConnector(iem.connector)
      })
      .catch(() => {
        setError('Failed to load IEM details.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [iemId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!brand.trim() || !model.trim() || Number.isNaN(iemId)) return

    setSubmitting(true)
    setError(null)

    try {
      await updateIEM(iemId, {
        brand: brand.trim(),
        model: model.trim(),
        connector,
      })
      router.push(`/iems/${iemId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-zinc-50 font-geist-sans text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
        <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 py-10 sm:px-10">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading IEM details...</p>
        </main>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="bg-zinc-50 font-geist-sans text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
        <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 py-10 sm:px-10">
          <h1 className="text-2xl font-bold tracking-tight">IEM not found</h1>
          <Link
            href="/"
            className="w-fit rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-800"
          >
            Back to Dashboard
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div className="bg-zinc-50 font-geist-sans text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-10 sm:px-10">
        <div className="flex items-center gap-4">
          <Link
            href={`/iems/${iemId}`}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-800"
          >
            Back
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Edit IEM</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-base font-semibold">Details</h2>

            <div className="space-y-1.5">
              <label htmlFor="brand" className="text-sm font-medium">
                Brand
              </label>
              <input
                id="brand"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-500"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="model" className="text-sm font-medium">
                Model
              </label>
              <input
                id="model"
                required
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-500"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="connector" className="text-sm font-medium">
                Connector
              </label>
              <select
                id="connector"
                value={connector}
                onChange={(e) => setConnector(e.target.value as ConnectorType)}
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-500"
              >
                {CONNECTORS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3">
            <Link
              href={`/iems/${iemId}`}
              className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-800"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              {submitting ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import { ConnectorBadge } from '@/components/connector-badge'
import { createIEM, fetchCables, linkCableToIEM, type Cable, type ConnectorType } from '@/lib/api'
import { getCableAccent } from '@/lib/cable-accent'
import { cn } from '@/lib/utils'

const CONNECTORS: ConnectorType[] = ['0.78mm', 'MMCX', 'QDC']

export default function NewIEMPage() {
  const router = useRouter()

  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [connector, setConnector] = useState<ConnectorType>('0.78mm')
  const [allCables, setAllCables] = useState<Cable[]>([])
  const [deselectedCableIds, setDeselectedCableIds] = useState<Set<number>>(new Set())
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCables().then(setAllCables)
  }, [])

  const matchingCables = allCables.filter((c) => c.connector === connector)
  const otherCables = allCables.filter((c) => c.connector !== connector)
  const selectedCableIds = new Set(
    matchingCables.map((cable) => cable.id).filter((id) => !deselectedCableIds.has(id))
  )
  const selectedConnectorAccent = getCableAccent(connector)

  function toggleCable(id: number) {
    setDeselectedCableIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!brand.trim() || !model.trim()) return

    setSubmitting(true)
    setError(null)
    try {
      const [newIem] = await createIEM({ brand: brand.trim(), model: model.trim(), connector })
      await Promise.all([...selectedCableIds].map((cableId) => linkCableToIEM(newIem.id, cableId)))
      router.push(`/iems/${newIem.id}`)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-zinc-50 font-geist-sans text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-10 sm:px-10">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-800"
          >
            Back
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Add IEM</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Details */}
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
                placeholder="e.g. Moondrop"
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
                placeholder="e.g. Blessing 3"
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
                onChange={(e) => {
                  setConnector(e.target.value as ConnectorType)
                  setDeselectedCableIds(new Set())
                }}
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

          {/* Compatible cables */}
          {allCables.length > 0 && (
            <div className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <div>
                <h2 className="text-base font-semibold">Compatible Cables</h2>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  Only cables with the same connector type can be linked to this IEM.
                </p>
              </div>

              {matchingCables.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                    Matching connector
                  </p>
                  {matchingCables.map((cable) => (
                    <label
                      key={cable.id}
                      className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-100 p-3 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900/60"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCableIds.has(cable.id)}
                        onChange={() => toggleCable(cable.id)}
                        className={cn('h-4 w-4', selectedConnectorAccent.checkbox)}
                      />
                      <span className="flex-1 text-sm font-medium">{cable.name}</span>
                      <ConnectorBadge connector={cable.connector} />
                    </label>
                  ))}
                </div>
              )}

              {otherCables.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                    Unavailable for this connector
                  </p>
                  {otherCables.map((cable) => (
                    <div
                      key={cable.id}
                      className="flex items-center gap-3 rounded-lg border border-zinc-100 p-3 opacity-60 dark:border-zinc-800"
                    >
                      <span className="rounded-full bg-zinc-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                        Mismatch
                      </span>
                      <span className="flex-1 text-sm font-medium">{cable.name}</span>
                      <ConnectorBadge connector={cable.connector} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3">
            <Link
              href="/"
              className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-800"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              {submitting ? 'Saving…' : 'Add IEM'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

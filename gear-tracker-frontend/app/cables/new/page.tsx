'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import { createCable, type ConnectorType } from '@/lib/api'

const CONNECTORS: ConnectorType[] = ['0.78mm', 'MMCX', 'QDC']

export default function NewCablePage() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [connector, setConnector] = useState<ConnectorType>('0.78mm')
  const [material, setMaterial] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setSubmitting(true)
    setError(null)
    try {
      await createCable({ name: name.trim(), connector, material: material.trim() || undefined })
      router.push('/#cables')
    } catch {
      setError('Something went wrong. Please try again.')
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
          <h1 className="text-2xl font-bold tracking-tight">Add Cable</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-base font-semibold">Details</h2>

            <div className="space-y-1.5">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <input
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Effect Audio Ares S"
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

            <div className="space-y-1.5">
              <label htmlFor="material" className="text-sm font-medium">
                Material <span className="font-normal text-zinc-400">(optional)</span>
              </label>
              <input
                id="material"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="e.g. Copper Litz"
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-500"
              />
            </div>
          </div>

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
              {submitting ? 'Saving…' : 'Add Cable'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

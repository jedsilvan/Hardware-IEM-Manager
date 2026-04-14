import Image from 'next/image'
import Link from 'next/link'
import { Plus } from 'lucide-react'

import { ConnectorBadge } from '@/components/connector-badge'
import { fetchCables, fetchIEMs, type Cable, type IEM } from '@/lib/api'
import { getCableAccent } from '@/lib/cable-accent'
import { cn } from '@/lib/utils'

export default async function Dashboard() {
  const [iems, cables] = await Promise.all([fetchIEMs(), fetchCables()])
  const iemsWithImages = iems.filter((iem) => Boolean(iem.image))
  const cablesWithImages = cables.filter((cable) => Boolean(cable.image))

  return (
    <div className="bg-zinc-50 font-geist-sans text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-12 sm:px-10">
        <header className="space-y-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Hardware IEM Manager</h1>
          <p className="max-w-3xl text-sm text-zinc-600 dark:text-zinc-400">
            Explore your IEM collection, connector compatibility, and available cables. Open any IEM to
            view all compatible cable options in detail.
          </p>
          <div className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-950">
            <a
              href="#iems"
              className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-semibold text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900"
            >
              IEMs
            </a>
            <a
              href="#cables"
              className="rounded-lg px-3 py-1.5 text-sm font-semibold text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Cables
            </a>
          </div>
        </header>

        <section id="iems" className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-baseline gap-3">
              <h2 className="text-2xl font-semibold">IEMs</h2>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                {iemsWithImages.length} items
              </p>
            </div>
            <Link
              href="/iems/new"
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-800"
            >
              <Plus className="h-3.5 w-3.5" />
              Add IEM
            </Link>
          </div>

          {iemsWithImages.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-zinc-300 py-20 text-center dark:border-zinc-700">
              <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">No IEMs found</p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500">Run the seed script or add an IEM to get started.</p>
            </div>
          ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {iemsWithImages.map((iem: IEM) => {
              const accent = getCableAccent(iem.connector)

              return (
                <Link
                  key={iem.id}
                  href={`/iems/${iem.id}`}
                  className={cn(
                    'group overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:bg-zinc-950',
                    accent.frame
                  )}
                >
                  <Image
                    src={iem.image!}
                    alt={`${iem.brand} ${iem.model}`}
                    width={1200}
                    height={800}
                    className="h-60 w-full object-cover"
                  />
                  <div className="space-y-3 p-4">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                      {iem.brand} {iem.model}
                    </h3>
                    <div className="flex items-center justify-between gap-3">
                      <ConnectorBadge connector={iem.connector} />
                      <span className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500 dark:text-zinc-400">
                        {iem.compatibleCables.length} compatible
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
          )}
        </section>

        <section id="cables" className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-baseline gap-3">
              <h2 className="text-2xl font-semibold">Cables</h2>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                {cablesWithImages.length} items
              </p>
            </div>
            <Link
              href="/cables/new"
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-800"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Cable
            </Link>
          </div>

          {cablesWithImages.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-zinc-300 py-20 text-center dark:border-zinc-700">
              <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">No cables found</p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500">Run the seed script or add a cable to get started.</p>
            </div>
          ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {cablesWithImages.map((cable: Cable) => {
              const accent = getCableAccent(cable.connector)

              return (
                <article
                  key={cable.id}
                  className={cn('overflow-hidden rounded-2xl border bg-white shadow-sm dark:bg-zinc-950', accent.frame)}
                >
                  <Image
                    src={cable.image!}
                    alt={cable.name}
                    width={1200}
                    height={800}
                    className="h-48 w-full object-cover"
                  />
                  <div className="space-y-3 p-4">
                    <h3 className="text-base font-semibold">{cable.name}</h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{cable.material || 'Cable'}</p>
                    <ConnectorBadge connector={cable.connector} />
                  </div>
                </article>
              )
            })}
          </div>
          )}
        </section>
      </main>
    </div>
  )
}

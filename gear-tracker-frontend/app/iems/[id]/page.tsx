import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ConnectorBadge } from '@/components/connector-badge'
import { fetchIEMById } from '@/lib/api'
import { getCableAccent } from '@/lib/cable-accent'
import { cn } from '@/lib/utils'

type IEMDetailPageProps = {
  params: Promise<{ id: string }>
}

export default async function IEMDetailPage({ params }: IEMDetailPageProps) {
  const { id } = await params
  const iemId = Number(id)

  if (Number.isNaN(iemId)) {
    notFound()
  }

  const iem = await fetchIEMById(iemId)

  if (!iem) {
    notFound()
  }

  return (
    <div className="bg-zinc-50 font-geist-sans text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:gap-8 sm:px-8 sm:py-10 lg:px-10">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/"
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-800"
          >
            Back to Dashboard
          </Link>
          <Link
            href={`/iems/${iem.id}/edit`}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-800"
          >
            Edit IEM
          </Link>
        </div>

        <section className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <article className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            {iem.image ? (
              <Image
                src={iem.image}
                alt={`${iem.brand} ${iem.model}`}
                width={1400}
                height={900}
                className="h-80 w-full object-cover"
              />
            ) : null}
            <div className="space-y-3 p-4 sm:p-6">
              <h1 className="text-3xl font-bold tracking-tight">
                {iem.brand} {iem.model}
              </h1>
              <div className="flex items-center gap-3">
                <ConnectorBadge connector={iem.connector} />
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  {iem.compatibleCables.length} compatible cables
                </span>
              </div>
            </div>
          </article>

          <aside className="h-fit rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-6">
            <h2 className="text-lg font-semibold">Compatibility</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Cables listed below are linked to this IEM through the compatibility table and share the same
              connector profile.
            </p>
          </aside>
        </section>

        <section className="space-y-4 sm:space-y-5">
          <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-end">
            <h2 className="text-2xl font-semibold">Compatible Cables</h2>
            <span className="text-xs uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
              larger preview cards
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {iem.compatibleCables.map((cable) => {
              const accent = getCableAccent(cable.connector)

              return (
              <article
                key={cable.id}
                className={cn('overflow-hidden rounded-2xl border bg-white shadow-sm dark:bg-zinc-950', accent.frame)}
              >
                {cable.image ? (
                  <Image
                    src={cable.image}
                    alt={cable.name}
                    width={1400}
                    height={900}
                    className="h-56 w-full object-cover sm:h-64"
                  />
                ) : null}
                <div className="space-y-3 p-4 sm:p-5">
                  <h3 className="text-lg font-semibold">{cable.name}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{cable.material || 'Cable'}</p>
                  <div className="flex items-center justify-between">
                    <ConnectorBadge connector={cable.connector} />
                    <span className={cn('rounded-full px-2.5 py-1 text-xs font-semibold', accent.compatiblePill)}>
                      Compatible
                    </span>
                  </div>
                </div>
              </article>
              )
            })}
          </div>
        </section>
      </main>
    </div>
  )
}

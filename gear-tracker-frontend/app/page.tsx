import Image from 'next/image'
import { fetchIEMs } from '@/lib/api'

export default async function Dashboard() {
  const iems = await fetchIEMs()

  console.log('IEMs:', iems)

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-geist-sans dark:bg-zinc-900">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-zinc-900 sm:items-start">
        <h1 className="text-5xl font-bold text-center sm:text-left">
          Welcome to <br />
          <span className="text-blue-600">Hardware IEM Manager</span>
        </h1>

        <Image
          src="https://images.crutchfield.com/products/large_487f41ff0c054827.jpg"
          alt="Hero Image"
          width={800}
          height={400}
          className="mt-10 rounded-lg shadow-lg"
        />
      </main>
    </div>
  )
}

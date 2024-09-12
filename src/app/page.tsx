import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Project Gutenberg Explorer</h1>
      <Link href="/explore" className="text-blue-500 hover:underline">
        Explore Books
      </Link>
    </main>
  )
}
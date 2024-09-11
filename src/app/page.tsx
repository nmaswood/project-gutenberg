import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Project Gutenberg Explorer</h1>
      <p>Enter a book ID to start exploring</p>
      <Link href="/explore" className="text-blue-500 hover:underline">
        Go to Explorer
      </Link>
    </main>
  )
}
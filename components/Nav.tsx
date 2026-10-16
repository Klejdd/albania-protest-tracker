'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Nav() {
  const pathname = usePathname()
  
  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <span className="text-red-500 text-2xl">⬆</span>
          Albania Protest Tracker
        </h1>
        <nav className="flex items-center gap-2">
          <Link href="/">
            <div className={`px-4 py-2 rounded-lg transition-colors ${pathname === '/' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}>
              Home
            </div>
          </Link>
          <Link href="/results">
            <div className={`px-4 py-2 rounded-lg transition-colors ${pathname === '/results' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}>
              Results
            </div>
          </Link>
        </nav>
      </div>
    </header>
  )
}

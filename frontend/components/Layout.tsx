import Link from 'next/link'
import React from 'react'

export const Layout: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return (
    <div>
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/"><a className="text-xl font-bold">Indive</a></Link>
          <nav className="space-x-4">
            <Link href="/cart"><a className="px-3 py-1 bg-blue-600 text-white rounded">Cart</a></Link>
          </nav>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
    </div>
  )
}

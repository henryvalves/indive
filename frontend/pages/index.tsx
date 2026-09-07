import React from 'react'
import { Layout } from '../components/Layout'
import { useRestaurants } from '../hooks/useRestaurants'
import Link from 'next/link'

export default function Home() {
  const { data, isLoading, error } = useRestaurants()

  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-4">Restaurants near you</h1>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error loading restaurants</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data?.map((r: any) => (
          <div key={r.id} className="bg-white rounded shadow p-4">
            <h2 className="text-lg font-bold">{r.name}</h2>
            <p className="text-sm text-gray-600">{r.address}</p>
            <div className="mt-3">
              <Link href={`/restaurant/${r.id}`}><a className="text-blue-600">View menu →</a></Link>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  )
}

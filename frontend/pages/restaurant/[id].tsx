import { useRouter } from 'next/router'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Layout } from '../../components/Layout'
import { useCart } from '../../context/CartContext'

const API = process.env.NEXT_PUBLIC_API_URL

export default function RestaurantPage() {
  const router = useRouter()
  const { id } = router.query
  const [restaurant, setRestaurant] = useState<any>(null)
  const { addItem } = useCart()

  useEffect(() => {
    if (!id) return
    axios.get(`${API}/restaurants/${id}`).then(r => setRestaurant(r.data))
  }, [id])

  if (!restaurant) return <Layout><div>Loading...</div></Layout>

  return (
    <Layout>
      <h1 className="text-2xl font-bold">{restaurant.name}</h1>
      <p className="text-sm text-gray-600">{restaurant.address}</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {restaurant.menuItems?.map((item: any) => (
          <div key={item.id} className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-sm text-gray-600">{item.description}</p>
            <div className="mt-2 flex items-center justify-between">
              <div className="text-lg font-bold">${(item.price/100).toFixed(2)}</div>
              <button onClick={() => addItem({...item, qty: 1})} className="bg-green-600 text-white px-3 py-1 rounded">Add</button>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  )
}

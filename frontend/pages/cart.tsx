import React from 'react'
import { Layout } from '../components/Layout'
import { useCart } from '../context/CartContext'
import axios from 'axios'
import { useRouter } from 'next/router'

const API = process.env.NEXT_PUBLIC_API_URL

export default function CartPage() {
  const { items, total, clear } = useCart()
  const router = useRouter()

  async function checkout() {
    const res = await axios.post(`${API}/checkout`, { items })
    const { orderId } = res.data
    router.push(`/orders/${orderId}`)
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      <div className="bg-white rounded shadow p-4">
        {items.length === 0 ? <div>Cart is empty</div> : (
          <>
            <ul>
              {items.map((it: any) => (
                <li key={it.id} className="py-2 border-b">
                  <div className="flex justify-between">
                    <div>{it.name} x {it.qty}</div>
                    <div>${((it.price * it.qty)/100).toFixed(2)}</div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between">
              <div className="font-bold">Total</div>
              <div className="font-bold">${(total/100).toFixed(2)}</div>
            </div>
            <div className="mt-4 flex space-x-3">
              <button onClick={checkout} className="bg-blue-600 text-white px-4 py-2 rounded">Checkout</button>
              <button onClick={clear} className="px-4 py-2 border rounded">Clear</button>
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}

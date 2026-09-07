import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'
import { Layout } from '../../components/Layout'

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL

export default function OrderPage() {
  const router = useRouter()
  const { id } = router.query
  const [order, setOrder] = useState<any>(null)
  const [driverLocation, setDriverLocation] = useState<{lat:number,lng:number}|null>(null)
  const socketRef = useRef<any>(null)
  const mapRef = useRef<any>(null)

  useEffect(() => {
    if (!id) return
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`).then(r=>r.json()).then(setOrder)

    socketRef.current = io(SOCKET_URL as string)
    socketRef.current.emit('joinOrder', { orderId: id })
    socketRef.current.on('driver:location', (data: any) => {
      setDriverLocation(data.location)
    })

    return () => {
      socketRef.current?.disconnect()
    }
  }, [id])

  useEffect(() => {
    if (!driverLocation) return
    if (!mapRef.current && (window as any).google) {
      mapRef.current = new (window as any).google.maps.Map(document.getElementById('map'), { center: driverLocation, zoom: 14 })
    }
    if (mapRef.current) {
      mapRef.current.setCenter(driverLocation)
      new (window as any).google.maps.Marker({ position: driverLocation, map: mapRef.current, title: 'Driver' })
    }
  }, [driverLocation])

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Order #{id}</h1>
      <div className="bg-white rounded shadow p-4">
        <div>Status: {order?.status ?? 'loading...'}</div>
        <div className="mt-4 h-64" id="map">Map loading...</div>
      </div>
    </Layout>
  )
}

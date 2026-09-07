import React, { createContext, useContext, useState } from 'react'

type CartItem = { id: string; name: string; price: number; qty: number }

const CartContext = createContext<any>(null)

export const CartProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([])

  function addItem(item: CartItem) {
    setItems(prev => {
      const found = prev.find(p => p.id === item.id)
      if (found) return prev.map(p => p.id === item.id ? { ...p, qty: p.qty + 1 } : p)
      return [...prev, item]
    })
  }

  function removeItem(id: string) {
    setItems(prev => prev.filter(p => p.id !== id))
  }

  function clear() {
    setItems([])
  }

  const total = items.reduce((s, x) => s + x.price * x.qty, 0)

  return <CartContext.Provider value={{ items, addItem, removeItem, clear, total }}>{children}</CartContext.Provider>
}

export function useCart() {
  return useContext(CartContext)
}

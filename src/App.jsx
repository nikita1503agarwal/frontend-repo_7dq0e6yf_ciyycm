import { useEffect, useMemo, useState } from 'react'
import Navbar from './components/Navbar'
import RestaurantCard from './components/RestaurantCard'
import RestaurantModal from './components/RestaurantModal'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function App() {
  const [restaurants, setRestaurants] = useState([])
  const [openRestaurant, setOpenRestaurant] = useState(null)
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API}/restaurants`)
        if (!res.ok) throw new Error('fetch failed')
        const data = await res.json()
        if (!data || data.length === 0) {
          // try seeding then fetch again
          await fetch(`${API}/seed`, { method: 'POST' })
          const res2 = await fetch(`${API}/restaurants`)
          const data2 = await res2.json()
          setRestaurants(data2)
        } else {
          setRestaurants(data)
        }
      } catch (e) {
        setRestaurants([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const addToCart = (restaurant, items) => {
    if (!items || items.length === 0) return
    setCart(prev => {
      const next = [...prev]
      const idx = next.findIndex(c => c.restaurant.id === restaurant.id)
      if (idx >= 0) {
        // merge quantities
        const qmap = { ...Object.fromEntries(next[idx].items.map(i => [i.menu_item_id, i.quantity])) }
        for (const it of items) qmap[it.menu_item_id] = (qmap[it.menu_item_id] || 0) + it.quantity
        next[idx].items = Object.entries(qmap).map(([menu_item_id, quantity]) => ({ menu_item_id, quantity }))
      } else {
        next.push({ restaurant, items })
      }
      return next
    })
  }

  const totals = useMemo(() => {
    // we don't have prices here; will compute on order submission backend-side
    return cart.reduce((acc) => acc, 0)
  }, [cart])

  const placeOrder = async () => {
    if (cart.length === 0) return
    const group = cart[0] // single-restaurant checkout for simplicity
    const payload = {
      restaurant_id: group.restaurant.id,
      items: group.items,
      customer_name: 'Demo User',
      customer_address: '123 Demo Street',
      customer_email: 'demo@example.com',
    }
    const res = await fetch(`${API}/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    const data = await res.json()
    alert(`Order placed! Total $${data.total} (status: ${data.status})`)
    setCart([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950">
      <Navbar cartCount={cart.reduce((n, g) => n + g.items.reduce((s, i) => s + i.quantity, 0), 0)} />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-4">Popular restaurants</h1>
        <p className="text-slate-300 mb-6">Browse and order from multiple cuisines around you.</p>

        {loading ? (
          <div className="text-slate-300">Loading restaurants...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map(r => (
              <RestaurantCard key={r.id} restaurant={r} onOpen={setOpenRestaurant} />
            ))}
          </div>
        )}

        {/* Cart */}
        <div id="cart" className="mt-10 bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
          <h2 className="text-white font-semibold mb-2">Your cart</h2>
          {cart.length === 0 ? (
            <p className="text-slate-400 text-sm">No items added yet.</p>
          ) : (
            <div className="space-y-2">
              {cart[0].items.map(i => (
                <div key={i.menu_item_id} className="flex items-center justify-between text-slate-200">
                  <span>Item {i.menu_item_id.slice(-4)} x {i.quantity}</span>
                </div>
              ))}
              <div className="flex justify-end">
                <button onClick={placeOrder} className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg">Place order</button>
              </div>
            </div>
          )}
        </div>
      </main>

      <RestaurantModal
        open={!!openRestaurant}
        onClose={() => setOpenRestaurant(null)}
        restaurant={openRestaurant}
        onAddToCart={addToCart}
      />
    </div>
  )
}

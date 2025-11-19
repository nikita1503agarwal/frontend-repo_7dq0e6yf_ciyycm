import { useEffect, useState } from 'react'
import { X, Plus, Minus } from 'lucide-react'

export default function RestaurantModal({ open, onClose, restaurant, onAddToCart }) {
  const [menu, setMenu] = useState([])
  const [qty, setQty] = useState({})

  useEffect(() => {
    if (open && restaurant) {
      fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/restaurants/${restaurant.id}/menu`)
        .then(r => r.json())
        .then(setMenu)
        .catch(() => setMenu([]))
    }
  }, [open, restaurant])

  if (!open || !restaurant) return null

  const inc = (id) => setQty(q => ({ ...q, [id]: (q[id] || 0) + 1 }))
  const dec = (id) => setQty(q => ({ ...q, [id]: Math.max(0, (q[id] || 0) - 1) }))

  return (
    <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden">
        <div className="relative">
          <img src={restaurant.image_url} alt={restaurant.name} className="w-full h-48 object-cover" />
          <button onClick={onClose} className="absolute top-3 right-3 bg-slate-900/70 hover:bg-slate-900 text-white p-2 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white text-xl font-semibold">{restaurant.name}</h2>
              <p className="text-slate-400 text-sm">{restaurant.cuisine} • ${restaurant.delivery_fee} delivery • {restaurant.eta_minutes} min</p>
            </div>
          </div>

          <div className="mt-4 grid gap-3">
            {menu.map(item => (
              <div key={item.id} className="flex items-center gap-4 bg-slate-800/50 border border-slate-700 rounded-xl p-3">
                {item.image_url && (
                  <img src={item.image_url} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-white font-medium">{item.name}</h4>
                    <span className="text-slate-200 font-semibold">${item.price.toFixed(2)}</span>
                  </div>
                  <p className="text-slate-400 text-sm">{item.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => dec(item.id)} className="px-2 py-1 rounded bg-slate-700 text-white"><Minus className="w-4 h-4" /></button>
                  <span className="w-6 text-center text-white">{qty[item.id] || 0}</span>
                  <button onClick={() => inc(item.id)} className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white"><Plus className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                const selected = Object.entries(qty)
                  .filter(([, q]) => q > 0)
                  .map(([id, q]) => ({ menu_item_id: id, quantity: q }))
                onAddToCart(restaurant, selected)
                onClose()
              }}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg"
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

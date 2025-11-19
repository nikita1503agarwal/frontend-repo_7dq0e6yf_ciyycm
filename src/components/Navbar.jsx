import { Link } from 'react-router-dom'
import { Bike, ShoppingCart, UtensilsCrossed } from 'lucide-react'

export default function Navbar({ cartCount = 0 }) {
  return (
    <header className="sticky top-0 z-20 bg-slate-900/80 backdrop-blur border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-white">
          <UtensilsCrossed className="w-6 h-6 text-blue-400" />
          <span className="font-semibold tracking-tight">SwiftEats</span>
        </Link>
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-2 text-sm text-slate-300">
            <Bike className="w-4 h-4 text-green-400" />
            <span>Fast delivery</span>
          </div>
          <Link to="#cart" className="relative text-slate-200 hover:text-white">
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}

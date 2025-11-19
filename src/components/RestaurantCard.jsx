import { Star } from 'lucide-react'

export default function RestaurantCard({ restaurant, onOpen }) {
  return (
    <button onClick={() => onOpen(restaurant)} className="group text-left bg-slate-800/60 hover:bg-slate-800 border border-slate-700 rounded-xl overflow-hidden transition-colors">
      <div className="aspect-video overflow-hidden">
        <img src={restaurant.image_url} alt={restaurant.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold tracking-tight">{restaurant.name}</h3>
          <div className="flex items-center gap-1 text-yellow-400 text-sm">
            <Star className="w-4 h-4 fill-yellow-400" />
            <span className="text-yellow-300">{restaurant.rating?.toFixed?.(1) || restaurant.rating}</span>
          </div>
        </div>
        <p className="text-slate-300 text-sm mt-1 line-clamp-2">{restaurant.description}</p>
        <div className="flex items-center justify-between text-slate-400 text-sm mt-3">
          <span>{restaurant.cuisine}</span>
          <span>{restaurant.eta_minutes} min • ${restaurant.delivery_fee}</span>
        </div>
      </div>
    </button>
  )
}

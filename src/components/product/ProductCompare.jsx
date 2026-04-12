import { X, BarChart2, ShoppingCart } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../store/cartSlice'
import { formatCurrency, imgUrl } from '../../utils/helpers'
import { Stars } from '../common'
import toast from 'react-hot-toast'

function ProductCompare({ products, onRemove, onClear }) {
  const dispatch = useDispatch()
  if (!products.length) return null

  const fields = ['price', 'category', 'stockQty']

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-brand-600 shadow-2xl animate-slide-up">
      <div className="page-container py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <BarChart2 size={16} className="text-brand-600" />
            Comparing {products.length} product{products.length > 1 ? 's' : ''} (max 3)
          </div>
          <button onClick={onClear} className="btn-ghost text-xs text-slate-500 gap-1">
            <X size={13} /> Clear all
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-1">
          {products.map(p => (
            <div key={p._id} className="flex-shrink-0 w-44 card p-3 relative">
              <button onClick={() => onRemove(p._id)}
                className="absolute top-2 right-2 w-5 h-5 bg-slate-100 hover:bg-red-100 text-slate-500 hover:text-red-600 rounded-full flex items-center justify-center transition-colors">
                <X size={11} />
              </button>
              <img src={imgUrl(p.images?.[0])} alt={p.name} className="w-full aspect-square object-cover rounded-lg mb-2 bg-slate-100" />
              <p className="text-xs font-semibold text-slate-800 line-clamp-2 mb-1">{p.name}</p>
              <p className="text-sm font-bold text-brand-600 mb-2">{formatCurrency(p.price)}</p>
              <button onClick={() => { dispatch(addToCart(p)); toast.success('Added to cart!') }}
                className="btn-primary w-full text-xs py-1.5 gap-1">
                <ShoppingCart size={12} /> Add
              </button>
            </div>
          ))}

          {/* Empty slots */}
          {Array.from({ length: Math.max(0, 3 - products.length) }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-44 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center min-h-[140px]">
              <p className="text-xs text-slate-400 text-center px-2">Add product to compare</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
export default ProductCompare;
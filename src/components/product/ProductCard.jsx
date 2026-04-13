import { Link } from 'react-router-dom'
import { ShoppingCart, Store, Heart } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../../store/cartSlice'
import { selectCurrentUser } from '../../store/authSlice'
import { formatCurrency, imgUrl, truncate } from '../../utils/helpers'
import { Stars } from '../common'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

function ProductCard({ product, showCompare, onCompare, isCompared }) {
  const dispatch = useDispatch()
  const user = useSelector(selectCurrentUser)
  const isBuyerOnly = !user?.role || user?.role === 'buyer'

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(addToCart(product))
    toast.success(`${product.name} added to cart!`)
  }

  return (
    <Link 
      to={`/products/${product._id}`}
      className="group block bg-white rounded-[1.25rem] overflow-hidden border border-slate-100/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgb(0,0,0,0.1)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full"
    >
      {/* ── Image Section ── */}
      <div className="relative aspect-square overflow-hidden bg-slate-50 isolate">
        <img
          src={imgUrl(product.images?.[0])}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
        />
        
        {/* Out of Stock Overlay */}
        {product.stockQty === 0 && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-10 transition-opacity">
            <span className="bg-white text-slate-900 text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">Out of Stock</span>
          </div>
        )}

        {/* Compare Checkbox */}
        {showCompare && (
          <button
            onClick={e => { e.preventDefault(); e.stopPropagation(); onCompare(product) }}
            className={`absolute top-3 left-3 w-7 h-7 rounded-lg border-[2.5px] flex items-center justify-center transition-all duration-200 z-20 shadow-sm
              ${isCompared ? 'bg-brand-600 border-brand-600' : 'bg-white/90 backdrop-blur-sm border-slate-300 hover:border-brand-400'}`}
          >
            {isCompared && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>}
          </button>
        )}

        {/* Quick Add Button */}
        {isBuyerOnly && product.stockQty > 0 && (
          <button 
            onClick={handleAddToCart}
            className="absolute bottom-3 right-3 w-10 h-10 bg-brand-600 text-white rounded-xl flex items-center justify-center
                       opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-[0_4px_12px_rgba(37,99,235,0.4)] z-20 hover:bg-brand-700 active:scale-95"
            aria-label="Add to cart"
          >
            <ShoppingCart size={18} strokeWidth={2.5} />
          </button>
        )}
      </div>

      {/* ── Content Section ── */}
      <div className="p-5 flex flex-col flex-1 gap-1.5 bg-white">
        {/* Category Label */}
        <span className="text-[11px] font-bold text-brand-600 uppercase tracking-widest bg-brand-50 w-fit px-2 py-0.5 rounded-md">
          {product.category}
        </span>

        {/* Title */}
        <h3 className="text-[15px] font-semibold text-slate-800 leading-snug line-clamp-2 mt-1 group-hover:text-brand-600 transition-colors">
          {product.name}
        </h3>

        {/* Vendor */}
        {product.vendorId?.storeName && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
            <Store size={12} className="text-slate-400" />
            <span className="truncate">{product.vendorId.storeName}</span>
          </div>
        )}

        {/* Footer (Price & Ratings) */}
        <div className="flex items-end justify-between mt-auto pt-4 border-t border-slate-50">
          <span className="font-display font-bold text-slate-900 text-[1.125rem] tracking-tight">
            {formatCurrency(product.price)}
          </span>
          <div className="flex flex-col items-end gap-0.5">
            <Stars rating={product.avgRating || 4} />
            <span className="text-[10px] text-slate-400 font-medium tracking-wide">({product.reviewCount || 0} reviews)</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard;
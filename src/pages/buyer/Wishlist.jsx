import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag, Trash2, Package } from 'lucide-react'
import { wishlistAPI } from '../../services/endpoints'
import { addToCart } from '../../store/cartSlice'
import { toggleWishlistItem } from '../../store/wishlistSlice'
import { PageLoader, EmptyState } from '../../components/common'
import { formatCurrency, imgUrl } from '../../utils/helpers'
import toast from 'react-hot-toast'

function Wishlist() {
  const dispatch = useDispatch()
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await wishlistAPI.getAll()
      setItems(data.wishlist || [])
    } catch { setItems([]) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleRemove = async (productId) => {
    dispatch(toggleWishlistItem(productId))
    setItems(prev => prev.filter(i => i._id !== productId))
    toast.success('Removed from wishlist')
  }

  const handleAddToCart = (item) => {
    if (item.stockQty <= 0) {
      toast.error('This product is out of stock')
      return
    }
    dispatch(addToCart(item))
    toast.success(`${item.name} added to cart!`)
  }

  if (loading) return <PageLoader />

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  }

  return (
    <motion.div initial="hidden" animate="show" variants={containerVariants} className="max-w-6xl mx-auto space-y-8">
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight">Saved Items</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">
            {items.length} product{items.length !== 1 ? 's' : ''} in your wishlist
          </p>
        </div>
      </motion.div>

      {items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Save products you love and come back to them later."
          action={<Link to="/products" className="btn-primary">Browse Products</Link>}
        />
      ) : (
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {items.map((item) => {
            const outOfStock = !item.stockQty || item.stockQty <= 0 || !item.isActive
            return (
              <div key={item._id} className="bg-white rounded-[1.5rem] border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden group hover:shadow-[0_12px_36px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
                <div className="relative aspect-square overflow-hidden bg-slate-50">
                  <Link to={`/products/${item._id}`}>
                    <img src={imgUrl(item.images?.[0])} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </Link>

                  <button
                    onClick={() => handleRemove(item._id)}
                    className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-md z-10"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 size={17} />
                  </button>

                  {outOfStock && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-[5]">
                      <span className="bg-white text-slate-900 font-bold text-xs px-5 py-2 rounded-full shadow-2xl uppercase tracking-wider">Out of Stock</span>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  {item.category && (
                    <span className="text-[10px] font-bold text-brand-600 uppercase tracking-[0.12em] bg-brand-50 px-2 py-0.5 rounded-md">
                      {item.category}
                    </span>
                  )}
                  <Link to={`/products/${item._id}`} className="block text-[15px] font-bold text-slate-900 hover:text-brand-600 transition-colors line-clamp-2 mt-2 mb-1">
                    {item.name}
                  </Link>
                  <p className="font-display font-extrabold text-lg text-slate-900 mb-4">{formatCurrency(item.price)}</p>

                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={outOfStock}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 text-white text-sm font-bold shadow-lg hover:bg-slate-800 transition-all
                               disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed"
                  >
                    <ShoppingBag size={17} />
                    {outOfStock ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            )
          })}
        </motion.div>
      )}
    </motion.div>
  )
}
export default Wishlist;

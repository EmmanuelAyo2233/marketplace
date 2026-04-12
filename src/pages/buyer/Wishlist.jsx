import { motion } from 'framer-motion'
import { Heart, ShoppingBag, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'

function Wishlist() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  }

  const wishlistItems = [
    { id: 1, name: 'Premium Wireless Headphones', price: '45,000', stock: true, img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=300' },
    { id: 2, name: 'Minimalist Smart Watch', price: '28,500', stock: true, img: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=300' },
    { id: 3, name: 'Ergonomic Office Chair', price: '85,000', stock: false, img: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=300' }
  ]

  return (
    <motion.div initial="hidden" animate="show" variants={containerVariants} className="max-w-6xl mx-auto space-y-8">
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight">Saved Items</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">{wishlistItems.length} products waiting for you.</p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map((item) => (
          <div key={item.id} className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden group hover:shadow-[0_15px_40px_rgb(0,0,0,0.08)] transition-all hover:-translate-y-1">
            <div className="relative aspect-square overflow-hidden bg-slate-100">
              <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <button className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors shadow-sm">
                <Trash2 size={18} />
              </button>
              {!item.stock && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                  <span className="bg-slate-900 text-white font-black text-xs px-4 py-2 rounded-full uppercase tracking-widest shadow-xl">Out of Stock</span>
                </div>
              )}
            </div>
            <div className="p-5">
              <Link to={`/products`} className="text-[15px] font-bold text-slate-900 hover:text-brand-600 transition-colors line-clamp-1 mb-1">
                {item.name}
              </Link>
              <p className="text-brand-600 font-black text-lg mb-4">₦{item.price}</p>
              
              <button 
                disabled={!item.stock}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 text-white text-sm font-bold shadow-lg hover:bg-slate-800 transition-colors disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none"
              >
                <ShoppingBag size={18} /> Add to Cart
              </button>
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  )
}
export default Wishlist;

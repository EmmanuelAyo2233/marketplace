import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Package, ToggleLeft, ToggleRight } from 'lucide-react'
import { productsAPI } from '../../services/endpoints'
import { PageLoader, EmptyState, SectionHeader, ConfirmDialog } from '../../components/common'
import { formatCurrency, imgUrl } from '../../utils/helpers'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

function MyProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const { data } = await productsAPI.myProducts()
      setProducts(data.products || data || [])
    } catch { toast.error('Failed to load products') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchProducts() }, [])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await productsAPI.delete(deleteId)
      toast.success('Product deleted')
      setDeleteId(null)
      fetchProducts()
    } catch { toast.error('Failed to delete product') }
    finally { setDeleting(false) }
  }

  const handleToggle = async (product) => {
    try {
      const form = new FormData()
      form.append('isActive', !product.isActive)
      await productsAPI.update(product._id, form)
      setProducts(prev => prev.map(p => p._id === product._id ? { ...p, isActive: !p.isActive } : p))
      toast.success(product.isActive ? 'Product hidden from store' : 'Product now visible')
    } catch { toast.error('Failed to update product') }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  }

  return (
    <motion.div initial="hidden" animate="show" variants={containerVariants} className="space-y-8">
      
      {/* Premium Header */}
      <motion.div 
        variants={itemVariants} 
        className="relative bg-slate-900 rounded-[2.5rem] p-8 sm:p-10 lg:p-12 overflow-hidden border border-slate-800 shadow-[0_20px_60px_rgba(15,23,42,0.15)] flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="absolute inset-0 bg-[linear-gradient(110deg,#0f172a,35%,#1e293b,55%,#0f172a)] animate-[shimmer_8s_infinite] bg-[length:200%_100%] pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-brand-500 rounded-full mix-blend-screen filter blur-[100px] opacity-10 animate-pulse pointer-events-none" />

        <div className="relative z-10 text-center md:text-left">
          <h1 className="text-3xl lg:text-4xl font-display font-black text-white mb-2 tracking-tight">Inventory Management</h1>
          <p className="text-slate-400 font-medium text-sm">
            {products.length} active product{products.length !== 1 ? 's' : ''} in your catalog
          </p>
        </div>

        <div className="relative z-10 shrink-0">
          <Link to="/vendor/products/new" className="hidden md:flex bg-white text-slate-900 font-extrabold px-6 py-4 rounded-2xl items-center gap-3 shadow-[0_10px_30px_rgba(255,255,255,0.15)] hover:shadow-[0_15px_40px_rgba(255,255,255,0.25)] hover:scale-105 active:scale-95 transition-all">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
              <Plus size={20} className="text-brand-600" />
            </div>
            <span>Publish New Product</span>
          </Link>
          
          <Link to="/vendor/products/new" className="md:hidden flex bg-white text-slate-900 font-bold px-5 py-3 rounded-xl items-center gap-2 shadow-lg hover:bg-slate-50 transition-colors">
            <Plus size={18} className="text-brand-600" /> Add Product
          </Link>
        </div>
      </motion.div>

      {loading ? <PageLoader /> : products.length === 0 ? (
        <motion.div variants={itemVariants}>
          <EmptyState
            icon={Package}
            title="Your store looks empty"
            description="Start building your catalog by adding your very first product."
            action={<Link to="/vendor/products/new" className="btn-primary gap-2 mt-2"><Plus size={15} /> Publish Product</Link>}
          />
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          {/* Table header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50/50 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
            <div className="col-span-5">Product Details</div>
            <div className="col-span-2 text-right">Price</div>
            <div className="col-span-2 text-center">Stock Limit</div>
            <div className="col-span-1 text-center">Visibility</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-slate-100">
            <AnimatePresence>
              {products.map(product => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  key={product._id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-4 px-6 py-5 hover:bg-slate-50/80 transition-colors items-center group"
                >
                  {/* Product info */}
                  <div className="col-span-5 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                      <img src={imgUrl(product.images?.[0])} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[15px] font-bold text-slate-900 truncate mb-0.5">{product.name}</p>
                      <span className="inline-block px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wide">
                        {product.category}
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-2 md:text-right mt-2 md:mt-0">
                    <span className="font-extrabold text-brand-600 text-[15px]">{formatCurrency(product.price)}</span>
                  </div>

                  {/* Stock */}
                  <div className="col-span-2 md:text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold ${product.stockQty === 0 ? 'bg-red-50 text-red-600' : product.stockQty < 5 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                      {product.stockQty === 0 ? 'Out of stock' : `${product.stockQty} Units`}
                    </span>
                  </div>

                  {/* Active toggle */}
                  <div className="col-span-1 flex md:justify-center">
                    <button onClick={() => handleToggle(product)}
                      className={`transition-all duration-300 ${product.isActive ? 'text-brand-500 hover:text-brand-600 scale-100' : 'text-slate-300 hover:text-slate-400 scale-95'}`}
                      title={product.isActive ? 'Hide from store' : 'Show in store'}>
                      {product.isActive ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex items-center md:justify-end gap-2 mt-4 md:mt-0">
                    <Link to={`/vendor/products/${product._id}/edit`} className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-colors">
                      <Pencil size={18} />
                    </Link>
                    <button onClick={() => setDeleteId(product._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Product"
        message="Are you completely sure you want to delete this product? This action cannot be reversed."
        confirmLabel={deleting ? 'Processing…' : 'Yes, Delete'}
        danger
      />
    </motion.div>
  )
}
export default MyProducts;
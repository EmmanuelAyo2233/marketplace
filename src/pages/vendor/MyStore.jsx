import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Store, Package, MapPin, Eye, Plus, Settings, ExternalLink, Copy, Share2 } from 'lucide-react'
import { selectCurrentUser } from '../../store/authSlice'
import { productsAPI, vendorsAPI } from '../../services/endpoints'
import { PageLoader, EmptyState } from '../../components/common'
import ProductCard from '../../components/product/ProductCard'
import { imgUrl } from '../../utils/helpers'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

function MyStore() {
  const user = useSelector(selectCurrentUser)
  const [vendor, setVendor]     = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        // Try to fetch from the vendor's store slug
        const slug = user?.storeSlug || user?.name?.toLowerCase().replace(/\s+/g, '-')
        if (slug) {
          const { data } = await vendorsAPI.getStore(slug)
          setVendor(data.vendor || data)
          setProducts(data.products || [])
        } else {
          // Fallback: fetch products directly
          const { data } = await productsAPI.myProducts()
          setProducts(data.products || data || [])
        }
      } catch {
        // Fallback to own products
        try {
          const { data } = await productsAPI.myProducts()
          setProducts(data.products || data || [])
        } catch {}
      }
      finally { setLoading(false) }
    }
    load()
  }, [user])

  if (loading) return <PageLoader />

  const storeName = vendor?.storeName || user?.name || 'My Store'
  const storeSlug = vendor?.storeSlug || user?.storeSlug || ''
  const avatarLetter = storeName[0]?.toUpperCase() || 'S'
  const storeUrl = `${window.location.origin}/store/${storeSlug}`

  const copyLink = () => {
    navigator.clipboard.writeText(storeUrl)
    toast.success('Store link copied!')
  }

  const shareStore = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: storeName, url: storeUrl }) } catch {}
    } else {
      copyLink()
    }
  }

  const containerV = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }
  const itemV = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } } }

  return (
    <motion.div initial="hidden" animate="show" variants={containerV} className="space-y-8">

      {/* ── Store Banner ── */}
      <motion.div variants={itemV} className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-700/50 shadow-[0_20px_60px_rgba(15,23,42,0.15)]">
        <div className="absolute inset-0 bg-[linear-gradient(110deg,#0f172a,35%,#1e293b,55%,#0f172a)] bg-[length:200%_100%] pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-brand-500 rounded-full mix-blend-screen filter blur-[100px] opacity-15 pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-indigo-500 rounded-full mix-blend-screen filter blur-[100px] opacity-15 pointer-events-none" />

        <div className="relative p-8 md:p-10 lg:p-12">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-white shadow-2xl overflow-hidden flex items-center justify-center flex-shrink-0 border-4 border-white/10">
              {vendor?.avatar
                ? <img src={imgUrl(vendor.avatar)} alt={storeName} className="w-full h-full object-cover" />
                : <div className="w-full h-full bg-gradient-to-br from-brand-600 to-indigo-600 flex items-center justify-center">
                    <span className="text-white font-display font-black text-3xl md:text-4xl">{avatarLetter}</span>
                  </div>
              }
            </div>

            {/* Info */}
            <div className="text-center sm:text-left pb-1 flex-1">
              <div className="flex items-center gap-3 justify-center sm:justify-start">
                <h1 className="font-display font-bold text-2xl md:text-3xl text-white tracking-tight">{storeName}</h1>
                <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-full">Your Store</span>
              </div>
              {vendor?.storeDescription && (
                <p className="text-slate-300 text-sm md:text-base mt-2 max-w-xl leading-relaxed">{vendor.storeDescription}</p>
              )}
              <div className="flex items-center gap-4 mt-3 justify-center sm:justify-start flex-wrap">
                {vendor?.location && (
                  <span className="flex items-center gap-1.5 text-xs text-slate-400"><MapPin size={13} /> {vendor.location}</span>
                )}
                <span className="flex items-center gap-1.5 text-xs text-slate-400"><Package size={13} /> {products.length} product{products.length !== 1 ? 's' : ''}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {storeSlug && (
                <a href={`/store/${storeSlug}`} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-bold rounded-xl hover:bg-white/20 transition-all">
                  <Eye size={15} /> Preview
                </a>
              )}
              <button onClick={shareStore}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-bold rounded-xl hover:bg-white/20 transition-all">
                <Share2 size={15} /> Share
              </button>
              <button onClick={copyLink}
                className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white text-xs font-bold rounded-xl hover:bg-brand-700 transition-all shadow-lg shadow-brand-600/20">
                <Copy size={15} /> Copy Link
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Products ── */}
      <motion.div variants={itemV}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display font-bold text-lg md:text-xl text-slate-900 tracking-tight">Store Products</h2>
            <p className="text-sm text-slate-500 mt-0.5">{products.length} item{products.length !== 1 ? 's' : ''} in your store</p>
          </div>
          <Link to="/vendor/products/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg">
            <Plus size={17} /> Add Product
          </Link>
        </div>

        {products.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No products yet"
            description="Add your first product to start selling!"
            action={<Link to="/vendor/products/new" className="btn-primary">Add Product</Link>}
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default MyStore;

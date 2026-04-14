import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Store, Package, MapPin, ChevronLeft, MessageCircle } from 'lucide-react'
import { vendorsAPI } from '../../services/endpoints'
import { selectIsAuth, selectCurrentUser } from '../../store/authSlice'
import { PageLoader, EmptyState } from '../../components/common'
import ProductCard from '../../components/product/ProductCard'
import { imgUrl } from '../../utils/helpers'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

function VendorStore() {
  const { slug }   = useParams()
  const navigate   = useNavigate()
  const isAuth     = useSelector(selectIsAuth)
  const user       = useSelector(selectCurrentUser)
  const isBuyerOnly = !user?.role || user?.role === 'buyer'
  const [vendor, setVendor]     = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)

  const handleChat = () => {
    if (!isAuth) {
      toast.error('Please login to chat with vendor')
      return navigate('/login')
    }
    navigate(`/buyer/messages?vendorId=${vendor._id}`)
  }

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const { data } = await vendorsAPI.getStore(slug)
        setVendor(data.vendor || data)
        setProducts(data.products || [])
      } catch { toast.error('Store not found') }
      finally { setLoading(false) }
    }
    load()
  }, [slug])

  if (loading) return <PageLoader />
  if (!vendor) return (
    <div className="page-container py-20 text-center">
      <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-5">
        <Store size={36} className="text-slate-400" />
      </div>
      <h2 className="font-display font-bold text-xl text-slate-800 mb-2">Store not found</h2>
      <p className="text-slate-500 text-sm mb-6">This store doesn't exist or is currently unavailable.</p>
      <Link to="/products" className="btn-primary">Browse Products</Link>
    </div>
  )

  const avatarLetter = vendor.storeName?.[0]?.toUpperCase() || 'S'

  return (
    <div className="animate-fade-in">

      {/* ── Store Banner ── */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-[linear-gradient(110deg,#0f172a,35%,#1e293b,55%,#0f172a)] bg-[length:200%_100%] pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-brand-500 rounded-full mix-blend-screen filter blur-[100px] opacity-15 pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-indigo-500 rounded-full mix-blend-screen filter blur-[100px] opacity-15 pointer-events-none" />

        <div className="relative page-container py-10 md:py-14">
          {/* Back link */}
          <Link to="/products" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors mb-6">
            <ChevronLeft size={14} /> Back to Products
          </Link>

          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 md:gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-white shadow-2xl overflow-hidden flex items-center justify-center flex-shrink-0 border-4 border-white/10">
              {vendor.avatar
                ? <img src={imgUrl(vendor.avatar)} alt={vendor.storeName} className="w-full h-full object-cover" />
                : <div className="w-full h-full bg-gradient-to-br from-brand-600 to-indigo-600 flex items-center justify-center">
                    <span className="text-white font-display font-black text-3xl md:text-4xl">{avatarLetter}</span>
                  </div>
              }
            </div>

            {/* Info */}
            <div className="text-center sm:text-left pb-1 flex-1">
              <h1 className="font-display font-bold text-2xl md:text-3xl lg:text-4xl text-white tracking-tight">
                {vendor.storeName}
              </h1>
              {vendor.storeDescription && (
                <p className="text-slate-300 text-sm md:text-base mt-2 max-w-xl leading-relaxed">
                  {vendor.storeDescription}
                </p>
              )}
              <div className="flex items-center gap-4 mt-3 justify-center sm:justify-start">
                {vendor.location && (
                  <span className="flex items-center gap-1.5 text-xs text-slate-400">
                    <MapPin size={13} /> {vendor.location}
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Package size={13} /> {products.length} product{products.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Chat Button */}
            {isBuyerOnly && (
              <button
                onClick={handleChat}
                className="flex items-center gap-2 px-5 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-bold rounded-xl hover:bg-white/20 transition-all shrink-0 shadow-lg"
              >
                <MessageCircle size={17} />
                Chat with Vendor
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Products Grid ── */}
      <div className="page-container py-8 md:py-10">

        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-lg md:text-xl text-slate-900 tracking-tight">
            All Products
          </h2>
          <span className="text-sm text-slate-500 font-medium">{products.length} item{products.length !== 1 ? 's' : ''}</span>
        </div>

        {products.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No products yet"
            description="This vendor hasn't listed any products."
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5"
          >
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </motion.div>
        )}
      </div>
    </div>
  )
}
export default VendorStore;
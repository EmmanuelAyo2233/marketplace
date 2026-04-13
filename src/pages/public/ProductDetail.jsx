import { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  ShoppingCart, Store, Shield, Truck, ChevronLeft, ChevronRight,
  Plus, Minus, Heart, MessageCircle, Zap, Package, Share2, Check, Star
} from 'lucide-react'
import { productsAPI } from '../../services/endpoints'
import { addToCart } from '../../store/cartSlice'
import { selectIsAuth, selectCurrentUser } from '../../store/authSlice'
import { selectIsWishlisted, toggleWishlistItem, fetchWishlistIds } from '../../store/wishlistSlice'
import { PageLoader } from '../../components/common'
import { Stars } from '../../components/common'
import ProductCard from '../../components/product/ProductCard'
import { formatCurrency, imgUrl, formatDate } from '../../utils/helpers'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

export default function ProductDetail() {
  const { id }       = useParams()
  const dispatch     = useDispatch()
  const navigate     = useNavigate()
  const isAuth       = useSelector(selectIsAuth)
  const user         = useSelector(selectCurrentUser)
  const isBuyerOnly  = !user?.role || user?.role === 'buyer'
  const [product, setProduct]         = useState(null)
  const [loading, setLoading]         = useState(true)
  const [activeImg, setActiveImg]     = useState(0)
  const [qty, setQty]                 = useState(1)
  const [relatedProducts, setRelated] = useState([])
  const [imgLoaded, setImgLoaded]     = useState(false)
  const [addedToCart, setAddedToCart]  = useState(false)

  const isWishlisted = useSelector(selectIsWishlisted(parseInt(id)))

  // Fetch wishlist IDs on mount
  useEffect(() => {
    if (isAuth) dispatch(fetchWishlistIds())
  }, [isAuth])

  const handleWishlist = () => {
    if (!isAuth) {
      toast.error('Please login to save items')
      return navigate('/login')
    }
    dispatch(toggleWishlistItem(parseInt(id)))
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist!')
  }

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      setActiveImg(0)
      setQty(1)
      setAddedToCart(false)
      setImgLoaded(false)
      try {
        const { data } = await productsAPI.getOne(id)
        setProduct(data.product || data)
      } catch { toast.error('Product not found') }
      finally { setLoading(false) }
    }
    fetchProduct()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [id])

  // Fetch related products (same category)
  useEffect(() => {
    if (!product?.category) return
    productsAPI.getAll({ category: product.category })
      .then(({ data }) => {
        const all = data.products || data.data || []
        setRelated(all.filter(p => p._id !== product._id).slice(0, 4))
      })
      .catch(() => {})
  }, [product?.category, product?._id])

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) dispatch(addToCart(product))
    setAddedToCart(true)
    toast.success(`${qty}× ${product.name} added to cart!`)
    setTimeout(() => setAddedToCart(false), 2500)
  }

  const handleBuyNow = () => {
    for (let i = 0; i < qty; i++) dispatch(addToCart(product))
    navigate('/cart')
  }

  const handleChat = () => {
    if (!isAuth) {
      toast.error('Please login to chat with vendor')
      return navigate('/login')
    }
    navigate(`/buyer/messages?vendorId=${product.vendorId?._id}&productId=${product._id}`)
  }

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try { await navigator.share({ title: product.name, url }) } catch {}
    } else {
      navigator.clipboard.writeText(url)
      toast.success('Link copied to clipboard!')
    }
  }

  if (loading) return <PageLoader />
  if (!product) return (
    <div className="page-container py-20 text-center">
      <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-5">
        <Package size={36} className="text-slate-400" />
      </div>
      <h2 className="font-display font-bold text-xl text-slate-800 mb-2">Product not found</h2>
      <p className="text-slate-500 text-sm mb-6">The product you're looking for doesn't exist or has been removed.</p>
      <Link to="/products" className="btn-primary">Browse Products</Link>
    </div>
  )

  const images = product.images?.length ? product.images : [null]
  const inStock = product.stockQty > 0

  return (
    <div className="page-container py-6 md:py-10 animate-fade-in">

      {/* ── Breadcrumb ────────────────────────────────────────── */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6 md:mb-8 overflow-x-auto" aria-label="Breadcrumb">
        <Link to="/products" className="hover:text-brand-600 flex items-center gap-1 whitespace-nowrap transition-colors">
          <ChevronLeft size={13} /> Products
        </Link>
        <span className="text-slate-300">/</span>
        <Link to={`/products?category=${product.category}`} className="hover:text-brand-600 whitespace-nowrap transition-colors">
          {product.category}
        </Link>
        <span className="text-slate-300">/</span>
        <span className="truncate max-w-[200px] text-slate-700 font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

        {/* ════════════════════════════════════════════════════════
            IMAGE GALLERY
        ════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-5 space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square rounded-[1.5rem] bg-slate-50 overflow-hidden border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] group">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImg}
                src={imgUrl(images[activeImg])}
                alt={product.name}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                onLoad={() => setImgLoaded(true)}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>

            {/* Out of stock overlay */}
            {!inStock && (
              <div className="absolute inset-0 bg-black/30 backdrop-blur-[3px] flex items-center justify-center z-10">
                <span className="bg-white text-slate-900 text-sm font-bold px-6 py-2.5 rounded-full shadow-2xl">
                  Out of Stock
                </span>
              </div>
            )}

            {/* Image navigation arrows (for multiple images) */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImg(i => i === 0 ? images.length - 1 : i - 1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg
                             opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white z-20"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={20} className="text-slate-700" />
                </button>
                <button
                  onClick={() => setActiveImg(i => i === images.length - 1 ? 0 : i + 1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg
                             opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white z-20"
                  aria-label="Next image"
                >
                  <ChevronRight size={20} className="text-slate-700" />
                </button>
              </>
            )}

            {/* Action buttons on image */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
              {isBuyerOnly && (
                <button
                  onClick={handleWishlist}
                  className={`w-10 h-10 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-md transition-all
                    ${isWishlisted ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-white/90 text-slate-600 hover:bg-white'}`}
                  aria-label="Toggle wishlist"
                >
                  <Heart size={17} fill={isWishlisted ? 'currentColor' : 'none'} />
                </button>
              )}
              <button
                onClick={handleShare}
                className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-md hover:bg-white transition-colors"
                aria-label="Share product"
              >
                <Share2 size={17} className="text-slate-600" />
              </button>
            </div>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-1 px-0.5">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`flex-shrink-0 w-[4.5rem] h-[4.5rem] rounded-xl overflow-hidden border-2 transition-all duration-200
                    ${activeImg === i
                      ? 'border-brand-600 shadow-[0_0_0_3px_rgba(37,99,235,0.15)] scale-[1.02]'
                      : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <img src={imgUrl(img)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ════════════════════════════════════════════════════════
            PRODUCT DETAILS
        ════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-7 flex flex-col">

          {/* Category + Name */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block text-[11px] font-bold text-brand-600 uppercase tracking-[0.12em] bg-brand-50 px-3 py-1 rounded-lg">
                {product.category}
              </span>
              {inStock
                ? <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg">
                    <Check size={12} strokeWidth={3} /> In Stock ({product.stockQty})
                  </span>
                : <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-50 px-3 py-1 rounded-lg">
                    Out of Stock
                  </span>
              }
            </div>

            <h1 className="font-display font-bold text-2xl md:text-[1.85rem] lg:text-3xl text-slate-900 leading-tight tracking-tight">
              {product.name}
            </h1>

            {/* Reviews row */}
            <div className="flex items-center gap-3 mt-3">
              <Stars rating={4.5} />
              <span className="text-xs text-slate-500 font-medium">(128 reviews)</span>
            </div>
          </div>

          {/* ── Price ── */}
          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-display font-extrabold text-3xl md:text-[2rem] text-slate-900 tracking-tight">
              {formatCurrency(product.price)}
            </span>
          </div>

          {/* ── Divider ── */}
          <div className="h-px bg-slate-100 my-6" />

          {/* ── Vendor Card ── */}
          {product.vendorId && (
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-white rounded-2xl border border-slate-100 mb-5">
              <Link to={`/store/${product.vendorId.storeSlug}`}
                className="flex items-center gap-3.5 group/vendor flex-1 min-w-0"
              >
                <div className="w-11 h-11 bg-gradient-to-br from-brand-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md shadow-brand-600/20 group-hover/vendor:scale-105 transition-transform">
                  <Store size={19} strokeWidth={2.5} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate group-hover/vendor:text-brand-600 transition-colors">
                    {product.vendorId.storeName}
                  </p>
                  <p className="text-xs text-slate-500">View store →</p>
                </div>
              </Link>

              {isBuyerOnly && (
                <button onClick={handleChat}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-xl transition-colors shrink-0 ml-3"
                >
                  <MessageCircle size={16} />
                  <span className="hidden sm:inline">Chat</span>
                </button>
              )}
            </div>
          )}

          {/* ── Quantity Selector + Action Buttons ── */}
          {inStock && isBuyerOnly && (
            <div className="space-y-4 mb-6">
              {/* Quantity */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-slate-700">Quantity</span>
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 active:bg-slate-200 text-slate-600 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={15} strokeWidth={2.5} />
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-slate-900 tabular-nums select-none">{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stockQty, q + 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 active:bg-slate-200 text-slate-600 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus size={15} strokeWidth={2.5} />
                  </button>
                </div>
                <span className="text-xs text-slate-400 hidden sm:inline">{product.stockQty} available</span>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAddToCart}
                  disabled={addedToCart}
                  className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-2xl text-[15px] font-bold transition-all duration-300 shadow-lg
                    ${addedToCart
                      ? 'bg-emerald-600 text-white shadow-emerald-600/25'
                      : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/20 hover:shadow-slate-900/30'}`}
                >
                  {addedToCart
                    ? <><Check size={18} strokeWidth={3} /> Added!</>
                    : <><ShoppingCart size={18} /> Add to Cart</>
                  }
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleBuyNow}
                  className="flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-2xl text-[15px] font-bold
                             bg-brand-600 text-white hover:bg-brand-700 transition-colors shadow-lg shadow-brand-600/25 hover:shadow-brand-600/35"
                >
                  <Zap size={18} /> Buy Now
                </motion.button>
              </div>
            </div>
          )}

          {/* ── Trust Badges ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <div className="flex items-center gap-3 p-3.5 bg-slate-50/70 rounded-xl border border-slate-100">
              <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
                <Shield size={17} className="text-brand-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Secure Payment</p>
                <p className="text-[11px] text-slate-500">Escrow protection on orders</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3.5 bg-slate-50/70 rounded-xl border border-slate-100">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                <Truck size={17} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Delivery Confirmation</p>
                <p className="text-[11px] text-slate-500">Payment releases after you confirm</p>
              </div>
            </div>
          </div>

          {/* ── Description ── */}
          <div className="border-t border-slate-100 pt-6">
            <h3 className="font-display font-bold text-base text-slate-900 mb-3">Description</h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* ── Product Meta ── */}
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-400">
            {product.createdAt && <span>Listed {formatDate(product.createdAt)}</span>}
            <span>Product ID: #{product._id}</span>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          RELATED PRODUCTS
      ════════════════════════════════════════════════════════ */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 md:mt-20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display font-bold text-xl text-slate-900 tracking-tight">More in {product.category}</h2>
              <p className="text-sm text-slate-500 mt-0.5">You might also like these products</p>
            </div>
            <Link to={`/products?category=${product.category}`}
              className="text-sm font-bold text-brand-600 hover:text-brand-800 bg-brand-50 px-4 py-2 rounded-xl transition-colors hidden sm:block">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {relatedProducts.map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ShoppingCart, Store, Shield, Truck, ChevronLeft, Plus, Minus, Share2, Heart } from 'lucide-react'
import { productsAPI } from '../../services/endpoints'
import { addToCart } from '../../store/cartSlice'
import { selectIsAuth } from '../../store/authSlice'
import { PageLoader } from '../../components/common'
import { Stars } from '../../components/common'
import { formatCurrency, imgUrl, formatDate } from '../../utils/helpers'
import toast from 'react-hot-toast'

export default function ProductDetail() {
  const { id }     = useParams()
  const dispatch   = useDispatch()
  const isAuth     = useSelector(selectIsAuth)
  const [product, setProduct]   = useState(null)
  const [loading, setLoading]   = useState(true)
  const [activeImg, setActiveImg] = useState(0)
  const [qty, setQty]           = useState(1)

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      try {
        const { data } = await productsAPI.getOne(id)
        setProduct(data.product || data)
      } catch { toast.error('Product not found') }
      finally { setLoading(false) }
    }
    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) dispatch(addToCart(product))
    toast.success(`${product.name} added to cart!`)
  }

  if (loading) return <PageLoader />
  if (!product) return <div className="page-container py-16 text-center text-slate-500">Product not found</div>

  const images = product.images?.length ? product.images : [null]

  return (
    <div className="page-container py-8 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-6">
        <Link to="/products" className="hover:text-brand-600 flex items-center gap-1">
          <ChevronLeft size={13} /> Products
        </Link>
        <span>/</span>
        <span className="text-brand-600">{product.category}</span>
        <span>/</span>
        <span className="truncate max-w-xs">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* ── Images ── */}
        <div className="space-y-3">
          <div className="aspect-square rounded-2xl bg-slate-100 overflow-hidden">
            <img src={imgUrl(images[activeImg])} alt={product.name}
              className="w-full h-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors
                    ${activeImg === i ? 'border-brand-600' : 'border-transparent'}`}>
                  <img src={imgUrl(img)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Info ── */}
        <div className="space-y-5">
          <div>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">{product.category}</span>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-slate-900 mt-1 leading-tight">{product.name}</h1>

            <div className="flex items-center gap-3 mt-2">
              <Stars rating={4.5} />
              <span className="text-xs text-slate-500">(128 reviews)</span>
              {product.stockQty > 0
                ? <span className="badge-green">In Stock ({product.stockQty})</span>
                : <span className="badge-red">Out of Stock</span>}
            </div>
          </div>

          <p className="font-display font-extrabold text-3xl text-brand-700">{formatCurrency(product.price)}</p>

          {/* Vendor */}
          {product.vendorId && (
            <Link to={`/store/${product.vendorId.storeSlug}`}
              className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-brand-50 transition-colors">
              <div className="w-9 h-9 bg-brand-600 rounded-lg flex items-center justify-center text-white">
                <Store size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{product.vendorId.storeName}</p>
                <p className="text-xs text-slate-500">View store →</p>
              </div>
            </Link>
          )}

          {/* Quantity */}
          {product.stockQty > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-700">Quantity:</span>
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-9 h-9 flex items-center justify-center hover:bg-slate-100 text-slate-600 transition-colors">
                  <Minus size={15} />
                </button>
                <span className="w-10 text-center text-sm font-semibold">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stockQty, q + 1))}
                  className="w-9 h-9 flex items-center justify-center hover:bg-slate-100 text-slate-600 transition-colors">
                  <Plus size={15} />
                </button>
              </div>
            </div>
          )}

          {/* CTA buttons */}
          <div className="flex gap-3">
            <button onClick={handleAddToCart} disabled={product.stockQty === 0} className="btn-primary flex-1 py-3 text-base gap-2">
              <ShoppingCart size={18} /> Add to Cart
            </button>
            <button className="btn-secondary py-3 px-4">
              <Heart size={18} />
            </button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Shield size={14} className="text-brand-600 flex-shrink-0" />
              <span>Escrow payment protection</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Truck size={14} className="text-emerald-600 flex-shrink-0" />
              <span>Confirm before payment releases</span>
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-slate-100 pt-5">
            <h3 className="font-semibold text-slate-800 mb-2">Description</h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{product.description}</p>
          </div>

          <div className="text-xs text-slate-400">Listed {formatDate(product.createdAt)}</div>
        </div>
      </div>
    </div>
  )
}

// ─── Cart Page ────────────────────────────────────────────────
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from 'lucide-react'
import { selectCartItems, selectCartTotal, removeFromCart, updateQty, clearCart } from '../../store/cartSlice'
import { formatCurrency, imgUrl } from '../../utils/helpers'
import { EmptyState } from '../../components/common'
import { selectIsAuth } from '../../store/authSlice'

export function Cart() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const items     = useSelector(selectCartItems)
  const total     = useSelector(selectCartTotal)
  const isAuth    = useSelector(selectIsAuth)

  const handleCheckout = () => {
    if (!isAuth) { navigate('/login?redirect=/checkout'); return }
    navigate('/checkout')
  }

  if (items.length === 0) return (
    <div className="page-container py-16">
      <EmptyState icon={ShoppingCart} title="Your cart is empty"
        description="Browse products and add them to your cart."
        action={<Link to="/products" className="btn-primary">Browse Products</Link>} />
    </div>
  )

  return (
    <div className="page-container py-8">
      <h1 className="section-title mb-6">Shopping Cart ({items.length})</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map(item => (
            <div key={item._id} className="card p-4 flex gap-4">
              <div className="w-20 h-20 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                <img src={imgUrl(item.images?.[0])} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-800 text-sm line-clamp-2">{item.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.category}</p>
                  </div>
                  <button onClick={() => dispatch(removeFromCart(item._id))} className="btn-ghost px-2 text-red-500 hover:text-red-600">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                    <button onClick={() => dispatch(updateQty({ id: item._id, quantity: item.quantity - 1 }))}
                      className="w-7 h-7 flex items-center justify-center hover:bg-slate-100 text-slate-600">
                      <Minus size={13} />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button onClick={() => dispatch(updateQty({ id: item._id, quantity: item.quantity + 1 }))}
                      className="w-7 h-7 flex items-center justify-center hover:bg-slate-100 text-slate-600">
                      <Plus size={13} />
                    </button>
                  </div>
                  <span className="font-bold text-brand-700">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              </div>
            </div>
          ))}
          <button onClick={() => dispatch(clearCart())} className="btn-ghost text-red-500 text-sm">
            <Trash2 size={14} /> Clear cart
          </button>
        </div>

        {/* Summary */}
        <div>
          <div className="card p-5 space-y-4 sticky top-20">
            <h3 className="font-display font-semibold text-slate-800 text-lg">Order Summary</h3>
            <div className="space-y-2 text-sm">
              {items.map(i => (
                <div key={i._id} className="flex justify-between text-slate-600">
                  <span className="truncate max-w-[60%]">{i.name} ×{i.quantity}</span>
                  <span className="font-medium">{formatCurrency(i.price * i.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-100 pt-3">
              <div className="flex justify-between font-bold text-slate-900 text-base">
                <span>Total</span>
                <span className="text-brand-700">{formatCurrency(total)}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Payment held in escrow until delivery confirmed</p>
            </div>
            <button onClick={handleCheckout} className="btn-primary w-full py-3 text-base gap-2">
              Proceed to Checkout <ArrowRight size={16} />
            </button>
            <Link to="/products" className="btn-secondary w-full text-sm justify-center">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart;

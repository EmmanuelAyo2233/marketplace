import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Shield, CreditCard, MapPin, CheckCircle } from 'lucide-react'
import { selectCartItems, selectCartTotal, clearCart } from '../../store/cartSlice'
import { selectCurrentUser } from '../../store/authSlice'
import { ordersAPI, paymentsAPI } from '../../services/endpoints'
import { formatCurrency, imgUrl } from '../../utils/helpers'
import toast from 'react-hot-toast'

function Checkout() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const items     = useSelector(selectCartItems)
  const total     = useSelector(selectCartTotal)
  const user      = useSelector(selectCurrentUser)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { name: user?.name, email: user?.email }
  })

  const onSubmit = async (formData) => {
    if (items.length === 0) return toast.error('Cart is empty')
    setLoading(true)
    try {
      // 1. Create order
      const vendorId = items[0]?.vendorId?._id || items[0]?.vendorId
      const orderPayload = {
        orderItems: items.map(i => ({
          product: i._id,
          name: i.name,
          qty: i.quantity,
          image: i.images?.[0] || '',
          price: i.price,
        })),
        vendorId,
        shippingAddress: {
          address: formData.street,
          city: formData.city,
          postalCode: formData.postalCode || '100001',
          country: 'Nigeria',
        },
        paymentMethod: 'Paystack',
        itemsPrice:    total,
        taxPrice:      0,
        shippingPrice: 0,
        totalPrice:    total,
      }

      const { data: orderData } = await ordersAPI.create(orderPayload)
      const orderId = orderData._id || orderData.id

      // 2. Initialize Paystack transaction
      const { data: payData } = await paymentsAPI.initialize({ orderId })

      // 3. Redirect buyer to Paystack hosted payment page
      const authUrl = payData.authorization_url
      if (authUrl) {
        dispatch(clearCart())
        window.location.href = authUrl
      } else {
        throw new Error('No payment URL received')
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Checkout failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }


  if (items.length === 0) {
    navigate('/cart')
    return null
  }

  return (
    <div className="page-container py-8 animate-fade-in">
      <h1 className="section-title mb-6">Checkout</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left — Delivery + Contact */}
          <div className="lg:col-span-2 space-y-5">
            {/* Contact info */}
            <div className="card p-5">
              <h3 className="font-display font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <CreditCard size={18} className="text-brand-600" /> Contact Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Full name</label>
                  <input className={`input ${errors.name ? 'input-error' : ''}`}
                    {...register('name', { required: 'Required' })} />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input type="email" className={`input ${errors.email ? 'input-error' : ''}`}
                    {...register('email', { required: 'Required' })} />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Phone number</label>
                  <input type="tel" placeholder="+234…" className={`input ${errors.phone ? 'input-error' : ''}`}
                    {...register('phone', { required: 'Required' })} />
                </div>
              </div>
            </div>

            {/* Delivery address */}
            <div className="card p-5">
              <h3 className="font-display font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-brand-600" /> Delivery Address
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="label">Street address</label>
                  <input placeholder="123 Main Street, Apartment 4B"
                    className={`input ${errors.street ? 'input-error' : ''}`}
                    {...register('street', { required: 'Street address required' })} />
                </div>
                <div>
                  <label className="label">City</label>
                  <input placeholder="Lagos" className={`input ${errors.city ? 'input-error' : ''}`}
                    {...register('city', { required: 'City required' })} />
                </div>
                <div>
                  <label className="label">State</label>
                  <input placeholder="Lagos State" className={`input ${errors.state ? 'input-error' : ''}`}
                    {...register('state', { required: 'State required' })} />
                </div>
              </div>
            </div>

            {/* Escrow notice */}
            <div className="flex items-start gap-3 bg-brand-50 border border-brand-100 rounded-xl p-4">
              <Shield size={18} className="text-brand-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-semibold text-brand-800">Your payment is protected by escrow</p>
                <p className="text-brand-600 mt-0.5">Money is held securely by TradeHub and only released to the vendor after you confirm delivery.</p>
              </div>
            </div>
          </div>

          {/* Right — Order summary */}
          <div>
            <div className="card p-5 space-y-4 sticky top-20">
              <h3 className="font-display font-semibold text-slate-800 text-lg">Order Summary</h3>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {items.map(item => (
                  <div key={item._id} className="flex gap-3">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                      <img src={imgUrl(item.images?.[0])} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-800 line-clamp-2">{item.name}</p>
                      <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-xs font-bold text-slate-700 flex-shrink-0">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-1.5 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span><span>{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery</span><span className="text-emerald-600">Negotiated with vendor</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 text-base pt-1 border-t border-slate-100">
                  <span>Total</span>
                  <span className="text-brand-700">{formatCurrency(total)}</span>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base gap-2">
                {loading ? 'Processing…' : (
                  <><CreditCard size={18} /> Pay {formatCurrency(total)}</>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                <CheckCircle size={12} className="text-emerald-500" /> Powered by Paystack · SSL Secured
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
export default Checkout;
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Loader2, ShoppingBag } from 'lucide-react'
import { paymentsAPI } from '../../services/endpoints'
import toast from 'react-hot-toast'

export default function CheckoutVerify() {
  const [searchParams]      = useSearchParams()
  const navigate            = useNavigate()
  const [status, setStatus] = useState('loading') // loading | success | failed
  const [order, setOrder]   = useState(null)

  useEffect(() => {
    const ref = searchParams.get('reference') || searchParams.get('trxref')

    if (!ref) {
      setStatus('failed')
      return
    }

    paymentsAPI.verify(ref)
      .then(({ data }) => {
        setOrder(data.order)
        setStatus('success')
        toast.success('Payment confirmed! 🎉')
      })
      .catch(() => {
        setStatus('failed')
        toast.error('Payment verification failed')
      })
  }, [searchParams])

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-10 max-w-md w-full text-center"
      >
        {status === 'loading' && (
          <>
            <Loader2 size={52} className="text-brand-600 animate-spin mx-auto mb-5" />
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Verifying Payment…</h1>
            <p className="text-slate-500">Please wait while we confirm your payment with Paystack.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
              <CheckCircle size={40} className="text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Payment Successful!</h1>
            <p className="text-slate-500 mb-6">
              Your payment has been confirmed and your order is now being processed.
              Funds are held securely in escrow until delivery is confirmed.
            </p>
            {order && (
              <div className="bg-slate-50 rounded-xl p-4 mb-6 text-sm text-slate-700">
                <div className="flex justify-between mb-1">
                  <span className="text-slate-500">Order ID</span>
                  <span className="font-mono font-semibold">#{String(order._id).slice(-8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount Paid</span>
                  <span className="font-bold text-brand-700">
                    ₦{Number(order.totalPrice).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
            <button
              onClick={() => navigate('/buyer/orders')}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <ShoppingBag size={16} /> View My Orders
            </button>
          </>
        )}

        {status === 'failed' && (
          <>
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5">
              <XCircle size={40} className="text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Payment Failed</h1>
            <p className="text-slate-500 mb-6">
              We could not verify your payment. If money was deducted, it will be refunded automatically.
            </p>
            <div className="flex gap-3">
              <button onClick={() => navigate('/checkout')} className="btn-secondary flex-1">
                Try Again
              </button>
              <button onClick={() => navigate('/buyer/orders')} className="btn-primary flex-1">
                My Orders
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ShoppingBag, MapPin, Star } from 'lucide-react'
import { ordersAPI, disputesAPI, reviewsAPI } from '../../services/endpoints'
import { PageLoader, EmptyState, SectionHeader, OrderStatusBadge, Modal } from '../../components/common'
import { OrderCard, OrderTimeline, DeliveryConfirmBtn } from '../../components/order'
import { formatCurrency, formatDate, formatDateTime, imgUrl } from '../../utils/helpers'
import toast from 'react-hot-toast'

// ── My Orders list ────────────────────────────────────────────
export function MyOrders() {
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ordersAPI.myOrders()
      .then(({ data }) => setOrders(data.orders || data || []))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <SectionHeader title="My Orders" subtitle={`${orders.length} total orders`} />
      {loading ? <PageLoader /> : orders.length === 0 ? (
        <EmptyState icon={ShoppingBag} title="No orders yet" description="Start shopping to see your orders here." />
      ) : (
        <div className="space-y-3">
          {orders.map(o => <OrderCard key={o._id} order={o} />)}
        </div>
      )}
    </div>
  )
}

// ── Order Detail ──────────────────────────────────────────────
export function OrderDetail() {
  const { id } = useParams()
  const [order, setOrder]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [disputeOpen, setDisputeOpen] = useState(false)
  const [disputeReason, setDisputeReason] = useState('')
  const [disputeLoading, setDisputeLoading] = useState(false)

  // Review states
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [reviewProductId, setReviewProductId] = useState(null)
  const [reviewProductName, setReviewProductName] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [reviewSubmitting, setReviewSubmitting] = useState(false)

  const handleReviewSubmit = async () => {
    if (!reviewRating || reviewRating < 1 || reviewRating > 5) {
      return toast.error('Please select a rating between 1 and 5 stars')
    }
    setReviewSubmitting(true)
    try {
      await reviewsAPI.create({
        productId: reviewProductId,
        orderId: id,
        rating: reviewRating,
        comment: reviewComment
      })
      toast.success('Review submitted successfully!')
      setReviewModalOpen(false)
      fetchOrder()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to submit review')
    } finally {
      setReviewSubmitting(false)
    }
  }

  const fetchOrder = async () => {
    setLoading(true)
    try {
      const { data } = await ordersAPI.getOne(id)
      setOrder(data.order || data)
    } catch { toast.error('Order not found') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchOrder() }, [id])

  const handleDispute = async () => {
    if (!disputeReason.trim()) return toast.error('Please provide a reason')
    setDisputeLoading(true)
    try {
      await disputesAPI.raise({ orderId: id, reason: disputeReason })
      toast.success('Dispute raised. Our team will review within 24h.')
      setDisputeOpen(false)
      fetchOrder()
    } catch { toast.error('Failed to raise dispute') }
    finally { setDisputeLoading(false) }
  }

  if (loading) return <PageLoader />
  if (!order) return <div className="text-center py-16 text-slate-500">Order not found</div>

  const canConfirm  = order.status === 'shipped' || order.isShipped
  const canDispute  = !order.isDelivered

  return (
    <div>
      <SectionHeader
        title={`Order #${String(order._id).slice(-8).toUpperCase()}`}
        subtitle={`Placed on ${formatDate(order.createdAt)}`}
        action={<OrderStatusBadge status={order.status} />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left */}
        <div className="lg:col-span-2 space-y-5">
          {/* Timeline */}
          <div className="card p-5">
            <h3 className="font-semibold text-slate-800 mb-5">Order Progress</h3>
            <OrderTimeline status={order.status} />
          </div>

          {/* Items */}
          <div className="card p-5">
            <h3 className="font-semibold text-slate-800 mb-4">Items Ordered</h3>
            <div className="space-y-4">
              {(order.items || order.orderItems)?.map((item, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50 pb-4 last:border-b-0 last:pb-0">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                      <img src={imgUrl(item.image || item.imageUrl)} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                      <p className="text-xs text-slate-500">Qty: {item.qty || item.quantity} × {formatCurrency(item.price || item.unitPrice)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 justify-between sm:justify-end">
                    <span className="font-bold text-slate-800">{formatCurrency((item.qty || item.quantity) * (item.price || item.unitPrice))}</span>
                    
                    {/* Review Button/Badge */}
                    {(order.status === 'delivered' || order.isDelivered) && (
                      <div className="ml-2">
                        {item.reviewId ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-100">
                            ★ {item.reviewRating || ''} Reviewed
                          </span>
                        ) : (
                          <button 
                            onClick={() => {
                              setReviewProductId(item.productId || item.product);
                              setReviewProductName(item.name);
                              setReviewRating(5);
                              setReviewComment('');
                              setReviewModalOpen(true);
                            }}
                            className="bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold px-3 py-1.5 rounded-xl transition-colors"
                          >
                            Review Product
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-100 mt-4 pt-3 flex justify-between font-bold text-slate-900">
              <span>Total</span>
              <span className="text-brand-700">{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>

          {/* Delivery address */}
          {(order.deliveryAddress || order.shippingAddress) && (
            <div className="card p-5">
              <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <MapPin size={16} className="text-brand-600" /> Delivery Address
              </h3>
              <p className="text-sm text-slate-600">
                {order.deliveryAddress?.street || order.shippingAddress}, {order.deliveryAddress?.city || order.shippingCity},<br />
                {order.deliveryAddress?.state || order.shippingPostalCode}, {order.deliveryAddress?.country || order.shippingCountry}
              </p>
            </div>
          )}
        </div>

        {/* Right — actions */}
        <div className="space-y-4">
          <div className="card p-5 space-y-3">
            <h3 className="font-semibold text-slate-800">Actions</h3>
            {canConfirm && (
              <DeliveryConfirmBtn orderId={order._id} onConfirmed={fetchOrder} />
            )}
            {canDispute && (
              <button onClick={() => setDisputeOpen(true)} className="btn-secondary w-full text-sm text-red-600 border-red-200 hover:bg-red-50">
                Raise a Dispute
              </button>
            )}
            {order.status === 'completed' && (
              <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
                ✓ Order completed. Payment released to vendor.
              </div>
            )}
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-slate-800 mb-3">Order Info</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-slate-500">Order ID</dt><dd className="font-mono text-xs">{String(order._id).slice(-8)}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">Placed</dt><dd>{formatDateTime(order.createdAt)}</dd></div>
              {order.shippedAt && <div className="flex justify-between"><dt className="text-slate-500">Shipped</dt><dd>{formatDateTime(order.shippedAt)}</dd></div>}
              {order.confirmedAt && <div className="flex justify-between"><dt className="text-slate-500">Confirmed</dt><dd>{formatDateTime(order.confirmedAt)}</dd></div>}
            </dl>
          </div>
        </div>
      </div>

      {/* Dispute modal */}
      <Modal open={disputeOpen} onClose={() => setDisputeOpen(false)} title="Raise a Dispute" size="sm">
        <p className="text-sm text-slate-600 mb-4">Describe the issue with your order. Our team will review within 24 hours.</p>
        <textarea rows={4} value={disputeReason} onChange={e => setDisputeReason(e.target.value)}
          placeholder="Describe the problem in detail…"
          className="input resize-none mb-4" />
        <div className="flex gap-3 justify-end">
          <button onClick={() => setDisputeOpen(false)} className="btn-secondary">Cancel</button>
          <button onClick={handleDispute} disabled={disputeLoading} className="btn-danger">
            {disputeLoading ? 'Submitting…' : 'Submit Dispute'}
          </button>
        </div>
      </Modal>

      {/* Review Modal */}
      <Modal open={reviewModalOpen} onClose={() => setReviewModalOpen(false)} title={`Review Product`} size="sm">
        <div className="space-y-4">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Product Name</p>
            <p className="text-sm font-bold text-slate-800">{reviewProductName}</p>
          </div>

          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Rating</p>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setReviewRating(star)}
                  className="p-1 hover:scale-110 transition-transform outline-none"
                  type="button"
                >
                  <Star
                    size={28}
                    className={star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Comments (Optional)</p>
            <textarea
              rows={4}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="What did you think of the product? Share your experience…"
              className="input resize-none text-sm font-medium"
            />
          </div>

          <div className="flex gap-3 justify-end pt-2 border-t border-slate-100">
            <button onClick={() => setReviewModalOpen(false)} className="btn-secondary text-xs py-2 px-4">Cancel</button>
            <button 
              onClick={handleReviewSubmit} 
              disabled={reviewSubmitting} 
              className="btn-primary text-xs py-2 px-5 bg-brand-600 hover:bg-brand-700 text-white"
            >
              {reviewSubmitting ? 'Submitting…' : 'Submit Review'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default MyOrders;

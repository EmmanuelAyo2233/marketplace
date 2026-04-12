import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingBag, Truck, ChevronDown } from 'lucide-react'
import { ordersAPI } from '../../services/endpoints'
import { PageLoader, EmptyState, SectionHeader, OrderStatusBadge, Modal } from '../../components/common'
import { formatCurrency, formatDate, formatDateTime, imgUrl } from '../../utils/helpers'
import toast from 'react-hot-toast'

const STATUS_FILTERS = ['all', 'paid', 'processing', 'shipped', 'completed', 'disputed']

function VendorOrders() {
  const [orders, setOrders]       = useState([])
  const [loading, setLoading]     = useState(true)
  const [filter, setFilter]       = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [shipping, setShipping]   = useState(false)

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const { data } = await ordersAPI.vendorOrders()
      setOrders(data.orders || data || [])
    } catch { toast.error('Failed to load orders') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchOrders() }, [])

  const handleMarkShipped = async (orderId) => {
    setShipping(true)
    try {
      await ordersAPI.ship(orderId)
      toast.success('Order marked as shipped!')
      setSelectedOrder(null)
      fetchOrders()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update order')
    } finally {
      setShipping(false)
    }
  }

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  return (
    <div>
      <SectionHeader
        title="Orders"
        subtitle={`${orders.length} total orders`}
      />

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-5">
        {STATUS_FILTERS.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors capitalize
              ${filter === s ? 'bg-brand-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            {s === 'all' ? `All (${orders.length})` : `${s} (${orders.filter(o => o.status === s).length})`}
          </button>
        ))}
      </div>

      {loading ? <PageLoader /> : filtered.length === 0 ? (
        <EmptyState icon={ShoppingBag} title="No orders found"
          description={filter === 'all' ? 'When buyers place orders, they appear here.' : `No ${filter} orders.`} />
      ) : (
        <div className="card overflow-hidden">
          <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <div className="col-span-4">Order</div>
            <div className="col-span-3">Date</div>
            <div className="col-span-2 text-right">Amount</div>
            <div className="col-span-2 text-center">Status</div>
            <div className="col-span-1 text-right">Action</div>
          </div>

          <div className="divide-y divide-slate-100">
            {filtered.map(order => (
              <div key={order._id}
                className="grid grid-cols-1 md:grid-cols-12 gap-3 px-5 py-4 hover:bg-slate-50 transition-colors items-center cursor-pointer"
                onClick={() => setSelectedOrder(order)}>

                <div className="col-span-4">
                  <p className="text-sm font-semibold text-slate-800">
                    #{order._id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                  </p>
                </div>

                <div className="col-span-3">
                  <p className="text-sm text-slate-600">{formatDate(order.createdAt)}</p>
                </div>

                <div className="col-span-2 text-right">
                  <span className="font-bold text-brand-700 text-sm">{formatCurrency(order.totalAmount)}</span>
                </div>

                <div className="col-span-2 flex justify-center">
                  <OrderStatusBadge status={order.status} />
                </div>

                <div className="col-span-1 flex justify-end">
                  {order.status === 'paid' || order.status === 'processing' ? (
                    <button
                      onClick={e => { e.stopPropagation(); setSelectedOrder(order) }}
                      className="btn-primary py-1.5 px-3 text-xs gap-1">
                      <Truck size={12} /> Ship
                    </button>
                  ) : (
                    <ChevronDown size={16} className="text-slate-400 rotate-[-90deg]" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Order detail modal */}
      <Modal open={!!selectedOrder} onClose={() => setSelectedOrder(null)}
        title={`Order #${selectedOrder?._id?.slice(-8).toUpperCase()}`} size="lg">
        {selectedOrder && (
          <div className="space-y-5">
            {/* Items */}
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Items</h4>
              <div className="space-y-3">
                {selectedOrder.items?.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                      <img src={imgUrl(item.imageUrl)} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                      <p className="text-xs text-slate-500">Qty: {item.quantity} × {formatCurrency(item.unitPrice)}</p>
                    </div>
                    <span className="font-bold text-slate-700 text-sm">{formatCurrency(item.subtotal)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery address */}
            {selectedOrder.deliveryAddress && (
              <div className="bg-slate-50 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-slate-700 mb-2">Delivery Address</h4>
                <p className="text-sm text-slate-600">
                  {selectedOrder.deliveryAddress.street}, {selectedOrder.deliveryAddress.city},
                  {' '}{selectedOrder.deliveryAddress.state}, {selectedOrder.deliveryAddress.country}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div>
                <span className="text-xs text-slate-500 mr-2">Status</span>
                <OrderStatusBadge status={selectedOrder.status} />
              </div>
              <span className="font-bold text-brand-700 text-lg">{formatCurrency(selectedOrder.totalAmount)}</span>
            </div>

            {(selectedOrder.status === 'paid' || selectedOrder.status === 'processing') && (
              <div className="flex justify-end">
                <button onClick={() => handleMarkShipped(selectedOrder._id)} disabled={shipping}
                  className="btn-primary gap-2">
                  <Truck size={16} /> {shipping ? 'Updating…' : 'Mark as Shipped'}
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
export default VendorOrders;
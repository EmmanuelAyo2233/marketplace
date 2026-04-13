import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, MessageSquare, ShoppingBag, Truck, Star, AlertCircle, CheckCircle2, Trash2, Check } from 'lucide-react'
import { selectCurrentUser } from '../../store/authSlice'
import { notificationsAPI } from '../../services/endpoints'
import { connectSocket, getSocket } from '../../services/socket'
import { PageLoader } from '../../components/common'
import { timeAgo } from '../../utils/helpers'
import toast from 'react-hot-toast'

const TYPE_CONFIG = {
  message:  { icon: MessageSquare, color: 'text-brand-600',   bg: 'bg-brand-50' },
  order:    { icon: ShoppingBag,   color: 'text-blue-600',    bg: 'bg-blue-50' },
  delivery: { icon: Truck,         color: 'text-emerald-600', bg: 'bg-emerald-50' },
  review:   { icon: Star,          color: 'text-amber-500',   bg: 'bg-amber-50' },
  system:   { icon: AlertCircle,   color: 'text-slate-600',   bg: 'bg-slate-100' },
}

function Notifications() {
  const user = useSelector(selectCurrentUser)
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const fetchNotifications = async () => {
    try {
      const { data } = await notificationsAPI.getAll()
      setNotifications(data.notifications || [])
    } catch {}
    finally { setLoading(false) }
  }

  useEffect(() => { fetchNotifications() }, [])

  // Listen for real-time notifications
  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    const onNew = (notif) => {
      setNotifications(prev => [notif, ...prev])
    }

    socket.on('new_notification', onNew)
    return () => socket.off('new_notification', onNew)
  }, [])

  const handleMarkRead = async (id) => {
    try {
      await notificationsAPI.markAsRead(id)
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n))
    } catch { toast.error('Failed to mark as read') }
  }

  const handleMarkAllRead = async () => {
    try {
      await notificationsAPI.markAllRead()
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      toast.success('All notifications marked as read')
    } catch { toast.error('Failed to mark all as read') }
  }

  const handleClick = (notif) => {
    if (!notif.isRead) handleMarkRead(notif._id)
    if (notif.link) {
      const base = user?.role === 'vendor' ? '/vendor' : '/buyer'
      navigate(`${base}/${notif.link}`)
    }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length
  const filtered = filter === 'all' ? notifications : filter === 'unread' ? notifications.filter(n => !n.isRead) : notifications.filter(n => n.type === filter)

  const containerV = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } }
  const itemV = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120 } } }

  if (loading) return <PageLoader />

  return (
    <motion.div initial="hidden" animate="show" variants={containerV} className="max-w-4xl mx-auto space-y-6">

      {/* Header */}
      <motion.div variants={itemV} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-black text-slate-900 tracking-tight">Notifications</h1>
          <p className="text-sm font-medium text-slate-500 mt-0.5">
            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllRead}
            className="flex items-center gap-2 text-sm font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-4 py-2.5 rounded-xl transition-colors"
          >
            <CheckCircle2 size={16} /> Mark all as read
          </button>
        )}
      </motion.div>

      {/* Filter Tabs */}
      <motion.div variants={itemV} className="flex flex-wrap gap-2">
        {[
          { key: 'all', label: 'All' },
          { key: 'unread', label: `Unread (${unreadCount})` },
          { key: 'message', label: 'Messages' },
          { key: 'order', label: 'Orders' },
          { key: 'system', label: 'System' },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${filter === f.key ? 'bg-slate-900 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >{f.label}</button>
        ))}
      </motion.div>

      {/* Notification List */}
      <motion.div variants={itemV} className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Bell size={28} className="text-slate-400" />
            </div>
            <p className="text-sm font-bold text-slate-700 mb-1">No notifications</p>
            <p className="text-xs text-slate-400">
              {filter === 'unread' ? 'All caught up! No unread notifications.' : 'Your notifications will appear here.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            <AnimatePresence>
              {filtered.map(notif => {
                const cfg = TYPE_CONFIG[notif.type] || TYPE_CONFIG.system
                const Icon = cfg.icon
                return (
                  <motion.div
                    key={notif._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    onClick={() => handleClick(notif)}
                    className={`p-5 md:p-6 flex items-start gap-4 cursor-pointer transition-colors hover:bg-slate-50 group ${!notif.isRead ? 'bg-brand-50/30' : ''}`}
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${cfg.bg} group-hover:scale-105 transition-transform`}>
                      <Icon size={20} className={cfg.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className={`text-sm font-bold ${!notif.isRead ? 'text-slate-900' : 'text-slate-600'}`}>{notif.title}</h3>
                        <span className="text-[11px] font-bold text-slate-400 shrink-0">{timeAgo(notif.createdAt)}</span>
                      </div>
                      <p className={`text-sm ${!notif.isRead ? 'text-slate-700' : 'text-slate-500'} line-clamp-2`}>{notif.text}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 self-center">
                      {!notif.isRead && (
                        <>
                          <div className="w-2.5 h-2.5 bg-brand-500 rounded-full animate-pulse"></div>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleMarkRead(notif._id) }}
                            className="opacity-0 group-hover:opacity-100 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all"
                            title="Mark as read"
                          >
                            <Check size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
export default Notifications;

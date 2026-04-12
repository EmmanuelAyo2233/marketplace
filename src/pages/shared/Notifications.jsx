import { motion } from 'framer-motion'
import { Bell, ShoppingBag, Star, AlertCircle, CheckCircle2 } from 'lucide-react'

function Notifications() {
  const notifications = [
    { id: 1, title: 'Order Shipped', text: 'Order #ORD-8821 has been shipped and is out for delivery.', time: '2 hours ago', icon: ShoppingBag, color: 'text-brand-600', bg: 'bg-brand-50', unread: true },
    { id: 2, title: 'New Review', text: 'Alex left a 5-star review on your product.', time: '5 hours ago', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50', unread: true },
    { id: 3, title: 'Security Alert', text: 'New login detected from Mac OS device.', time: '1 day ago', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50', unread: false },
    { id: 4, title: 'Account Verified', text: 'Your KYC process has been successfully completed.', time: '3 days ago', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50', unread: false },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  }

  return (
    <motion.div initial="hidden" animate="show" variants={containerVariants} className="max-w-4xl mx-auto space-y-6">
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-black text-slate-900 tracking-tight">Notifications</h1>
          <p className="text-sm font-medium text-slate-500">Stay updated on your account activity.</p>
        </div>
        <button className="text-sm font-bold text-brand-600 hover:text-brand-700 bg-brand-50 px-4 py-2 rounded-xl transition-colors">
          Mark all as read
        </button>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="divide-y divide-slate-100">
          {notifications.map(notif => (
            <div key={notif.id} className={`p-6 flex items-start gap-4 transition-colors hover:bg-slate-50 ${notif.unread ? 'bg-slate-50/50' : ''}`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${notif.bg}`}>
                <notif.icon size={22} className={notif.color} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className={`text-[15px] font-bold ${notif.unread ? 'text-slate-900' : 'text-slate-700'}`}>{notif.title}</h3>
                  <span className="text-xs font-bold text-slate-400 shrink-0">{notif.time}</span>
                </div>
                <p className="text-sm text-slate-500">{notif.text}</p>
              </div>
              {notif.unread && (
                <div className="w-2.5 h-2.5 bg-brand-500 rounded-full shrink-0 self-center"></div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
export default Notifications;

import { motion } from 'framer-motion'
import { User, Lock, Bell, CreditCard, Shield } from 'lucide-react'

function Settings() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  }

  return (
    <motion.div initial="hidden" animate="show" variants={containerVariants} className="max-w-5xl mx-auto space-y-8">
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight">Account Settings</h1>
        <p className="text-slate-500 font-medium text-sm mt-1">Manage your preferences and platform security.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Settings Nav Sidebar */}
        <motion.div variants={itemVariants} className="lg:col-span-4">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4 space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm transition-all shadow-md">
              <User size={18} /> Profile Overview
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 hover:text-slate-900 transition-all">
              <Lock size={18} /> Password & Security
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 hover:text-slate-900 transition-all">
              <Bell size={18} /> Notifications
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 hover:text-slate-900 transition-all">
              <CreditCard size={18} /> Billing & Payouts
            </button>
          </div>
        </motion.div>

        {/* Settings Content Area */}
        <motion.div variants={itemVariants} className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            <div className="p-6 md:p-8 border-b border-slate-100">
              <h2 className="text-xl font-display font-black text-slate-900">Profile Information</h2>
              <p className="text-sm font-medium text-slate-500 mt-1">Update your personal details here.</p>
            </div>
            <div className="p-6 md:p-8 space-y-6">
              
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-brand-100 text-brand-700 font-black text-2xl flex items-center justify-center rounded-2xl shrink-0">
                  U
                </div>
                <div>
                  <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors mb-2">Change Avatar</button>
                  <p className="text-xs font-bold text-slate-400">JPG, GIF or PNG. Max size of 800K</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 block">Full Name</label>
                  <input type="text" defaultValue="Demo User" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-brand-500 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 block">Email Address</label>
                  <input type="email" defaultValue="demo@user.com" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-brand-500 outline-none transition-all" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-slate-700 block">Location</label>
                  <input type="text" defaultValue="Lagos, Nigeria" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-brand-500 outline-none transition-all" />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button className="bg-brand-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/20">
                  Save Changes
                </button>
              </div>
            </div>
          </div>

          <div className="bg-red-50 rounded-[2rem] border border-red-100 p-6 md:p-8 flex items-center justify-between gap-6">
            <div>
              <h2 className="text-lg font-display font-black text-red-700 flex items-center gap-2"><Shield size={20} /> Delete Account</h2>
              <p className="text-sm font-bold text-red-500 mt-1 max-w-sm">Permanently remove your account and all of its contents from the platform. This action is not reversible.</p>
            </div>
            <button className="bg-white text-red-600 border border-red-200 px-6 py-3 rounded-xl text-sm font-bold hover:bg-red-600 hover:text-white transition-all shadow-sm shrink-0">
              Delete Account
            </button>
          </div>
        </motion.div>

      </div>
    </motion.div>
  )
}
export default Settings;

import { motion } from 'framer-motion'
import { User, Lock, Bell, CreditCard, Shield } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentUser, updateUser } from '../../store/authSlice'
import { authAPI } from '../../services/endpoints'
import toast from 'react-hot-toast'

function Settings() {
  const user = useSelector(selectCurrentUser)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    location: user?.location || '',
    storeName: user?.storeName || '',
    storeDescription: user?.storeDescription || '',
    currentPassword: '',
    newPassword: ''
  })
  const [avatarFile, setAvatarFile] = useState(null)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        location: user.location || '',
        storeName: user.storeName || '',
        storeDescription: user.storeDescription || '',
        currentPassword: '',
        newPassword: ''
      })
    }
  }, [user])

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const submitData = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
         if (value !== undefined && value !== null) submitData.append(key, value)
      })
      if (avatarFile) {
         submitData.append('avatar', avatarFile)
      }

      const { data } = await authAPI.updateProfile(submitData)
      dispatch(updateUser(data.user || data))
      toast.success('Profile updated successfully!')
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '' }))
      setAvatarFile(null)
    } catch (err) {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }
  const itemVariants = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } } }

  return (
    <motion.div initial="hidden" animate="show" variants={containerVariants} className="max-w-5xl mx-auto space-y-8">
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight">Account Settings</h1>
        <p className="text-slate-500 font-medium text-sm mt-1">Manage your preferences and platform security.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
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

        <motion.div variants={itemVariants} className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            <div className="p-6 md:p-8 border-b border-slate-100">
              <h2 className="text-xl font-display font-black text-slate-900">Profile Information</h2>
              <p className="text-sm font-medium text-slate-500 mt-1">Update your personal details here.</p>
            </div>
            <div className="p-6 md:p-8 space-y-6">
              
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-brand-100 text-brand-700 font-black text-2xl flex items-center justify-center rounded-2xl shrink-0 uppercase overflow-hidden">
                  {avatarFile ? <img src={URL.createObjectURL(avatarFile)} className="object-cover w-full h-full" alt="Avatar"/> : (user?.avatar ? <img src={user.avatar} className="object-cover w-full h-full" alt="Avatar"/> : user?.name?.[0] || 'U')}
                </div>
                <div>
                  <input type="file" id="avatar" accept="image/*" className="hidden" onChange={(e) => {
                     if (e.target.files[0]) {
                        setAvatarFile(e.target.files[0]);
                        toast.success('Avatar selected! Click save to apply.');
                     }
                  }} />
                  <label htmlFor="avatar" className="inline-block bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors mb-2 cursor-pointer">
                    Change Avatar
                  </label>
                  <p className="text-xs font-bold text-slate-400">JPG, GIF or PNG. Max size of 800K</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 block">Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-brand-500 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 block">Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-brand-500 outline-none transition-all" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-slate-700 block">Location</label>
                  <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-brand-500 outline-none transition-all" />
                </div>

                {/* Password Section */}
                <div className="space-y-2 md:col-span-2 pt-4 border-t border-slate-100">
                  <h3 className="text-md font-display font-bold text-slate-900 block">Security</h3>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 block">Current Password</label>
                  <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} placeholder="••••••••" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-brand-500 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 block">New Password</label>
                  <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} placeholder="••••••••" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-brand-500 outline-none transition-all" />
                </div>

                {user?.role === 'vendor' && (
                  <>
                    <div className="space-y-2 md:col-span-2 pt-4 border-t border-slate-100">
                      <h3 className="text-md font-display font-bold text-slate-900 block">Vendor Details</h3>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-bold text-slate-700 block">Store Name</label>
                      <input type="text" name="storeName" value={formData.storeName} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-brand-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-bold text-slate-700 block">Store Description</label>
                      <textarea name="storeDescription" value={formData.storeDescription} onChange={handleChange} rows="3" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-brand-500 outline-none transition-all resize-none"></textarea>
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button onClick={handleSubmit} disabled={loading} className="bg-brand-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/20 disabled:opacity-50">
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
export default Settings;

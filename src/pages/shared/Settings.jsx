import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Lock, Bell, CreditCard, Shield, ShieldCheck, ShieldAlert, ArrowRight, ArrowLeft, Upload, FileText, CheckCircle2, Clock, AlertTriangle, X } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentUser, updateUser } from '../../store/authSlice'
import { authAPI, vendorsAPI } from '../../services/endpoints'
import { imgUrl } from '../../utils/helpers'
import toast from 'react-hot-toast'

function Settings() {
  const user = useSelector(selectCurrentUser)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')

  // Profile Form State
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

  // KYC Form State
  const [kycStep, setKycStep] = useState(1)
  const [kycData, setKycData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    residentialAddress: '',
    businessAddress: '',
    businessName: '',
    businessCategory: 'Electronics',
    businessDescription: '',
    cacNumber: '',
    taxIdentificationNumber: '',
    storeName: '',
    storeDescription: '',
    termsAccepted: false
  })
  const [idFile, setIdFile] = useState(null)
  const [selfieFile, setSelfieFile] = useState(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const tab = params.get('tab')
    if (tab && ['profile', 'security', 'notifications', 'billing', 'kyc'].includes(tab)) {
       setActiveTab(tab)
    }
  }, [])

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
      setKycData(prev => ({
        ...prev,
        fullName: user.fullName || user.name || '',
        email: user.kycEmail || user.email || '',
        phoneNumber: user.phoneNumber || '',
        residentialAddress: user.residentialAddress || user.location || '',
        businessAddress: user.businessAddress || '',
        businessName: user.businessName || user.storeName || '',
        businessCategory: user.businessCategory || 'Electronics',
        businessDescription: user.businessDescription || user.storeDescription || '',
        cacNumber: user.cacNumber || '',
        taxIdentificationNumber: user.taxIdentificationNumber || '',
        storeName: user.storeName || '',
        storeDescription: user.storeDescription || '',
      }))
    }
  }, [user])

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleKycChange = (e) => {
    const { name, value, type, checked } = e.target
    setKycData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }))
  }

  const handleProfileSubmit = async () => {
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

  const handleKycSubmit = async () => {
    if (!kycData.termsAccepted) {
      return toast.error('You must accept the terms and guidelines to submit')
    }
    setLoading(true)
    try {
      const submitData = new FormData()
      Object.entries(kycData).forEach(([key, value]) => {
        submitData.append(key, value)
      })
      if (idFile) submitData.append('idDocument', idFile)
      if (selfieFile) submitData.append('selfiePhoto', selfieFile)

      const { data } = await vendorsAPI.submitKYC(submitData)
      
      // Fetch fresh profile data to update Redux user
      const meRes = await authAPI.me()
      dispatch(updateUser(meRes.data.user || meRes.data))
      
      toast.success('KYC submitted successfully!')
      setKycStep(1)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit KYC')
    } finally {
      setLoading(false)
    }
  }

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }
  const itemVariants = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } } }

  return (
    <motion.div initial="hidden" animate="show" variants={containerVariants} className="max-w-6xl mx-auto space-y-8">
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight">Account Settings</h1>
        <p className="text-slate-500 font-medium text-sm mt-1">Manage your preferences, security and seller verification.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ── Left Sidebar Navigation ── */}
        <motion.div variants={itemVariants} className="lg:col-span-4">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4 space-y-1">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${activeTab === 'profile' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <User size={18} /> Profile Overview
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${activeTab === 'security' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <Lock size={18} /> Password & Security
            </button>
            <button 
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${activeTab === 'notifications' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <Bell size={18} /> Notifications
            </button>
            <button 
              onClick={() => setActiveTab('billing')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${activeTab === 'billing' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <CreditCard size={18} /> Billing & Payouts
            </button>
            {user?.role === 'vendor' && (
              <button 
                onClick={() => setActiveTab('kyc')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${activeTab === 'kyc' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                {user.isVerified ? (
                  <ShieldCheck size={18} className="text-emerald-500" />
                ) : user.verificationStatus === 'pending' ? (
                  <Clock size={18} className="text-amber-500" />
                ) : user.verificationStatus === 'rejected' ? (
                  <ShieldAlert size={18} className="text-red-500" />
                ) : (
                  <Shield size={18} />
                )}
                KYC Verification
              </button>
            )}
          </div>
        </motion.div>

        {/* ── Right Content Area ── */}
        <motion.div variants={itemVariants} className="lg:col-span-8 space-y-6">
          {/* PROFILE OVERVIEW TAB */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
              <div className="p-6 md:p-8 border-b border-slate-100">
                <h2 className="text-xl font-display font-black text-slate-900">Profile Information</h2>
                <p className="text-sm font-medium text-slate-500 mt-1">Update your public details and profile image.</p>
              </div>
              <div className="p-6 md:p-8 space-y-6">
                
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-brand-100 text-brand-700 font-black text-2xl flex items-center justify-center rounded-2xl shrink-0 uppercase overflow-hidden">
                    {avatarFile ? (
                      <img src={URL.createObjectURL(avatarFile)} className="object-cover w-full h-full" alt="Avatar"/>
                    ) : user?.avatar ? (
                      <img src={imgUrl(user.avatar)} className="object-cover w-full h-full" alt="Avatar"/>
                    ) : (
                      user?.name?.[0] || 'U'
                    )}
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
                    <p className="text-xs font-bold text-slate-400">JPG, JPEG or PNG. Max size of 2MB</p>
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

                  {user?.role === 'vendor' && (
                    <>
                      <div className="space-y-2 md:col-span-2 pt-4 border-t border-slate-100">
                        <h3 className="text-md font-display font-bold text-slate-900 block">Store Details</h3>
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
                  <button onClick={handleProfileSubmit} disabled={loading} className="bg-brand-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/20 disabled:opacity-50">
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* PASSWORD & SECURITY TAB */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
              <div className="p-6 md:p-8 border-b border-slate-100">
                <h2 className="text-xl font-display font-black text-slate-900">Password & Security</h2>
                <p className="text-sm font-medium text-slate-500 mt-1">Change your account password below.</p>
              </div>
              <div className="p-6 md:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 block">Current Password</label>
                    <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} placeholder="••••••••" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-brand-500 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 block">New Password</label>
                    <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} placeholder="••••••••" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-brand-500 outline-none transition-all" />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button onClick={handleProfileSubmit} disabled={loading} className="bg-brand-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/20 disabled:opacity-50">
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 text-center py-16">
              <Bell className="mx-auto text-slate-300 mb-4" size={48} />
              <h3 className="font-bold text-lg text-slate-900">Notification Settings</h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto mt-2">Choose what notifications you want to receive. This feature is currently pre-configured to email you on order placements and chats.</p>
            </div>
          )}

          {/* BILLING TAB */}
          {activeTab === 'billing' && (
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 text-center py-16">
              <CreditCard className="mx-auto text-slate-300 mb-4" size={48} />
              <h3 className="font-bold text-lg text-slate-900">Billing & Payouts</h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto mt-2">Manage your settlement account details, bank transfers and sales transactions in the wallet tab on your dashboard.</p>
            </div>
          )}

          {/* KYC VERIFICATION TAB */}
          {activeTab === 'kyc' && user?.role === 'vendor' && (
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
              <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-display font-black text-slate-900">KYC Verification Center</h2>
                  <p className="text-sm font-medium text-slate-500 mt-1">Complete verification to unlock product management capabilities.</p>
                </div>
                {user.isVerified && (
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-black px-3.5 py-1.5 rounded-full border border-emerald-200">
                    <ShieldCheck size={14} strokeWidth={2.5} /> Verified Seller
                  </span>
                )}
                {!user.isVerified && user.verificationStatus === 'pending' && (
                  <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-xs font-black px-3.5 py-1.5 rounded-full border border-amber-200 animate-pulse">
                    <Clock size={14} strokeWidth={2.5} /> Pending Review
                  </span>
                )}
                {!user.isVerified && user.verificationStatus === 'rejected' && (
                  <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-xs font-black px-3.5 py-1.5 rounded-full border border-red-200">
                    <ShieldAlert size={14} strokeWidth={2.5} /> Rejected
                  </span>
                )}
              </div>

              <div className="p-6 md:p-8">
                {/* ── Status Trackers ── */}
                {user.isVerified && (
                  <div className="space-y-6 py-4 text-center">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2 text-emerald-600 shadow-md">
                      <ShieldCheck size={40} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900">Your Vendor Account is Verified!</h3>
                      <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto leading-relaxed">
                        Congratulations! You have completed Know Your Customer (KYC) checks. You now have a <strong>Verified Seller</strong> badge and full access to store listings.
                      </p>
                    </div>
                    {user.verifiedAt && (
                      <p className="text-xs text-slate-400 font-medium">Verified on {new Date(user.verifiedAt).toLocaleDateString()}</p>
                    )}
                  </div>
                )}

                {!user.isVerified && user.verificationStatus === 'pending' && (
                  <div className="space-y-6 py-4 text-center">
                    <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2 text-amber-600 animate-bounce">
                      <Clock size={40} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900">Verification in Progress</h3>
                      <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto leading-relaxed">
                        We are currently reviewing your submitted KYC details and identity documents. This process usually takes under 24 hours. You will receive a notification once complete.
                      </p>
                    </div>
                    
                    <div className="max-w-md mx-auto bg-slate-50 rounded-2xl border border-slate-100 p-5 text-left text-xs space-y-3">
                      <p className="font-bold text-slate-700 border-b border-slate-200 pb-2">Submitted Profile Info Preview</p>
                      <div className="grid grid-cols-2 gap-2">
                        <span className="text-slate-400">Merchant Name:</span>
                        <span className="font-semibold text-slate-800">{user.fullName || user.name}</span>
                        
                        <span className="text-slate-400">Business Name:</span>
                        <span className="font-semibold text-slate-800">{user.businessName}</span>
                        
                        <span className="text-slate-400">Category:</span>
                        <span className="font-semibold text-slate-800">{user.businessCategory}</span>
                        
                        <span className="text-slate-400">CAC Number:</span>
                        <span className="font-mono text-slate-800 font-semibold">{user.cacNumber || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* KYC Submission Form (renders if unsubmitted or rejected) */}
                {!user.isVerified && (user.verificationStatus === 'unsubmitted' || !user.verificationStatus || user.verificationStatus === 'rejected') && (
                  <div className="space-y-8">
                    {user.verificationStatus === 'rejected' && (
                      <div className="flex items-start gap-4 bg-red-50 border border-red-200 rounded-2xl p-5 mb-4 animate-fade-in">
                        <AlertTriangle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                        <div>
                          <p className="font-bold text-red-900 text-sm">KYC Verification Rejected</p>
                          <p className="text-xs text-red-700 font-medium leading-relaxed mt-1">
                            Reason: {user.rejectionReason || 'Documents uploaded were unclear. Please upload high resolution files.'}
                          </p>
                          <p className="text-[11px] text-red-500 font-semibold mt-2">Please correct the entries and resubmit below.</p>
                        </div>
                      </div>
                    )}

                    {/* Progress Indicator */}
                    <div className="flex items-center justify-between max-w-md mx-auto mb-6">
                      {[1, 2, 3, 4].map(step => (
                        <div key={step} className="flex items-center flex-1 last:flex-initial">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${kycStep === step ? 'bg-slate-900 text-white ring-4 ring-slate-100 scale-110' : kycStep > step ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                            {kycStep > step ? '✓' : step}
                          </div>
                          {step < 4 && (
                            <div className={`h-1 flex-1 mx-2 rounded-full transition-all ${kycStep > step ? 'bg-emerald-500' : 'bg-slate-100'}`} />
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 max-w-2xl mx-auto">
                      {/* Step 1: Personal Info */}
                      {kycStep === 1 && (
                        <div className="space-y-4">
                          <h3 className="font-display font-bold text-slate-800 text-md mb-4 border-b border-slate-100 pb-2">Step 1: Personal Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-600">Full Name (Legal Name)</label>
                              <input type="text" name="fullName" value={kycData.fullName} onChange={handleKycChange} placeholder="e.g. John Doe" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-brand-500 outline-none" required />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-600">KYC Email Address</label>
                              <input type="email" name="email" value={kycData.email} onChange={handleKycChange} placeholder="e.g. john@business.com" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-brand-500 outline-none" required />
                            </div>
                            <div className="space-y-1 md:col-span-2">
                              <label className="text-xs font-bold text-slate-600">Phone Number</label>
                              <input type="tel" name="phoneNumber" value={kycData.phoneNumber} onChange={handleKycChange} placeholder="e.g. +234 80 1234 5678" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-brand-500 outline-none" required />
                            </div>
                            <div className="space-y-1 md:col-span-2">
                              <label className="text-xs font-bold text-slate-600">Residential Address</label>
                              <textarea name="residentialAddress" value={kycData.residentialAddress} onChange={handleKycChange} placeholder="Complete home address" rows="2" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-brand-500 outline-none resize-none" required />
                            </div>
                            <div className="space-y-1 md:col-span-2">
                              <label className="text-xs font-bold text-slate-600 flex justify-between">
                                <span>Business Address</span>
                                <span className="text-[10px] text-slate-400 font-bold italic">(Leave blank if same as residential)</span>
                              </label>
                              <textarea name="businessAddress" value={kycData.businessAddress} onChange={handleKycChange} placeholder="Complete business address" rows="2" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-brand-500 outline-none resize-none" />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Step 2: Business Info */}
                      {kycStep === 2 && (
                        <div className="space-y-4">
                          <h3 className="font-display font-bold text-slate-800 text-md mb-4 border-b border-slate-100 pb-2">Step 2: Business Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-600">Business/Trading Name</label>
                              <input type="text" name="businessName" value={kycData.businessName} onChange={handleKycChange} placeholder="e.g. Acme Tech Solutions" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-brand-500 outline-none" required />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-600">Business Category</label>
                              <select name="businessCategory" value={kycData.businessCategory} onChange={handleKycChange} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-brand-500 outline-none">
                                <option value="Electronics">Electronics</option>
                                <option value="Fashion">Fashion</option>
                                <option value="Home & Kitchen">Home & Kitchen</option>
                                <option value="Agriculture">Agriculture</option>
                                <option value="Beauty & Personal Care">Beauty & Personal Care</option>
                                <option value="Services">Services</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                            <div className="space-y-1 md:col-span-2">
                              <label className="text-xs font-bold text-slate-600">Business Description</label>
                              <textarea name="businessDescription" value={kycData.businessDescription} onChange={handleKycChange} placeholder="Describe what products or services you trade..." rows="3" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-brand-500 outline-none resize-none" required />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-600 flex justify-between">
                                <span>CAC Reg. Number</span>
                                <span className="text-[10px] text-slate-400 font-bold italic">(Optional for small traders)</span>
                              </label>
                              <input type="text" name="cacNumber" value={kycData.cacNumber} onChange={handleKycChange} placeholder="e.g. RC 123456" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-brand-500 outline-none" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-600 flex justify-between">
                                <span>Tax ID Number (TIN)</span>
                                <span className="text-[10px] text-slate-400 font-bold italic">(Optional)</span>
                              </label>
                              <input type="text" name="taxIdentificationNumber" value={kycData.taxIdentificationNumber} onChange={handleKycChange} placeholder="e.g. 12345678-0001" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-brand-500 outline-none" />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Step 3: Identity Verification */}
                      {kycStep === 3 && (
                        <div className="space-y-6">
                          <div>
                            <h3 className="font-display font-bold text-slate-800 text-md border-b border-slate-100 pb-2">Step 3: Identity Documents</h3>
                            <p className="text-xs text-slate-400 font-medium mt-1">Please upload clear, legible images (JPG, JPEG or PNG) max size 2MB.</p>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Gov ID File Input */}
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-700 block">Government-Issued ID</label>
                              <p className="text-[10px] text-slate-400 font-medium">Driver's License, National ID Card, International Passport or Voter's Card.</p>
                              
                              <div className="relative border-2 border-dashed border-slate-200 hover:border-slate-400 rounded-2xl p-6 transition-all text-center bg-white cursor-pointer group">
                                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => {
                                  if (e.target.files[0]) {
                                    setIdFile(e.target.files[0])
                                    toast.success('ID document uploaded!')
                                  }
                                }} />
                                {idFile ? (
                                  <div className="space-y-2">
                                    <FileText className="mx-auto text-brand-600" size={32} />
                                    <p className="text-xs font-bold text-slate-800 truncate px-2">{idFile.name}</p>
                                    <button onClick={e => { e.preventDefault(); e.stopPropagation(); setIdFile(null); }} className="text-[10px] font-bold text-red-500 hover:underline">Remove</button>
                                  </div>
                                ) : (
                                  <div className="space-y-2">
                                    <Upload className="mx-auto text-slate-400 group-hover:text-brand-500 transition-colors" size={28} />
                                    <p className="text-xs font-bold text-slate-600">Click to Upload ID</p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Selfie File Input */}
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-700 block">Selfie Photograph</label>
                              <p className="text-[10px] text-slate-400 font-medium">Hold your ID card next to your face in a well-lit room for identity confirmation.</p>
                              
                              <div className="relative border-2 border-dashed border-slate-200 hover:border-slate-400 rounded-2xl p-6 transition-all text-center bg-white cursor-pointer group">
                                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => {
                                  if (e.target.files[0]) {
                                    setSelfieFile(e.target.files[0])
                                    toast.success('Selfie photograph uploaded!')
                                  }
                                }} />
                                {selfieFile ? (
                                  <div className="space-y-2">
                                    <img src={URL.createObjectURL(selfieFile)} className="w-16 h-16 rounded-full object-cover mx-auto shadow-sm border border-slate-200" alt="Selfie preview" />
                                    <p className="text-xs font-bold text-slate-800 truncate px-2">{selfieFile.name}</p>
                                    <button onClick={e => { e.preventDefault(); e.stopPropagation(); setSelfieFile(null); }} className="text-[10px] font-bold text-red-500 hover:underline">Remove</button>
                                  </div>
                                ) : (
                                  <div className="space-y-2">
                                    <Upload className="mx-auto text-slate-400 group-hover:text-brand-500 transition-colors" size={28} />
                                    <p className="text-xs font-bold text-slate-600">Click to Upload Selfie</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Step 4: Store Info & Agreements */}
                      {kycStep === 4 && (
                        <div className="space-y-4">
                          <h3 className="font-display font-bold text-slate-800 text-md mb-4 border-b border-slate-100 pb-2">Step 4: Store Details & Agreements</h3>
                          <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-600">Store Name</label>
                              <input type="text" name="storeName" value={kycData.storeName} onChange={handleKycChange} placeholder="e.g. Acme Marketplace" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-brand-500 outline-none" required />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-600">Store Description</label>
                              <textarea name="storeDescription" value={kycData.storeDescription} onChange={handleKycChange} placeholder="Summarize your store products, specialty, and services..." rows="3" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-brand-500 outline-none resize-none" required />
                            </div>
                            
                            <div className="mt-4 p-4 bg-white border border-slate-200 rounded-2xl space-y-3">
                              <p className="text-xs font-bold text-slate-700 border-b border-slate-100 pb-2">Terms & Policies</p>
                              <div className="flex items-start gap-2.5">
                                <input type="checkbox" name="termsAccepted" checked={kycData.termsAccepted} onChange={handleKycChange} id="termsAccepted" className="mt-0.5 rounded cursor-pointer" required />
                                <label htmlFor="termsAccepted" className="text-xs text-slate-500 font-semibold cursor-pointer select-none leading-relaxed">
                                  I read and accept the <a href="#" onClick={e => e.preventDefault()} className="text-brand-600 hover:underline">Terms & Conditions</a>, <a href="#" onClick={e => e.preventDefault()} className="text-brand-600 hover:underline">Seller Policy</a>, and the platform's <a href="#" onClick={e => e.preventDefault()} className="text-brand-600 hover:underline">Marketplace Rules and Guidelines</a>.
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Navigation Controls */}
                      <div className="flex items-center justify-between border-t border-slate-100 pt-6 mt-6">
                        <button 
                          onClick={() => setKycStep(s => Math.max(1, s - 1))}
                          className="btn-secondary flex items-center gap-1 shadow-sm px-4 py-2 text-xs"
                          disabled={kycStep === 1}
                        >
                          <ArrowLeft size={14} /> Back
                        </button>
                        
                        {kycStep < 4 ? (
                          <button 
                            onClick={() => {
                              // Perform lightweight validation per step
                              if (kycStep === 1 && (!kycData.fullName || !kycData.email || !kycData.phoneNumber || !kycData.residentialAddress)) {
                                return toast.error('Please fill in all required fields')
                              }
                              if (kycStep === 2 && (!kycData.businessName || !kycData.businessCategory || !kycData.businessDescription)) {
                                return toast.error('Please fill in all required fields')
                              }
                              if (kycStep === 3 && (!idFile || !selfieFile)) {
                                return toast.error('Please upload both required documents')
                              }
                              setKycStep(s => s + 1)
                            }}
                            className="btn-primary flex items-center gap-1 shadow-md px-4 py-2 text-xs bg-slate-900 hover:bg-slate-800"
                          >
                            Next <ArrowRight size={14} />
                          </button>
                        ) : (
                          <button 
                            onClick={handleKycSubmit} 
                            disabled={loading || !kycData.termsAccepted}
                            className="btn-primary flex items-center gap-1 shadow-lg px-6 py-2.5 text-xs bg-brand-600 hover:bg-brand-700"
                          >
                            {loading ? 'Submitting...' : 'Submit Verification'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Settings

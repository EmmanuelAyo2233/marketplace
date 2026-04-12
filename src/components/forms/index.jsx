import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Mail, Lock, User, Store, Phone, MapPin, Tag } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function FieldError({ msg }) {
  return msg ? <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 font-medium mt-1.5 ml-1">{msg}</motion.p> : null
}

// ─── Login Form ───────────────────────────────────────────────
export function LoginForm({ onSubmit, loading }) {
  const [showPw, setShowPw] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block">Email Address</label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors">
            <Mail size={18} />
          </div>
          <input 
            type="email" 
            placeholder="e.g., you@domain.com"
            className={`w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-[15px] font-medium text-slate-800 placeholder:text-slate-400 placeholder:font-normal outline-none focus:bg-white focus:border-brand-500 focus:ring-[4px] focus:ring-brand-500/15 transition-all shadow-sm ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : ''}`}
            {...register('email', { required: 'Please enter your email' })} 
          />
        </div>
        <FieldError msg={errors.email?.message} />
      </div>

      <div>
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block">Password</label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors">
            <Lock size={18} />
          </div>
          <input 
            type={showPw ? 'text' : 'password'} 
            placeholder="••••••••"
            className={`w-full pl-11 pr-12 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-[15px] font-medium text-slate-800 placeholder:text-slate-400 placeholder:font-normal outline-none focus:bg-white focus:border-brand-500 focus:ring-[4px] focus:ring-brand-500/15 transition-all shadow-sm ${errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : ''}`}
            {...register('password', { required: 'Password is required' })} 
          />
          <button 
            type="button" 
            onClick={() => setShowPw(!showPw)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-700 transition-colors bg-transparent border-none outline-none"
          >
            {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <FieldError msg={errors.password?.message} />
      </div>

      <div className="flex items-center justify-between !mt-5 !mb-8">
        <label className="flex items-center gap-2.5 cursor-pointer group">
          <div className="relative flex items-center justify-center">
            <input type="checkbox" className="peer w-5 h-5 rounded-md border-slate-300 text-brand-600 focus:ring-brand-500 transition-all cursor-pointer" />
          </div>
          <span className="text-sm font-medium text-slate-600 select-none group-hover:text-slate-800 transition-colors">Remember me</span>
        </label>
        <button type="button" className="text-sm font-bold text-brand-600 hover:text-brand-800 hover:underline transition-colors">
          Forgot Password?
        </button>
      </div>

      <button 
        type="submit" 
        disabled={loading} 
        className="w-full relative px-6 py-4 bg-brand-600 text-white font-extrabold text-[15px] tracking-wide rounded-2xl shadow-[0_8px_20px_rgba(37,99,235,0.25)] hover:bg-brand-700 hover:shadow-[0_12px_24px_rgba(37,99,235,0.3)] hover:-translate-y-[2px] active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:transform-none"
      >
        {loading ? 'Authenticating...' : 'Sign In'}
      </button>
    </form>
  )
}

// ─── Register Form ─────────────────────────────────────────────
const BUSINESS_CATEGORIES = ['Electronics','Fashion','Home/Living','Food/Drinks','Sports','Other']

export function RegisterForm({ onSubmit, loading, defaultRole }) {
  const [showPw, setShowPw] = useState(false)
  const [step, setStep] = useState(1)
  
  const { register, handleSubmit, watch, trigger, formState: { errors } } = useForm({
    defaultValues: { role: defaultRole || 'buyer' }
  })
  
  const role = watch('role')

  const handleNextStep = async () => {
    const valid = await trigger(['name', 'email', 'password', 'phone'])
    if (valid) setStep(2)
  }

  const handlePrevStep = () => {
    setStep(1)
  }

  const variants = {
    initial: { x: 30, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -30, opacity: 0 }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 overflow-visible">
      {/* Role Selection */}
      {step === 1 && (
        <div className="grid grid-cols-2 gap-4 mb-3">
          {[
            { id: 'buyer', icon: User, label: 'Buyer', desc: 'I want to buy' },
            { id: 'vendor', icon: Store, label: 'Seller', desc: 'I want to sell' }
          ].map(r => (
            <label 
              key={r.id}
              className={`flex flex-col items-start gap-3 p-4 rounded-2xl border-[2px] cursor-pointer transition-all duration-300 ease-out relative overflow-hidden
                ${role === r.id ? 'border-brand-600 bg-brand-50/30 shadow-[0_8px_16px_rgba(37,99,235,0.06)] scale-[1.02]' : 'border-slate-100 bg-white hover:border-brand-200 hover:bg-slate-50/50'}`}
            >
              <input type="radio" value={r.id} {...register('role')} className="sr-only" onChange={(e) => {
                register('role').onChange(e);
                setStep(1); 
              }} />
              
              <div className={`absolute top-0 right-0 w-16 h-16 rounded-full -translate-y-1/2 translate-x-1/2 transition-colors duration-500 ${role === r.id ? 'bg-brand-100' : 'bg-transparent'}`} />
              
              <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 transition-colors relative z-10
                ${role === r.id ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30' : 'bg-slate-100 text-slate-500'}`}>
                <r.icon size={20} strokeWidth={2.5} />
              </div>
              <div className="relative z-10 w-full pt-1">
                <p className={`text-[15px] font-extrabold ${role === r.id ? 'text-brand-800' : 'text-slate-700'}`}>
                  {r.label}
                </p>
                <p className={`text-[12px] font-medium mt-0.5 ${role === r.id ? 'text-brand-600/80' : 'text-slate-500'}`}>
                  {r.desc}
                </p>
              </div>
            </label>
          ))}
        </div>
      )}

      {/* Progress Bar for Seller Multi-step */}
      {role === 'vendor' && (
        <div className="w-full mb-8 space-y-2">
           <div className="flex justify-between items-center px-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Step {step} of 2</span>
              <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-md">{step === 1 ? 'Basic Info' : 'Business Info'}</span>
           </div>
           <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
             <motion.div 
               className="h-full bg-gradient-to-r from-brand-500 to-brand-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.4)]"
               initial={{ width: step === 1 ? '50%' : '100%' }}
               animate={{ width: step === 1 ? '50%' : '100%' }}
               transition={{ type: "spring", stiffness: 60, damping: 15 }}
             />
           </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1" 
            variants={variants} 
            initial="initial" 
            animate="animate" 
            exit="exit" 
            transition={{ duration: 0.2 }}
            className="space-y-5"
          >
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors">
                  <User size={18} />
                </div>
                <input type="text" placeholder="e.g. John Doe"
                  className={`w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-[15px] font-medium text-slate-800 placeholder:text-slate-400 placeholder:font-normal outline-none focus:bg-white focus:border-brand-500 focus:ring-[4px] focus:ring-brand-500/15 transition-all shadow-sm ${errors.name ? 'border-red-300 focus:ring-red-100' : ''}`}
                  {...register('name', { required: 'Full name is required' })} />
              </div>
              <FieldError msg={errors.name?.message} />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input type="email" placeholder="e.g. you@example.com"
                  className={`w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-[15px] font-medium text-slate-800 placeholder:text-slate-400 placeholder:font-normal outline-none focus:bg-white focus:border-brand-500 focus:ring-[4px] focus:ring-brand-500/15 transition-all shadow-sm ${errors.email ? 'border-red-300 focus:ring-red-100' : ''}`}
                  {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' } })} />
              </div>
              <FieldError msg={errors.email?.message} />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input type={showPw ? 'text' : 'password'} placeholder="Min 6 characters"
                  className={`w-full pl-11 pr-12 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-[15px] font-medium text-slate-800 placeholder:text-slate-400 placeholder:font-normal outline-none focus:bg-white focus:border-brand-500 focus:ring-[4px] focus:ring-brand-500/15 transition-all shadow-sm ${errors.password ? 'border-red-300 focus:ring-red-100' : ''}`}
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-700 transition-colors bg-transparent border-none outline-none">
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <FieldError msg={errors.password?.message} />
            </div>
            
            {role === 'buyer' ? (
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full !mt-8 px-6 py-4 bg-brand-600 text-white font-extrabold text-[15px] tracking-wide rounded-2xl shadow-[0_8px_20px_rgba(37,99,235,0.25)] hover:bg-brand-700 hover:shadow-[0_12px_24px_rgba(37,99,235,0.3)] hover:-translate-y-[2px] active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:transform-none"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            ) : (
              <button 
                type="button" 
                onClick={handleNextStep}
                className="flex items-center justify-center w-full !mt-8 px-6 py-4 bg-slate-900 border border-slate-800 text-white font-extrabold text-[15px] tracking-wide rounded-2xl shadow-[0_8px_20px_rgba(15,23,42,0.25)] hover:bg-slate-800 hover:shadow-[0_12px_24px_rgba(15,23,42,0.3)] hover:-translate-y-[2px] active:scale-[0.98] transition-all duration-200"
              >
                Next Step
              </button>
            )}
          </motion.div>
        )}

        {step === 2 && role === 'vendor' && (
          <motion.div 
            key="step2" 
            variants={variants} 
            initial="initial" 
            animate="animate" 
            exit="exit" 
            transition={{ duration: 0.2 }}
            className="space-y-5"
          >
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block">Store Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors">
                  <Store size={18} />
                </div>
                <input type="text" placeholder="e.g. My Awesome Shop"
                  className={`w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-[15px] font-medium text-slate-800 placeholder:text-slate-400 placeholder:font-normal outline-none focus:bg-white focus:border-brand-500 focus:ring-[4px] focus:ring-brand-500/15 transition-all shadow-sm ${errors.storeName ? 'border-red-300 focus:ring-red-100' : ''}`}
                  {...register('storeName', { required: 'Store name is required' })} />
              </div>
              <FieldError msg={errors.storeName?.message} />
            </div>

            <div>
               <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block">Store Category</label>
               <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors z-10">
                    <Tag size={18} />
                  </div>
                  <select 
                     className={`w-full pl-11 pr-10 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-[15px] font-medium text-slate-800 outline-none focus:bg-white focus:border-brand-500 focus:ring-[4px] focus:ring-brand-500/15 transition-all shadow-sm appearance-none cursor-pointer ${errors.storeCategory ? 'border-red-300 focus:ring-red-100' : ''}`}
                     {...register('storeCategory', { required: 'Category is required' })}
                  >
                     <option value="" disabled className="text-slate-400">Select business category</option>
                     {BUSINESS_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-500">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
               </div>
               <FieldError msg={errors.storeCategory?.message} />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block">Store Description</label>
              <textarea rows={3} placeholder="What do you sell?"
                className={`w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-[15px] font-medium text-slate-800 placeholder:text-slate-400 placeholder:font-normal outline-none focus:bg-white focus:border-brand-500 focus:ring-[4px] focus:ring-brand-500/15 transition-all shadow-sm resize-none ${errors.storeDescription ? 'border-red-300 focus:ring-red-100' : ''}`}
                {...register('storeDescription', { required: 'Please describe your store' })} />
              <FieldError msg={errors.storeDescription?.message} />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 block">Business Address</label>
              <div className="relative group">
                <div className="absolute top-0 left-0 pl-4 pt-3.5 text-slate-400 group-focus-within:text-brand-500 transition-colors">
                  <MapPin size={18} />
                </div>
                <textarea rows={2} placeholder="Physical address or location"
                  className={`w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-[15px] font-medium text-slate-800 placeholder:text-slate-400 placeholder:font-normal outline-none focus:bg-white focus:border-brand-500 focus:ring-[4px] focus:ring-brand-500/15 transition-all shadow-sm resize-none`}
                  {...register('businessAddress')} />
              </div>
            </div>

            <div className="flex gap-3 !mt-8">
               <button 
                  type="button" 
                  onClick={handlePrevStep}
                  className="px-6 py-4 bg-white border border-slate-200 text-slate-700 font-extrabold text-[15px] rounded-2xl hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] transition-all duration-200"
               >
                 Back
               </button>
               <button 
                  type="submit" 
                  disabled={loading} 
                  className="flex-1 px-6 py-4 bg-brand-600 text-white font-extrabold text-[15px] tracking-wide rounded-2xl shadow-[0_8px_20px_rgba(37,99,235,0.25)] hover:bg-brand-700 hover:shadow-[0_12px_24px_rgba(37,99,235,0.3)] hover:-translate-y-[2px] active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:transform-none"
               >
                 {loading ? 'Creating...' : 'Submit Form'}
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  )
}

// ─── Product Form (Kept identical as requested/untouched conceptually) ───
const PRODUCT_CATEGORIES = [
  'Electronics','Fashion','Home & Living','Beauty & Health',
  'Food & Drinks','Sports','Books','Toys','Automotive','Other'
]

export function ProductForm({ onSubmit, loading, defaultValues }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className="label">Product name *</label>
          <input type="text" placeholder="e.g. iPhone 14 Pro Max 256GB"
            className={`input ${errors.name ? 'input-error' : ''}`}
            {...register('name', { required: 'Product name is required' })} />
          <FieldError msg={errors.name?.message} />
        </div>

        <div>
          <label className="label">Price (₦) *</label>
          <input type="number" placeholder="0" min="0" step="0.01"
            className={`input ${errors.price ? 'input-error' : ''}`}
            {...register('price', { required: 'Price is required', min: { value: 0, message: 'Price must be positive' } })} />
          <FieldError msg={errors.price?.message} />
        </div>

        <div>
          <label className="label">Category *</label>
          <select className={`input ${errors.category ? 'input-error' : ''}`}
            {...register('category', { required: 'Category is required' })}>
            <option value="">Select category</option>
            {PRODUCT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <FieldError msg={errors.category?.message} />
        </div>

        <div>
          <label className="label">Stock quantity *</label>
          <input type="number" placeholder="0" min="0"
            className={`input ${errors.stockQty ? 'input-error' : ''}`}
            {...register('stockQty', { required: 'Stock quantity is required', min: 0 })} />
          <FieldError msg={errors.stockQty?.message} />
        </div>

        <div className="md:col-span-2">
          <label className="label">Description *</label>
          <textarea rows={4} placeholder="Describe your product in detail…"
            className={`input resize-none ${errors.description ? 'input-error' : ''}`}
            {...register('description', { required: 'Description is required', minLength: { value: 20, message: 'At least 20 characters' } })} />
          <FieldError msg={errors.description?.message} />
        </div>

        <div className="md:col-span-2">
          <label className="label">Product images</label>
          <input type="file" accept="image/*" multiple
            className="input py-2 text-sm file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-brand-50 file:text-brand-700 file:font-medium file:text-sm cursor-pointer"
            {...register('images')} />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Saving…' : (defaultValues?._id ? 'Save Changes' : 'Upload Product')}
        </button>
      </div>
    </form>
  )
}

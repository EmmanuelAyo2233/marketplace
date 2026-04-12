import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import { Store, Shield, ArrowLeft, Home, ShoppingBag } from 'lucide-react'
import { setCredentials } from '../../store/authSlice'
import { authAPI } from '../../services/endpoints'
import { LoginForm } from '../../components/forms'
import { getErrorMsg } from '../../utils/helpers'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import Typewriter from 'typewriter-effect'

// Elegant Auth Navbar with links
function AuthNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 w-full h-[80px] z-50 transition-all duration-500 ease-out flex items-center px-6 lg:px-12 ${scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.05)]' : 'bg-transparent'}`}>
      <Link to="/" className="flex items-center gap-2.5 font-display font-bold text-2xl tracking-tight group mr-8">
        <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-500/30 group-hover:scale-105 transition-transform duration-300">
          <Store size={20} />
        </div>
        <span className={`transition-colors duration-300 ${scrolled ? 'text-slate-900' : 'text-slate-900 lg:text-white'}`}>
          Trade<span className={scrolled ? 'text-brand-600' : 'text-brand-400'}>Hub</span>
        </span>
      </Link>

      <div className="hidden lg:flex items-center gap-8 mr-auto">
        {[
          { name: 'Home', path: '/', icon: Home },
          { name: 'Products', path: '/products', icon: ShoppingBag }
        ].map(link => (
          <Link key={link.name} to={link.path} className={`flex items-center gap-2 text-sm font-semibold transition-all duration-300 ${scrolled ? 'text-slate-600 hover:text-brand-600' : 'text-slate-600 lg:text-slate-300 hover:text-brand-600 lg:hover:text-white'}`}>
            <link.icon size={16} /> {link.name}
          </Link>
        ))}
      </div>
      
      <div className="flex items-center gap-5 ml-auto">
        <Link to="/login" className={`text-sm font-bold transition-all relative group hidden sm:block ${scrolled ? 'text-slate-800' : 'text-slate-800 lg:text-white'}`}>
          Log In
          <span className={`absolute -bottom-1.5 left-0 w-full h-[3px] scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full ${scrolled ? 'bg-brand-600' : 'bg-white'}`} />
        </Link>
        <Link to="/register" className={`px-6 py-3 font-bold text-sm rounded-xl transition-all duration-300 flex items-center shadow-xl active:scale-95 ${scrolled ? 'bg-brand-600 text-white shadow-brand-600/20 hover:bg-brand-700' : 'bg-slate-900 lg:bg-white text-white lg:text-brand-700 hover:bg-slate-800 lg:hover:bg-slate-50'}`}>
          Sign Up
        </Link>
      </div>
    </nav>
  )
}

export default function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(false)
  const redirect = searchParams.get('redirect') || null

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const { data: res } = await authAPI.login(data)
      dispatch(setCredentials({ user: res.user, accessToken: res.accessToken }))
      toast.success(`Welcome back, ${res.user.name.split(' ')[0]}!`)
      const role = res.user.role
      navigate(redirect || (role === 'vendor' ? '/vendor' : role === 'admin' ? '/admin' : '/buyer'))
    } catch (err) {
      toast.error(getErrorMsg(err))
    } finally {
      setLoading(false)
    }
  }

  // Animation Variants
  const textVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 60, damping: 15, staggerChildren: 0.2 } 
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <AuthNavbar />
      
      {/* ── Main Layout ── */}
      <div className="flex-1 flex flex-col lg:flex-row w-full h-screen">
        
        {/* ── Left Side (Branding/Visuals) ── */}
        <div className="lg:w-[45%] relative bg-slate-900 flex flex-col items-center justify-center p-8 lg:p-16 h-[40vh] lg:h-full lg:fixed lg:top-0 lg:left-0 overflow-hidden">
          <motion.img 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1974" 
            alt="African Local Market" 
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-900/90 via-slate-900/80 to-slate-900/40 z-0 pointer-events-none" />
          
          <motion.div 
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="relative z-10 w-full max-w-lg mt-16 lg:mt-0 flex flex-col items-center justify-center h-full text-center"
          >
            <motion.div variants={itemVariants} className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/20 shadow-2xl">
              <Store size={32} className="text-brand-300" />
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl lg:text-[3.5rem] font-display font-black leading-[1.2] tracking-tight mb-6 text-center min-h-[100px] lg:min-h-[120px] flex items-center justify-center">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-emerald-200 to-brand-100">
                <Typewriter
                  options={{
                    strings: [
                      'Buy with absolute confidence.',
                      'Sell to thousands instantly.',
                      'Discover premium local brands.',
                      'Scale your business faster.'
                    ],
                    autoStart: true,
                    loop: true,
                    delay: 50,
                    deleteSpeed: 30,
                  }}
                />
              </span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-slate-300 text-lg md:text-xl font-medium leading-relaxed max-w-lg text-center mx-auto">
              Welcome to the ultimate African marketplace. With unbreakable Escrow security and lightning-fast payouts, we built the infrastructure—you make the moves.
            </motion.p>
          </motion.div>
        </div>

        {/* ── Right Side (Form Container) ── */}
        <div className="lg:w-[55%] lg:ml-[45%] flex-1 flex flex-col justify-center items-center px-4 py-12 lg:py-24 pt-[100px] lg:pt-24 z-10 bg-[#F8FAFC]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
            className="w-full max-w-[460px] bg-white rounded-[1.5rem] shadow-[0_20px_60px_rgb(0,0,0,0.06)] border border-slate-100/60 p-8 sm:p-10 relative my-auto"
          >
            {/* Soft background glow behind form */}
            <div className="absolute -inset-0.5 bg-gradient-to-b from-brand-50 to-transparent opacity-50 rounded-[1.5rem] blur-xl -z-10" />

            <div className="mb-10 text-center sm:text-left">
              <h2 className="text-3xl font-display font-extrabold text-slate-900 tracking-tight mb-2">Welcome Back</h2>
              <p className="text-slate-500 font-medium">Please log in to your account.</p>
            </div>

            <LoginForm onSubmit={onSubmit} loading={loading} />

            <div className="mt-8 text-center sm:text-left pt-8 border-t border-slate-100">
              <p className="text-slate-600 font-medium">
                Don't have an account?{' '}
                <Link to="/register" className="text-brand-600 font-bold hover:text-brand-800 transition-colors">Sign Up</Link>
              </p>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-2 mt-8 text-[11px] text-slate-400 font-bold tracking-widest uppercase bg-slate-50 w-fit px-4 py-2 rounded-lg mx-auto sm:mx-0">
              <Shield size={14} className="text-emerald-500" />
              Secure & SSL Encrypted
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

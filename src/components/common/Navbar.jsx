import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { ShoppingCart, User, Store, LogOut, Menu, X, Search, MessageSquare, Bell } from 'lucide-react'
import { selectIsAuth, selectCurrentUser, logout } from '../../store/authSlice'
import { selectCartCount } from '../../store/cartSlice'
import { authAPI, chatAPI, notificationsAPI } from '../../services/endpoints'
import { connectSocket, getSocket, disconnectSocket } from '../../services/socket'
import { imgUrl } from '../../utils/helpers'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  
  const isAuth = useSelector(selectIsAuth)
  const user = useSelector(selectCurrentUser)
  const cartCount = useSelector(selectCartCount)
  const [unreadMsgs, setUnreadMsgs] = useState(0)
  const [unreadNotifs, setUnreadNotifs] = useState(0)

  // Fetch unread counts + connect socket for real-time updates
  useEffect(() => {
    if (!isAuth) { setUnreadMsgs(0); setUnreadNotifs(0); return }

    chatAPI.getUnreadCount().then(({ data }) => setUnreadMsgs(data.unreadCount || 0)).catch(() => {})
    notificationsAPI.getUnreadCount().then(({ data }) => setUnreadNotifs(data.unreadCount || 0)).catch(() => {})

    const socket = connectSocket()
    if (socket) {
      socket.on('unread_update', ({ unreadCount }) => setUnreadMsgs(unreadCount))
      socket.on('message_notification', () => setUnreadMsgs(prev => prev + 1))
      socket.on('notif_count_update', ({ count }) => setUnreadNotifs(count))
      socket.on('new_notification', () => setUnreadNotifs(prev => prev + 1))
    }
    return () => {
      const s = getSocket()
      if (s) {
        s.off('unread_update')
        s.off('message_notification')
        s.off('notif_count_update')
        s.off('new_notification')
      }
    }
  }, [isAuth])

  // Handle scroll for sticky navbar effects
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false)
    setUserMenuOpen(false)
  }, [location.pathname])

  const handleLogout = async () => {
    try { await authAPI.logout() } catch {}
    dispatch(logout())
    navigate('/')
    toast.success('Logged out successfully')
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchVal.trim()) navigate(`/products?search=${encodeURIComponent(searchVal.trim())}`)
  }

  const getDashboardLink = () => {
    if (!user) return '/'
    return user.role === 'vendor' ? '/vendor' : user.role === 'admin' ? '/admin' : '/buyer'
  }

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-white py-4'
    }`}>
      <div className="page-container flex items-center justify-between">
        
        {/* ── Logo ── */}
        <Link to="/" className="flex items-center gap-2.5 font-display font-bold text-2xl tracking-tight group">
          <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-md group-hover:bg-brand-700 transition-colors">
            <Store size={18} />
          </div>
          <span className="text-slate-900 group-hover:opacity-80 transition-opacity">
            Trade<span className="text-brand-600">Hub</span>
          </span>
        </Link>

        {/* ── Desktop Nav Links ── */}
        <nav className="hidden md:flex items-center gap-8 mx-auto">
          {[
            { label: 'Home', path: '/' },
            { label: 'Features', path: '/features' },
            { label: 'Products', path: '/products' },
            { label: 'About Us', path: '/about' },
            { label: 'Contact', path: '/contact' },
          ].map(link => (
            <Link 
              key={link.label} 
              to={link.path}
              className={`relative font-semibold text-sm transition-colors group ${
                location.pathname === link.path ? 'text-brand-600' : 'text-slate-600 hover:text-brand-600'
              }`}
            >
              {link.label}
              <span className={`absolute -bottom-1.5 left-0 w-full h-[2px] bg-brand-600 rounded-full transition-transform duration-300 origin-left ${
                location.pathname === link.path ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`} />
            </Link>
          ))}
        </nav>

        {/* ── Secondary Actions (Search icon, Cart, Auth) ── */}
        <div className="flex items-center gap-4">
          
          {/* Quick Search Toggle / Icon (Desktop & Mobile) */}
          <div className="hidden lg:flex relative">
             <form onSubmit={handleSearch} className="relative group">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchVal}
                  onChange={e => setSearchVal(e.target.value)}
                  className="w-48 pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 focus:bg-white focus:border-brand-300 focus:ring-4 focus:ring-brand-500/10 rounded-full text-sm text-slate-800 placeholder:text-slate-400 transition-all focus:w-64"
                />
             </form>
          </div>

          {user?.role !== 'vendor' && user?.role !== 'admin' && (
            <Link to="/cart" className="relative p-2 text-slate-600 hover:text-brand-600 hover:bg-brand-50 rounded-full transition-colors group">
              <ShoppingCart size={22} className="group-hover:scale-110 transition-transform duration-300" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white"
                  >
                    {cartCount > 9 ? '9+' : cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          )}

          {/* Messages Icon */}
          {isAuth && (
            <Link to={`/${user?.role === 'vendor' ? 'vendor' : user?.role === 'admin' ? 'admin' : 'buyer'}/messages`} className="relative p-2 text-slate-600 hover:text-brand-600 hover:bg-brand-50 rounded-full transition-colors group">
              <MessageSquare size={21} className="group-hover:scale-110 transition-transform duration-300" />
              <AnimatePresence>
                {unreadMsgs > 0 && (
                  <motion.span
                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="absolute top-0 right-0 w-4 h-4 bg-brand-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white"
                  >
                    {unreadMsgs > 9 ? '9+' : unreadMsgs}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          )}

          {/* Notification Bell */}
          {isAuth && (
            <Link to={`/${user?.role === 'vendor' ? 'vendor' : user?.role === 'admin' ? 'admin' : 'buyer'}/notifs`} className="relative p-2 text-slate-600 hover:text-amber-500 hover:bg-amber-50 rounded-full transition-colors group">
              <Bell size={21} className="group-hover:scale-110 transition-transform duration-300" />
              <AnimatePresence>
                {unreadNotifs > 0 && (
                  <motion.span
                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white"
                  >
                    {unreadNotifs > 9 ? '9+' : unreadNotifs}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          )}

          {/* User Auth Section */}
          <div className="hidden sm:flex items-center gap-3 ml-2 border-l border-slate-200 pl-6">
            {isAuth ? (
              <div className="relative">
                <button 
                  onClick={() => setUserMenuOpen(o => !o)}
                  className="flex items-center gap-2 focus:outline-none group"
                >
                  <div className="w-10 h-10 bg-slate-100 border border-slate-200 rounded-full overflow-hidden flex items-center justify-center text-brand-700 font-bold group-hover:border-brand-300 group-hover:bg-brand-50 transition-all shrink-0">
                    {user?.avatar
                      ? <img src={imgUrl(user.avatar)} alt={user?.name} className="w-full h-full object-cover" />
                      : user?.name?.[0]?.toUpperCase() || 'U'
                    }
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-semibold text-slate-800 leading-tight">{user?.name?.split(' ')[0]}</p>
                    <p className="text-[10px] uppercase font-bold text-slate-500">{user?.role}</p>
                  </div>
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-3 w-56 bg-white border border-slate-100 rounded-2xl shadow-[0_10px_40px_rgb(0,0,0,0.1)] overflow-hidden"
                    >
                      <div className="px-5 py-4 bg-slate-50 border-b border-slate-100">
                        <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                      </div>
                      <div className="p-2">
                        <Link to={getDashboardLink()} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition-colors">
                          <User size={16} /> Dashboard
                        </Link>
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors mt-1">
                          <LogOut size={16} /> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors">Log in</Link>
                <Link to="/register" className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-brand-600 hover:shadow-lg hover:shadow-brand-600/20 transition-all duration-300">Sign Up</Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button 
            className="p-2 -mr-2 sm:hidden text-slate-600"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu Dropdown ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="sm:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-xl overflow-hidden"
          >
            <div className="px-4 py-6 space-y-6">
              <form onSubmit={handleSearch} className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchVal}
                  onChange={e => setSearchVal(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-brand-500"
                />
              </form>

              <nav className="flex flex-col gap-4">
                <Link to="/" className="text-base font-semibold text-slate-800">Home</Link>
                <Link to="/features" className="text-base font-semibold text-slate-800">Features</Link>
                <Link to="/products" className="text-base font-semibold text-slate-800">Products</Link>
                <Link to="/about" className="text-base font-semibold text-slate-800">About Us</Link>
                <Link to="/contact" className="text-base font-semibold text-slate-800">Contact</Link>
                {isAuth && (
                  <Link to={getDashboardLink()} className="text-base font-semibold text-brand-600">My Dashboard</Link>
                )}
              </nav>

              <div className="pt-6 border-t border-slate-100 flex flex-col gap-3">
                {isAuth ? (
                  <button onClick={handleLogout} className="w-full py-3 rounded-xl bg-red-50 text-red-600 font-bold flex items-center justify-center gap-2">
                    <LogOut size={18} /> Logout
                  </button>
                ) : (
                  <>
                    <Link to="/login" className="w-full py-3 rounded-xl bg-slate-100 text-slate-800 font-bold text-center">Log in</Link>
                    <Link to="/register" className="w-full py-3 rounded-xl bg-brand-600 text-white font-bold text-center block">Sign Up</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar;
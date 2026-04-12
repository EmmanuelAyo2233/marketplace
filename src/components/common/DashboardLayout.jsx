import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  LayoutDashboard, Package, ShoppingBag, Wallet,
  LogOut, Menu, X, Store, ChevronRight, User, Bell, Heart, MessageSquare, Settings, BarChart2, PlusCircle, Search, Compass
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { selectCurrentUser, logout } from '../../store/authSlice'
import { authAPI } from '../../services/endpoints'
import toast from 'react-hot-toast'

const NAV = {
  buyer: [
    { to: '/',              icon: Compass,         label: 'Home'             },
    { to: '/products',      icon: Search,          label: 'Browse Products'  },
    { to: '/buyer/wishlist',icon: Heart,           label: 'Wishlist'         },
    { to: '/buyer',         icon: ShoppingBag,     label: 'My Orders'        },
    { to: '/buyer/messages',icon: MessageSquare,   label: 'Messages'         },
    { to: '/buyer/notifs',  icon: Bell,            label: 'Notifications'    },
    { to: '/buyer/settings',icon: Settings,        label: 'Settings'         },
  ],
  vendor: [
    { to: '/vendor',              icon: LayoutDashboard, label: 'Dashboard'  },
    { to: '/vendor/products',     icon: Package,         label: 'My Products'},
    { to: '/vendor/orders',       icon: ShoppingBag,     label: 'Orders'     },
    { to: '/vendor/analytics',    icon: BarChart2,       label: 'Analytics'  },
    { to: '/vendor/messages',     icon: MessageSquare,   label: 'Messages'   },
    { to: '/vendor/notifs',       icon: Bell,            label: 'Notifications'},
    { to: '/vendor/settings',     icon: Settings,        label: 'Settings'   },
  ],
  admin: [
    { to: '/admin',           icon: LayoutDashboard, label: 'Overview'  },
  ],
}

function Tooltip({ children, text, show }) {
  return (
    <div className="relative flex items-center group">
      {children}
      {show && (
        <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-800 text-white text-xs font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 shadow-xl whitespace-nowrap">
          {text}
        </div>
      )}
    </div>
  )
}

function DashboardLayout({ role }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  
  const user = useSelector(selectCurrentUser)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  
  const links = NAV[role] || []

  const handleLogout = async () => {
    try { await authAPI.logout() } catch {}
    dispatch(logout())
    navigate('/')
    toast.success('Logged out successfully')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300">
      {/* ── Navigation Links ── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-3 space-y-2 scrollbar-hide">
        {links.map((link) => {
          const active = location.pathname === link.to || (link.to !== '/' && link.to !== `/${role}` && location.pathname.startsWith(link.to))
          return (
            <Link key={link.to} to={link.to} className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 group ${active ? 'bg-brand-500 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'}`}>
              <link.icon size={22} className={`shrink-0 ${active ? 'text-white' : 'text-slate-400 group-hover:text-brand-400'} transition-colors`} />
              <span className="font-semibold text-sm whitespace-nowrap">
                {link.label}
              </span>
              {active && <ChevronRight size={16} className="ml-auto opacity-60" />}
            </Link>
          )
        })}
      </nav>

      {/* ── Bottom Profile Drop-up ── */}
      <div className="relative mt-auto border-t border-slate-800 p-3">
        <AnimatePresence>
          {profileOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute bottom-full left-3 bg-white text-slate-800 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] border border-slate-100 p-2 z-50 mb-4 w-[210px]"
            >
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="text-sm font-bold truncate text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
              </div>
              <Link to={`/${role}/settings`} onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors">
                <User size={16} className="text-slate-400" /> Profile
              </Link>
              <Link to={`/${role}/settings`} onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors">
                <Settings size={16} className="text-slate-400" /> Settings
              </Link>
              <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm font-bold text-red-600 rounded-xl hover:bg-red-50 transition-colors mt-1">
                <LogOut size={16} /> Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={() => setProfileOpen(!profileOpen)}
          className={`flex items-center gap-3 w-full p-2 rounded-xl transition-all ${profileOpen ? 'bg-slate-800' : 'hover:bg-slate-800'}`}
        >
          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
            <span className="font-bold text-white text-sm">{user?.name?.[0]?.toUpperCase() || 'U'}</span>
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-sm font-bold text-white truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-slate-400 truncate capitalize">{user?.role}</p>
          </div>
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      
      {/* ── Top Navbar ── */}
      <header className="h-[72px] bg-white border-b border-slate-200/60 flex items-center justify-between px-4 lg:px-8 shrink-0 relative z-50 shadow-sm w-full">
        <div className="flex items-center gap-4">
          <button onClick={() => setMobileOpen(true)} className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">
            <Menu size={24} />
          </button>
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20 shrink-0">
              <Store size={20} className="text-white" />
            </div>
            <span className="font-display font-bold text-xl text-slate-900 tracking-tight hidden sm:block">
              Trade<span className="text-brand-600">Hub</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3 lg:gap-5">
          <div className="relative group cursor-pointer">
            <div className="p-2.5 bg-slate-50 text-slate-500 rounded-full hover:bg-brand-50 hover:text-brand-600 transition-colors">
              <Bell size={20} />
            </div>
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* ── Desktop Sidebar ── */}
        <aside className="hidden md:block w-[220px] h-full shrink-0 z-40 relative shadow-md">
          <SidebarContent />
        </aside>

        {/* ── Mobile Sidebar Overlay ── */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden" />
              <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="fixed inset-y-0 left-0 pt-[72px] w-[220px] z-30 md:hidden shadow-2xl">
                <SidebarContent />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* ── Main Content Area ── */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#F8FAFC] p-4 lg:p-8 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="max-w-7xl mx-auto space-y-6"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout;
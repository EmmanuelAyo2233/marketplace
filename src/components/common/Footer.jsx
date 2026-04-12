import { Link } from 'react-router-dom'
import { Store, Mail, Phone, ChevronRight } from 'lucide-react'

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-16">
      <div className="page-container py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-md">
                <Store size={20} className="text-white" />
              </div>
              <span className="font-display font-black text-2xl text-white tracking-tight">Trade<span className="text-brand-400">Hub</span></span>
            </div>
            <p className="text-[15px] text-slate-400 max-w-sm leading-relaxed mb-6 font-medium">
              Nigeria's most premium marketplace. Discover exceptional products, or grow your business with completely secure escrow payments across the country.
            </p>
            <div className="flex items-center gap-4 text-slate-400">
               <a href="#" className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center hover:bg-brand-900 hover:text-brand-400 hover:border-brand-500 transition-all"><Mail size={16} /></a>
               <a href="#" className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center hover:bg-brand-900 hover:text-brand-400 hover:border-brand-500 transition-all"><Phone size={16} /></a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-white text-[15px] uppercase tracking-wider mb-5">Platform</h4>
            <ul className="space-y-4">
              <li><Link to="/" className="text-[15px] font-medium text-slate-400 hover:text-brand-400 transition-colors flex items-center gap-2"><ChevronRight size={14} className="text-slate-600" /> Home</Link></li>
              <li><Link to="/products" className="text-[15px] font-medium text-slate-400 hover:text-brand-400 transition-colors flex items-center gap-2"><ChevronRight size={14} className="text-slate-600" /> Browse Products</Link></li>
              <li><Link to="/features" className="text-[15px] font-medium text-slate-400 hover:text-brand-400 transition-colors flex items-center gap-2"><ChevronRight size={14} className="text-slate-600" /> Features</Link></li>
              <li><Link to="/about" className="text-[15px] font-medium text-slate-400 hover:text-brand-400 transition-colors flex items-center gap-2"><ChevronRight size={14} className="text-slate-600" /> About Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-white text-[15px] uppercase tracking-wider mb-5">Support</h4>
            <ul className="space-y-4">
              <li><Link to="#" className="text-[15px] font-medium text-slate-400 hover:text-brand-400 transition-colors flex items-center gap-2"><ChevronRight size={14} className="text-slate-600" /> Help Center</Link></li>
              <li><Link to="#" className="text-[15px] font-medium text-slate-400 hover:text-brand-400 transition-colors flex items-center gap-2"><ChevronRight size={14} className="text-slate-600" /> Legal & Privacy</Link></li>
              <li><Link to="#" className="text-[15px] font-medium text-slate-400 hover:text-brand-400 transition-colors flex items-center gap-2"><ChevronRight size={14} className="text-slate-600" /> Contact Us</Link></li>
              <li><Link to="#" className="text-[15px] font-medium text-slate-400 hover:text-brand-400 transition-colors flex items-center gap-2"><ChevronRight size={14} className="text-slate-600" /> Vendor FAQs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-[15px] uppercase tracking-wider mb-5">Get Started</h4>
            <ul className="space-y-4">
              <li><Link to="/login" className="text-[15px] font-medium text-slate-400 hover:text-brand-400 transition-colors flex items-center gap-2"><ChevronRight size={14} className="text-slate-600" /> Login</Link></li>
              <li><Link to="/register?role=buyer" className="text-[15px] font-medium text-slate-400 hover:text-brand-400 transition-colors flex items-center gap-2"><ChevronRight size={14} className="text-slate-600" /> Create Account</Link></li>
              <li><Link to="/register?role=vendor" className="text-[15px] font-bold text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-2"><ChevronRight size={14} className="text-brand-600" /> Become a Vendor</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[13px] font-medium text-slate-500">
          <p>© 2024 TradeHub Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
             <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Secured by SSL</span>
             <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-500" /> Powered by Paystack</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
export default Footer;
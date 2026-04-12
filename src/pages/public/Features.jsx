import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Shield, CheckCircle, Truck, LayoutDashboard, Zap, CreditCard, ArrowRight } from 'lucide-react'

const FEATURES = [
  {
    icon: Shield,
    title: 'Secure Escrow Payments',
    description: 'All payments are held securely in escrow until the buyer confirms the product is received in perfect condition. Zero risk for buyers, guaranteed payments for sellers.',
    color: 'text-brand-600',
    bg: 'bg-brand-50'
  },
  {
    icon: CheckCircle,
    title: 'Strict Vendor Verification',
    description: 'We manually review and verify every vendor on the platform to ensure authenticity. Buyers can shop with complete peace of mind knowing they are dealing with professionals.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50'
  },
  {
    icon: Truck,
    title: 'Fast Delivery System',
    description: 'Partnered with top local logistics, our platform ensures your packages are picked up and delivered within record times depending on your location.',
    color: 'text-amber-600',
    bg: 'bg-amber-50'
  },
  {
    icon: LayoutDashboard,
    title: 'Easy Product Management',
    description: 'Vendors enjoy a world-class dashboard to easily track inventory, view order analytics, update pricing, and fulfill orders with just a few clicks.',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50'
  },
  {
    icon: Zap,
    title: 'Lightning Fast Search',
    description: 'Our highly optimized search engine helps buyers find exactly what they are looking for across hundreds of categories in milliseconds.',
    color: 'text-pink-600',
    bg: 'bg-pink-50'
  },
  {
    icon: CreditCard,
    title: 'Instant Payouts',
    description: 'Once a delivery is confirmed by a buyer, vendor funds are immediately released to their wallets and can be withdrawn directly to their bank accounts.',
    color: 'text-rose-600',
    bg: 'bg-rose-50'
  }
]

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 100 } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

export default function Features() {
  return (
    <div className="bg-white min-h-screen pt-12">
      {/* ── Hero Section ── */}
      <section className="relative py-28 md:py-36 text-center overflow-hidden bg-slate-900">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
        
        <div className="page-container relative z-20">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-3xl mx-auto">
            <motion.span variants={fadeInUp} className="inline-block px-4 py-1.5 bg-brand-500/20 shadow-[0_0_20px_rgba(37,99,235,0.3)] border border-brand-400/30 text-brand-300 text-xs font-extrabold uppercase tracking-widest rounded-full mb-6 relative overflow-hidden">
              Platform Capabilities
            </motion.span>
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl lg:text-7xl font-display font-black text-white mb-6 leading-[1.1] tracking-tight">
              Powerful Features for <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-emerald-300">Buyers & Sellers</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-slate-300 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
              TradeHub is built from the ground up to provide a seamless, entirely secure, and highly scalable marketplace experience.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── Features List ── */}
      <section className="py-16 pb-32 bg-slate-50 border-t border-slate-100">
        <div className="page-container">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {FEATURES.map((feature, idx) => (
              <motion.div 
                key={idx} 
                variants={fadeInUp}
                className="bg-white p-10 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_60px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-300 group"
              >
                <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center mb-6 transition-colors duration-300 ${feature.bg}`}>
                  <feature.icon size={28} className={feature.color} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-4 tracking-tight group-hover:text-brand-600 transition-colors">{feature.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed text-sm md:text-base">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="page-container">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp}
            className="bg-slate-900 rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/20 shadow-2xl rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
              <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-6 tracking-tight leading-[1.1]">
                Ready to take your business to the next level?
              </h2>
              <p className="text-slate-300 text-lg md:text-xl font-medium mb-10">
                Join our curated platform today. Get access to thousands of ready-to-buy customers instantly.
              </p>
              <Link 
                to="/register?role=vendor" 
                className="px-10 py-5 bg-brand-600 text-white font-extrabold text-[15px] tracking-wide rounded-2xl shadow-[0_8px_25px_rgba(37,99,235,0.4)] hover:bg-brand-500 hover:-translate-y-1 transition-all duration-300 inline-flex items-center gap-3"
              >
                Join as a Vendor
                <ArrowRight size={20} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

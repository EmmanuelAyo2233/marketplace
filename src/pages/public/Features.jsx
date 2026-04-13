import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Shield, CheckCircle, Truck, LayoutDashboard, Zap, CreditCard,
  ArrowRight, MessageSquare, BarChart2, Lock, Globe, Wallet,
  ChevronRight, Sparkles
} from 'lucide-react'

const HERO_FEATURES = [
  'Secure Escrow Payments',
  'Verified Vendors Only',
  'Real-Time Chat',
  'Instant Payouts',
]

const FEATURES = [
  {
    icon: Shield,
    title: 'Secure Escrow Payments',
    description: 'All payments are held securely in escrow until the buyer confirms delivery — zero risk for buyers, guaranteed revenue for sellers.',
    gradient: 'from-brand-600 to-indigo-600',
    badge: 'Core Feature',
  },
  {
    icon: CheckCircle,
    title: 'Strict Vendor Verification',
    description: 'Every vendor is manually reviewed and verified before they can list a single product. Shop with absolute confidence.',
    gradient: 'from-emerald-500 to-teal-600',
    badge: 'Trust',
  },
  {
    icon: Truck,
    title: 'Fast Delivery System',
    description: 'Partnered with top logistics providers for rapid pick-up and delivery at competitive rates based on your location.',
    gradient: 'from-amber-500 to-orange-600',
    badge: 'Logistics',
  },
  {
    icon: LayoutDashboard,
    title: 'Powerful Vendor Dashboard',
    description: 'A world-class dashboard to manage inventory, track analytics, process orders, and withdraw earnings — all in one place.',
    gradient: 'from-violet-500 to-purple-600',
    badge: 'Vendors',
  },
  {
    icon: Zap,
    title: 'Lightning Fast Search',
    description: 'Our optimized search engine helps buyers find exactly what they need across hundreds of categories in milliseconds.',
    gradient: 'from-pink-500 to-rose-600',
    badge: 'Performance',
  },
  {
    icon: CreditCard,
    title: 'Instant Payouts',
    description: 'Once delivery is confirmed, vendor funds are released immediately to their wallets and can be withdrawn to any bank account.',
    gradient: 'from-cyan-500 to-blue-600',
    badge: 'Payments',
  },
  {
    icon: MessageSquare,
    title: 'Real-Time Messaging',
    description: 'Built-in WebSocket-powered chat lets buyers and vendors communicate instantly with image sharing and read receipts.',
    gradient: 'from-indigo-500 to-brand-600',
    badge: 'Communication',
  },
  {
    icon: BarChart2,
    title: 'Advanced Analytics',
    description: 'Vendors get detailed insights into sales trends, revenue breakdowns, and customer behavior — empowering data-driven decisions.',
    gradient: 'from-teal-500 to-emerald-600',
    badge: 'Insights',
  },
  {
    icon: Lock,
    title: 'Dispute Resolution',
    description: 'Dedicated admin team to mediate disputes fairly, with a structured process ensuring both buyers and sellers are protected.',
    gradient: 'from-red-500 to-rose-600',
    badge: 'Protection',
  },
]

const HOW_IT_WORKS = [
  { step: '01', title: 'Sign Up', desc: 'Create your free buyer or vendor account in under 60 seconds.' },
  { step: '02', title: 'Browse or List', desc: 'Explore thousands of products or list your own with images & pricing.' },
  { step: '03', title: 'Secure Checkout', desc: 'Pay safely with escrow protection — your money is held until delivery.' },
  { step: '04', title: 'Deliver & Earn', desc: 'Buyer confirms delivery, funds are released, and vendor gets paid.' },
]

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 100 } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
}

export default function Features() {
  return (
    <div className="bg-white min-h-screen text-slate-800">

      {/* ══════════════════════════════════════════════════════════
          1. HERO
      ══════════════════════════════════════════════════════════ */}
      <section className="relative py-32 md:py-44 text-center overflow-hidden bg-slate-950">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-brand-600/15 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[130px]" />
        </div>

        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="page-container relative z-10 max-w-4xl mx-auto px-4">
          <motion.span variants={fadeInUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 text-brand-300 text-[10px] font-extrabold uppercase tracking-[0.2em] rounded-full mb-8"
          >
            <Sparkles size={13} /> Platform Capabilities
          </motion.span>

          <motion.h1 variants={fadeInUp}
            className="text-5xl md:text-6xl lg:text-8xl font-display font-black text-white mb-8 leading-[1.05] tracking-tight"
          >
            Everything You Need to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-violet-400 to-emerald-400">
              Trade Smart
            </span>
          </motion.h1>

          <motion.p variants={fadeInUp} className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto mb-10">
            TradeHub is engineered from the ground up with cutting-edge technology to deliver a seamless, secure, and scalable marketplace experience.
          </motion.p>

          {/* Mini feature pills */}
          <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-center gap-3">
            {HERO_FEATURES.map(f => (
              <span key={f} className="px-4 py-2 bg-white/5 border border-white/10 text-white/80 text-xs font-bold rounded-full">
                {f}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          2. HOW IT WORKS
      ══════════════════════════════════════════════════════════ */}
      <section className="relative -mt-16 z-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto bg-white rounded-[2rem] shadow-[0_20px_60px_rgb(0,0,0,0.08)] border border-slate-100 grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100"
        >
          {HOW_IT_WORKS.map(s => (
            <div key={s.step} className="p-6 md:p-7 text-center group">
              <p className="text-3xl font-display font-black text-brand-600 mb-2 group-hover:scale-110 transition-transform">{s.step}</p>
              <p className="text-sm font-bold text-slate-900 mb-1">{s.title}</p>
              <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          3. FEATURE GRID
      ══════════════════════════════════════════════════════════ */}
      <section className="py-28 bg-white">
        <div className="page-container max-w-6xl mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="text-center mb-16">
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-display font-black text-slate-900 mb-4 tracking-tight">
              Built for Buyers & Sellers
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-slate-500 text-lg max-w-xl mx-auto">
              Every feature is designed to make commerce faster, safer, and more rewarding.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {FEATURES.map((feature, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="group bg-white p-8 rounded-[1.75rem] border border-slate-100 shadow-[0_4px_24px_rgb(0,0,0,0.03)] hover:shadow-[0_16px_48px_rgb(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-13 h-13 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                    <feature.icon size={22} className="text-white" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                    {feature.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-2.5 group-hover:text-brand-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          4. COMPARISON SECTION
      ══════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-slate-50">
        <div className="page-container max-w-5xl mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="text-center mb-14">
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-display font-black text-slate-900 mb-4 tracking-tight">
              Why TradeHub?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-slate-500 text-lg max-w-xl mx-auto">
              See how we compare to traditional marketplaces.
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="bg-white rounded-[2rem] border border-slate-100 shadow-lg overflow-hidden"
          >
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left px-6 py-5 font-bold text-slate-500 text-xs uppercase tracking-wider">Feature</th>
                  <th className="text-center px-6 py-5 font-bold text-brand-600 text-xs uppercase tracking-wider">TradeHub</th>
                  <th className="text-center px-6 py-5 font-bold text-slate-400 text-xs uppercase tracking-wider">Others</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  ['Escrow Payment Protection', true, false],
                  ['Verified Vendors Only', true, false],
                  ['Real-Time Messaging', true, false],
                  ['Instant Vendor Payouts', true, false],
                  ['Advanced Analytics Dashboard', true, false],
                  ['Dispute Resolution System', true, true],
                  ['Free Account Setup', true, true],
                ].map(([feature, us, them], i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-700">{feature}</td>
                    <td className="px-6 py-4 text-center">
                      {us ? (
                        <span className="inline-flex w-7 h-7 rounded-lg bg-emerald-50 items-center justify-center">
                          <CheckCircle size={16} className="text-emerald-600" />
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {them ? (
                        <span className="inline-flex w-7 h-7 rounded-lg bg-slate-100 items-center justify-center">
                          <CheckCircle size={16} className="text-slate-400" />
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          5. CTA
      ══════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="page-container max-w-5xl mx-auto px-4">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp}
            className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-brand-900 rounded-[3rem] p-12 lg:p-20 text-center overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/15 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/10 rounded-full blur-[80px]" />

            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-6 tracking-tight leading-[1.1]">
                Ready to start trading?
              </h2>
              <p className="text-slate-300 text-lg md:text-xl font-medium mb-10">
                Join thousands of vendors and buyers already using TradeHub. Setup takes less than a minute.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
                <Link to="/register?role=vendor"
                  className="group px-8 py-4 bg-brand-600 text-white font-bold rounded-2xl hover:bg-brand-500 shadow-xl shadow-brand-600/25 transition-all hover:scale-105 flex items-center gap-2"
                >
                  Join as a Vendor <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/register?role=buyer"
                  className="px-8 py-4 bg-white/5 border-2 border-white/15 text-white font-bold rounded-2xl hover:bg-white/10 transition-all"
                >
                  Start Shopping
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

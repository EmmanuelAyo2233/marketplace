import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Quote, Sparkles, Target, Users, Instagram, Linkedin, Twitter, Github, ShieldCheck, Zap, Truck, CheckCircle } from 'lucide-react'

const TEAM = [
  {
    name: 'Alex Johnson',
    role: 'Lead Frontend Developer',
    image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=400',
    socials: { linkedin: '#', github: '#', twitter: '#' }
  },
  {
    name: 'Sarah Adeyemi',
    role: 'Backend Architect',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
    socials: { linkedin: '#', github: '#' }
  },
  {
    name: 'Kojo Mensah',
    role: 'UI/UX Designer',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    socials: { instagram: '#', linkedin: '#' }
  }
]

const TESTIMONIALS = [
  { name: 'Emeka U.', role: 'Elite Vendor', text: "The team behind TradeHub has built something uniquely optimized for our local market. The verification breeds incredible buyer trust.", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80" },
  { name: 'Dr. Anita P.', role: 'Verified Buyer', text: "Finally, a platform that doesn't feel cluttered or unsafe. Everything is modern, fast, and completely reliable.", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80" },
  { name: 'Jamal K.', role: 'Electronics Seller', text: "Setting up my storefront took exactly 5 minutes. The amount of traffic they generate is phenomenal.", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80" },
]

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 100 } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

export default function AboutUs() {
  return (
    <div className="bg-white min-h-screen pt-12 text-slate-800">
      {/* ── Hero Section ── */}
      <section className="relative py-28 md:py-36 text-center overflow-hidden bg-slate-900">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
        
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="page-container relative z-20 max-w-3xl mx-auto">
          <motion.span variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-500/20 shadow-[0_0_20px_rgba(37,99,235,0.3)] border border-brand-400/30 text-brand-300 text-xs font-extrabold uppercase tracking-widest rounded-full mb-6">
            <Sparkles size={14} className="text-brand-300" />
            Our Story
          </motion.span>
          <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl lg:text-7xl font-display font-black text-white mb-6 leading-[1.1] tracking-tight">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-emerald-300">TradeHub</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-slate-300 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
            Learn more about our mission and the team behind the platform.
          </motion.p>
        </motion.div>
      </section>

      {/* ── Story / Mission Section ── */}
      <section className="py-24 bg-slate-900 border-none relative overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-brand-500/20 blur-[140px] rounded-full pointer-events-none -translate-y-1/2" />
        <div className="absolute top-1/2 right-1/4 w-[600px] h-[600px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none -translate-y-1/2 overflow-hidden" />
        
        <div className="page-container relative z-10">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
          >
            <motion.div 
              variants={fadeInUp} 
              className="group relative bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] hover:bg-white/10 transition-all duration-500"
            >
              <div className="absolute inset-0 bg-brand-500/20 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 rounded-[2.5rem] pointer-events-none" />
              <h2 className="relative z-10 text-3xl lg:text-4xl font-display font-bold text-white mb-6 tracking-tight flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center border border-brand-400/30">
                  <Target className="text-brand-400" size={24} />
                </div>
                Our Mission
              </h2>
              <p className="relative z-10 text-slate-300 text-lg leading-relaxed font-medium">
                We believe that online commerce should be devoid of anxiety. For years, bad actors have eroded trust in peer-to-peer marketplaces. Our mission is to inject <strong className="text-white">absolute certainty</strong> backed by secure technology—where funds are held safely in escrow and vendors are hyper-verified.
              </p>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              className="group relative bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] hover:bg-white/10 transition-all duration-500"
            >
              <div className="absolute inset-0 bg-emerald-500/20 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 rounded-[2.5rem] pointer-events-none" />
              <h2 className="relative z-10 text-3xl lg:text-4xl font-display font-bold text-white mb-6 tracking-tight flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-400/30">
                  <Users className="text-emerald-400" size={24} />
                </div>
                Our Vision
              </h2>
              <p className="relative z-10 text-slate-300 text-lg leading-relaxed font-medium">
                To become the ultimate standardized gateway for small to medium businesses across the continent. We envision a future where anyone with a great product can spin up a pristine digital storefront and connect with thousands of active buyers instantly.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Why Choose Us / Values Section ── */}
      <section className="py-24 bg-white">
        <div className="page-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="text-center mb-16">
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-display font-black text-slate-900 mb-5 tracking-tight">Our Core Values</motion.h2>
            <motion.p variants={fadeInUp} className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
              We operate on principles designed to maximize your success and security.
            </motion.p>
          </motion.div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { icon: ShieldCheck, title: 'Trusted Vendors', text: 'Every vendor is strictly vetted for quality and authenticity.' },
              { icon: CheckCircle, title: 'Secure Payments', text: 'Funds are held in escrow until zero-defect delivery is confirmed.' },
              { icon: Truck, title: 'Fast Delivery', text: 'Our integrated logistics ensure you receive products in record time.' }
            ].map((value, idx) => (
              <motion.div key={idx} variants={fadeInUp} className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-300 group">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-brand-50 transition-colors">
                  <value.icon size={28} className="text-brand-600 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-3 group-hover:text-brand-600 transition-colors">{value.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{value.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>


      {/* ── Team Section ── */}
      <section className="py-24 bg-white">
        <div className="page-container max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="text-center mb-16">
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-display font-black text-slate-900 mb-5 tracking-tight">Meet the Team</motion.h2>
            <motion.p variants={fadeInUp} className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
              The passionate developers, designers, and innovators working tirelessly behind the scenes so you can trade comfortably.
            </motion.p>
          </motion.div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12"
          >
            {TEAM.map((member, idx) => (
              <motion.div key={idx} variants={fadeInUp} className="group flex flex-col">
                <div className="relative aspect-[3/4] w-full rounded-[2.5rem] overflow-hidden bg-slate-100 mb-6 shadow-lg border border-slate-200/60 group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)] group-hover:-translate-y-3 transition-all duration-500">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                  
                  {/* Floating Info Box inside Card */}
                  <div className="absolute inset-x-4 bottom-4 bg-white/90 backdrop-blur-md p-5 rounded-[1.5rem] border border-white/50 shadow-sm translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center">
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">{member.name}</h3>
                    <p className="text-sm font-bold text-brand-600 mt-0.5 uppercase tracking-wider">{member.role}</p>
                    
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-200/60 w-full justify-center">
                      {member.socials.linkedin && (
                         <a href={member.socials.linkedin} className="text-slate-400 hover:text-brand-600 transition-colors"><Linkedin size={18} /></a>
                      )}
                      {member.socials.twitter && (
                         <a href={member.socials.twitter} className="text-slate-400 hover:text-brand-600 transition-colors"><Twitter size={18} /></a>
                      )}
                      {member.socials.github && (
                         <a href={member.socials.github} className="text-slate-400 hover:text-brand-600 transition-colors"><Github size={18} /></a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Final CTA Section ── */}
      <section className="py-24 bg-slate-50 relative overflow-hidden border-t border-slate-100">
        <div className="page-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp} className="bg-slate-900 rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-600/10 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
              <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-6 tracking-tight leading-[1.1]">
                Join us and start your journey today
              </h2>
              <p className="text-slate-300 text-lg md:text-xl font-medium mb-10">
                Setup is completely free. Take the leap and become part of our globally localized marketplace.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center w-full">
                <Link to="/register?role=buyer" className="px-8 py-4 bg-brand-600 text-white font-extrabold rounded-2xl hover:bg-brand-500 hover:scale-105 shadow-xl transition-all w-full sm:w-auto">
                  Sign Up
                </Link>
                <Link to="/register?role=vendor" className="px-8 py-4 bg-transparent border-2 border-slate-700 text-white font-extrabold rounded-2xl hover:border-brand-500 hover:bg-slate-800 transition-all w-full sm:w-auto">
                  Become a Vendor
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

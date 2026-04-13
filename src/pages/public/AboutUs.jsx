import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Sparkles, Target, Users, Linkedin, Twitter, Github, Instagram,
  ShieldCheck, Zap, Truck, CheckCircle, Heart, Globe, Award, ArrowRight
} from 'lucide-react'
import emmaImg from '../../assets/team/emma.jpg'
import zainabImg from '../../assets/team/misszainab.png'
import ahmadImg from '../../assets/team/hon ahmad.jpeg'

const TEAM = [
  {
    name: 'Emmanuel Ayobami',
    role: 'Fullstack Developer',
    image: emmaImg,
    bio: 'Architected the entire TradeHub platform from backend APIs to pixel-perfect frontends.',
    socials: { linkedin: '#', github: '#', twitter: '#' }
  },
  {
    name: 'Zainab',
    role: 'Product Designer',
    image: zainabImg,
    bio: 'Crafted every interface, interaction pattern, and brand identity that defines TradeHub.',
    socials: { linkedin: '#', instagram: '#' }
  },
  {
    name: 'Adebara ahmad',
    role: 'Frontend Developer',
    image: ahmadImg,
    bio: 'Builds responsive, intuitive user interfaces and ensures a seamless experience across all devices.',
    socials: { linkedin: '#', github: '#' }
  }
]

const STATS = [
  { value: '10K+', label: 'Active Users' },
  { value: '2K+', label: 'Verified Vendors' },
  { value: '50K+', label: 'Products Listed' },
  { value: '99.9%', label: 'Uptime' },
]

const VALUES = [
  { icon: ShieldCheck, title: 'Trust First',     text: 'Every vendor is strictly vetted. Every transaction is escrow-protected.', gradient: 'from-brand-600 to-indigo-600' },
  { icon: Zap,         title: 'Speed Obsessed',  text: 'Lightning-fast interfaces built with modern tech for instant interactions.', gradient: 'from-amber-500 to-orange-600' },
  { icon: Heart,       title: 'Community Driven', text: 'Built by the community, for the community. Your feedback shapes our roadmap.', gradient: 'from-rose-500 to-pink-600' },
  { icon: Globe,       title: 'Locally Global',   text: 'Optimized for African markets with world-class engineering standards.', gradient: 'from-emerald-500 to-teal-600' },
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
    <div className="bg-white min-h-screen text-slate-800">

      {/* ══════════════════════════════════════════════════════════
          1. HERO
      ══════════════════════════════════════════════════════════ */}
      <section className="relative py-32 md:py-44 text-center overflow-hidden bg-slate-950">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-brand-600/15 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[130px]" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/20 to-transparent" />
        </div>

        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="page-container relative z-10 max-w-4xl mx-auto px-4">
          <motion.span variants={fadeInUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 text-brand-300 text-[10px] font-extrabold uppercase tracking-[0.2em] rounded-full mb-8"
          >
            <Sparkles size={13} /> Our Story
          </motion.span>

          <motion.h1 variants={fadeInUp}
            className="text-5xl md:text-6xl lg:text-8xl font-display font-black text-white mb-8 leading-[1.05] tracking-tight"
          >
            Building the Future of <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-indigo-400 to-emerald-400">
              African Commerce
            </span>
          </motion.h1>

          <motion.p variants={fadeInUp}
            className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto mb-10"
          >
            TradeHub is more than a marketplace. It is a trust engine — built to make buying and selling across Africa seamless, safe, and rewarding.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex items-center justify-center gap-4">
            <Link to="/register"
              className="px-7 py-3.5 bg-brand-600 text-white text-sm font-bold rounded-xl hover:bg-brand-500 shadow-lg shadow-brand-600/25 transition-all hover:scale-105"
            >
              Get Started
            </Link>
            <Link to="/products"
              className="px-7 py-3.5 bg-white/5 border border-white/15 text-white text-sm font-bold rounded-xl hover:bg-white/10 transition-all"
            >
              Browse Products
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          2. STATS BAR
      ══════════════════════════════════════════════════════════ */}
      <section className="relative -mt-16 z-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto bg-white rounded-[2rem] shadow-[0_20px_60px_rgb(0,0,0,0.08)] border border-slate-100 grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100"
        >
          {STATS.map(s => (
            <div key={s.label} className="p-6 md:p-8 text-center">
              <p className="text-3xl md:text-4xl font-display font-black text-slate-900 tracking-tight">{s.value}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          3. MISSION & VISION
      ══════════════════════════════════════════════════════════ */}
      <section className="py-28 bg-white">
        <div className="page-container max-w-6xl mx-auto px-4">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <motion.div variants={fadeInUp}
              className="group relative bg-gradient-to-br from-slate-900 to-slate-800 p-10 md:p-12 rounded-[2.5rem] overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-brand-500/15 rounded-full blur-[80px]" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-brand-500/20 flex items-center justify-center mb-6 border border-brand-400/20">
                  <Target size={26} className="text-brand-400" />
                </div>
                <h2 className="text-3xl lg:text-4xl font-display font-black text-white mb-5 tracking-tight">Our Mission</h2>
                <p className="text-slate-300 text-lg leading-relaxed">
                  We believe online commerce should be devoid of anxiety. Our mission is to inject <strong className="text-white">absolute certainty</strong> backed by secure escrow technology — where funds are held safely and vendors are hyper-verified.
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp}
              className="group relative bg-gradient-to-br from-emerald-900 to-teal-800 p-10 md:p-12 rounded-[2.5rem] overflow-hidden"
            >
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/15 rounded-full blur-[80px]" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-6 border border-emerald-400/20">
                  <Award size={26} className="text-emerald-400" />
                </div>
                <h2 className="text-3xl lg:text-4xl font-display font-black text-white mb-5 tracking-tight">Our Vision</h2>
                <p className="text-emerald-100/80 text-lg leading-relaxed">
                  To become the ultimate gateway for small to medium businesses across the continent. A future where anyone with a great product can spin up a pristine storefront and reach thousands of buyers instantly.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          4. CORE VALUES
      ══════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-slate-50">
        <div className="page-container max-w-6xl mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="text-center mb-16">
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-display font-black text-slate-900 mb-4 tracking-tight">
              What We Stand For
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-slate-500 text-lg max-w-xl mx-auto">
              The principles that power everything we build.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {VALUES.map((v, idx) => (
              <motion.div key={idx} variants={fadeInUp}
                className="bg-white p-7 rounded-[1.75rem] border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_16px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-300 group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${v.gradient} flex items-center justify-center mb-5 shadow-sm group-hover:scale-110 transition-transform`}>
                  <v.icon size={22} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-2">{v.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{v.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          5. MEET THE TEAM
      ══════════════════════════════════════════════════════════ */}
      <section className="py-28 bg-white">
        <div className="page-container max-w-6xl mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="text-center mb-16">
            <motion.span variants={fadeInUp}
              className="inline-block px-4 py-1.5 bg-brand-50 text-brand-600 text-[10px] font-extrabold uppercase tracking-[0.2em] rounded-full mb-5 border border-brand-100"
            >
              The People
            </motion.span>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-display font-black text-slate-900 mb-4 tracking-tight">
              Meet the Team
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-slate-500 text-lg max-w-2xl mx-auto">
              The passionate developers, designers, and builders working behind the scenes so you can trade with comfort and confidence.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
          >
            {TEAM.map((member, idx) => (
              <motion.div key={idx} variants={fadeInUp} className="group">
                <div className="relative aspect-[3/4] w-full rounded-[2rem] overflow-hidden bg-slate-100 mb-5 shadow-lg border border-slate-200/40 group-hover:shadow-[0_24px_50px_rgba(0,0,0,0.12)] group-hover:-translate-y-2 transition-all duration-500">
                  <img src={member.image} alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {/* Gradient overlay at bottom */}
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />

                  {/* Info overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <h3 className="text-xl font-display font-bold text-white tracking-tight">{member.name}</h3>
                    <p className="text-sm font-bold text-brand-300 mt-0.5">{member.role}</p>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500">{member.bio}</p>

                    <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white/10">
                      {member.socials.linkedin && (
                        <a href={member.socials.linkedin} className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:bg-brand-600 hover:text-white transition-all">
                          <Linkedin size={14} />
                        </a>
                      )}
                      {member.socials.twitter && (
                        <a href={member.socials.twitter} className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:bg-brand-600 hover:text-white transition-all">
                          <Twitter size={14} />
                        </a>
                      )}
                      {member.socials.github && (
                        <a href={member.socials.github} className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:bg-brand-600 hover:text-white transition-all">
                          <Github size={14} />
                        </a>
                      )}
                      {member.socials.instagram && (
                        <a href={member.socials.instagram} className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:bg-brand-600 hover:text-white transition-all">
                          <Instagram size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          6. CTA SECTION
      ══════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-slate-50">
        <div className="page-container max-w-5xl mx-auto px-4">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp}
            className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-brand-900 rounded-[3rem] p-12 lg:p-20 text-center overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/15 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]" />

            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-6 tracking-tight leading-[1.1]">
                Ready to Join the Movement?
              </h2>
              <p className="text-slate-300 text-lg md:text-xl font-medium mb-10">
                Setup is completely free. Start selling or shopping on the most trusted marketplace in Africa.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
                <Link to="/register?role=buyer"
                  className="group px-8 py-4 bg-brand-600 text-white font-bold rounded-2xl hover:bg-brand-500 shadow-xl shadow-brand-600/25 transition-all hover:scale-105 flex items-center gap-2"
                >
                  Start Shopping <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/register?role=vendor"
                  className="px-8 py-4 bg-white/5 border-2 border-white/15 text-white font-bold rounded-2xl hover:bg-white/10 transition-all"
                >
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

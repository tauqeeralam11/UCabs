import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, BarChart3, Car, Clock } from 'lucide-react';
import MarketingNavbar from '../components/MarketingNavbar';
import Footer from '../components/Footer';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
};

const Drive = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="bg-[#09090B] min-h-screen font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden text-white"
    >
      <MarketingNavbar />
      <section className="relative min-h-[90vh] flex items-center pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600 rounded-full blur-[200px] opacity-20 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center w-full relative z-10">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="lg:col-span-6 lg:pr-10">
            <motion.h2 variants={fadeUp} className="text-[4rem] md:text-[5.5rem] font-black tracking-tighter text-white mb-6 leading-[0.95]">
              Financial <br/>independence.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[18px] text-gray-400 font-medium mb-12 leading-relaxed">
              Build a sustainable business on your terms. Our platform offers complete transparency on earnings and instant liquidity.
            </motion.p>
            <div className="space-y-8 mb-12">
              {[
                { title: 'Flexible Schedule', desc: 'Work entirely on your terms. Go online or offline instantly.' },
                { title: 'Instant Payouts', desc: 'Cash out directly to your bank account at any time.' },
                { title: 'Transparent Pricing', desc: 'Know exactly what you earn before accepting a ride.' }
              ].map((benefit, idx) => (
                <motion.div variants={fadeUp} key={idx} className="flex gap-5">
                  <div className="mt-1 w-7 h-7 rounded-full bg-white/10 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 size={16} strokeWidth={2}/>
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-[18px] mb-1.5">{benefit.title}</h4>
                    <p className="text-[15px] text-gray-400 font-medium">{benefit.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.button variants={fadeUp} onClick={() => navigate('/register')} className="bg-white text-[#09090B] px-8 py-4 rounded-xl text-[16px] font-black flex items-center gap-2 hover:bg-gray-200 transition-all shadow-md">
              Apply to Drive <ArrowRight size={18}/>
            </motion.button>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.2 }} className="lg:col-span-6 w-full hidden lg:flex justify-center lg:justify-end">
            <div className="bg-[#121214] rounded-[32px] p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border border-white/5 w-full max-w-lg relative">
               <div className="flex justify-between items-center mb-8">
                 <h3 className="text-[20px] font-bold text-white flex items-center gap-2"><BarChart3 size={20}/> Partner Earnings</h3>
                 <div className="bg-green-500/10 text-green-400 px-3 py-1.5 rounded-[10px] text-[11px] font-bold uppercase tracking-widest border border-green-500/20 flex items-center gap-1.5">
                   <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span> Online
                 </div>
               </div>
               <div className="bg-[#1A1A1D] text-white rounded-[24px] p-8 mb-6 shadow-inner relative overflow-hidden border border-white/5">
                  <p className="text-[12px] text-gray-400 font-medium mb-2">Available Balance</p>
                  <h1 className="text-[48px] font-black tracking-tighter mb-8">₹1,840.50</h1>
                  <div className="flex items-end gap-2 h-20 w-full mb-8">
                    {[40, 50, 30, 80, 60, 100, 70].map((h, i) => (
                      <div key={i} className="flex-1 bg-blue-500 rounded-t-sm" style={{ height: `${h}%`, opacity: 0.4 + (i * 0.1) }}></div>
                    ))}
                  </div>
                  <button className="w-full bg-white text-black py-4 rounded-[16px] font-black text-[15px] hover:bg-gray-200 transition-colors">Withdraw Funds</button>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="bg-[#1A1A1D] rounded-[20px] p-5 border border-white/5 flex items-center gap-4">
                   <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-gray-300"><Car size={16}/></div>
                   <div><p className="text-[24px] font-black text-white leading-none mb-1">42</p><p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Trips</p></div>
                 </div>
                 <div className="bg-[#1A1A1D] rounded-[20px] p-5 border border-white/5 flex items-center gap-4">
                   <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-gray-300"><Clock size={16}/></div>
                   <div><p className="text-[24px] font-black text-white leading-none mb-1">24h</p><p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Online</p></div>
                 </div>
               </div>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </motion.div>
  );
};

export default Drive;
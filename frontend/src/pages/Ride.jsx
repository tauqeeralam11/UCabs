import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Car, LayoutGrid, ShieldCheck, Star } from 'lucide-react';
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

const Ride = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="bg-[#FCFCFD] min-h-screen font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden text-[#09090B]"
    >
      <MarketingNavbar />
      <section className="relative min-h-[90vh] flex items-center pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.3]" style={{ backgroundImage: 'linear-gradient(to right, #E5E7EB 1px, transparent 1px), linear-gradient(to bottom, #E5E7EB 1px, transparent 1px)', backgroundSize: '32px 32px', maskImage: 'radial-gradient(circle at 70% 50%, black 20%, transparent 70%)' }}></div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 w-full">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="relative z-20">
            <motion.h1 variants={fadeUp} className="text-[4rem] md:text-[5.5rem] font-black leading-[0.95] tracking-tighter mb-6 text-[#09090B]">
              Always the <br/><span className="text-blue-600">smartest route.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-[18px] text-gray-500 font-medium mb-10 max-w-md leading-relaxed">
              Request a ride from anywhere. Transparent pricing, precise ETAs, and a fleet of premium vehicles at your command.
            </motion.p>
            <motion.div variants={fadeUp} className="bg-white/80 backdrop-blur-xl p-3 rounded-[24px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-gray-200/80 w-full max-w-md">
              <div className="p-4 space-y-2 relative">
                <div className="absolute left-[33px] top-[45px] bottom-[45px] w-[2px] bg-gray-100 z-0"></div>
                <div onClick={() => navigate('/book')} className="flex items-center relative z-10 bg-white hover:bg-gray-50 rounded-[14px] p-4 transition-colors cursor-text border border-gray-100 shadow-sm group">
                  <div className="w-10 flex justify-center"><div className="w-2.5 h-2.5 bg-black rounded-full ring-4 ring-gray-100 group-hover:ring-gray-200 transition-all"></div></div>
                  <div className="w-full text-[15px] font-bold text-black">Current Location</div>
                </div>
                <div onClick={() => navigate('/book')} className="flex items-center relative z-10 bg-white hover:bg-gray-50 rounded-[14px] p-4 transition-colors cursor-text border border-gray-100 shadow-sm group">
                  <div className="w-10 flex justify-center"><div className="w-2.5 h-2.5 bg-blue-600 shadow-sm ring-4 ring-blue-50 group-hover:ring-blue-100 transition-all"></div></div>
                  <div className="w-full text-[15px] font-bold text-gray-400">Where to?</div>
                </div>
              </div>
              <div className="px-2 pb-2">
                <button onClick={() => navigate('/book')} className="w-full bg-[#09090B] text-white py-4 rounded-[14px] text-[16px] font-black hover:bg-blue-600 transition-colors shadow-md flex items-center justify-center gap-2">
                  Request Ride <ArrowRight size={18}/>
                </button>
              </div>
            </motion.div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }} className="relative h-[600px] w-full hidden lg:flex justify-end items-center">
             <div className="absolute right-0 w-[90%] h-full bg-[#F4F5F7] rounded-[32px] overflow-hidden border border-gray-200/80 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.1)]">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-blue-500/10 rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-blue-500/20 rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] border border-blue-500/30 rounded-full bg-blue-500/5"></div>
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                   <path d="M -50,550 C 150,550 250,300 450,250 S 650,150 800,50" fill="none" stroke="#2563EB" strokeWidth="6" className="opacity-20 blur-sm" />
                   <path d="M -50,550 C 150,550 250,300 450,250 S 650,150 800,50" fill="none" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" strokeDasharray="4 12" className="animate-[dash_1s_linear_infinite]" />
                </svg>
                <motion.div animate={{ x: [0, 60, 120], y: [0, -30, -60] }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} className="absolute top-[380px] left-[200px] z-20">
                  <div className="relative">
                    <div className="absolute -inset-4 bg-blue-500 rounded-full blur-md opacity-40 animate-pulse"></div>
                    <div className="w-12 h-12 bg-[#09090B] rounded-full border-[3px] border-white shadow-xl flex items-center justify-center relative z-10">
                      <Car size={18} className="text-white" />
                    </div>
                  </div>
                </motion.div>
             </div>
          </motion.div>
        </div>
      </section>
      <section className="py-32 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-[#09090B] mb-4">The Fleet.</h2>
            <p className="text-[18px] text-gray-500 font-medium">Select the optimal vehicle configuration for your transit requirements.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Mini', desc: 'Efficient, compact rides for quick urban transit.', price: '₹12/km', time: '2 min', icon: <LayoutGrid size={28} strokeWidth={1.5}/> },
              { name: 'Sedan', desc: 'Enhanced comfort with extra legroom and storage.', price: '₹15/km', time: '4 min', icon: <Car size={28} strokeWidth={1.5}/>, popular: true },
              { name: 'SUV', desc: 'High-capacity vehicles for groups and luggage.', price: '₹20/km', time: '6 min', icon: <ShieldCheck size={28} strokeWidth={1.5}/> },
              { name: 'Premium', desc: 'Executive-class vehicles with top-rated chauffeurs.', price: '₹35/km', time: '8 min', icon: <Star size={28} strokeWidth={1.5}/> }
            ].map((ride, idx) => (
              <motion.div key={ride.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: idx * 0.1 }} className={`bg-white rounded-[24px] p-8 border ${ride.popular ? 'border-black shadow-xl' : 'border-gray-200 shadow-sm'} cursor-pointer flex flex-col h-[320px] relative`} onClick={() => navigate('/book')}>
                {ride.popular && <div className="absolute -top-3 left-8 bg-black text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-md">Most Popular</div>}
                <div className="flex justify-between items-start mb-6">
                  <div className="text-gray-900 bg-gray-50 border border-gray-100 p-4 rounded-[16px]">{ride.icon}</div>
                  <div className="text-[12px] font-bold text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">{ride.time}</div>
                </div>
                <h3 className="text-2xl font-bold text-black mb-2">{ride.name}</h3>
                <p className="text-[14px] text-gray-500 font-medium mb-8 flex-1">{ride.desc}</p>
                <div className="pt-5 border-t border-gray-100 flex justify-between items-center">
                  <span className="font-black text-[16px]">{ride.price}</span>
                  <ArrowRight size={18} className="text-gray-300"/>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </motion.div>
  );
};

export default Ride;
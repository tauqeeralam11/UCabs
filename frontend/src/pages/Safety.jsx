import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle2, Navigation, ShieldAlert, Car, PhoneCall } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
};

const Safety = () => {
  return (
    <div className="bg-white min-h-screen font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden text-[#09090B]">
      <Navbar />
      <section className="min-h-[90vh] flex items-center pt-32 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="lg:col-span-5 flex flex-col justify-center">
            <motion.h2 variants={fadeUp} className="text-[4rem] md:text-[5.5rem] font-black tracking-tighter text-[#09090B] mb-6 leading-[0.95]">
              Designed <br/>to protect.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[18px] text-gray-500 font-medium mb-12 leading-relaxed">
              Safety isn't an afterthought—it's engineered into the core. Experience seamless mobility built on a foundation of cryptographic trust.
            </motion.p>
            <div className="space-y-6">
              {[
                { icon: <ShieldCheck/>, title: "Driver KYC Verification", desc: "Manual review of Aadhaar, DL, and RC for every partner on the network." },
                { icon: <CheckCircle2/>, title: "Secure PIN Start", desc: "Trips cannot commence without physical verification of your 4-digit OTP." },
                { icon: <Navigation/>, title: "Live Trip Sharing", desc: "Broadcast exact GPS telemetry and ETA with trusted contacts." }
              ].map((item, i) => (
                <motion.div variants={fadeUp} key={i} className="bg-gray-50 border border-gray-100 rounded-[20px] p-6 flex items-start gap-5">
                  <div className="w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-black shrink-0 shadow-sm">
                    {React.cloneElement(item.icon, { size: 20, strokeWidth: 1.5 })}
                  </div>
                  <div>
                    <h4 className="font-bold text-black text-[18px] mb-1.5">{item.title}</h4>
                    <p className="text-[15px] text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }} className="lg:col-span-7 relative hidden lg:flex justify-end h-[650px]">
            <div className="relative border-[8px] border-[#0A0A0A] rounded-[3rem] h-full w-[300px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] bg-white overflow-hidden shrink-0 z-10">
              <div className="absolute top-3 inset-x-0 h-6 flex justify-center z-50 pointer-events-none">
                <div className="w-24 h-full bg-[#0A0A0A] rounded-full"></div>
              </div>
              <div className="w-full h-full relative">
                <div className="absolute inset-0 bg-[#E5E7EB]" style={{ backgroundImage: 'radial-gradient(#94A3B8 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
                <svg className="absolute inset-0 w-full h-full"><path d="M 60,450 C 150,350 200,150 220,80" fill="none" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" strokeDasharray="6 10" className="animate-[dash_10s_linear_infinite]" /></svg>
                <div className="absolute top-12 right-5 w-12 h-12 bg-white text-red-600 rounded-full shadow-lg flex items-center justify-center border border-gray-100">
                  <ShieldAlert size={22} />
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-white p-6 shadow-[0_-20px_40px_-10px_rgba(0,0,0,0.15)] border-t border-gray-100 rounded-t-[32px]">
                  <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
                  <div className="flex justify-between items-end mb-6">
                    <div>
                      <h3 className="font-black text-[24px] text-black tracking-tight leading-none mb-1.5">On trip</h3>
                      <p className="text-[13px] font-bold text-blue-600">Dropoff in 12 min</p>
                    </div>
                    <div className="bg-[#09090B] text-white px-4 py-2 rounded-[14px] font-black tracking-widest text-[14px] shadow-md">
                      PIN: 8492
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-[20px] p-4 flex justify-between items-center border border-gray-100">
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 bg-white border border-gray-200 shadow-sm rounded-[14px] flex items-center justify-center text-gray-500 font-bold text-sm">AK</div>
                      <div>
                        <p className="text-[16px] font-bold text-black leading-none mb-1">Arjun K.</p>
                        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">DL1A 2345</p>
                      </div>
                    </div>
                    <div className="bg-white border border-gray-200 text-black w-12 h-12 rounded-full flex items-center justify-center shadow-sm"><PhoneCall size={16}/></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Safety;
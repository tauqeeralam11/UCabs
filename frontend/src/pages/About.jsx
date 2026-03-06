import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Globe, Cpu } from 'lucide-react';
import MarketingNavbar from '../components/MarketingNavbar';
import Footer from '../components/Footer';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const About = () => {
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
      <section className="pt-40 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl">
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black text-white text-[10px] font-bold uppercase tracking-widest mb-6">
            Our Mission
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-[4rem] md:text-[5.5rem] font-black tracking-tighter mb-8 leading-[0.95]">
            Engineering the <br/> future of mobility.
          </motion.h1>
          <motion.p variants={fadeUp} className="text-[20px] md:text-[22px] text-gray-500 font-medium mb-16 leading-relaxed max-w-3xl">
            Ucabs is a technology company bridging the gap between digital intent and physical movement. We build algorithmic infrastructure that makes urban transportation predictable, scalable, and radically transparent.
          </motion.p>
        </motion.div>
      </section>

      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-[#F8F9FA] p-10 rounded-[32px] border border-gray-200/60">
              <h4 className="font-black text-5xl md:text-6xl text-black mb-4">1000<span className="text-blue-600">+</span></h4>
              <p className="text-[14px] font-bold text-gray-500 uppercase tracking-widest">Trips Processed</p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-[#F8F9FA] p-10 rounded-[32px] border border-gray-200/60">
              <h4 className="font-black text-5xl md:text-6xl text-black mb-4">100<span className="text-blue-600">+</span></h4>
              <p className="text-[14px] font-bold text-gray-500 uppercase tracking-widest">Verified Partners</p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-[#F8F9FA] p-10 rounded-[32px] border border-gray-200/60">
              <h4 className="font-black text-5xl md:text-6xl text-black mb-4">5<span className="text-blue-600">+</span></h4>
              <p className="text-[14px] font-bold text-gray-500 uppercase tracking-widest">Active Markets</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-32 bg-[#FCFCFD]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="mb-16 max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-[#09090B] mb-6">Our Core Tenets.</h2>
            <p className="text-[18px] text-gray-500 font-medium leading-relaxed">
              We operate on a set of strict architectural principles designed to eliminate friction from the physical world.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-white border border-gray-200 p-10 rounded-[32px] hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8">
                <Cpu size={28} />
              </div>
              <h3 className="text-2xl font-black text-black mb-4">Algorithmic Precision</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                We replace human guesswork with high-frequency matching engines. Our routing infrastructure calculates optimal paths in milliseconds, ensuring maximum efficiency for both riders and drivers.
              </p>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-white border border-gray-200 p-10 rounded-[32px] hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-gray-100 text-black rounded-2xl flex items-center justify-center mb-8">
                <Shield size={28} />
              </div>
              <h3 className="text-2xl font-black text-black mb-4">Cryptographic Safety</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                Trust is mathematically enforced. From mandatory physical OTP handshakes to real-time GPS telemetry sharing, safety is deeply embedded into our software architecture.
              </p>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-white border border-gray-200 p-10 rounded-[32px] hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-8">
                <Zap size={28} />
              </div>
              <h3 className="text-2xl font-black text-black mb-4">Absolute Transparency</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                Hidden fees and dynamic surges are a failure of design. We mathematically lock prices before a trip begins, providing economic certainty to our entire network.
              </p>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-white border border-gray-200 p-10 rounded-[32px] hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-8">
                <Globe size={28} />
              </div>
              <h3 className="text-2xl font-black text-black mb-4">Economic Empowerment</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                We view our drivers as independent partners. By maintaining low take-rates and providing instant liquidity, we foster sustainable micro-economies in every city we operate.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </motion.div>
  );
};

export default About;
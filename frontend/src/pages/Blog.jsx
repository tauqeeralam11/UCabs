import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import MarketingNavbar from '../components/MarketingNavbar';
import Footer from '../components/Footer';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

const Blog = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="bg-white min-h-screen font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden text-[#09090B]"
    >
      <MarketingNavbar />
      <section className="pt-40 pb-32 px-4 md:px-8 max-w-5xl mx-auto">
        <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}>
          <motion.h1 variants={fadeUp} className="text-[4rem] md:text-[5.5rem] font-black tracking-tighter mb-6 leading-[0.95]">
            Newsroom.
          </motion.h1>
          <motion.p variants={fadeUp} className="text-[20px] text-gray-500 font-medium mb-16 leading-relaxed">
            Updates from the engineering, product, and operation teams.
          </motion.p>
          <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#FCFCFD] border border-gray-200 p-10 rounded-[32px] hover:border-black hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between">
              <div>
                <p className="text-[11px] font-black text-blue-600 uppercase tracking-widest mb-6">Engineering</p>
                <h3 className="text-3xl font-black text-black mb-4 leading-tight tracking-tight">Re-architecting our real-time socket engine for sub-100ms latency.</h3>
                <p className="text-gray-500 font-medium mb-10 leading-relaxed">How we transitioned to a distributed Redis pub/sub model to handle millions of concurrent GPS telemetry pings across the grid.</p>
              </div>
              <span className="text-[14px] font-black text-black inline-flex items-center gap-2 group-hover:underline">Read article</span>
            </div>
            <div className="bg-[#FCFCFD] border border-gray-200 p-10 rounded-[32px] hover:border-black hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between">
              <div>
                <p className="text-[11px] font-black text-green-600 uppercase tracking-widest mb-6">Product</p>
                <h3 className="text-3xl font-black text-black mb-4 leading-tight tracking-tight">Introducing Cryptographic PIN verification.</h3>
                <p className="text-gray-500 font-medium mb-10 leading-relaxed">Ensuring absolute certainty before a trip commences with our new offline-capable OTP and driver verification system.</p>
              </div>
              <span className="text-[14px] font-black text-black inline-flex items-center gap-2 group-hover:underline">Read article</span>
            </div>
          </motion.div>
        </motion.div>
      </section>
      <Footer />
    </motion.div>
  );
};

export default Blog;
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import MarketingNavbar from '../components/MarketingNavbar';
import Footer from '../components/Footer';

const Privacy = () => {
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
      <section className="pt-40 pb-32 px-4 md:px-8 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-4">Your Privacy is our Priority</p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-12">Privacy Policy</h1>
          <div className="space-y-8 text-gray-600 font-medium leading-relaxed">
            <p>At Ucabs, accessible from our app and website, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Ucabs and how we use it.</p>
            <div>
              <h3 className="text-2xl font-black text-black mb-3">Information We Collect</h3>
              <p>The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information. This includes your precise GPS telemetry during active rides to ensure safety.</p>
            </div>
            <div>
              <h3 className="text-2xl font-black text-black mb-3">How We Use Your Information</h3>
              <p>We use the information we collect in various ways, including to provide, operate, and maintain our platform, improve, personalize, and expand our services, and to process secure transactions using our encrypted payment rails.</p>
            </div>
            <div>
              <h3 className="text-2xl font-black text-black mb-3">Log Files</h3>
              <p>Ucabs follows a standard procedure of using log files. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks.</p>
            </div>
          </div>
        </motion.div>
      </section>
      <Footer />
    </motion.div>
  );
};

export default Privacy;
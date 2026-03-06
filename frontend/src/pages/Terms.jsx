import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import MarketingNavbar from '../components/MarketingNavbar';
import Footer from '../components/Footer';

const Terms = () => {
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
          <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-4">Effective Date: March 6, 2026</p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-12">Terms of Service</h1>
          <div className="space-y-8 text-gray-600 font-medium leading-relaxed">
            <p>Welcome to Ucabs. These terms and conditions outline the rules and regulations for the use of Ucabs's infrastructure and network.</p>
            <div>
              <h3 className="text-2xl font-black text-black mb-3">1. Acceptance of Terms</h3>
              <p>By accessing this platform, we assume you accept these terms and conditions. Do not continue to use Ucabs if you do not agree to take all of the terms and conditions stated on this page.</p>
            </div>
            <div>
              <h3 className="text-2xl font-black text-black mb-3">2. User Accounts</h3>
              <p>You must provide accurate, complete, and current information when you create an account with us. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our service.</p>
            </div>
            <div>
              <h3 className="text-2xl font-black text-black mb-3">3. Partner Driver Obligations</h3>
              <p>Drivers must maintain a valid driver's license, vehicle registration, and adhere strictly to our safety and security protocols. Ucabs reserves the right to suspend any partner account failing cryptographic KYC verifications.</p>
            </div>
          </div>
        </motion.div>
      </section>
      <Footer />
    </motion.div>
  );
};

export default Terms;
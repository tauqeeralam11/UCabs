import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, MessageSquare, ArrowRight } from 'lucide-react';
import MarketingNavbar from '../components/MarketingNavbar';
import Footer from '../components/Footer';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

const Contact = () => {
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
      <section className="pt-40 pb-32 px-4 md:px-8 max-w-7xl mx-auto">
        <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}>
          <div className="max-w-3xl mb-16">
            <motion.h1 variants={fadeUp} className="text-[4rem] md:text-[5.5rem] font-black tracking-tighter mb-6 leading-[0.95]">
              Get in touch.
            </motion.h1>
            <motion.p variants={fadeUp} className="text-[20px] text-gray-500 font-medium leading-relaxed">
              Our engineering and support teams are available 24/7 to assist with your inquiries. Fill out the form or reach out directly.
            </motion.p>
          </div>

          <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7 bg-white border border-gray-200 p-8 md:p-12 rounded-[32px] shadow-sm">
              <h3 className="text-2xl font-black text-black mb-8">Send a Message</h3>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Full Name</label>
                    <input type="text" placeholder="Name" className="w-full bg-[#F4F4F5] border-2 border-transparent focus:border-black focus:bg-white rounded-xl px-4 py-3.5 font-semibold outline-none transition-all" />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Email Address</label>
                    <input type="email" placeholder="email@company.com" className="w-full bg-[#F4F4F5] border-2 border-transparent focus:border-black focus:bg-white rounded-xl px-4 py-3.5 font-semibold outline-none transition-all" />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Subject</label>
                  <select className="w-full bg-[#F4F4F5] border-2 border-transparent focus:border-black focus:bg-white rounded-xl px-4 py-3.5 font-semibold outline-none transition-all cursor-pointer">
                    <option>General Inquiry</option>
                    <option>Partner/Driver Support</option>
                    <option>Rider Support</option>
                    <option>Press & Media</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Message</label>
                  <textarea rows="5" placeholder="How can we help you?" className="w-full bg-[#F4F4F5] border-2 border-transparent focus:border-black focus:bg-white rounded-xl px-4 py-3.5 font-semibold outline-none transition-all resize-none"></textarea>
                </div>
                <button className="w-full bg-black text-white py-4 rounded-xl font-bold text-[16px] hover:bg-gray-800 transition-colors flex justify-center items-center gap-2">
                  Submit Inquiry <ArrowRight size={18}/>
                </button>
              </form>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#09090B] text-white border border-gray-800 p-8 rounded-[32px] hover:shadow-xl transition-all">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white mb-6">
                  <Mail size={20} />
                </div>
                <h4 className="font-bold text-xl mb-2">Support Email</h4>
                <p className="text-gray-400 font-medium mb-6">For general queries and technical assistance.</p>
                <p className="text-lg font-black tracking-wide">support@ucabs.com</p>
              </div>

              <div className="bg-white border border-gray-200 p-8 rounded-[32px] hover:shadow-xl transition-all">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-black mb-6">
                  <MessageSquare size={20} />
                </div>
                <h4 className="font-bold text-black text-xl mb-2">Press & Media</h4>
                <p className="text-gray-500 font-medium mb-6">For public relations and media kits.</p>
                <p className="text-lg font-black text-black tracking-wide">press@ucabs.com</p>
              </div>

              <div className="bg-white border border-gray-200 p-8 rounded-[32px] hover:shadow-xl transition-all">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-black mb-6">
                  <MapPin size={20} />
                </div>
                <h4 className="font-bold text-black text-xl mb-2">Headquarters</h4>
                <p className="text-gray-500 font-medium leading-relaxed">
                  Ucabs Technologies Inc.<br/>
                  Delhi, India
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>
      <Footer />
    </motion.div>
  );
};

export default Contact;
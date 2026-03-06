import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, ShieldCheck, ArrowRight, Car, 
  Navigation, CreditCard, Clock, Star,
  PhoneCall, CheckCircle2, User, LayoutGrid, Zap,
  BarChart3, ShieldAlert
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
};

export const PhoneMockup = ({ children, className }) => (
  <div className={`relative border-[8px] border-[#0A0A0A] rounded-[3rem] h-[600px] w-[280px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] bg-white overflow-hidden shrink-0 transform-gpu ${className}`}>
    <div className="absolute top-3 inset-x-0 h-6 flex justify-center z-50 pointer-events-none">
      <div className="w-24 h-full bg-[#0A0A0A] rounded-full"></div>
    </div>
    <div className="w-full h-full relative transform-gpu">
      {children}
    </div>
  </div>
);

export const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section id="ride" className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-[#FAFAFA] font-sans">
      <div className="absolute inset-0 pointer-events-none transform-gpu" style={{
        backgroundImage: 'linear-gradient(#E5E7EB 1px, transparent 1px), linear-gradient(90deg, #E5E7EB 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        opacity: 0.5,
        maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)'
      }}></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">

          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="w-full lg:w-[50%] max-w-2xl transform-gpu">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-[11px] font-bold uppercase tracking-widest text-gray-800 mb-8 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span> Live in 20+ Cities
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem] font-black leading-[0.9] tracking-tighter mb-6 text-[#09090B]">
              Go anywhere, <br />
              <span className="text-blue-600">instantly.</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-[18px] md:text-[20px] text-gray-500 font-medium mb-10 leading-relaxed max-w-lg">
              The most precise mobility network. Request a ride, track your driver in real-time, and reach your destination safely.
            </motion.p>

            <motion.div variants={fadeUp} className="bg-white p-2 rounded-2xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-200 flex flex-col md:flex-row gap-2 max-w-xl">
              <div className="flex-1 flex items-center bg-[#F4F4F5] rounded-xl px-4 py-3.5 md:py-3 border border-transparent focus-within:bg-white focus-within:border-black transition-all cursor-text" onClick={() => navigate('/book')}>
                <div className="w-2 h-2 bg-black rounded-full mr-3 shrink-0"></div>
                <input type="text" placeholder="Pickup location" className="bg-transparent border-none outline-none w-full text-[15px] font-semibold text-gray-900 placeholder-gray-500 pointer-events-none" readOnly />
              </div>
              <div className="flex-1 flex items-center bg-[#F4F4F5] rounded-xl px-4 py-3.5 md:py-3 border border-transparent focus-within:bg-white focus-within:border-black transition-all cursor-text" onClick={() => navigate('/book')}>
                <div className="w-2 h-2 bg-blue-600 rounded-sm mr-3 shrink-0"></div>
                <input type="text" placeholder="Dropoff location" className="bg-transparent border-none outline-none w-full text-[15px] font-semibold text-gray-900 placeholder-gray-500 pointer-events-none" readOnly />
              </div>
              <button onClick={() => navigate('/book')} className="bg-black text-white px-8 py-4 md:py-0 rounded-xl font-bold text-[15px] hover:bg-gray-800 active:scale-95 transition-all shrink-0">
                Search
              </button>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.2 }} className="w-full lg:w-[45%] relative h-[600px] hidden lg:block transform-gpu">
            <div className="absolute right-0 top-10 w-[90%] h-[500px] bg-white rounded-[32px] shadow-[0_30px_60px_rgba(0,0,0,0.08)] border border-gray-200 overflow-hidden z-0 transform-gpu">
               <div className="absolute inset-0 bg-[#F8F9FA]" style={{ backgroundImage: 'radial-gradient(#CBD5E1 1.5px, transparent 1.5px)', backgroundSize: '24px 24px', opacity: 0.7 }}></div>
               <svg className="absolute inset-0 w-full h-full transform-gpu" preserveAspectRatio="none">
                 <path d="M 50,400 C 150,300 200,150 350,100" fill="none" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" strokeDasharray="6 10" className="animate-[dash_10s_linear_infinite]" />
                 <circle cx="50" cy="400" r="6" fill="#000" />
                 <rect x="344" y="94" width="12" height="12" fill="#2563EB" />
               </svg>
               <div className="absolute top-[180px] left-[120px] bg-white rounded-2xl p-4 shadow-xl border border-gray-100 flex items-center gap-4 transform-gpu">
                 <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center"><Car size={18} className="text-blue-600"/></div>
                 <div>
                   <p className="text-[14px] font-black text-gray-900 leading-none mb-1">Arjun K.</p>
                   <p className="text-[11px] font-bold text-gray-500">UP16 AB 1234 • 2 min away</p>
                 </div>
               </div>
            </div>

            <div className="absolute left-[-20px] bottom-5 w-[280px] h-[560px] bg-[#0A0A0A] rounded-[2.5rem] p-2 shadow-[0_40px_80px_rgba(0,0,0,0.3)] border-[6px] border-[#1A1A1D] z-20 transform-gpu">
              <div className="bg-white w-full h-full rounded-[2rem] overflow-hidden relative flex flex-col transform-gpu">
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-full z-50 transform-gpu"></div>
                <div className="pt-12 pb-4 px-5 bg-white border-b border-gray-100 z-10 transform-gpu">
                  <h3 className="font-black text-xl tracking-tight text-gray-900">Select Ride</h3>
                </div>
                <div className="flex-1 bg-[#F8F9FA] p-4 space-y-3 overflow-hidden">
                  <div className="bg-white p-4 rounded-2xl border-2 border-black shadow-sm relative overflow-hidden transform-gpu">
                    <div className="absolute top-0 right-0 bg-blue-600 text-white text-[8px] font-black px-2 py-0.5 rounded-bl-lg uppercase tracking-widest">Fastest</div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-black text-[15px] flex items-center gap-1.5 text-gray-900">Mini <User size={10} className="text-gray-400"/> 3</span>
                      <span className="font-black text-[16px] text-gray-900">₹245</span>
                    </div>
                    <p className="text-[11px] font-bold text-gray-500">2 min away</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-gray-200 opacity-70 transform-gpu">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-black text-[15px] flex items-center gap-1.5 text-gray-900">Sedan <User size={10} className="text-gray-400"/> 4</span>
                      <span className="font-black text-[16px] text-gray-900">₹310</span>
                    </div>
                    <p className="text-[11px] font-bold text-gray-500">4 min away</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-gray-200 opacity-70 transform-gpu">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-black text-[15px] flex items-center gap-1.5 text-gray-900">SUV <User size={10} className="text-gray-400"/> 6</span>
                      <span className="font-black text-[16px] text-gray-900">₹450</span>
                    </div>
                    <p className="text-[11px] font-bold text-gray-500">7 min away</p>
                  </div>
                </div>
                <div className="p-4 bg-white border-t border-gray-100 mt-auto z-10 transform-gpu">
                  <button className="w-full bg-black text-white py-3.5 rounded-xl font-bold text-[14px] shadow-md transform-gpu">Confirm Mini</button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export const FleetSection = () => {
  const navigate = useNavigate();
  return (
    <section className="min-h-screen flex items-center py-24 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-[#09090B] mb-4">Vehicle Tiers.</h2>
            <p className="text-[18px] text-gray-500 font-medium">Select the optimal vehicle configuration for your transit requirements.</p>
          </div>
          <button onClick={() => navigate('/book')} className="text-blue-600 text-[15px] font-bold flex items-center gap-2 hover:gap-4 transition-all">Explore fleet <ArrowRight size={18}/></button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { name: 'Mini', desc: 'Efficient, compact rides for quick urban transit.', price: '₹12/km', time: '2 min', icon: <LayoutGrid size={28} strokeWidth={1.5}/> },
            { name: 'Sedan', desc: 'Enhanced comfort with extra legroom and storage.', price: '₹15/km', time: '4 min', icon: <Car size={28} strokeWidth={1.5}/>, popular: true },
            { name: 'SUV', desc: 'High-capacity vehicles for groups and luggage.', price: '₹20/km', time: '6 min', icon: <ShieldCheck size={28} strokeWidth={1.5}/> }
          ].map((ride, idx) => (
            <motion.div 
              key={ride.name}
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} transition={{ delay: idx * 0.1 }}
              className={`bg-white rounded-[24px] p-8 border transform-gpu ${ride.popular ? 'border-black shadow-[0_20px_50px_rgba(0,0,0,0.08)]' : 'border-gray-200 shadow-sm hover:border-gray-300 hover:shadow-md'} transition-all cursor-pointer group flex flex-col h-[320px] relative`}
              onClick={() => navigate('/book')}
            >
              {ride.popular && <div className="absolute -top-3 left-8 bg-black text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-md">Most Popular</div>}
              
              <div className="flex justify-between items-start mb-6">
                <div className="text-gray-900 bg-gray-50 border border-gray-100 p-4 rounded-[16px] group-hover:bg-black group-hover:text-white transition-colors">{ride.icon}</div>
                <div className="text-[12px] font-bold text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                  {ride.time}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-black mb-2">{ride.name}</h3>
              <p className="text-[14px] text-gray-500 font-medium mb-8 leading-relaxed flex-1">{ride.desc}</p>
              
              <div className="pt-5 flex justify-between items-center border-t border-gray-100">
                <span className="font-black text-black text-[16px]">{ride.price}</span>
                <ArrowRight size={18} className="text-gray-300 group-hover:text-black transition-colors"/>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const EngineeredFlowSection = () => (
  <section className="min-h-screen flex items-center py-24 bg-[#09090B] text-white border-t border-white/5 relative overflow-hidden">
    <div className="absolute inset-0 opacity-[0.05] transform-gpu" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
    
    <div className="max-w-7xl mx-auto px-4 md:px-8 w-full relative z-10">
      <div className="mb-20 max-w-2xl">
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-5 text-white">Engineered flow.</h2>
        <p className="text-[18px] text-gray-400 font-medium leading-relaxed">A frictionless architecture designed for speed and reliability, from the initial request to the final drop-off.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
        {[
          { step: '01', title: 'Request', icon: <MapPin strokeWidth={1.5}/>, desc: 'Set destination. Algorithm calculates optimal route and upfront pricing instantly.' },
          { step: '02', title: 'Match', icon: <Zap strokeWidth={1.5}/>, desc: 'High-frequency matching engine connects you to the nearest available partner.' },
          { step: '03', title: 'Track', icon: <Navigation strokeWidth={1.5}/>, desc: 'Real-time telemetry shows vehicle approach on the interactive map interface.' },
          { step: '04', title: 'Pay', icon: <CreditCard strokeWidth={1.5}/>, desc: 'Secure, encrypted transaction completion via multiple payment rails.' }
        ].map((item, idx) => (
          <motion.div key={item.step} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: idx * 0.1 }} className="bg-[#121214] border border-white/[0.05] rounded-[24px] p-8 hover:bg-[#18181B] transition-all group relative overflow-hidden hover:-translate-y-1 transform-gpu">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity transform-gpu"></div>
            <div className="text-[11px] font-black text-blue-500 mb-8 tracking-widest">{item.step}</div>
            <div className="w-14 h-14 bg-white/[0.03] border border-white/[0.05] rounded-[16px] flex items-center justify-center mb-6 text-gray-300 group-hover:text-white transition-colors">
               {item.icon}
            </div>
            <h3 className="text-[20px] font-bold mb-3">{item.title}</h3>
            <p className="text-[15px] text-gray-400 font-medium leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export const SafetySection = () => (
  <section id="safety" className="min-h-[90vh] lg:min-h-[800px] flex items-center py-24 bg-white border-t border-gray-200 overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="lg:col-span-5 flex flex-col justify-center order-2 lg:order-1 transform-gpu">
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black tracking-tighter text-[#09090B] mb-6">Designed to protect.</motion.h2>
          <motion.p variants={fadeUp} className="text-[18px] text-gray-500 font-medium mb-12 leading-relaxed">
            Safety isn't an afterthought—it's engineered into the core. Experience seamless mobility built on a foundation of cryptographic trust.
          </motion.p>
          
          <div className="space-y-6">
            {[
              { icon: <ShieldCheck/>, title: "Driver KYC Verification", desc: "Manual review of Aadhaar, DL, and RC for every partner on the network." },
              { icon: <CheckCircle2/>, title: "Secure PIN Start", desc: "Trips cannot commence without physical verification of your 4-digit OTP." },
              { icon: <Navigation/>, title: "Live Trip Sharing", desc: "Broadcast exact GPS telemetry and ETA with trusted contacts." }
            ].map((item, i) => (
              <motion.div variants={fadeUp} key={i} className="bg-gray-50 border border-gray-100 rounded-[20px] p-6 flex items-start gap-5 hover:border-gray-200 transition-colors transform-gpu">
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
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="lg:col-span-7 relative flex justify-center lg:justify-end order-1 lg:order-2 h-[600px] transform-gpu">
          <PhoneMockup className="relative z-10">
              <div className="absolute inset-0 bg-[#E5E7EB] transform-gpu" style={{ backgroundImage: 'radial-gradient(#94A3B8 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
              <svg className="absolute inset-0 w-full h-full transform-gpu"><path d="M 60,400 C 150,300 200,150 220,80" fill="none" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" strokeDasharray="6 10" className="animate-[dash_10s_linear_infinite]" /></svg>
              
              <div className="absolute top-12 right-5 w-12 h-12 bg-white text-red-600 rounded-full shadow-lg flex items-center justify-center border border-gray-100">
                <ShieldAlert size={22} />
              </div>

              <div className="absolute bottom-0 inset-x-0 bg-white p-6 shadow-[0_-20px_40px_-10px_rgba(0,0,0,0.15)] border-t border-gray-100 rounded-t-[32px] transform-gpu">
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
                <div className="bg-gray-50 rounded-[20px] p-3 flex justify-between items-center border border-gray-100">
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
          </PhoneMockup>
        </motion.div>
      </div>
    </div>
  </section>
);

export const DriverEarningsSection = () => {
  const navigate = useNavigate();
  return (
    <section id="drive" className="min-h-screen flex items-center py-24 bg-[#F8F9FC] border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center w-full">
        
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="lg:col-span-6 w-full flex justify-center lg:justify-start order-2 lg:order-1 transform-gpu">
          <div className="bg-white rounded-[32px] p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] border border-gray-200/60 w-full max-w-lg relative">
             <div className="flex justify-between items-center mb-8">
               <h3 className="text-[20px] font-bold text-[#09090B] flex items-center gap-2"><BarChart3 size={20}/> Partner Earnings</h3>
               <div className="bg-green-50 text-green-700 px-3 py-1.5 rounded-[10px] text-[11px] font-bold uppercase tracking-widest border border-green-100 flex items-center gap-1.5">
                 <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Online
               </div>
             </div>
             
             <div className="bg-[#09090B] text-white rounded-[24px] p-8 mb-6 shadow-xl relative overflow-hidden transform-gpu">
                <p className="text-[12px] text-gray-400 font-medium mb-2">Available Balance</p>
                <h1 className="text-[48px] font-black tracking-tighter mb-8">₹1,840.50</h1>
                <div className="flex items-end gap-2 h-20 w-full mb-8">
                  {[40, 50, 30, 80, 60, 100, 70].map((h, i) => (
                    <div key={i} className="flex-1 bg-white rounded-t-sm transform-gpu" style={{ height: `${h}%`, opacity: 0.2 + (i * 0.1) }}></div>
                  ))}
                </div>

                <button className="w-full bg-white text-black py-4 rounded-[16px] font-bold text-[15px] hover:bg-gray-100 transition-colors">Withdraw Funds</button>
             </div>

             <div className="grid grid-cols-2 gap-4">
               <div className="bg-gray-50 rounded-[20px] p-5 border border-gray-100 flex items-center gap-4">
                 <div className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-700"><Car size={16}/></div>
                 <div><p className="text-[24px] font-black text-black leading-none mb-1">42</p><p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Trips</p></div>
               </div>
               <div className="bg-gray-50 rounded-[20px] p-5 border border-gray-100 flex items-center gap-4">
                 <div className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-700"><Clock size={16}/></div>
                 <div><p className="text-[24px] font-black text-black leading-none mb-1">24h</p><p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Online</p></div>
               </div>
             </div>
          </div>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="lg:col-span-6 order-1 lg:order-2 lg:pl-10 transform-gpu">
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black tracking-tighter text-[#09090B] mb-6">Financial independence.</motion.h2>
          <motion.p variants={fadeUp} className="text-[18px] text-gray-500 font-medium mb-12 leading-relaxed">
            Build a sustainable business on your terms. Our platform offers complete transparency on earnings and instant liquidity.
          </motion.p>
          
          <div className="space-y-8 mb-12">
            {[
              { title: 'Flexible Schedule', desc: 'Work entirely on your terms. Go online or offline instantly.' },
              { title: 'Instant Payouts', desc: 'Cash out directly to your bank account at any time.' },
              { title: 'Transparent Pricing', desc: 'Know exactly what you earn before accepting a ride.' }
            ].map((benefit, idx) => (
              <motion.div variants={fadeUp} key={idx} className="flex gap-5">
                <div className="mt-1 w-7 h-7 rounded-full bg-gray-100 text-black flex items-center justify-center shrink-0">
                  <CheckCircle2 size={16} strokeWidth={2}/>
                </div>
                <div>
                  <h4 className="font-bold text-[#09090B] text-[18px] mb-1.5">{benefit.title}</h4>
                  <p className="text-[15px] text-gray-500 font-medium">{benefit.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.button variants={fadeUp} onClick={() => navigate('/register')} className="bg-[#09090B] text-white px-8 py-4 rounded-xl text-[16px] font-bold flex items-center gap-2 hover:bg-blue-600 transition-all shadow-md">
            Apply to Drive <ArrowRight size={18}/>
          </motion.button>
        </motion.div>

      </div>
    </section>
  );
};

export const CTASection = () => {
  const navigate = useNavigate();
  return (
    <section className="py-32 bg-white relative w-full flex items-center justify-center">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="w-full max-w-6xl bg-[#09090B] rounded-[3rem] p-16 md:p-24 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] relative overflow-hidden mx-4 md:mx-8 text-center flex flex-col items-center justify-center transform-gpu">
        <div className="absolute inset-0 opacity-10 transform-gpu" style={{ backgroundImage: 'radial-gradient(#ffffff 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600 rounded-full blur-[150px] opacity-20 pointer-events-none transform-gpu will-change-transform"></div>
        
        <div className="relative z-10 w-full flex flex-col items-center justify-center">
          <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-white mb-6 text-center">Ready to ride?</h2>
          <p className="text-[18px] font-medium text-gray-400 mb-12 max-w-2xl text-center">Join the network defining the future of urban transportation.</p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
            <button onClick={() => navigate('/register')} className="cursor-pointer bg-white text-[#09090B] px-10 py-4 rounded-[16px] text-[16px] font-bold hover:bg-gray-100 active:scale-[0.98] transition-transform">
              Create Free Account
            </button>
            <button onClick={() => navigate('/login')} className="cursor-pointer bg-transparent border border-white/20 text-white px-10 py-4 rounded-[16px] text-[16px] font-bold hover:bg-white/10 active:scale-[0.98] transition-all">
              Sign In
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
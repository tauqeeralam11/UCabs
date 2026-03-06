import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { Car, User, FileText, Mail, Phone, Lock, UserRound, Hash, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';

const Register = () => {
  const [role, setRole] = useState('user'); 
  const [formData, setFormData] = useState({ 
    name: '', email: '', password: '', confirmPassword: '', phone: '', vehicleType: 'Mini', vehicleModel: '', vehiclePlate: '', licenseNumber: '', rcNumber: '' 
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters long.');
    }
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match. Please try again.');
    }

    setIsLoading(true); 
    
    const result = await register(
      formData.name, formData.email, formData.password, formData.phone, role, 
      formData.vehicleType, formData.vehiclePlate, formData.vehicleModel, formData.licenseNumber, formData.rcNumber
    );
    
    if (result.success) {
      if (result.user.role === 'admin') navigate('/admin');
      else if (result.user.role === 'driver') navigate('/drive');
      else navigate('/book');
    } else {
      setError(result.message);
    }
    setIsLoading(false);
  };

  const inputClasses = "w-full bg-[#F4F4F5] hover:bg-[#E4E4E7] focus:bg-white border-2 border-transparent focus:border-black rounded-[14px] pl-11 pr-4 py-3.5 font-semibold text-black transition-all outline-none placeholder:text-gray-400 shadow-sm";
  const iconClasses = "absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 peer-focus:text-black transition-colors";

  return (
    <div className="h-screen flex bg-white font-sans overflow-hidden text-[#09090B]">
      
      <div className="hidden lg:flex w-[45%] bg-[#F8F9FA] border-r border-gray-200 relative flex-col justify-center items-center p-12 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.5]" style={{ backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
           <path d="M -50,600 C 150,550 250,300 450,250 S 650,150 800,50" fill="none" stroke="#2563EB" strokeWidth="6" className="opacity-10 blur-sm" />
           <path d="M -50,600 C 150,550 250,300 450,250 S 650,150 800,50" fill="none" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" strokeDasharray="4 12" className="animate-[dash_1s_linear_infinite]" />
        </svg>

        <div className="relative z-10 bg-white p-8 rounded-[2rem] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.15)] border border-gray-100 max-w-sm w-full">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center shadow-lg">
              <Car size={24} className="text-white"/>
            </div>
            <div>
              <h3 className="font-black text-2xl text-black leading-none mb-1">Ucab.</h3>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Precision Mobility</p>
            </div>
          </div>
          <p className="text-gray-500 font-medium text-[15px] leading-relaxed mb-8">
            Join the network engineered for absolute reliability. Real-time telemetry, upfront pricing, and uncompromised safety.
          </p>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full w-[65%] rounded-full relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/30"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[55%] h-full overflow-y-auto flex flex-col bg-white relative">
        
        <div className="lg:hidden flex justify-between items-center p-6 border-b border-gray-100">
           <Link to="/" className="text-2xl font-black tracking-tighter text-black">Ucab.</Link>
           <Link to="/" className="text-sm font-bold text-gray-500 hover:text-black">Back to website</Link>
        </div>

        

        <div className="flex-1 flex items-center justify-center p-6 sm:p-12 pb-32 mt-4 lg:mt-0">
          <div className="w-full max-w-[440px]">
            
            <div className="mb-8 text-center sm:text-left">
              <h2 className="text-[2.5rem] font-black text-black mb-2 tracking-tight">Create Account</h2>
              <p className="text-gray-500 font-medium text-[15px]">Select your role and enter your details to begin.</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-bold border border-red-100 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse shrink-0"></span> {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 mb-8">
              <div onClick={() => setRole('user')} className={`relative cursor-pointer p-4 rounded-[16px] border-2 flex flex-col sm:flex-row items-center justify-center gap-3 transition-all duration-200 group ${role === 'user' ? 'border-black bg-white shadow-[0_8px_20px_rgba(0,0,0,0.06)]' : 'border-transparent bg-[#F4F4F5] hover:bg-[#E4E4E7]'}`}>
                {role === 'user' && <CheckCircle2 className="hidden sm:block absolute top-2 right-2 text-black" size={16} strokeWidth={3} />}
                <UserRound size={22} className={role === 'user' ? 'text-black' : 'text-gray-500 group-hover:text-black'} />
                <span className={`font-bold text-[15px] ${role === 'user' ? 'text-black' : 'text-gray-500 group-hover:text-black'}`}>Rider</span>
              </div>
              <div onClick={() => setRole('driver')} className={`relative cursor-pointer p-4 rounded-[16px] border-2 flex flex-col sm:flex-row items-center justify-center gap-3 transition-all duration-200 group ${role === 'driver' ? 'border-black bg-white shadow-[0_8px_20px_rgba(0,0,0,0.06)]' : 'border-transparent bg-[#F4F4F5] hover:bg-[#E4E4E7]'}`}>
                {role === 'driver' && <CheckCircle2 className="hidden sm:block absolute top-2 right-2 text-black" size={16} strokeWidth={3} />}
                <Car size={22} className={role === 'driver' ? 'text-black' : 'text-gray-500 group-hover:text-black'} />
                <span className={`font-bold text-[15px] ${role === 'driver' ? 'text-black' : 'text-gray-500 group-hover:text-black'}`}>Partner</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative group">
                  <input type="text" placeholder="Full Name" required className={`${inputClasses} peer`} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  <div className={iconClasses}><User size={18} /></div>
                </div>
                
                <div className="relative group">
                  <div className={iconClasses}><Phone size={18} /></div>
                  <div className="absolute inset-y-0 left-10 flex items-center pointer-events-none text-gray-900 font-bold text-[15px]">
                    +91
                  </div>
                  <input 
                    type="tel" 
                    maxLength="10"
                    placeholder="Phone Number" 
                    required 
                    className={`w-full bg-[#F4F4F5] hover:bg-[#E4E4E7] focus:bg-white border-2 border-transparent focus:border-black rounded-[14px] pl-[76px] pr-4 py-3.5 font-semibold text-black transition-all outline-none placeholder:text-gray-400 shadow-sm peer`} 
                    value={formData.phone} 
                    onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})} 
                  />
                </div>
              </div>

              <div className="relative group">
                <input type="email" placeholder="Email address" required className={`${inputClasses} peer`} value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                <div className={iconClasses}><Mail size={18} /></div>
              </div>
              
              <AnimatePresence>
                {role === 'driver' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }} 
                    exit={{ opacity: 0, height: 0 }} 
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="flex flex-col gap-4 overflow-hidden border-y border-gray-100 py-6 my-1"
                  >
                    <div className="flex items-center gap-2 text-black font-bold text-[15px] tracking-tight"><FileText size={18}/> Vehicle Specifications</div>
                    
                    <div className="grid grid-cols-3 gap-2 mb-1">
                      {['Mini', 'Sedan', 'SUV'].map((type) => (
                        <div 
                          key={type}
                          onClick={() => setFormData({...formData, vehicleType: type})}
                          className={`cursor-pointer py-3 rounded-xl border-2 text-center text-[13px] font-bold transition-all ${formData.vehicleType === type ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' : 'border-transparent bg-[#F4F4F5] text-gray-500 hover:bg-[#E4E4E7]'}`}
                        >
                          {type}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="relative group">
                        <input type="text" placeholder="Model (e.g. Swift)" required={role === 'driver'} className={`${inputClasses} peer`} value={formData.vehicleModel} onChange={(e) => setFormData({...formData, vehicleModel: e.target.value})} />
                        <div className={iconClasses}><Car size={18} /></div>
                      </div>
                      <div className="relative group">
                        <input type="text" placeholder="Plate Number" required={role === 'driver'} className={`${inputClasses} uppercase peer`} value={formData.vehiclePlate} onChange={(e) => setFormData({...formData, vehiclePlate: e.target.value})} />
                        <div className={iconClasses}><Hash size={18} /></div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1">
                <div className="relative group">
                  <input type="password" placeholder="Create Password" required className={`${inputClasses} peer`} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                  <div className={iconClasses}><Lock size={18} /></div>
                </div>
                <div className="relative group">
                  <input type="password" placeholder="Confirm Password" required className={`${inputClasses} peer`} value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} />
                  <div className={iconClasses}><Lock size={18} /></div>
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="w-full bg-black text-white py-4 rounded-[14px] text-[16px] font-bold hover:bg-blue-600 transition-colors transform active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 mt-4 flex justify-center items-center gap-2 group shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
                {isLoading ? <Loader2 className="animate-spin" size={24} /> : <>Create Account <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>}
              </button>
            </form>
            
            <p className="mt-8 text-center font-bold text-gray-500 text-[14px]">
              Already have an account? <Link to="/login" className="text-black hover:underline transition-colors">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
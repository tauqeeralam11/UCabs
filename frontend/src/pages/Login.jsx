import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, Loader2, ArrowRight, Car } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      return setError('Password must be at least 6 characters long.');
    }

    setIsLoading(true); 
    const result = await login(email, password);
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
            Access your dashboard, manage your itineraries, and command the city with absolute precision.
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

        

        <div className="flex-1 flex items-center justify-center p-6 sm:p-12 pb-32">
          <div className="w-full max-w-[400px]">
            
            <div className="mb-10 text-center sm:text-left">
              <h2 className="text-[2.5rem] font-black text-black mb-2 tracking-tight">Welcome Back</h2>
              <p className="text-gray-500 font-medium text-[15px]">Enter your credentials to securely authenticate.</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-bold border border-red-100 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse shrink-0"></span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              
              <div className="relative group">
                <input 
                  type="email" 
                  placeholder="Email address" 
                  required 
                  className={`${inputClasses} peer`}
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
                <div className={iconClasses}>
                  <Mail size={18} />
                </div>
              </div>

              <div className="relative group">
                <input 
                  type="password" 
                  placeholder="Password" 
                  required 
                  className={`${inputClasses} peer`}
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                />
                <div className={iconClasses}>
                  <Lock size={18} />
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="w-full bg-black text-white py-4 rounded-[14px] text-[16px] font-bold hover:bg-blue-600 transition-colors transform active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 mt-4 flex justify-center items-center gap-2 group shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
                {isLoading ? <Loader2 className="animate-spin" size={24} /> : <>Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>}
              </button>
            </form>

            <p className="mt-8 text-center font-bold text-gray-500 text-[14px]">
              Don't have an account? <Link to="/register" className="text-black hover:underline transition-colors">Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
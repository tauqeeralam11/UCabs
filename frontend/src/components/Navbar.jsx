import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, Menu, X, Home, Clock, LogOut, Car, Wallet, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const getHomeRoute = () => {
    if (!user) return '/';
    if (user.role === 'admin') return '/admin';
    return user.role === 'driver' ? '/drive' : '/book';
  };

  const isActive = (path) => location.pathname === path;
  const navLinkClasses = (path) => `flex items-center gap-2 text-[14px] font-semibold transition-colors ${isActive(path) ? 'text-[#09090B]' : 'text-gray-500 hover:text-[#09090B]'}`;
  const mobileLinkClasses = (path) => `flex items-center gap-3 p-4 rounded-2xl text-[16px] font-bold transition-all ${isActive(path) ? 'bg-gray-50 text-[#09090B]' : 'text-gray-600 hover:bg-gray-50 hover:text-[#09090B]'}`;

  return (
    <>
      <nav className="fixed top-0 left-0 w-full h-[72px] bg-white/90 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] z-[2000] border-b border-gray-200/80 font-sans">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex justify-between items-center">
          
          <Link to={getHomeRoute()} onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black tracking-tighter text-[#09090B] flex items-center gap-1 hover:opacity-80 transition-opacity">
            Ucab<span className="text-blue-600">.</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            {user ? (
              <>

                {user.role === 'admin' && (
                  <Link to="/admin" className={navLinkClasses('/admin')}>
                    <ShieldCheck size={18} /> Admin Panel
                  </Link>
                )}

                {user.role === 'driver' && (
                  <>
                    <Link to="/drive" className={navLinkClasses('/drive')}>
                      <Car size={18} /> Dashboard
                    </Link>
                    <Link to="/wallet" className={navLinkClasses('/wallet')}>
                      <Wallet size={18} /> Wallet
                    </Link>
                    <Link to="/history" className={navLinkClasses('/history')}>
                      <Clock size={18} /> History
                    </Link>
                  </>
                )}

                {user.role === 'user' && (
                  <>
                    <Link to="/book" className={navLinkClasses('/book')}>
                      <Home size={18} /> Book Ride
                    </Link>
                    <Link to="/history" className={navLinkClasses('/history')}>
                      <Clock size={18} /> History
                    </Link>
                  </>
                )}
                
                <div className="h-5 w-px bg-gray-200 mx-2"></div>
                
                <Link to="/profile" className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all border ${isActive('/profile') ? 'bg-[#09090B] text-white border-[#09090B] shadow-md' : 'bg-gray-50 text-[#09090B] hover:bg-gray-100 border-gray-200 hover:border-gray-300'}`}>
                  <User size={16} className={isActive('/profile') ? 'text-white' : 'text-[#09090B]'} />
                  <span className="text-[13px] font-bold truncate max-w-[120px]">
                    {user?.name ? user.name.split(' ')[0] : 'Profile'}
                  </span>
                </Link>
                
                <button onClick={handleLogout} className="flex items-center justify-center p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="Sign Out">
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-5">
                <button onClick={() => navigate('/login')} className="text-[14px] font-semibold text-gray-600 hover:text-[#09090B] transition-colors">Sign In</button>
                <button onClick={() => navigate('/register')} className="bg-[#09090B] text-white text-[14px] font-semibold px-5 py-2.5 rounded-full hover:bg-blue-600 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5">
                  Create Account
                </button>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 -mr-2 text-[#09090B] hover:bg-gray-50 rounded-full transition-colors">
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && user && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[72px] left-0 w-full bg-white/95 backdrop-blur-2xl border-b border-gray-200 shadow-[0_20px_40px_rgba(0,0,0,0.1)] z-[1999] md:hidden flex flex-col p-4 gap-2 font-sans"
          >
            {user.role === 'admin' && (
              <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkClasses('/admin')}><ShieldCheck size={20} /> Admin Panel</Link>
            )}
            
            {user.role === 'driver' && (
              <>
                 <Link to="/drive" onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkClasses('/drive')}><Car size={20} /> Dashboard</Link>
                 <Link to="/wallet" onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkClasses('/wallet')}><Wallet size={20} /> Wallet</Link>
                 <Link to="/history" onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkClasses('/history')}><Clock size={20} /> History</Link>
              </>
            )}

            {user.role === 'user' && (
              <>
                <Link to="/book" onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkClasses('/book')}><Home size={20} /> Book Ride</Link>
                <Link to="/history" onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkClasses('/history')}><Clock size={20} /> History</Link>
              </>
            )}

            <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkClasses('/profile')}><User size={20} /> Profile</Link>

            <div className="h-px bg-gray-200 my-2 w-full"></div>
            
            <button onClick={handleLogout} className="flex items-center gap-3 p-4 rounded-2xl text-[16px] font-bold text-red-600 hover:bg-red-50 text-left w-full transition-colors">
              <LogOut size={20} /> Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
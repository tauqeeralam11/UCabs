import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const MarketingNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (e, target) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate(`/#${target}`);
    } else {
      const el = document.getElementById(target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 inset-x-0 z-[100] transition-all duration-300 transform-gpu ${isScrolled ? 'pt-4 px-4 md:px-8' : 'pt-6 px-4 md:px-8'}`}>
      <div className={`max-w-7xl mx-auto flex justify-between items-center transition-all duration-300 transform-gpu ${isScrolled ? 'bg-white/80 backdrop-blur-xl shadow-[0_2px_20px_rgba(0,0,0,0.06)] border border-gray-200/50 rounded-2xl px-6 py-3' : 'bg-transparent px-2 py-2'}`}>
        <div className="flex items-center gap-10">
          <div className="text-2xl font-black tracking-tighter cursor-pointer flex items-center gap-1" onClick={() => navigate('/')}>
            Ucabs<span className="text-blue-600">.</span>
          </div>
          <div className="hidden lg:flex items-center gap-8 text-[14px] font-semibold text-gray-500">
            <button onClick={(e) => handleNav(e, 'ride')} className="hover:text-black cursor-pointer transition-colors">Ride</button>
            <button onClick={(e) => handleNav(e, 'drive')} className="hover:text-black cursor-pointer transition-colors">Drive</button>
            <button onClick={(e) => handleNav(e, 'safety')} className="hover:text-black cursor-pointer transition-colors">Safety</button>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-6">
          <button onClick={() => navigate('/login')} className="cursor-pointer text-[14px] font-semibold text-gray-600 hover:text-black transition-colors">Sign In</button>
          <button onClick={() => navigate('/register')} className="cursor-pointer bg-[#09090B] text-white text-[14px] font-semibold px-5 py-2.5 rounded-full hover:bg-blue-600 transition-all shadow-[0_4px_15px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.3)] hover:-translate-y-0.5">
            Create Account
          </button>
        </div>
        <button className="lg:hidden text-black" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
};

export default MarketingNavbar;
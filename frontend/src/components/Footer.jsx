import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (e, target) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate(`/#${target}`);
    } else {
      const el = document.getElementById(target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#050505] pt-24 pb-12 px-6 md:px-8 text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
        <div className="col-span-2 lg:col-span-2">
          <h2 className="text-3xl font-black tracking-tighter text-white mb-6 flex items-center gap-1">
            Ucabs<span className="text-blue-600">.</span>
          </h2>
          <p className="text-[15px] font-medium text-gray-400 max-w-sm leading-relaxed">
            Engineering the physical mobility infrastructure of tomorrow, today.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-white text-[14px] mb-6">Product</h4>
          <ul className="space-y-4 text-[14px] font-medium text-gray-400">
            <li><button onClick={(e) => handleNav(e, 'ride')} className="hover:text-white transition-colors">Ride</button></li>
            <li><button onClick={(e) => handleNav(e, 'drive')} className="hover:text-white transition-colors">Drive</button></li>
            <li><button onClick={(e) => handleNav(e, 'safety')} className="hover:text-white transition-colors">Safety</button></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-white text-[14px] mb-6">Company</h4>
          <ul className="space-y-4 text-[14px] font-medium text-gray-400">
            <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-white text-[14px] mb-6">Legal</h4>
          <ul className="space-y-4 text-[14px] font-medium text-gray-400">
            <li><Link to="/terms" className="hover:text-white transition-colors">Terms</Link></li>
            <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto border-t border-white/10 pt-8 flex justify-between items-center">
        <p className="text-[13px] font-medium text-gray-500">© 2026 Ucabs Inc. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
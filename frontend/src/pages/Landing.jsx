import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MarketingNavbar from '../components/MarketingNavbar';
import Footer from '../components/Footer';
import { 
  HeroSection, 
  FleetSection, 
  EngineeredFlowSection, 
  SafetySection, 
  DriverEarningsSection, 
  CTASection 
} from '../components/MarketingSections';

const Landing = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className="bg-[#FCFCFD] min-h-screen font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden text-[#09090B]">
      <MarketingNavbar />
      <HeroSection />
      <FleetSection />
      <EngineeredFlowSection />
      <SafetySection />
      <DriverEarningsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Landing;
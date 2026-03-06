import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import MapComponent from '../components/MapComponent';
import BookingPanel from '../components/BookingPanel';

const Home = () => {
  const [activeRide, setActiveRide] = useState(null);
  const [mapSelectionMode, setMapSelectionMode] = useState(null); 
  const [mapCenterCoords, setMapCenterCoords] = useState(null);
  const [previewRoute, setPreviewRoute] = useState({ pickup: null, dropoff: null });

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden bg-[#E5E7EB] font-sans pt-[72px]">
      
      <div className="relative w-full h-full z-0">
        <MapComponent 
          activeRide={activeRide?.ride || activeRide} 
          selectionMode={mapSelectionMode}
          onCenterChange={(coords) => setMapCenterCoords(coords)}
          previewRoute={previewRoute} 
        />

        {mapSelectionMode && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full z-[1001] pointer-events-none drop-shadow-2xl flex flex-col items-center pb-4">
            <div className="bg-black text-white px-5 py-2.5 rounded-full font-black text-[12px] uppercase tracking-widest mb-2 shadow-xl whitespace-nowrap animate-bounce">
              Set {mapSelectionMode}
            </div>
            <MapPin size={48} className="text-black fill-black" />
            <div className="w-4 h-1 bg-black/30 rounded-full blur-[2px] mt-1 absolute bottom-3"></div>
          </div>
        )}
        <div className="absolute bottom-0 md:top-0 left-0 md:left-8 w-full md:w-[420px] z-[1000] flex flex-col pointer-events-none transition-all duration-300 md:pt-8">
          
          <div className="w-full bg-white md:rounded-[2rem] rounded-t-[2rem] shadow-[0_-20px_40px_rgba(0,0,0,0.1)] md:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.2)] md:border border-gray-100 pointer-events-auto overflow-hidden flex flex-col max-h-[85vh] md:max-h-[calc(100vh-140px)] relative">
            <div className="w-full flex justify-center pt-4 pb-2 md:hidden absolute top-0 left-0 bg-white z-10 rounded-t-[2rem]">
              <div className="w-12 h-1.5 bg-gray-200 rounded-full"></div>
            </div>
            
            <div className="w-full flex-grow overflow-y-auto md:pt-0 pt-6">
              <BookingPanel 
                onRideConfirmed={(data) => setActiveRide(data)} 
                mapSelectionMode={mapSelectionMode}
                setMapSelectionMode={setMapSelectionMode}
                mapCenterCoords={mapCenterCoords}
                onPreviewChange={(pickup, dropoff) => setPreviewRoute({ pickup, dropoff })}
              />
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
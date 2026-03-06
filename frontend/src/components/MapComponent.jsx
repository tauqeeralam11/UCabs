import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { io } from 'socket.io-client';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

const cabIcon = new L.divIcon({
  className: 'premium-cab-marker',
  html: `
    <div style="width: 48px; height: 48px; transition: all 1s linear; filter: drop-shadow(0px 8px 12px rgba(0,0,0,0.4));">
      <img src="https://img.icons8.com/ios-filled/100/000000/car-top-view.png" style="width: 100%; height: 100%; object-fit: contain; transform: rotate(90deg);" alt="car" />
    </div>
  `,
  iconSize: [48, 48], iconAnchor: [24, 24]
});

const userLocationIcon = new L.divIcon({
  className: 'custom-user-location',
  html: `<div class="relative flex h-6 w-6 items-center justify-center"><div class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></div><div class="relative inline-flex rounded-full h-3.5 w-3.5 bg-blue-600 border-2 border-white shadow-md"></div></div>`,
  iconSize: [24, 24], iconAnchor: [12, 12],
});

const pickupMarkerIcon = new L.divIcon({
  className: 'custom-pickup',
  html: `<div class="h-4 w-4 bg-black rounded-full border-2 border-white shadow-md flex items-center justify-center"><div class="h-1 w-1 bg-white rounded-full"></div></div>`,
  iconSize: [16, 16], iconAnchor: [8, 8],
});

const dropoffMarkerIcon = new L.divIcon({
  className: 'custom-dropoff',
  html: `<div class="h-4 w-4 bg-black border-2 border-white shadow-md"></div>`,
  iconSize: [16, 16], iconAnchor: [8, 8],
});

const CameraController = ({ activeRide, previewRoute, userLocation, selectionMode, routeCoordinates }) => {
  const map = useMap();
  useEffect(() => {
    if (selectionMode) return; 
    if (routeCoordinates && routeCoordinates.length > 0) {
      const bounds = L.latLngBounds(routeCoordinates);
      map.fitBounds(bounds, { padding: [50, 50], animate: true, duration: 1 });
    } else if (activeRide) {
      map.setView([activeRide.pickupLocation.coordinates[1], activeRide.pickupLocation.coordinates[0]], 16, { animate: true });
    } else if (previewRoute?.pickup) {
      map.setView([previewRoute.pickup.lat, previewRoute.pickup.lon], 16, { animate: true });
    } else if (userLocation) {
      map.setView(userLocation, 16, { animate: true });
    }
  }, [activeRide, previewRoute, userLocation, selectionMode, routeCoordinates, map]);
  return null;
};

const CenterObserver = ({ onCenterChange, selectionMode }) => {
  const map = useMapEvents({
    moveend() { if (selectionMode && onCenterChange) { const center = map.getCenter(); onCenterChange({ lat: center.lat, lng: center.lng }); } }
  });
  useEffect(() => { if (selectionMode && onCenterChange) { const center = map.getCenter(); onCenterChange({ lat: center.lat, lng: center.lng }); } }, [selectionMode]);
  return null;
};

const MapComponent = ({ activeRide, onCenterChange, selectionMode, previewRoute }) => {
  const [driverLocation, setDriverLocation] = useState(null);
  const [userLocation, setUserLocation] = useState([28.4744, 77.5040]); 
  const [socket, setSocket] = useState(null);
  
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [startGap, setStartGap] = useState([]);
  const [endGap, setEndGap] = useState([]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => setUserLocation([position.coords.latitude, position.coords.longitude]),
        (error) => console.error("Location error:", error), { enableHighAccuracy: true }
      );
    }
  }, []);

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    if (socket && activeRide) {
      socket.emit('joinRideRoom', activeRide._id);
      socket.on('receiveDriverLocation', (newLocation) => setDriverLocation(newLocation));
    }
  }, [socket, activeRide]);

  useEffect(() => {
    const fetchRoute = async () => {
      let start, end, exactStartLatLng, exactEndLatLng;

      if (activeRide && activeRide.pickupLocation && activeRide.dropoffLocation) {
        start = `${activeRide.pickupLocation.coordinates[0]},${activeRide.pickupLocation.coordinates[1]}`;
        end = `${activeRide.dropoffLocation.coordinates[0]},${activeRide.dropoffLocation.coordinates[1]}`;
        exactStartLatLng = [activeRide.pickupLocation.coordinates[1], activeRide.pickupLocation.coordinates[0]];
        exactEndLatLng = [activeRide.dropoffLocation.coordinates[1], activeRide.dropoffLocation.coordinates[0]];
      } else if (previewRoute?.pickup && previewRoute?.dropoff) {
        start = `${previewRoute.pickup.lon},${previewRoute.pickup.lat}`;
        end = `${previewRoute.dropoff.lon},${previewRoute.dropoff.lat}`;
        exactStartLatLng = [parseFloat(previewRoute.pickup.lat), parseFloat(previewRoute.pickup.lon)];
        exactEndLatLng = [parseFloat(previewRoute.dropoff.lat), parseFloat(previewRoute.dropoff.lon)];
      }

      if (start && end) {
        try {
          const res = await axios.get(`https://router.project-osrm.org/route/v1/driving/${start};${end}?overview=full&geometries=geojson`);
          if (res.data.routes && res.data.routes[0]) {
            const osrmCoords = res.data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
            setRouteCoordinates(osrmCoords);
            setStartGap([exactStartLatLng, osrmCoords[0]]);
            setEndGap([osrmCoords[osrmCoords.length - 1], exactEndLatLng]);
          }
        } catch (error) {}
      } else {
        setRouteCoordinates([]);
        setStartGap([]);
        setEndGap([]);
      }
    };
    fetchRoute();
  }, [activeRide, previewRoute]);

  return (
    <MapContainer center={userLocation} zoom={16} zoomControl={false} style={{ height: '100%', width: '100%', zIndex: 0 }} className={selectionMode ? "cursor-grab active:cursor-grabbing" : ""}>
      <TileLayer url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}" attribution='&copy; Google Maps' maxZoom={20} />
      <CenterObserver onCenterChange={onCenterChange} selectionMode={selectionMode} />
      <CameraController activeRide={activeRide} previewRoute={previewRoute} userLocation={userLocation} selectionMode={selectionMode} routeCoordinates={routeCoordinates} />
      
      {routeCoordinates.length > 0 && <Polyline positions={routeCoordinates} color="#111" weight={5} opacity={0.8} />}
      
      {startGap.length > 0 && <Polyline positions={startGap} color="#111" weight={4} dashArray="5, 7" opacity={0.5} />}
      {endGap.length > 0 && <Polyline positions={endGap} color="#111" weight={4} dashArray="5, 7" opacity={0.5} />}

      {!activeRide && !previewRoute?.pickup && <Marker position={userLocation} icon={userLocationIcon} />}
      {!activeRide && previewRoute?.pickup && <Marker position={[previewRoute.pickup.lat, previewRoute.pickup.lon]} icon={pickupMarkerIcon} />}
      {!activeRide && previewRoute?.dropoff && <Marker position={[previewRoute.dropoff.lat, previewRoute.dropoff.lon]} icon={dropoffMarkerIcon} />}
      {activeRide && <Marker position={[activeRide.pickupLocation.coordinates[1], activeRide.pickupLocation.coordinates[0]]} icon={pickupMarkerIcon} />}
      {activeRide && <Marker position={[activeRide.dropoffLocation.coordinates[1], activeRide.dropoffLocation.coordinates[0]]} icon={dropoffMarkerIcon} />}
      {driverLocation && <Marker position={driverLocation} icon={cabIcon} />}
    </MapContainer>
  );
};

export default MapComponent;
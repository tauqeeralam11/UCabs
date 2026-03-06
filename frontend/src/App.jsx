import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DriverDashboard from './pages/DriverDashboard';
import RideHistory from './pages/RideHistory';
import Profile from './pages/Profile';
import DriverWallet from './pages/DriverWallet';
import AdminDashboard from './pages/AdminDashboard';
import Ride from './pages/Ride';
import Drive from './pages/Drive';
import Safety from './pages/Safety';
import About from './pages/About';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';

const AppContent = () => {
  const location = useLocation();
  
  const hideNavbarRoutes = [
    '/', 
    '/login', 
    '/register',
    '/ride',
    '/drive-partner',
    '/safety',
    '/about',
    '/contact',
    '/blog',
    '/terms',
    '/privacy'
  ];
  
  const showNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="App flex flex-col min-h-screen">
      {showNavbar && <Navbar />}
      
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/book" element={<Home />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/drive" element={<DriverDashboard />} />
        <Route path="/history" element={<RideHistory />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/wallet" element={<DriverWallet />} />
        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="/ride" element={<Ride />} />
        <Route path="/drive-partner" element={<Drive />} />
        <Route path="/safety" element={<Safety />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
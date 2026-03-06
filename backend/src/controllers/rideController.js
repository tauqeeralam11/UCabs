const Ride = require('../models/Ride');
const Driver = require('../models/Driver');

const calculateDistance = (lon1, lat1, lon2, lat2) => {
  const R = 6371; const dLat = (lat2 - lat1) * Math.PI / 180; const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
};

const bookRide = async (req, res) => {
  try {
    const { pickupLocation, dropoffLocation, category, paymentMethod } = req.body;
    const distance = calculateDistance(pickupLocation.coordinates[0], pickupLocation.coordinates[1], dropoffLocation.coordinates[0], dropoffLocation.coordinates[1]);
    
    const multipliers = { 'Mini': 1.0, 'Sedan': 1.5, 'SUV': 2.0 };
    const fare = Math.round((50 + (distance * 12)) * multipliers[category]);
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    const ride = await Ride.create({
      user: req.user._id, 
      driver: null, 
      pickupLocation, 
      dropoffLocation,
      category,
      fare, 
      distance: Math.round(distance * 10) / 10, 
      status: 'pending', 
      otp, 
      paymentMethod
    });

    res.status(201).json({ message: 'Ride broadcasted to nearby drivers', ride });
  } catch (error) { 
    res.status(500).json({ message: 'Error booking ride', error: error.message }); 
  }
};

const startRide = async (req, res) => {
  try {
    const { otp } = req.body;
    const ride = await Ride.findById(req.params.id);
    
    if (!ride) return res.status(404).json({ message: 'Ride not found' });
    if (ride.otp !== otp) return res.status(400).json({ message: 'Invalid OTP.' });
    
    ride.status = 'ongoing';
    await ride.save();
    
    const updatedRide = await Ride.findById(ride._id).populate('driver', 'name phone vehicle').populate('user', 'name phone');
    res.json(updatedRide);
  } catch (error) { 
    res.status(500).json({ message: 'Error starting ride' }); 
  }
};

const updateRideStatus = async (req, res) => {
  try {
    const { status, cancelReason, paymentMethod } = req.body; 

    if (status === 'accepted') {
       const ride = await Ride.findOneAndUpdate(
         { _id: req.params.id, status: 'pending', driver: null },
         { status: 'accepted', driver: req.user._id },
         { new: true }
       ).populate('user', 'name phone');

       if (!ride) return res.status(400).json({ message: 'Ride already accepted by another driver.' });

       await Driver.findByIdAndUpdate(req.user._id, { isAvailable: false });
       return res.json(ride);
    }

    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: 'Ride not found' });

    ride.status = status;
    if (cancelReason) ride.cancelReason = cancelReason;
    
    if (paymentMethod) {
        ride.paymentMethod = paymentMethod; 
    }
    
    await ride.save();

    const updatedRide = await Ride.findById(ride._id).populate('driver', 'name phone vehicle').populate('user', 'name phone');

    if (status === 'completed' || status === 'cancelled') {
      const driver = await Driver.findById(ride.driver);
      if (driver) { 
        driver.isAvailable = true; 
        await driver.save(); 
      }
    }
    
    res.json(updatedRide);
  } catch (error) { 
    res.status(500).json({ message: 'Error updating ride status' }); 
  }
};

const getUserRides = async (req, res) => {
  try {
    if (req.user.role === 'driver') {
      const driver = await Driver.findById(req.user._id);
      const myRides = await Ride.find({ driver: req.user._id }).sort({ createdAt: -1 }).populate('user', 'name phone');
      
      let pendingRides = [];
      
      if (driver && driver.isAvailable && driver.verificationStatus === 'approved') {
         pendingRides = await Ride.find({ 
             status: 'pending', 
             driver: null,
             category: driver.vehicle.type 
         }).populate('user', 'name phone');
      }
      
      return res.json([...pendingRides, ...myRides]);
      
    } else {
      const rides = await Ride.find({ user: req.user._id }).sort({ createdAt: -1 }).populate('driver', 'name phone vehicle');
      res.json(rides);
    }
  } catch (error) { 
    console.error(error);
    res.status(500).json({ message: 'Error fetching history' }); 
  }
};

module.exports = { bookRide, getUserRides, startRide, updateRideStatus };
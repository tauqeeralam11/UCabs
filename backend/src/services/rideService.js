const Driver = require('../models/Driver');
const Vehicle = require('../models/Vehicle');

const calculateFare = (distanceInKm, category) => {
  const baseFare = 50;
  const perKmRate = 12;

  const multipliers = {
    'Mini': 1.0,
    'Sedan': 1.5,
    'SUV': 2.0,
    'Luxury': 3.5
  };

  const multiplier = multipliers[category] || 1.0;
  const totalFare = (baseFare + (distanceInKm * perKmRate)) * multiplier;

  return Math.round(totalFare);
};

const findNearbyDriver = async (pickupCoordinates, category) => {
  const maxDistanceInMeters = 5000;

  const matchingVehicles = await Vehicle.find({ category }).select('_id');
  const vehicleIds = matchingVehicles.map(v => v._id);

  const nearbyDriver = await Driver.findOne({
    isAvailable: true,
    vehicle: { $in: vehicleIds },
    currentLocation: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: pickupCoordinates
        },
        $maxDistance: maxDistanceInMeters
      }
    }
  }).populate('vehicle');

  return nearbyDriver; 
};

module.exports = { calculateFare, findNearbyDriver };
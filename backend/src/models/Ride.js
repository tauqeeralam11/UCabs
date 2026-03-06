const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  pickupLocation: {
    address: { type: String, required: true },
    coordinates: { type: [Number], required: true }
  },
  dropoffLocation: {
    address: { type: String, required: true },
    coordinates: { type: [Number], required: true }
  },
  category: { type: String, required: true },
  fare: { type: Number, required: true },
  distance: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'arrived', 'ongoing', 'payment_pending', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  otp: { type: String, required: true }, 
  
  cancelReason: { type: String },

  paymentMethod: {
    type: String,
    enum: ['Cash', 'UPI', 'Online'],
    default: 'Cash'
  },
  
  rating: { userRating: Number, driverRating: Number }
}, { timestamps: true });

module.exports = mongoose.model('Ride', rideSchema);
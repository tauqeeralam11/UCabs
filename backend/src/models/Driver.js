const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, default: 'driver' },
  
  isAvailable: { type: Boolean, default: false },
  
  vehicle: {
    type: { type: String, enum: ['Mini', 'Sedan', 'SUV'], required: true }, 
    plateNumber: { type: String, default: '' },
    model: { type: String, default: '' }
  },
  
  verificationStatus: { 
    type: String, 
    enum: ['pending', 'auto_verified', 'approved', 'rejected'], 
    default: 'pending' 
  },
  documents: {
    aadhaarNumber: { type: String, default: '' },
    licenseNumber: { type: String, default: '' },
    rcBookNumber: { type: String, default: '' }
  },
  documentImages: {
    aadhaarUrl: { type: String, default: '' },
    licenseUrl: { type: String, default: '' },
    rcBookUrl: { type: String, default: '' }
  },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  }
}, { timestamps: true });

driverSchema.index({ location: '2dsphere' });
module.exports = mongoose.model('Driver', driverSchema);
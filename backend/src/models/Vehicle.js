const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    plateNumber: { type: String, required: true, unique: true, uppercase: true },
    model: { type: String, required: true },
    color: { type: String, required: true },
    category: { 
      type: String, 
      enum: ['Mini', 'Sedan', 'SUV', 'Luxury'], 
      required: true 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vehicle', vehicleSchema);
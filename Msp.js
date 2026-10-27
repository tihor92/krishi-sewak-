const mongoose = require('mongoose');

// Minimum Support Price per crop, in INR per quintal (100 kg)
const mspSchema = new mongoose.Schema(
  {
    crop: { type: String, required: true, unique: true, trim: true }, // e.g. "Wheat"
    season: { type: String, enum: ['kharif', 'rabi', 'other'], default: 'other' },
    pricePerQuintal: { type: Number, required: true, min: 0 },
    marketingYear: { type: String, required: true }, // e.g. "2026-27"
  },
  { timestamps: true }
);

module.exports = mongoose.model('Msp', mspSchema);

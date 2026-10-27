const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema(
  {
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true, index: true },
    variety: { type: String, trim: true },
    description: { type: String, trim: true, maxlength: 2000 },
    category: {
      type: String,
      enum: ['cereal', 'pulse', 'oilseed', 'vegetable', 'fruit', 'spice', 'other'],
      default: 'other',
    },
    images: [String],

    quantityQuintals: { type: Number, required: true, min: 0 }, // available stock
    pricePerQuintal: { type: Number, required: true, min: 0 }, // farmer's asking price
    mspAtListing: { type: Number, default: null }, // MSP snapshot when listed (null if crop has no MSP)
    minOrderQuintals: { type: Number, default: 1, min: 0.1 },

    qualityGrade: { type: String, enum: ['A', 'B', 'C', 'ungraded'], default: 'ungraded' },
    qualityStatus: { type: String, enum: ['pending', 'certified', 'rejected'], default: 'pending' },
    qualityNote: String,

    harvestDate: Date,
    location: { village: String, district: String, state: String, pincode: String },
    status: { type: String, enum: ['active', 'sold_out', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

cropSchema.index({ name: 'text', variety: 'text', description: 'text' });

module.exports = mongoose.model('Crop', cropSchema);

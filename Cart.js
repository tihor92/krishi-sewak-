const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [
      {
        crop: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop', required: true },
        quantityQuintals: { type: Number, required: true, min: 0.1 },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Cart', cartSchema);

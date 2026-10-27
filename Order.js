const mongoose = require('mongoose');

const STATUSES = ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const orderSchema = new mongoose.Schema(
  {
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    // Price and crop details are copied at order time so later edits don't change history
    items: [
      {
        crop: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop', required: true },
        name: String,
        quantityQuintals: Number,
        pricePerQuintal: Number,
        lineTotal: Number,
      },
    ],
    totalAmount: { type: Number, required: true },
    shippingAddress: {
      line1: { type: String, required: true },
      village: String,
      district: String,
      state: { type: String, required: true },
      pincode: { type: String, required: true, match: /^\d{6}$/ },
    },
    paymentMethod: { type: String, enum: ['cod', 'online'], default: 'cod' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
    status: { type: String, enum: STATUSES, default: 'placed', index: true },
    statusHistory: [{ status: String, at: { type: Date, default: Date.now }, by: mongoose.Schema.Types.ObjectId }],
  },
  { timestamps: true }
);

orderSchema.statics.STATUSES = STATUSES;

module.exports = mongoose.model('Order', orderSchema);

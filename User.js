const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    password: { type: String, required: true, minlength: 8, select: false },
    role: { type: String, enum: ['farmer', 'buyer', 'admin'], required: true },
    isActive: { type: Boolean, default: true },

    // Farmer-specific
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    verificationNote: String,
    farmName: String,
    aadhaarLast4: { type: String, match: /^\d{4}$/ }, // store only last 4 digits, never the full number
    landAreaAcres: Number,

    // Buyer-specific
    businessName: String,
    gstin: String,

    address: {
      line1: String,
      village: String,
      district: String,
      state: String,
      pincode: { type: String, match: /^\d{6}$/ },
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('User', userSchema);

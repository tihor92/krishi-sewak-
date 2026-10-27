const router = require('express').Router();
const { z } = require('zod');
const User = require('../models/User');
const { asyncHandler, ApiError } = require('../middleware/error');
const { protect, signToken } = require('../middleware/auth');

const addressSchema = z
  .object({
    line1: z.string().optional(),
    village: z.string().optional(),
    district: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().regex(/^\d{6}$/, 'pincode must be 6 digits').optional(),
  })
  .optional();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number').optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['farmer', 'buyer']), // admin accounts are created via seed only
  farmName: z.string().optional(),
  aadhaarLast4: z.string().regex(/^\d{4}$/).optional(),
  landAreaAcres: z.number().positive().optional(),
  businessName: z.string().optional(),
  gstin: z.string().optional(),
  address: addressSchema,
});

router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const data = registerSchema.parse(req.body);
    if (await User.exists({ email: data.email.toLowerCase() })) {
      throw new ApiError(409, 'An account with this email already exists');
    }
    const user = await User.create({
      ...data,
      verificationStatus: data.role === 'farmer' ? 'pending' : 'verified',
    });
    res.status(201).json({ success: true, token: signToken(user), user });
  })
);

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = z.object({ email: z.string().email(), password: z.string().min(1) }).parse(req.body);
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.matchPassword(password))) throw new ApiError(401, 'Invalid email or password');
    if (!user.isActive) throw new ApiError(403, 'This account has been disabled');
    res.json({ success: true, token: signToken(user), user });
  })
);

router.get('/me', protect, (req, res) => res.json({ success: true, user: req.user }));

router.patch(
  '/me',
  protect,
  asyncHandler(async (req, res) => {
    const data = z
      .object({
        name: z.string().min(2).optional(),
        phone: z.string().regex(/^[6-9]\d{9}$/).optional(),
        farmName: z.string().optional(),
        landAreaAcres: z.number().positive().optional(),
        businessName: z.string().optional(),
        gstin: z.string().optional(),
        address: addressSchema,
      })
      .parse(req.body);
    Object.assign(req.user, data);
    await req.user.save();
    res.json({ success: true, user: req.user });
  })
);

router.post(
  '/change-password',
  protect,
  asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = z
      .object({ currentPassword: z.string(), newPassword: z.string().min(8) })
      .parse(req.body);
    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.matchPassword(currentPassword))) throw new ApiError(400, 'Current password is incorrect');
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password updated' });
  })
);

module.exports = router;

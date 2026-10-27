const router = require('express').Router();
const { z } = require('zod');
const User = require('../models/User');
const Crop = require('../models/Crop');
const Order = require('../models/Order');
const { asyncHandler, ApiError } = require('../middleware/error');
const { protect, requireRole } = require('../middleware/auth');

router.use(protect, requireRole('admin'));

router.get(
  '/stats',
  asyncHandler(async (req, res) => {
    const [farmers, buyers, pendingFarmers, crops, pendingCrops, orders, revenue] = await Promise.all([
      User.countDocuments({ role: 'farmer' }),
      User.countDocuments({ role: 'buyer' }),
      User.countDocuments({ role: 'farmer', verificationStatus: 'pending' }),
      Crop.countDocuments(),
      Crop.countDocuments({ qualityStatus: 'pending' }),
      Order.countDocuments(),
      Order.aggregate([{ $match: { status: { $ne: 'cancelled' } } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
    ]);
    res.json({ success: true, stats: { farmers, buyers, pendingFarmers, crops, pendingCrops, orders, revenue: revenue[0]?.total || 0 } });
  })
);

// Users
router.get(
  '/users',
  asyncHandler(async (req, res) => {
    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    if (req.query.verificationStatus) filter.verificationStatus = req.query.verificationStatus;
    const users = await User.find(filter).sort({ createdAt: -1 }).limit(200);
    res.json({ success: true, count: users.length, users });
  })
);

router.patch(
  '/farmers/:id/verify',
  asyncHandler(async (req, res) => {
    const { status, note } = z.object({ status: z.enum(['verified', 'rejected']), note: z.string().optional() }).parse(req.body);
    const farmer = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'farmer' },
      { verificationStatus: status, verificationNote: note },
      { new: true }
    );
    if (!farmer) throw new ApiError(404, 'Farmer not found');
    res.json({ success: true, farmer });
  })
);

router.patch(
  '/users/:id/active',
  asyncHandler(async (req, res) => {
    const { isActive } = z.object({ isActive: z.boolean() }).parse(req.body);
    if (String(req.user._id) === req.params.id) throw new ApiError(400, 'You cannot disable your own account');
    const user = await User.findByIdAndUpdate(req.params.id, { isActive }, { new: true });
    if (!user) throw new ApiError(404, 'User not found');
    res.json({ success: true, user });
  })
);

// Crop quality certification
router.get(
  '/crops',
  asyncHandler(async (req, res) => {
    const filter = {};
    if (req.query.qualityStatus) filter.qualityStatus = req.query.qualityStatus;
    const crops = await Crop.find(filter).sort({ createdAt: -1 }).limit(200).populate('farmer', 'name farmName verificationStatus');
    res.json({ success: true, count: crops.length, crops });
  })
);

router.patch(
  '/crops/:id/quality',
  asyncHandler(async (req, res) => {
    const { qualityStatus, qualityGrade, qualityNote } = z
      .object({
        qualityStatus: z.enum(['certified', 'rejected']),
        qualityGrade: z.enum(['A', 'B', 'C']).optional(),
        qualityNote: z.string().optional(),
      })
      .parse(req.body);
    if (qualityStatus === 'certified' && !qualityGrade) throw new ApiError(400, 'qualityGrade is required when certifying a crop');
    const crop = await Crop.findByIdAndUpdate(
      req.params.id,
      { qualityStatus, qualityGrade: qualityGrade || 'ungraded', qualityNote },
      { new: true }
    );
    if (!crop) throw new ApiError(404, 'Crop not found');
    res.json({ success: true, crop });
  })
);

module.exports = router;

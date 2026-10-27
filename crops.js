const router = require('express').Router();
const { z } = require('zod');
const Crop = require('../models/Crop');
const Msp = require('../models/Msp');
const { asyncHandler, ApiError } = require('../middleware/error');
const { protect, requireRole, requireVerifiedFarmer } = require('../middleware/auth');
const { escapeRegex } = require('./msp');

const cropBody = z.object({
  name: z.string().min(2),
  variety: z.string().optional(),
  description: z.string().max(2000).optional(),
  category: z.enum(['cereal', 'pulse', 'oilseed', 'vegetable', 'fruit', 'spice', 'other']).optional(),
  images: z.array(z.string().url()).max(6).optional(),
  quantityQuintals: z.number().min(0),
  pricePerQuintal: z.number().min(0),
  minOrderQuintals: z.number().min(0.1).optional(),
  harvestDate: z.coerce.date().optional(),
  location: z
    .object({ village: z.string().optional(), district: z.string().optional(), state: z.string().optional(), pincode: z.string().optional() })
    .optional(),
});

async function findMsp(cropName) {
  return Msp.findOne({ crop: new RegExp(`^${escapeRegex(cropName.trim())}$`, 'i') });
}

// Public: browse certified, active crops
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const q = z
      .object({
        search: z.string().optional(),
        category: z.string().optional(),
        state: z.string().optional(),
        district: z.string().optional(),
        minPrice: z.coerce.number().optional(),
        maxPrice: z.coerce.number().optional(),
        sort: z.enum(['price_asc', 'price_desc', 'newest']).default('newest'),
        page: z.coerce.number().int().min(1).default(1),
        limit: z.coerce.number().int().min(1).max(50).default(12),
      })
      .parse(req.query);

    const filter = { status: 'active', qualityStatus: 'certified', quantityQuintals: { $gt: 0 } };
    if (q.search) filter.$text = { $search: q.search };
    if (q.category) filter.category = q.category;
    if (q.state) filter['location.state'] = new RegExp(`^${escapeRegex(q.state)}$`, 'i');
    if (q.district) filter['location.district'] = new RegExp(`^${escapeRegex(q.district)}$`, 'i');
    if (q.minPrice != null || q.maxPrice != null) {
      filter.pricePerQuintal = {};
      if (q.minPrice != null) filter.pricePerQuintal.$gte = q.minPrice;
      if (q.maxPrice != null) filter.pricePerQuintal.$lte = q.maxPrice;
    }
    const sort = { price_asc: { pricePerQuintal: 1 }, price_desc: { pricePerQuintal: -1 }, newest: { createdAt: -1 } }[q.sort];

    const [crops, total] = await Promise.all([
      Crop.find(filter)
        .sort(sort)
        .skip((q.page - 1) * q.limit)
        .limit(q.limit)
        .populate('farmer', 'name farmName verificationStatus address.district address.state'),
      Crop.countDocuments(filter),
    ]);
    res.json({ success: true, total, page: q.page, pages: Math.ceil(total / q.limit), crops });
  })
);

// Farmer: own listings (all statuses)
router.get(
  '/mine',
  protect,
  requireRole('farmer'),
  asyncHandler(async (req, res) => {
    const crops = await Crop.find({ farmer: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, crops });
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const crop = await Crop.findById(req.params.id).populate('farmer', 'name farmName verificationStatus address.district address.state');
    if (!crop) throw new ApiError(404, 'Crop not found');
    // Uncertified listings are visible only to their owner or an admin
    if (crop.qualityStatus !== 'certified') {
      const jwt = require('jsonwebtoken');
      const token = (req.headers.authorization || '').replace('Bearer ', '');
      let ok = false;
      try {
        const p = jwt.verify(token, process.env.JWT_SECRET);
        ok = p.role === 'admin' || String(p.id) === String(crop.farmer._id);
      } catch {
        ok = false;
      }
      if (!ok) throw new ApiError(404, 'Crop not found');
    }
    res.json({ success: true, crop });
  })
);

// Farmer: create listing. Price must be at or above the MSP (when one exists).
router.post(
  '/',
  protect,
  requireVerifiedFarmer,
  asyncHandler(async (req, res) => {
    const data = cropBody.parse(req.body);
    const msp = await findMsp(data.name);
    if (msp && data.pricePerQuintal < msp.pricePerQuintal) {
      throw new ApiError(
        400,
        `Price ₹${data.pricePerQuintal}/quintal is below the MSP of ₹${msp.pricePerQuintal}/quintal for ${msp.crop} (${msp.marketingYear})`
      );
    }
    const crop = await Crop.create({
      ...data,
      farmer: req.user._id,
      mspAtListing: msp ? msp.pricePerQuintal : null,
      location: data.location || {
        village: req.user.address?.village,
        district: req.user.address?.district,
        state: req.user.address?.state,
        pincode: req.user.address?.pincode,
      },
    });
    res.status(201).json({
      success: true,
      crop,
      message: 'Listing created. It will appear in the marketplace once quality is certified.',
    });
  })
);

router.patch(
  '/:id',
  protect,
  requireVerifiedFarmer,
  asyncHandler(async (req, res) => {
    const crop = await Crop.findOne({ _id: req.params.id, farmer: req.user._id });
    if (!crop) throw new ApiError(404, 'Crop not found');
    const data = cropBody.partial().extend({ status: z.enum(['active', 'inactive']).optional() }).parse(req.body);

    const newName = data.name ?? crop.name;
    const newPrice = data.pricePerQuintal ?? crop.pricePerQuintal;
    if (data.name !== undefined || data.pricePerQuintal !== undefined) {
      const msp = await findMsp(newName);
      if (msp && newPrice < msp.pricePerQuintal) {
        throw new ApiError(400, `Price is below the MSP of ₹${msp.pricePerQuintal}/quintal for ${msp.crop}`);
      }
      crop.mspAtListing = msp ? msp.pricePerQuintal : null;
    }
    Object.assign(crop, data);
    // Changing the crop itself requires fresh quality certification
    if (data.name !== undefined || data.variety !== undefined) crop.qualityStatus = 'pending';
    if (crop.quantityQuintals > 0 && crop.status === 'sold_out') crop.status = 'active';
    await crop.save();
    res.json({ success: true, crop });
  })
);

router.delete(
  '/:id',
  protect,
  requireRole('farmer', 'admin'),
  asyncHandler(async (req, res) => {
    const filter = req.user.role === 'admin' ? { _id: req.params.id } : { _id: req.params.id, farmer: req.user._id };
    const crop = await Crop.findOneAndDelete(filter);
    if (!crop) throw new ApiError(404, 'Crop not found');
    res.json({ success: true });
  })
);

module.exports = router;

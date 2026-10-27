const router = require('express').Router();
const { z } = require('zod');
const Msp = require('../models/Msp');
const { asyncHandler, ApiError } = require('../middleware/error');
const { protect, requireRole } = require('../middleware/auth');

// Public: list all MSP rates
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const rates = await Msp.find().sort({ crop: 1 });
    res.json({ success: true, count: rates.length, rates });
  })
);

// Public: check a price against MSP. GET /api/msp/check?crop=Wheat&price=2500
router.get(
  '/check',
  asyncHandler(async (req, res) => {
    const { crop, price } = z.object({ crop: z.string().min(1), price: z.coerce.number().min(0) }).parse(req.query);
    const msp = await Msp.findOne({ crop: new RegExp(`^${escapeRegex(crop)}$`, 'i') });
    if (!msp) return res.json({ success: true, hasMsp: false, message: 'No MSP is defined for this crop' });
    res.json({
      success: true,
      hasMsp: true,
      mspPerQuintal: msp.pricePerQuintal,
      marketingYear: msp.marketingYear,
      acceptable: price >= msp.pricePerQuintal,
    });
  })
);

// Admin: create or update an MSP rate
router.put(
  '/',
  protect,
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    const data = z
      .object({
        crop: z.string().min(1),
        season: z.enum(['kharif', 'rabi', 'other']).default('other'),
        pricePerQuintal: z.number().min(0),
        marketingYear: z.string().min(4),
      })
      .parse(req.body);
    const rate = await Msp.findOneAndUpdate(
      { crop: new RegExp(`^${escapeRegex(data.crop)}$`, 'i') },
      data,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json({ success: true, rate });
  })
);

router.delete(
  '/:id',
  protect,
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    const rate = await Msp.findByIdAndDelete(req.params.id);
    if (!rate) throw new ApiError(404, 'MSP rate not found');
    res.json({ success: true });
  })
);

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = router;
module.exports.escapeRegex = escapeRegex;

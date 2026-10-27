const router = require('express').Router();
const { z } = require('zod');
const Cart = require('../models/Cart');
const Crop = require('../models/Crop');
const { asyncHandler, ApiError } = require('../middleware/error');
const { protect, requireRole } = require('../middleware/auth');

router.use(protect, requireRole('buyer'));

async function loadCart(buyerId) {
  const cart = await Cart.findOneAndUpdate({ buyer: buyerId }, { $setOnInsert: { buyer: buyerId, items: [] } }, { upsert: true, new: true })
    .populate('items.crop', 'name variety pricePerQuintal quantityQuintals minOrderQuintals status qualityStatus farmer images');
  const items = cart.items
    .filter((i) => i.crop)
    .map((i) => ({
      crop: i.crop,
      quantityQuintals: i.quantityQuintals,
      lineTotal: i.quantityQuintals * i.crop.pricePerQuintal,
    }));
  return { _id: cart._id, items, totalAmount: items.reduce((s, i) => s + i.lineTotal, 0) };
}

router.get('/', asyncHandler(async (req, res) => res.json({ success: true, cart: await loadCart(req.user._id) })));

router.post(
  '/items',
  asyncHandler(async (req, res) => {
    const { cropId, quantityQuintals } = z.object({ cropId: z.string(), quantityQuintals: z.number().min(0.1) }).parse(req.body);
    const crop = await Crop.findById(cropId);
    if (!crop || crop.status !== 'active' || crop.qualityStatus !== 'certified') throw new ApiError(404, 'Crop is not available');
    if (quantityQuintals < crop.minOrderQuintals) throw new ApiError(400, `Minimum order is ${crop.minOrderQuintals} quintal(s)`);
    if (quantityQuintals > crop.quantityQuintals) throw new ApiError(400, `Only ${crop.quantityQuintals} quintal(s) available`);

    const cart = (await Cart.findOne({ buyer: req.user._id })) || new Cart({ buyer: req.user._id, items: [] });
    const existing = cart.items.find((i) => String(i.crop) === cropId);
    if (existing) existing.quantityQuintals = quantityQuintals;
    else cart.items.push({ crop: cropId, quantityQuintals });
    await cart.save();
    res.json({ success: true, cart: await loadCart(req.user._id) });
  })
);

router.delete(
  '/items/:cropId',
  asyncHandler(async (req, res) => {
    await Cart.updateOne({ buyer: req.user._id }, { $pull: { items: { crop: req.params.cropId } } });
    res.json({ success: true, cart: await loadCart(req.user._id) });
  })
);

router.delete(
  '/',
  asyncHandler(async (req, res) => {
    await Cart.updateOne({ buyer: req.user._id }, { $set: { items: [] } });
    res.json({ success: true, cart: await loadCart(req.user._id) });
  })
);

module.exports = router;

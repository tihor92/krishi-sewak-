const router = require('express').Router();
const { z } = require('zod');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Crop = require('../models/Crop');
const { asyncHandler, ApiError } = require('../middleware/error');
const { protect, requireRole } = require('../middleware/auth');

router.use(protect);

const checkoutSchema = z.object({
  shippingAddress: z.object({
    line1: z.string().min(3),
    village: z.string().optional(),
    district: z.string().optional(),
    state: z.string().min(2),
    pincode: z.string().regex(/^\d{6}$/, 'pincode must be 6 digits'),
  }),
  paymentMethod: z.enum(['cod', 'online']).default('cod'),
});

// Buyer: convert the cart into orders (one order per farmer).
// Stock is reserved with atomic conditional updates; anything already reserved is rolled back on failure.
router.post(
  '/',
  requireRole('buyer'),
  asyncHandler(async (req, res) => {
    const { shippingAddress, paymentMethod } = checkoutSchema.parse(req.body);
    const cart = await Cart.findOne({ buyer: req.user._id });
    if (!cart || cart.items.length === 0) throw new ApiError(400, 'Your cart is empty');

    const reserved = [];
    const rollback = () => Promise.all(reserved.map((r) => Crop.updateOne({ _id: r.cropId }, { $inc: { quantityQuintals: r.qty } })));

    try {
      const byFarmer = new Map();
      for (const item of cart.items) {
        const crop = await Crop.findById(item.crop);
        if (!crop || crop.status !== 'active' || crop.qualityStatus !== 'certified') {
          throw new ApiError(400, `${crop ? crop.name : 'A crop in your cart'} is no longer available`);
        }
        if (item.quantityQuintals < crop.minOrderQuintals) {
          throw new ApiError(400, `Minimum order for ${crop.name} is ${crop.minOrderQuintals} quintal(s)`);
        }
        const updated = await Crop.findOneAndUpdate(
          { _id: crop._id, quantityQuintals: { $gte: item.quantityQuintals } },
          { $inc: { quantityQuintals: -item.quantityQuintals } },
          { new: true }
        );
        if (!updated) throw new ApiError(409, `Not enough stock for ${crop.name}`);
        reserved.push({ cropId: crop._id, qty: item.quantityQuintals });
        if (updated.quantityQuintals === 0) await Crop.updateOne({ _id: crop._id }, { status: 'sold_out' });

        const key = String(crop.farmer);
        if (!byFarmer.has(key)) byFarmer.set(key, []);
        byFarmer.get(key).push({
          crop: crop._id,
          name: crop.name,
          quantityQuintals: item.quantityQuintals,
          pricePerQuintal: crop.pricePerQuintal,
          lineTotal: item.quantityQuintals * crop.pricePerQuintal,
        });
      }

      const orders = [];
      for (const [farmerId, items] of byFarmer) {
        orders.push(
          await Order.create({
            buyer: req.user._id,
            farmer: farmerId,
            items,
            totalAmount: items.reduce((s, i) => s + i.lineTotal, 0),
            shippingAddress,
            paymentMethod,
            statusHistory: [{ status: 'placed', by: req.user._id }],
          })
        );
      }
      cart.items = [];
      await cart.save();
      res.status(201).json({ success: true, orders });
    } catch (err) {
      await rollback();
      throw err;
    }
  })
);

// Buyer sees their orders, farmer sees orders for their crops, admin sees all
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const filter = req.user.role === 'buyer' ? { buyer: req.user._id } : req.user.role === 'farmer' ? { farmer: req.user._id } : {};
    if (req.query.status) filter.status = req.query.status;
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .populate('buyer', 'name phone businessName')
      .populate('farmer', 'name phone farmName');
    res.json({ success: true, count: orders.length, orders });
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('buyer', 'name phone businessName').populate('farmer', 'name phone farmName');
    if (!order) throw new ApiError(404, 'Order not found');
    const mine = [order.buyer._id, order.farmer._id].some((id) => String(id) === String(req.user._id));
    if (!mine && req.user.role !== 'admin') throw new ApiError(404, 'Order not found');
    res.json({ success: true, order });
  })
);

// Allowed status moves per role
const FARMER_FLOW = { placed: ['confirmed', 'cancelled'], confirmed: ['shipped', 'cancelled'], shipped: ['delivered'] };

router.patch(
  '/:id/status',
  asyncHandler(async (req, res) => {
    const { status } = z.object({ status: z.enum(Order.STATUSES) }).parse(req.body);
    const order = await Order.findById(req.params.id);
    if (!order) throw new ApiError(404, 'Order not found');

    const isFarmer = req.user.role === 'farmer' && String(order.farmer) === String(req.user._id);
    const isBuyer = req.user.role === 'buyer' && String(order.buyer) === String(req.user._id);
    const isAdmin = req.user.role === 'admin';
    if (!isFarmer && !isBuyer && !isAdmin) throw new ApiError(404, 'Order not found');

    if (isBuyer) {
      if (status !== 'cancelled' || order.status !== 'placed') {
        throw new ApiError(400, 'Buyers can only cancel an order that has not been confirmed yet');
      }
    } else if (isFarmer && !(FARMER_FLOW[order.status] || []).includes(status)) {
      throw new ApiError(400, `Cannot move an order from ${order.status} to ${status}`);
    }

    // Return stock when an order is cancelled
    if (status === 'cancelled' && order.status !== 'cancelled') {
      for (const it of order.items) {
        await Crop.updateOne({ _id: it.crop }, { $inc: { quantityQuintals: it.quantityQuintals }, $set: { status: 'active' } });
      }
    }
    order.status = status;
    if (status === 'delivered' && order.paymentMethod === 'cod') order.paymentStatus = 'paid';
    order.statusHistory.push({ status, by: req.user._id });
    await order.save();
    res.json({ success: true, order });
  })
);

module.exports = router;

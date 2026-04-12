import Dispute from '../models/Dispute.js';
import Order from '../models/Order.js';

// @desc    Raise a dispute
// @route   POST /api/disputes
// @access  Private/Buyer
export const raiseDispute = async (req, res) => {
  const { orderId, reason } = req.body;

  const order = await Order.findById(orderId);

  if (!order || order.buyer.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error('Order not found or unauthorized');
  }

  // Check if dispute already exists
  const existingDispute = await Dispute.findOne({ order: orderId });
  if (existingDispute) {
    res.status(400);
    throw new Error('Dispute already exists for this order');
  }

  const dispute = new Dispute({
    order: orderId,
    buyer: req.user._id,
    vendor: order.vendor,
    reason,
  });

  order.status = 'disputed';
  await order.save();

  const createdDispute = await dispute.save();
  res.status(201).json(createdDispute);
};

// @desc    Get all disputes
// @route   GET /api/disputes
// @access  Private/Admin
export const getDisputes = async (req, res) => {
  const disputes = await Dispute.find({})
    .populate('buyer', 'name email')
    .populate('vendor', 'name vendorSlug')
    .populate('order', 'totalPrice createdAt');
  res.json(disputes);
};

// @desc    Get dispute by ID
// @route   GET /api/disputes/:id
// @access  Private/Admin
export const getDisputeById = async (req, res) => {
  const dispute = await Dispute.findById(req.params.id)
    .populate('buyer', 'name email')
    .populate('vendor', 'name vendorSlug')
    .populate('order');

  if (dispute) {
    res.json(dispute);
  } else {
    res.status(404);
    throw new Error('Dispute not found');
  }
};

// @desc    Resolve dispute
// @route   PATCH /api/disputes/:id/resolve
// @access  Private/Admin
export const resolveDispute = async (req, res) => {
  const { resolutionNotes, refundBuyer } = req.body;

  const dispute = await Dispute.findById(req.params.id).populate('order');

  if (dispute) {
    dispute.status = refundBuyer ? 'resolved_buyer' : 'resolved_vendor';
    dispute.resolutionNotes = resolutionNotes;

    const order = dispute.order;
    
    if (refundBuyer) {
      // Logic to refund buyer would go here
      order.status = 'delivered'; // or cancelled, depending on biz logic
    } else {
      // Release funds to vendor
      import('../models/User.js').then(async ({ default: User }) => {
        const vendorUser = await User.findById(order.vendor);
        if (vendorUser) {
          vendorUser.walletBalance += order.totalPrice * 0.9;
          await vendorUser.save();
        }
      });
      order.status = 'delivered';
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }
    
    await order.save();

    const updatedDispute = await dispute.save();
    res.json(updatedDispute);
  } else {
    res.status(404);
    throw new Error('Dispute not found');
  }
};

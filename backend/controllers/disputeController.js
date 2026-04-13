import Dispute from '../models/Dispute.js';
import Order from '../models/Order.js';
import User from '../models/User.js';

// @desc    Raise a dispute
export const raiseDispute = async (req, res, next) => {
  try {
    const { orderId, reason } = req.body;

    const order = await Order.getOrderById(orderId);

    if (!order || order.buyer._id.toString() !== req.user._id.toString()) {
      res.status(404);
      return next(new Error('Order not found or unauthorized'));
    }

    // Check if dispute already exists
    const existingDispute = await Dispute.findByOrderId(orderId);
    if (existingDispute) {
      res.status(400);
      return next(new Error('Dispute already exists for this order'));
    }

    await Order.updateOrderStatus(orderId, 'disputed');
    
    const createdDispute = await Dispute.create(orderId, req.user._id, order.vendor._id, reason);
    res.status(201).json(createdDispute);
  } catch (err) {
    next(err);
  }
};

// @desc    Get all disputes
export const getDisputes = async (req, res, next) => {
  try {
    const disputes = await Dispute.findAll();
    res.json(disputes);
  } catch (err) {
    next(err);
  }
};

// @desc    Get dispute by ID
export const getDisputeById = async (req, res, next) => {
  try {
    const dispute = await Dispute.findById(req.params.id);

    if (dispute) {
      res.json(dispute);
    } else {
      res.status(404);
      return next(new Error('Dispute not found'));
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Resolve dispute
export const resolveDispute = async (req, res, next) => {
  try {
    const { resolutionNotes, refundBuyer } = req.body;

    const dispute = await Dispute.findById(req.params.id);

    if (dispute) {
      const status = refundBuyer ? 'resolved_buyer' : 'resolved_vendor';
      
      if (refundBuyer) {
        await Order.markDelivered(dispute.order._id);
      } else {
        const vendorUser = await User.findById(dispute.vendor._id);
        if (vendorUser) {
          const newBalance = parseFloat(vendorUser.walletBalance) + (dispute.order.totalPrice * 0.9);
          await User.updateWalletBalance(vendorUser.id, newBalance);
        }
        await Order.markDelivered(dispute.order._id);
      }
      
      const updatedDispute = await Dispute.resolve(req.params.id, status, resolutionNotes);
      res.json(updatedDispute);
    } else {
      res.status(404);
      return next(new Error('Dispute not found'));
    }
  } catch (err) {
    next(err);
  }
};

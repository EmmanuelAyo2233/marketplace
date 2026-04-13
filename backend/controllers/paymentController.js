import Order from '../models/Order.js';

// @desc    Initialize payment (Mock)
export const initializePayment = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const order = await Order.getOrderById(orderId);

    if (order) {
      // In a real app, call Paystack API to initialize transaction
      // Mock response
      res.json({
        authorization_url: `http://localhost:5173/checkout?orderId=${orderId}&ref=mock_ref_${Date.now()}`,
        access_code: 'mock_code',
        reference: `mock_ref_${Date.now()}`,
      });
    } else {
      res.status(404);
      return next(new Error('Order not found'));
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Verify payment
export const verifyPayment = async (req, res, next) => {
  try {
    const { ref } = req.params;
    
    // In a real app, verify with Paystack using the ref
    // Here we just mock it, finding an unpaid order and marking it paid
    const order = await Order.findLastUnpaidOrder(req.user._id);

    if (order) {
      const paymentResult = {
        id: ref,
        status: 'success',
        update_time: new Date().toISOString(),
        email_address: req.user.email,
      };

      const updatedOrder = await Order.markPaid(order._id, paymentResult);
      res.json(updatedOrder);
    } else {
      res.json({ message: 'mock verified' }); // if no order found assume mock success
    }
  } catch (err) {
    next(err);
  }
};

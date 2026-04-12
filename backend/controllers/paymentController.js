import Order from '../models/Order.js';

// @desc    Initialize payment (Mock)
// @route   POST /api/payments/initialize
// @access  Private
export const initializePayment = async (req, res) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);

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
    throw new Error('Order not found');
  }
};

// @desc    Verify payment
// @route   GET /api/payments/verify/:ref
// @access  Private
export const verifyPayment = async (req, res) => {
  const { ref } = req.params;
  
  // In a real app, verify with Paystack using the ref
  // Here we just mock it, finding an unpaid order and marking it paid
  const order = await Order.findOne({ isPaid: false, user: req.user._id }).sort({ createdAt: -1 });

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: ref,
      status: 'success',
      update_time: new Date().toISOString(),
      email_address: req.user.email,
    };
    order.status = 'paid';

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.json({ message: 'mock verified' }); // if no order found assume mock success
  }
};

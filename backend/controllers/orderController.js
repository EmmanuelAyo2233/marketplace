import Order from '../models/Order.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    vendorId, // Frontend should pass vendorId
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    // For MVP, assume checkout groups by vendor and creates one order per vendor.
    // If frontend sends mixed vendor items, they need to be split. We'll assume the frontend sends vendorId.
    const order = new Order({
      orderItems,
      buyer: req.user._id,
      vendor: vendorId, // We need this from frontend
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('buyer', 'name email')
    .populate('vendor', 'name email vendorSlug');

  if (order) {
    // Check if the user is authorized to view this order
    if (
      order.buyer._id.toString() === req.user._id.toString() ||
      order.vendor._id.toString() === req.user._id.toString() ||
      req.user.role === 'admin'
    ) {
      res.json(order);
    } else {
      res.status(401);
      throw new Error('Not authorized to view this order');
    }
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
};

// @desc    Get logged in buyer's orders
// @route   GET /api/orders/me
// @access  Private
export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ buyer: req.user._id }).populate('vendor', 'name');
  res.json(orders);
};

// @desc    Get vendor's orders
// @route   GET /api/orders/vendor
// @access  Private/Vendor
export const getVendorOrders = async (req, res) => {
  const orders = await Order.find({ vendor: req.user._id }).populate('buyer', 'name');
  res.json(orders);
};

// @desc    Mark order as shipped
// @route   PATCH /api/orders/:id/ship
// @access  Private/Vendor
export const shipOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order && order.vendor.toString() === req.user._id.toString()) {
    order.isShipped = true;
    order.shippedAt = Date.now();
    order.status = 'shipped';

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found or unauthorized');
  }
};

// @desc    Confirm delivery of order
// @route   PATCH /api/orders/:id/confirm
// @access  Private/Buyer
export const confirmDelivery = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order && order.buyer.toString() === req.user._id.toString()) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.status = 'delivered';

    // Escrow logic: release funds to vendor wallet
    import('../models/User.js').then(async ({ default: User }) => {
      const vendorUser = await User.findById(order.vendor);
      if (vendorUser) {
        vendorUser.walletBalance += order.totalPrice * 0.9; // e.g. 10% platform fee
        await vendorUser.save();
      }
    });

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found or unauthorized');
  }
};

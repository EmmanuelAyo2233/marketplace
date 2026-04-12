import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

// @desc    Get vendor store by slug
// @route   GET /api/vendors/:slug
// @access  Public
export const getStoreBySlug = async (req, res) => {
  const vendor = await User.findOne({ vendorSlug: req.params.slug, role: 'vendor' }).select('-password');
  
  if (!vendor) {
    res.status(404);
    throw new Error('Store not found');
  }

  const products = await Product.find({ vendor: vendor._id });
  
  res.json({ vendor, products });
};

// @desc    Update vendor profile
// @route   PUT /api/vendors/me
// @access  Private/Vendor
export const updateVendorProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.vendorSlug = req.body.vendorSlug || user.vendorSlug;
    user.vendorDescription = req.body.vendorDescription || user.vendorDescription;
    
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      vendorSlug: updatedUser.vendorSlug,
      vendorDescription: updatedUser.vendorDescription,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

// @desc    Get vendor stats
// @route   GET /api/vendors/me/stats
// @access  Private/Vendor
export const getVendorStats = async (req, res) => {
  const productsCount = await Product.countDocuments({ vendor: req.user._id });
  const orders = await Order.find({ vendor: req.user._id });
  
  const totalSales = orders.reduce((acc, order) => {
    return order.isPaid ? acc + order.totalPrice : acc;
  }, 0);
  
  res.json({
    productsCount,
    ordersCount: orders.length,
    totalSales,
    walletBalance: req.user.walletBalance,
  });
};

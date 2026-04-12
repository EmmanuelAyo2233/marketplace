import Product from '../models/Product.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  const products = await Product.find({}).populate('vendor', 'name vendorSlug');
  res.json(products);
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id).populate('vendor', 'name vendorSlug');
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
};

// @desc    Compare products
// @route   GET /api/products/compare
// @access  Public
export const compareProducts = async (req, res) => {
  const { ids } = req.query;
  if (!ids) {
    res.status(400);
    throw new Error('No product ids provided');
  }
  const products = await Product.find({ _id: { $in: ids.split(',') } }).populate('vendor', 'name vendorSlug');
  res.json(products);
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Vendor
export const createProduct = async (req, res) => {
  const { name, price, description, category, countInStock } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : '';

  const product = new Product({
    name,
    price,
    user: req.user._id,
    vendor: req.user._id, // Add vendor since it is populated
    image,
    category,
    countInStock,
    description,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Vendor
export const updateProduct = async (req, res) => {
  const { name, price, description, category, countInStock } = req.body;
  
  const product = await Product.findById(req.params.id);

  if (product) {
    if (product.vendor.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to update this product');
    }

    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.category = category || product.category;
    product.countInStock = countInStock || product.countInStock;
    
    if (req.file) {
      product.image = `/uploads/${req.file.filename}`;
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Vendor
export const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    if (product.vendor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized to delete this product');
    }
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
};

// @desc    Get vendor's products
// @route   GET /api/products/me
// @access  Private/Vendor
export const getMyProducts = async (req, res) => {
  const products = await Product.find({ vendor: req.user._id });
  res.json(products);
};

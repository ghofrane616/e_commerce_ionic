const Product = require("../models/Product");

// Create product (admin)
exports.createProduct = async (req, res) => {
  try {
    const p = await Product.create(req.body);
    res.json({ message: "Product created", product: p });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Get all products (public)
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: "Not found" });
    res.json(p);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Update product (admin)
exports.updateProduct = async (req, res) => {
  try {
    const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Updated", product: p });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Delete product (admin)
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

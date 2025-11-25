const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Get cart for user
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
    if (!cart) return res.json({ items: [] });
    res.json(cart);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Add / update item
exports.addItem = async (req, res) => {
  try {
    const { productId, qty } = req.body;
    if (!productId || !qty) return res.status(400).json({ message: "Missing fields" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [{ product: productId, qty }] });
      return res.json(cart);
    }

    const idx = cart.items.findIndex(i => i.product.toString() === productId);
    if (idx > -1) {
      cart.items[idx].qty = qty; // update
    } else {
      cart.items.push({ product: productId, qty });
    }
    cart.updatedAt = new Date();
    await cart.save();
    res.json(cart);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Remove item
exports.removeItem = async (req, res) => {
  try {
    const { productId } = req.body;
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(i => i.product.toString() !== productId);
    await cart.save();
    res.json(cart);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

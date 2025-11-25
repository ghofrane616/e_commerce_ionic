const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Create order (checkout) — here paiement simulé
exports.createOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
    if (!cart || cart.items.length === 0) return res.status(400).json({ message: "Cart empty" });

    // Calculate total and prepare items
    const items = cart.items.map(i => ({
      product: i.product._id,
      qty: i.qty,
      price: i.product.price
    }));
    const total = items.reduce((s, it) => s + it.qty * it.price, 0);

    // Optional: decrement stock
    for (const it of items) {
      await Product.findByIdAndUpdate(it.product, { $inc: { stock: -it.qty } });
    }

    const order = await Order.create({
      user: req.user.id,
      items,
      total,
      status: "pending"
    });

    // clear cart
    cart.items = [];
    await cart.save();

    res.json({ message: "Order created", order });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Get orders for user
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate("items.product");
    res.json(orders);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Admin: get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user").populate("items.product");
    res.json(orders);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Admin: update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

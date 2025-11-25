// 📦 backend/utils/seed.js
// Script bech t3abbi el database b data test

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

// 📁 Import models
const User = require("../models/User");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const Order = require("../models/Order");

// 🔧 Load environment variables
dotenv.config();

// 🎯 Sample Users
const users = [
  {
    username: "admin",
    email: "admin@ecommerce.tn",
    password: "admin123",
    role: "admin",
  },
  {
    username: "user1",
    email: "user1@test.tn",
    password: "user123",
    role: "user",
  },
  {
    username: "user2",
    email: "user2@test.tn",
    password: "user123",
    role: "user",
  },
];

// 🎯 Sample Products
const products = [
  {
    name: "Laptop HP",
    description: "Ordinateur portable HP 15.6 pouces, Intel Core i5, 8GB RAM",
    price: 2499,
    category: "Informatique",
    stock: 15,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
  },
  {
    name: "iPhone 14 Pro",
    description: "Smartphone Apple iPhone 14 Pro, 256GB, Noir",
    price: 4999,
    category: "Téléphones",
    stock: 8,
    image: "https://images.unsplash.com/photo-1592286927505-b0e2e279d6fd?w=400",
  },
  {
    name: "Samsung Galaxy S23",
    description: "Smartphone Samsung Galaxy S23, 128GB, Blanc",
    price: 3499,
    category: "Téléphones",
    stock: 12,
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400",
  },
  {
    name: "AirPods Pro",
    description: "Écouteurs sans fil Apple AirPods Pro avec réduction de bruit",
    price: 899,
    category: "Audio",
    stock: 25,
    image: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400",
  },
  {
    name: "Sony WH-1000XM5",
    description: "Casque audio Sony avec réduction de bruit active",
    price: 1299,
    category: "Audio",
    stock: 10,
    image: "https://images.unsplash.com/photo-1545127398-14699f92334b?w=400",
  },
  {
    name: "iPad Air",
    description: "Tablette Apple iPad Air 10.9 pouces, 64GB, Gris sidéral",
    price: 2199,
    category: "Tablettes",
    stock: 7,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
  },
  {
    name: "Samsung Galaxy Tab S8",
    description: "Tablette Samsung Galaxy Tab S8, 128GB avec S Pen",
    price: 1899,
    category: "Tablettes",
    stock: 9,
    image: "https://images.unsplash.com/photo-1585790050230-5dd28404f749?w=400",
  },
  {
    name: "MacBook Pro 14",
    description: "Apple MacBook Pro 14 pouces, M2 Pro, 16GB RAM, 512GB SSD",
    price: 8999,
    category: "Informatique",
    stock: 5,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
  },
  {
    name: "Dell XPS 13",
    description: "Ultrabook Dell XPS 13, Intel Core i7, 16GB RAM, 512GB SSD",
    price: 4499,
    category: "Informatique",
    stock: 6,
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400",
  },
  {
    name: "Apple Watch Series 8",
    description: "Montre connectée Apple Watch Series 8, GPS + Cellular",
    price: 1699,
    category: "Montres",
    stock: 14,
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400",
  },
  {
    name: "JBL Flip 6",
    description: "Enceinte Bluetooth portable JBL Flip 6, étanche",
    price: 449,
    category: "Audio",
    stock: 20,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400",
  },
  {
    name: "Logitech MX Master 3",
    description: "Souris sans fil Logitech MX Master 3, haute précision",
    price: 299,
    category: "Accessoires",
    stock: 30,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400",
  },
];

// 🔧 Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

// 🗑️ Clear existing data
const clearDatabase = async () => {
  try {
    await User.deleteMany({});
    await Product.deleteMany({});
    await Cart.deleteMany({});
    await Order.deleteMany({});
    console.log("🗑️  Database cleared");
  } catch (err) {
    console.error("❌ Error clearing database:", err);
    process.exit(1);
  }
};

// 👤 Seed Users
const seedUsers = async () => {
  try {
    const hashedUsers = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      }))
    );

    await User.insertMany(hashedUsers);
    console.log("✅ Users seeded");
  } catch (err) {
    console.error("❌ Error seeding users:", err);
    process.exit(1);
  }
};

// 📦 Seed Products
const seedProducts = async () => {
  try {
    await Product.insertMany(products);
    console.log("✅ Products seeded");
  } catch (err) {
    console.error("❌ Error seeding products:", err);
    process.exit(1);
  }
};

// 🛒 Seed Sample Cart & Orders (optional)
const seedCartAndOrders = async () => {
  try {
    // Get user1
    const user = await User.findOne({ email: "user1@test.tn" });
    if (!user) {
      console.log("⚠️  User not found, skipping cart/order seed");
      return;
    }

    // Get some products
    const allProducts = await Product.find().limit(3);
    if (allProducts.length === 0) {
      console.log("⚠️  No products found, skipping cart/order seed");
      return;
    }

    // Create sample cart
    const cartItems = allProducts.slice(0, 2).map((p) => ({
      product: p._id,
      qty: 1,
    }));

    await Cart.create({
      user: user._id,
      items: cartItems,
    });
    console.log("✅ Sample cart created for user1");

    // Create sample order
    const orderItems = allProducts.map((p) => ({
      product: p._id,
      qty: 2,
      price: p.price,
    }));

    const total = orderItems.reduce((sum, item) => sum + item.qty * item.price, 0);

    await Order.create({
      user: user._id,
      items: orderItems,
      total,
      status: "delivered",
    });
    console.log("✅ Sample order created for user1");
  } catch (err) {
    console.error("❌ Error seeding cart/orders:", err);
  }
};

// 🚀 Main seed function
const seedDatabase = async () => {
  console.log("🌱 Starting database seeding...\n");

  await connectDB();
  await clearDatabase();
  await seedUsers();
  await seedProducts();
  await seedCartAndOrders();

  console.log("\n🎉 Database seeding completed successfully!");
  console.log("\n📋 Test accounts:");
  console.log("👑 Admin: admin@ecommerce.tn / admin123");
  console.log("👤 User1: user1@test.tn / user123");
  console.log("👤 User2: user2@test.tn / user123");
  console.log("\n✨ You can now start your server and test the app!\n");

  process.exit(0);
};

// 🎯 Run seed
seedDatabase();
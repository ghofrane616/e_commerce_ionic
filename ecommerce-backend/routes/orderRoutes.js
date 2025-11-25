const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const oc = require("../controllers/orderController");

router.post("/checkout", auth(), oc.createOrder);
router.get("/my", auth(), oc.getUserOrders);

// admin
router.get("/", auth("admin"), oc.getAllOrders);
router.put("/:id/status", auth("admin"), oc.updateOrderStatus);

module.exports = router;

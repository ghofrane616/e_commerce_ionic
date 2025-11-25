const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const cc = require("../controllers/cartController");

router.get("/", auth(), cc.getCart);
router.post("/add", auth(), cc.addItem);
router.post("/remove", auth(), cc.removeItem);

module.exports = router;

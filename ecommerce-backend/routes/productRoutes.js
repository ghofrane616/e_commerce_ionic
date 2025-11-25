const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const pc = require("../controllers/productController");

// public
router.get("/", pc.getProducts);
router.get("/:id", pc.getProduct);

// admin
router.post("/", auth("admin"), pc.createProduct);
router.put("/:id", auth("admin"), pc.updateProduct);
router.delete("/:id", auth("admin"), pc.deleteProduct);

module.exports = router;

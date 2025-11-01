const express = require("express");
const router = express.Router();
const productController = require("../controllers/products");
const verifyTokenAndAdmin = require("../middleware/verifyTokenAndAdmin");

router.get('/', productController.getProducts);
router.get("/:id", productController.getUniqueProduct);
router.post("/", verifyTokenAndAdmin, productController.addProduct);
router.put("/:id", verifyTokenAndAdmin, productController.editProduct);
router.patch("/:id", verifyTokenAndAdmin, productController.updateProduct);
router.delete("/:id", verifyTokenAndAdmin, productController.deleteProduct);

module.exports = router;
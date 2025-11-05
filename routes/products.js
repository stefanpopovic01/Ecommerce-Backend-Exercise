const express = require("express");
const router = express.Router();
const productController = require("../controllers/products");
const verifyTokenAndAdmin = require("../middleware/verifyTokenAndAdmin");

router.get('/', productController.getProducts);
router.get("/:id", productController.getUniqueProduct);
router.post("/", productController.addProduct);
router.put("/:id", productController.editProduct);
router.patch("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
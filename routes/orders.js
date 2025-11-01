const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orders");
const verifyToken = require("../middleware/auth");
const verifyTokenAndAdmin = require("../middleware/verifyTokenAndAdmin");
 

router.post("/", verifyToken, orderController.createOrder);
router.get("/", verifyTokenAndAdmin, orderController.getOrders);
router.get("/:id", verifyToken, orderController.getUniqueOrder);
router.put("/:id", verifyTokenAndAdmin, orderController.editOrder);
router.patch("/:id", verifyTokenAndAdmin, orderController.updateOrder);
router.get("/user/:id", verifyToken, orderController.getUserOrders);
router.delete("/:id", verifyTokenAndAdmin, orderController.deleteOrder);

module.exports = router;
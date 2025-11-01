const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payments");

router.post("/create-payment-intent", paymentController.createPaymentIntent);

module.exports = router;

import express from "express";
import { createOrder, verifyPayment } from "../controllers/paymentController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Create a new Razorpay order (requires auth)
router.post("/order", auth, createOrder);

// Verify payment signature (requires auth)
router.post("/verify", auth, verifyPayment);

export default router;
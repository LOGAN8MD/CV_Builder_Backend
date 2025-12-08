// controllers/paymentController.js
import Razorpay from "razorpay";
import crypto from "crypto";

// Create a new order
export const createOrder = async (req, res) => {
  try {
    // Initialize Razorpay instance here (after dotenv has loaded)
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const { amount, currency, receipt } = req.body;

    const options = {
      amount: amount * 100, // amount in paise (₹1 = 100 paise)
      currency: currency || "INR",
      receipt: receipt || "receipt#1",
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
};

// Verify payment signature
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature === razorpay_signature) {
      // ✅ Payment verified
      res.status(200).json({ status: "success", message: "Payment verified successfully" });
    } else {
      console.log( "Failure :----- Payment verification failed")
      // ❌ Payment failed
      res.status(400).json({ status: "failure", message: "Payment verification failed" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ message: "Verification error" });
  }
};

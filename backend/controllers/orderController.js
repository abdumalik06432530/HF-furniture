import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import Stripe from "stripe";
import razorpay from "razorpay";

const currency = "inr";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ============================
// Delete Order (Admin)
// ============================
const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.json({ success: false, message: "Order ID is required" });
    }
    const deleted = await orderModel.findByIdAndDelete(orderId);
    if (!deleted) {
      return res.json({ success: false, message: "Order not found" });
    }
    res.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ============================
// Place COD Order
// ============================

const placeOrder = async (req, res) => {
  try {
    const userId = req.user?.id;
    // Items/address may come from JSON body or from form-data fields
    const { items: itemsBody, address: addressBody, paymentMethod, transactionId, amount } = req.body;
    // If using form-data, items/address may be sent as JSON strings
    let items = itemsBody;
    let address = addressBody;
    try {
      if (typeof itemsBody === 'string') items = JSON.parse(itemsBody);
      if (typeof addressBody === 'string') address = JSON.parse(addressBody);
    } catch (e) {
      // fallback: leave as-is
    }
    if (!userId) {
      return res.json({ success: false, message: "Order validation failed: userId is required (from token)." });
    }
    const orderData = {
      userId,
      items,
      address,
      date: Date.now(),
      status: "Pending",
    };

    // Accept optional uploaded bank statement (multer adds req.file)
    if (req.file) {
      orderData.bankStatement = req.file.path; // store server file path; frontend can build URL
    }

    // Accept optional payment metadata (sanitize amount to avoid NaN)
    if (paymentMethod || transactionId || amount !== undefined) {
      const rawAmount = amount;
      let parsedAmount;
      if (rawAmount === undefined || rawAmount === null || rawAmount === '') {
        parsedAmount = undefined;
      } else {
        // try to coerce to number and validate
        parsedAmount = Number(rawAmount);
        if (!Number.isFinite(parsedAmount)) {
          parsedAmount = undefined; // ignore invalid numeric values to avoid mongoose cast errors
        }
      }

      const paymentObj = {
        method: paymentMethod || 'BankTransfer',
      };
      if (transactionId) paymentObj.transactionId = transactionId;
      if (parsedAmount !== undefined) paymentObj.amount = parsedAmount;

      // only set payment if there's at least method or transaction id or amount
      orderData.payment = paymentObj;
    }

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ============================
// Stripe Order
// ============================

const placeOrderStripe = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { items, address } = req.body;
    const { origin } = req.headers;
    if (!userId) {
      return res.json({ success: false, message: "Order validation failed: userId is required (from token)." });
    }
    const orderData = {
      userId,
      items,
      address,
      date: Date.now(),
      status: "Pending",
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const line_items = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ============================
// Verify Stripe
// ============================
const verifyStripe = async (req, res) => {
  const { orderId, success } = req.body;
  const userId = req.user?.id;

  try {
    if (success === "true") {
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      res.json({ success: true });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ============================
// Razorpay Order
// ============================
const placeOrderRazorpay = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { items, address } = req.body;
    if (!userId) {
      return res.json({ success: false, message: "Order validation failed: userId is required (from token)." });
    }
    const orderData = {
      userId,
      items,
      address,
      date: Date.now(),
      status: "Pending",
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const options = {
      amount: totalAmount * 100,
      currency: currency.toUpperCase(),
      receipt: newOrder._id.toString(),
    };

    razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        return res.json({ success: false, message: error });
      }
      res.json({ success: true, order });
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ============================
// Verify Razorpay
// ============================
const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;
    const userId = req.user?.id;

    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    if (orderInfo.status === "paid") {
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      res.json({ success: true, message: "Payment Successful" });
    } else {
      res.json({ success: false, message: "Payment Failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ============================
// Get All Orders (Admin)
// ============================
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ============================
// Get User Orders
// ============================
const userOrders = async (req, res) => {
  try {
    const userId = req.user?.id;
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ============================
// Update Order Status
// ============================
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    console.log(req.body);

    const order = await orderModel.findById(orderId);
    if (!order) return res.json({ success: false, message: "Order not found" });

    // If status changes to Delivered and it wasn’t already delivered
    const shortages = [];
    if (status === "Delivered" && order.status !== "Delivered") {
      for (const item of order.items) {
        try {
          // Prefer productId if order items include it, otherwise fallback to name
          let product = null;
          if (item.productId) {
            product = await productModel.findById(item.productId);
          }
          if (!product && item.name) {
            product = await productModel.findOne({ name: item.name });
          }

          if (!product) {
            console.warn(`Product not found for order item: ${JSON.stringify(item)}`);
            continue;
          }

          const orderedQty = Number(item.quantity) || 0;
          const currentQty = Number(product.quantity) || 0;
          // Allow negative stock to represent deficit (backorder)
          const newQty = currentQty - orderedQty;

          // Record shortages when ordered exceeds available (remaining will be negative)
          if (orderedQty > currentQty) {
            shortages.push({
              productId: product._id,
              name: product.name,
              requested: orderedQty,
              available: currentQty,
              remaining: newQty, // negative number indicates deficit
            });
          }

          // Only update if there is a change
          if (newQty !== currentQty) {
            product.quantity = newQty;
            await product.save();
            console.log(`Updated stock for product ${product._id} (${product.name}): ${currentQty} -> ${newQty}`);
          }
        } catch (err) {
          console.error('Error updating product stock for item', item, err);
        }
      }
    }

    order.status = status;
    await order.save();

    const response = { success: true, message: "Status Updated" };
    if (shortages.length > 0) {
      response.shortages = shortages;
      response.message = "Status Updated with shortages";
    }
    res.json(response);
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  placeOrder,
  placeOrderStripe,
  verifyStripe,
  placeOrderRazorpay,
  verifyRazorpay,
  allOrders,
  userOrders,
  updateStatus,
  deleteOrder,
};

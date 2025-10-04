import userModel from "../models/userModel.js";
import mongoose from "mongoose"; // Import mongoose for ObjectId validation

// Add products to user cart
const addToCart = async (req, res) => {
  try {
    // Accept userId from body, query, or authenticated token (req.user)
    const { userId: bodyUserId, itemId, Colors } = req.body;
    const userId = bodyUserId || req.query?.userId || req.user?.id;

    // Validate inputs
    if (!userId || !mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(itemId)) {
      return res.status(400).json({ success: false, message: "Invalid userId or itemId" });
    }

    // Colors can be the special key 'default' when no color is chosen
    if (!Colors || typeof Colors !== "string") {
      return res.status(400).json({ success: false, message: "Colors is required and must be a string" });
    }

    // Normalize Colors to avoid case-sensitivity issues
    const normalizedColors = Colors.toLowerCase();

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Initialize cartData if not present or invalid
    let cartData = userData.cartData && typeof userData.cartData === "object" ? userData.cartData : {};

    if (cartData[itemId]) {
      if (cartData[itemId][normalizedColors]) {
        cartData[itemId][normalizedColors] += 1;
      } else {
        cartData[itemId][normalizedColors] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][normalizedColors] = 1;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: "Added to cart" });
  } catch (error) {
    console.error("Error in addToCart:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update user cart
const updateCart = async (req, res) => {
  try {
    const { userId: bodyUserId, itemId, Colors } = req.body;
    let { quantity } = req.body;
    const userId = bodyUserId || req.query?.userId || req.user?.id;

    // Coerce quantity to number
    quantity = Number(quantity);

    // Validate inputs
    if (!userId || !mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(itemId)) {
      return res.status(400).json({ success: false, message: "Invalid userId or itemId" });
    }
    if (!Colors || typeof Colors !== "string") {
      return res.status(400).json({ success: false, message: "Colors is required and must be a string" });
    }
    if (Number.isNaN(quantity) || quantity < 0) {
      return res.status(400).json({ success: false, message: "Quantity must be a non-negative number" });
    }

    // Normalize Colors
    const normalizedColors = Colors.toLowerCase();

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Initialize cartData if not present or invalid
    let cartData = userData.cartData && typeof userData.cartData === "object" ? userData.cartData : {};

    if (!cartData[itemId]) {
      cartData[itemId] = {};
    }

    // Update quantity or remove item if quantity is 0
    if (quantity === 0) {
      delete cartData[itemId][normalizedColors];
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
    } else {
      cartData[itemId][normalizedColors] = quantity;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: "Cart updated" });
  } catch (error) {
    console.error("Error in updateCart:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get user cart data
const getUserCart = async (req, res) => {
  try {
    // Accept userId from body, query, or authenticated token
    const bodyUserId = req.body?.userId;
    const userId = bodyUserId || req.query?.userId || req.user?.id;

    // Validate userId
    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ success: false, message: "Invalid userId" });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const cartData = userData.cartData && typeof userData.cartData === "object" ? userData.cartData : {};

    res.json({ success: true, cartData });
  } catch (error) {
    console.error("Error in getUserCart:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export { addToCart, updateCart, getUserCart };
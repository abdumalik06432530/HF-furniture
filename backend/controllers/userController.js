import authUser from "../middleware/auth.js";
// Route for updating user profile and password
const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.json({ success: false, message: "Unauthorized" });
    }
    const { name, email, phone, password } = req.body;
    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) {
      if (!validator.isEmail(email)) {
        return res.json({ success: false, message: "Please enter a valid email" });
      }
      // Check for duplicate email (not current user)
      const existing = await userModel.findOne({ email, _id: { $ne: userId } });
      if (existing) {
        return res.json({ success: false, message: "Email already in use" });
      }
      updateFields.email = email;
    }
    if (phone) updateFields.phone = phone;
    if (password) {
      if (password.length < 8) {
        return res.json({ success: false, message: "Please enter a strong password" });
      }
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }
    console.log('Attempting profile update:', { userId, updateFields });
    const updatedUser = await userModel.findByIdAndUpdate(userId, updateFields, { new: true });
    if (!updatedUser) {
      return res.json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Profile update error:', error.stack || error);
    res.json({ success: false, message: error.message, stack: error.stack });
  }
};
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const createToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const createTokenCustomer = (id, role = "user") => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Route for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User doesn't exists" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = createTokenCustomer(user._id, user.role);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for user register (only regular users, auto-login after register)
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // checking user already exists or not
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    // validating email format & strong password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    // hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      role: "user",
      phone,
    });

    const user = await newUser.save();

    const token = createTokenCustomer(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for admin login
const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const adminEmail = (process.env.ADMIN_EMAIL || "").replace(/\"/g, "").trim();
    const adminPass = (process.env.ADMIN_PASSWORD || "").replace(/\"/g, "").trim();
    if (email === adminEmail && password === adminPass) {
      const token = createToken({ email, role: "admin" });
      return res.json({ success: true, token });
    }
    return res.json({ success: false, message: "User doesn't exist or invalid credentials" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// route for admin register
const adminRegister = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // checking user already exists or not
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    // validating email format & strong password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    // hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      phone,
    });

    const user = await newUser.save();

    const token = createToken({ email: email, role: "admin" });
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const userProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.json({ success: false, message: "Unauthorized" });
    }
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { loginUser, registerUser, adminLogin, adminRegister, userProfile };
export { updateProfile };

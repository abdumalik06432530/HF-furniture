import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

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
      const cleanEmail = String(email).trim().toLowerCase();
      if (!validator.isEmail(cleanEmail)) {
        return res.json({ success: false, message: "Please enter a valid email" });
      }
      // Check for duplicate email (not current user)
      const existing = await userModel.findOne({ email: cleanEmail, _id: { $ne: userId } });
      if (existing) {
        return res.json({ success: false, message: "Email already in use" });
      }
      updateFields.email = cleanEmail;
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

const createToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const createTokenCustomer = (id, role = "user") => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Route for user login
const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = String(email || '').trim().toLowerCase();
    password = String(password || '');

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User doesn't exists" });
    }

    // Prevent disabled users from logging in
    if (user.isActive === false) {
      return res.status(403).json({ success: false, message: 'Account disabled. Contact support.' });
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
    let { name, email, password, phone } = req.body;
    email = String(email || '').trim().toLowerCase();
    password = String(password || '');

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

    // create user; the model's pre-save hook will hash the password
    const newUser = new userModel({
      name,
      email,
      password,
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
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanPass = String(password || '');
    // First try to find an admin user in the database
    const dbAdmin = await userModel.findOne({ email: cleanEmail, role: { $in: ["admin", "superadmin"] } });
    if (dbAdmin) {
      // Prevent disabled admins from logging in
      if (dbAdmin.isActive === false) {
        return res.status(403).json({ success: false, message: 'Account disabled. Contact support.' });
      }
      const isMatch = await bcrypt.compare(cleanPass, dbAdmin.password);
      if (!isMatch) return res.json({ success: false, message: "Invalid credentials" });
      const token = createTokenCustomer(dbAdmin._id, dbAdmin.role);
      return res.json({ success: true, token });
    }

    // Fallback to environment admin credentials (legacy)
    const adminEmail = (process.env.ADMIN_EMAIL || "").replace(/\"/g, "").trim().toLowerCase();
    const adminPass = (process.env.ADMIN_PASSWORD || "").replace(/\"/g, "").trim();
    if (cleanEmail === adminEmail && cleanPass === adminPass) {
      // create a token for the env-admin — this token has a synthetic id so profile endpoints can still work read-only
      const token = createTokenCustomer("env-admin", "admin");
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
    let { name, email, password, phone } = req.body;
    email = String(email || '').trim().toLowerCase();
    password = String(password || '');

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

    // create admin user; model pre-save hook will hash the password
    const newUser = new userModel({
      name,
      email,
      password,
      role: "admin",
      phone,
    });

    const user = await newUser.save();

    const token = createTokenCustomer(user._id, 'admin');
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const userProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    // If token was issued for the environment admin (no DB record)
    if (!userId || userId === 'env-admin') {
      // If env-admin, return a minimal profile from env variables
      const adminEmail = (process.env.ADMIN_EMAIL || "").replace(/\"/g, "").trim();
      if (req.user?.role === 'admin' && req.user?.id === 'env-admin' && req.user?.role) {
        return res.json({ success: true, user: { name: 'Administrator', email: adminEmail, role: 'admin' } });
      }
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User doesn't exist" });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Admin-only: list users
const listUsers = async (req, res) => {
  try {
    // exclude sensitive fields like password
    const users = await userModel.find().select('-password').sort({ createdAt: -1 }).lean();
    res.json({ success: true, users });
  } catch (err) {
    console.error('List users error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin-only: toggle user active status
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    if (typeof isActive === 'undefined') {
      return res.status(400).json({ success: false, message: 'isActive is required' });
    }
    const user = await userModel.findById(id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isActive = !!isActive;
    await user.save();
    res.json({ success: true, user });
  } catch (err) {
    console.error('Update user status error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export { loginUser, registerUser, adminLogin, adminRegister, userProfile, listUsers, updateUserStatus, updateProfile };

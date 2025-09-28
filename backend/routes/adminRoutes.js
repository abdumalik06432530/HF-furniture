// routes/adminRoutes.js
import express from 'express';
import userModel from '../models/userModel.js'; // Added .js extension
import authMiddleware from '../middleware/auth.js'; // Added .js extension
import isSuperAdmin from '../middleware/isSuperAdmin.js'; // Added .js extension
const router = express.Router();

// Get all admins (super admin only)
router.get('/', authMiddleware, isSuperAdmin, async (req, res) => {
  try {
    const admins = await userModel.find({ role: { $in: ['admin', 'superadmin'] } })
      .select('-password -cartData');
    res.json(admins);
  } catch (err) {
    console.error('Error fetching admins:', err); // Added logging
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new admin (super admin only)
router.post('/', authMiddleware, isSuperAdmin, async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    
    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Validate role
    if (!['admin', 'superadmin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    // Check if user already exists
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newAdmin = new userModel({
      name,
      email,
      password,
      phone,
      role
    });

    await newAdmin.save();
    
    // Don't send sensitive data back - create a new object instead of modifying
    const adminResponse = {
      _id: newAdmin._id,
      name: newAdmin.name,
      email: newAdmin.email,
      phone: newAdmin.phone,
      role: newAdmin.role,
      createdAt: newAdmin.createdAt,
      updatedAt: newAdmin.updatedAt
    };
    
    res.status(201).json(adminResponse);
  } catch (err) {
    console.error('Error creating admin:', err); // Added logging
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete admin (super admin only)
router.delete('/:id', authMiddleware, isSuperAdmin, async (req, res) => {
  try {
    // Prevent deleting yourself
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete yourself' });
    }
    
    const admin = await userModel.findByIdAndDelete(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    
    res.json({ message: 'Admin deleted successfully' });
  } catch (err) {
    console.error('Error deleting admin:', err); // Added logging
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid admin ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
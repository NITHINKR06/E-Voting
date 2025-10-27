const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

// Create default admin user if none exists
const createDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({ isAdmin: true });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123456', 12);
      const defaultAdmin = new User({
        name: 'Default Admin',
        rollNumber: 'ADMIN001',
        email: 'admin@nmamit.in',
        password: hashedPassword,
        isAdmin: true,
        isVerified: true
      });
      await defaultAdmin.save();
      console.log('Default admin user created: admin@nmamit.in / admin123456');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};

// Initialize default admin on module load
createDefaultAdmin();

// Admin Login (separate from regular user login)
exports.adminLogin = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Validation failed', 
      errors: errors.array() 
    });
  }

  const { email, password } = req.body;
  
  try {
    // Find user and check if they are admin
    const user = await User.findOne({ email, isAdmin: true });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid admin credentials' });
    }

    // Generate admin token with longer expiry
    const token = jwt.sign(
      { 
        id: user._id, 
        isAdmin: true,
        adminLevel: 'super' // You can add different admin levels
      }, 
      process.env.JWT_SECRET || 'fallback-secret-key-for-development', 
      { expiresIn: '8h' } // Longer session for admins
    );

    res.json({ 
      message: 'Admin login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create Admin User (for system administrators)
exports.createAdmin = async (req, res) => {
  const { name, rollNumber, email, password, adminSecret } = req.body;
  
  // Check admin secret (bypass for development if not set)
  if (process.env.ADMIN_CREATION_SECRET && adminSecret !== process.env.ADMIN_CREATION_SECRET) {
    return res.status(403).json({ message: 'Invalid admin creation secret' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12); // Higher salt rounds for admin
    const adminUser = new User({ 
      name, 
      rollNumber, 
      email, 
      password: hashedPassword,
      isAdmin: true,
      isVerified: true // Auto-verify admin users
    });
    
    await adminUser.save();
    
    res.json({ 
      message: 'Admin user created successfully',
      user: {
        name: adminUser.name,
        email: adminUser.email,
        isAdmin: adminUser.isAdmin
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin Profile Update
exports.updateAdminProfile = async (req, res) => {
  const { name, rollNumber } = req.body;
  const adminId = req.user.id;

  try {
    const admin = await User.findByIdAndUpdate(
      adminId,
      { name, rollNumber },
      { new: true }
    ).select('name email rollNumber isAdmin');

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json({ 
      message: 'Admin profile updated successfully',
      user: admin
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Change Admin Password
exports.changeAdminPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const adminId = req.user.id;

  try {
    const admin = await User.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Verify current password
    if (!(await bcrypt.compare(currentPassword, admin.password))) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    admin.password = hashedNewPassword;
    await admin.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Admin Info
exports.getAdminInfo = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id)
      .select('name email rollNumber isAdmin createdAt');
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json({ admin });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.createSuperAdmin = async (req, res) => {
  const { name, rollNumber, email, password, secretKey } = req.body;
  
  // Check for secret key to prevent unauthorized admin creation
  if (secretKey !== process.env.SUPER_ADMIN_SECRET || !process.env.SUPER_ADMIN_SECRET) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  try {
    // Check if any admin already exists
    const existingAdmin = await User.findOne({ isAdmin: true });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin user already exists' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
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
      message: 'Super admin created successfully',
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

exports.checkAdminExists = async (req, res) => {
  try {
    const adminExists = await User.findOne({ isAdmin: true });
    res.json({ adminExists: !!adminExists });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

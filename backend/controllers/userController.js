import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validateEmail, validatePassword } from '../utils/validation.js';

const signup = async (req, res) => {
  const { name, email, password, role = 'user' } = req.body;

  try {
    // Input validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'All fields are required'
      });
    }

    // Email validation
    if (!validateEmail(email)) {
      return res.status(400).json({
        message: 'Please provide a valid email address'
      });
    }

    // Password validation
    if (!validatePassword(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long and contain at least one number and one letter'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: 'An account with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      lastLogin: new Date(),
      status: 'active'
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id,
        role: user.role 
      }, 
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return success response
    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      message: 'An error occurred during registration. Please try again.'
    });
  }
};

const signin = async (req, res) => {
  const { email, password, rememberMe } = req.body;

  try {
    // Input validation
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      });
    }

    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Check if account is active
    if (user.status !== 'active') {
      return res.status(401).json({
        message: 'Your account has been deactivated. Please contact support.'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id,
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: rememberMe ? '30d' : '24h' }
    );

    // Return success response
    res.status(200).json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin
      }
    });

  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({
      message: 'An error occurred during login. Please try again.'
    });
  }
};

// Get user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      message: 'An error occurred while fetching profile'
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  const { name, email, currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // Update basic info
    if (name) user.name = name;
    
    // Update email
    if (email && email !== user.email) {
      if (!validateEmail(email)) {
        return res.status(400).json({
          message: 'Please provide a valid email address'
        });
      }
      
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({
          message: 'This email is already in use'
        });
      }
      user.email = email;
    }

    // Update password
    if (currentPassword && newPassword) {
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          message: 'Current password is incorrect'
        });
      }

      if (!validatePassword(newPassword)) {
        return res.status(400).json({
          message: 'New password must be at least 8 characters long and contain at least one number and one letter'
        });
      }

      user.password = await bcrypt.hash(newPassword, 12);
    }

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      message: 'An error occurred while updating profile'
    });
  }
};

export { signup, signin, getProfile, updateProfile };

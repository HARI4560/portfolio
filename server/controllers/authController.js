import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import logger from '../utils/logger.js';
import { sendSecurityAlertEmail } from '../utils/sendEmail.js';

// Generate access token (short-lived)
const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '15m',
  });
};

// Generate refresh token (long-lived)
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
  });
};

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find admin with password included
    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) {
      await logger('LOGIN_FAILED', null, req, { email, reason: 'Invalid email' });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if account is locked
    if (admin.isLocked) {
      const minutesLeft = Math.ceil((admin.lockUntil - Date.now()) / 60000);
      await logger('LOGIN_FAILED', admin._id, req, { reason: 'Account locked' });
      return res.status(401).json({
        message: `Account is temporarily locked. Please try again in ${minutesLeft} minute(s).`
      });
    }

    // If lockout expired but failed attempts is still >= 3, reset it so they get 3 new tries
    if (admin.failedLoginAttempts >= 3 && !admin.isLocked) {
      admin.failedLoginAttempts = 0;
      admin.lockUntil = undefined;
    }

    // Check password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      admin.failedLoginAttempts += 1;

      // Lock account after 3 attempts for 30 minutes
      if (admin.failedLoginAttempts >= 3) {
        admin.lockUntil = Date.now() + 30 * 60 * 1000; // 30 minutes
        await logger('ACCOUNT_LOCKED', admin._id, req, { reason: 'Exceeded max failed login attempts' });

        // Send alert email
        await sendSecurityAlertEmail({
          adminEmail: admin.email,
          eventType: 'ACCOUNT_LOCKED',
          ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown',
          userAgent: req.headers['user-agent'] || 'unknown',
          details: { reason: 'Exceeded 3 failed login attempts' }
        });

        await admin.save();
        return res.status(401).json({ message: 'Account locked due to 3 failed attempts. Try again in 30 minutes.' });
      }

      await admin.save();
      const attemptsLeft = 3 - admin.failedLoginAttempts;
      await logger('LOGIN_FAILED', admin._id, req, { reason: 'Invalid password', attempts: admin.failedLoginAttempts });
      return res.status(401).json({ message: `Invalid credentials. ${attemptsLeft} attempt(s) left.` });
    }

    // Reset failed login attempts on success
    if (admin.failedLoginAttempts > 0) {
      admin.failedLoginAttempts = 0;
      admin.lockUntil = undefined;
      await admin.save();
    }

    // Generate tokens
    const accessToken = generateAccessToken(admin._id);
    const refreshToken = generateRefreshToken(admin._id);

    // Set refresh token in HttpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    await logger('LOGIN_SUCCESS', admin._id, req);

    res.json({
      accessToken,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public (requires refresh cookie)
const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(401).json({ message: 'Admin not found' });
    }

    const newAccessToken = generateAccessToken(admin._id);

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

// @desc    Logout admin
// @route   POST /api/auth/logout
// @access  Public
const logout = async (req, res) => {
  res.cookie('refreshToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(0),
  });

  res.json({ message: 'Logged out successfully' });
};

// @desc    Get current admin
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  res.json({
    admin: {
      id: req.admin._id,
      name: req.admin.name,
      email: req.admin.email,
      role: req.admin.role,
    },
  });
};

export { login, refreshAccessToken, logout, getMe };

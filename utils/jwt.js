const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.message.includes('JWT_SECRET')) {
      console.error('❌ JWT Configuration Error:', error.message);
    }
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken
};

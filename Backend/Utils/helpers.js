const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Send token response
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  // Remove password from output
  user.password = undefined;

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      data: user
    });
};

// Calculate pagination info
const getPaginationInfo = (page, limit, total) => {
  const currentPage = parseInt(page, 10) || 1;
  const itemsPerPage = parseInt(limit, 10) || 20;
  const totalPages = Math.ceil(total / itemsPerPage);

  return {
    currentPage,
    totalPages,
    totalItems: total,
    itemsPerPage,
    hasNext: currentPage * itemsPerPage < total,
    hasPrev: currentPage > 1
  };
};

// Validate file upload
const validateFileUpload = (file, allowedTypes = ['image/jpeg', 'image/png', 'image/gif'], maxSize = 5 * 1024 * 1024) => {
  if (!file) {
    return { valid: false, message: 'No file uploaded' };
  }

  if (!allowedTypes.includes(file.mimetype)) {
    return { valid: false, message: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}` };
  }

  if (file.size > maxSize) {
    return { valid: false, message: `File size too large. Maximum size: ${maxSize / (1024 * 1024)}MB` };
  }

  return { valid: true };
};

// Format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Clean object - remove null and undefined values
const cleanObject = (obj) => {
  return Object.keys(obj).reduce((acc, key) => {
    if (obj[key] != null) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
};

module.exports = {
  generateToken,
  sendTokenResponse,
  getPaginationInfo,
  validateFileUpload,
  formatFileSize,
  cleanObject
};
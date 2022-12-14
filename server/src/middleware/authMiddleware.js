const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming User model is defined

/**
 * @function protect
 * @description Middleware to protect routes, ensuring only authenticated users can access them.
 *              It verifies the JWT token sent in the Authorization header.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const protect = async (req, res, next) => {
  let token;

  // Check if the Authorization header exists and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token from the header
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using the JWT secret from environment variables
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by ID from the decoded token payload
      // Select '-password' to exclude the password hash from the user object
      req.user = await User.findById(decoded.id).select('-password');

      // If no user is found, the token might be valid but for a non-existent user
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      // Log the error for debugging purposes
      console.error('Token verification error:', error.message);

      // Return an error if the token is invalid or expired
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // If no token is provided in the header
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

/**
 * @function authorizeRoles
 * @description Middleware to restrict access to routes based on user roles.
 *              It takes an array of allowed roles as arguments.
 * @param {...string} roles - An array of roles that are allowed to access the route.
 * @returns {Function} Express middleware function
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Check if the authenticated user's role is included in the allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    // If the user's role is allowed, proceed to the next middleware or route handler
    next();
  };
};

module.exports = { protect, authorizeRoles };
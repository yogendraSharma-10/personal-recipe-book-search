```javascript
/**
 * @file server/src/index.js
 * @description Main entry point for the Personal Recipe Book & Search API server.
 * This file sets up the Express application, connects to the database,
 * configures middleware, defines API routes, and starts the server.
 */

// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db'); // Database connection utility
const authRoutes = require('./routes/authRoutes'); // Authentication routes
const recipeRoutes = require('./routes/recipeRoutes'); // Recipe management routes

// Initialize the Express application
const app = express();

// Connect to the MongoDB database
connectDB();

// --- Middleware Setup ---

// Enable Cross-Origin Resource Sharing (CORS)
// In a production environment, it's best practice to restrict `origin` to specific client URLs.
// For development, '*' allows all origins.
app.use(cors({
  origin: process.env.CLIENT_URL || '*', // Allow requests from the client application
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true // Allow sending cookies/auth headers
}));

// Helmet helps secure Express apps by setting various HTTP headers.
app.use(helmet());

// Morgan logs HTTP requests to the console. 'dev' is a concise output format.
app.use(morgan('dev'));

// Body parser middleware to parse JSON request bodies
app.use(express.json());

// --- Routes ---

/**
 * @route GET /
 * @description Basic health check for the root URL.
 * @access Public
 */
app.get('/', (req, res) => {
  res.send('Personal Recipe Book API is running...');
});

/**
 * @route GET /api/health
 * @description Health check endpoint for service monitoring.
 * This can be used by other services (e.g., the Real-time Markdown Previewer
 * or a gateway) to check the status of this API.
 * @access Public
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'Personal Recipe Book API',
    timestamp: new Date().toISOString(),
    database: 'connected' // Assuming connectDB handles connection status
  });
});

// Mount authentication routes under /api/auth
app.use('/api/auth', authRoutes);

// Mount recipe routes under /api/recipes
app.use('/api/recipes', recipeRoutes);

// --- Error Handling Middleware ---
/**
 * Generic error handling middleware.
 * Catches any errors thrown by preceding middleware or route handlers.
 * @param {Error} err - The error object.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function.
 */
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging
  res.status(err.statusCode || 500).json({
    message: err.message || 'An unexpected error occurred.',
    error: process.env.NODE_ENV === 'production' ? {} : err // Don't send stack trace in production
  });
});

// --- Server Initialization ---
const PORT = process.env.PORT || 5000; // Use port from environment variables or default to 5000

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`Client URL allowed: ${process.env.CLIENT_URL || '*'}`);
  // Potential future integration point:
  // If the Real-time Markdown Previewer needed to consume recipe data,
  // this server could expose specific endpoints for it, e.g., /api/recipes/markdown-export
});
```
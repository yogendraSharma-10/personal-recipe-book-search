require('dotenv').config(); // Load environment variables from .env file
const axios = require('axios');

// --- Configuration ---
// Edamam API credentials and base URL are loaded from environment variables.
// It's crucial for production applications to keep sensitive information
// out of the codebase and manage it via environment variables.
const EDAMAM_APP_ID = process.env.EDAMAM_APP_ID;
const EDAMAM_APP_KEY = process.env.EDAMAM_APP_KEY;
const EDAMAM_API_BASE_URL = process.env.EDAMAM_API_BASE_URL || 'https://api.edamam.com/api/recipes/v2';

// --- Input Validation & Warning
import axios from 'axios';

// Base URL for the backend API.
// This should be configured in your .env file (e.g., REACT_APP_API_BASE_URL=http://localhost:5000/api)
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// Helper function to get the authentication token from local storage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to create an Axios instance with common headers
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Searches for recipes using an external API.
 * @param {string} query - The search term for recipes.
 * @returns {Promise<Array>} A promise that resolves to an array of recipe results.
 */
export const searchExternalRecipes = async (query) => {
  try {
    const response = await axiosInstance.get(`/recipes/search?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error('Error searching external recipes:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Fetches a single recipe from the external API by its ID.
 * @param {string} id - The ID of the external recipe.
 * @returns {Promise<Object>} A promise that resolves to the recipe details.
 */
export const getExternalRecipeById = async (id) => {
  try {
    const response = await axiosInstance.get(`/recipes/external/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching external recipe with ID ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

/**
 * Fetches the current user's favorite recipes.
 * Requires authentication.
 * @returns {Promise<Array>} A promise that resolves to an array of favorite recipes.
 */
export const getFavoriteRecipes = async () => {
  try {
    const response = await axiosInstance.get('/recipes/favorites');
    return response.data;
  } catch (error) {
    console.error('Error fetching favorite recipes:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Adds a recipe to the current user's favorites.
 * Requires authentication.
 * @param {Object} recipeData - The recipe data to add to favorites.
 * @returns {Promise<Object>} A promise that resolves to the added favorite recipe.
 */
export const addFavoriteRecipe = async (recipeData) => {
  try {
    const response = await axiosInstance.post('/recipes/favorites', recipeData);
    return response.data;
  } catch (error) {
    console.error('Error adding recipe to favorites:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Removes a recipe from the current user's favorites.
 * Requires authentication.
 * @param {string} recipeId - The ID of the recipe to remove from favorites.
 * @returns {Promise<Object>} A promise that resolves to a success message.
 */
export const removeFavoriteRecipe = async (recipeId) => {
  try {
    const response = await axiosInstance.delete(`/recipes/favorites/${recipeId}`);
    return response.data;
  } catch (error) {
    console.error(`Error removing recipe ${recipeId} from favorites:`, error.response?.data || error.message);
    throw error;
  }
};

/**
 * Fetches all custom recipes created by the current user.
 * Requires authentication.
 * @returns {Promise<Array>} A promise that resolves to an array of custom recipes.
 */
export const getCustomRecipes = async () => {
  try {
    const response = await axiosInstance.get('/recipes/custom');
    return response.data;
  } catch (error) {
    console.error('Error fetching custom recipes:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Fetches a single custom recipe by its ID.
 * Requires authentication.
 * @param {string} id - The ID of the custom recipe.
 * @returns {Promise<Object>} A promise that resolves to the custom recipe details.
 */
export const getCustomRecipeById = async (id) => {
  try {
    const response = await axiosInstance.get(`/recipes/custom/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching custom recipe with ID ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

/**
 * Adds a new custom recipe for the current user.
 * Requires authentication.
 * @param {Object} recipeData - The data for the new custom recipe.
 * @returns {Promise<Object>} A promise that resolves to the newly created custom recipe.
 */
export const addCustomRecipe = async (recipeData) => {
  try {
    const response = await axiosInstance.post('/recipes/custom', recipeData);
    return response.data;
  } catch (error) {
    console.error('Error adding custom recipe:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Updates an existing custom recipe.
 * Requires authentication.
 * @param {string} id - The ID of the custom recipe to update.
 * @param {Object} recipeData - The updated data for the custom recipe.
 * @returns {Promise<Object>} A promise that resolves to the updated custom recipe.
 */
export const updateCustomRecipe = async (id, recipeData) => {
  try {
    const response = await axiosInstance.put(`/recipes/custom/${id}`, recipeData);
    return response.data;
  } catch (error) {
    console.error(`Error updating custom recipe with ID ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

/**
 * Deletes a custom recipe.
 * Requires authentication.
 * @param {string} id - The ID of the custom recipe to delete.
 * @returns {Promise<Object>} A promise that resolves to a success message.
 */
export const deleteCustomRecipe = async (id) => {
  try {
    const response = await axiosInstance.delete(`/recipes/custom/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting custom recipe with ID ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

// Note on interconnected systems:
// While this service specifically handles recipe-related API calls for the Personal Recipe Book,
// in a larger microservice architecture, other services (like the Real-time Markdown Previewer)
// might have their own dedicated API service files (e.g., `markdownService.js`)
// that interact with their respective backends.
// If there were cross-service calls (e.g., a recipe description needing markdown rendering),
// this service might call `markdownService` or the backend might handle it.
// For this file, we focus solely on the Recipe Book's backend interactions.
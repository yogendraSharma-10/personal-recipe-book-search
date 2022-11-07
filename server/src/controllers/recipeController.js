```javascript
const Recipe = require('../models/Recipe');
const User = require('../models/User');
const externalApi = require('../utils/externalApi');
const mongoose = require('mongoose');

/**
 * @desc    Search for recipes from the external API
 * @route   GET /api/recipes/search
 * @access  Public
 */
exports.searchExternalRecipes = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: 'Search query is required.' });
  }

  try {
    const recipes = await externalApi.searchRecipes(query);
    res.status(200).json(recipes);
  } catch (error) {
    console.error('Error searching external recipes:', error.message);
    res.status(500).json({ message: 'Failed to search external recipes.', error: error.message });
  }
};

/**
 * @desc    Get a single recipe by ID (can be custom or external)
 * @route   GET /api/recipes/:id
 * @access  Public (for external), Private (for custom if not public)
 *
 * Note: This endpoint primarily serves custom recipes. For external recipes,
 * the client should ideally have enough data from the search results, or
 * a dedicated external detail endpoint could be created if the external API
 * supports fetching by ID. For simplicity, this will fetch custom recipes.
 */
exports.getRecipeById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid recipe ID format.' });
  }

  try {
    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found.' });
    }

    // Optional: If recipes can be public, no user check needed.
    // If custom recipes are strictly private, ensure it belongs to the user.
    // For now, let's assume custom recipes are user-specific unless explicitly made public.
    if (recipe.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this recipe.' });
    }

    res.status(200).json(recipe);
  } catch (error) {
    console.error('Error fetching custom recipe by ID:', error.message);
    res.status(500).json({ message: 'Failed to fetch recipe.', error: error.message });
  }
};

/**
 * @desc    Add a new custom recipe
 * @route   POST /api/recipes/custom
 * @access  Private
 */
exports.addCustomRecipe = async (req, res) => {
  const { title, description, ingredients, instructions, imageUrl, prepTime, cookTime, servings, tags } = req.body;

  // Basic validation
  if (!title || !ingredients || !instructions) {
    return res.status(400).json({ message: 'Please provide title, ingredients, and instructions.' });
  }

  try {
    const newRecipe = new Recipe({
      user: req.user.id,
      title,
      description,
      ingredients,
      instructions,
      imageUrl,
      prepTime,
      cookTime,
      servings,
      tags,
    });

    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (error) {
    console.error('Error adding custom recipe:', error.message);
    res.status(500).json({ message: 'Failed to add custom recipe.', error: error.message });
  }
};

/**
 * @desc    Update an existing custom recipe
 * @route   PUT /api/recipes/custom/:id
 * @access  Private
 */
exports.updateCustomRecipe = async (req, res) => {
  const { id } = req.params;
  const { title, description, ingredients, instructions, imageUrl, prepTime, cookTime, servings, tags } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid recipe ID format.' });
  }

  try {
    let recipe = await Recipe.findById(id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found.' });
    }

    // Ensure the logged-in user owns the recipe
    if (recipe.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this recipe.' });
    }

    // Update fields
    recipe.title = title || recipe.title;
    recipe.description = description || recipe.description;
    recipe.ingredients = ingredients || recipe.ingredients;
    recipe.instructions = instructions || recipe.instructions;
    recipe.imageUrl = imageUrl || recipe.imageUrl;
    recipe.prepTime = prepTime || recipe.prepTime;
    recipe.cookTime = cookTime || recipe.cookTime;
    recipe.servings = servings || recipe.servings;
    recipe.tags = tags || recipe.tags;
    recipe.updatedAt = Date.now();

    const updatedRecipe = await recipe.save();
    res.status(200).json(updatedRecipe);
  } catch (error) {
    console.error('Error updating custom recipe:', error.message);
    res.status(500).json({ message: 'Failed to update custom recipe.', error: error.message });
  }
};

/**
 * @desc    Delete a custom recipe
 * @route   DELETE /api/recipes/custom/:id
 * @access  Private
 */
exports.deleteCustomRecipe = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid recipe ID format.' });
  }

  try {
    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found.' });
    }

    // Ensure the logged-in user owns the recipe
    if (recipe.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this recipe.' });
    }

    await Recipe.deleteOne({ _id: id }); // Use deleteOne for clarity
    res.status(200).json({ message: 'Recipe removed successfully.' });
  } catch (error) {
    console.error('Error deleting custom recipe:', error.message);
    res.status(500).json({ message: 'Failed to delete custom recipe.', error: error.message });
  }
};

/**
 * @desc    Get all custom recipes for the authenticated user
 * @route   GET /api/recipes/custom
 * @access  Private
 */
exports.getUserCustomRecipes = async (req, res) => {
  try {
    const customRecipes = await Recipe.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(customRecipes);
  } catch (error) {
    console.error('Error fetching user custom recipes:', error.message);
    res.status(500).json({ message: 'Failed to fetch user custom recipes.', error: error.message });
  }
};

/**
 * @desc    Get all favorite recipes for the authenticated user
 * @route   GET /api/recipes/favorites
 * @access  Private
 */
exports.getFavoriteRecipes = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('favoriteRecipes');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const favoriteRecipes = [];
    const customRecipeIds = [];

    // Separate custom recipe IDs from external recipe data
    user.favoriteRecipes.forEach(fav => {
      if (fav.type === 'custom' && fav.recipeId) {
        customRecipeIds.push(fav.recipeId);
      } else if (fav.type === 'external' && fav.externalId) {
        // For external recipes, we store enough metadata to display them directly
        favoriteRecipes.push({
          _id: fav.externalId, // Use externalId as _id for consistency on client
          type: 'external',
          title: fav.title,
          imageUrl: fav.imageUrl,
          sourceUrl: fav.sourceUrl,
          // Add other relevant fields stored for external recipes
        });
      }
    });

    // Fetch custom recipes from the database
    if (customRecipeIds.length > 0) {
      const customFavs = await Recipe.find({ _id: { $in: customRecipeIds }, user: req.user.id });
      customFavs.forEach(recipe => {
        favoriteRecipes.push({ ...recipe.toObject(), type: 'custom' });
      });
    }

    res.status(200).json(favoriteRecipes);
  } catch (error) {
    console.error('Error fetching favorite recipes:', error.message);
    res.status(500).json({ message: 'Failed to fetch favorite recipes.', error: error.message });
  }
};

/**
 * @desc    Toggle a recipe (custom or external) as favorite/unfavorite
 * @route   POST /api/recipes/favorites/toggle
 * @access  Private
 */
exports.toggleFavoriteRecipe = async (req, res) => {
  const { type, recipeId, externalId, title, imageUrl, sourceUrl } = req.body; // recipeId for custom, externalId + metadata for external

  if (!type || (type === 'custom' && !recipeId) || (type === 'external' && (!externalId || !title))) {
    return res.status(400).json({ message: 'Invalid request: type and appropriate ID/metadata are required.' });
  }

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    let isFavorite = false;
    let favoriteIndex = -1;

    if (type === 'custom') {
      if (!mongoose.Types.ObjectId.isValid(recipeId)) {
        return res.status(400).json({ message: 'Invalid custom recipe ID format.' });
      }
      favoriteIndex = user.favoriteRecipes.findIndex(
        fav => fav.type === 'custom' && fav.recipeId && fav.recipeId.toString() === recipeId
      );
    } else if (type === 'external') {
      favoriteIndex = user.favoriteRecipes.findIndex(
        fav => fav.type === 'external' && fav.externalId === externalId
      );
    }

    if (favoriteIndex !== -1) {
      // Recipe is already a favorite, so remove it
      user.favoriteRecipes.splice(favoriteIndex, 1);
      isFavorite = false;
    } else {
      // Recipe is not a favorite, so add it
      if (type === 'custom') {
        // Verify custom recipe exists and belongs to user (optional, but good for integrity)
        const customRecipe = await Recipe.findById(recipeId);
        if (!customRecipe) {
          return res.status(404).json({ message: 'Custom recipe not found.' });
        }
        // If custom recipes are strictly private, ensure it belongs to the user or is public
        // if (customRecipe.user.toString() !== req.user.id) {
        //   return res.status(403).json({ message: 'Not authorized to favorite this custom recipe.' });
        // }
        user.favoriteRecipes.push({ type: 'custom', recipeId: new mongoose.Types.ObjectId(recipeId) });
      } else if (type === 'external')
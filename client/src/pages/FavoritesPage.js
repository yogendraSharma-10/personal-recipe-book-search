import React, { useState, useEffect, useCallback } from 'react';
import RecipeCard from '../components/RecipeCard';
import * as recipeService from '../api/recipeService';
import '../styles/App.css'; // Assuming general styles are in App.css

/**
 * FavoritesPage Component
 *
 * Displays a user's saved favorite recipes.
 * Allows users to view their favorite recipes and potentially navigate to their details.
 */
const FavoritesPage = () => {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetches the user's favorite recipes from the backend.
   * Uses useCallback to memoize the function, preventing unnecessary re-renders
   * if passed down to child components, though not strictly necessary here.
   */
  const fetchFavoriteRecipes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await recipeService.getFavoriteRecipes();
      setFavoriteRecipes(data);
    } catch (err) {
      console.error('Failed to fetch favorite recipes:', err);
      setError('Failed to load favorite recipes. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array means this function is created once

  /**
   * Effect hook to fetch favorite recipes when the component mounts.
   */
  useEffect(() => {
    fetchFavoriteRecipes();
  }, [fetchFavoriteRecipes]); // Re-run if fetchFavoriteRecipes changes (which it won't due to useCallback)

  /**
   * Handles the removal of a recipe from favorites.
   *
   * @param {string} recipeId - The ID of the recipe to remove.
   */
  const handleRemoveFavorite = async (recipeId) => {
    try {
      await recipeService.removeFavoriteRecipe(recipeId);
      // Optimistically update the UI by filtering out the removed recipe
      setFavoriteRecipes(prevRecipes => prevRecipes.filter(recipe => recipe._id !== recipeId));
      alert('Recipe removed from favorites!');
    } catch (err) {
      console.error('Failed to remove recipe from favorites:', err);
      setError('Failed to remove recipe. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="favorites-page container">
        <h2 className="page-title">Your Favorite Recipes</h2>
        <p className="loading-message">Loading your favorite recipes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="favorites-page container">
        <h2 className="page-title">Your Favorite Recipes</h2>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="favorites-page container">
      <h2 className="page-title">Your Favorite Recipes</h2>

      {favoriteRecipes.length === 0 ? (
        <div className="empty-state">
          <p>You haven't added any recipes to your favorites yet.</p>
          <p>Start exploring recipes on the <a href="/">Home Page</a>!</p>
        </div>
      ) : (
        <div className="recipe-grid">
          {favoriteRecipes.map((recipe) => (
            <RecipeCard
              key={recipe._id} // Assuming _id is available for saved recipes
              recipe={recipe}
              isFavorite={true} // All recipes on this page are favorites
              onToggleFavorite={() => handleRemoveFavorite(recipe._id)} // Pass remove handler
              showRemoveButton={true} // Explicitly show remove button
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
```javascript
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as recipeService from '../api/recipeService'; // Assuming recipeService handles API calls
import '../styles/App.css'; // For general styling

/**
 * RecipeDetailPage Component
 *
 * Displays the detailed information for a single recipe.
 * Fetches recipe data based on the ID from the URL parameters.
 * Allows users to save external recipes to favorites, or edit/delete custom recipes.
 */
const RecipeDetailPage = () => {
  const { id } = useParams(); // Get the recipe ID from the URL
  const navigate = useNavigate(); // For programmatic navigation

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false); // To track if the recipe is already a favorite

  useEffect(() => {
    /**
     * Fetches recipe details from the backend API.
     */
    const fetchRecipeDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await recipeService.getRecipeById(id);
        if (data) {
          setRecipe(data);
          // Check if the fetched recipe is already in the user's favorites.
          // This property would typically be returned by the API if the user is logged in.
          if (data.isUserFavorite) {
            setIsFavorite(true);
          }
        } else {
          setError('Recipe not found.');
        }
      } catch (err) {
        console.error('Failed to fetch recipe details:', err);
        setError('Failed to load recipe. Please try again later.');
        setRecipe(null); // Clear recipe if error occurs
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [id]); // Re-fetch if the ID in the URL changes

  /**
   * Handles saving an external recipe to the user's favorites.
   * This function assumes the `recipeService.saveRecipeToFavorites`
   * can handle transforming the external recipe data into the desired
   * format for the user's personal collection.
   */
  const handleSaveToFavorites = async () => {
    if (!recipe) return;
    try {
      const savedRecipe = await recipeService.saveRecipeToFavorites(recipe);
      console.log('Recipe saved to favorites:', savedRecipe);
      setIsFavorite(true); // Update state to reflect it's now a favorite
      // Optionally, navigate to favorites page or show a success message
      // navigate('/favorites');
    } catch (err) {
      console.error('Failed to save recipe to favorites:', err);
      setError('Failed to save recipe to favorites. Please ensure you are logged in.');
    }
  };

  /**
   * Handles navigating to the edit page for a custom recipe.
   * Passes the recipe ID as a query parameter to pre-fill the form.
   */
  const handleEditRecipe = () => {
    if (recipe && recipe._id) {
      navigate(`/add-recipe?editId=${recipe._id}`);
    }
  };

  /**
   * Handles deleting a custom recipe.
   * Prompts for confirmation before deletion.
   */
  const handleDeleteRecipe = async () => {
    if (!recipe || !recipe._id) return;
    if (window.confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) {
      try {
        await recipeService.deleteRecipe(recipe._id);
        console.log('Recipe deleted:', recipe._id);
        navigate('/favorites'); // Navigate to favorites page after successful deletion
      } catch (err) {
        console.error('Failed to delete recipe:', err);
        setError('Failed to delete recipe. Please try again.');
      }
    }
  };

  // --- Conditional Rendering for Loading, Error, and Not Found states ---
  if (loading) {
    return <div className="container recipe-detail-page">Loading recipe details...</div>;
  }

  if (error) {
    return <div className="container recipe-detail-page error-message">{error}</div>;
  }

  if (!recipe) {
    return <div className="container recipe-detail-page">Recipe not found.</div>;
  }

  // Determine if the recipe is a custom user recipe.
  // This is typically indicated by the presence of an `owner` field
  // or a specific ID format from the backend.
  const isCustomRecipe = recipe.owner !== undefined && recipe.owner !== null;

  return (
    <div className="container recipe-detail-page">
      <button onClick={() => navigate(-1)} className="btn btn-back">
        &larr;
import React from 'react';
import PropTypes from 'prop-types';
import '../styles/App.css'; // Assuming general styles are defined here, including for recipe cards and buttons.

/**
 * RecipeCard Component
 * Displays a single recipe with its image, title, source, and action buttons (save/remove).
 * It supports displaying recipes from external APIs and user-created custom recipes.
 *
 * @param {object} props - The component props.
 * @param {object} props.recipe - The recipe object to display.
 *   Expected fields: `_id` (for saved/custom), `id` (for external API), `title`, `image`,
 *   `sourceUrl`, `sourceName` (or `publisher`), `ingredients` (array).
 * @param {function} [props.onSave] - Callback function to save the recipe.
 *   This button appears if the recipe is not saved and `onSave` is provided.
 * @param {function} [props.onDelete] - Callback function to delete the recipe.
 *   This button appears if the recipe is saved or custom and `onDelete` is provided.
 * @param {boolean} [props.isSaved=false] - Indicates if the recipe is already saved by the user.
 * @param {boolean} [props.isCustom=false] - Indicates if the recipe is a user-created custom recipe.
 */
const RecipeCard = ({ recipe, onSave, onDelete, isSaved = false, isCustom = false }) => {
  // Determine the unique ID for the recipe. Prioritize MongoDB _id for saved/custom recipes,
  // otherwise use the external API's 'id'.
  const recipeId = recipe._id || recipe.id;

  // Provide a fallback image if `recipe.image` is missing or empty.
  const imageUrl = recipe.image || 'https://via.placeholder.com/300x200?text=No+Image+Available';

  // Determine the source name, checking for common field names like `sourceName` or `publisher`.
  const sourceName = recipe.sourceName || recipe.publisher || 'Unknown Source';

  // Determine the URL to the original recipe, falling back to '#' if not available.
  const recipeUrl = recipe.sourceUrl || '#';

  /**
   * Handles the click event for the "Save Recipe" button.
   * Calls the `onSave` prop function with the current recipe object.
   */
  const handleSave = () => {
    if (onSave) {
      onSave(recipe);
    }
  };

  /**
   * Handles the click event for the "Remove" or "Delete Custom Recipe" button.
   * Calls the `onDelete` prop function with the recipe's unique ID.
   */
  const handleDelete = () => {
    if (onDelete) {
      onDelete(recipeId);
    }
  };

  return (
    <div className="recipe-card" data-recipe-id={recipeId}>
      <img src={imageUrl} alt={recipe.title} className="recipe-card-image" />
      <div className="recipe-card-content">
        <h3 className="recipe-card-title">
          {/* Link to the original recipe, opening in a new tab for external links */}
          <a href={recipeUrl} target="_blank" rel="noopener noreferrer" className="recipe-card-link">
            {recipe.title}
          </a>
        </h3>
        <p className="recipe-card-source">Source: {sourceName}</p>

        {/* Display ingredient count if available */}
        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <p className="recipe-card-ingredients-count">
            Ingredients: {recipe.ingredients.length}
          </p>
        )}

        <div className="recipe-card-actions">
          {/* Conditionally render the "Save Recipe" button */}
          {!isSaved && onSave && (
            <button onClick={handleSave} className="btn btn-primary">
              Save Recipe
            </button>
          )}

          {/* Conditionally render the "Remove" or "Delete Custom Recipe" button */}
          {(isSaved || isCustom) && onDelete && (
            <button onClick={handleDelete} className="btn btn-danger">
              {isCustom ? 'Delete Custom Recipe' : 'Remove from Saved'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Define PropTypes for type checking and documentation.
RecipeCard.propTypes = {
  recipe: PropTypes.shape({
    _id: PropTypes.string, // MongoDB ID for saved/custom recipes
    id: PropTypes.string, // External API ID
    title: PropTypes.string.isRequired, // Recipe title is mandatory
    image: PropTypes.string, // URL to recipe image
    sourceUrl: PropTypes.string, // URL to the original recipe
    sourceName: PropTypes.string, // Name of the recipe source
    publisher: PropTypes.string, // Alternative field for source name
    ingredients: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          quantity: PropTypes.number,
          unit: PropTypes.string,
        }),
      ])
    ), // Array of ingredients (can be strings or objects)
  }).isRequired,
  onSave: PropTypes.func, // Function to call when saving a recipe
  onDelete: PropTypes.func, // Function to call when deleting a recipe
  isSaved: PropTypes.bool, // Flag indicating if the recipe is saved
  isCustom: PropTypes.bool, // Flag indicating if the recipe is custom
};

export default RecipeCard;
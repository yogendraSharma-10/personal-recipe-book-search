import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import RecipeCard from '../components/RecipeCard';
import * as recipeService from '../api/recipeService'; // Import all functions from recipeService

/**
 * HomePage Component
 *
 * This component serves as the main landing page for the application.
 * It allows users to search for recipes using an external API and displays the results.
 * It manages search state, loading indicators, and error messages.
 */
const HomePage = () => {
  // State to store the list of recipes fetched from the API
  const [recipes, setRecipes] = useState([]);
  // State to manage the loading status during API calls
  const [loading, setLoading] = useState(false);
  // State to store any error messages that occur during API calls
  const [error, setError] = useState(null);
  // State to track if a search has been performed by the user
  const [searchPerformed, setSearchPerformed] = useState(false);
  // State to store the current search term
  const [currentSearchTerm, setCurrentSearchTerm] = useState('');

  /**
   * Fetches recipes based on a given query.
   * Sets loading state, handles API calls, and updates recipes or error state.
   * @param {string} query The search term for recipes.
   */
  const fetchRecipes = async (query) => {
    setLoading(true);
    setError(null); // Clear previous errors
    setSearchPerformed(true); // Indicate that a search has been initiated
    setCurrentSearchTerm(query); // Store the current search term

    try {
      const data = await recipeService.searchRecipes(query);
      setRecipes(data);
    } catch (err) {
      console.error('Failed to fetch recipes:', err);
      setError('Failed to fetch recipes. Please try again later.');
      setRecipes([]); // Clear recipes on error
    } finally {
      setLoading(false);
    }
  };

  // Optional: You could add an effect here to fetch some "trending" or "featured" recipes on initial load
  // if you had a specific API endpoint for that. For now, the page starts with just the search bar.
  // useEffect(() => {
  //   // Example: fetchRecipes('popular'); // Fetch some default recipes on mount
  // }, []);

  return (
    <div className="home-page container">
      <h1 className="page-title">Discover Delicious Recipes</h1>
      <p className="page-description">
        Search for millions of recipes from around the world.
      </p>

      {/* SearchBar component to handle user input and trigger searches */}
      <SearchBar onSearch={fetchRecipes} />

      <div className="recipe-results">
        {loading && <p className="loading-message">Loading recipes...</p>}

        {error && <p className="error-message">{error}</p>}

        {!loading && !error && searchPerformed && recipes.length === 0 && (
          <p className="no-results-message">
            No recipes found for "{currentSearchTerm}". Try a different search term!
          </p>
        )}

        {!loading && !error && !searchPerformed && (
          <p className="initial-message">
            Enter an ingredient or dish name above to start searching for recipes.
          </p>
        )}

        {/* Display fetched recipes using RecipeCard components */}
        <div className="recipe-grid">
          {!loading && !error && recipes.length > 0 && recipes.map((recipe) => (
            <RecipeCard key={recipe.id || recipe._id} recipe={recipe} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
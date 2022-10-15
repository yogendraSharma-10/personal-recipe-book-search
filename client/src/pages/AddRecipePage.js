```javascript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addCustomRecipe } from '../api/recipeService'; // Import the specific API function
import '../styles/App.css'; // Global styles for the application

/**
 * AddRecipePage Component
 *
 * This component provides a form for users to add their own custom recipes to their personal collection.
 * It handles form input, submission, displays loading and error states, and navigates the user
 * to the newly created recipe's detail page upon successful submission.
 */
const AddRecipePage = () => {
  const navigate = useNavigate();

  // State to manage form input values
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: '', // Expects newline-separated ingredients
    instructions: '', // Expects newline-separated instructions
    prepTime: '', // In minutes
    cookTime: '', // In minutes
    servings: '',
    imageUrl: '',
    category: '', // e.g., "Breakfast", "Dinner", "Dessert"
    tags: '', // Expects comma-separated tags
  });

  // State for managing UI feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  /**
   * Handles changes to form input fields.
   * Updates the formData state with the new value.
   * @param {Object} e - The event object from the input change.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  /**
   * Handles the form submission.
   * Prevents default form behavior, calls the API to add the recipe,
   * and handles success/error states.
   * @param {Object} e -
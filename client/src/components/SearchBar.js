import React, { useState } from 'react';
import '../../src/styles/App.css'; // Assuming App.css contains general styles, or create SearchBar.css

/**
 * @typedef {object} SearchBarProps
 * @property {(query: string) => void} onSearch - Callback function to execute when a search is performed.
 * @property {string} [initialQuery=''] - Optional initial search query to pre-fill the input.
 * @property {string} [placeholder='Search recipes...'] - Optional placeholder text for the search input.
 */

/**
 * SearchBar Component
 *
 * A reusable component for searching recipes. It manages its own input state
 * and calls an `onSearch` prop with the current query when the search button is clicked
 * or the form is submitted.
 *
 * @param {SearchBarProps} props - The properties for the SearchBar component.
 * @returns {JSX.Element} The SearchBar component.
 */
const SearchBar = ({ onSearch, initialQuery = '', placeholder = 'Search recipes...' }) => {
  // State to hold the current value of the search input
  const [searchTerm, setSearchTerm] = useState(initialQuery);

  /**
   * Handles changes to the search input field.
   * Updates the `searchTerm` state with the new input value.
   * @param {React.ChangeEvent<HTMLInputElement>} event - The change event from the input.
   */
  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  /**
   * Handles the form submission or search button click.
   * Prevents the default form submission behavior, then calls the `onSearch` prop
   * with the current `searchTerm`.
   * @param {React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>} event - The form submit or button click event.
   */
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent page reload on form submission
    if (searchTerm.trim()) { // Only search if the term is not empty or just whitespace
      onSearch(searchTerm.trim());
    }
  };

  return (
    <form className="search-bar-container" onSubmit={handleSubmit}>
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleChange}
        aria-label="Search for recipes"
      />
      <button type="submit" className="search-button">
        Search
      </button>
    </form>
  );
};

export default SearchBar;
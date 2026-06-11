import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/App.css'; // Assuming global styles are imported here

/**
 * @typedef {object} NavbarProps
 * @property {boolean} isAuthenticated - Indicates if the user is currently authenticated.
 * @property {function} onLogout - Callback function to handle user logout.
 */

/**
 * Navbar component for navigation throughout the application.
 * Displays links to different pages and handles user authentication state (login/logout).
 * Also includes a link to an external microservice (Real-time Markdown Previewer).
 *
 * @param {NavbarProps} props - The properties for the Navbar component.
 * @returns {JSX.Element} The rendered Navbar component.
 */
const Navbar = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();

  /**
   * Handles the logout process.
   * Calls the `onLogout` prop and redirects the user to the home page.
   */
  const handleLogout = () => {
    if (onLogout) {
      onLogout(); // Execute the logout action passed from parent
    }
    navigate('/'); // Redirect to home page after logout
  };

  return (
    <nav className="navbar">
      {/* Brand/Logo link to the home page */}
      <div className="navbar-brand">
        <Link to="/">RecipeBook</Link>
      </div>

      {/* Navigation links */}
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/" className="nav-link">Home</Link>
        </li>
        <li className="nav-item">
          <Link to="/favorites" className="nav-link">Favorites</Link>
        </li>
        <li className="nav-item">
          <Link to="/add-recipe" className="nav-link">Add Recipe</Link>
        </li>

        {/* Conditional rendering based on authentication status */}
        {isAuthenticated ? (
          <li className="nav-item">
            {/* Logout button for authenticated users */}
            <button onClick={handleLogout} className="nav-link nav-button">
              Logout
            </button>
          </li>
        ) : (
          <li className="nav-item">
            {/* Login link for unauthenticated users */}
            <Link to="/login" className="nav-link">Login</Link>
          </li>
        )}

        {/* Cross-project context: Link to the Real-time Markdown Previewer microservice */}
        {/* The URL for the external service is expected to be configured in .env */}
        <li className="nav-item external-link">
          <a
            href={process.env.REACT_APP_MARKDOWN_PREVIEWER_URL || "#"}
            target="_blank"
            rel="noopener noreferrer" // Security best practice for external links
            className="nav-link"
            aria-label="Go to Real-time Markdown Previewer"
          >
            Markdown Previewer
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
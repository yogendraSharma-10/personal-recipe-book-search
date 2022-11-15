import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Import main application pages
import HomePage from './pages/HomePage';
// import RecipeDetailPage from './pages/RecipeDetailPage'; // To be implemented for viewing individual recipes
// import AddRecipePage from './pages/AddRecipePage';       // To be implemented for adding custom recipes
// import MyRecipesPage from './pages/MyRecipesPage';       // To be implemented for viewing user's saved/custom recipes
// import LoginPage from './pages/LoginPage';               // To be implemented for user authentication
// import RegisterPage from './pages/RegisterPage';           // To be implemented for user registration
// import NotFoundPage from './pages/NotFoundPage';         // To be implemented for 404 errors

// Import global application styles
import './styles/App.css';

/**
 * App component serves as the main entry point for the client-side React application.
 * It sets up routing, global layout (header, footer), and manages top-level application state
 * such as user authentication.
 */
function App() {
  // State to simulate user authentication status.
  // In a real production app, this would typically be managed via Context API,
  // Redux, Zustand, or a similar state management solution, often initialized
  // by checking for a token in localStorage or a session cookie.
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // State to hold basic user information if authenticated.
  const [user, setUser] = useState(null);

  /**
   * useEffect hook to perform actions on component mount, such as checking
   * for an existing user session or authentication token.
   */
  useEffect(() => {
    // Example: Check for a token in localStorage or make an API call to /api/auth/me
    // if (localStorage.getItem('authToken')) {
    //   // Validate token and set isAuthenticated/user state
    //   // For now, we'll just log a message.
    //   console.log('Checking for existing user session...');
    //   // Simulate a successful auto-login for demonstration
    //   // setIsAuthenticated(true);
    //   // setUser({ username: 'DemoUser', id: 'demo-id' });
    // }
  }, []); // Empty dependency array ensures this runs only once on mount

  /**
   * Dummy login handler for demonstration purposes.
   * In a real app, this would involve an API call to the backend.
   */
  const handleLogin = () => {
    setIsAuthenticated(true);
    setUser({ username: 'testuser', id: 'user123' }); // Mock user data
    console.log('User logged in (demo).');
    // Navigate to a protected route or home page after login
    // navigate('/');
  };

  /**
   * Dummy logout handler for demonstration purposes.
   * In a real app, this would involve clearing tokens/sessions.
   */
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    // localStorage.removeItem('authToken'); // Clear token
    console.log('User logged out (demo).');
    // navigate('/login'); // Redirect to login page
  };

  return (
    <Router>
      <div className="App">
        {/* Application Header with Navigation */}
        <header className="app-header">
          <nav className="navbar">
            {/* Brand/Logo link to home page */}
            <Link to="/" className="nav-brand">Personal Recipe Book</Link>

            {/* Navigation links */}
            <ul className="nav-links">
              <li><Link to="/">Home</Link></li>

              {/* Conditional rendering based on authentication status */}
              {isAuthenticated ? (
                <>
                  {/* Links for authenticated users */}
                  <li><Link to="/my-recipes">My Recipes</Link></li>
                  <li><Link to="/recipes/new">Add Recipe</Link></li>
                  <li>
                    <button onClick={handleLogout} className="nav-button logout-button">
                      Logout ({user?.username})
                    </button>
                  </li>
                </>
              ) : (
                <>
                  {/* Links for unauthenticated users */}
                  {/* <li><Link to="/login">Login</Link></li>
                  <li><Link to="/register">Register</Link></li> */}
                  <li>
                    <button onClick={handleLogin} className="nav-button login-button">
                      Login (Demo)
                    </button>
                  </li>
                </>
              )}

              {/* Cross-Project Context: Link to the Real-time Markdown Previewer */}
              {/* This simulates an interconnected microservice architecture.
                  Assuming the Markdown Previewer runs on a different port or domain. */}
              <li>
                <a
                  href="http://localhost:3001" // Placeholder URL for the Markdown Previewer service
                  target="_blank"             // Open in a new tab
                  rel="noopener noreferrer"   // Security best practice for target="_blank"
                  className="nav-button external-link"
                  title="Go to Real-time Markdown Previewer"
                >
                  Markdown Previewer
                </a>
              </li>
            </ul>
          </nav>
        </header>

        {/* Main content area where routed components will be rendered */}
        <main className="app-main-content">
          <Routes>
            {/* Route for the Home Page */}
            {/* Pass authentication state and user info to HomePage if it needs to display user-specific content */}
            <Route path="/" element={<HomePage isAuthenticated={isAuthenticated} user={user} />} />

            {/* Placeholder routes for other pages to be implemented */}
            {/* <Route path="/recipes/:id" element={<RecipeDetailPage />} /> */}
            {/* <Route path="/recipes/new" element={isAuthenticated ? <AddRecipePage /> : <LoginPage />} /> */}
            {/* <Route path="/my-recipes" element={isAuthenticated ? <MyRecipesPage /> : <LoginPage />} /> */}
            {/* <Route path="/login" element={<LoginPage onLogin={handleLogin} />} /> */}
            {/* <Route path="/register" element={<RegisterPage />} /> */}

            {/* Catch-all route for any unmatched URLs (404 Not Found) */}
            {/* <Route path="*" element={<NotFoundPage />} /> */}
          </Routes>
        </main>

        {/* Application Footer */}
        <footer className="app-footer">
          <p>&copy; {new Date().getFullYear()} Personal Recipe Book. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
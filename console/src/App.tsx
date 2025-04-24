import { useContext } from "react";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import NavBar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Profile from "./pages/Profile";
import DirectMessages from "./pages/DirectMessages";
import Landing from "./pages/Landing";
import { UserContext } from "./UserContext";
import ProfileWrapper from "./pages/ProfileWrapper";
import ErrorPage from "./pages/ErrorPage";
import Login from "./pages/Login";

function App() {
  const userContext = useContext(UserContext);

  if (!userContext || userContext.isLoading) {
    return <div>Loading user info...</div>;
  }
  
  // Check if user is logged in
  const isLoggedIn = !!userContext.user;

  return (
    <Router>
      {isLoggedIn ? (
        // Show the main app when user is logged in
        <div>
          <NavBar />
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
            </ul>
          </nav>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            
            {/* Default route for the logged in user*/}
            <Route path="/profile" element={<Profile />} />

            {/* Dynamic profile route for other users */}
            <Route path="/:username" element={<ProfileWrapper />} />

            {/* Error page route */}
            <Route path="/error" element={<ErrorPage />} />

            <Route path="/direct-messages" element={<DirectMessages />} />
            {/* Redirect to home if user tries to access landing page while logged in */}
            <Route path="/landing" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      ) : (
        // Show landing page when user is not logged in
        <Routes>
          <Route path="/landing" element={<Landing/>} />
          {/* Redirect to landing page for all other routes when not logged in */}
          <Route path="*" element={<Navigate to="/landing" replace />} />
          <Route path="/login" element={<Login  />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
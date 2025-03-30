import { useContext } from "react";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import NavBar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Profile from "./pages/Profile";
import DirectMessages from "./pages/DirectMessages";
import Landing from "./pages/Landing";
import { UserContext } from "./UserContext";

function App() {
  const userContext = useContext(UserContext);
  if (!userContext) {
    return <div>Error: UserContext is not provided</div>;
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
            <Route path="/profile" element={<Profile />} />
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
        </Routes>
      )}
    </Router>
  );
}

export default App;
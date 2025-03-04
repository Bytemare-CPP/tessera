import { useContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import About from "./pages/About";
import { UserContext } from "./UserContext";

function App() {
  const userContext = useContext(UserContext);
  if (!userContext) {
    return <div>Error: UserContext is not provided</div>;
  }
  const { user, login, logout } = userContext;

  return (
    <Router>
      <div>
        <NavBar />
        <div className="pt-20"> {/* Add padding to account for the fixed NavBar height */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
          <div>
            {user ? (
              <div>
                <p>Welcome, {user.name}</p>
                <button onClick={logout}>Logout</button>
              </div>
            ) : (
              <button onClick={login}>Login with Google</button>
            )}
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
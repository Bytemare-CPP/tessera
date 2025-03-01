import { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import Home from './pages/Home';
import About from './pages/About';
import Nav from './pages/Nav';
import { UserContext } from './UserContext';

function App() {
  const userContext = useContext(UserContext);
  if (!userContext) {
    return <div>Error: UserContext is not provided</div>;
  }
  const { user, login, logout } = userContext;

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/Nav">Nav</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path = "/Nav" element = {<Nav/>}/>
        </Routes>
      </div>
      <div>
        {user ? (
          <div>
            <p>Welcome, {user.name}</p>
            <button onClick={logout}>Logout</button>
          </div>
        ) : (
          <button onClick={login}>
            Login with Google
          </button>
        )}
      </div>
    </Router>
  );
}

export default App;
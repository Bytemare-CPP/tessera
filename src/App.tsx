import { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes,  } from 'react-router-dom';
import NavBar from './components/Navbar';

import { UserContext } from './UserContext';

function App() {
  const userContext = useContext(UserContext);
  if (!userContext) {
    return <div>Error: UserContext is not provided</div>;
  }
  // const { user, login, logout } = userContext;

  return (
  <div>
    <Router>
      <div>
      <NavBar />  
      </div>
      {/* <div>
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
      </div> */}
    </Router>

    
    </div>
  );
}

export default App;
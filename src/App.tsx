import { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes,  } from 'react-router-dom';
import NavBar from './components/Navbar';
import Register from './pages/Register';
import Login from "./pages/Login";
function App() {

  // const { user, login, logout } = userContext;

  return (
  <div>
   <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
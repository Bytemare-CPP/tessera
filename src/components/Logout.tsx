import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded">
      Log out
    </button>
  );
};

export default Logout;

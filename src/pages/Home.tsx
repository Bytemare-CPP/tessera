import { useAuth } from "../hooks/useAuth";
import Logout from "../components/Logout";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-4">Welcome, {user?.displayName}!</h1>
      <img src={user?.photoURL || ""} alt="Profile" className="rounded-full w-24 h-24 mb-4" />
      <Logout />
    </div>
  );
};

export default Home;

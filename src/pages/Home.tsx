import { useAuth } from "../hooks/useAuth";

const Home = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-4">Welcome, {user?.displayName}!</h1>
      <img src={user?.photoURL || ""} alt="Profile" className="rounded-full w-24 h-24 mb-4" />
      <button
        onClick={logout}
        className="bg-red-500 text-white p-2 rounded"
      >
        Log out
      </button>
    </div>
  );
};

export default Home;

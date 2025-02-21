import { useAuth } from "../hooks/useAuth";

const LoginPage = () => {
  const { signInWithGoogle } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-4">Sign in to Tessera</h1>
      <button
        onClick={signInWithGoogle}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default LoginPage;

import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const { signInWithGoogle } = useAuth();

  return (
    <button onClick={signInWithGoogle} className="bg-blue-500 text-white p-2 rounded">
      Sign in with Google
    </button>
  );
};

export default Login;

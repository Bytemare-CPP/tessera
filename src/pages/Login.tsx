import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';

// Define error interfaces
interface SupabaseError {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
}

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const userContext = useContext(UserContext);

  // Check if user is already logged in and redirect accordingly
  useEffect(() => {
    if (userContext?.user) {
      if (userContext.needsOnboarding) {
        // If user needs to complete their profile, redirect to onboarding
        navigate('/onboarding');
      } else {
        // Otherwise go to home
        navigate('/home');
      }
    }
  }, [userContext?.user, userContext?.needsOnboarding, navigate]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setError('');
    
    try {
      if (!userContext?.loginWithEmail) {
        throw new Error('Login method not available');
      }
      
      await userContext.loginWithEmail(email, password);
      
      // Redirect will happen in the useEffect above when user context updates
    } catch (error: unknown) {
      // Type guard for error handling
      if (error instanceof Error) {
        setError(error.message || 'Failed to login');
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        // Handle Supabase-specific errors
        setError((error as SupabaseError).message || 'Failed to login');
      } else {
        setError('Failed to login');
      }
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    try {
      if (userContext?.loginWithGoogle) {
        setError('');
        await userContext.loginWithGoogle();
        // Google auth will redirect and handle the flow
        // After redirect back, UserContext will check if onboarding is needed
      }
    } catch (error: unknown) {
      // Type guard for error handling
      if (error instanceof Error) {
        setError(error.message || 'Failed to login with Google');
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        // Handle Supabase-specific errors
        setError((error as SupabaseError).message || 'Failed to login with Google');
      } else {
        setError('Failed to login with Google');
      }
      console.error('Google login error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAE8E0] to-[#FDF7F4] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-[#424242] mb-6">
          Welcome Back
        </h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-[#E7A691] focus:outline-none text-black"
              required
              placeholder="your@email.com"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-[#E7A691] focus:outline-none text-black"
              required
              placeholder="Enter your password"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E7A691] hover:bg-[#D8957F] text-gray py-2 rounded font-medium transition-colors"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-3 bg-white text-gray-500 text-sm">or</span>
          </div>
        </div>
        
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center bg-white border border-gray-300 text-gray py-2 rounded hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>
        
        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{' '}
          <button 
            onClick={() => navigate('/register')} 
            className="text-white font-medium hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
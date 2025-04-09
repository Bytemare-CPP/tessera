import { createContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from './supabaseClient'; // Ensure this points to your Supabase client setup

// Define the User interface to match DB schema
interface User {
  user_id: string;
  full_name: string;
  avatar_url: string;
  is_active: boolean;
}

// Define what's available in the context
interface UserContextType {
  user: User | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

// Create the context with undefined default value
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Listen for auth state changes
    const { data: subscription } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { id, user_metadata } = session.user;
        setUser({
          user_id: id,
          full_name: user_metadata.full_name || 'Anonymous',
          avatar_url: user_metadata.avatar_url || '',
          is_active: true,
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.subscription?.unsubscribe();
    };
  }, []);

  const login = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
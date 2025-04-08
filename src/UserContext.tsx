import { createContext, useState, useEffect, ReactNode } from 'react';

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
  login: (userData?: User) => void;
  logout: () => void;
  isLoading: boolean;
}

// Create the context with undefined default value
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Placeholder login function
  const login = (userData?: User) => {
    // If userData is provided, use it; otherwise use default mock data
    const mockUser: User = userData || {
      user_id: 'mock-user-123',
      full_name: 'Demo User',
      avatar_url: 'https://via.placeholder.com/150',
      is_active: true
    };
    
    console.log('Logging in with user:', mockUser);
    
    // Update state
    setUser(mockUser);
    
    // Store in localStorage
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  // Placeholder logout function
  const logout = () => {
    console.log('Logging out user');
    
    // Clear state
    setUser(null);
    
    // Clear localStorage
    localStorage.removeItem('user');
  };

  // Provide the context value
  return (
    <UserContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
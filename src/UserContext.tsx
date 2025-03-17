// import { createContext, useState, useEffect, ReactNode } from 'react';


// interface User {
//   id: string;
//   name: string;
//   email: string;
// }

// interface UserContextType {
//   user: User | null;
//   login: () => void;
//   logout: () => void;
// }

// const UserContext = createContext<UserContextType | undefined>(undefined);

// const UserProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);

//   useEffect(() => {
//     const storedUser = localStorage.getItem('user');
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   const login = async () => {
//     try {
//       const result = await signInWithGoogle();
//       const userData = {
//         id: result.user.uid,
//         name: result.user.displayName || '',
//         email: result.user.email || ''
//       };
//       setUser(userData);
//       localStorage.setItem('user', JSON.stringify(userData));
//     } catch (error) {
//       console.error('Error logging in with Google:', error);
//     }
//   };

//   const logout = async () => {
//     try {
//       await signOutFromGoogle();
//       setUser(null);
//       localStorage.removeItem('user');
//     } catch (error) {
//       console.error('Error logging out:', error);
//     }
//   };

//   return (
//     <UserContext.Provider value={{ user, login, logout }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export { UserContext, UserProvider };
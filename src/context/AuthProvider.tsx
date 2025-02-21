import { useEffect, useState, ReactNode } from "react";
import { auth } from "../firebaseConfig";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
  setPersistence,
  browserSessionPersistence,
  onAuthStateChanged, // Ensure this is imported
} from "firebase/auth";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const configureAuthPersistence = async () => {
      try {
        await setPersistence(auth, browserSessionPersistence);
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
        });
        return unsubscribe;
      } catch (error) {
        console.error("Auth Persistence Error:", error);
      }
    };

    const unsubscribePromise = configureAuthPersistence();

    return () => {
      unsubscribePromise.then((unsubscribe) => {
        if (unsubscribe) unsubscribe();
      });
    };
  }, []); // ✅ Empty dependency array, since `auth` is imported at the top

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

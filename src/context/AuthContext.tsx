import { auth, db } from "@/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

interface ExtendedUser extends User {
  userId: string;
}

interface AuthContextType {
  user: ExtendedUser | null;
  setUser: (user: ExtendedUser | null) => void;
  isSeller: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [isSeller, setIsSeller] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({ ...user, userId: userData.userId });
          setIsSeller(userData.isSeller);
        }
      } else {
        setUser(null);
        setIsSeller(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  //const value: AuthContextType = { user, setUser };

  return (
    <AuthContext.Provider value={{ user, setUser, isSeller }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("error");
  }
  return context;
};

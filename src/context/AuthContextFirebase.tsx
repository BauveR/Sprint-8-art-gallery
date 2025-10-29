import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../config/firebase";

export type UserRole = "admin" | "user";

export interface User {
  uid: string;
  email: string;
  role: UserRole;
  name: string;
}

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
  getIdToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Escuchar cambios en el estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Obtener el rol desde Custom Claims del token
        let role: UserRole = "user";
        try {
          const idTokenResult = await firebaseUser.getIdTokenResult();
          role = (idTokenResult.claims.role as UserRole) || "user";
          console.log("[Auth] User role from token:", role);
        } catch (error) {
          console.error("[Auth] Error getting token claims:", error);
          // Fallback: si el email es admin@gallery.com, asignar admin
          if (firebaseUser.email === "admin@gallery.com") {
            role = "admin";
          }
        }

        const userData: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || "",
          role: role,
          name: firebaseUser.displayName || firebaseUser.email || "User",
        };
        setUser(userData);
        setFirebaseUser(firebaseUser);
      } else {
        setUser(null);
        setFirebaseUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // El listener onAuthStateChanged actualizará el estado automáticamente
    } catch (error: any) {
      console.error("Error al iniciar sesión:", error);
      throw new Error(error.message || "Error al iniciar sesión");
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Error al iniciar sesión con Google:", error);
      throw new Error(error.message || "Error al iniciar sesión con Google");
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Opcionalmente actualizar el nombre del usuario
      // await updateProfile(userCredential.user, { displayName: name });
    } catch (error: any) {
      console.error("Error al registrarse:", error);
      throw new Error(error.message || "Error al registrarse");
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error("Error al cerrar sesión:", error);
      throw new Error(error.message || "Error al cerrar sesión");
    }
  };

  const getIdToken = async (): Promise<string | null> => {
    if (!firebaseUser) return null;
    try {
      const token = await firebaseUser.getIdToken();
      return token;
    } catch (error) {
      console.error("Error obteniendo token:", error);
      return null;
    }
  };

  const value = {
    user,
    firebaseUser,
    login,
    loginWithGoogle,
    register,
    logout,
    isAuthenticated: !!user,
    loading,
    getIdToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}

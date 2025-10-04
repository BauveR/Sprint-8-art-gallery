import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "admin" | "user";

export interface User {
  email: string;
  role: UserRole;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // Simulación de login - en producción esto haría una llamada al API
    // Admin: admin@gallery.com / admin123
    // User: user@gallery.com / user123

    if (email === "admin@gallery.com" && password === "admin123") {
      setUser({
        email: "admin@gallery.com",
        role: "admin",
        name: "Admin User"
      });
    } else if (email === "user@gallery.com" && password === "user123") {
      setUser({
        email: "user@gallery.com",
        role: "user",
        name: "Regular User"
      });
    } else {
      throw new Error("Credenciales inválidas");
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}

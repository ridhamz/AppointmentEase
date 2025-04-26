
import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { authService } from "../services/api";

// Define the user type
interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "professional" | "client";
}

// Define the auth context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking authentication status...");
        const currentUser = authService.getCurrentUser();
        if (currentUser && currentUser._id) {
          console.log("User found in localStorage:", currentUser);
          setUser({
            _id: currentUser._id,
            name: currentUser.name,
            email: currentUser.email,
            role: currentUser.role,
          });
        } else {
          console.log("No user found in localStorage");
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        authService.logout();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const userData = await authService.login(email, password);
      console.log("Login successful, user data:", userData);
      setUser({
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
      });
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Register function
  const register = async (
    name: string, 
    email: string, 
    password: string, 
    role: string
  ): Promise<boolean> => {
    try {
      setLoading(true);
      const userData = await authService.register(name, email, password, role);
      console.log("Registration successful, user data:", userData);
      setUser({
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
      });
      return true;
    } catch (error) {
      console.error("Registration failed:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Logout function
  const logout = () => {
    console.log("Logging out user");
    authService.logout();
    setUser(null);
  };
  
  const value = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    loading,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};

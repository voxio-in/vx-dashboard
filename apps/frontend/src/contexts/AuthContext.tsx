import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { apiClient } from "@/api/axios";
import { IAuthUser } from "@vx/shared";

interface AuthContextType {
  user: IAuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: IAuthUser | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IAuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await apiClient.get("/auth/me");
        setUser(res.data.data.user);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMe();
  }, []);

  const logout = async () => {
    await apiClient.post("/auth/logout");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        setUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

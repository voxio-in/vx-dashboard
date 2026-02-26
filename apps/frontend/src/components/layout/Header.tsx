import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

export const Header = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-background">
      <div className="text-sm text-muted-foreground">
        Welcome back,{" "}
        <span className="text-foreground font-medium">{user?.name}</span>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="text-sm px-3 py-1.5 rounded-md border border-white/10 hover:bg-white/5"
        >
          {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
        </button>
        <div className="text-xs px-2 py-1 rounded-full bg-white/10 text-white uppercase tracking-wide">
          {user?.role}
        </div>
        <button
          onClick={logout}
          className="text-sm text-red-400 hover:text-red-300"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

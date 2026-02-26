import { createRootRoute, Outlet, redirect } from "@tanstack/react-router";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";

export const Route = createRootRoute({
  beforeLoad: ({ location }) => {
    if (location.pathname === "/") {
      throw redirect({ to: "/login" as any });
    }
  },
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-2">404</h1>
        <p className="text-muted-foreground mb-4">Page not found</p>
        <a href="/login" className="text-white underline">
          Go to Login
        </a>
      </div>
    </div>
  ),
  component: () => (
    <ThemeProvider>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </ThemeProvider>
  ),
});

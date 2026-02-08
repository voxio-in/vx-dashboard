"use client";

import { useState, useEffect, Suspense } from "react"; // Import Suspense
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/features/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";

// 1. Rename your main logic to something like "LoginContent" or "LoginForm"
function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();

  // You ARE using useSearchParams here, which caused the build error
  const searchParams = useSearchParams();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isTokenLogin, setIsTokenLogin] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleTokenLogin = async (token: string) => {
    setIsTokenLogin(true);
    setError("");
    try {
      const res = await fetch("/api/auth/token-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Token login failed");
      }
      if (data.success && data.user) {
        login(data.user);
        window.history.replaceState({}, "", "/login");
        switch (data.user.role) {
          case "admin":
            router.push("/admin/dashboard");
            break;
          case "reseller":
            router.push("/reseller/dashboard");
            break;
          case "user":
          default:
            router.push("/dashboard");
            break;
        }
      }
    } catch (err: any) {
      console.error("Token login error:", err);
      setError(err.message || "Automatic login failed");
      setIsTokenLogin(false);
      router.replace("/login");
    }
  };

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      handleTokenLogin(token);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Login failed. Please check credentials."
        );
      }

      if (data.success && data.user) {
        login(data.user);

        switch (data.user.role) {
          case "admin":
            router.push("/admin/dashboard");
            break;
          case "reseller":
            router.push("/reseller/dashboard");
            break;
          case "user":
          default:
            router.push("/dashboard");
            break;
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isTokenLogin) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <div className="space-y-2">
            <p className="text-lg font-medium">
              Authenticating your account...
            </p>
            <p className="text-sm text-muted-foreground">
              Please wait while we log you in
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden lg:flex lg:w-1/2 bg-slate-50 dark:bg-slate-900 items-center justify-center p-12 border-r border-slate-200 dark:border-slate-800">
        <div className="relative w-full max-w-2xl">
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 shadow-2xl p-6 transform rotate-1 transition hover:rotate-0 duration-500">
            <div className="space-y-4">
              <div className="flex gap-4 mb-8">
                <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
                <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/3 animate-pulse"></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-24 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse delay-75"
                  ></div>
                ))}
              </div>
              <div className="h-48 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse delay-150"></div>
            </div>
          </div>
          <div className="absolute -z-10 top-10 -right-10 w-full h-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-3xl"></div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground">
              Enter your username to access your account.
            </p>
          </div>

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-md flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 flex-shrink-0"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" x2="12" y1="8" y2="12" />
                <line x1="12" x2="12.01" y1="16" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
                autoComplete="username"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>

              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer p-1"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <Eye className="h-5 w-5" />
                  ) : (
                    <EyeOff className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full h-11 text-base"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

// 2. Export a default component that wraps the logic in Suspense
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen w-full items-center justify-center bg-background">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

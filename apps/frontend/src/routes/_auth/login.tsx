import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useLoginMutation } from "@/hooks/mutations/useLoginMutation";
import { useAuth } from "@/contexts/AuthContext";
import { Role, ROLE_LEVEL } from "@vx/shared";

export const Route = createFileRoute("/_auth/login")({
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { mutate, isPending } = useLoginMutation();
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    mutate(
      { email, password },
      {
        onSuccess: (data) => {
          const user = data.data.user;
          setUser(user);

          // Redirect based on role
          const role = user.role as Role;
          if (ROLE_LEVEL[role] >= ROLE_LEVEL[Role.SUPERADMIN]) {
            window.location.href = "/superadmin";
          } else if (ROLE_LEVEL[role] >= ROLE_LEVEL[Role.ADMIN]) {
            window.location.href = "/admin";
          } else if (ROLE_LEVEL[role] >= ROLE_LEVEL[Role.RESELLER]) {
            window.location.href = "/reseller";
          } else {
            window.location.href = "/user";
          }
        },
        onError: (err: any) => {
          setError(err.response?.data?.message || "Login failed");
        },
      },
    );
  };

  return (
    <div className="w-full max-w-md p-8 rounded-xl border border-white/10 bg-white/5 backdrop-blur">
      <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
      <p className="text-muted-foreground text-sm mb-8">
        Sign in to your account
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}
        <div>
          <label className="block text-sm text-muted-foreground mb-1.5">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/30"
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1.5">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/30"
            placeholder="••••••••"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2.5 rounded-lg bg-white text-black text-sm font-medium hover:bg-white/90 disabled:opacity-50 transition-colors"
        >
          {isPending ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useLoginMutation } from "@/hooks/mutations/useLoginMutation";
import { useAuth } from "@/contexts/AuthContext";
import { Role, ROLE_LEVEL } from "@vx/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield } from "lucide-react";

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
    <div className="w-full max-w-md px-4">
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold">VX Dashboard</span>
        </div>
      </div>

      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

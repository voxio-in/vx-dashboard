"use client";

import Link from "next/link";
import { useAuth } from "@/features/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  ArrowRight,
  LayoutDashboard,
  ShieldCheck,
  Users,
} from "lucide-react";

export default function Home() {
  const { user, isLoading } = useAuth();

  const getDashboardLink = () => {
    if (!user) return "/login";
    switch (user.role) {
      case "admin":
        return "/admin/dashboard";
      case "reseller":
        return "/reseller/panel";
      default:
        return "/dashboard";
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Navbar */}
      <header className="flex h-16 items-center justify-between border-b px-6 lg:px-12">
        <div className="flex items-center gap-2 font-bold text-xl">
          <div className="h-8 w-8 bg-primary rounded-lg"></div>
          <span>BrandName</span>
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
          <a href="#" className="hover:text-foreground">
            Features
          </a>
          <a href="#" className="hover:text-foreground">
            Pricing
          </a>
          <a href="#" className="hover:text-foreground">
            About
          </a>
        </nav>
        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="h-9 w-24 bg-slate-100 dark:bg-slate-800 animate-pulse rounded"></div>
          ) : user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium hidden sm:inline">
                Hi, {user.name || user.email}
              </span>
              <Button asChild variant="default">
                <Link href={getDashboardLink()}>
                  Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/login">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto flex max-w-[980px] flex-col items-center gap-4 py-24 text-center md:py-32 px-6">
          <div className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium">
            🚀 The All-in-One Solution for your Business
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Scale your business with{" "}
            <span className="text-primary">Confidence</span>
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground md:text-xl">
            The platform designed for Admins, Resellers, and Users. Manage data,
            track sales, and grow your audience seamlessly.
          </p>

          <div className="flex gap-4 mt-6">
            {isLoading ? (
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            ) : user ? (
              <Button size="lg" className="h-12 px-8 text-lg" asChild>
                <Link href={getDashboardLink()}>
                  Go to {user.role.charAt(0).toUpperCase() + user.role.slice(1)}{" "}
                  Dashboard
                </Link>
              </Button>
            ) : (
              <Button size="lg" className="h-12 px-8 text-lg" asChild>
                <Link href="/login">
                  Start Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </section>

        <section className="container mx-auto px-6 py-12 lg:py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 border rounded-xl bg-card">
              <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Secure Auth</h3>
              <p className="text-muted-foreground">
                Enterprise-grade security with HttpOnly cookies and JWT tokens.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 border rounded-xl bg-card">
              <div className="h-12 w-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Role Management</h3>
              <p className="text-muted-foreground">
                Dedicated portals for Admins, Resellers, and Standard Users.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 border rounded-xl bg-card">
              <div className="h-12 w-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
                <LayoutDashboard className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Scalable Architecture</h3>
              <p className="text-muted-foreground">
                Built on Next.js 15, TypeScript, and MongoDB for maximum
                performance.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>
          &copy; {new Date().getFullYear()} BrandName Inc. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

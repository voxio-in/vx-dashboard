import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "../components/ui/button";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-center">
      <div className="space-y-6 p-10">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Welcome to <span className="text-blue-600">Voxio</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-[600px]">
          The ultimate AI Agent SaaS Platform. Build, manage, and resell
          intelligent chatbots.
        </p>

        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link to="/login">Login</Link>
          </Button>

          <Button asChild variant="outline" size="lg">
            <Link to="/register">Create Account</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

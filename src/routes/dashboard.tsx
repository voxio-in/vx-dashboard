import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart3,
  Bot,
  CreditCard,
  FileSearch,
  Key,
  Mic,
  Settings,
  Shield,
  UserCog,
  Users,
  Volume2,
  Workflow,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { SuperAdminLayout } from "../components/layouts/SuperAdminLayout";
import { DEFAULT_ALLOWED_FEATURES, DEFAULT_SIDEBAR_CONFIG } from "@/lib/abac";
import type { ABACUser } from "@/lib/abac";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

const stats = [
  { label: "Total Users", value: "1,284", note: "All resellers combined" },
  { label: "Active Resellers", value: "36", note: "Across 12 regions" },
  { label: "Monthly Usage", value: "92.4K", note: "Conversations handled" },
  { label: "Platform Health", value: "99.98%", note: "Last 30 days" },
];

const superAdminControls = [
  {
    title: "Admins",
    description: "Create and manage platform admins.",
    icon: Shield,
  },
  {
    title: "Resellers",
    description: "Provision partners and set limits.",
    icon: Users,
  },
  {
    title: "Users",
    description: "View and support all customer accounts.",
    icon: UserCog,
  },
  {
    title: "System Settings",
    description: "Global configuration and feature flags.",
    icon: Settings,
  },
  {
    title: "Billing",
    description: "Manage plans, subscriptions, and revenue.",
    icon: CreditCard,
  },
  {
    title: "API Keys",
    description: "Rotate keys and control access.",
    icon: Key,
  },
  {
    title: "Audit Logs",
    description: "Track sensitive changes and access.",
    icon: FileSearch,
  },
  {
    title: "Analytics",
    description: "Platform-wide usage and performance.",
    icon: BarChart3,
  },
];

const platformModules = [
  {
    title: "Flows",
    description: "Orchestrate multi-step automations.",
    icon: Workflow,
  },
  {
    title: "Agents",
    description: "Build and tune AI agent behavior.",
    icon: Bot,
  },
  {
    title: "STT Configuration",
    description: "Speech-to-text providers and models.",
    icon: Mic,
  },
  {
    title: "TTS Configuration",
    description: "Text-to-speech voices and tuning.",
    icon: Volume2,
  },
];

const superAdminUser: ABACUser = {
  id: "superadmin@voxio.ai",
  role: "super_admin",
  allowedFeatures: DEFAULT_ALLOWED_FEATURES.super_admin,
  allowedComponents: [],
  sidebarConfig: DEFAULT_SIDEBAR_CONFIG.super_admin,
};

function DashboardPage() {
  return (
    <SuperAdminLayout user={superAdminUser}>
      <div className="mx-auto w-full max-w-6xl px-6 py-10 space-y-10">
        <header className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Super Admin
          </p>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Platform Command Center
            </h1>
            <p className="text-muted-foreground">
              A quick look at the entire Voxio platform and every super admin
              capability.
            </p>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="bg-white/80 dark:bg-slate-900/60">
              <CardHeader className="pb-2">
                <CardDescription>{stat.label}</CardDescription>
                <CardTitle className="text-2xl">{stat.value}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{stat.note}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Super Admin Controls</h2>
            <p className="text-sm text-muted-foreground">
              Full access to platform governance and data.
            </p>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/70 px-6 py-4">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Manage all platform services in one place
              </p>
              <p className="text-xs text-muted-foreground">
                Jump into the Services page to configure core modules.
              </p>
            </div>
            <Button asChild>
              <Link to="/services">Go to Services</Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {superAdminControls.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.title}
                  className="bg-white/90 dark:bg-slate-900/70"
                >
                  <CardHeader className="space-y-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="text-base">
                        {item.title}
                      </CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Platform Modules</h2>
            <p className="text-sm text-muted-foreground">
              Core systems only super admins can configure today.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {platformModules.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.title}
                  className="bg-white/90 dark:bg-slate-900/70"
                >
                  <CardHeader className="space-y-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="text-base">
                        {item.title}
                      </CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </section>
      </div>
    </SuperAdminLayout>
  );
}

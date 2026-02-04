import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Bot,
  FileSearch,
  Key,
  Mic,
  Settings,
  Volume2,
  Workflow,
} from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { SuperAdminLayout } from "../components/layouts/SuperAdminLayout";
import { DEFAULT_ALLOWED_FEATURES, DEFAULT_SIDEBAR_CONFIG } from "@/lib/abac";
import type { ABACUser } from "@/lib/abac";

export const Route = createFileRoute("/services")({
  component: ServicesPage,
});

const superAdminUser: ABACUser = {
  id: "superadmin@voxio.ai",
  role: "super_admin",
  allowedFeatures: DEFAULT_ALLOWED_FEATURES.super_admin,
  allowedComponents: [],
  sidebarConfig: DEFAULT_SIDEBAR_CONFIG.super_admin,
};

const services = [
  {
    title: "Flows",
    description: "Orchestrate multi-step automations and guardrails.",
    icon: Workflow,
  },
  {
    title: "Agents",
    description: "Define personalities, models, and system prompts.",
    icon: Bot,
  },
  {
    title: "STT Configuration",
    description: "Manage speech-to-text providers and model presets.",
    icon: Mic,
  },
  {
    title: "TTS Configuration",
    description: "Tune text-to-speech voices and quality tiers.",
    icon: Volume2,
  },
  {
    title: "API Keys",
    description: "Rotate platform keys and scope permissions.",
    icon: Key,
  },
  {
    title: "Audit Logs",
    description: "Monitor sensitive actions across the platform.",
    icon: FileSearch,
  },
  {
    title: "System Settings",
    description: "Global limits, plans, and platform toggles.",
    icon: Settings,
  },
];

function ServicesPage() {
  return (
    <SuperAdminLayout user={superAdminUser}>
      <div className="mx-auto w-full max-w-6xl px-6 py-10 space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Services
          </h1>
          <p className="text-muted-foreground">
            Each super admin capability is separated here for faster access.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Card
                key={service.title}
                className="bg-white/90 dark:bg-slate-900/70"
              >
                <CardHeader className="space-y-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-base">
                      {service.title}
                    </CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </section>
      </div>
    </SuperAdminLayout>
  );
}

import * as React from "react";
import type { ABACUser } from "@/lib/abac";
import { Sidebar } from "./Sidebar";

type SuperAdminLayoutProps = {
  user: ABACUser;
  children: React.ReactNode;
};

export function SuperAdminLayout({ user, children }: SuperAdminLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950 text-foreground">
      <div className="flex min-h-screen">
        <Sidebar user={user} />
        <div className="flex min-h-screen flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 px-6 py-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Super Admin Console
              </p>
              <p className="text-lg font-semibold text-foreground">
                Welcome back
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  Super Admin
                </p>
                <p className="text-xs text-muted-foreground">{user.id}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800" />
            </div>
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}

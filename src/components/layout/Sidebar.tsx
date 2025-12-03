"use client";

import { useAuth } from "@/features/auth/AuthProvider";
import { BarChart3, Workflow, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const { logout } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => pathname.includes(path);

  return (
    <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shadow-sm z-30 h-screen">
      <div className="p-8 pb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-9 w-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md">
            <BarChart3 className="h-5 w-5" />
          </div>
          <h2 className="font-bold text-xl tracking-tight text-slate-900 dark:text-slate-100">
            Analytics
          </h2>
        </div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1 mb-2">
          Dashboard
        </p>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        <Link href="/reseller/panel">
          <Button
            variant={isActive("/reseller") ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start gap-3 h-12 text-sm font-semibold mb-2 transition-all",
              isActive("/reseller")
                ? "bg-indigo-50 text-indigo-900 dark:bg-indigo-900/20 dark:text-indigo-200"
                : "text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
          >
            <Workflow className="h-5 w-5" />
            <span>Flows</span>
          </Button>
        </Link>

        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-12 text-sm font-semibold text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Button>
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-12 text-sm font-bold text-slate-700 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
          onClick={logout}
        >
          <LogOut className="h-5 w-5" />
          Log Out
        </Button>
      </div>
    </aside>
  );
}

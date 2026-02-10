"use client";

import { useAuth } from "@/features/auth/AuthProvider";
import { LayoutDashboard, Workflow, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUnsavedChangesContext } from "@/context/UnsavedChangesContext";
import Image from "next/image";
import logo from "../../../public/logo.png";

export default function Sidebar() {
  const { logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const { proceedWithAction } = useUnsavedChangesContext();

  const isActive = (path: string) => {
    if (path === "/reseller/dashboard") {
      return (
        pathname === "/reseller/dashboard" ||
        pathname.startsWith("/reseller/dashboard/")
      );
    }
    if (path === "/reseller/panel") {
      return (
        pathname === "/reseller/panel" ||
        pathname.startsWith("/reseller/panel/")
      );
    }
    return pathname.includes(path);
  };

  const handleNavigation = (path: string) => {
    proceedWithAction(() => {
      router.push(path);
    });
  };

  return (
    <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shadow-lg z-30 h-screen">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex justify-center">
          <Image
            src={logo}
            alt="TM Capabara"
            width={120}
            height={40}
            className="h-auto w-auto object-contain"
            priority
          />
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        <Button
          variant={isActive("/reseller/dashboard") ? "secondary" : "ghost"}
          onClick={() => handleNavigation("/reseller/dashboard")}
          className={cn(
            "w-full justify-start gap-3 h-12 text-sm font-semibold transition-all cursor-pointer",
            isActive("/reseller/dashboard")
              ? "bg-indigo-50 text-indigo-900 dark:bg-indigo-900/20 dark:text-indigo-200"
              : "text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800",
          )}
        >
          <LayoutDashboard className="h-5 w-5" />
          <span>Dashboard</span>
        </Button>
        <Button
          variant={isActive("/reseller/panel") ? "secondary" : "ghost"}
          onClick={() => handleNavigation("/reseller/panel")}
          className={cn(
            "w-full justify-start gap-3 h-12 text-sm font-semibold mb-2 transition-all cursor-pointer",
            isActive("/reseller/panel")
              ? "bg-indigo-50 text-indigo-900 dark:bg-indigo-900/20 dark:text-indigo-200"
              : "text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800",
          )}
        >
          <Workflow className="h-5 w-5" />
          <span>Flows</span>
        </Button>
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-12 text-sm font-bold text-slate-700 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
          onClick={() => proceedWithAction(logout)}
        >
          <LogOut className="h-5 w-5" />
          Log Out
        </Button>
      </div>
    </aside>
  );
}

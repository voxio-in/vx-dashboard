import * as React from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { abac } from "@/lib/abac";
import type { ABACUser, MenuItem } from "@/lib/abac";

type SidebarProps = {
  user: ABACUser;
};

function isActive(pathname: string, item?: MenuItem) {
  if (!item?.path) return false;
  if (item.path === "/") return pathname === "/";
  return pathname.startsWith(item.path);
}

export function Sidebar({ user }: SidebarProps) {
  const location = useLocation();
  const items = React.useMemo(() => abac.getVisibleMenuItems(user), [user]);

  return (
    <aside className="w-64 bg-white/90 dark:bg-slate-900/80 border-r border-slate-200 dark:border-slate-800 px-4 py-6">
      <div className="flex items-center gap-3 px-2 pb-6">
        <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-sm font-semibold">
          VX
        </div>
        <div>
          <p className="text-sm font-semibold">Voxio</p>
          <p className="text-xs text-muted-foreground">Super Admin</p>
        </div>
      </div>

      <nav className="space-y-1">
        {items.map((item) => {
          const active = isActive(location.pathname, item);
          return (
            <Link
              key={item.id}
              to={item.path ?? "/dashboard"}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                active
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

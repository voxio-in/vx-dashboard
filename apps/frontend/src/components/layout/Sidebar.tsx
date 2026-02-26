import { Link } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { Role, ROLE_LEVEL } from "@vx/shared";

const navItems = [
  { label: "Dashboard", path: "/dashboard", minRole: Role.USER },
  { label: "Admins", path: "/superadmin/admins", minRole: Role.SUPERADMIN },
  {
    label: "Resellers",
    path: "/superadmin/resellers",
    minRole: Role.SUPERADMIN,
  },
  { label: "All Users", path: "/superadmin/users", minRole: Role.SUPERADMIN },
  { label: "Users", path: "/admin/users", minRole: Role.ADMIN },
  { label: "My Users", path: "/reseller/users", minRole: Role.RESELLER },
  { label: "Flows", path: "/user/flows", minRole: Role.USER },
  {
    label: "UI Config",
    path: "/superadmin/ui-config",
    minRole: Role.SUPERADMIN,
  },
];

export const Sidebar = () => {
  const { user } = useAuth();

  const visibleItems = navItems.filter(
    (item) => user && ROLE_LEVEL[user.role as Role] >= ROLE_LEVEL[item.minRole],
  );

  return (
    <aside className="w-64 h-screen border-r border-white/10 flex flex-col bg-background">
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <span className="text-xl font-bold text-white">VX Dashboard</span>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {visibleItems.map((item) => (
          <Link
            key={item.path}
            to={item.path as any}
            className="block px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-white hover:bg-white/5 transition-colors [&.active]:bg-white/10 [&.active]:text-white"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10">
        <p className="text-xs text-muted-foreground">{user?.email}</p>
        <p className="text-xs text-white/40 uppercase mt-0.5">{user?.role}</p>
      </div>
    </aside>
  );
};

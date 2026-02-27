import { Link } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { Role, ROLE_LEVEL, UI_REGISTRY } from "@vx/shared";
import { Configurable } from "@/components/shared/Configurable";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Shield,
  Workflow,
  Settings,
  ChevronRight,
  BookOpen,
  BarChart2,
  Bot,
} from "lucide-react";
import { cn } from "@/utils/cn";

interface NavItem {
  label: string;
  path: string;
  minRole: Role;
  icon: any;
  componentId: string;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    minRole: Role.USER,
    icon: LayoutDashboard,
    componentId: UI_REGISTRY.SIDEBAR_DASHBOARD,
  },
  {
    label: "Admins",
    path: "/superadmin/admins",
    minRole: Role.SUPERADMIN,
    icon: Shield,
    componentId: UI_REGISTRY.SIDEBAR_ADMINS,
  },
  {
    label: "Resellers",
    path: "/superadmin/resellers",
    minRole: Role.SUPERADMIN,
    icon: UserCheck,
    componentId: UI_REGISTRY.SIDEBAR_RESELLERS,
  },
  {
    label: "All Users",
    path: "/superadmin/users",
    minRole: Role.SUPERADMIN,
    icon: Users,
    componentId: UI_REGISTRY.SIDEBAR_ALL_USERS,
  },
  {
    label: "UI Config",
    path: "/superadmin/ui-config",
    minRole: Role.SUPERADMIN,
    icon: Settings,
    componentId: UI_REGISTRY.SIDEBAR_UI_CONFIG,
  },
  {
    label: "Users",
    path: "/admin/users",
    minRole: Role.ADMIN,
    icon: Users,
    componentId: UI_REGISTRY.SIDEBAR_USERS,
  },
  {
    label: "Flows",
    path: "/admin/flows",
    minRole: Role.ADMIN,
    icon: Workflow,
    componentId: UI_REGISTRY.SIDEBAR_FLOWS,
  },
  {
    label: "Sessions",
    path: "/admin/sessions",
    minRole: Role.ADMIN,
    icon: BookOpen,
    componentId: UI_REGISTRY.SIDEBAR_SESSIONS,
  },
  {
    label: "My Users",
    path: "/reseller/users",
    minRole: Role.RESELLER,
    icon: Users,
    componentId: UI_REGISTRY.SIDEBAR_MY_USERS,
  },
  {
    label: "My Flows",
    path: "/reseller/flows",
    minRole: Role.RESELLER,
    icon: Workflow,
    componentId: UI_REGISTRY.SIDEBAR_FLOWS,
  },
  {
    label: "Sessions",
    path: "/reseller/sessions",
    minRole: Role.RESELLER,
    icon: BookOpen,
    componentId: UI_REGISTRY.SIDEBAR_SESSIONS,
  },
];

export const Sidebar = () => {
  const { user } = useAuth();

  const userRoleLevel = user ? ROLE_LEVEL[user.role as Role] : 0;

  // Filter by role — only show items the user's role can access
  // SuperAdmin sees only superadmin items, Admin sees only admin items, etc.
  const visibleItems = navItems.filter((item) => {
    const itemLevel = ROLE_LEVEL[item.minRole];
    // exact role match for cleaner sidebar
    // SuperAdmin sees superadmin items, Admin sees admin items, etc.
    if (user?.role === Role.SUPERADMIN) {
      return item.minRole === Role.SUPERADMIN || item.minRole === Role.USER;
    }
    if (user?.role === Role.ADMIN) {
      return item.minRole === Role.ADMIN;
    }
    if (user?.role === Role.RESELLER) {
      return item.minRole === Role.RESELLER;
    }
    if (user?.role === Role.USER) {
      return item.minRole === Role.USER;
    }
    return false;
  });

  const initials = user?.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();

  return (
    <aside className="w-64 h-screen border-r border-border flex flex-col bg-background shrink-0">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <Bot className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-base font-semibold">VX Dashboard</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          return (
            <Configurable key={item.path} componentId={item.componentId as any}>
              <Link
                to={item.path as any}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors group",
                  "text-muted-foreground hover:text-foreground hover:bg-accent",
                  "[&.active]:bg-accent [&.active]:text-foreground [&.active]:font-medium",
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1">{item.label}</span>
                <ChevronRight className="w-3 h-3 opacity-0 group-[.active]:opacity-60 transition-opacity" />
              </Link>
            </Configurable>
          );
        })}
      </nav>

      {/* User info at bottom */}
      <Separator />
      <div className="p-4 flex items-center gap-3 shrink-0">
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium truncate">{user?.name}</p>
          <Badge variant="outline" className="text-xs capitalize mt-0.5">
            {user?.role}
          </Badge>
        </div>
      </div>
    </aside>
  );
};
